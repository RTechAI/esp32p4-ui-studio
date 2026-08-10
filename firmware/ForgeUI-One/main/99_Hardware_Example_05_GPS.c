#include "99_Hardware_Example_05_GPS.h"

#include <ctype.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "driver/gpio.h"
#include "driver/uart.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "lvgl.h"
#include "90_Studio_Export.h"

#define FG_GPS_UART UART_NUM_1
#define FG_GPS_RX_GPIO GPIO_NUM_3
#define FG_GPS_TX_GPIO GPIO_NUM_4
#define FG_GPS_BAUD 9600
#define FG_GPS_LINE_CAP 128
#define FG_GPS_RAW_LINE_LIMIT 3
#define FG_GPS_UBX_PAYLOAD_CAP 256

static const char *TAG = "FG_GPS";
static portMUX_TYPE s_mux = portMUX_INITIALIZER_UNLOCKED;
static fg_gps_snapshot_t s_state;
static int64_t s_last_update_us;
static bool s_started;
static bool s_ui_started;

static const uint8_t s_ubx_mon_ver_poll[] = {
    0xB5, 0x62, 0x0A, 0x04, 0x00, 0x00, 0x0E, 0x34,
};

typedef enum {
    UBX_WAIT_SYNC1,
    UBX_WAIT_SYNC2,
    UBX_READ_CLASS,
    UBX_READ_ID,
    UBX_READ_LENGTH_LOW,
    UBX_READ_LENGTH_HIGH,
    UBX_READ_PAYLOAD,
    UBX_READ_CK_A,
    UBX_READ_CK_B,
} fg_ubx_state_t;

typedef struct {
    fg_ubx_state_t state;
    uint8_t message_class;
    uint8_t message_id;
    uint16_t payload_length;
    uint16_t payload_used;
    uint8_t ck_a;
    uint8_t ck_b;
    uint8_t received_ck_a;
    uint8_t payload[FG_GPS_UBX_PAYLOAD_CAP];
} fg_ubx_parser_t;

static void ubx_checksum_add(fg_ubx_parser_t *parser, uint8_t byte)
{
    parser->ck_a = (uint8_t)(parser->ck_a + byte);
    parser->ck_b = (uint8_t)(parser->ck_b + parser->ck_a);
}

static void copy_ubx_text(char *output, size_t output_size,
                          const uint8_t *input, size_t input_size)
{
    size_t used = 0;
    while (used + 1 < output_size && used < input_size && input[used]) {
        output[used] = isprint(input[used]) ? (char)input[used] : '.';
        ++used;
    }
    while (used > 0 && output[used - 1] == ' ') --used;
    output[used] = '\0';
}

static void handle_ubx_frame(fg_ubx_parser_t *parser, uint8_t received_ck_b)
{
    if (parser->message_class != 0x0A || parser->message_id != 0x04) return;
    if (parser->received_ck_a != parser->ck_a || received_ck_b != parser->ck_b) {
        ESP_LOGW("FG_GPS_TX", "UBX response checksum invalid");
        return;
    }
    ESP_LOGI("FG_GPS_TX", "MON-VER response valid");
    if (parser->payload_length >= 40 && parser->payload_length <= sizeof(parser->payload)) {
        char software[31];
        char hardware[11];
        copy_ubx_text(software, sizeof(software), parser->payload, 30);
        copy_ubx_text(hardware, sizeof(hardware), parser->payload + 30, 10);
        ESP_LOGI("FG_GPS_TX", "MON-VER SW=\"%s\" HW=\"%s\"", software, hardware);
    }
}

