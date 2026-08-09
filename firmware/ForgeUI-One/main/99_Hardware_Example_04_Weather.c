#include "00_ForgeUI_Hardware_Example.h"

#if FG_HARDWARE_EXAMPLE_04_ENABLED

#include "99_Hardware_Example_04_Weather.h"
#include "00_ForgeUI_Config.h"
#include "30_WIFI.h"
#include "90_Studio_Export.h"
#include "bsp/esp-bsp.h"
#include "cJSON.h"
#include "esp_crt_bundle.h"
#include "esp_http_client.h"
#include "esp_heap_caps.h"
#include "esp_log.h"
#include "esp_sntp.h"
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/semphr.h"
#include "freertos/task.h"
#include "lwip/inet.h"
#include <math.h>
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define FG_WEATHER_RESPONSE_CAPACITY 1024
#define FG_WEATHER_REFRESH_MS (15U * 60U * 1000U)
#define FG_WEATHER_RETRY_MS (60U * 1000U)
#define FG_WEATHER_MIN_DMA_FREE 8192U
#define FG_WEATHER_MIN_DMA_LARGEST 4096U

static const char *TAG = "FG_WEATHER";

typedef struct {
    char data[FG_WEATHER_RESPONSE_CAPACITY];
    size_t used;
    bool overflow;
    int64_t request_started_us;
    bool tls_connected;
} fg_weather_response_t;

static uint32_t elapsed_ms(int64_t started_us)
{
    return (uint32_t)((esp_timer_get_time() - started_us) / 1000);
}

static bool dns_preflight(void)
{
    const int64_t dns_started = esp_timer_get_time();
    struct addrinfo hints = { .ai_family = AF_INET, .ai_socktype = SOCK_STREAM };
    struct addrinfo *resolved = NULL;
    const int dns_result = getaddrinfo("api.open-meteo.com", "443", &hints, &resolved);
    if (dns_result != 0 || resolved == NULL) {
        ESP_LOGW(TAG, "DNS failed result=%d ms=%u", dns_result, (unsigned)elapsed_ms(dns_started));
        if (resolved != NULL) freeaddrinfo(resolved);
        return false;
    }
    char address_text[INET_ADDRSTRLEN] = "?";
    const struct sockaddr_in *ipv4 = (const struct sockaddr_in *)resolved->ai_addr;
    inet_ntop(AF_INET, &ipv4->sin_addr, address_text, sizeof(address_text));
    freeaddrinfo(resolved);
    ESP_LOGI(TAG, "DNS resolved ip=%s ms=%u", address_text, (unsigned)elapsed_ms(dns_started));
    return true;
}

static fg_weather_location_t s_location = {
    .name = "Tauranga",
    .region = "Bay of Plenty",
    .country = "New Zealand",
    .timezone = "Pacific/Auckland",
    .timezone_posix = "NZST-12NZDT,M9.5.0,M4.1.0/3",
    .latitude = -37.6878,
    .longitude = 176.1651,
};
static fg_weather_snapshot_t s_snapshot = { .status = "Waiting for Wi-Fi" };
static SemaphoreHandle_t s_lock;
static bool s_started;
static bool s_time_started;
static bool s_time_synchronized;
static bool s_fallback_time_reported;
static time_t s_last_displayed_minute;
static bool s_request_in_flight;
static uint32_t s_request_count;
static char s_visual_background_key[48];

static void log_memory_state(const char *stage)
{
    ESP_LOGI(TAG,
             "mem[%s] int=%u/%u dma=%u/%u 8bit=%u/%u psram=%u stack=%u",
             stage,
             (unsigned)heap_caps_get_free_size(MALLOC_CAP_INTERNAL),
             (unsigned)heap_caps_get_largest_free_block(MALLOC_CAP_INTERNAL),
             (unsigned)heap_caps_get_free_size(MALLOC_CAP_DMA),
             (unsigned)heap_caps_get_largest_free_block(MALLOC_CAP_DMA),
             (unsigned)heap_caps_get_free_size(MALLOC_CAP_8BIT),
             (unsigned)heap_caps_get_largest_free_block(MALLOC_CAP_8BIT),
             (unsigned)heap_caps_get_free_size(MALLOC_CAP_SPIRAM),
             (unsigned)uxTaskGetStackHighWaterMark(NULL));
}

