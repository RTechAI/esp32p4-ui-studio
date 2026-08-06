#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Battery_Left_Percentage(float value);
void FG_Set_Battery_Left_Voltage(float value);
void FG_Set_Battery_Left_Current(float value);
void FG_Set_Battery_Left_Charging(bool enabled);
void FG_Set_Battery_Left_Health(int32_t value);
void FG_Set_Battery_Left_Runtime(int32_t value);
void FG_Set_Battery_Left_Temperature(float value);
void FG_Set_Battery_Right_Percentage(float value);
void FG_Set_Battery_Right_Voltage(float value);
void FG_Set_Battery_Right_Current(float value);
void FG_Set_Battery_Right_Charging(bool enabled);
void FG_Set_Battery_Right_Health(int32_t value);
void FG_Set_Battery_Right_Runtime(int32_t value);
void FG_Set_Battery_Right_Temperature(float value);

#ifdef __cplusplus
}
#endif
