#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Comp_MSBHEOFNU0_CVL_Channel(uint32_t channel, bool enabled);
bool FG_Get_Comp_MSBHEOFNU0_CVL_Channel(uint32_t channel);
void FG_Set_Comp_MSBHEOFNU0_CVL_Channel_Enabled(uint32_t channel, bool enabled);
void FG_Set_Comp_MSBHEOFNU0_CVL_All(bool enabled);
void FG_Set_Comp_MSBHEOFNU0_CVL_Label(uint32_t channel, const char * label);
void FG_Set_Comp_MSBHEOFNU0_CVL_Status(uint32_t channel, const char * text);
void FG_Set_Comp_MSBHEOFNU0_CVL_Master(bool enabled);

#ifdef __cplusplus
}
#endif