static bool weather_has_sdio_headroom(void)
{
    const size_t free_dma = heap_caps_get_free_size(MALLOC_CAP_DMA);
    const size_t largest_dma = heap_caps_get_largest_free_block(MALLOC_CAP_DMA);
    if (free_dma >= FG_WEATHER_MIN_DMA_FREE && largest_dma >= FG_WEATHER_MIN_DMA_LARGEST) {
        return true;
    }
    ESP_LOGW(TAG, "HTTPS deferred: SDIO DMA headroom %u/%u below %u/%u",
             (unsigned)free_dma, (unsigned)largest_dma,
             (unsigned)FG_WEATHER_MIN_DMA_FREE,
             (unsigned)FG_WEATHER_MIN_DMA_LARGEST);
    return false;
}

static void copy_status(const char *status)
{
    if (s_lock != NULL && xSemaphoreTake(s_lock, pdMS_TO_TICKS(100)) == pdTRUE) {
        snprintf(s_snapshot.status, sizeof(s_snapshot.status), "%s", status);
        xSemaphoreGive(s_lock);
    }
}

static esp_err_t response_event(esp_http_client_event_t *event)
{
    fg_weather_response_t *response = event->user_data;
    if (response != NULL && event->event_id == HTTP_EVENT_ON_CONNECTED && !response->tls_connected) {
        response->tls_connected = true;
        ESP_LOGI(TAG, "TLS connected ms=%u", (unsigned)elapsed_ms(response->request_started_us));
    }
    if (event->event_id != HTTP_EVENT_ON_DATA || response == NULL || event->data_len <= 0) {
        return ESP_OK;
    }
    const size_t available = sizeof(response->data) - response->used - 1U;
    const size_t incoming = (size_t)event->data_len;
    if (incoming > available) {
        response->overflow = true;
        return ESP_FAIL;
    }
    memcpy(response->data + response->used, event->data, incoming);
    response->used += incoming;
    response->data[response->used] = '\0';
    return ESP_OK;
}

static bool read_number(cJSON *object, const char *name, float *value)
{
    cJSON *item = cJSON_GetObjectItemCaseSensitive(object, name);
    if (!cJSON_IsNumber(item) || !isfinite(item->valuedouble)) return false;
    *value = (float)item->valuedouble;
    return true;
}

static bool read_first_epoch(cJSON *object, const char *name, int64_t *value)
{
    cJSON *values = cJSON_GetObjectItemCaseSensitive(object, name);
    cJSON *item = cJSON_IsArray(values) ? cJSON_GetArrayItem(values, 0) : NULL;
    if (!cJSON_IsNumber(item) || !isfinite(item->valuedouble)) return false;
    *value = (int64_t)item->valuedouble;
    return true;
}

static bool fetch_current_conditions(const fg_weather_location_t *location,
                                     fg_weather_snapshot_t *snapshot)
{
    fg_weather_response_t response = {0};
    if (!dns_preflight()) return false;
    char request_url[512];
    const int url_length = snprintf(
        request_url, sizeof(request_url),
        "https://api.open-meteo.com/v1/forecast?latitude=%.6f&longitude=%.6f&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,is_day&daily=sunrise,sunset&timeformat=unixtime&forecast_days=1&timezone=auto&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm",
        location->latitude, location->longitude);
    if (url_length < 0 || (size_t)url_length >= sizeof(request_url)) {
        ESP_LOGW(TAG, "request URL exceeds bounded buffer");
        return false;
    }
    log_memory_state("before-client");
    const esp_http_client_config_t config = {
        .url = request_url,
        .event_handler = response_event,
        .user_data = &response,
        .crt_bundle_attach = esp_crt_bundle_attach,
        .timeout_ms = 10000,
        .buffer_size = 512,
    };
    esp_http_client_handle_t client = esp_http_client_init(&config);
    if (client == NULL) {
        ESP_LOGW(TAG, "HTTP client initialization failed");
        return false;
    }

    ESP_LOGI(TAG, "requesting current weather");
    log_memory_state("before-perform");
    response.request_started_us = esp_timer_get_time();
    const esp_err_t result = esp_http_client_perform(client);
    const int status = esp_http_client_get_status_code(client);
    ESP_LOGI(TAG, "HTTP %d ms=%u", status, (unsigned)elapsed_ms(response.request_started_us));
    esp_http_client_cleanup(client);
    if (result != ESP_OK || status != 200 || response.overflow) {
        ESP_LOGW(TAG, "request failed: %s%s", esp_err_to_name(result),
                 response.overflow ? " (response too large)" : "");
        log_memory_state("after-failed-cleanup");
        return false;
    }

    cJSON *root = cJSON_ParseWithLength(response.data, response.used);
    cJSON *current = root == NULL ? NULL : cJSON_GetObjectItemCaseSensitive(root, "current");
    cJSON *daily = root == NULL ? NULL : cJSON_GetObjectItemCaseSensitive(root, "daily");
    float is_day = 0.0f;
    float weather_code = 0.0f;
    const bool valid = current != NULL &&
        read_number(current, "temperature_2m", &snapshot->current_temperature_c) &&
        read_number(current, "apparent_temperature", &snapshot->apparent_temperature_c) &&
        read_number(current, "relative_humidity_2m", &snapshot->relative_humidity_percent) &&
        read_number(current, "wind_speed_10m", &snapshot->wind_speed_kmh) &&
        read_number(current, "precipitation", &snapshot->precipitation_mm) &&
        read_number(current, "weather_code", &weather_code) &&
        read_number(current, "is_day", &is_day) &&
        daily != NULL &&
        read_first_epoch(daily, "sunrise", &snapshot->sunrise_unix) &&
        read_first_epoch(daily, "sunset", &snapshot->sunset_unix);
    if (valid) {
        snapshot->weather_code = (int)lroundf(weather_code);
        snapshot->is_day = is_day >= 0.5f;
        snapshot->current_conditions_valid = true;
    }
    cJSON_Delete(root);
    if (!valid) ESP_LOGW(TAG, "response missing required numeric current conditions");
    return valid;
}

