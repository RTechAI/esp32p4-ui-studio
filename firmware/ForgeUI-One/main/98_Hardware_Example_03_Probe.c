/* Hardware Example 03: Elechouse PN532 V3, software SPI, ISO14443A. */
#include "98_Hardware_Example_03_Probe.h"
#include "90_Studio_Export.h"
#include "bsp/display.h"
#include "bsp/esp-bsp.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "esp_rom_sys.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <stdio.h>
#include <string.h>

#define NFC_RST GPIO_NUM_2
#define NFC_MOSI GPIO_NUM_28
#define NFC_MISO GPIO_NUM_29
#define NFC_SCK GPIO_NUM_30
#define NFC_CS GPIO_NUM_31
#define PN532_TO_HOST 0x03
#define PN532_HOST_TO_DEVICE 0x01

static const char *TAG = "HW_EXAMPLE_03";
static bool s_ready;

static uint8_t swspi_byte(uint8_t out) {
    uint8_t in = 0;
    for (unsigned bit = 0; bit < 8; ++bit) {
        gpio_set_level(NFC_MOSI, (out >> bit) & 1U); esp_rom_delay_us(1);
        gpio_set_level(NFC_SCK, 1);
        if (gpio_get_level(NFC_MISO)) in |= (uint8_t)(1U << bit);
        esp_rom_delay_us(1); gpio_set_level(NFC_SCK, 0);
    }
    return in;
}

static void transfer(const uint8_t *tx, uint8_t *rx, size_t n, unsigned lead_ms) {
    gpio_set_level(NFC_SCK, 0); gpio_set_level(NFC_CS, 0);
    if (lead_ms) vTaskDelay(pdMS_TO_TICKS(lead_ms));
    for (size_t i = 0; i < n; ++i) { uint8_t v = swspi_byte(tx ? tx[i] : 0); if (rx) rx[i] = v; }
    gpio_set_level(NFC_CS, 1);
}

static bool chip_ready(void) {
    const uint8_t tx[2] = {0x02, 0}; uint8_t rx[2] = {0};
    transfer(tx, rx, 2, 0); return (rx[1] & 1U) != 0;
}

static bool wait_ready(unsigned timeout_ms) {
    for (unsigned i = 0; i < timeout_ms; ++i) {
        if (chip_ready()) return true;
        vTaskDelay(pdMS_TO_TICKS(1));
    }
    return false;
}

static void read_raw(uint8_t *data, size_t n) {
    uint8_t tx[64] = {0}, rx[64] = {0}; tx[0] = PN532_TO_HOST;
    transfer(tx, rx, n + 1, 1); memcpy(data, rx + 1, n);
}

static bool send_command(uint8_t command, const uint8_t *params, size_t count) {
    uint8_t frame[32] = {PN532_HOST_TO_DEVICE, 0, 0, 0xFF};
    uint8_t len = (uint8_t)(count + 2), sum = (uint8_t)(0xD4 + command);
    frame[4] = len; frame[5] = (uint8_t)(0U - len); frame[6] = 0xD4; frame[7] = command;
    for (size_t i = 0; i < count; ++i) { frame[8 + i] = params[i]; sum = (uint8_t)(sum + params[i]); }
    frame[8 + count] = (uint8_t)(0U - sum); frame[9 + count] = 0;
    transfer(frame, NULL, count + 10, 2);
    if (!wait_ready(1000)) return false;
    uint8_t ack[6] = {0}; read_raw(ack, 6);
    return memcmp(ack, (uint8_t[]){0,0,0xFF,0,0xFF,0}, 6) == 0;
}

static bool read_response(uint8_t command, uint8_t *payload, size_t capacity, size_t *used) {
    uint8_t frame[48] = {0}; read_raw(frame, sizeof(frame));
    if (frame[0] || frame[1] || frame[2] != 0xFF || frame[3] < 2 ||
        (uint8_t)(frame[3] + frame[4]) != 0 || frame[5] != 0xD5 || frame[6] != command + 1) return false;
    size_t n = frame[3] - 2;
    if (n > capacity) return false;
    uint8_t sum = 0; for (size_t i = 0; i < frame[3]; ++i) sum = (uint8_t)(sum + frame[5 + i]);
    if ((uint8_t)(sum + frame[5 + frame[3]]) != 0) return false;
    memcpy(payload, frame + 7, n); *used = n; return true;
}

static bool command(uint8_t cmd, const uint8_t *params, size_t count,
                    uint8_t *payload, size_t capacity, size_t *used, unsigned timeout_ms) {
    return send_command(cmd, params, count) && wait_ready(timeout_ms) &&
           read_response(cmd, payload, capacity, used);
}

