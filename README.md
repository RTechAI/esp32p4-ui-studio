# ForgeUI Studio

> Current certification (2026-08-07): **44 / 44 practical LVGL 9.2
> components physically proven on ESP32-P4**, plus twelve current ForgeUI
> Native Components. Dashboard Card, Sensor Tile, Relay Panel, PWM Controller,
> Trend Chart, and Trend Chart Pro are fully proven. Alarm Panel is
> **HARDWARE VALIDATED**: exported, built, flashed, and physically rendered on
> ESP32-P4; extended runtime interaction and callback proof is deferred. IO
> Monitor is also **HARDWARE VALIDATED** after export, ESP-IDF 5.5.4 build,
> flash, and physical rendering; it is intentionally read-only with no touch callbacks.
> Battery Card is **HARDWARE VALIDATED** after Browser/Live/generated LVGL parity,
> successful ESP-IDF build and ESP32-P4 flash, and confirmed physical rendering.
> It is read-only, exposes seven silent semantic APIs, isolates duplicate
> identities, and intentionally generates no UserEvents. Network Status Card is
> **HARDWARE VALIDATED**, with live connected/disconnected, real SSID, DHCP IP,
> RSSI-derived signal, and Online/Offline projection independent of the System
> Wi-Fi Manager page. Tank Level Card is
> **HARDWARE VALIDATED** through Studio, Browser, Live, generated LVGL, Runtime
> SDK, ESP-IDF build, ESP32-P4 flash, physical rendering, parity, and duplicate
> isolation. It is display-only and intentionally generates no UserEvents.

> Network Status Card certification is complete. KPI Card is **HARDWARE VALIDATED** after three independent compact cards rendered correctly on ESP32-P4. Device Summary Card remains **IMPLEMENTED / READY FOR HARDWARE VALIDATION**. Both are monitoring-only, zero-UserEvents cards with isolated persisted-ID APIs. The Proof Module, Hardware Simulator, automated Runtime SDK proof harness,
> ESP-Hosted startup investigation, and export infrastructure improvements
> remain deferred.

Current architecture save point:
`FORGEUI_LVGL9_COMPLETE__44_OF_44_PRACTICAL_WIDGETS_PROVEN__ESP32P4_VALIDATED__DOCUMENTATION_COMPLETE__READY_FOR_NATIVE_FORGEUI_PLATFORM__2026-08-02`.

Latest committed ForgeUI Platform save point (preceding Device Summary hardware-ready work):
`FORGEUI_V3_5_4__ELEVEN_NATIVE_COMPONENTS__NETWORK_STATUS_HARDWARE_VALIDATED__DOCS_ALIGNED__READY_FOR_DEVICE_SUMMARY_CARD__2026-08-07`.

**ForgeUI Studio is an open-source, AI-assisted visual HMI and embedded GUI designer for ESP32-P4.** It combines a drag-and-drop Canvas, reusable Interactive Assets, AI Layout tools, Browser Preview, native LVGL 9 generation, integrated ESP-IDF Build & Flash, and standalone ESP-IDF project export.

ForgeUI exists to shorten the path from an interface idea to editable embedded firmware without putting a web runtime on the device. The Studio is a development tool; exported interfaces compile as native LVGL C inside ESP-IDF.

> Design visually. Generate native LVGL. Own the firmware.

## What makes ForgeUI different

- **Native embedded output:** no browser, Electron, HTML, CSS, JavaScript or Node.js runtime is deployed to the microcontroller.
- **Editable AI assistance:** AI-generated layouts and artwork enter the same normal component and asset workflows as manually created content.
- **Application-friendly runtime:** supported controls expose generated setters and genuine-user hooks while permanent product logic stays developer-owned.
- **Hardware-led validation:** features are distinguished between automated, preview, generated, build and physical ESP32-P4 proof.
- **Standalone ownership:** exported ESP-IDF projects remain usable without ForgeUI Studio, OpenAI or a ForgeUI runtime.

