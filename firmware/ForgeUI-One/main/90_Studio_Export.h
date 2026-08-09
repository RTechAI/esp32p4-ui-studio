#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>
#include "96_FiRuntime.h"

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Box_Visible(bool visible);
void FG_Set_Box_2_Visible(bool visible);
void FG_Set_Box_3_Visible(bool visible);
void FG_Set_Box_4_Visible(bool visible);
void FG_Set_Box_5_Visible(bool visible);
void FG_Set_Box_6_Visible(bool visible);
void FG_Set_Box_7_Visible(bool visible);
void FG_Set_Box_8_Visible(bool visible);
void FG_Set_Box_9_Visible(bool visible);
void FG_Set_Weather_Date_Text(const char * text);
void FG_Set_Weather_Time_Text(const char * text);
void FG_Set_Weather_Temperature_Text(const char * text);
void FG_Set_Weather_Condition_Text(const char * text);
void FG_Set_Weather_Feels_Like_Text(const char * text);
void FG_Set_Weather_Humidity_Text(const char * text);
void FG_Set_Weather_Wind_Text(const char * text);
void FG_Set_Weather_Rain_Text(const char * text);
void FG_Set_Weather_UV_Text(const char * text);
void FG_Set_Forecast_Day1_Name_Text(const char * text);
void FG_Set_Forecast_Day1_Temperature_Text(const char * text);
void FG_Set_Forecast_Day2_Name_Text(const char * text);
void FG_Set_Forecast_Day2_Temperature_Text(const char * text);
void FG_Set_Forecast_Day3_Name_Text(const char * text);
void FG_Set_Forecast_Day3_Temperature_Text(const char * text);
void FG_Set_Forecast_Day4_Name_Text(const char * text);
void FG_Set_Forecast_Day4_Temperature_Text(const char * text);
void FG_Set_Forecast_Day5_Name_Text(const char * text);
void FG_Set_Forecast_Day5_Temperature_Text(const char * text);
void FG_Set_Weather_Location_Text(const char * text);

#ifdef __cplusplus
}
#endif
