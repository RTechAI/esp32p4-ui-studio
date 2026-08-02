# ForgeUI Sensor Tile

Status: **PROVEN — ESP32-P4 VALIDATED** (2026-08-02).

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

Sensor Tile proof milestone:
`FORGEUI_NATIVE_COMPONENT_2__SENSOR_TILE_PROVEN__ESP32P4_VALIDATED__STABLE_RUNTIME_SDK__STABLE_USEREVENTS__2026-08-02`.

Physical validation on the Waveshare ESP32-P4 confirms:

- schema-1 semantic serialization remains one editable Canvas component;
- Canvas and Browser Preview parity;
- shared Live Studio and Standalone Export parity;
- the six semantic Runtime SDK APIs operate against the correct instance;
- the genuine-user click callback operates through `95_UserEvents`;
- persisted Native Component identity keeps generated Runtime SDK and callback
  symbols stable across unchanged regeneration;
- UserEvents ownership reconciliation preserves the active developer proof
  body, removes stale placeholders and safely quarantines unmatched custom
  hooks; and
- generated firmware builds and operates correctly on ESP32-P4.

Sensor Tile is **ForgeUI Native Component #2 — PROVEN**. This result belongs to
the ForgeUI Native Component ledger and does not alter the completed 44/44
practical LVGL count.

## Implementation history

Earlier on 2026-08-02, Sensor Tile reached **IMPLEMENTED — READY FOR ESP32-P4
PHYSICAL PROOF** after Registry, Inspector, Canvas, Browser Preview,
Live/Standalone generation, Runtime SDK and UserEvents implementation. That
dated status is retained here as the implementation-stage record superseded by
the accepted physical proof above.

## Version 1 boundaries

- Sensor Tile owns presentation, not ADC, MQTT, Modbus, CAN or sensor drivers.
- History, sparkline, alarm memory and min/max retention remain future semantic
  extensions under the same component identity.
- The icon is a native LVGL symbol; no Tile-specific asset path is introduced.
- Relay Panel is physically proven on ESP32-P4.
