#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Comp_MSFPBMJC403_RI_Value(float value);
void FG_Set_Comp_MSFPBMJC403_RI_Units(const char * units);
void FG_Set_Comp_MSFPBMJC403_RI_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSFPBMJC403_RI_Trend(int32_t trend);
void FG_Set_Comp_MSFPBMJC403_RI_Timestamp(const char * timestamp);
void FG_Set_Comp_MSFPBMJC403_RI_Colour(uint32_t rgb);
void FG_Set_Comp_MSFPBONCWECV2_Value(float value);
void FG_Set_Comp_MSFPBONCWECV2_Units(const char * units);
void FG_Set_Comp_MSFPBONCWECV2_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSFPBONCWECV2_Trend(int32_t trend);
void FG_Set_Comp_MSFPBONCWECV2_Timestamp(const char * timestamp);
void FG_Set_Comp_MSFPBONCWECV2_Colour(uint32_t rgb);

#ifdef __cplusplus
}
#endif
