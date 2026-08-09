# 05_DEVELOPER_HARDWARE_INTEGRATION.md

# ForgeUI Developer Hardware Integration Guide

For Waveshare 7B Wi-Fi, HTTPS and future connected-service integration, follow [`12_FORGEUI_ESP32P4_WIFI_HOSTED_ARCHITECTURE.md`](12_FORGEUI_ESP32P4_WIFI_HOSTED_ARCHITECTURE.md). The board profile owns the stock-C6 Hosted stack, SDIO pins/mode/queues, memory policy and certificate verification; application and UserEvents code must not reconfigure those internals.

This is the application/hardware companion to
`05_DEVELOPER_GUIDE.md`. The Internal Developer Guide owns Studio architecture
and widget-pipeline guidance; this document owns post-export application,
driver, task and hardware integration examples.

Current generated List interaction:

```c
void FG_On_System_Menu_Item_Clicked(
    uint32_t index,
    const char * text)
{
    app_navigation_select(index, text);
}
```

The index is zero-based. The hook is emitted only for a genuine native List
button click; construction and programmatic UI work remain silent. Keep the
hook short and copy `text` before returning if application code needs to retain
it.

> **Purpose**
>
> This guide explains how to connect a ForgeUI-generated interface to real application code and physical hardware.
>
> It is written for developers building ESP-IDF products with:
>
> - GPIO
> - relays
> - switches
> - physical buttons
> - sensors
> - motors
> - alarms
> - FreeRTOS tasks
> - queues
> - timers
> - MQTT
> - BLE
> - CAN
> - Modbus
> - Ethernet
> - SD-backed application features
> - application state machines
>
> This document complements:
>
> - `01_SPINE.md`
> - `02_DEVELOPER_CODE_MAP.md`
> - `03_ForgeUI_Generated_Export_API_Code_Map.md`
>
> Those documents explain how ForgeUI is structured and where each subsystem lives.
>
> This document explains how developers should build a product on top of a ForgeUI export.

---

# 1. The Core Integration Model

ForgeUI generates the interface.

The developer supplies the application.

```text
ForgeUI Studio
    ↓
Generated LVGL UI
    ↓
Generated runtime APIs and callbacks
    ↓
Developer integration layer
    ↓
Application logic
    ↓
Drivers and hardware
```

The permanent boundary is:

```text
Application → Generated UI

90_Studio_Export.h
```

and:

```text
Generated UI → Application

95_UserEvents.h
95_UserEvents.c
```

There are only two directions.

## 1.1 User input into the application

```text
User touches the display
    ↓
Generated LVGL object receives the event
    ↓
ForgeUI generated runtime processes the event
    ↓
FG_On_* developer hook is called
    ↓
95_UserEvents.c
    ↓
Application logic
    ↓
Hardware or product state changes
```

## 1.2 Application state into the UI

```text
Sensor, task, network event or hardware state changes
    ↓
Application logic decides what the UI should show
    ↓
Application calls FG_Set_*, FG_Show_*, FG_Hide_*, FG_Add_* or FG_Clear_*
    ↓
Generated runtime updates LVGL
    ↓
Display changes
```

This split keeps the UI replaceable and the application permanent.

---

# 2. The Golden Rule

## Never place permanent product logic in generated UI files.

Generated UI files may be replaced.

Application code should remain stable.

Good architecture:

```text
Generated callback
    ↓
Small developer hook
    ↓
Application function
    ↓
Driver or service
```

Poor architecture:

```text
Generated callback
    ↓
Hundreds of lines of hardware and business logic
```

---

# 3. File Ownership

## 3.1 Generated and replaceable

```text
90_Studio_Export.c
90_Studio_Export.h
```

These files may contain:

- generated LVGL object creation
- generated widget runtime state
- generated public setters
- generated show/hide functions
- generated chart functions
- generated event adapters
- generated component-specific runtime helpers
- generated System Runtime UI
- generated application container creation
- generated image declarations
- generated UI construction

Do not manually patch them to fix Studio behaviour.

Do not place permanent GPIO, sensor, relay, motor, MQTT, BLE, CAN, Modbus or application logic in them.

## 3.2 Developer event and application adapter layer

```text
95_UserEvents.c
95_UserEvents.h
```

ForgeUI generates these files.

In live Studio firmware:

- matching developer-written bodies are preserved
- missing declarations are appended
- missing stubs are appended
- unrelated hooks are not deleted

In a standalone exported ESP-IDF project:

- `95_UserEvents.c`
- `95_UserEvents.h`

become part of the developer-owned application layer.

These files are the intended bridge between generated UI events and your product.

The complete standalone export is developer-owned after it is created. Studio does not subsequently manage or regenerate files inside that exported project. If the developer later copies in a newly generated UI, preserve or deliberately merge the application-owned `95_UserEvents.*` and application modules. Never assume a future export will recover application code placed in replaceable `90_Studio_Export.*`.

## 3.3 Application-owned modules

Recommended modules include:

```text
app_control.c
app_control.h

app_io.c
app_io.h

app_sensors.c
app_sensors.h

app_ui.c
app_ui.h

app_network.c
app_network.h

app_storage.c
app_storage.h

app_settings.c
app_settings.h
```

Keep application logic here.

---

# 4. Recommended Standalone Project Layout

```text
main/
├── main.c
├── app_control.c
├── app_control.h
├── app_io.c
├── app_io.h
├── app_sensors.c
├── app_sensors.h
├── app_ui.c
├── app_ui.h
├── app_network.c
├── app_network.h
├── app_storage.c
├── app_storage.h
├── app_settings.c
├── app_settings.h
├── 90_Studio_Export.c
├── 90_Studio_Export.h
├── 95_UserEvents.c
├── 95_UserEvents.h
├── generated image assets
└── CMakeLists.txt
```

Suggested ownership:

| File | Responsibility |
| --- | --- |
| `main.c` | Startup order and module initialization |
| `app_control.*` | Product state machine and business rules |
| `app_io.*` | GPIO, relays, physical buttons and outputs |
| `app_sensors.*` | Sensor acquisition, filtering and conversion |
| `app_ui.*` | Application-owned UI synchronization |
| `app_network.*` | MQTT, BLE, Ethernet, CAN or cloud integration |
| `app_storage.*` | Application-owned file or logging behaviour |
| `app_settings.*` | Persistent product settings |
| `95_UserEvents.*` | UI intent adapter |
| `90_Studio_Export.*` | Generated UI runtime |

---

# 5. Required Includes

Developer hook implementations normally include:

```c
#include "95_UserEvents.h"
```

Application modules that update the generated UI include:

```c
#include "90_Studio_Export.h"
```

A file that uses both may include both:

```c
#include "90_Studio_Export.h"
#include "95_UserEvents.h"
```

Always use the exact generated function names.

ForgeUI sanitizes component names into valid C identifiers.

If two generated names collide, deterministic suffixes such as `_2` may be added.

The generated headers are the source of truth.

---

# 6. Generated API Categories

ForgeUI does not generate the same API shape for every component.

The API depends on component semantics.

## 6.1 Interactive input

Interactive controls may expose:

- a setter for programmatic state updates
- a developer hook for genuine user interaction

Examples:

```c
void FG_Set_Main_Switch_Checked(bool checked);
void FG_On_Main_Switch_Changed(bool checked);
```

```c
void FG_Set_Mode_Select_Selected_Index(uint32_t index);
void FG_On_Mode_Select_Changed(
    uint32_t index,
    const char * text);
```

