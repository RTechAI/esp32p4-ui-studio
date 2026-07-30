#pragma once

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    size_t internal_free;
    size_t internal_total;
    size_t internal_minimum_free;
    size_t psram_free;
    size_t psram_total;
    size_t psram_minimum_free;
    uint64_t flash_total;
    uint64_t flash_used;
    uint64_t flash_free;
    uint64_t application_size;
    uint64_t spiffs_used;
    uint64_t spiffs_free;
    bool flash_available;
    bool flash_usage_available;
    bool application_size_available;
    bool spiffs_available;
    uint32_t fps;
    bool fps_available;
    uint32_t lvgl_tick_rate_hz;
    uint32_t ui_update_time_us;
    uint32_t cpu_frequency_mhz;
    uint64_t uptime_seconds;
    char build_version[32];
    char lvgl_version[24];
    uint32_t framebuffer_count;
    bool framebuffer_count_available;
    uint32_t horizontal_resolution;
    uint32_t vertical_resolution;
    size_t object_count;
    bool lvgl_display_available;
    bool wifi_connected;
    char wifi_ssid[33];
    int wifi_rssi;
    char wifi_ip[16];
    bool sd_mounted;
    uint64_t sd_capacity;
    uint64_t sd_free;
    size_t sd_files;
    bool sd_files_available;
    bool sd_available;
} fg_diagnostics_snapshot_t;

void fg_diagnostics_init(void);
void fg_diagnostics_get_snapshot(fg_diagnostics_snapshot_t *out);
void fg_diagnostics_record_ui_update_us(uint32_t elapsed_us);

#ifdef __cplusplus
}
#endif