## Current capabilities

ForgeUI now rests on two completed foundations:

1. **Practical LVGL Library** — 44 of 44 practical LVGL widgets/components are
   physically proven on ESP32-P4.
2. **ForgeUI Native Platform** — thirteen Native Components are current. Six are **PROVEN** across
   semantic serialization, Browser Preview, Live Studio, Standalone Export,
   Runtime SDK, UserEvents and ESP32-P4 hardware. Alarm Panel is recorded
   separately as **HARDWARE VALIDATED**, pending extended runtime lifecycle proof.
   IO Monitor, Battery Card, Tank Level Card, and Network Status Card are **HARDWARE VALIDATED**;
   KPI Card is **HARDWARE VALIDATED**; Device Summary Card remains **IMPLEMENTED / READY FOR HARDWARE VALIDATION**.
   Both are read-only monitoring components and generate no UserEvents.

Dashboard Card remains one semantic, serializable Canvas component with private
multi-object LVGL composition. See
[ForgeUI Dashboard Card](docs/FORGEUI_DASHBOARD_CARD.md).

Sensor Tile is **ForgeUI Native Component #2 — PROVEN**. It adds semantic
engineering values, units, threshold-driven severity, trend, timestamp and
colour APIs while remaining one serialized Canvas component. Its stable Native
Component identity and UserEvents ownership reconciliation preserve Runtime SDK
symbols and active developer hooks across regeneration. See
[ForgeUI Sensor Tile](docs/FORGEUI_SENSOR_TILE.md).

Relay Panel is now **ForgeUI Native Component #3 — PROVEN**. It provides one semantic 1–8 channel logical output
bank, interactive preview, shared native export, seven bounded Runtime APIs and
genuine-user channel/master hooks without owning GPIO configuration. PWM
Controller is also physically proven. See
[ForgeUI Relay Panel](docs/FORGEUI_RELAY_PANEL.md).

Trend Chart is the lightweight technical industrial trend, with rolling
history, relative time presentation, thresholds and runtime point updates.
Trend Chart Pro is a separate premium dashboard-oriented engineering trend
with an engineering-value header, units, glow/fill, latest marker, major grid
and threshold bands. Both are physically proven; Pro does not replace the
standard chart. See [Trend Chart](docs/FORGEUI_TREND_CHART.md) and
[Trend Chart Pro](docs/FORGEUI_TREND_CHART_PRO.md).

- Drag-and-drop, free-form Canvas placement and resizing
- Registry-driven Widget Tray with search and accessible insertion
- Authoritative per-widget Registry metadata for Runtime APIs, UserEvents,
  input semantics, child ownership, documentation and feature-gate preparation
- Data-driven Board Profiles shared by live and Standalone Export
- Export-Time Feature Gating across generated C, CMake and dependencies
- Component properties, semantic themes and uploaded artwork
- Browser Preview
- Layout Designer with Smart Regions and Auto Arrange
- AI-assisted layout, theme and artwork workflows
- Five reusable Interactive Asset types
- Standard LVGL component runtime APIs and hooks
- Collision-safe Runtime APIs and `95_UserEvents`
- Native QR Code component and generated text setter
- Built-in System Runtime with Display, Wi-Fi and Storage interfaces
- Local conversion of artwork into LVGL-ready C assets
- Client and server export validation
- Integrated ESP-IDF Build & Flash
- Standalone ESP-IDF project export

The active Registry contains only supported widgets. Legacy placeholder types
such as Lottie and ObjxTempl are quarantined from
the Tray, root Canvas drop surface, active Inspector/AI catalogue and export;
they are not advertised as implemented Standard widgets. Menu is an active,
physically proven native structured widget.

## Typical workflow

```text
Drag and Drop or AI Layout
        ↓
Editable ForgeUI components
        ↓
Canvas
        ↓
Browser Preview
        ↓
Generate native LVGL
        ↓
Build and Flash with ESP-IDF
        ↓
Develop the application or export a standalone project
```