An ordinary Standard `Button` owns serialized label presentation and does not generate a click hook. Use an Interactive Button for `FG_On_<Name>_Clicked(void)` artwork-backed input, or an IconButton for a click hook plus `FG_Set_<Name>_Enabled(bool enabled)`. Always confirm that the chosen component produced the hook in `95_UserEvents.h`.

## 6.2 Output-only controls

Output-only controls expose setters but no genuine user hook.

Examples:

```c
void FG_Set_Download_Progress_Value(int32_t value);
void FG_Set_Status_Box_Visible(bool visible);
void FG_Set_Logo_Image_Source(const void * src);
void FG_Set_Device_QR_Text(const char * text);
```

## 6.3 Presentation-only controls

Presentation-only components may generate no runtime API.

Examples include:

- Text
- Heading
- static Button text
- Clock presentation
- Scale
- Line
- Icon
- Divider

Do not invent unsupported runtime APIs for presentation-only components.

---

# 7. Silent Setter Behaviour

Programmatic setters are intentionally silent.

This call:

```c
FG_Set_Main_Switch_Checked(true);
```

must not call:

```c
FG_On_Main_Switch_Changed(true);
```

The hook represents genuine user interaction.

The setter represents application-to-UI state synchronization.

This prevents feedback loops such as:

```text
Application calls setter
    ↓
Setter triggers hook
    ↓
Hook calls application
    ↓
Application calls setter again
    ↓
Loop
```

The correct flow is:

```text
Application changes state
    ↓
Application calls setter
    ↓
UI updates silently
```

and separately:

```text
User changes UI
    ↓
Hook is called
    ↓
Application validates and applies request
```

---

# 8. Keep Hooks Small

Good:

```c
void FG_On_Start_Button_Clicked(void)
{
    app_machine_request_start();
}
```

Good:

```c
void FG_On_Main_Power_Toggled(bool enabled)
{
    app_power_request(enabled);
}
```

Avoid:

```c
void FG_On_Start_Button_Clicked(void)
{
    /*
     * Large blocks of:
     * - GPIO setup
     * - sensor polling
     * - retries
     * - timeouts
     * - state machine logic
     * - logging
     * - persistence
     * - network publishing
     */
}
```

The hook should translate UI intent into an application operation.

---

# 9. Example: Relay Output Driver

## 9.1 `app_io.h`

```c
#pragma once

#include <stdbool.h>
#include "esp_err.h"

esp_err_t app_io_init(void);

void app_relay_set(bool enabled);
bool app_relay_is_enabled(void);
```

## 9.2 `app_io.c`

```c
#include "app_io.h"

#include "driver/gpio.h"

#define APP_RELAY_GPIO GPIO_NUM_5

static bool s_relay_enabled;

esp_err_t app_io_init(void)
{
    const gpio_config_t config = {
        .pin_bit_mask = 1ULL << APP_RELAY_GPIO,
        .mode = GPIO_MODE_OUTPUT,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE,
    };

    const esp_err_t err = gpio_config(&config);

    if (err != ESP_OK)
    {
        return err;
    }

    app_relay_set(false);
    return ESP_OK;
}

void app_relay_set(bool enabled)
{
    s_relay_enabled = enabled;

    gpio_set_level(
        APP_RELAY_GPIO,
        enabled ? 1 : 0
    );
}

bool app_relay_is_enabled(void)
{
    return s_relay_enabled;
}
```

---

# 10. Example: Interactive Button Toggles a Relay

This example assumes the Canvas component is an Interactive Button named `Relay Button`, so `95_UserEvents.h` contains `FG_On_Relay_Button_Clicked(void)`. A Standard presentation Button does not produce this hook.

```c
#include "95_UserEvents.h"

#include "app_io.h"
#include "90_Studio_Export.h"

void FG_On_Relay_Button_Clicked(void)
{
    const bool next_state =
        !app_relay_is_enabled();

    app_relay_set(next_state);

    FG_Set_Relay_Status_LED(next_state);
}
```

Recommended flow:

```text
UI click
    ↓
Application changes relay
    ↓
Application reads or retains resulting relay state
    ↓
Application updates UI
```

The UI should reflect application truth.

---

# 11. Example: Separate Start and Stop Buttons

This example assumes Interactive Buttons (or IconButtons with matching generated names). Verify both click declarations in `95_UserEvents.h`.

```c
#include "95_UserEvents.h"

#include "app_control.h"
#include "90_Studio_Export.h"

void FG_On_Start_Pump_Clicked(void)
{
    const esp_err_t err = app_pump_start();

    if (err == ESP_OK)
    {
        FG_Set_Pump_Running_LED(true);
        FG_Set_Pump_Fault_LED(false);
    }
    else
    {
        FG_Set_Pump_Running_LED(false);
        FG_Set_Pump_Fault_LED(true);
        FG_Show_Pump_Error_Message();
    }
}

void FG_On_Stop_Pump_Clicked(void)
{
    app_pump_stop();

    FG_Set_Pump_Running_LED(false);
}
```

---

# 12. Example: Toggle Switch Controls a Relay

This is the artwork-backed Interactive Toggle contract. It generates `FG_On_<Name>_Toggled(bool enabled)` and does not currently generate a programmatic Checked setter.

```c
#include "95_UserEvents.h"

#include "app_io.h"
#include "90_Studio_Export.h"

void FG_On_Main_Relay_Toggled(bool enabled)
{
    app_relay_set(enabled);

    FG_Set_Relay_Status_LED(
        app_relay_is_enabled()
    );
}
```

---

# 13. Example: Rejecting an Unsafe UI Request

A UI request may be rejected by product rules.

Use a Standard Switch when the application must silently restore the displayed checked state:

```c
void FG_On_Main_Relay_Switch_Changed(
    bool checked)
{
    const bool permitted =
        app_machine_can_change_relay();

    if (!permitted)
    {
        /*
         * Restore the UI to the real application state.
         * The setter is silent, so the hook will not fire again.
         */
        FG_Set_Main_Relay_Switch_Checked(
            app_relay_is_enabled()
        );

        FG_Show_Operation_Blocked_Message();
        return;
    }

    app_relay_set(checked);
    FG_Set_Relay_Status_LED(checked);
}
```

This pattern is important for:

- safety interlocks
- invalid operating modes
- missing sensors
- over-temperature protection
- locked settings
- access control
- disconnected hardware
- unavailable services

---

# 14. Example: Interactive Button Calls an Application Service

```c
void FG_On_Reset_Alarm_Clicked(void)
{
    app_alarm_request_reset();
}
```

Application layer:

```c
esp_err_t app_alarm_request_reset(void)
{
    if (!app_alarm_can_reset())
    {
        return ESP_ERR_INVALID_STATE;
    }

    app_alarm_clear_latched_faults();
    app_ui_set_alarm_active(false);

    return ESP_OK;
}
```

UI adapter:

```c
void app_ui_set_alarm_active(bool active)
{
    FG_Set_Alarm_LED(active);
    FG_Set_Alarm_Status(active);
}
```

## 14.1 Interactive Light and Status Indicator Outputs

Both artwork-backed output families use the same setter-only direction:

```c
void app_ui_set_alarm_outputs(bool active)
{
    FG_Set_Alarm_Light(active);
    FG_Set_Alarm_Status_Indicator(active);
}
```

The exact function stem comes from the configured component name. Neither Interactive Light nor Interactive Status Indicator generates an `FG_On_*` hook. Hardware input must first update application state; the application then calls these setters to project that truth.

---

# 15. Example: Three-Position Mode Selector

