#pragma once

#include <stdbool.h>
#include <stdint.h>

typedef struct {
    char name[40];
    char region[40];
    char country[40];
    char timezone[40];
    char timezone_posix[64];
    double latitude;
    double longitude;
} fg_weather_location_t;

typedef struct {
    bool valid;
    bool current_conditions_valid;
    float current_temperature_c;
    float apparent_temperature_c;
    float relative_humidity_percent;
    float wind_speed_kmh;
    float precipitation_mm;
    int weather_code;
    bool is_day;
    int64_t sunrise_unix;
    int64_t sunset_unix;
    uint32_t last_success_ms;
    char status[48];
} fg_weather_snapshot_t;

void fg_hardware_example_04_init(void);
bool fg_weather_get_location(fg_weather_location_t *location);
bool fg_weather_set_location(const fg_weather_location_t *location);
bool fg_weather_get_snapshot(fg_weather_snapshot_t *snapshot);