static const char *condition_text(int code)
{
    if (code == 0) return "CLEAR SKY";
    if (code == 1 || code == 2) return "PARTLY CLOUDY";
    if (code == 3) return "OVERCAST";
    if (code == 45 || code == 48) return "FOG";
    if (code >= 51 && code <= 57) return "DRIZZLE";
    if (code == 65 || code == 82) return "HEAVY RAIN";
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 81)) return "RAIN";
    if (code >= 71 && code <= 77) return "SNOW";
    if (code >= 85 && code <= 86) return "SNOW SHOWERS";
    if (code >= 95 && code <= 99) return "THUNDERSTORM";
    return "CURRENT WEATHER";
}

static const char *weather_background_key(int code, bool is_day)
{
    if (code == 0) return is_day ? "weather.clear.day" : "weather.clear.night";
    if (code == 1 || code == 2) return is_day ? "weather.partly_cloudy.day" : "weather.partly_cloudy.night";
    if (code == 3) return "weather.overcast";
    if (code == 45 || code == 48) return "weather.fog";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
        return is_day ? "weather.rain.day" : "weather.rain.night";
    }
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "weather.snow";
    if (code >= 95 && code <= 99) return "weather.thunderstorm";
    return is_day ? "weather.partly_cloudy.day" : "weather.partly_cloudy.night";
}

static void publish_weather_visual_state(int weather_code, bool is_day)
{
    const char *key = weather_background_key(weather_code, is_day);
    if (strcmp(s_visual_background_key, key) == 0) return;
    if (!bsp_display_lock(0)) {
        ESP_LOGW(TAG, "display lock unavailable; visual update deferred");
        return;
    }
    FG_Set_Weather_Background_Key(key);
    bsp_display_unlock();
    snprintf(s_visual_background_key, sizeof(s_visual_background_key), "%s", key);
    ESP_LOGI(TAG, "Weather visual state: condition=%d day=%d background=%s",
             weather_code, is_day, key);
}

static void publish_current_conditions(const fg_weather_snapshot_t *snapshot)
{
    char temperature[16];
    char feels_like[32];
    char humidity[32];
    char wind[32];
    char rain[32];
    snprintf(temperature, sizeof(temperature), "%.0f\xC2\xB0", (double)snapshot->current_temperature_c);
    snprintf(feels_like, sizeof(feels_like), "Feels like %.0f\xC2\xB0", (double)snapshot->apparent_temperature_c);
    snprintf(humidity, sizeof(humidity), "HUMIDITY %.0f%%", (double)snapshot->relative_humidity_percent);
    snprintf(wind, sizeof(wind), "WIND %.0f km/h", (double)snapshot->wind_speed_kmh);
    snprintf(rain, sizeof(rain), "RAIN %.1f mm", (double)snapshot->precipitation_mm);
    if (bsp_display_lock(0)) {
        FG_Set_Weather_Temperature_Text(temperature);
        FG_Set_Weather_Condition_Text(condition_text(snapshot->weather_code));
        FG_Set_Weather_Feels_Like_Text(feels_like);
        FG_Set_Weather_Humidity_Text(humidity);
        FG_Set_Weather_Wind_Text(wind);
        FG_Set_Weather_Rain_Text(rain);
        bsp_display_unlock();
        ESP_LOGI(TAG, "current conditions applied");
    } else {
        ESP_LOGW(TAG, "display lock unavailable; update deferred");
    }
    publish_weather_visual_state(snapshot->weather_code, snapshot->is_day);
}