ForgeUI generates:

```c
typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;
```

Application enum:

```c
typedef enum
{
    APP_MODE_MANUAL,
    APP_MODE_STOPPED,
    APP_MODE_AUTOMATIC
} app_machine_mode_t;
```

Hook:

```c
void FG_On_Mode_Selector_Changed(
    fg_three_way_state_t state)
{
    switch (state)
    {
        case FG_THREE_WAY_LEFT:
            app_machine_set_mode(
                APP_MODE_MANUAL
            );
            break;

        case FG_THREE_WAY_CENTER:
            app_machine_set_mode(
                APP_MODE_STOPPED
            );
            break;

        case FG_THREE_WAY_RIGHT:
            app_machine_set_mode(
                APP_MODE_AUTOMATIC
            );
            break;

        default:
            app_machine_set_mode(
                APP_MODE_STOPPED
            );
            break;
    }
}
```

Do not convert a three-position control into a Boolean value.

Preserve the generated enum contract.

---

# 16. Example: Physical Push Button Updates the UI

A physical GPIO button may change application state.

Do not call generated UI functions directly from a GPIO ISR.

Use a queue or task notification.

## 16.1 Event definitions

```c
typedef enum
{
    APP_EVENT_PHYSICAL_START_BUTTON,
    APP_EVENT_PHYSICAL_STOP_BUTTON
} app_event_type_t;

typedef struct
{
    app_event_type_t type;
} app_event_t;
```

## 16.2 ISR

```c
static QueueHandle_t s_app_event_queue;

static void IRAM_ATTR physical_button_isr(
    void *arg)
{
    const app_event_t event = {
        .type =
            APP_EVENT_PHYSICAL_START_BUTTON,
    };

    BaseType_t task_woken = pdFALSE;

    xQueueSendFromISR(
        s_app_event_queue,
        &event,
        &task_woken
    );

    portYIELD_FROM_ISR(task_woken);
}
```

## 16.3 Event task

```c
static void app_event_task(void *arg)
{
    app_event_t event;

    while (true)
    {
        if (xQueueReceive(
                s_app_event_queue,
                &event,
                portMAX_DELAY) != pdTRUE)
        {
            continue;
        }

        switch (event.type)
        {
            case APP_EVENT_PHYSICAL_START_BUTTON:
                app_machine_request_start();
                app_ui_set_machine_running(true);
                break;

            case APP_EVENT_PHYSICAL_STOP_BUTTON:
                app_machine_request_stop();
                app_ui_set_machine_running(false);
                break;
        }
    }
}
```

---

# 17. Example: Debounced Physical Button

A simple polling debounce task:

```c
#define START_BUTTON_GPIO GPIO_NUM_6
#define DEBOUNCE_MS 30

static bool read_start_button(void)
{
    return gpio_get_level(
        START_BUTTON_GPIO
    ) == 0;
}

static void physical_button_task(void *arg)
{
    bool previous_stable_state = false;
    bool last_sample = false;
    TickType_t changed_at = xTaskGetTickCount();

    while (true)
    {
        const bool sample =
            read_start_button();

        if (sample != last_sample)
        {
            last_sample = sample;
            changed_at = xTaskGetTickCount();
        }

        const TickType_t stable_ticks =
            xTaskGetTickCount() - changed_at;

        if (stable_ticks >=
            pdMS_TO_TICKS(DEBOUNCE_MS))
        {
            if (sample != previous_stable_state)
            {
                previous_stable_state = sample;

                if (sample)
                {
                    app_machine_request_start();
                    app_ui_set_machine_running(true);
                }
            }
        }

        vTaskDelay(pdMS_TO_TICKS(5));
    }
}
```

---

# 18. LVGL Thread-Safety

Generated ForgeUI APIs update LVGL objects.

Do not call them directly from:

- interrupt service routines
- high-frequency timer ISRs
- arbitrary tasks without the required LVGL lock
- callbacks running outside the LVGL execution context

Safe pattern:

```text
ISR or worker
    ↓
Queue or task notification
    ↓
Application/UI task
    ↓
FG_Set_*()
```

In the queue examples below, the consumer task is assumed to be the application’s designated UI-update task and to use the project’s existing display/LVGL lock where required. A queue alone changes execution context; it does not automatically make an arbitrary consumer an LVGL owner.

If the board support package exposes a display lock, use it.

Representative shape:

```c
if (bsp_display_lock(100))
{
    FG_Set_Tank_Level_Bar(level);
    bsp_display_unlock();
}
```

The exact lock API depends on the BSP and project configuration.

Do not create a second LVGL task or competing lock architecture without reviewing the existing firmware.

---

# 19. Application-Owned UI Adapter

Centralize application-to-UI updates.

## 19.1 `app_ui.h`

```c
#pragma once

#include <stdbool.h>
#include <stdint.h>

void app_ui_set_machine_running(bool running);
void app_ui_set_tank_level(int32_t percent);
void app_ui_set_temperature(int32_t celsius);
void app_ui_set_network_connected(bool connected);
void app_ui_set_fault(bool faulted);
```

## 19.2 `app_ui.c`

```c
#include "app_ui.h"

#include "90_Studio_Export.h"

void app_ui_set_machine_running(bool running)
{
    FG_Set_Machine_Running_LED(running);
    FG_Set_Machine_Status_Box_Visible(true);
}

void app_ui_set_tank_level(int32_t percent)
{
    if (percent < 0)
    {
        percent = 0;
    }
    else if (percent > 100)
    {
        percent = 100;
    }

    FG_Set_Tank_Level_Bar(percent);
    FG_Set_Low_Level_LED(percent <= 15);
}

void app_ui_set_temperature(int32_t celsius)
{
    FG_Set_Temperature_Bar(celsius);
    FG_Set_High_Temperature_LED(
        celsius >= 80
    );
}

void app_ui_set_network_connected(
    bool connected)
{
    FG_Set_Network_Status(connected);
}

void app_ui_set_fault(bool faulted)
{
    FG_Set_Fault_LED(faulted);

    if (faulted)
    {
        FG_Show_Fault_Message();
    }
    else
    {
        FG_Close_Fault_Message();
    }
}
```

Benefits:

- generated names are isolated
- UI calls are not scattered through drivers
- UI changes are easier to maintain
- application code is easier to test
- future UI redesigns affect fewer files

---

# 20. Example: Sensor Task Updates a Bar

```c
static void tank_sensor_task(void *arg)
{
    while (true)
    {
        const int32_t level_percent =
            app_tank_read_percent();

        app_ui_set_tank_level(
            level_percent
        );

        vTaskDelay(pdMS_TO_TICKS(250));
    }
}
```

---

# 21. Example: ADC Sensor Conversion

```c
static int32_t raw_to_percent(
    int raw,
    int raw_empty,
    int raw_full)
{
    if (raw <= raw_empty)
    {
        return 0;
    }

    if (raw >= raw_full)
    {
        return 100;
    }

    return
        ((raw - raw_empty) * 100) /
        (raw_full - raw_empty);
}
```

Sensor task:

```c
static void level_sensor_task(void *arg)
{
    while (true)
    {
        const int raw =
            app_adc_read_level_raw();

        const int32_t percent =
            raw_to_percent(
                raw,
                APP_LEVEL_RAW_EMPTY,
                APP_LEVEL_RAW_FULL
            );

        app_ui_set_tank_level(percent);

        vTaskDelay(pdMS_TO_TICKS(200));
    }
}
```

---

# 22. Example: Filtered Sensor Value