static bool consume_ubx_byte(fg_ubx_parser_t *parser, uint8_t byte)
{
    switch (parser->state) {
        case UBX_WAIT_SYNC1:
            if (byte != 0xB5) return false;
            parser->state = UBX_WAIT_SYNC2;
            return true;
        case UBX_WAIT_SYNC2:
            if (byte == 0x62) {
                parser->state = UBX_READ_CLASS;
                parser->ck_a = 0;
                parser->ck_b = 0;
                parser->payload_length = 0;
                parser->payload_used = 0;
                return true;
            }
            parser->state = byte == 0xB5 ? UBX_WAIT_SYNC2 : UBX_WAIT_SYNC1;
            return byte == 0xB5;
        case UBX_READ_CLASS:
            parser->message_class = byte;
            ubx_checksum_add(parser, byte);
            parser->state = UBX_READ_ID;
            return true;
        case UBX_READ_ID:
            parser->message_id = byte;
            ubx_checksum_add(parser, byte);
            parser->state = UBX_READ_LENGTH_LOW;
            return true;
        case UBX_READ_LENGTH_LOW:
            parser->payload_length = byte;
            ubx_checksum_add(parser, byte);
            parser->state = UBX_READ_LENGTH_HIGH;
            return true;
        case UBX_READ_LENGTH_HIGH:
            parser->payload_length |= (uint16_t)byte << 8;
            ubx_checksum_add(parser, byte);
            parser->state = parser->payload_length ? UBX_READ_PAYLOAD : UBX_READ_CK_A;
            return true;
        case UBX_READ_PAYLOAD:
            if (parser->payload_used < sizeof(parser->payload)) {
                parser->payload[parser->payload_used] = byte;
            }
            ++parser->payload_used;
            ubx_checksum_add(parser, byte);
            if (parser->payload_used == parser->payload_length) parser->state = UBX_READ_CK_A;
            return true;
        case UBX_READ_CK_A:
            parser->received_ck_a = byte;
            parser->state = UBX_READ_CK_B;
            return true;
        case UBX_READ_CK_B:
            handle_ubx_frame(parser, byte);
            parser->state = UBX_WAIT_SYNC1;
            return true;
    }
    parser->state = UBX_WAIT_SYNC1;
    return false;
}

static void send_mon_ver_poll(void)
{
    ESP_LOGI("FG_GPS_TX", "sending UBX MON-VER poll via GPIO4");
    int written = uart_write_bytes(FG_GPS_UART, s_ubx_mon_ver_poll,
                                   sizeof(s_ubx_mon_ver_poll));
    ESP_LOGI("FG_GPS_TX", "wrote %d bytes", written);
}

static bool checksum_ok(const char *line)
{
    if (line[0] != '$') return false;
    const char *star = strchr(line, '*');
    if (!star || strlen(star) != 3) return false;
    unsigned char sum = 0;
    for (const char *p = line + 1; p < star; ++p) sum ^= (unsigned char)*p;
    char *end = NULL;
    unsigned long expected = strtoul(star + 1, &end, 16);
    return end == star + 3 && *end == '\0' && sum == expected;
}

static int split_fields(char *line, char **fields, int capacity)
{
    int count = 0;
    for (char *p = line; count < capacity;) {
        fields[count++] = p;
        char *comma = strchr(p, ',');
        if (!comma) break;
        *comma = '\0';
        p = comma + 1;
    }
    return count;
}

static bool parse_utc(const char *s, uint8_t *h, uint8_t *m, uint8_t *sec)
{
    if (!s || strlen(s) < 6) return false;
    int hh = (s[0] - '0') * 10 + s[1] - '0';
    int mm = (s[2] - '0') * 10 + s[3] - '0';
    int ss = (s[4] - '0') * 10 + s[5] - '0';
    if (hh > 23 || mm > 59 || ss > 60) return false;
    *h = (uint8_t)hh; *m = (uint8_t)mm; *sec = (uint8_t)ss;
    return true;
}

static bool parse_coordinate(const char *value, const char *hemisphere, double *out)
{
    if (!value || !value[0] || !hemisphere || !hemisphere[0]) return false;
    char *end = NULL;
    double raw = strtod(value, &end);
    if (end == value || !isfinite(raw)) return false;
    int degrees = (int)(raw / 100.0);
    double result = degrees + (raw - degrees * 100.0) / 60.0;
    if (hemisphere[0] == 'S' || hemisphere[0] == 'W') result = -result;
    else if (hemisphere[0] != 'N' && hemisphere[0] != 'E') return false;
    *out = result;
    return true;
}

