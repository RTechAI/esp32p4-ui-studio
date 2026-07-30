#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Status_LED(bool on);
void FG_Set_Progress_Bar(int32_t value);
void FG_Set_Progress_Value(int32_t value);
void FG_Set_Circular_Progress_Value(int32_t value);
void FG_Set_Number_Input_Value(int32_t value);
void FG_Set_Select_Selected_Index(uint32_t index);
void FG_Set_Image_Source(const void * src);
void FG_Set_Box_Visible(bool visible);
void FG_Set_Option_Roller_Selected(uint32_t index);
void FG_Show_Message(void);
void FG_Close_Message(void);
void FG_Set_Textarea_Text(const char * text);
void FG_Set_Input_Text(const char * text);
void FG_Set_Switch_Checked(bool checked);
void FG_Set_Checkbox_Checked(bool checked);
void FG_Set_Radio_Selected(bool selected);

#ifdef __cplusplus
}
#endif