```c
typedef struct
{
    int32_t samples[8];
    size_t index;
    size_t count;
} moving_average_t;

static int32_t moving_average_add(
    moving_average_t *filter,
    int32_t sample)
{
    filter->samples[filter->index] = sample;

    filter->index =
        (filter->index + 1) %
        (sizeof(filter->samples) /
         sizeof(filter->samples[0]));

    if (filter->count <
        sizeof(filter->samples) /
        sizeof(filter->samples[0]))
    {
        filter->count++;
    }

    int64_t total = 0;

    for (size_t i = 0;
         i < filter->count;
         ++i)
    {
        total += filter->samples[i];
    }

    return (int32_t)(
        total / (int64_t)filter->count
    );
}
```

Usage:

```c
static moving_average_t s_pressure_filter;

static void pressure_task(void *arg)
{
    while (true)
    {
        const int32_t raw_pressure =
            app_pressure_read_kpa();

        const int32_t filtered =
            moving_average_add(
                &s_pressure_filter,
                raw_pressure
            );

        FG_Set_Pressure_Bar(filtered);

        vTaskDelay(pdMS_TO_TICKS(100));
    }
}
```

---

# 23. Example: Temperature Sensor and Alarm

```c
static void temperature_task(void *arg)
{
    while (true)
    {
        const int32_t temperature =
            app_temperature_read_celsius();

        app_ui_set_temperature(
            temperature
        );

        if (temperature >= 90)
        {
            app_machine_request_stop();
            app_alarm_raise(
                APP_ALARM_OVER_TEMPERATURE
            );
        }

        vTaskDelay(pdMS_TO_TICKS(500));
    }
}
```

---

# 24. Example: Number Input Sets a Target

```c
void FG_On_Target_Temperature_Changed(
    int32_t value)
{
    app_temperature_set_target(value);
}
```

Application may reject an invalid target:

```c
void FG_On_Target_Temperature_Changed(
    int32_t value)
{
    if (value < 5 || value > 95)
    {
        FG_Set_Target_Temperature_Value(
            app_temperature_get_target()
        );

        FG_Show_Invalid_Target_Message();
        return;
    }

    app_temperature_set_target(value);
}
```

---

# 25. Example: Input Updates Device Name

```c
void FG_On_Device_Name_Changed(
    const char *text)
{
    if (!text)
    {
        return;
    }

    app_settings_set_device_name(text);
}
```

Restoring saved state:

```c
void app_ui_load_settings(void)
{
    FG_Set_Device_Name_Text(
        app_settings_get_device_name()
    );
}
```

The setter remains silent.

---

# 26. Example: Textarea Stores Notes

```c
void FG_On_Notes_Textarea_Changed(
    const char *text)
{
    app_settings_set_notes(
        text ? text : ""
    );
}
```

If the text must remain available later, copy it into application-owned storage.

Do not retain a callback pointer beyond the callback lifetime unless the generated contract explicitly guarantees that lifetime.

---

# 27. Example: Checkbox Enables Logging

```c
void FG_On_Enable_Logging_Changed(
    bool checked)
{
    app_logging_set_enabled(checked);
}
```

Restore current state:

```c
FG_Set_Enable_Logging_Checked(
    app_logging_is_enabled()
);
```

---

# 28. Example: Radio Selection

Current Radio components are independent.

They are not automatically mutually exclusive.

```c
void FG_On_Manual_Mode_Radio_Changed(
    bool selected)
{
    if (selected)
    {
        app_machine_set_mode(
            APP_MODE_MANUAL
        );
    }
}
```

For mutual exclusion, the application must coordinate state:

```c
void FG_On_Manual_Mode_Radio_Changed(
    bool selected)
{
    if (!selected)
    {
        return;
    }

    app_machine_set_mode(
        APP_MODE_MANUAL
    );

    FG_Set_Automatic_Mode_Radio_Selected(
        false
    );

    FG_Set_Service_Mode_Radio_Selected(
        false
    );
}
```

Because setters are silent, this does not recursively trigger the other hooks.

---

# 29. Example: Select or Roller Changes Mode

```c
void FG_On_Mode_Select_Changed(
    uint32_t index,
    const char *text)
{
    (void)text;

    switch (index)
    {
        case 0:
            app_machine_set_speed(
                APP_SPEED_LOW
            );
            break;

        case 1:
            app_machine_set_speed(
                APP_SPEED_MEDIUM
            );
            break;

        case 2:
            app_machine_set_speed(
                APP_SPEED_HIGH
            );
            break;

        default:
            app_machine_set_speed(
                APP_SPEED_LOW
            );
            break;
    }
}
```

Copy text if it must survive after the callback returns:

```c
static char s_selected_mode[32];

void FG_On_Mode_Select_Changed(
    uint32_t index,
    const char *text)
{
    (void)index;

    snprintf(
        s_selected_mode,
        sizeof(s_selected_mode),
        "%s",
        text ? text : ""
    );
}
```

---

# 30. Example: TabView Selection Hook

```c
void FG_On_Main_Tabs_Changed(
    uint32_t tab_index)
{
    app_navigation_set_active_tab(
        tab_index
    );
}
```

Programmatic selection:

```c
FG_Set_Main_Tabs_Selected(2);
```

The setter is silent.

---

# 31. Example: TileView Selection Hook

```c
void FG_On_Main_Tileview_Changed(
    uint32_t column,
    uint32_t row)
{
    app_navigation_set_tile(
        column,
        row
    );
}
```

Programmatic selection:

```c
FG_Set_Main_Tileview_Selected(
    1,
    0
);
```

The current generated TileView model uses the implemented fixed coordinate layout defined by the project.

Do not assume arbitrary sparse coordinates unless the project adds that feature.

---

# 32. Example: Icon Button Clears Faults

```c
void FG_On_Clear_Faults_Icon_Button_Clicked(
    void)
{
    app_faults_clear();

    FG_Set_Fault_LED(false);
    FG_Close_Fault_Message();
}
```

Enable or disable the action:

```c
FG_Set_Clear_Faults_Icon_Button_Enabled(
    app_faults_can_clear()
);
```

---

# 33. Example: Progress Output

```c
void app_update_download_progress(
    int32_t percent)
{
    FG_Set_Download_Progress_Value(
        percent
    );
}
```

Progress is output-only.

No user hook should be expected.

---

# 34. Example: Chart Streaming

```c
void app_ui_add_temperature_sample(
    int32_t temperature)
{
    FG_Add_Temperature_Chart_Point(
        temperature
    );
}
```

Clear the chart:

```c
void app_test_begin(void)
{
    FG_Clear_Temperature_Chart();
}
```

Identical consecutive values remain valid samples.

---

# 35. Example: Message Box Button Handling

Use the exact generated signature.

Representative pattern:

```c
void FG_On_Delete_Message_Button_Pressed(
    uint32_t index,
    const char *text)
{
    if (index == 0)
    {
        app_delete_selected_item();
    }

    FG_Close_Delete_Message();
}
```

Do not assume button ordering without checking the configured component and generated header.

---

# 36. Example: Calendar Date Selection

```c
void FG_On_Service_Calendar_Date_Changed(
    uint16_t year,
    uint8_t month,
    uint8_t day)
{
    app_service_set_date(
        year,
        month,
        day
    );
}
```

Programmatic date update:

```c
FG_Set_Service_Calendar_Date(
    2026,
    8,
    15
);
```

Use the generated date validation contract.

---

# 37. Example: Image Source Replacement

A generated Image API accepts a raw LVGL image source pointer.

