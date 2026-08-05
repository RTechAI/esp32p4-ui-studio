#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Clear_Data_Chart(void);
void FG_Set_Data_Chart_WarningThreshold(float value);
void FG_Set_Data_Chart_AlarmThreshold(float value);
void FG_Clear_Comp_MSGFBNVPEL8_E0(void);
void FG_Set_Comp_MSGFBNVPEL8_E0_Warning(float value);
void FG_Set_Comp_MSGFBNVPEL8_E0_Alarm(float value);
void FG_Set_Comp_MSGFBNVPEL8_E0_Units(const char * units);

#ifdef __cplusplus
}
#endif
