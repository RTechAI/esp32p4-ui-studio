#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Comp_MSBCEKT2_TYLLX_Value(const char * value);
void FG_Set_Comp_MSBCEKT2_TYLLX_Units(const char * units);
void FG_Set_Comp_MSBCEKT2_TYLLX_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSBCEKT2_TYLLX_Progress(int32_t value);
void FG_Set_Comp_MSBCEON9_ITWY7_Value(float value);
void FG_Set_Comp_MSBCEON9_ITWY7_Units(const char * units);
void FG_Set_Comp_MSBCEON9_ITWY7_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSBCEON9_ITWY7_Trend(int32_t trend);
void FG_Set_Comp_MSBCEON9_ITWY7_Timestamp(const char * timestamp);
void FG_Set_Comp_MSBCEON9_ITWY7_Colour(uint32_t rgb);

#ifdef __cplusplus
}
#endif