```c
LV_IMAGE_DECLARE(fg_icon_warning);

FG_Set_Status_Image_Source(
    &fg_icon_warning
);
```

It does not accept:

- filenames
- URLs
- uploaded asset IDs
- browser paths

Only valid LVGL source pointers should be passed.

The symbol must be linked into the application and declared in the calling translation unit. The generated asset filename/symbol and generated CMake source list are authoritative; do not derive a symbol from a Studio asset ID or URL.

---

# 38. Example: Box Visibility

```c
FG_Set_Advanced_Settings_Box_Visible(
    app_user_is_admin()
);
```

A Box is useful for showing or hiding a group of child controls together.

Use parent Box visibility instead of inventing individual runtime visibility APIs for presentation-only children such as Dividers.

---

## 38.1 Example: QR Code Text from Application State

QR Code is output-only. It exposes a silent Text setter and no user hook:

```c
void app_ui_show_pairing_url(
    const char *pairing_url)
{
    FG_Set_Device_QR_Text(
        pairing_url ? pairing_url : ""
    );
}
```

The generated setter accepts text to encode, not bitmap data, a Studio asset ID or an LVGL image source. Keep the supplied string valid for the lifetime of the call; the native generated QR object performs the update. Physical scan proof still belongs in the product’s hardware validation.

---

# 39. Example: MQTT Connection Status

Do not update LVGL directly from an arbitrary MQTT callback unless that callback runs in the correct UI context.

Post an event.

```c
typedef enum
{
    APP_UI_EVENT_MQTT_CONNECTED,
    APP_UI_EVENT_MQTT_DISCONNECTED
} app_ui_event_type_t;
```

```c
typedef struct
{
    app_ui_event_type_t type;
} app_ui_event_t;
```

MQTT callback:

```c
void app_mqtt_status_changed(
    bool connected)
{
    const app_ui_event_t event = {
        .type = connected
            ? APP_UI_EVENT_MQTT_CONNECTED
            : APP_UI_EVENT_MQTT_DISCONNECTED,
    };

    xQueueSend(
        s_ui_event_queue,
        &event,
        0
    );
}
```

UI event task:

```c
static void ui_event_task(void *arg)
{
    app_ui_event_t event;

    while (true)
    {
        if (xQueueReceive(
                s_ui_event_queue,
                &event,
                portMAX_DELAY) != pdTRUE)
        {
            continue;
        }

        switch (event.type)
        {
            case APP_UI_EVENT_MQTT_CONNECTED:
                app_ui_set_network_connected(
                    true
                );
                break;

            case APP_UI_EVENT_MQTT_DISCONNECTED:
                app_ui_set_network_connected(
                    false
                );
                break;
        }
    }
}
```

---

# 40. Example: MQTT Publish from a UI Hook

```c
void FG_On_Send_Command_Clicked(void)
{
    const char *payload =
        app_command_build_payload();

    app_mqtt_publish(
        "machine/command",
        payload
    );
}
```

Keep broker logic outside the hook.

---

# 41. Example: BLE Connection State

```c
void app_ble_connection_changed(
    bool connected)
{
    app_ui_set_ble_connected(
        connected
    );
}
```

UI adapter:

```c
void app_ui_set_ble_connected(
    bool connected)
{
    FG_Set_BLE_Status(connected);
}
```

---

# 42. Example: CAN Data Updates a Gauge-Like Bar

```c
void app_can_speed_received(
    uint16_t rpm)
{
    const int32_t display_value =
        rpm > 6000 ? 6000 : rpm;

    FG_Set_Engine_RPM_Bar(
        display_value
    );
}
```

For thread safety, queue the update if the CAN receive callback is outside the UI context.

---

# 43. Example: Modbus Register Updates

```c
void app_modbus_register_changed(
    uint16_t address,
    uint16_t value)
{
    switch (address)
    {
        case 100:
            app_ui_set_tank_level(
                (int32_t)value
            );
            break;

        case 101:
            app_ui_set_temperature(
                (int32_t)value
            );
            break;

        default:
            break;
    }
}
```

---

# 44. Example: Network Command Updates UI and Hardware

```c
void app_remote_set_relay(
    bool enabled)
{
    if (!app_machine_can_change_relay())
    {
        return;
    }

    app_relay_set(enabled);

    FG_Set_Main_Relay_Switch_Checked(enabled);
    FG_Set_Relay_Status_LED(enabled);
}
```

This is the same pattern as a UI request.

The source of the command changes.

The application remains authoritative.

---

## 44.1 Example: HTTP or OTA Progress

HTTP and OTA callbacks commonly run outside the UI task. Convert byte progress into application state and post it to the existing UI queue:

```c
/* Add UI_EVENT_SET_OTA_PROGRESS to ui_event_type_t. */
void app_ota_progress(
    size_t received,
    size_t total)
{
    if (total == 0)
    {
        return;
    }

    const int32_t percent =
        (int32_t)((received * 100U) / total);

    const ui_event_t event = {
        .type = UI_EVENT_SET_OTA_PROGRESS,
        .value.integer = percent,
    };

    xQueueSend(s_ui_queue, &event, 0);
}
```

The UI queue consumer may call:

```c
FG_Set_OTA_Progress_Value(percent);
```

Use a Progress component for this output. Do not call the generated setter directly from the HTTP transport callback unless that callback is already executing under the project’s UI ownership rules.

---

# 45. Example: Timer Updates a Clock-Adjacent Status

Clock display time is RTC-owned.

Application code should not invent a Clock setter if none exists.

A periodic timer may update a separate status LED or Bar:

```c
static void status_timer_callback(
    TimerHandle_t timer)
{
    const bool healthy =
        app_health_check();

    /*
     * Queue this if the timer callback
     * is not in a safe LVGL context.
     */
    app_ui_set_health_status(healthy);
}
```

---

## 45.1 Example: `esp_timer` Posts Work to the UI Task

An `esp_timer` callback should remain short. Post an event rather than calling LVGL-backed APIs directly:

```c
static void telemetry_timer_callback(void *arg)
{
    const ui_event_t event = {
        .type = UI_EVENT_REFRESH_TELEMETRY,
    };

    xQueueSend(s_ui_queue, &event, 0);
}
```

The queue consumer reads application-owned telemetry and calls the generated setters. The same rule applies to FreeRTOS software-timer callbacks: treat them as producers, not UI owners.

## 45.2 Example: Event Group Projects Connection State

Event Groups are useful for application state coordination. A task may wait for state changes and then post a UI update:

```c
#define APP_NETWORK_CHANGED_BIT BIT0

static void network_projection_task(void *arg)
{
    while (true)
    {
        xEventGroupWaitBits(
            s_app_events,
            APP_NETWORK_CHANGED_BIT,
            pdTRUE,
            pdFALSE,
            portMAX_DELAY
        );

        app_ui_post_network_connected(
            app_network_is_connected()
        );
    }
}
```

ESP-IDF Wi-Fi event handlers should set/clear application bits or post application events. They should not manipulate generated LVGL objects directly.

---

# 46. Example: SD Logging State

```c
void app_logging_started(void)
{
    FG_Set_Logging_Status(true);
}

void app_logging_stopped(void)
{
    FG_Set_Logging_Status(false);
}
```

The built-in Storage Runtime remains separate from application-owned logging behaviour.

Do not move filesystem truth into generated UI code.

---

## 46.1 Example: NVS Settings Synchronization

NVS owns persisted product settings; generated startup values do not. Load settings during application initialization, apply them to hardware, then project the accepted values after UI creation:

