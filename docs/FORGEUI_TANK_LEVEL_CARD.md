# ForgeUI Tank Level Card

Status: **HARDWARE VALIDATED** (2026-08-06)

Tank Level Card is ForgeUI Native Component #10. It is a semantic, read-only
monitoring component for tanks, vessels, reservoirs, and process storage. It
displays level percentage, volume, capacity, engineering units, and configured
low/high thresholds. It does not own a sensor, transport, pump, valve, or
process-control policy.

## Runtime SDK

Use the exact persisted-ID stem emitted by the current `90_Studio_Export.h`:

```c
void FG_Set_<TankLevelCard>_Level(float percent);
void FG_Set_<TankLevelCard>_Volume(float value);
void FG_Set_<TankLevelCard>_Capacity(float value);
void FG_Set_<TankLevelCard>_Units(const char * units);
void FG_Set_<TankLevelCard>_LowLevel(float value);
void FG_Set_<TankLevelCard>_HighLevel(float value);
```

The generated identity is stable across display-name changes. Duplicate cards
own isolated state and LVGL objects. Setters update the display silently; no raw
LVGL object ownership or manipulation is required by application code.

## Behaviour and UserEvents

Tank Level Card is intentionally display-only. It has no operator controls or
genuine user interaction, so it generates no `95_UserEvents` declarations and
no `FG_On_*` callbacks. Missing touch interaction is not a defect. Runtime SDK
calls project application state and do not simulate user input.

IO Monitor, Battery Card, and Tank Level Card are the current read-only Native
Components with no UserEvents contract.

## Validation

Studio implementation, Inspector behavior, Browser Preview, Live Studio,
generated LVGL, Runtime SDK generation, rename-stable persisted identity,
duplicate-instance isolation, ESP-IDF build, ESP32-P4 flash, physical rendering,
and Browser/Live/Export parity are confirmed. Tank Level Card is therefore
**HARDWARE VALIDATED**.

Network Status Card subsequently reached **HARDWARE VALIDATED** status. Device
Summary Card is next but is not started here. The Proof Module,
Hardware Simulator, automated Runtime SDK proof harness, ESP-Hosted startup
investigation, and export infrastructure improvements remain deferred.
