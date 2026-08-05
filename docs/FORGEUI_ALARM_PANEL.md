# ForgeUI Native Alarm Panel

Status: **NATIVE COMPONENT #7 — IMPLEMENTED, NOT PROVEN; PHYSICAL REVALIDATION REQUIRED** (2026-08-06).

Current implementation save point:
`FORGEUI_NATIVE_COMPONENT_7__ALARM_PANEL_STUDIO_INSERTION_AND_LVGL_PARITY_REPAIRED__PENDING_USER_ESP32P4_REVALIDATION__2026-08-06`.

Alarm Panel is Native Component #7. It is a bounded semantic alarm-management
component for industrial HMI, PLC, SCADA, and embedded monitoring interfaces.
Its alarm records, priorities, states, acknowledgement controls, and public
Runtime SDK form the application contract; internal LVGL objects remain
private.

Studio insertion, Canvas rendering, Browser Preview, Inspector alarm editing,
serialization, duplication/deletion, generated LVGL structure, Runtime SDK,
canonical UserEvents, and duplicate isolation have focused automated coverage.
Alarm Panel is not certified until the user regenerates, flashes, and confirms
the repaired LVGL layout and behavior on ESP32-P4.

## Bounded model and ordering

Each instance owns fixed generated arrays with a configured capacity of 1–32
records. Runtime code performs no alarm-record heap allocation. Adding a new
ID at full capacity is rejected and returns `false`; an existing ID updates in
place. Records sort deterministically by configured priority, newest insertion,
or oldest insertion order. Only `maximumVisibleAlarms` rows are created.

`FG_Clear_*_Alarm` is distinct from acknowledgement. With `autoClear=false`, a
cleared record remains visible with Cleared styling. With `autoClear=true`, its
slot is released. `FG_Clear_All_*` releases every slot.

## Generated Runtime SDK

For the persisted-ID stem `<AlarmPanel>`, export declares:

```c
bool FG_Add_<AlarmPanel>_Alarm(int32_t alarm_id, const char * message,
    const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);
bool FG_Acknowledge_<AlarmPanel>_Alarm(int32_t alarm_id);
bool FG_Clear_<AlarmPanel>_Alarm(int32_t alarm_id);
void FG_Clear_All_<AlarmPanel>(void);
void FG_Set_<AlarmPanel>_Enabled(bool enabled);
bool FG_Select_<AlarmPanel>_Alarm(int32_t alarm_id);
```

Public priority values are Low, Medium, High, and Critical. Public states are
Normal, Warning, Alarm, Acknowledged, and Cleared. Symbols derive from the
persisted component ID, remain stable through display-name changes, and are
isolated across duplicate instances. Private LVGL objects are not public APIs.

## Canonical UserEvents

```c
void FG_On_<AlarmPanel>_Alarm_Added(int32_t alarm_id,
    FG_Alarm_Priority priority);
void FG_On_<AlarmPanel>_Alarm_Acknowledged(int32_t alarm_id);
void FG_On_<AlarmPanel>_Alarm_Cleared(int32_t alarm_id);
void FG_On_<AlarmPanel>_Alarm_Selected(int32_t alarm_id);
```

Explicit exporter metadata owns these signatures. Generated declarations,
calls, and default stubs match, while regeneration preserves matching
developer bodies in `95_UserEvents.c`. Repeated acknowledgement of an already
acknowledged alarm does not emit another transition callback.

## Invalidated earlier hardware record

An earlier removable 1024×600 proof page contained standard and compact instances
with capacities 8 and 4, different timestamp presentation, and independent
persisted-ID APIs. ESP-IDF 5.5.4 clean/build generation succeeded. The final
populated proof image was `0x153130` bytes with 91% of the application
partition free; the temporary automated runtime harness image was `0x153b60`.

Those observations do **not** certify the current component. A later Studio
check found that tray insertion produced a persisted component which the Canvas
renderer discarded because `ComponentPreview` lacked an `AlarmPanel` case.
After repairing insertion, the user also found that the generated LVGL row
children overlapped and did not match Canvas/Preview. The earlier PROVEN claim
and save-point tag are therefore superseded as certification evidence.

The earlier observations were:

- both layouts rendered without row overlap or unexpected clipping;
- critical, warning, and acknowledged states remained legible;
- every touched active row visibly acknowledged and the two instances stayed
  independent;
- add, message update, acknowledge, clear-one, clear-all, selection, and four
  of four capacity operations passed through the public Runtime SDK;
- a fifth compact alarm was deterministically rejected;
- 100 in-place runtime message updates completed without reset or LVGL warning;
- serial reported internal heap `16635` before and `16655` after the automated
  sequence (delta `+20`, therefore no observed heap loss);
- Wi-Fi, SD, touch, and the application loop remained operational throughout.

## Current repair evidence

The authoritative Canvas renderer now registers Alarm Panel. The Inspector can
add, remove, reorder, and edit each record's ID, message, timestamp, state, and
priority. Generated LVGL uses explicit row-child coordinates, bounded row
heights, separate message and state/timestamp lines, right-aligned priority,
conditional ACK presentation, a count badge, and state-coloured left borders.

Focused Studio/export tests pass **74 / 74** across six suites. This is
automated evidence only. Required next step: regenerate from Studio, build and
flash a fresh binary, compare Canvas/Browser/P4 geometry, exercise alarm
editing and acknowledgement, and accept the result personally.