```c
void app_settings_apply_after_ui_create(void)
{
    const int32_t target =
        app_settings_get_target_temperature();

    app_temperature_set_target(target);
    FG_Set_Target_Temperature_Value(
        app_temperature_get_target()
    );
}
```

When a NumberInput hook changes a setting, validate it in the application, persist the accepted value through the settings module, and silently restore the UI setter if persistence or validation fails.

---

# 47. Example: Application State Machine

This example assumes `Start Button` is an IconButton because it uses the generated Enabled setter.

```c
typedef enum
{
    APP_STATE_IDLE,
    APP_STATE_STARTING,
    APP_STATE_RUNNING,
    APP_STATE_STOPPING,
    APP_STATE_FAULT
} app_state_t;
```

Application state transition:

```c
static void app_set_state(
    app_state_t state)
{
    s_state = state;
    app_ui_apply_state(state);
}
```

UI projection:

```c
void app_ui_apply_state(
    app_state_t state)
{
    switch (state)
    {
        case APP_STATE_IDLE:
            FG_Set_Running_LED(false);
            FG_Set_Fault_LED(false);
            FG_Set_Start_Button_Enabled(true);
            break;

        case APP_STATE_STARTING:
            FG_Set_Running_LED(false);
            FG_Set_Start_Button_Enabled(false);
            break;

        case APP_STATE_RUNNING:
            FG_Set_Running_LED(true);
            FG_Set_Fault_LED(false);
            FG_Set_Start_Button_Enabled(false);
            break;

        case APP_STATE_STOPPING:
            FG_Set_Running_LED(false);
            break;

        case APP_STATE_FAULT:
            FG_Set_Running_LED(false);
            FG_Set_Fault_LED(true);
            FG_Show_Fault_Message();
            break;
    }
}
```

The application state machine owns truth.

The UI projects it.

---

# 48. Example: Startup Synchronization

After the generated UI exists, synchronize it with current application state.

```c
void app_ui_sync_all(void)
{
    FG_Set_Main_Relay_Switch_Checked(
        app_relay_is_enabled()
    );

    FG_Set_Relay_Status_LED(
        app_relay_is_enabled()
    );

    FG_Set_Enable_Logging_Checked(
        app_logging_is_enabled()
    );

    FG_Set_Target_Temperature_Value(
        app_temperature_get_target()
    );

    FG_Set_Mode_Select_Selected_Index(
        app_machine_get_mode_index()
    );
}
```

Do not rely on generated startup defaults as permanent application truth.

---

# 49. Example: Error Handling

```c
void FG_On_Start_Machine_Clicked(void)
{
    const esp_err_t err =
        app_machine_request_start();

    if (err == ESP_OK)
    {
        return;
    }

    FG_Set_Machine_Running_LED(false);
    FG_Set_Fault_LED(true);
    FG_Show_Start_Failed_Message();
}
```

Log the reason in the application:

```c
ESP_LOGE(
    TAG,
    "Start failed: %s",
    esp_err_to_name(err)
);
```

---

# 50. Example: Rate-Limiting UI Updates

Do not update the UI more often than useful.

Poor:

```c
while (true)
{
    FG_Set_Level_Bar(
        app_sensor_read()
    );
}
```

Better:

```c
while (true)
{
    const int32_t value =
        app_sensor_read();

    if (value != previous_value)
    {
        previous_value = value;
        app_ui_set_tank_level(value);
    }

    vTaskDelay(pdMS_TO_TICKS(100));
}
```

Generated setters often suppress repeated effective values, but application-level rate control still reduces work and noise.

---

# 51. Example: Queue-Based UI Dispatcher

For larger projects, use one UI event queue.

```c
typedef enum
{
    UI_EVENT_SET_TANK_LEVEL,
    UI_EVENT_SET_TEMPERATURE,
    UI_EVENT_SET_NETWORK,
    UI_EVENT_SET_FAULT
} ui_event_type_t;

typedef struct
{
    ui_event_type_t type;

    union
    {
        int32_t integer;
        bool boolean;
    } value;
} ui_event_t;
```

Producer:

```c
void app_ui_post_tank_level(
    int32_t level)
{
    const ui_event_t event = {
        .type = UI_EVENT_SET_TANK_LEVEL,
        .value.integer = level,
    };

    xQueueSend(
        s_ui_queue,
        &event,
        0
    );
}
```

Consumer:

```c
static void app_ui_task(void *arg)
{
    ui_event_t event;

    while (true)
    {
        if (xQueueReceive(
                s_ui_queue,
                &event,
                portMAX_DELAY) != pdTRUE)
        {
            continue;
        }

        switch (event.type)
        {
            case UI_EVENT_SET_TANK_LEVEL:
                app_ui_set_tank_level(
                    event.value.integer
                );
                break;

            case UI_EVENT_SET_TEMPERATURE:
                app_ui_set_temperature(
                    event.value.integer
                );
                break;

            case UI_EVENT_SET_NETWORK:
                app_ui_set_network_connected(
                    event.value.boolean
                );
                break;

            case UI_EVENT_SET_FAULT:
                app_ui_set_fault(
                    event.value.boolean
                );
                break;
        }
    }
}
```

This task must follow the existing BSP display-lock/UI-task contract before calling the `app_ui_*` functions if those functions invoke generated UI APIs.

---

# 52. Example: Command Queue from UI Hooks

UI hooks can post commands to a control task.

```c
typedef enum
{
    APP_COMMAND_START,
    APP_COMMAND_STOP,
    APP_COMMAND_RESET_FAULT
} app_command_type_t;
```

Hook:

```c
void FG_On_Start_Clicked(void)
{
    const app_command_type_t command =
        APP_COMMAND_START;

    xQueueSend(
        s_command_queue,
        &command,
        0
    );
}
```

Control task:

```c
static void control_task(void *arg)
{
    app_command_type_t command;

    while (true)
    {
        if (xQueueReceive(
                s_command_queue,
                &command,
                portMAX_DELAY) != pdTRUE)
        {
            continue;
        }

        switch (command)
        {
            case APP_COMMAND_START:
                app_machine_request_start();
                break;

            case APP_COMMAND_STOP:
                app_machine_request_stop();
                break;

            case APP_COMMAND_RESET_FAULT:
                app_faults_clear();
                break;
        }
    }
}
```

This prevents the UI event callback from blocking on slow operations.

---

# 53. Avoid Blocking Inside Hooks

Avoid:

```c
void FG_On_Start_Clicked(void)
{
    vTaskDelay(pdMS_TO_TICKS(5000));
    app_machine_start();
}
```

Avoid:

```c
void FG_On_Connect_Clicked(void)
{
    while (!network_connected())
    {
        /* Busy wait */
    }
}
```

Instead:

```c
void FG_On_Start_Clicked(void)
{
    app_machine_request_start_async();
}
```

Then update the UI when the operation completes.

---

# 54. Avoid Hardware Initialization Inside Hooks

Poor:

```c
void FG_On_Relay_Clicked(void)
{
    gpio_config(...);
    gpio_set_level(...);
}
```

Better:

```c
void app_main(void)
{
    app_io_init();
}
```

Then:

```c
void FG_On_Relay_Clicked(void)
{
    app_relay_set(true);
}
```

Initialize hardware once.

Use hooks for intent.

---

# 55. Avoid Direct LVGL Object Access

Do not reach into generated object variables.

Avoid:

```c
extern lv_obj_t *obj17;
lv_obj_add_flag(obj17, LV_OBJ_FLAG_HIDDEN);
```

