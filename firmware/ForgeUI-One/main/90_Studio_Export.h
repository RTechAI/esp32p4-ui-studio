#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_Comp_MSFLVB1_EE9_URI_Title(const char * title);
void FG_Set_Comp_MSFLVB1_EE9_URI_Value(const char * value);
void FG_Set_Comp_MSFLVB1_EE9_URI_Units(const char * units);
void FG_Set_Comp_MSFLVB1_EE9_URI_Description(const char * description);
void FG_Set_Comp_MSFLVB1_EE9_URI_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSFLVB1_EE9_URI_Progress(int32_t value);
void FG_Set_Comp_MSFLVB1_EE9_URI_Footer(const char * footer);
void FG_Set_Comp_MSFLVB1_EE9_URI_Colour(uint32_t rgb);
void FG_Set_Comp_MSFLVCQVVK0_LD_Title(const char * title);
void FG_Set_Comp_MSFLVCQVVK0_LD_Value(const char * value);
void FG_Set_Comp_MSFLVCQVVK0_LD_Units(const char * units);
void FG_Set_Comp_MSFLVCQVVK0_LD_Description(const char * description);
void FG_Set_Comp_MSFLVCQVVK0_LD_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSFLVCQVVK0_LD_Progress(int32_t value);
void FG_Set_Comp_MSFLVCQVVK0_LD_Footer(const char * footer);
void FG_Set_Comp_MSFLVCQVVK0_LD_Colour(uint32_t rgb);
void FG_Set_Comp_MSFMNMRYJ9751_Title(const char * title);
void FG_Set_Comp_MSFMNMRYJ9751_Value(const char * value);
void FG_Set_Comp_MSFMNMRYJ9751_Units(const char * units);
void FG_Set_Comp_MSFMNMRYJ9751_Description(const char * description);
void FG_Set_Comp_MSFMNMRYJ9751_Status(const char * text, uint32_t rgb);
void FG_Set_Comp_MSFMNMRYJ9751_Progress(int32_t value);
void FG_Set_Comp_MSFMNMRYJ9751_Footer(const char * footer);
void FG_Set_Comp_MSFMNMRYJ9751_Colour(uint32_t rgb);

#ifdef __cplusplus
}
#endif
