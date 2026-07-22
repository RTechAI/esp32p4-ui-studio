#pragma once

#include "lvgl.h"
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Status_Light(bool enabled);
void FG_Set_Status_Light_2(bool enabled);
void FG_Set_Status_Light_3(bool enabled);

#ifdef __cplusplus
}
#endif
