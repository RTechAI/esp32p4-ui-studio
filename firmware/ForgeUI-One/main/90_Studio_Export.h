#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Comp_MSI577_USU8_FM9_Value(const char * value);
void FG_Set_Comp_MSI577_USU8_FM9_Unit(const char * value);
void FG_Set_Comp_MSI577_USU8_FM9_Secondary_Text(const char * value);
void FG_Set_Comp_MSI577_USU8_FM9_Trend_Text(const char * value);
void FG_Set_Comp_MSI577_USU8_FM9_Trend_State(int32_t value);
void FG_Set_Comp_MSI577_USU8_FM9_Status(int32_t value);
void FG_Set_Comp_MSI577_USU8_FM9_Target_Text(const char * value);

#ifdef __cplusplus
}
#endif