static void start_network_time(const fg_weather_location_t *location)
{
    if (setenv("TZ", location->timezone_posix, 1) == 0) tzset();
    ESP_LOGI("FG_TIME", "timezone=%s", location->timezone);
    if (s_time_started) return;
    esp_sntp_setoperatingmode(SNTP_OPMODE_POLL);
    esp_sntp_setservername(0, "pool.ntp.org");
    esp_sntp_init();
    s_time_started = true;
    ESP_LOGI("FG_TIME", "SNTP synchronization started");
}

static void update_local_time(void)
{
    time_t now;
    struct tm local_time;
    time(&now);
    localtime_r(&now, &local_time);
    if (local_time.tm_year < (2024 - 1900)) return;
    const bool network_synchronized =
        esp_sntp_get_sync_status() == SNTP_SYNC_STATUS_COMPLETED;
    if (network_synchronized && !s_time_synchronized) {
        s_time_synchronized = true;
        ESP_LOGI("FG_TIME", "synchronized");
    } else if (!network_synchronized && !s_fallback_time_reported) {
        s_fallback_time_reported = true;
        ESP_LOGI("FG_TIME", "fallback time available");
    }
    const time_t minute = now / 60;
    if (minute == s_last_displayed_minute) return;
    s_last_displayed_minute = minute;
    fg_weather_snapshot_t visual_snapshot = {0};
    if (fg_weather_get_snapshot(&visual_snapshot) && visual_snapshot.current_conditions_valid &&
        visual_snapshot.sunrise_unix > 0 && visual_snapshot.sunset_unix > visual_snapshot.sunrise_unix) {
        const bool local_is_day = now >= visual_snapshot.sunrise_unix && now < visual_snapshot.sunset_unix;
        if (s_lock != NULL && xSemaphoreTake(s_lock, pdMS_TO_TICKS(100)) == pdTRUE) {
            s_snapshot.is_day = local_is_day;
            xSemaphoreGive(s_lock);
        }
        publish_weather_visual_state(visual_snapshot.weather_code, local_is_day);
    }
    char date[40];
    char time_text[24];
    char weekday[16];
    char month[16];
    strftime(weekday, sizeof(weekday), "%A", &local_time);
    strftime(month, sizeof(month), "%B", &local_time);
    snprintf(date, sizeof(date), "%s %d %s", weekday, local_time.tm_mday, month);
    strftime(time_text, sizeof(time_text), "%I:%M %p", &local_time);
    if (time_text[0] == '0') memmove(time_text, time_text + 1, strlen(time_text));
    for (char *p = date; *p != '\0'; ++p) if (*p >= 'a' && *p <= 'z') *p -= ('a' - 'A');
    if (bsp_display_lock(0)) {
        FG_Set_Weather_Date_Text(date);
        FG_Set_Weather_Time_Text(time_text);
        bsp_display_unlock();
        ESP_LOGI("FG_TIME", "local=%s %s", date, time_text);
    }
}

