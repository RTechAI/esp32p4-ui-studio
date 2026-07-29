#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Status_LED(bool on);
void FG_Set_Progress_Bar(int32_t value);
void FG_Set_Value_Arc(int32_t value);
void FG_Add_Data_Chart_Point(int32_t value);
void FG_Clear_Data_Chart(void);
void FG_Show_Keyboard(void);
void FG_Hide_Keyboard(void);

#ifdef __cplusplus
}
#endif