Use the generated public API:

```c
FG_Set_Status_Box_Visible(false);
```

Generated internal object names are not stable developer APIs.

---

# 56. Avoid Editing Generated Hooks by Signature Guessing

Use the exact generated declarations.

Do not guess:

```c
void FG_On_ModeChanged(int value);
```

Use:

```c
void FG_On_Mode_Select_Changed(
    uint32_t index,
    const char *text);
```

The generated header is authoritative.

---

# 57. Avoid Treating Preview State as Runtime Truth

Canvas and Browser Preview may use temporary local interaction state.

That state does not necessarily mutate:

- serialized project data
- application state
- generated startup state
- physical hardware state

The exported application must still synchronize UI state with application truth.

---

# 58. Input and Output Examples by Component Family

| Component | Application updates UI | User interaction reaches application |
| --- | --- | --- |
| LED | `FG_Set_<Name>(bool)` | `FG_On_<Name>_Changed(bool)` where generated |
| Bar | `FG_Set_<Name>(int32_t)` | `FG_On_<Name>_Changed(int32_t)` where generated |
| Arc | `FG_Set_<Name>(int32_t)` | `FG_On_<Name>_Changed(int32_t)` |
| Chart | `FG_Add_*_Point()`, `FG_Clear_*()` | point/clear hooks where generated |
| Keyboard | `FG_Show_*()`, `FG_Hide_*()` | shown/hidden hooks |
| Calendar | `FG_Set_*_Date()` | date changed hook |
| Roller | `FG_Set_*_Selected()` | changed hook |
| Message Box | `FG_Show_*()`, `FG_Close_*()` | shown/closed/button hooks |
| Button Matrix | `FG_Set_*_Selected()` | button selected hook |
| TabView | `FG_Set_*_Selected()` | changed hook |
| TileView | `FG_Set_*_Selected(col,row)` | changed hook |
| Input | `FG_Set_*_Text()` | text changed hook |
| Textarea | `FG_Set_*_Text()` | text changed hook |
| Switch | `FG_Set_*_Checked()` | changed hook |
| Checkbox | `FG_Set_*_Checked()` | changed hook |
| Radio | `FG_Set_*_Selected()` | changed hook |
| Progress | `FG_Set_*_Value()` | none |
| NumberInput | `FG_Set_*_Value()` | changed hook |
| Select | `FG_Set_*_Selected_Index()` | changed hook |
| Image | `FG_Set_*_Source()` | none |
| QRCode | `FG_Set_*_Text()` | none |
| Box | `FG_Set_*_Visible()` | none |
| IconButton | `FG_Set_*_Enabled()` | clicked hook |
| Standard Button | none; serialized text/presentation only | none |
| Interactive Button | none required for click | `FG_On_*_Clicked()` |
| Interactive Toggle | no programmatic setter in the current contract | `FG_On_*_Toggled(bool)` |
| Interactive Three-Position | no programmatic setter in the current contract | `FG_On_*_Changed(fg_three_way_state_t)` |
| Interactive Light | `FG_Set_*(bool)` | none |
| Interactive Status Indicator | `FG_Set_*(bool)` | none |

Use the project-generated headers for exact signatures.

---

# 59. Built-In System Runtime Boundary

The built-in System Runtime includes platform-owned features such as:

- System Launcher
- Display / Brightness
- Wi-Fi Manager
- Storage Browser
- Native LVGL Keyboard

These are generated platform features.

They are not ordinary developer hooks.

Do not add product logic to internal generated System callbacks.

The built-in Wi-Fi Manager communicates with the non-generated Wi-Fi backend.

The built-in Storage Browser communicates with the non-generated SD backend.

Application-owned Wi-Fi, MQTT, BLE or cloud behaviour remains separate.

External RTC is not a System Runtime control. It is project/board hardware configuration at **ForgeUI Studio → Board: ESP32-P4 7B → Configure Hardware → Hardware Configuration → Optional Hardware → External RTC**. Persisted `firmwareFeatures.rtc` is authoritative for both Live Studio and Standalone Export, and legacy projects without that field normalize to enabled. Enabled mode supports the DS3231 at I2C `0x68` with software/NVS fallback; disabled mode emits `FG_FEATURE_RTC 0`, performs no DS3231 access and retains software/NVS time.

---

# 60. Hosted Wi-Fi Boundary

Generated Wi-Fi UI owns:

- presentation
- rows
- dialogs
- UI intent
- connected details
- internal callbacks

The backend owns:

- physical scan execution
- credentials
- DHCP
- connection policy
- reconnect
- ESP-IDF Wi-Fi calls
- Hosted transport

Do not duplicate backend logic inside application UI hooks.

---

# 61. Storage Boundary

Generated Storage UI owns:

- navigation
- rows
- paging
- selection
- presentation
- internal callbacks

The SD backend owns:

- filesystem truth
- mount state
- directory enumeration
- empty-folder detection
- deletion
- read/write testing

Do not move filesystem operations into generated UI code.

---

# 62. Safe Initialization Order

A typical application startup pattern is:

```c
void app_main(void)
{
    ESP_ERROR_CHECK(app_io_init());
    ESP_ERROR_CHECK(app_sensors_init());
    ESP_ERROR_CHECK(app_settings_init());
    ESP_ERROR_CHECK(app_control_init());

    /*
     * ForgeUI display/UI creation occurs
     * according to the generated firmware
     * startup architecture.
     */

    app_ui_sync_all();

    app_tasks_start();
}
```

Do not call generated UI setters before the generated UI objects exist.

Integrate startup synchronization at the point where UI construction is complete.

---

# 63. Testing Strategy

Test each integration in both directions.

## 63.1 UI-to-application

Verify:

```text
Touch
    ↓
Generated hook
    ↓
Application function
    ↓
Hardware result
```

## 63.2 Application-to-UI

Verify:

```text
Hardware or simulated state
    ↓
Application function
    ↓
Generated setter
    ↓
Display result
```

## 63.3 Rejected request

Verify:

```text
User requests invalid action
    ↓
Application rejects it
    ↓
UI is restored silently
    ↓
No recursive hook
```

## 63.4 Startup

Verify:

- no hooks fire during startup
- UI reflects persisted application state
- hardware initializes safely
- generated defaults do not override product state unexpectedly

---

# 64. Example Integration Test Checklist

For a relay control:

- [ ] UI button hook fires once.
- [ ] Relay changes once.
- [ ] Status LED matches relay state.
- [ ] Duplicate setter call causes no duplicate transition.
- [ ] Invalid request restores UI state.
- [ ] Startup does not energize relay unexpectedly.
- [ ] Physical button updates the same application state.
- [ ] UI and physical button remain synchronized.
- [ ] No LVGL call occurs from ISR context.
- [ ] No generated file was manually edited.

---

# 65. Common Mistakes

## Mistake 1: Editing `90_Studio_Export.c`

Why it fails:

- Studio may regenerate it
- changes are lost
- architecture becomes impossible to maintain

Correct approach:

- use `95_UserEvents.c`
- add application modules
- call generated public APIs

## Mistake 2: Calling LVGL from an ISR

Why it fails:

- LVGL is not ISR-safe
- generated objects may not be protected
- crashes or corruption may occur

Correct approach:

- queue an event
- process it in a safe task
- call generated API there

## Mistake 3: Making UI state the source of truth

Why it fails:

- hardware may reject the request
- remote commands may also change state
- startup may restore a different state

Correct approach:

- application owns truth
- UI requests changes
- application projects resulting state back to UI