AI features require configured OpenAI API access. Normal Studio editing, imported-asset processing, preview, LVGL generation, validation, build and export do not require OpenAI.

## Layout Designer

ForgeUI’s Layout Designer uses reusable definitions rather than separate
hard-coded renderers. The currently implemented template is:

- Dashboard

Industrial HMI, Control Panel, Monitoring, SCADA Overview and Mobile / Portrait
are roadmap candidates, not implemented templates.

Dashboard creates ordinary editable ForgeUI components with labelled Smart
Region Boxes. Its Header, Status, Main, Controls and Footer workflow has been
manually verified on Canvas and Browser Preview. Layout Designer-specific
physical ESP32-P4 proof is not claimed. Dashboard uses the normal component
persistence, undo/redo, Canvas, Browser Preview and LVGL export paths.

See [ForgeUI Layout Designer](docs/FORGEUI_LAYOUT_DESIGNER.md) for the detailed authoring workflow.

## Interactive Assets

Interactive Assets are reusable artwork-backed controls:

- Interactive Button — Normal and Pressed input
- Interactive Toggle Switch — OFF and ON input
- Interactive Three-Position Toggle Switch — LEFT, CENTER and RIGHT input
- Interactive Light — application-controlled OFF and ON output
- Interactive Status Indicator — application-controlled OFF and ON output

They share Creator workflows, AI state-artwork generation, registry persistence, Canvas assignment, visible-artwork fitting, Browser Preview, native LVGL export and generated developer integration.

At a high level:

```text
User input → generated FG_On_* hook → developer application

Developer application → generated FG_Set_* API → displayed output
```

Exact names are generated from component names and are declared in the exported headers.

## Standard LVGL runtime

ForgeUI generates native LVGL objects and semantic runtime APIs for supported Standard components, including value displays, charts, text entry, selections, progress, images, container visibility and actions.

- Interactive semantic state uses silent setters plus genuine-user hooks.
- Output-only state uses setters without hooks.
- Presentation-only components remain API-free.
- QR Code exposes a silent generated Text setter and no hook.

Generated implementation and public declarations normally live in
`90_Studio_Export.c/.h`; Standard Fi Icon presentation setters use the dedicated
generated `96_FiRuntime.c/.h` boundary. Genuine-user hooks are declared through
`95_UserEvents.h`; live Studio regeneration preservation-merges matching hook
bodies in `95_UserEvents.c`.

Detailed signatures and ownership belong in [03 — Generated Export API Code Map](03_ForgeUI_Generated_Export_API_Code_Map.md), not this front page.

This generated developer surface is the beginning of the ForgeUI Runtime SDK
direction. It is not yet a separately packaged SDK product. See
[07 — Runtime SDK Direction](07_FORGEUI_RUNTIME_SDK.md).

Current Standard-widget milestone evidence:

- Slider: **PROVEN** through live and Standalone ESP32-P4 touch/runtime paths.
- Spinner: **PROVEN** through live and Standalone ESP32-P4 native animation.
- List: **PROVEN** through Registry, Tray, Canvas, Inspector, Browser Preview,
  native LVGL export, collision-safe `95_UserEvents`, feature gating, live
  ESP32-P4 firmware and Standalone Export. List intentionally has no setter.
- Spinbox: **PROVEN** through Registry, Tray, Canvas, Inspector, Browser
  Preview, native LVGL export, Runtime SDK, `95_UserEvents`, export-time
  gating, live ESP32-P4 firmware and Standalone Export.
- Clock and Wi-Fi Status: **PROVEN**. Their complete software slices
  share Canvas/Browser/LVGL presentation. Clock consumes RTC time; Wi-Fi Status
  consumes the existing backend snapshot with no duplicate manager, setter or
  UserEvent architecture.