static void publish_sentence(char *line)
{
    char *star = strchr(line, '*');
    if (!star || strlen(line) < 6) return;
    *star = '\0';
    char *field[20];
    int count = split_fields(line, field, 20);
    const char *type = field[0] + 3;
    if ((strncmp(field[0], "$GN", 3) != 0 && strncmp(field[0], "$GP", 3) != 0)) return;

    bool old_fix;
    uint8_t old_sats;
    portENTER_CRITICAL(&s_mux);
    old_fix = s_state.fix_valid;
    old_sats = s_state.satellites;
    s_state.nmea_alive = true;
    s_last_update_us = esp_timer_get_time();
    if (!strcmp(type, "GGA") && count >= 10) {
        double lat, lon;
        int quality = atoi(field[6]);
        s_state.fix_valid = quality > 0;
        s_state.satellites = (uint8_t)atoi(field[7]);
        if (field[8][0]) s_state.hdop = strtof(field[8], NULL);
        if (field[9][0]) s_state.altitude_m = strtof(field[9], NULL);
        if (parse_coordinate(field[2], field[3], &lat)) s_state.latitude = lat;
        if (parse_coordinate(field[4], field[5], &lon)) s_state.longitude = lon;
        s_state.utc_valid = parse_utc(field[1], &s_state.utc_hour, &s_state.utc_minute, &s_state.utc_second);
    } else if (!strcmp(type, "RMC") && count >= 8) {
        double lat, lon;
        s_state.fix_valid = field[2][0] == 'A';
        if (parse_coordinate(field[3], field[4], &lat)) s_state.latitude = lat;
        if (parse_coordinate(field[5], field[6], &lon)) s_state.longitude = lon;
        if (field[7][0]) s_state.speed_kmh = strtof(field[7], NULL) * 1.852f;
        s_state.utc_valid = parse_utc(field[1], &s_state.utc_hour, &s_state.utc_minute, &s_state.utc_second);
    } else if (!strcmp(type, "GSA") && count >= 3) {
        int dimension = atoi(field[2]);
        if (dimension >= 1 && dimension <= 3) {
            s_state.fix_dimension = (uint8_t)dimension;
            s_state.fix_valid = dimension >= 2;
        }
    }
    bool new_fix = s_state.fix_valid;
    uint8_t new_sats = s_state.satellites;
    portEXIT_CRITICAL(&s_mux);
    if (new_fix != old_fix) ESP_LOGI(TAG, "fix %s", new_fix ? "acquired" : "lost");
    if (new_sats != old_sats) ESP_LOGI(TAG, "satellite count changed: %u", new_sats);
}

static void gps_task(void *arg)
{
    (void)arg;
    uint8_t rx[64];
    char line[FG_GPS_LINE_CAP];
    size_t used = 0;
    unsigned raw_lines = 0;
    bool first_rx = false, first_nmea = false, overflow = false;
    bool poll_sent = false;
    fg_ubx_parser_t ubx = {0};
    while (true) {
        int n = uart_read_bytes(FG_GPS_UART, rx, sizeof(rx), pdMS_TO_TICKS(100));
        if (n <= 0) continue;
        if (!first_rx) {
            first_rx = true;
            portENTER_CRITICAL(&s_mux); s_state.receiving = true; portEXIT_CRITICAL(&s_mux);
            ESP_LOGI(TAG, "UART RX alive");
        }
        for (int i = 0; i < n; ++i) {
            if (consume_ubx_byte(&ubx, rx[i])) continue;
            char ch = (char)rx[i];
            if (ch == '\r') continue;
            if (ch == '\n') {
                if (!overflow && used > 0) {
                    line[used] = '\0';
                    if (checksum_ok(line)) {
                        if (!first_nmea) { first_nmea = true; ESP_LOGI(TAG, "NMEA alive"); }
                        if (raw_lines < FG_GPS_RAW_LINE_LIMIT) ESP_LOGI(TAG, "NMEA %s", line);
                        ++raw_lines;
                        publish_sentence(line);
                        if (!poll_sent) {
                            poll_sent = true;
                            send_mon_ver_poll();
                        }
                    }
                }
                used = 0; overflow = false;
            } else if (!overflow) {
                if (used + 1 < sizeof(line)) line[used++] = ch;
                else { used = 0; overflow = true; }
            }
        }
    }
}

