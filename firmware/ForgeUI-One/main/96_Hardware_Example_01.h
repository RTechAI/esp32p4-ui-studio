#pragma once

#include <stdbool.h>

/* Developer-owned GPIO example for Hardware Example 01. */
void fg_hardware_example_01_init(void);
void fg_hardware_example_01_poll(void);
void fg_hardware_example_01_set_led1(bool on);
void fg_hardware_example_01_set_led2(bool on);
