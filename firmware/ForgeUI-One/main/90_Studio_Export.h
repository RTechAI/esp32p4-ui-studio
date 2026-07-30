#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Status_LED(bool on);
void FG_Set_Progress_Value(int32_t value);
void FG_Set_Circular_Progress_Value(int32_t value);
void FG_Set_Box_Visible(bool visible);
void FG_Set_Box_2_Visible(bool visible);
void FG_Set_Box_3_Visible(bool visible);
void FG_Set_Box_4_Visible(bool visible);
void FG_Set_Box_5_Visible(bool visible);
void FG_Add_Data_Chart_Point(int32_t value);
void FG_Clear_Data_Chart(void);

#ifdef __cplusplus
}
#endif
