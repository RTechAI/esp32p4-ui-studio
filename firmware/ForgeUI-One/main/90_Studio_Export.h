#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>


#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
typedef enum { FG_IO_DIGITAL_INPUT = 0, FG_IO_DIGITAL_OUTPUT = 1, FG_IO_ANALOG_INPUT = 2, FG_IO_ANALOG_OUTPUT = 3 } FG_IO_Type;
bool FG_Set_Comp_MSH8868_TNTWC1_DigitalInput(const char * channel, bool state);
bool FG_Set_Comp_MSH8868_TNTWC1_DigitalOutput(const char * channel, bool state);
bool FG_Set_Comp_MSH8868_TNTWC1_AnalogInput(const char * channel, float value);
bool FG_Set_Comp_MSH8868_TNTWC1_AnalogOutput(const char * channel, float value);

#ifdef __cplusplus
}
#endif
