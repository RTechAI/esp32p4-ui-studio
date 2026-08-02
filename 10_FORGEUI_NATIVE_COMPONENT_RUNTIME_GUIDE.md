# ForgeUI Native Component Runtime Guide

Status: **AUTHORITATIVE LIVING DEVELOPER REFERENCE** (2026-08-02).

This guide owns the post-export developer contract for every ForgeUI Native
Component. Add each new component here when its public Runtime SDK contract is
implemented or changed. Component-specific design and proof records may remain
in `docs/`, but they must link back to this runtime reference.

## 1. Purpose

ForgeUI Native Components turn application state and user intent into a small,
semantic interface:

```text
application data -> generated FG_Set_* API -> Native Component display update

user interaction -> generated LVGL event -> 95_UserEvents callback
                 -> developer application logic
```

The generated API is the supported integration surface. Developers should not
reach into the generated component's labels, bars, icons, containers or
`lv_obj_t` pointers.

## 2. Native Components versus LVGL widgets

An LVGL widget is a lower-level rendering or interaction primitive. A ForgeUI
Native Component is a Registry-owned application component, serialized as one
component, edited as one Canvas object and exported through the shared Live
Studio/Standalone generator. It may compose several private LVGL objects while
exposing application meaning as one public contract.

Avoid coupling application code to implementation details:

```c
lv_label_set_text(private_value_label, "72");
lv_bar_set_value(private_progress_bar, 72, LV_ANIM_OFF);
```

Prefer the semantic contract:

```c
FG_Set_System_Output_Value("72");
FG_Set_System_Output_Progress(72);
```

Internal LVGL composition can evolve without changing application code when
the semantic contract remains stable.

## 3. Generated naming

Public symbols use the sanitized component name when one is assigned. For a
component named `System Output`, current export produces a stem such as
`System_Output`. Duplicate stems receive deterministic `_2`, `_3` and later
suffixes. If no usable component name is present, export falls back to the
component identity, for example `Comp_MSB3_GCUWGY6_DO`.

Therefore both of these are valid current forms:

```c
FG_Set_System_Output_Value("72");
FG_Set_Comp_MSB3_GCUWGY6_DO_Value("72");
```

Assign clear, stable component names before export. After any rename or
duplication, regenerate and inspect `90_Studio_Export.h`; that generated header
is always the source of truth for the exact symbols in a particular export.

## 4. Runtime SDK ownership

- `90_Studio_Export.h` declares generated Runtime APIs.
- `90_Studio_Export.c` owns their generated LVGL implementation and private
  component objects. Do not place permanent application logic there.
- `95_UserEvents.h` declares the enabled generated hooks.
- `95_UserEvents.c` is the supported developer customization location for
  those hooks. Live Studio regeneration preserves matching hook bodies through
  its established merge path.
- Put reusable product policy, drivers and services in application-owned files;
  keep UserEvent bodies small and delegate to them.
- A Standalone exported copy becomes developer-owned under the existing export
  ownership rules, but private generated names remain an unstable integration
  surface. Prefer the public semantic API.

Declarations and implementation belong to the same generated export. Do not
copy declarations between exports or assume names from an older build.

## 5. Thread and LVGL safety

Generated Native Component setters update LVGL objects directly. Call them
from the project's LVGL/UI execution context, or while holding the selected
board support package's display/LVGL lock. Do not call them from an ISR, a
high-frequency timer ISR or an arbitrary FreeRTOS task without that protection.

For the Waveshare BSP configuration, the supported shape is:

```c
if (bsp_display_lock(100)) {
    FG_Set_System_Output_Progress(output_percent);
    bsp_display_unlock();
}
```

The exact lock API depends on the selected BSP and project configuration. A
safe cross-context flow is:

```text
ISR or worker -> queue/task notification -> designated UI-update task
              -> display/LVGL lock -> FG_Set_*()
```

A queue changes execution context but does not by itself grant LVGL ownership.
ForgeUI does not currently generate a universal cross-task UI dispatcher. Keep
hardware interrupts and drivers separate from UI calls, and follow the chosen
Board Profile/BSP locking contract.

# Native Component #1 — Dashboard Card

Status: **PROVEN**  
Hardware: **Waveshare ESP32-P4 validated**

Dashboard Card displays an application summary containing a title, primary
value, units, status text and colour, progress, optional timestamp and optional
root click interaction. Its internal frame, labels, status indicator and bar
remain private.

## Semantic properties

The serialized component owns title, optional native symbol, value, units,
secondary text, status/status text, progress, timestamp, optional accent,
section visibility, padding and click-UserEvent enablement. Progress is
normalized to `0..100`. See
[`docs/FORGEUI_DASHBOARD_CARD.md`](docs/FORGEUI_DASHBOARD_CARD.md) for its full
schema, architecture boundaries and proof record.

## Generated Runtime SDK APIs

For `<Component>`, current export emits:

```c
void FG_Set_<Component>_Value(const char * value);
void FG_Set_<Component>_Units(const char * units);
void FG_Set_<Component>_Status(const char * text, uint32_t rgb);
void FG_Set_<Component>_Progress(int32_t value);
```

- Value and Units accept display text; `NULL` is treated as empty text.
- Status updates both its display text and indicator colour.
- `rgb` is `0xRRGGBB` (for example `0x22C55E`).
- Progress clamps to `0..100`.
- Setters are silent: they do not invoke click UserEvents.
- Each API updates only its owning Dashboard Card instance.
- Duplicate names remain collision-safe.

No generated internal LVGL object name is a supported public API.

## Basic example