static bool firmware_version(uint8_t out[4]) {
    size_t used = 0; return command(0x02, NULL, 0, out, 4, &used, 1000) && used == 4 && out[0] == 0x32;
}

static void ui(const char *card, const char *uid, uint32_t count) {
    char reads[16]; snprintf(reads, sizeof(reads), "%lu", (unsigned long)count);
    bsp_display_lock(0);
    FG_Set_NFC_Device_Text(s_ready ? "READY" : "NOT READY");
    FG_Set_NFC_Interface_Text("SPI"); FG_Set_NFC_Card_Text(card);
    FG_Set_NFC_UID_Text(uid); FG_Set_NFC_Read_Count_Text(reads);
    bsp_display_unlock();
}

static void polling_task(void *arg) {
    (void)arg; bool pending = false, present = false; uint8_t last[10] = {0}, last_len = 0;
    uint32_t reads = 0; char uid_text[32];
    for (;;) {
        if (!pending) {
            const uint8_t params[] = {0x01, 0x00};
            if (!send_command(0x4A, params, sizeof(params))) {
                ESP_LOGW(TAG, "passive poll command/ACK failed"); vTaskDelay(pdMS_TO_TICKS(250)); continue;
            }
            pending = true;
        }
        if (!wait_ready(350)) {
            if (present) { present = false; ui("NONE", "--", reads); ESP_LOGI(TAG, "CARD NONE"); }
            continue;
        }
        uint8_t response[32] = {0}; size_t used = 0; pending = false;
        if (!read_response(0x4A, response, sizeof(response), &used) || used < 7 || response[0] == 0) continue;
        uint8_t uid_len = response[5];
        if (uid_len == 0 || uid_len > 10 || used < (size_t)(6 + uid_len)) continue;
        const uint8_t *uid = response + 6;
        bool logical_read = !present || uid_len != last_len || memcmp(uid, last, uid_len) != 0;
        size_t at = 0;
        for (unsigned i = 0; i < uid_len; ++i) at += (size_t)snprintf(uid_text + at, sizeof(uid_text) - at,
            i ? ":%02X" : "%02X", uid[i]);
        if (logical_read) {
            ++reads; memcpy(last, uid, uid_len); last_len = uid_len;
            ESP_LOGI(TAG, "CARD PRESENT UID=%s logical_read=%lu", uid_text, (unsigned long)reads);
        }
        present = true; ui("PRESENT", uid_text, reads);
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}

void fg_hardware_example_03_init(void) {
    const gpio_config_t outputs = {.pin_bit_mask=(1ULL<<NFC_RST)|(1ULL<<NFC_MOSI)|(1ULL<<NFC_SCK)|(1ULL<<NFC_CS), .mode=GPIO_MODE_OUTPUT};
    const gpio_config_t input = {.pin_bit_mask=1ULL<<NFC_MISO, .mode=GPIO_MODE_INPUT};
    ESP_ERROR_CHECK(gpio_config(&outputs)); ESP_ERROR_CHECK(gpio_config(&input));
    gpio_set_level(NFC_CS,1); gpio_set_level(NFC_SCK,0); gpio_set_level(NFC_MOSI,0);
    ui("NONE", "--", 0);
    gpio_set_level(NFC_RST,1); vTaskDelay(pdMS_TO_TICKS(2)); gpio_set_level(NFC_RST,0);
    vTaskDelay(pdMS_TO_TICKS(10)); gpio_set_level(NFC_RST,1); vTaskDelay(pdMS_TO_TICKS(10));
    uint8_t fw[4] = {0}; bool ok = firmware_version(fw);
    if (!ok) { vTaskDelay(pdMS_TO_TICKS(25)); ok = firmware_version(fw); }
    if (!ok) { ESP_LOGE(TAG,"STOP: PN532 identity gate failed"); ui("NONE","--",0); return; }
    ESP_LOGI(TAG,"IDENTIFIED PN532 IC=0x32 firmware=%u.%u support=0x%02X",fw[1],fw[2],fw[3]);
    uint8_t result[8]; size_t used = 0;
    const uint8_t sam[] = {0x01,0x14,0x01};
    if (!command(0x14,sam,sizeof(sam),result,sizeof(result),&used,1000)) { ESP_LOGE(TAG,"STOP: SAMConfig failed"); return; }
    const uint8_t retries[] = {0x05,0xFF,0x01,0xFF};
    if (!command(0x32,retries,sizeof(retries),result,sizeof(result),&used,1000)) { ESP_LOGE(TAG,"STOP: passive retries config failed"); return; }
    s_ready = true; ui("NONE","--",0); ESP_LOGI(TAG,"READY: SAMConfig PASS; ISO14443A polling started");
    xTaskCreate(polling_task,"pn532_poll",4096,NULL,5,NULL);
}
