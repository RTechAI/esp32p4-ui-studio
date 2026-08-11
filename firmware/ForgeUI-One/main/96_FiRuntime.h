#ifndef FORGEUI_FI_RUNTIME_H
#define FORGEUI_FI_RUNTIME_H

#include <stdbool.h>
#include <stdint.h>
#include "lvgl.h"

#ifdef __cplusplus
extern "C" {
#endif

void FG_Set_Weather_Current_Icon_Visible(bool visible);
void FG_Set_Weather_Current_Icon_Opacity(uint8_t opacity);
void FG_Set_Weather_Current_Icon_Color(uint32_t rgb);
void fg_fi_bind_weather_current_icon(lv_obj_t * object, bool image_backed);

void FG_Set_Forecast_Day1_Icon_Visible(bool visible);
void FG_Set_Forecast_Day1_Icon_Opacity(uint8_t opacity);
void FG_Set_Forecast_Day1_Icon_Color(uint32_t rgb);
void fg_fi_bind_forecast_day1_icon(lv_obj_t * object, bool image_backed);

void FG_Set_Forecast_Day2_Icon_Visible(bool visible);
void FG_Set_Forecast_Day2_Icon_Opacity(uint8_t opacity);
void FG_Set_Forecast_Day2_Icon_Color(uint32_t rgb);
void fg_fi_bind_forecast_day2_icon(lv_obj_t * object, bool image_backed);

void FG_Set_Forecast_Day3_Icon_Visible(bool visible);
void FG_Set_Forecast_Day3_Icon_Opacity(uint8_t opacity);
void FG_Set_Forecast_Day3_Icon_Color(uint32_t rgb);
void fg_fi_bind_forecast_day3_icon(lv_obj_t * object, bool image_backed);

void FG_Set_Forecast_Day4_Icon_Visible(bool visible);
void FG_Set_Forecast_Day4_Icon_Opacity(uint8_t opacity);
void FG_Set_Forecast_Day4_Icon_Color(uint32_t rgb);
void fg_fi_bind_forecast_day4_icon(lv_obj_t * object, bool image_backed);

void FG_Set_Forecast_Day5_Icon_Visible(bool visible);
void FG_Set_Forecast_Day5_Icon_Opacity(uint8_t opacity);
void FG_Set_Forecast_Day5_Icon_Color(uint32_t rgb);
void fg_fi_bind_forecast_day5_icon(lv_obj_t * object, bool image_backed);

#ifdef __cplusplus
}
#endif

#endif
