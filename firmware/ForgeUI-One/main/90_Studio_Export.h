#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Spinbox_Value(int32_t value);
void FG_Set_Tab_View_Selected(uint32_t tab_index);
void FG_Set_Tileview_Selected(uint32_t column, uint32_t row);

#ifdef __cplusplus
}
#endif
