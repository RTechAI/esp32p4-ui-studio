# ForgeUI IO Monitor

Status: **HARDWARE VALIDATED** (2026-08-06)

## Purpose

IO Monitor is a compact, semantic, read-only diagnostics card for monitoring
controller I/O. It supports Digital Input, Digital Output, Analog Input, and
Analog Output rows. A row can present its I/O type, channel identifier,
user-facing label, current value or state, engineering units, state indicator,
and configured colour/accent.

## Inspector configuration

The Inspector configures the title, bounded maximum row capacity (1–32), compact
mode, and the row collection. Rows can be added, removed, and reordered. Each
row owns its I/O type, channel, display label, units, initial value/state,
value/state visibility, visibility, and row colour. Normalization truncates the
serialized collection to the configured capacity.

## Runtime SDK

Generated symbols use the persisted component ID, so changing the display name
does not rename the API. Duplicate instances keep isolated symbols and fixed,
bounded row storage. For a component whose persisted ID generates the stem
`Io_Monitor_Main`, the exact current declarations are:

```c
bool FG_Set_Io_Monitor_Main_DigitalInput(const char * channel, bool state);
bool FG_Set_Io_Monitor_Main_DigitalOutput(const char * channel, bool state);
bool FG_Set_Io_Monitor_Main_AnalogInput(const char * channel, float value);
bool FG_Set_Io_Monitor_Main_AnalogOutput(const char * channel, float value);
```

Each function returns `true` when a row with the requested channel and I/O type
was updated, otherwise `false`. Updates refresh only the owning instance and are
silent: they do not generate UserEvents. Include `90_Studio_Export.h`, use the
exact declarations emitted for the current export, and call these semantic APIs
from the supported LVGL/UI context. No raw LVGL label or object manipulation is
required.

```c
FG_Set_Io_Monitor_Main_DigitalInput("DI1", true);
FG_Set_Io_Monitor_Main_DigitalOutput("DO1", false);
FG_Set_Io_Monitor_Main_AnalogInput("AI1", 4.62f);
FG_Set_Io_Monitor_Main_AnalogOutput("AO1", 68.0f);
```

## Interaction and UserEvents

IO Monitor is read-only in the current release. Rows do not respond to touch,
and IO Monitor generates no touch-related callbacks. Runtime state changes made
through SDK setters are display projection, not user events. Use Relay Panel,
PWM Controller, or another control-oriented component for operator commands.

## Validation

Focused model, Inspector, Studio lifecycle, Browser Preview, and LVGL exporter
tests passed. A standalone project exported successfully, built for the
`esp32p4` target with ESP-IDF 5.5.4, flashed successfully, and rendered on the
physical ESP32-P4 display. The physical layout matched the intended Studio
design; all four I/O row types were visible; no LVGL warnings or resets were
observed during the display proof. Touch proof is neither claimed nor required
because interaction is not part of this component's contract.

The next planned Native Component is Battery Card. Simulator / Proof Module,
automated Runtime SDK proof harness, ESP-Hosted startup investigation, and
further export infrastructure work remain deferred.
