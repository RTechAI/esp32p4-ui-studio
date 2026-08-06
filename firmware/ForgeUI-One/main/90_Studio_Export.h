#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Comp_MSI3_O236_Z0_WEQ_Volume(float value);
void FG_Set_Comp_MSI3_O236_Z0_WEQ_Capacity(float value);
void FG_Set_Comp_MSI3_O236_Z0_WEQ_Units(const char * units);
void FG_Set_Comp_MSI3_O236_Z0_WEQ_LowLevel(float value);
void FG_Set_Comp_MSI3_O236_Z0_WEQ_HighLevel(float value);
void FG_Set_Comp_MSI3_O0_H3_H275_P_Status_Text(const char * value);
void FG_Set_Comp_MSI3_O0_H3_H275_P_Network_Type(int32_t value);
void FG_Set_Comp_MSI3_NYLSDFQ5_P_Status(int32_t value);
void FG_Set_Comp_MSI3_NYLSDFQ5_P_Uptime(const char * value);
void FG_Set_Comp_MSI3_NYLSDFQ5_P_Firmware_Version(const char * value);
void FG_Set_Comp_MSI3_NYLSDFQ5_P_Network_Status(const char * value);
void FG_Set_Comp_MSI3_NYLSDFQ5_P_Storage_Status(const char * value);

#ifdef __cplusplus
}
#endif
