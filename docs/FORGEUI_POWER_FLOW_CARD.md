# ForgeUI Power Flow Card

Status: **HARDWARE VALIDATED** (ESP32-P4, 2026-08-07)

Power Flow Card is ForgeUI Native Component #14 and the final component in the current planned card run. It is a compact, monitoring-only electrical/energy dashboard component, not a single-line diagram, graph editor, SCADA canvas, or data-binding framework.

## Semantic model

V1 has a deterministic four-node topology: Grid at left, Solar above, Load at centre, and Battery below. Grid, Solar, and Battery each have one connection to the centre. Each connection has one explicit static direction:

- `none` — idle/inactive
- `into-centre` — source/import/discharge toward Load
- `out-from-centre` — export/charge away from Load

Direction is communicated without animation. Active connections use the configured accent colour; inactive connections use the subdued colour. Each node has a concise text-backed value supporting `W`, `kW`, `MW`, or application-specific formatting. Values normalize to 24 characters and exported LVGL labels use dot truncation. Grid, Solar, Battery, and Load visibility is independently serialized; their connections hide with unavailable endpoints.

## Geometry and parity

- Default: `240 x 145`
- Minimum: `220 x 128`

The existing shared Native Component resize constraints enforce the minimum. The same canonical React preview is used by Canvas, Browser Preview, and Live Studio. The LVGL 9.2 implementation mirrors the fixed topology with ordinary containers, labels, three-pixel connection objects, and canonical LVGL direction symbols. It uses no canvas, custom drawing engine, large buffer, or dynamic topology.

## Inspector

The Inspector exposes the title; each node's visibility and value; Grid, Solar, and Battery flow direction; active and inactive colours; and the Runtime SDK generation toggle. It deliberately exposes no per-node coordinates or decorative topology controls.

## Runtime SDK

When enabled, the card generates seven silent, persisted-ID APIs:

```c
void FG_Set_<Card>_Grid_Value(const char * value);
void FG_Set_<Card>_Grid_Flow(int32_t flow);
void FG_Set_<Card>_Solar_Value(const char * value);
void FG_Set_<Card>_Solar_Flow(int32_t flow);
void FG_Set_<Card>_Battery_Value(const char * value);
void FG_Set_<Card>_Battery_Flow(int32_t flow);
void FG_Set_<Card>_Load_Value(const char * value);
```

Flow values clamp to `0` None, `1` Into centre/load, and `2` Out from centre/load. Every setter refreshes the relevant visible LVGL state immediately and silently. Generated symbols derive from persisted component identity, remain stable across display-name changes, and are isolated between duplicates. Raw LVGL pointers are private.

Power Flow Card generates **zero UserEvents**. Runtime data changes are not operator actions.

## Integration boundary

Power Flow Card is backend-independent:

```text
developer/backend → generated Runtime SDK → Power Flow Card
```

It has no automatic Modbus, CAN, MQTT, Wi-Fi meter, ADC, or smart-meter binding.

## Validation state

Focused automated coverage includes Registry/defaults, schema normalization, serialization/reload, duplication, Inspector properties, Canvas/Browser/Live routing, default/minimum geometry, optional node visibility, representative grid/solar/battery/export/idle directions, generated LVGL, seven silent setters, zero UserEvents, persisted-ID rename stability, duplicate isolation, and long-value truncation.

Physical validation confirmed the `240 x 145` stackable geometry, Grid / Solar / Battery / Load topology, visible static flow directions, and readable node values on the 1024 x 600 ESP32-P4 display. The validated four-card dashboard contained Power Flow Card alongside Network Status Card, KPI / Efficiency Card, and Device Summary Card. Persisted-ID identity, rename stability, duplicate-instance isolation, seven silent Runtime SDK setters, and the zero-UserEvents contract remain covered by focused certification tests.