## Mistake 4: Blocking inside hooks

Why it fails:

- UI becomes unresponsive
- LVGL event processing stalls
- watchdog or timing issues may appear

Correct approach:

- post a command
- run work asynchronously
- update UI on completion

## Mistake 5: Assuming every component has an API

Why it fails:

- presentation-only components intentionally have none

Correct approach:

- use a component with meaningful runtime state
- control the containing Box
- use Image for runtime image swapping
- use the exact generated headers

## Mistake 6: Treating Radio as a group

Why it fails:

- current Radio components are independent

Correct approach:

- coordinate mutual exclusion in application code

## Mistake 7: Retaining callback text pointers

Why it fails:

- callback buffer lifetime may be limited

Correct approach:

- copy text into application-owned storage

---

# 66. Full Example: Small Pump Controller

The Start and Stop controls in this example are IconButtons: the click hooks come from IconButton input and the Enabled setters come from IconButton runtime state. If artwork-backed Interactive Buttons are used instead, keep the click hooks but remove the unsupported Enabled setter calls.

## 66.1 Application state

```c
typedef enum
{
    PUMP_STATE_STOPPED,
    PUMP_STATE_RUNNING,
    PUMP_STATE_FAULT
} pump_state_t;

static pump_state_t s_pump_state;
```

## 66.2 Start request

```c
esp_err_t app_pump_start(void)
{
    if (!app_safety_allows_start())
    {
        return ESP_ERR_INVALID_STATE;
    }

    app_relay_set(true);
    s_pump_state = PUMP_STATE_RUNNING;

    app_ui_set_pump_state(
        s_pump_state
    );

    return ESP_OK;
}
```

## 66.3 Stop request

```c
void app_pump_stop(void)
{
    app_relay_set(false);
    s_pump_state = PUMP_STATE_STOPPED;

    app_ui_set_pump_state(
        s_pump_state
    );
}
```

## 66.4 UI projection

```c
void app_ui_set_pump_state(
    pump_state_t state)
{
    switch (state)
    {
        case PUMP_STATE_STOPPED:
            FG_Set_Pump_Running_LED(false);
            FG_Set_Pump_Fault_LED(false);
            FG_Set_Start_Button_Enabled(true);
            FG_Set_Stop_Button_Enabled(false);
            break;

        case PUMP_STATE_RUNNING:
            FG_Set_Pump_Running_LED(true);
            FG_Set_Pump_Fault_LED(false);
            FG_Set_Start_Button_Enabled(false);
            FG_Set_Stop_Button_Enabled(true);
            break;

        case PUMP_STATE_FAULT:
            FG_Set_Pump_Running_LED(false);
            FG_Set_Pump_Fault_LED(true);
            FG_Set_Start_Button_Enabled(false);
            FG_Set_Stop_Button_Enabled(true);
            FG_Show_Pump_Fault_Message();
            break;
    }
}
```

## 66.5 ForgeUI hooks

```c
void FG_On_Start_Button_Clicked(void)
{
    const esp_err_t err =
        app_pump_start();

    if (err != ESP_OK)
    {
        FG_Show_Start_Blocked_Message();
    }
}

void FG_On_Stop_Button_Clicked(void)
{
    app_pump_stop();
}
```

## 66.6 Sensor safety task

```c
static void pump_safety_task(void *arg)
{
    while (true)
    {
        const bool over_pressure =
            app_pressure_read_kpa() >
            APP_MAX_PRESSURE_KPA;

        if (over_pressure)
        {
            app_relay_set(false);
            s_pump_state =
                PUMP_STATE_FAULT;

            app_ui_set_pump_state(
                s_pump_state
            );
        }

        vTaskDelay(pdMS_TO_TICKS(100));
    }
}
```

This example demonstrates the complete pattern:

```text
UI request
    ↓
Application validation
    ↓
Hardware action
    ↓
Application state transition
    ↓
UI projection
```

---

# 67. Full Example: Environmental Monitor

Sensor task:

```c
static void environment_task(void *arg)
{
    while (true)
    {
        const int32_t temperature =
            app_sensor_read_temperature();

        const int32_t humidity =
            app_sensor_read_humidity();

        app_ui_set_temperature(
            temperature
        );

        FG_Set_Humidity_Bar(
            humidity
        );

        FG_Add_Temperature_Chart_Point(
            temperature
        );

        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}
```

Alarm logic:

```c
static void app_check_environment_alarm(
    int32_t temperature,
    int32_t humidity)
{
    const bool alarm =
        temperature >= 45 ||
        humidity >= 90;

    FG_Set_Environment_Alarm_LED(
        alarm
    );

    if (alarm)
    {
        FG_Show_Environment_Alarm_Message();
    }
}
```

---

# 68. Full Example: Remote and Local Control

The same application function should serve:

- touchscreen input
- physical button
- MQTT command
- BLE command
- CAN command

Application operation:

```c
esp_err_t app_set_output_enabled(
    bool enabled)
{
    if (!app_output_change_allowed())
    {
        return ESP_ERR_INVALID_STATE;
    }

    app_relay_set(enabled);

    FG_Set_Output_Switch_Checked(enabled);
    FG_Set_Output_Status_LED(enabled);

    return ESP_OK;
}
```

Touchscreen hook:

```c
void FG_On_Output_Switch_Changed(
    bool checked)
{
    const esp_err_t err =
        app_set_output_enabled(checked);

    if (err != ESP_OK)
    {
        FG_Set_Output_Switch_Checked(
            app_relay_is_enabled()
        );
    }
}
```

Physical button:

```c
void app_physical_output_button_pressed(
    void)
{
    app_set_output_enabled(
        !app_relay_is_enabled()
    );
}
```

MQTT command:

```c
void app_mqtt_output_command(
    bool enabled)
{
    app_set_output_enabled(enabled);
}
```

This avoids three separate implementations of the same product rule.

---

# 69. Developer Integration Checklist

Before calling an integration complete:

- [ ] Generated UI files remain untouched.
- [ ] Hook signatures exactly match `95_UserEvents.h`.
- [ ] Generated API calls exactly match `90_Studio_Export.h`.
- [ ] Hooks remain short.
- [ ] Application logic lives in application modules.
- [ ] Hardware is initialized outside event hooks.
- [ ] LVGL calls do not occur in ISR context.
- [ ] Slow work is posted to tasks or queues.
- [ ] Application state is authoritative.
- [ ] Programmatic setters are used to resynchronize rejected requests.
- [ ] Startup state is synchronized after UI creation.
- [ ] Callback text is copied when long-term storage is needed.
- [ ] UI update frequency is bounded.
- [ ] Error conditions update visible UI state.
- [ ] Physical and touchscreen controls use the same application functions.
- [ ] No unsupported API was invented.
- [ ] Live and standalone exports compile.
- [ ] Hardware behaviour is physically tested.

---

# 70. Final Architecture Statement

```text
ForgeUI generates the interface.

The application owns the product.

User interaction enters through FG_On_* hooks.

Application state reaches the UI through generated FG_* APIs.

Generated files remain replaceable.

Developer application code remains permanent.
```

The intended relationship is:

```text
ForgeUI UI
    ↓
Developer hook adapter
    ↓
Application state machine
    ↓
Drivers and hardware
```

and:

```text
Drivers and hardware
    ↓
Application state machine
    ↓
Application UI adapter
    ↓
Generated ForgeUI API
    ↓
Display
```

This clean boundary is what allows ForgeUI-generated projects to remain understandable, maintainable and safe to regenerate.