The registry contains 44 practical Standard LVGL widgets/components: all 44 are
**PROVEN on ESP32-P4**, including Menu. The original 39-widget milestone remains the
foundation; Closure Batch 1 added Span, Animation Image and Image Button.
Batch D completed QR Code, Icon Button, Icon final re-proof and
Canvas, including Canvas/Browser/Live/Standalone parity and a successful mobile
scan of the generated QR Code. Text, Clock and Wi-Fi Status join Image, Line, TabView, TileView, Button, Heading, Box and
Divider as **PROVEN**. Image uses native uploaded-asset Contain scaling with
persistent source dimensions; Line uses native endpoint geometry and styling.
Icon is included in the proven total. A final official LVGL 9.2 catalogue audit
found five practical closure widgets. Span, Animation Image and Image Button
are registered and **PROVEN ON ESP32-P4**; Window and Menu are **PROVEN**.
Lottie is intentionally excluded. Practical LVGL parity is complete; the next
chapter is ForgeUI Platform development. See [Final LVGL 9 Standard Widget Audit](docs/LVGL_9_STANDARD_WIDGET_AUDIT.md).

Batch 1 implementation and hardware steps are recorded in
[LVGL 9.2 Practical Closure — Batch 1](docs/FORGEUI_LVGL_CLOSURE_BATCH1.md).

## Hardware support and proof

The Board Selector is backed by a data-driven profile registry. The current supported production profile is the Waveshare ESP32-P4 WiFi6 Touch LCD 7B (`esp32p4`, 1024 × 600). Project feature and transport selection is persisted after hydration and shared by live Build & Flash and standalone export. The profile owns ESP-Hosted SDIO/SPI settings and SDMMC host, pin, width, frequency and power settings. Generated `sdkconfig.defaults`, `00_ForgeUI_Features.h`, CMake sources/components and `idf_component.yml` are validated together; standalone packaging never copies a stale live `sdkconfig`.

External RTC is configured at **ForgeUI Studio → Board: ESP32-P4 7B → Configure Hardware → Hardware Configuration → Optional Hardware → External RTC**. The authoritative persisted setting is `firmwareFeatures.rtc`; it remains project/board hardware configuration and is not a runtime System-menu setting. Enabled mode retains DS3231 support at I2C address `0x68` and the software/NVS fallback. Disabled mode generates `FG_FEATURE_RTC 0`, performs no DS3231 hardware access and continues to provide software/NVS time. Live Studio and Standalone Export inherit the same project setting. Legacy projects without `firmwareFeatures.rtc` normalize to `true` for backward compatibility.

The proven target is:

- **Waveshare ESP32-P4-WiFi6-Touch-LCD-7B**
- **1024 × 600**
- **ESP-IDF 5.5.4**
- **LVGL 9.2.2**

Recorded physical proof includes the established Standard component groups, all five Interactive Asset runtime paths within their documented scopes, generated semantic theme parity, Display/Brightness, the generated Wi-Fi Manager, reusable System keyboard, Storage Browser, ESP-Hosted connectivity through the board’s ESP32-C6, SD storage and simultaneous Wi-Fi/SD operation. External RTC disabled is also physically proven from a fresh Standalone Export: boot showed Wi-Fi ON, SD ON and RTC OFF; no DS3231 attach, read or failure path ran; the NVS/software fallback epoch loaded; and Wi-Fi, SD and normal ESP32-P4 runtime remained operational.

Spinbox proof on ESP-IDF 5.5.4 and LVGL 9.2.2 includes drag/drop, Canvas
controls, Inspector synchronization, Browser parity, signed and decimal values,
rollover, clamp, native touch increment/decrement, multiple instances,
collision-safe generated APIs/hooks, silent setters, exactly one hook per
effective user action, feature gating and live/Standalone parity. Spinbox is a
native selected-digit editor; use NumberInput for free-form numeric text entry.

The repository does not currently advertise ESP32-S3 or additional board export support. Preview or automated validation is not treated as physical proof. For the authoritative feature-by-feature evidence level, see [04 — Feature Status](04_FEATURE_STATUS.md).

## Built-in System Runtime

