# ForgeUI Native Trend Chart Pro

Status: **NATIVE COMPONENT #6 — PHYSICALLY PROVEN ON ESP32-P4** (2026-08-06).

Trend Chart Pro is the premium engineering-history card for SCADA, HMI and monitoring dashboards. It is independent from the lightweight Trend Chart and does not change that component's project schema or generated APIs.

## Inspector properties

- General: title, live value, units (`RPM`, `°C`, `%`, `kPa`, `PSI`, `L/min`, `V`, `A`, `W`, `Hz` or custom), and 0–4 decimal places.
- Appearance: major grid, area fill, trace glow, current marker, threshold bands, compact mode, and trace/warning/alarm colours.
- Trend: history length (5–120 points), update rate (100–60000 ms), automatic scaling, or fixed minimum and maximum.
- Thresholds: warning and alarm values.
- Integration: independently enable the Runtime SDK and threshold UserEvents.

Studio and Browser Preview use an anti-aliased SVG trace with a bounded blur and gradient. Standalone LVGL export uses a native line chart, three major grid divisions, fixed-size labels, optional threshold series and a small current marker. No full-screen canvas or per-frame heap allocation is generated.

## Runtime SDK

ForgeUI generates stable, collision-safe APIs from persisted component
identity. Renaming the presentation label does not change the contract. Using
`<TrendChartPro>` as a generated-name placeholder:

```c
FG_Add_<TrendChartPro>_Point(3962.0f);
FG_Set_<TrendChartPro>_Units("RPM");
FG_Set_<TrendChartPro>_Warning(4200.0f);
FG_Set_<TrendChartPro>_Alarm(4700.0f);
FG_Clear_<TrendChartPro>();
```

All LVGL objects and series remain private to generated ForgeUI code. Adding a point updates both the chart and its live engineering-value label.

## UserEvents

When threshold UserEvents are enabled, transition callbacks are declared for developer implementation in `95_UserEvents`:

```c
void FG_On_<TrendChartPro>_Point_Added(float value) { }
void FG_On_<TrendChartPro>_Warning(void) { }
void FG_On_<TrendChartPro>_Alarm(void) { }
void FG_On_<TrendChartPro>_Recovered(void) { }
```

Callbacks fire only when the semantic threshold state changes, not for every sample. Runtime threshold setters also update the values used by subsequent state transitions.

## Performance guidance

Use the default 30-point history for compact dashboards. Up to 120 points is supported, but multiple high-rate instances increase LVGL redraw work. An update rate of 500–1000 ms is appropriate for most operator displays.

## Certification record

Browser Preview, Live Studio, Standalone Export, semantic Runtime SDK,
transition-only UserEvents, rename-stable persisted identity, duplicate-instance
isolation, and physical ESP32-P4 output are proven. The physical certification
uses bounded history without the obsolete partial-history tail artifact or
unwanted LVGL point dots; thresholds render behind the live trace and runtime
updates refresh correctly.
