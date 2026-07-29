#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Add_Data_Chart_Point(int32_t value);
void FG_Clear_Data_Chart(void);
void FG_Add_Data_Chart_2_Point(int32_t value);
void FG_Clear_Data_Chart_2(void);
void FG_Set_Calendar_Date(uint16_t year, uint8_t month, uint8_t day);
void FG_Set_Tab_View_Selected(uint32_t tab_index);
void FG_Set_Tab_View_2_Selected(uint32_t tab_index);
void FG_Set_Tileview_Selected(uint32_t column, uint32_t row);
void FG_Set_Tileview_2_Selected(uint32_t column, uint32_t row);

#ifdef __cplusplus
}
#endif