Implemented generated tools are Settings, Brightness, Diagnostics, Wi-Fi Manager, Storage Browser and the private native keyboard. Wi-Fi Manager/dialogs and Storage UI/worker resources are created on demand and destroyed safely on Back; Wi-Fi/ESP-Hosted and SD backend state remains separately alive. Launcher cards follow enabled generated features instead of always showing unavailable placeholders.

The connected lazy-lifecycle Application-page serial probe recorded 45,795 bytes current internal free heap, 43,871 bytes minimum-ever, a 27,648-byte largest block and 62 LVGL objects. Operator-driven repeated touchscreen lifecycle validation remains open. The flashed build contains a compact FPS/RAM overlay, but its direct managed-LVGL edit is absent from current source and needs a reproducible ForgeUI-owned patch.

ForgeUI generates platform UI alongside the application:

- System Launcher
- Display / Brightness
- Wi-Fi Manager
- Storage Browser
- reusable native LVGL keyboard for System text entry

Generated pages own presentation and UI intent. The non-generated firmware backends remain authoritative for Wi-Fi transport, credentials, reconnect policy and filesystem operations.

## Standalone ESP-IDF export

A standalone export is a normal ESP-IDF project:

- open it directly in Visual Studio Code;
- build, flash and debug it with the normal ESP-IDF workflow;
- add application modules, drivers, GPIO, sensors and product logic;
- call generated UI APIs from application code;
- implement genuine-user reactions in the exported developer hook layer.

The exported project is developer-owned. Studio does not manage it after export, and the device requires no separately installed ForgeUI runtime, ForgeUI Studio service, OpenAI connection, subscription or phone-home service. Permanent application code belongs in developer-owned modules and `95_UserEvents.*`, never as a manual source-of-truth patch in replaceable `90_Studio_Export.*`.

See [05 — Developer Hardware Integration](05_DEVELOPER_HARDWARE_INTEGRATION.md) for practical GPIO, sensor, task, queue, network and hardware examples.

## Getting started

ForgeUI’s current bootstrap workflow targets Windows development.

1. Install Git, Node.js 20, Python and ESP-IDF 5.5.x.
2. Clone this repository.
3. Run `FIRST_TIME_FORGEUI_SETUP.bat`.
4. Start ForgeUI Studio using the provided launcher.
5. Create a screen, open Browser Preview, then generate or build the firmware.

For the complete setup sequence, use [Getting Started with ForgeUI Studio](GETTING_STARTED%20FORGEUI_STUDIO.md).

