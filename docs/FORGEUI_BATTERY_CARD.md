# ForgeUI Battery Card

Status: **HARDWARE VALIDATED** (2026-08-06)

Battery Card is a semantic battery monitoring component for portable devices,
UPS systems, industrial equipment, and energy storage. It displays percentage,
voltage, current, runtime, temperature, health, charging state, a battery icon,
and a progress bar. It is intentionally read-only and generates no UserEvents
in the current release. Battery control belongs in dedicated control-oriented
Native Components.

## Studio and Inspector

Implemented properties are title, percentage units, compact mode, percentage,
voltage, current, charging, health (`good`, `fair`, `poor`, `replace`), remaining
minutes, temperature, low/critical thresholds, field visibility, charging
presentation, semantic colours, and Runtime SDK generation. Percentage clamps
to `0..100`; thresholds normalize to a valid order. Canvas and Browser Preview
share the normalized theme-aware model. Resize, persistence, reload, and
duplicate lifecycle paths are tested.

## Runtime SDK

```c
void FG_Set_<BatteryCard>_Percentage(float value);
void FG_Set_<BatteryCard>_Voltage(float value);
void FG_Set_<BatteryCard>_Current(float value);
void FG_Set_<BatteryCard>_Charging(bool enabled);
void FG_Set_<BatteryCard>_Health(int32_t value);
void FG_Set_<BatteryCard>_Runtime(int32_t value);
void FG_Set_<BatteryCard>_Temperature(float value);
```

Health values are `0` Good, `1` Fair, `2` Poor, and `3` Replace. Runtime is in
minutes. Setters are silent and generate no callbacks. Persisted identity makes
API names rename-stable; duplicate cards own independent private LVGL objects
and state. No raw LVGL access is required.

## Behaviour and UserEvents

Battery Card has no row selection, acknowledgement, editing, operator controls,
or touch callbacks. Its Runtime SDK projects monitoring values silently and
does not simulate user input. Consequently, Battery Card intentionally produces
no `95_UserEvents` declarations or Battery Card UserEvents in this release.

## Validation

Focused Studio/export suites passed Tray-to-Canvas insertion, Inspector,
resize/serialize/reload/duplicate/delete, themes, deterministic export, rename
stability, no UserEvents, silent runtime updates, and isolated duplicate SDK
and storage identities. Browser Preview, Live Studio, and generated LVGL were
aligned, including restored battery-icon parity, completed spacing/padding
parity, and completed metric-tile parity. The standalone ESP-IDF 5.5.4 project
built successfully, flashed successfully to ESP32-P4, and rendered correctly on
the physical display. This validates physical rendering; it does not claim an
exhaustive physical Runtime SDK interaction sequence.