bool fg_gps_get_snapshot(fg_gps_snapshot_t *snapshot)
{
    if (!snapshot) return false;
    int64_t updated;
    portENTER_CRITICAL(&s_mux); *snapshot = s_state; updated = s_last_update_us; portEXIT_CRITICAL(&s_mux);
    snapshot->last_update_age_ms = updated ? (uint32_t)((esp_timer_get_time() - updated) / 1000) : UINT32_MAX;
    return true;
}

typedef struct {
    char uart[16];
    char nmea[16];
    char fix[16];
    char satellites[16];
    char latitude[32];
    char longitude[32];
    char altitude[24];
    char speed[24];
    char utc[24];
    char hdop[24];
} fg_gps_ui_cache_t;

static fg_gps_ui_cache_t s_ui_cache;
static bool s_log_state_valid;
static bool s_log_receiving;
static bool s_log_nmea;
static bool s_log_fix;
static uint8_t s_log_satellites;
static int64_t s_last_ui_log_us;

static void set_if_changed(char *cached, size_t capacity, const char *value,
                           void (*setter)(const char *))
{
    if (strncmp(cached, value, capacity) == 0) return;
    snprintf(cached, capacity, "%s", value);
    setter(cached);
}

static void ui_tick(lv_timer_t *timer)
{
    (void)timer;
    fg_gps_snapshot_t s;
    fg_gps_get_snapshot(&s);
    char value[32];
    set_if_changed(s_ui_cache.uart, sizeof(s_ui_cache.uart),
                   s.receiving ? "ALIVE" : "WAITING", FG_Set_GPS_UART_Text);
    set_if_changed(s_ui_cache.nmea, sizeof(s_ui_cache.nmea),
                   s.nmea_alive ? "ALIVE" : "WAITING", FG_Set_GPS_NMEA_Text);
    const char *fix_text = !s.fix_valid ? "NO FIX" :
                           s.fix_dimension >= 3 ? "3D FIX" :
                           s.fix_dimension == 2 ? "2D FIX" : "FIXED";
    set_if_changed(s_ui_cache.fix, sizeof(s_ui_cache.fix), fix_text, FG_Set_GPS_Fix_Text);
    snprintf(value, sizeof(value), "%u", s.satellites);
    set_if_changed(s_ui_cache.satellites, sizeof(s_ui_cache.satellites), value,
                   FG_Set_GPS_Satellites_Text);
    if (s.fix_valid) {
        snprintf(value, sizeof(value), "%.6f", s.latitude);
        set_if_changed(s_ui_cache.latitude, sizeof(s_ui_cache.latitude), value,
                       FG_Set_GPS_Latitude_Text);
        snprintf(value, sizeof(value), "%.6f", s.longitude);
        set_if_changed(s_ui_cache.longitude, sizeof(s_ui_cache.longitude), value,
                       FG_Set_GPS_Longitude_Text);
        snprintf(value, sizeof(value), "%.1f m", (double)s.altitude_m);
        set_if_changed(s_ui_cache.altitude, sizeof(s_ui_cache.altitude), value,
                       FG_Set_GPS_Altitude_Text);
        snprintf(value, sizeof(value), "%.1f km/h", (double)s.speed_kmh);
        set_if_changed(s_ui_cache.speed, sizeof(s_ui_cache.speed), value,
                       FG_Set_GPS_Speed_Text);
    } else {
        set_if_changed(s_ui_cache.latitude, sizeof(s_ui_cache.latitude), "--",
                       FG_Set_GPS_Latitude_Text);
        set_if_changed(s_ui_cache.longitude, sizeof(s_ui_cache.longitude), "--",
                       FG_Set_GPS_Longitude_Text);
        set_if_changed(s_ui_cache.altitude, sizeof(s_ui_cache.altitude), "--",
                       FG_Set_GPS_Altitude_Text);
        set_if_changed(s_ui_cache.speed, sizeof(s_ui_cache.speed), "--",
                       FG_Set_GPS_Speed_Text);
    }
    if (s.utc_valid) snprintf(value, sizeof(value), "%02u:%02u:%02u",
                              s.utc_hour, s.utc_minute, s.utc_second);
    else snprintf(value, sizeof(value), "--");
    set_if_changed(s_ui_cache.utc, sizeof(s_ui_cache.utc), value, FG_Set_GPS_UTC_Text);
    if (s.nmea_alive) snprintf(value, sizeof(value), "%.1f", (double)s.hdop);
    else snprintf(value, sizeof(value), "--");
    set_if_changed(s_ui_cache.hdop, sizeof(s_ui_cache.hdop), value, FG_Set_GPS_HDOP_Text);

    bool state_changed = !s_log_state_valid || s.receiving != s_log_receiving ||
                         s.nmea_alive != s_log_nmea || s.fix_valid != s_log_fix ||
                         s.satellites != s_log_satellites;
    int64_t now = esp_timer_get_time();
    if (state_changed && (!s_log_state_valid || now - s_last_ui_log_us >= 5000000)) {
        ESP_LOGI("FG_GPS_UI", "receiving=%u nmea=%u fix=%u sats=%u",
                 s.receiving, s.nmea_alive, s.fix_valid, s.satellites);
        s_log_receiving = s.receiving; s_log_nmea = s.nmea_alive;
        s_log_fix = s.fix_valid; s_log_satellites = s.satellites;
        s_log_state_valid = true; s_last_ui_log_us = now;
    }
}

