# ForgeUI Native Components

This is the authoritative Native Component library index as of 2026-08-03. Native Components are semantic, versioned Canvas components with Registry metadata, deterministic Browser Preview, a shared Live Studio/Standalone LVGL generator, identity-scoped Runtime SDK functions, reconciled UserEvents, bounded state, and duplicate-instance isolation.

The separate Practical LVGL Platform contains 44/44 practical LVGL 9.2 widgets/components physically proven on ESP32-P4. Lottie is intentionally excluded.

## Status matrix

| # | Component | Purpose | Runtime SDK | UserEvents | Live | Standalone | Proof status | Documentation |
|---|---|---|---|---|---|---|---|---|
| 1 | Dashboard Card | Dashboard container and summary | Yes | Yes | Yes | Yes | **PROVEN** | [Guide](FORGEUI_DASHBOARD_CARD.md) |
| 2 | Sensor Tile | Engineering measurement | Yes | Yes | Yes | Yes | **PROVEN** | [Guide](FORGEUI_SENSOR_TILE.md) |
| 3 | Relay Panel | Logical relay-bank control | Yes | Yes | Yes | Yes | **PROVEN** | [Guide](FORGEUI_RELAY_PANEL.md) |
| 4 | PWM Controller | Semantic PWM output | Yes | Yes | Yes | Yes | **READY FOR FINAL PHYSICAL PROOF** | [Guide](FORGEUI_PWM_CONTROLLER.md) |
| 5 | Trend Chart | Lightweight value history | Yes | Yes | Yes | Yes | **PROOF PENDING** | [Guide](FORGEUI_TREND_CHART.md) |
| 5A | Trend Chart Pro | Higher-capability history | Yes | Yes | Yes | Yes | **PROOF PENDING** | [Guide](FORGEUI_TREND_CHART_PRO.md) |
| 6 | Alarm Panel | Alarm summary and acknowledgement | Yes | Yes | Yes | Yes | **PROOF PENDING** | [Guide](FORGEUI_ALARM_PANEL.md) |
| 7 | IO Monitor | Digital I/O and machine state | Yes | Yes | Yes | Yes | **PROOF PENDING** | [Guide](FORGEUI_IO_MONITOR.md) |
| 8 | Battery Card | Battery condition and energy | Yes | Yes | Yes | Yes | **PROOF PENDING** | [Guide](FORGEUI_BATTERY_CARD.md) |
| 9 | Tank Level Card | Fluid/material level | Yes | Yes | Yes | Yes | **PROOF PENDING** | [Guide](FORGEUI_TANK_LEVEL_CARD.md) |
| 10 | Network Status Card | Communications health | Yes | Yes | Yes | Yes | **PROOF PENDING** | [Guide](FORGEUI_NETWORK_STATUS_CARD.md) |
| 11 | Device Summary Card | Device/system overview | Yes | Yes | Yes | Yes | **PROOF PENDING** | [Guide](FORGEUI_DEVICE_SUMMARY_CARD.md) |
| 12 | KPI Card | Dashboard metric | Yes | Yes | Yes | Yes | **PROOF PENDING** | [Guide](FORGEUI_KPI_CARD.md) |
| 13 | Power Flow Card | Semantic energy flow | Yes | Yes | Yes | Yes | **PROOF PENDING** | [Guide](FORGEUI_POWER_FLOW_CARD.md) |

“Implemented,” “tested,” or “proof pending” never means physically proven. Only recorded ESP32-P4 evidence permits **PROVEN**.

## Authoritative architecture

`Semantic Model → Widget Registry → Canvas/Inspector → Browser Preview → shared LVGL generator → Live Studio/Standalone Export → Runtime SDK/UserEvents → ESP32-P4 proof`

- Registry: `studio/src/forgeui/widgets/ForgeUIWidgetRegistry.ts`
- Models: `studio/src/forgeui/ForgeUI<Component>.ts`
- Preview: `studio/src/forgeui/preview/ForgeUI<Component>Preview.tsx`
- Inspector: `studio/src/components/inspector/panels/components/<Component>Panel.tsx`
- Shared export/SDK: `studio/src/forgeui/ForgeUILvglExport.ts`
- Export materialization and UserEvents reconciliation: `studio/export-server.js`
- Developer hooks: `firmware/ForgeUI-One/main/95_UserEvents.c/.h`

## Ownership and data flow

The application owns hardware, drivers, protocols, sensing, calculations, safety, business meaning, and control decisions. ForgeUI owns semantic presentation, formatting, private LVGL composition, stable generated identities, bounded state, Runtime SDK declarations/implementations, and genuine-user event routing. Components remain independently driven; they never read another component’s private state.

Component-specific boundaries:

| Component family | Application owns | ForgeUI owns |
|---|---|---|
| Dashboard/KPI/Trend | Metric sources, history samples, targets and meaning | Formatting, chart/card presentation and semantic setters |
| Sensor/IO/Relay/PWM | Sensors, GPIO, polarity, drivers and safety logic | Logical state presentation and genuine-user intent |
| Alarm | Alarm aggregation, policy and consequences | Alarm presentation and acknowledgement/clear intent |
| Battery/Tank/Power Flow | BMS/tank/power sensing, calculations and energy control | Supplied-value presentation, states and flow formatting |
| Network | Drivers, credentials, protocols, reconnect and security | Communication-health presentation |
| Device Summary | Detection, health aggregation and management actions | Explicit supplied system-overview presentation |

## Runtime SDK and UserEvents

Runtime APIs are generated semantic `FG_Set_*` functions; private `lv_obj_t *` values are never public. Setters are silent and must not emit UserEvents. Persisted component IDs generate stable, collision-safe per-instance symbols, so duplicates remain independent.

UserEvents represent genuine user actions only. `95_UserEvents.h` declares the active generated contract. Live regeneration preserves matching developer bodies, appends new stubs, and quarantines orphans according to the existing reconciliation path. Developer application code remains in `95_UserEvents.c`; Standalone copies become developer-owned after export.

## Search, navigation and discovery

The authoritative Registry provides palette placement, search keywords, descriptions, dimensions, capabilities, documentation IDs, and AI catalogue eligibility. This index is the documentation navigation hub. Repository history under `docs/history/` is archival and not a current status source.

## Current milestone

The first-generation Native Component library through #13 is implemented. The next milestone is physical proof closure for pending components, beginning with the remaining PWM gates, followed by component proof projects and strict-warning/soak evidence. No pending component should be promoted from documentation or automated tests alone.
