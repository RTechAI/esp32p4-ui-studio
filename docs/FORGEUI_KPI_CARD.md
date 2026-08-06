# ForgeUI KPI Card

Status: **HARDWARE VALIDATED** (ESP32-P4, 2026-08-07)

KPI Card is a monitoring-only ForgeUI Native Component for one prominent numeric or concise textual key performance indicator. It is generic and runtime-driven: application code supplies data through generated Runtime SDK setters; the component is not coupled to a backend.

## Geometry and presentation

- Default: `240 x 145`
- Minimum: `220 x 128`
- Compact 8 px radius, 10 px padding, and ellipsized title/value/context fields
- Hierarchy: title and semantic status, primary value and unit, optional secondary context, optional trend and target, semantic accent

The value is text-backed deliberately, supporting values such as `87.4`, `1,248`, `12 alarms`, and concise state text without assuming percentage semantics. Status values are Neutral, Good, Warning, and Critical. Trend values are Flat, Up, and Down. KPI Card is not a chart.

## Runtime SDK

For persisted component ID `<Card>`, export generates:

```c
FG_Set_<Card>_Value(const char * value);
FG_Set_<Card>_Unit(const char * unit);
FG_Set_<Card>_Secondary_Text(const char * text);
FG_Set_<Card>_Trend_Text(const char * text);
FG_Set_<Card>_Trend_State(int32_t state);
FG_Set_<Card>_Status(int32_t status);
FG_Set_<Card>_Target_Text(const char * text);
```

All setters are silent and refresh only their own instance. Identity derives from the persisted component ID, so renaming does not change the API. Duplicates receive independent state, LVGL objects, and namespaces. KPI Card generates **zero UserEvents** because it has no operator action.

## Platform parity

The versioned normalized model is shared by Studio defaults, Inspector, Browser Preview, and Live Studio. The authoritative generator emits ordinary LVGL 9.2 objects and fixed-size text buffers with long-label truncation. Developers or runtime code feed generic KPI values through the generated Runtime SDK; no hardware/backend source is built into the card.

Physical inspection on the 1024 x 600 ESP32-P4 display confirmed three independent 240 x 145 cards rendered correctly: Efficiency `87.4 %` / Good, Temperature `42.7 C` / Warning, and Alarm Count `12` / Critical. Each used an independent persisted ID and Runtime SDK namespace and generated zero UserEvents. Browser Preview, Live Studio, generated LVGL, and physical output are aligned for this proof.