static void weather_task(void *argument)
{
    (void)argument;
    bool reported_ready = false;
    TickType_t next_attempt = 0;
    for (;;) {
        fg_wifi_snapshot_t wifi = {0};
        const bool connected = fg_wifi_get_snapshot(&wifi) == FG_WIFI_OP_OK &&
                               wifi.ready && wifi.connected;
        const TickType_t now = xTaskGetTickCount();
        if (!connected) {
            reported_ready = false;
            copy_status("Waiting for Wi-Fi");
        } else {
            if (!reported_ready) {
                ESP_LOGI(TAG, "Wi-Fi ready");
                reported_ready = true;
                next_attempt = now + pdMS_TO_TICKS(1500);
            }
            if ((int32_t)(now - next_attempt) >= 0) {
                if (s_request_count > 0) log_memory_state("before-retry");
                if (s_request_in_flight) {
                    ESP_LOGW(TAG, "request already in flight; retry deferred");
                    next_attempt = now + pdMS_TO_TICKS(FG_WEATHER_RETRY_MS);
                    continue;
                }
                fg_weather_location_t location;
                if (!fg_weather_get_location(&location)) {
                    copy_status("Location unavailable");
                    next_attempt = now + pdMS_TO_TICKS(FG_WEATHER_RETRY_MS);
                    continue;
                }
                ESP_LOGI(TAG, "location=%s", location.name);
                start_network_time(&location);
                if (!weather_has_sdio_headroom()) {
                    copy_status("Waiting for SDIO DMA headroom");
                    next_attempt = now + pdMS_TO_TICKS(FG_WEATHER_RETRY_MS);
                    continue;
                }
                fg_weather_snapshot_t fetched = {0};
                s_request_in_flight = true;
                ++s_request_count;
                const bool fetched_ok = fetch_current_conditions(&location, &fetched);
                s_request_in_flight = false;
                if (fetched_ok) {
                    if (xSemaphoreTake(s_lock, pdMS_TO_TICKS(100)) == pdTRUE) {
                        fetched.valid = true;
                        fetched.last_success_ms = (uint32_t)(now * portTICK_PERIOD_MS);
                        snprintf(fetched.status, sizeof(fetched.status), "Current");
                        s_snapshot = fetched;
                        xSemaphoreGive(s_lock);
                    }
                    ESP_LOGI(TAG, "temperature=%.1f", (double)fetched.current_temperature_c);
                    ESP_LOGI(TAG, "apparent=%.1f", (double)fetched.apparent_temperature_c);
                    ESP_LOGI(TAG, "humidity=%.1f", (double)fetched.relative_humidity_percent);
                    ESP_LOGI(TAG, "wind=%.1f", (double)fetched.wind_speed_kmh);
                    ESP_LOGI(TAG, "precipitation=%.1f", (double)fetched.precipitation_mm);
                    ESP_LOGI(TAG, "weather_code=%d is_day=%d", fetched.weather_code, fetched.is_day);
                    publish_current_conditions(&fetched);
                    next_attempt = now + pdMS_TO_TICKS(FG_WEATHER_REFRESH_MS);
                } else {
                    copy_status("Fetch failed; retaining last value");
                    next_attempt = now + pdMS_TO_TICKS(FG_WEATHER_RETRY_MS);
                }
            }
        }
        update_local_time();
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

void fg_hardware_example_04_init(void)
{
    if (s_started) return;
    s_lock = xSemaphoreCreateMutex();
    if (s_lock == NULL) {
        ESP_LOGE(TAG, "snapshot mutex allocation failed");
        return;
    }
    s_started = xTaskCreate(weather_task, "fg_weather", 8192, NULL, 5, NULL) == pdPASS;
    if (!s_started) ESP_LOGE(TAG, "weather task creation failed");
}

bool fg_weather_get_location(fg_weather_location_t *location)
{
    if (location == NULL || s_lock == NULL || xSemaphoreTake(s_lock, pdMS_TO_TICKS(100)) != pdTRUE) return false;
    *location = s_location;
    xSemaphoreGive(s_lock);
    return true;
}

bool fg_weather_set_location(const fg_weather_location_t *location)
{
    if (location == NULL || location->name[0] == '\0' ||
        location->latitude < -90.0 || location->latitude > 90.0 ||
        location->longitude < -180.0 || location->longitude > 180.0 ||
        s_lock == NULL || xSemaphoreTake(s_lock, pdMS_TO_TICKS(100)) != pdTRUE) return false;
    s_location = *location;
    s_location.name[sizeof(s_location.name) - 1] = '\0';
    s_location.region[sizeof(s_location.region) - 1] = '\0';
    s_location.country[sizeof(s_location.country) - 1] = '\0';
    s_location.timezone[sizeof(s_location.timezone) - 1] = '\0';
    s_location.timezone_posix[sizeof(s_location.timezone_posix) - 1] = '\0';
    xSemaphoreGive(s_lock);
    return true;
}

bool fg_weather_get_snapshot(fg_weather_snapshot_t *snapshot)
{
    if (snapshot == NULL || s_lock == NULL || xSemaphoreTake(s_lock, pdMS_TO_TICKS(100)) != pdTRUE) return false;
    *snapshot = s_snapshot;
    xSemaphoreGive(s_lock);
    return true;
}

#endif
