#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Comp_MSI2_ZKURWHVGM_Value(float value);
void FG_Set_Comp_MSI2_ZKURWHVGM_Units(const char * units);
void FG_Set_Comp_MSI2_ZKURWHVGM_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSI2_ZKURWHVGM_Trend(int32_t trend);
void FG_Set_Comp_MSI2_ZKURWHVGM_Timestamp(const char * timestamp);
void FG_Set_Comp_MSI2_ZKURWHVGM_Colour(uint32_t rgb);
void FG_Set_Comp_MSI2_ZGQ0_M6_RW9_Status_Text(const char * value);
void FG_Set_Comp_MSI2_ZGQ0_M6_RW9_Network_Type(int32_t value);

#ifdef __cplusplus
}
#endif
