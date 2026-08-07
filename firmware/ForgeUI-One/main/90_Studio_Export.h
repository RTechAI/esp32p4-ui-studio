#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Indicator1(bool on);
void FG_Set_Indicator2(bool on);
void FG_Set_LED1_Toggle_Checked(bool checked);
void FG_Set_LED2_Toggle_Checked(bool checked);

#ifdef __cplusplus
}
#endif
