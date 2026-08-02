# ForgeUI Sensor Tile

Status: **IMPLEMENTED — READY FOR ESP32-P4 PHYSICAL PROOF** (2026-08-02).

Platform milestone:
`FORGEUI_NATIVE_COMPONENT_2__SENSOR_TILE_IMPLEMENTED__READY_FOR_ESP32P4_PHYSICAL_PROOF__2026-08-02`.

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

## ESP32-P4 proof plan

1. Place Temperature, Pressure, Voltage and RPM Tiles plus a duplicate-named
   pair. Confirm each remains one Canvas object through select, move, resize,
   copy/paste, duplicate, delete and undo.
2. Exercise all Inspector properties, save/reload and verify schema-1 semantic
   values without hidden children.
3. Compare Canvas and Browser Preview across sensor types, trends, optional
   sections, manual accent and Normal/Warning/Critical/Offline colours.
4. Generate Live Studio and Standalone Export. Inspect readable private LVGL
   composition, six APIs per instance and only enabled click hooks.
5. Build and flash Standalone output to the Waveshare ESP32-P4.
6. Drive values through normal, warning and critical thresholds. Verify value,
   decimals, progress and automatic colour, then test Units, Status, Trend,
   Timestamp and Colour APIs individually.
7. Tap each enabled Tile and confirm exactly one matching UserEvent per tap,
   no startup/setter events and independent duplicate-name instances.
8. Repeat updates and taps for at least ten cycles while Wi-Fi and System pages
   remain operational. Record RAM, responsiveness, crash, watchdog and
   rendering stability plus Live/Standalone parity.
9. Promote Sensor Tile to **PROVEN** only after the hardware evidence is
   accepted.

## Version 1 boundaries

- Sensor Tile owns presentation, not ADC, MQTT, Modbus, CAN or sensor drivers.
- History, sparkline, alarm memory and min/max retention remain future semantic
  extensions under the same component identity.
- The icon is a native LVGL symbol; no Tile-specific asset path is introduced.
- Relay Panel has not begun.
