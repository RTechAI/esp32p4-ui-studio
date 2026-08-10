#pragma once

#include <stdbool.h>
#include <stdint.h>

typedef struct {
    bool receiving;
    bool nmea_alive;
    bool fix_valid;
    uint8_t fix_dimension;
    double latitude;
    double longitude;
    uint8_t satellites;
    float altitude_m;
    float speed_kmh;
    float hdop;
    uint8_t utc_hour;
    uint8_t utc_minute;
    uint8_t utc_second;
    bool utc_valid;
    uint32_t last_update_age_ms;
} fg_gps_snapshot_t;

void fg_hardware_example_05_init(void);
void fg_hardware_example_05_ui_binding_init(void);
bool fg_gps_get_snapshot(fg_gps_snapshot_t *snapshot);
