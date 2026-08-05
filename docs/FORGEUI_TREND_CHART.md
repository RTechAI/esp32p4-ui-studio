# ForgeUI Native Trend Chart

Status: **NATIVE COMPONENT #5 — PHYSICALLY PROVEN ON ESP32-P4** (2026-08-06).

Trend Chart is ForgeUI's lightweight technical industrial trend. It is distinct
from Trend Chart Pro, which adds premium dashboard-oriented engineering
presentation. Neither component replaces the other.

## Certified behavior

- semantic single-component architecture with private LVGL composition;
- rolling bounded history and relative time-axis presentation;
- configurable warning and alarm thresholds;
- runtime point, clear, and threshold updates;
- stable persisted-ID Runtime SDK identity through display-name changes;
- collision-safe duplicate-instance APIs and callbacks;
- Browser Preview, Live Studio, and Standalone Export parity; and
- physical ESP32-P4 proof.

Use the exact stem generated in `90_Studio_Export.h`:

```c
void FG_Add_<TrendChart>_Point(float value);
void FG_Clear_<TrendChart>(void);
void FG_Set_<TrendChart>_WarningThreshold(float value);
void FG_Set_<TrendChart>_AlarmThreshold(float value);
```

Where threshold UserEvents are enabled, the canonical callback family is:

```c
void FG_On_<TrendChart>_Point_Added(float value);
void FG_On_<TrendChart>_Warning(void);
void FG_On_<TrendChart>_Alarm(void);
void FG_On_<TrendChart>_Recovered(void);
```

Warning, Alarm, and Recovered callbacks fire only when threshold state changes.
Developer-owned callback bodies live in `95_UserEvents.c` and are preserved
during regeneration.

## Export certification

Unused LVGL history slots initialize to `LV_CHART_POINT_NONE`; valid startup
samples are written by explicit point ID. The certified exporter has no
partial-history tail artifact or unwanted LVGL point dots, draws threshold
helpers behind the real trace, and refreshes runtime changes. These details
remain private to generated code—applications integrate through the semantic
SDK and `95_UserEvents`.