void fg_hardware_example_05_init(void)
{
    if (s_started) return;
    ESP_LOGI(TAG, "startup begin");
    ESP_LOGI(TAG, "configuring UART1 RX GPIO3 TX GPIO4");

    const uart_config_t config = {
        .baud_rate = FG_GPS_BAUD, .data_bits = UART_DATA_8_BITS,
        .parity = UART_PARITY_DISABLE, .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE, .source_clk = UART_SCLK_DEFAULT,
    };
    ESP_ERROR_CHECK(uart_driver_install(FG_GPS_UART, 1024, 0, 0, NULL, 0));
    ESP_ERROR_CHECK(uart_param_config(FG_GPS_UART, &config));
    ESP_ERROR_CHECK(uart_set_pin(FG_GPS_UART, FG_GPS_TX_GPIO, FG_GPS_RX_GPIO,
                                 UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE));
    ESP_LOGI(TAG, "UART initialized (RX GPIO3 TX GPIO4, 9600 8N1)");
    if (xTaskCreate(gps_task, "fg_gps", 4096, NULL, 5, NULL) != pdPASS) {
        ESP_LOGE(TAG, "GPS task creation failed");
        return;
    }
    s_started = true;
    ESP_LOGI(TAG, "parser task started");
    ESP_LOGI(TAG, "startup complete");
}

void fg_hardware_example_05_ui_binding_init(void)
{
    if (s_ui_started) return;
    memset(&s_ui_cache, 0, sizeof(s_ui_cache));
    lv_timer_t *timer = lv_timer_create(ui_tick, 500, NULL);
    if (!timer) {
        ESP_LOGE("FG_GPS_UI", "binding timer creation failed");
        return;
    }
    s_ui_started = true;
    ESP_LOGI("FG_GPS_UI", "binding initialized");
    ui_tick(timer);
}
