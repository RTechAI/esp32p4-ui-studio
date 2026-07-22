#pragma once

#include "lvgl.h"
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Green_Power_Light_On1(bool enabled);
void FG_Set_Red_Power_Light_Off1(bool enabled);

#ifdef __cplusplus
}
#endif
