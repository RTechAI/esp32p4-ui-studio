#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_GPS_Altitude_Text(const char * text);
void FG_Set_GPS_Fix_Text(const char * text);
void FG_Set_GPS_HDOP_Text(const char * text);
void FG_Set_GPS_Latitude_Text(const char * text);
void FG_Set_GPS_Longitude_Text(const char * text);
void FG_Set_GPS_NMEA_Text(const char * text);
void FG_Set_GPS_Satellites_Text(const char * text);
void FG_Set_GPS_Speed_Text(const char * text);
void FG_Set_GPS_UART_Text(const char * text);
void FG_Set_GPS_UTC_Text(const char * text);

#ifdef __cplusplus
}
#endif
