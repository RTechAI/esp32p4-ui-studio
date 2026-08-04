#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Comp_MSF3_R93_JOY4_XF_Value(const char * value);
void FG_Set_Comp_MSF3_R93_JOY4_XF_Units(const char * units);
void FG_Set_Comp_MSF3_R93_JOY4_XF_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSF3_R93_JOY4_XF_Progress(int32_t value);

#ifdef __cplusplus
}
#endif
