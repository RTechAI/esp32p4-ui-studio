#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Slider_Value(int32_t value);
void FG_Set_Slider_2_Value(int32_t value);
void FG_Set_Slider_3_Value(int32_t value);
void FG_Set_Slider_4_Value(int32_t value);

#ifdef __cplusplus
}
#endif
