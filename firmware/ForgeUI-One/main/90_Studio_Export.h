#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
void FG_Set_FRAM_Address_Text(const char * text);
void FG_Set_FRAM_Status_Text(const char * text);
void FG_Set_FRAM_Value_Text(const char * text);
void FG_Set_FRAM_Verify_Text(const char * text);

#ifdef __cplusplus
}
#endif
