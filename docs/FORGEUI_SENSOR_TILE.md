# ForgeUI Sensor Tile

Status: **PHYSICAL RENDERING AND USEREVENTS PASSED; RUNTIME SDK SIMULATOR PROOF DEFERRED** (2026-08-05).

Platform milestone:
`FORGEUI_NATIVE_COMPONENT_3__RELAY_PANEL_PROVEN__ESP32P4_VALIDATED__RUNTIME_SDK_USEREVENTS_MASTER_CONTROL_PROVEN__READY_FOR_PWM_CONTROLLER__2026-08-02`.

Sensor Tile is **ForgeUI Native Component #2**. It represents one live
engineering measurement while its internal LVGL container, labels, status
indicator and progress bar remain private implementation details.

## Semantic model

Schema version `1` supports Temperature, Pressure, Humidity, Voltage, Current,
Power, Energy, RPM, Frequency and Generic sensors. Sensor type supplies sensible
title, units, icon, value and decimal defaults without creating separate
layouts or component types.

Persisted properties include value/decimals/units, status text, rising/falling/
stable trend, timestamp, accent, visibility, padding, measurement range,
warning/critical low/high thresholds, automatic colour and root click enablement.
Automatic severity is Critical outside critical thresholds, Warning outside
warning thresholds, Normal inside them, and Offline when explicitly selected.

## Generated Runtime SDK

For a component named `Engine RPM`:

```c
void FG_Set_Engine_RPM_Value(float value);
void FG_Set_Engine_RPM_Units(const char * units);
void FG_Set_Engine_RPM_Status(const char * text, uint32_t rgb);
void FG_Set_Engine_RPM_Trend(int32_t trend);
void FG_Set_Engine_RPM_Timestamp(const char * timestamp);
void FG_Set_Engine_RPM_Colour(uint32_t rgb);
```

`Value` updates engineering text and normalized progress; with Auto Colour it
also projects threshold severity. Trend uses positive/Rising, negative/Falling
and zero/Stable. These APIs expose no internal LVGL object and emit no event.

Optional genuine-user hook:

```c
void FG_On_Engine_RPM_Clicked(void);
```

## ESP32-P4 proof record

Truthful save point:
`FORGEUI_NATIVE_COMPONENT_2__SENSOR_TILE_COMPACT__ESP32P4_RENDER_AND_USEREVENTS_PROVEN__SDK_SIMULATOR_PROOF_DEFERRED__2026-08-05`.

The following was physically confirmed on ESP32-P4:

- compact `240 x 145` Sensor Tile layout;
- multiple Sensor Tile instances rendering correctly;
- readable value, units, status, trend, progress, and timestamp;
- four unique UserEvents callbacks;
- repeated touch operation;
- duplicate-instance touch isolation;
- stable application loop;
- SD remained `READY`; and
- no observed Guru Meditation, watchdog reset, LVGL assertion, or callback flood.

The full six-setter multi-instance Runtime SDK physical isolation sequence was
not conclusively completed because the temporary proof firmware workflow became
ambiguous. That specific setter-isolation test is not claimed as passed.

- **Physical rendering and UserEvents: PASSED**
- **Runtime SDK generation and focused tests: PASSED**
- **Automated multi-instance setter proof: DEFERRED TO SIMULATOR/PROOF MODULE**

This result belongs to the ForgeUI Native Component ledger and does not alter
the completed 44/44 practical LVGL count.

## Future design note: Native Component Simulator / Proof Module

Purpose: exercise all generated Runtime SDK setters automatically; select
individual component instances; run duplicate-isolation tests; show expected
and actual values; emit clear serial proof markers; avoid hand-editing
`95_UserEvents.c`; avoid ambiguous export binaries; support Browser, Live
Studio, and ESP32-P4 proof modes; and remain removable from production exports.

This module is a future design only and is not implemented here.

## Implementation history

Earlier records overstated completion of the six-setter physical isolation
sequence. The 2026-08-05 save point above supersedes that claim while retaining
the confirmed implementation, generated Runtime SDK, focused-test, rendering,
touch, and UserEvents evidence.

## Version 1 boundaries

- Sensor Tile owns presentation, not ADC, MQTT, Modbus, CAN or sensor drivers.
- History, sparkline, alarm memory and min/max retention remain future semantic
  extensions under the same component identity.
- The icon is a native LVGL symbol; no Tile-specific asset path is introduced.
- Relay Panel is physically proven on ESP32-P4.
