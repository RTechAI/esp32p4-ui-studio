#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Box_Visible(bool visible);
void FG_Set_Box_2_Visible(bool visible);
void FG_Add_Data_Chart_Point(int32_t value);
void FG_Clear_Data_Chart(void);
void FG_Set_Input_Text(const char * text);
void FG_Set_Switch_Checked(bool checked);
void FG_Set_Checkbox_Checked(bool checked);
void FG_Set_Radio_Selected(bool selected);

#ifdef __cplusplus
}
#endif