The [ForgeUI Developer Portal](https://forgeui.co.nz/developers) is the public onboarding site. Repository documentation remains the detailed engineering reference.

## Documentation

| Document | Use it for |
|---|---|
| [01 — Spine](01_SPINE.md) | Product architecture, proven milestones and current direction |
| [02 — Developer Code Map](02_DEVELOPER_CODE_MAP.md) | Studio ownership, implementation, extension and debugging |
| [03 — Generated Export API Code Map](03_ForgeUI_Generated_Export_API_Code_Map.md) | Generated firmware APIs, hooks, files and export boundaries |
| [04 — Feature Status](04_FEATURE_STATUS.md) | Current implementation and evidence status |
| [05 — Internal Developer Guide](05_DEVELOPER_GUIDE.md) | Architecture, widget pipeline, parity, testing and proof workflow |
| [05 — Developer Hardware Integration](05_DEVELOPER_HARDWARE_INTEGRATION.md) | Connecting ForgeUI to application code, drivers and hardware |
| [06 — OpenAI API Setup](06_OpenAI%20API%20Setup%20Instructions.md) | Configuring optional OpenAI-assisted layouts and artwork |
| [07 — Runtime SDK Direction](07_FORGEUI_RUNTIME_SDK.md) | Long-term generated SDK concept and evolution rules |
| [09 — Fi Runtime Guide](09_FORGEUI_FI_RUNTIME_GUIDE.md) | Canonical Fi pipeline, 90/95/96 ownership, generated presentation APIs and optional click hooks |
| [10 — Native Component Runtime Guide](10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md) | Living post-export reference for Native Component semantic APIs, UserEvents, ownership, task safety and hardware adapters |
| [IO Monitor](docs/FORGEUI_IO_MONITOR.md) | Read-only IO Monitor configuration, Runtime SDK, interaction contract, and ESP32-P4 validation |
| [Battery Card](docs/FORGEUI_BATTERY_CARD.md) | Read-only battery dashboard, semantic Runtime SDK, and ESP32-P4 proof |
| [Tank Level Card](docs/FORGEUI_TANK_LEVEL_CARD.md) | Read-only tank telemetry, six semantic setters, duplicate isolation, and ESP32-P4 validation |
| [Network Status Card](docs/FORGEUI_NETWORK_STATUS_CARD.md) | Hardware-validated read-only network telemetry, six silent semantic setters, duplicate isolation, and live ESP32-P4 Wi-Fi projection |
| [Device Summary Card](docs/FORGEUI_DEVICE_SUMMARY_CARD.md) | Hardware-ready compact device overview, six silent persisted-ID setters, duplicate isolation, and zero UserEvents |
| [KPI Card](docs/FORGEUI_KPI_CARD.md) | Hardware-validated generic KPI monitor, seven silent persisted-ID setters, stackable geometry, duplicate isolation, and zero UserEvents |
| [Layout Designer Guide](docs/FORGEUI_LAYOUT_DESIGNER.md) | Preset, Smart Region, Auto Arrange and AI Fill workflow |
| [QR Code Guide](docs/FORGEUI_QR_CODE.md) | QR authoring, preview, export and validation |
| [Spinbox Guide](docs/FORGEUI_SPINBOX_WIDGET.md) | Proven native digit editor, integer-backed decimals, APIs and physical evidence |

## Repository structure

```text
esp32p4-ui-studio/
├── studio/       ForgeUI Studio web application and export server
├── firmware/     ESP-IDF reference firmware and generated live output
├── docs/         Feature guides, images and archived historical documents
├── tools/        Setup and startup tooling
├── 01–07         Current architecture, status, developer and SDK documents
└── README.md     Public project front page
```

## Contributing and evidence

Contributions should preserve the existing ownership boundaries, extend authoritative registries and generators instead of duplicating them, and keep generated files replaceable. Claims should identify whether evidence is automated, manually previewed, generated, built, flashed or physically exercised.

ForgeUI builds on open-source projects including [LVGL](https://lvgl.io/), [ESP-IDF](https://github.com/espressif/esp-idf), React, Next.js and Chakra UI. Review the repository and firmware license/attribution files before redistribution.

## Project links

- [GitHub repository](https://github.com/RTechAI/esp32p4-ui-studio)
- [ForgeUI Developer Portal](https://forgeui.co.nz/developers)
- Contact: `forgeui.esp32@gmail.com`
## Fi Icon Runtime

Standard Fi Icons now generate optional component-name-based presentation APIs
in `96_FiRuntime.c/.h` and optional click hooks in `95_UserEvents`. Runtime API
generation defaults on; click defaults off. The canonical 92% icon renderer and
used-asset gating remain shared by Canvas, Browser Preview, Live and Standalone.
The overall feature is **PROVEN ON ESP32-P4** and contributed to the original
39-widget milestone; the current practical LVGL 9.2 proof total is **44**.
ESP32-P4 evidence proves
the 90 → 95 click path across three independent collision-safe callbacks, with
exactly one callback per deliberate tap and none at startup. The 90 → 96
presentation path is physically proven for color, opacity, hide/show, pre-bind
retention, repeated silent setters, independent instances, Standalone parity
and click-disabled non-interaction. Icon and the complete Fi Runtime are
**PROVEN**. See the
[Fi Runtime Guide](09_FORGEUI_FI_RUNTIME_GUIDE.md).
