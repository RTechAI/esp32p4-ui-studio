#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
typedef enum { FG_ALARM_PRIORITY_LOW = 0, FG_ALARM_PRIORITY_MEDIUM = 1, FG_ALARM_PRIORITY_HIGH = 2, FG_ALARM_PRIORITY_CRITICAL = 3 } FG_Alarm_Priority;
typedef enum { FG_ALARM_STATE_NORMAL = 0, FG_ALARM_STATE_WARNING = 1, FG_ALARM_STATE_ALARM = 2, FG_ALARM_STATE_ACKNOWLEDGED = 3, FG_ALARM_STATE_CLEARED = 4 } FG_Alarm_State;
bool FG_Add_Alarm_Compact_Alarm(int32_t alarm_id, const char * message, const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);
bool FG_Acknowledge_Alarm_Compact_Alarm(int32_t alarm_id);
bool FG_Clear_Alarm_Compact_Alarm(int32_t alarm_id);
void FG_Clear_All_Alarm_Compact(void);
void FG_Set_Alarm_Compact_Enabled(bool enabled);
bool FG_Select_Alarm_Compact_Alarm(int32_t alarm_id);
bool FG_Add_Alarm_Standard_Alarm(int32_t alarm_id, const char * message, const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);
bool FG_Acknowledge_Alarm_Standard_Alarm(int32_t alarm_id);
bool FG_Clear_Alarm_Standard_Alarm(int32_t alarm_id);
void FG_Clear_All_Alarm_Standard(void);
void FG_Set_Alarm_Standard_Enabled(bool enabled);
bool FG_Select_Alarm_Standard_Alarm(int32_t alarm_id);

#ifdef __cplusplus
}
#endif