This example assumes the component is named `System Output`. Replace the
`FG_Set_System_Output_*` symbols with the exact declarations in your generated
`90_Studio_Export.h`.

```c
#include "90_Studio_Export.h"

#include <stdio.h>

void app_update_system_output(int output_percent)
{
    char value[16];

    if (output_percent < 0) output_percent = 0;
    if (output_percent > 100) output_percent = 100;

    snprintf(value, sizeof(value), "%d", output_percent);
    FG_Set_System_Output_Value(value);
    FG_Set_System_Output_Units("%");
    FG_Set_System_Output_Progress(output_percent);

    if (output_percent < 75) {
        FG_Set_System_Output_Status("Normal", 0x22C55E);
    } else if (output_percent < 90) {
        FG_Set_System_Output_Status("Warning", 0xF2A900);
    } else {
        FG_Set_System_Output_Status("Critical", 0xEF4444);
    }
}
```

### Status colour reference

| Meaning | Example RGB |
| --- | --- |
| Normal / healthy | `0x22C55E` |
| Warning | `0xF2A900` |
| Critical | `0xEF4444` |
| Offline / inactive | `0x64748B` |

These are practical examples, not mandatory theme values.

## Optional UserEvent

When click UserEvent generation is enabled, export declares:

```c
void FG_On_<Component>_Clicked(void);
```

Implement the exact generated hook in `95_UserEvents.c`:

```c
#include "95_UserEvents.h"

#include <stdio.h>

void FG_On_System_Output_Clicked(void)
{
    printf("System Output card clicked\n");

    /* Delegate to developer-owned application behavior here:
     * - open a detail page
     * - toggle a view
     * - request diagnostics
     * - show a dialog
     */
}
```

The Card root owns the click. Private labels and bars expose no public events,
programmatic setters do not trigger this hook, and no hook is generated unless
click UserEvent generation is enabled. Check `95_UserEvents.h` for its exact
name, including any identity fallback or collision suffix.

## Hardware integration example

Keep PWM control in its hardware driver. Let an application adapter project
the resulting state into the Card:

```c
#include "90_Studio_Export.h"

#include <stdint.h>
#include <stdio.h>

void app_update_pwm_card(uint8_t duty_percent)
{
    char value[8];

    if (duty_percent > 100) duty_percent = 100;
    snprintf(value, sizeof(value), "%u", (unsigned)duty_percent);

    FG_Set_System_Output_Value(value);
    FG_Set_System_Output_Units("%");
    FG_Set_System_Output_Progress(duty_percent);

    if (duty_percent == 0) {
        FG_Set_System_Output_Status("Off", 0x64748B);
    } else if (duty_percent <= 80) {
        FG_Set_System_Output_Status("Running", 0x22C55E);
    } else {
        FG_Set_System_Output_Status("High Output", 0xF2A900);
    }
}
```

Recommended ownership is `hardware/application state -> application adapter ->
generated semantic setter -> Dashboard Card`. Apply the thread/lock rules in
section 5 when the adapter is not already running in the UI context.

## Multiple instances

Distinct component names produce distinct instance APIs:

```c
FG_Set_Port_Output_Value("72");
FG_Set_Starboard_Output_Value("68");
```

Each setter is bound to one private object set. Duplicate names are suffixed
collision-safely, so always confirm the exact declarations after export rather
than guessing a suffix.

## Common mistakes

- Editing private generated LVGL objects directly.
- Placing permanent application logic in regenerated `90_Studio_Export.c`.
- Calling a setter belonging to a different component instance.
- Assuming progress remains outside `0..100`; the setter clamps it.
- Passing `#RRGGBB`, byte-swapped or alpha-packed values instead of `0xRRGGBB`.
- Updating LVGL from an unsafe task or ISR context.
- Expecting programmatic setters to invoke UserEvents.
- Renaming or duplicating a component without regenerating and checking the
  declarations.

## Finding the generated APIs

Inspect these files in the generated Live Studio or Standalone export:

| File | What to find |
| --- | --- |
| `90_Studio_Export.h` | Exact public setter declarations; API source of truth |
| `90_Studio_Export.c` | Generated implementation and private LVGL composition |
| `95_UserEvents.h` | Exact enabled UserEvent declarations |
| `95_UserEvents.c` | Developer customization bodies for those hooks |

# Adding future Native Components

Append one section per public component contract using this template:

## Native Component #N — Name

- Purpose and proof status.
- Semantic properties.
- Generated Runtime SDK signatures.
- Generated UserEvents and genuine-user rules.
- Value, normalization, range and silence behavior.
- Complete application example.
- Hardware/application adapter example and task-safety note.
- Multiple-instance and collision behavior.
- Known limitations and ownership boundaries.

Maintenance rule: whenever a ForgeUI Native Component is implemented or its
public Runtime SDK contract changes, update this guide in the same sprint.

## Related authoritative documents

- [`01_SPINE.md`](01_SPINE.md)
- [`02_DEVELOPER_CODE_MAP.md`](02_DEVELOPER_CODE_MAP.md)
- [`03_ForgeUI_Generated_Export_API_Code_Map.md`](03_ForgeUI_Generated_Export_API_Code_Map.md)
- [`05_DEVELOPER_GUIDE.md`](05_DEVELOPER_GUIDE.md)
- [`07_FORGEUI_RUNTIME_SDK.md`](07_FORGEUI_RUNTIME_SDK.md)
- [`docs/FORGEUI_NATIVE_WIDGET_ARCHITECTURE.md`](docs/FORGEUI_NATIVE_WIDGET_ARCHITECTURE.md)
