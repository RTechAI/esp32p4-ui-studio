# ForgeUI Studio

Current architecture save point:
`FORGEUI_LVGL9_COMPLETE__44_OF_44_PRACTICAL_WIDGETS_PROVEN__ESP32P4_VALIDATED__DOCUMENTATION_COMPLETE__READY_FOR_NATIVE_FORGEUI_PLATFORM__2026-08-02`.

Current ForgeUI Platform milestone:
`FORGEUI_NATIVE_COMPONENT_2__SENSOR_TILE_PROVEN__ESP32P4_VALIDATED__STABLE_RUNTIME_SDK__STABLE_USEREVENTS__2026-08-02`.

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
2. **ForgeUI Native Platform** — Dashboard Card and Sensor Tile, ForgeUI Native
   Components #1 and #2, are **PROVEN** across semantic serialization, Browser
   Preview, Live Studio, Standalone Export, Runtime SDK, UserEvents and ESP32-P4
   hardware.

Dashboard Card remains one semantic, serializable Canvas component with private
multi-object LVGL composition. See
[ForgeUI Dashboard Card](docs/FORGEUI_DASHBOARD_CARD.md).

Sensor Tile is **ForgeUI Native Component #2 — PROVEN**. It adds semantic
engineering values, units, threshold-driven severity, trend, timestamp and
colour APIs while remaining one serialized Canvas component. Its stable Native
Component identity and UserEvents ownership reconciliation preserve Runtime SDK
symbols and active developer hooks across regeneration. See
[ForgeUI Sensor Tile](docs/FORGEUI_SENSOR_TILE.md). Relay Panel is the next
implementation target.

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

The proven target is:

- **Waveshare ESP32-P4-WiFi6-Touch-LCD-7B**
- **1024 × 600**
- **ESP-IDF 5.5.4**
- **LVGL 9.2.2**

Recorded physical proof includes the established Standard component groups, all five Interactive Asset runtime paths within their documented scopes, generated semantic theme parity, Display/Brightness, the generated Wi-Fi Manager, reusable System keyboard, Storage Browser, ESP-Hosted connectivity through the board’s ESP32-C6, SD storage and simultaneous Wi-Fi/SD operation.

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
