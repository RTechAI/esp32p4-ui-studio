#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Comp_MSBP3_KNW1_DR6_E_Value(const char * value);
void FG_Set_Comp_MSBP3_KNW1_DR6_E_Units(const char * units);
void FG_Set_Comp_MSBP3_KNW1_DR6_E_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSBP3_KNW1_DR6_E_Progress(int32_t value);
void FG_Set_Comp_MSBP1_FCKFZKHP_Value(float value);
void FG_Set_Comp_MSBP1_FCKFZKHP_Units(const char * units);
void FG_Set_Comp_MSBP1_FCKFZKHP_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSBP1_FCKFZKHP_Trend(int32_t trend);
void FG_Set_Comp_MSBP1_FCKFZKHP_Timestamp(const char * timestamp);
void FG_Set_Comp_MSBP1_FCKFZKHP_Colour(uint32_t rgb);
void FG_Set_Comp_MSBP1_VT0_NVT6_A_Value(float value);
void FG_Set_Comp_MSBP1_VT0_NVT6_A_Units(const char * units);
void FG_Set_Comp_MSBP1_VT0_NVT6_A_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSBP1_VT0_NVT6_A_Trend(int32_t trend);
void FG_Set_Comp_MSBP1_VT0_NVT6_A_Timestamp(const char * timestamp);
void FG_Set_Comp_MSBP1_VT0_NVT6_A_Colour(uint32_t rgb);
void FG_Set_Comp_MSBP0_UC0_W25_Q1_Channel(uint32_t channel, bool enabled);
bool FG_Get_Comp_MSBP0_UC0_W25_Q1_Channel(uint32_t channel);
void FG_Set_Comp_MSBP0_UC0_W25_Q1_Channel_Enabled(uint32_t channel, bool enabled);
void FG_Set_Comp_MSBP0_UC0_W25_Q1_All(bool enabled);
void FG_Set_Comp_MSBP0_UC0_W25_Q1_Label(uint32_t channel, const char * label);
void FG_Set_Comp_MSBP0_UC0_W25_Q1_Status(uint32_t channel, const char * text);
void FG_Set_Comp_MSBP0_UC0_W25_Q1_Master(bool enabled);
void FG_Set_Comp_MSBOX6_QTG8_Z2_W_Value(float value);
void FG_Set_Comp_MSBOX6_QTG8_Z2_W_Enabled(bool enabled);
void FG_Set_Comp_MSBOZT2_XBP996_Value(float value);
void FG_Set_Comp_MSBOZT2_XBP996_Enabled(bool enabled);
void FG_Set_Box_Visible(bool visible);
void FG_Set_Box_2_Visible(bool visible);
void FG_Set_Box_3_Visible(bool visible);
void FG_Set_Box_4_Visible(bool visible);
void FG_Set_Box_5_Visible(bool visible);
void FG_Set_Box_6_Visible(bool visible);

#ifdef __cplusplus
}
#endif
