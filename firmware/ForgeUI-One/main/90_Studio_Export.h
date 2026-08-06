#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Tank_Left_Volume(float value);
void FG_Set_Tank_Left_Capacity(float value);
void FG_Set_Tank_Left_Units(const char * units);
void FG_Set_Tank_Left_LowLevel(float value);
void FG_Set_Tank_Left_HighLevel(float value);
void FG_Set_Tank_Right_Volume(float value);
void FG_Set_Tank_Right_Capacity(float value);
void FG_Set_Tank_Right_Units(const char * units);
void FG_Set_Tank_Right_LowLevel(float value);
void FG_Set_Tank_Right_HighLevel(float value);

#ifdef __cplusplus
}
#endif
