#include "50_DIAGNOSTICS.h"

#include <stdio.h>
#include <string.h>

#include "30_WIFI.h"
#include "40_SD.h"
#include "esp_app_desc.h"
#include "esp_flash.h"
#include "esp_heap_caps.h"
#include "esp_timer.h"
#include "lvgl.h"
#include "sdkconfig.h"

static uint32_t g_ui_update_time_us;
static uint32_t g_tick_rate_hz;
static uint32_t g_previous_lv_tick;
static int64_t g_previous_tick_sample_us;

static size_t fg_diagnostics_count_objects(lv_obj_t *object)
{
    if (object == NULL) return 0;
    size_t count = 1;
    const uint32_t child_count = lv_obj_get_child_count(object);
    for (uint32_t index = 0; index < child_count; ++index) {
        count += fg_diagnostics_count_objects(lv_obj_get_child(object, (int32_t)index));
    }
    return count;
}

void fg_diagnostics_init(void)
{
    g_previous_lv_tick = lv_tick_get();
    g_previous_tick_sample_us = esp_timer_get_time();
}

void fg_diagnostics_record_ui_update_us(uint32_t elapsed_us)
{
    g_ui_update_time_us = elapsed_us;
}

void fg_diagnostics_get_snapshot(fg_diagnostics_snapshot_t *out)
{
    if (out == NULL) return;
    memset(out, 0, sizeof(*out));

    out->internal_free = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);
    out->internal_total = heap_caps_get_total_size(MALLOC_CAP_INTERNAL);
    out->internal_minimum_free = heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL);
    out->psram_free = heap_caps_get_free_size(MALLOC_CAP_SPIRAM);
    out->psram_total = heap_caps_get_total_size(MALLOC_CAP_SPIRAM);
    out->psram_minimum_free = heap_caps_get_minimum_free_size(MALLOC_CAP_SPIRAM);

    uint32_t flash_size = 0;
    if (esp_flash_get_size(NULL, &flash_size) == ESP_OK) {
        out->flash_available = true;
        out->flash_total = flash_size;
    }
    out->ui_update_time_us = g_ui_update_time_us;
    out->cpu_frequency_mhz = CONFIG_ESP_DEFAULT_CPU_FREQ_MHZ;
    out->uptime_seconds = (uint64_t)(esp_timer_get_time() / 1000000);
    const esp_app_desc_t *app = esp_app_get_description();
    snprintf(out->build_version, sizeof(out->build_version), "%s",
             app != NULL ? app->version : "Not Available");
    snprintf(out->lvgl_version, sizeof(out->lvgl_version), "%d.%d.%d",
             LVGL_VERSION_MAJOR, LVGL_VERSION_MINOR, LVGL_VERSION_PATCH);

    const int64_t now_us = esp_timer_get_time();
    const uint32_t now_tick = lv_tick_get();
    const int64_t elapsed_us = now_us - g_previous_tick_sample_us;
    if (elapsed_us > 0) {
        g_tick_rate_hz = (uint32_t)(((uint64_t)(now_tick - g_previous_lv_tick) * 1000000ULL) /
                                    (uint64_t)elapsed_us);
    }
    g_previous_tick_sample_us = now_us;
    g_previous_lv_tick = now_tick;
    out->lvgl_tick_rate_hz = g_tick_rate_hz;

#if defined(CONFIG_BSP_LCD_DPI_BUFFER_NUMS)
    out->framebuffer_count = CONFIG_BSP_LCD_DPI_BUFFER_NUMS;
    out->framebuffer_count_available = true;
#elif defined(CONFIG_BSP_LCD_RGB_BUFFER_NUMS)
    out->framebuffer_count = CONFIG_BSP_LCD_RGB_BUFFER_NUMS;
    out->framebuffer_count_available = true;
#endif

    lv_display_t *display = lv_display_get_default();
    if (display != NULL) {
        out->lvgl_display_available = true;
        out->horizontal_resolution = (uint32_t)lv_display_get_horizontal_resolution(display);
        out->vertical_resolution = (uint32_t)lv_display_get_vertical_resolution(display);
        out->object_count = fg_diagnostics_count_objects(lv_screen_active());
    }

    fg_wifi_snapshot_t wifi;
    if (fg_wifi_get_snapshot(&wifi) == FG_WIFI_OP_OK) {
        out->wifi_connected = wifi.connected;
        out->wifi_rssi = wifi.rssi;
        snprintf(out->wifi_ssid, sizeof(out->wifi_ssid), "%s", wifi.ssid);
        snprintf(out->wifi_ip, sizeof(out->wifi_ip), "%s", wifi.ip);
    }

    fg_sd_snapshot_t sd;
    if (fg_sd_get_snapshot(&sd) == FG_SD_OK) {
        out->sd_available = true;
        out->sd_mounted = sd.mounted;
        out->sd_capacity = sd.total_bytes;
        out->sd_free = sd.free_bytes;
    }
}
