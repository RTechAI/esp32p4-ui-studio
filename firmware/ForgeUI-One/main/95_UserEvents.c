#include "95_UserEvents.h"
/* Read-only Example 03 fields: no developer hardware actions are bound here. */

void FG_On_READ_TEST_Clicked(void)
{
    printf("[ForgeUI User Event] FG_On_READ_TEST_Clicked\n");
}

void FG_On_WRITE_TEST_Clicked(void)
{
    printf("[ForgeUI User Event] FG_On_WRITE_TEST_Clicked\n");
}

void FG_On_FRAM_Address_Changed(const char * text)
{
    printf("[ForgeUI User Event] FRAM Address changed: %s\n",
           text ? text : "");
}

void FG_On_FRAM_Status_Changed(const char * text)
{
    printf("[ForgeUI User Event] FRAM Status changed: %s\n",
           text ? text : "");
}

void FG_On_FRAM_Value_Changed(const char * text)
{
    printf("[ForgeUI User Event] FRAM Value changed: %s\n",
           text ? text : "");
}

void FG_On_FRAM_Verify_Changed(const char * text)
{
    printf("[ForgeUI User Event] FRAM Verify changed: %s\n",
           text ? text : "");
}
