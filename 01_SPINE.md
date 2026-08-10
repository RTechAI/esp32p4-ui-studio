# Project Spine: what ForgeUI is, what is proven, current priorities, and what must not regress..

## Connected-services authority — 2026-08-09

[`12_FORGEUI_ESP32P4_WIFI_HOSTED_ARCHITECTURE.md`](12_FORGEUI_ESP32P4_WIFI_HOSTED_ARCHITECTURE.md) is the authoritative networking reference. The Waveshare 7B connected runtime is physically proven with the stock C6, ESP-IDF 5.5.4, `esp_hosted` 1.4.7, `esp_wifi_remote` 0.14.5, four-bit 40 MHz streaming SDIO, certificate-verified HTTPS and SNTP. Hardware Example 04 — Online Services — Live Weather is **PHYSICALLY PROVEN**. This is reusable platform capability for future REST, MQTT, telemetry and time-service integrations; those protocols are not claimed implemented until separately delivered and proven.

The completed Weather proof includes the real Studio Build & Flash path, explicit connection, association, DHCP, DNS, certificate-verified HTTPS/HTTP 200, Open-Meteo current and forecast data, Tauranga local time, live fields and icons, and stable dynamic local backgrounds. Weather 04 selects ten runtime-reachable backgrounds from a reusable seventeen-background Studio pack; the other seven remain available for manual/future use and are not compiled into this example. See [`11.04_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_04__ONLINE_WEATHER.md`](11.04_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_04__ONLINE_WEATHER.md) and [`docs/FORGEUI_WEATHER_BACKGROUND_PACK.md`](docs/FORGEUI_WEATHER_BACKGROUND_PACK.md).

## Hardware Examples selection and proof — 2026-08-10

Hardware Examples 01–05 are **PHYSICALLY PROVEN**. Example 02 uses the physically Device-ID-verified MB85RC256V at I2C `0x50`; write/read passed and `counter=9`, `value=0xA553` survived a complete power cycle. Example 03 uses an Elechouse PN532 V3 over software SPI; identity, SAMConfig, ISO14443A polling, stable UID `04:8D:E6:5F:B7:2A:81`, removal detection and one logical count per presentation were physically proven. Example 04 remains the locked, physically proven Online Services / Live Weather implementation. Example 05 proves a u-blox NEO-8 on full-duplex UART1 at 9600 8N1, with checksum-valid NMEA, 2D/3D fix state, live position fields, and a read-only UBX-MON-VER request with checksum-valid response. Hardware Example selection is mutually exclusive from Studio project loading through generated contracts, source inclusion, initialization and polling. Unselected implementation files remain preserved and their GPIO is inactive.

The current order is **Example 01 — GPIO Digital I/O**, **Example 02 — I²C FRAM Persistence**, **Example 03 — SPI NFC/RFID**, **Example 04 — Online Services / Live Weather**, and **Example 05 — GPS / GNSS**. Every compact sidebar card exposes the same **Load Example** and **Guide** actions. The Example 05 public reference is `RTechAI/ForgeUI-P4-UART-GPS-GNSS`, release `v1.0.0`, public baseline commit `2c6e6a6`; its authoritative Studio guide is [`11.05_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_05__GPS_GNSS.md`](11.05_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_05__GPS_GNSS.md).

## Current Save Point — 2026-08-06

**ESP32-P4 EXPORTED AND FLASHED — INITIAL PHYSICAL VALIDATION COMPLETE**

The practical LVGL 9.2 foundation remains **44 / 44 physically proven on
ESP32-P4**; Lottie remains intentionally excluded. The Native Component ledger
contains fourteen current components. Dashboard Card, Sensor Tile, Relay Panel, PWM
Controller, Trend Chart, and Trend Chart Pro are **PROVEN**. Alarm Panel is
**HARDWARE VALIDATED**: its fresh standalone export built,
flashed, and rendered correctly on ESP32-P4, while extended runtime interaction
and callback lifecycle proof remains deferred. IO Monitor is **HARDWARE
VALIDATED** after export, ESP-IDF 5.5.4 build, flash, and correct physical
rendering. It is a read-only display component and generates no touch UserEvents.
Battery Card is **HARDWARE VALIDATED** after successful ESP-IDF build, ESP32-P4
flash, and confirmed physical rendering. Browser Preview, Live Studio, and
generated LVGL parity are complete, including the battery icon, spacing/padding,
and metric tiles. Its implemented Runtime SDK is silent and duplicate identities
are isolated, but no exhaustive physical runtime interaction proof is claimed.

Trend Chart is the lightweight technical industrial trend. Trend Chart Pro is
the separate premium dashboard-oriented engineering trend; it does not replace
Trend Chart. Both have Browser Preview, Live Studio, Standalone Export,
semantic Runtime SDK, isolated duplicate-instance identity, and physical
ESP32-P4 proof. Persisted component identity owns their generated contracts,
so display-name changes do not rename chart APIs or callbacks.

Alarm Panel's missing Canvas renderer, missing per-alarm Inspector editor, and
generated LVGL row overlap have been repaired with focused tests. Studio
insertion, per-alarm editing and persistence, Browser Preview, fresh standalone
export, ESP-IDF build, flash, and correct physical rendering are confirmed.
Complete alarm transition, acknowledgement, clear, and callback verification is
deferred to the future Proof Module / hardware simulation work. The Simulator /
Proof Module, automated Runtime SDK
proof harness, ESP-Hosted startup investigation, and further export
infrastructure remain deferred.

Battery Card completes Native Component #9. Its semantic setters use persisted-ID,
rename-stable identities and isolated state; no raw LVGL manipulation is needed.
It intentionally emits no UserEvents. **Tank Level Card**, Native Component #10,
is **HARDWARE VALIDATED** through Studio, Inspector, Browser Preview, Live Studio,
generated LVGL, Runtime SDK, duplicate isolation, ESP-IDF build, ESP32-P4 flash,
physical rendering, and Browser/Live/Export parity. It is display-only and emits
no UserEvents. **Power Flow Card**, Native Component #14 and the final component in the current planned card run, is **HARDWARE VALIDATED**. Its bounded Grid/Solar/Battery/Load topology uses visible static none/inward/outward flow, readable node values, seven silent persisted-ID setters, duplicate isolation, shared Browser/Live preview, deterministic LVGL and zero UserEvents. Device Summary Card is also **HARDWARE VALIDATED**. The four-card physical dashboard operated Network Status Card, KPI / Efficiency Card, Power Flow Card, and Device Summary Card simultaneously with connected Wi-Fi, mounted SD, System Settings, Diagnostics, and software/NVS RTC fallback while external RTC was disabled. This is practical coexistence proof, not a formal stress test. The next documented phase is the **FORGEUI HARDWARE I/O PROOF PROGRAM**; no implementation begins in this closure pass.

Earlier dated save points below are historical records and are superseded only
where they describe the then-current Native Component count or next component.

## 2026-08-02 — Native Component #4 PWM Controller

PWM Controller is implemented through the existing Registry, semantic persistence, shared Browser Preview, shared Live/Standalone LVGL generator, Runtime SDK and `95_UserEvents` reconciliation. Persisted `IComponent.id` owns symbols/hooks; visible label renames do not. ForgeUI owns no GPIO or LEDC configuration. Status is **READY FOR HARDWARE PROOF**, not proven. See [`docs/FORGEUI_PWM_CONTROLLER.md`](docs/FORGEUI_PWM_CONTROLLER.md).

## WHY 01_SPINE & 02_DEVELOPER & 03_FORGEUI_GEN -  means Codex spends less time guessing and is much less likely to:

- edit generated files directly
- duplicate an existing subsystem
- put firmware logic into the Studio
- break ownership boundaries
- revive an obsolete architecture
- touch hardware configuration that is   already proven

## Current Save Point

**FORGEUI_V3_5_4__EXTERNAL_RTC_OPTIONAL_HARDWARE_PHYSICALLY_VALIDATED__READY_FOR_POWER_FLOW_CARD__2026-08-07**

**CURRENT PRIORITY: FORGEUI PLATFORM DEVELOPMENT ON THE COMPLETED PRACTICAL LVGL 9.2 FOUNDATION**

## Current ForgeUI Platform milestone

**FORGEUI_V3_5_4__ELEVEN_NATIVE_COMPONENTS__NETWORK_STATUS_HARDWARE_VALIDATED__DOCS_ALIGNED__READY_FOR_DEVICE_SUMMARY_CARD__2026-08-07**

Dashboard Card is **ForgeUI Native Component #1 — PROVEN**. Physical validation
confirmed Registry integration, semantic serialization, single-component Canvas
ownership, closely matched Browser Preview, shared Live/Standalone export,
Runtime setters, UserEvents, responsive touch, independent instances and stable
ESP32-P4 operation without crash, watchdog reset or rendering corruption.
Internal LVGL composition remained private. Sensor Tile is now **ForgeUI Native
Component #2 — PROVEN**. Physical proof confirms semantic serialization,
Browser Preview parity, Live/Standalone parity, Runtime SDK, UserEvents, stable
Native Component identity, UserEvents ownership reconciliation and ESP32-P4
hardware operation. Runtime symbols and developer hook ownership survive
regeneration correctly.

Relay Panel is now **ForgeUI Native Component #3 — PROVEN**. It remains one
versioned component containing 1–8 stable-ID logical channels, shared
Canvas/Browser rendering, shared Live/Standalone LVGL generation, seven
zero-based Runtime SDK APIs and genuine-user channel/master hooks. ESP32-P4
proof exercised channels 0–3 and master ON/OFF/ON. Wi-Fi remained connected at
`192.168.0.90`, SD remained ready, and no crash, watchdog, reset or visible
runtime failure occurred. GPIO and relay hardware remain application-owned.

Concise development handover save point:
**FORGEUI_NATIVE_COMPONENT_3__RELAY_PANEL_PROVEN__ESP32P4_VALIDATED__READY_FOR_PWM_CONTROLLER__2026-08-02**.

### 2026-08-02 ForgeUI Native Component #3 Relay Panel proof

Relay Panel V1 physically proves one serialized Native Component, a versioned
semantic model, 1–8 stable-ID logical channels, one selectable/resizable Canvas
object, private LVGL composition, Browser Preview, shared Live/Standalone
generation, bounded zero-based Runtime state, silent setters, genuine-user
channel/master events, individual/master control, configured disabled-channel
protection, collision-safe multi-instance generation and UserEvents
reconciliation. PWM Controller is next and has not started.

### 2026-08-02 ForgeUI Native Component #2 Sensor Tile proof

Sensor Tile completed physical validation on the Waveshare ESP32-P4. Its
semantic engineering model remained one serialized Canvas component; Browser
Preview matched the generated interface; Live Studio and Standalone Export
remained aligned; all six semantic Runtime SDK setters and the genuine-user
click hook operated through stable component identity; and UserEvents ownership
reconciliation preserved the active developer body across regeneration without
reviving stale hooks. Sensor Tile is **PROVEN**. This Native Component ledger is
separate from the completed 44/44 practical LVGL history.

### 2026-08-02 Practical LVGL 9.2 completion

ForgeUI has **44 practical registered LVGL widgets/components and all 44 are
physically proven on the Waveshare ESP32-P4**. Window and Menu are **PROVEN**.
Lottie remains intentionally excluded from the practical LVGL program.

The practical implementation program remains complete across Browser Preview,
Live Studio and Standalone Export. The Widget Registry, Proven Widget Pipeline,
Runtime SDK foundation, canonical Image/Icon pipelines, Project Hardware
Profiles, Export-Time Feature Gating, Fi Runtime and UserEvents form the proven
foundation for the Native Component chapter.

## ForgeUI Platform roadmap

1. Dashboard Card — **PROVEN**
2. Sensor Tile — **PROVEN**
3. Relay Panel — **PROVEN**
4. PWM Controller — **NEXT**
5. System Health
6. Network Widget
7. Storage Widget
8. Gauge Cluster
9. Energy Monitor

### Historical 2026-08-02 Window proof promotion

The earlier physical ledger stood at 43 practical widgets after Window proof,
with Menu still **IMPLEMENTED — READY FOR PHYSICAL PROOF**. That dated state is
retained as history; Menu subsequently completed the 44/44 practical LVGL
program. Lottie remained intentionally excluded throughout.

### Technical-manager continuity note

The active GPT acts as ForgeUI technical manager and must keep each widget loop
complete. Implement and validate one Standard widget, then explicitly tell the
operator **Export to IDF**. The operator exports from Studio, opens the
standalone project in VS Code, flashes the ESP32-P4, performs the requested
physical actions and returns terminal evidence. The GPT verifies that evidence,
updates every authoritative status/count document, marks the widget PROVEN only
when justified, recommends the next widget and stops. Do not begin the next
widget while physical evidence or documentation from the current slice remains
open. Direct COM-port flashing by GPT is not the default workflow.

## 2026-07-31 authoritative architecture alignment

- `ForgeUIWidgetRegistry.ts` now owns explicit per-widget Runtime API,
  UserEvent, user-input, Interactive Asset, child-ownership, documentation and
  feature-dependency metadata. These values mirror the actual
  `publicApiDeclarations` and `userEventHooks` generator contracts; broad
  exclusions such as “everything except Spinner/List” are forbidden.
- `ForgeUIWidgetRegistry.ts` is the single source of truth for Standard Widget
  Tray membership, categories, insertion geometry, defaults, capability
  metadata, documentation IDs and availability. `ForgeUIWidgetSet.ts` is a
  compatibility projection, never a second registry.
- Board Profiles own supported target identity, dimensions, capabilities,
  feature selection, ESP-Hosted transport/pins and SDMMC host/pins/power.
  Hydrated project hardware selection generates validated `sdkconfig.defaults`
  for both Live Build & Flash and Standalone Export; stale live `sdkconfig`
  files are never packaged.
- Export-Time Feature Gating prunes generated C, CMake sources, managed
  components and `idf_component.yml` together. A disabled feature must not
  survive through a different export layer.
- System Wi-Fi and Storage interfaces use Lazy Runtime ownership: UI objects
  and UI-local workers are demand-created and safely destroyed while their
  separately owned backends may remain alive.
- `90_Studio_Export.c/.h` owns replaceable generated LVGL and Runtime APIs.
  `95_UserEvents.c/.h` is the developer integration layer; live regeneration
  preservation-merges matching bodies and Standalone Export transfers
  ownership to the exported project.
- Runtime setters are silent programmatic projections. UserEvents represent
  genuine user transitions only. Names derive from component names and are
  collision-safe.
- Slider, Spinner, Spinbox, TabView and List are physically **PROVEN** through live and
  standalone ESP32-P4 firmware. List emits exactly one collision-safe item
  callback for each observed physical row tap and intentionally has no setter.
- Native Spinbox is proven through Registry → Tray → Canvas → Inspector →
  Browser Preview → LVGL Export → Runtime SDK → UserEvents → ESP32-P4 →
  Standalone Export. Its setter is silent, its changed hook fires exactly once
  per effective user action, and generated names are collision-safe.
- Dashboard is the only implemented Layout Designer template. All 44 practical
  Standard LVGL Registry entries are physically proven. The dedicated
  ForgeUI-native Widget phase is next.
- The ForgeUI Runtime SDK is an architectural direction, not a separately
  shipped runtime product. It is the documented surface formed by generated
  Runtime APIs, UserEvents, types and ownership rules.
- `componentsList.ts` remains only a compatibility list for legacy Chakra-era
  component parsing. Lottie, Menu, ObjxTempl and Editable remain explicitly
  quarantined future/unregistered types. AnimImage and ImageButton are active,
  proven Registry widgets. Quarantined types remain excluded from
  the active Inspector/AI catalogue and rejected by export preflight.
- Registry documentation metadata resolves to real Markdown files. Spinbox and
  QR Code use their focused guides; other entries resolve to the authoritative
  Feature Status ledger. Registry feature metadata records serialized-widget
  or registered-asset gating and the known Spinbox/QR LVGL configuration
  dependencies without yet redesigning sdkconfig generation.

## Current Proven Status..

The 2026-07-31 architecture milestone adds a data-driven Board Profile registry, persisted per-project hardware and feature selection, hydration-safe Board Selector loading, one generated `00_ForgeUI_Features.h`, export-time C/CMake/component-manifest pruning, deterministic asset-source deduplication, implemented Diagnostics, and lazy Wi-Fi Manager and Storage Browser lifecycles. Live Build & Flash and standalone ESP-IDF export consume the same project hardware profile and shared `ForgeUILvglExport.ts` generator. External DS3231 use is controlled per project by authoritative `firmwareFeatures.rtc`; legacy projects missing the field normalize to the board's historical enabled default. The setting belongs to project/board Hardware Configuration, never the runtime System menu.

QR Code is completed through the permanent Proven Widget Pipeline. Its Registry, Tray discovery and insertion, Canvas, Inspector, shared Browser Preview, semantic theme behavior, project-model compatibility, undo/redo, native LVGL 9.2.2 export and `FG_Set_QR_Code_Text(const char * text)` runtime API are implemented and validated. QR Code is output-only and intentionally generates no `95_UserEvents` callback. The generated code displayed correctly on ESP32-P4, scanned successfully with a mobile phone and matched across Live and Standalone export. Status: **PROVEN**.

ForgeUI has a reusable Interactive Asset Framework with five fully implemented asset types organized into three generated runtime families:

Interactive Input Runtime:

- Interactive Button
- Interactive Toggle Switch

Three-Position Input Runtime:

- Interactive Three-Position Toggle Switch

Binary Output Runtime:

- Interactive Light
- Interactive Status Indicator

All five types are proven through Studio creation, AI state-image generation, asset registration, persistence, Canvas rendering, Studio preview, Browser Preview, LVGL export and automated validation. The current physical ESP32-P4 record covers Interactive Button, Interactive Toggle Switch, Interactive Three-Position Toggle Switch, Interactive Light and Interactive Status Indicator. Three-Position LEFT/CENTER/RIGHT touch selection, its generated changed callback, consistent State Sheet visuals, and the corrected LVGL keyboard placement and sizing have also been proven on hardware.

The Studio presents all five types through one coherent Interactive Assets creation flow. Each runtime family owns its generated runtime while every type shares the common Interactive Asset Framework and retains type-specific asset models, designers, state mappings, preview behaviour, export behaviour and runtime behaviour.

All five Interactive Assets now have the same configured and unconfigured Inspector workflow, exact linked-asset Creator reopening, registry-driven preview refresh, shared cyan selection-border resizing with four edge and four corner hit zones, continuous Canvas clamping, and live Inspector geometry. Component geometry is authoritative after placement. Intrinsic dimensions and alpha bounds feed an explicit `Fit Bounds to Visible Artwork` action that preserves original uploads, creates linked same-size fitted state assets, and is idempotent. Canvas and Browser Preview preserve the saved component width and height and render artwork centred with contain-fit, so intrinsic artwork dimensions no longer limit component size. The shared LVGL exporter applies the same centred contain-fit rule against final component geometry.

Interactive Button, Interactive Toggle Switch, Interactive Three-Position Toggle Switch, Interactive Light and Interactive Status Indicator all use centred contain-fit rendering from final component geometry across Canvas, Browser Preview and generated LVGL output.

Two-state Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON and Status Indicator OFF/ON assets use one stable union crop. Three-Position Toggle uses the compatible LEFT/CENTER/RIGHT union path. Registry updates invalidate stale same-ID measurements and refresh configured helpers and previews without component reselection. Canvas, Browser Preview and generated LVGL output retain parity where each workflow has been physically verified.

Project Health Phases 1 and 2 are complete. The repository has clean TypeScript and ESLint baselines, protected asset references, and client- and server-side export validation before generated firmware files are written. Focused Creator, State Sheet, crop, image-pipeline and exporter regressions provide the current automated baseline. The project is ready for continued UI polish on top of its physically proven runtime families.

ForgeUI now also includes a built-in System Interface in addition to the Interactive Asset Framework. The System Interface is proven through Studio, Browser Preview, generated LVGL and physical ESP32-P4 hardware. ForgeUI now has a fully proven System Runtime together with a fully recovered Hosted Wi-Fi and SD coexistence baseline.

Current implemented System pages:

- System Launcher
- Display / Brightness
- Diagnostics
- Wi-Fi Manager
- Storage Browser
- Native LVGL Keyboard

Navigation is proven through the complete current hierarchy:

```text
Application
→ System
→ Display
→ System
→ Wi-Fi Manager
→ System
→ Application
```

Display brightness is physically connected to the ESP32-P4 backlight through `bsp_display_brightness_set()`. Brightness changes live while the slider is moved and remains in memory during the current device session.

The Wi-Fi backend and ESP-Hosted connection remain alive independently of the Manager UI. Wi-Fi Manager is created on first open and destroyed on Back. Password and Forget dialogs are created only when requested; teardown detaches and hides the keyboard, deletes UI objects and nulls their pointers without destroying driver, SDIO, lwIP or ESP-Hosted state. The shared backend/status timer remains alive where required.

Storage UI, its timer, worker task, queue and mutex are created on demand. Back requests asynchronous shutdown; RTOS resources and the page are deleted only after worker acknowledgement, with repeated shutdown/send paths guarded. The SD backend remains separately owned and alive.

Diagnostics is implemented as generated System Runtime plus the non-generated `50_DIAGNOSTICS.c/.h` snapshot backend. It reports supported internal heap, PSRAM, flash/application, performance, LVGL/display/object-count, Wi-Fi, SD, build-version and update-timing information. “Internal RAM Total” means the allocatable ESP-IDF internal heap for the queried capability class, not all physical ESP32-P4 SRAM.

The flashed build also contains a compact existing sysmon overlay of the form `66 FPS | RAM 45 KB`. It reuses LVGL's existing performance label/container and timer, samples `heap_caps_get_free_size(MALLOC_CAP_INTERNAL | MALLOC_CAP_8BIT)` at approximately 1000 ms, and is controlled by Diagnostics visibility. The observed implementation was estimated at about 8 bytes BSS and about 550 bytes code, with Canvas and Browser Preview unchanged. Durability is not yet solved: the built ELF contains `%lu FPS | RAM %lu KB`, while the current `managed_components/lvgl__lvgl/src/others/sysmon/lv_sysmon.c` has reverted to upstream CPU/render text. Therefore the overlay came from a direct managed-component edit that was overwritten or is otherwise absent from source. A ForgeUI-owned patch/override applied after dependency resolution, with a regression check for the format string and heap source, is required before this is reproducible architecture.

### Board and project feature ownership

`studio/src/forgeui/boards/ForgeUIBoardRegistry.ts` is authoritative for supported boards. The current production profile is Waveshare ESP32-P4 WiFi6 Touch LCD 7B: target `esp32p4`, 1024 × 600 at 16-bit colour, 32 MiB flash and 32 MiB PSRAM metadata. Its declared capabilities include display, touch, backlight, Wi-Fi, audio, SD card, USB host and camera; Bluetooth is false. Capability metadata does not itself implement a backend or System Tool.

The ownership sequence is:

```text
Board capability
  -> limits valid project feature selection
Persisted project hardware profile
  -> records enabled features
00_ForgeUI_Features.h
  -> generated compile-time flags
Firmware backend
  -> owns physical service behavior
System Tool UI
  -> generated only when its feature is enabled
```

Board Selector rendering uses deterministic registry defaults during SSR and the browser's first hydration render. Persisted local project state is applied after mount. Firmware Clean explicitly refreshes hardware state without remounting.

Current generated flags are `FG_FEATURE_WIFI`, `FG_FEATURE_BLUETOOTH`, `FG_FEATURE_AUDIO`, `FG_FEATURE_SD_CARD`, `FG_FEATURE_RTC`, `FG_FEATURE_USB_HOST`, `FG_FEATURE_CAMERA`, `FG_FEATURE_SETTINGS`, `FG_FEATURE_WIFI_MANAGER`, `FG_FEATURE_STORAGE_BROWSER` and `FG_FEATURE_DIAGNOSTICS`. `FG_FEATURE_RTC` specifically controls probing and use of the external DS3231 at address `0x68`. When disabled, ForgeUI generates `FG_FEATURE_RTC 0`, skips all DS3231 I2C access and initializes the existing software/NVS fallback time path directly, so Clock and Runtime APIs remain available. Configure it at **ForgeUI Studio → Board: ESP32-P4 7B → Configure Hardware → Hardware Configuration → Optional Hardware → External RTC**. Enabled mode retains DS3231 hardware support and fallback behavior. Live Studio and Standalone Export inherit the same persisted value.

External RTC disabled is **PHYSICALLY VALIDATED / PROVEN** on ESP32-P4 using a fresh Standalone Export. The confirmed boot profile was Wi-Fi ON, SD ON and RTC OFF. No DS3231 attach or read was attempted, no DS3231 unavailable/failure warning appeared, the NVS/software fallback epoch loaded correctly, Wi-Fi and SD remained operational, and normal ESP32-P4 runtime continued successfully.

`ForgeUILvglExport.ts` owns export-time System generation. Disabled features are removed from applicable includes, globals, typedefs/models, callbacks, page construction, timers and generated assets. `export-server.js` uses the same profile to prune source files, CMake requirements and `idf_component.yml` dependencies. `FG_FEATURE_WIFI` gates backend-facing Wi-Fi generation; `FG_FEATURE_WIFI_MANAGER` gates Manager UI. `FG_FEATURE_SD_CARD` gates backend-facing SD generation; `FG_FEATURE_STORAGE_BROWSER` gates Browser UI and worker resources. `FG_FEATURE_DIAGNOSTICS` gates Diagnostics page/runtime and overlay visibility. `FG_FEATURE_SETTINGS` gates the launcher and System pages.

The tested lean profile contains only the Application page, Settings launcher, canonical Settings icon, Brightness and Diagnostics; Wi-Fi and Storage source, runtime and dependencies are absent. Asset source paths are slash-normalized, canonicalized and deduplicated in first-discovery order. The default hero and canonical Settings icon are each emitted once, and live and standalone exports use the same path.

### Hardware memory validation

These figures identify different configurations and are not interchangeable benchmarks:

| Configuration / measurement point | Observed current internal free heap |
| --- | ---: |
| Lean Settings + Diagnostics profile | approximately 113 KB |
| Wi-Fi backend-only enabled profile | approximately 55 KB |
| Earlier eager connected/full-tools state | approximately 18 KB |
| Lazy-lifecycle, connected, Application page; serial probe | 45,795 bytes |
| Minimum-ever in that connected run; serial probe | 43,871 bytes |
| Largest internal free block in that connected run; serial probe | 27,648 bytes |

The connected Application page serial probe counted 62 LVGL objects. Compared with the earlier eager connected state, the lazy System Tools work recovered approximately 27.4 KB. Manually observed rounded overlay behavior was approximately 45 KB → approximately 24 KB during Wi-Fi/System UI activity → approximately 45 KB after release. Minimum-ever-free is historical and cannot prove lifecycle recovery; current free heap, largest free block and object count are the relevant comparison.

Codex did not remotely drive the physical touchscreen. The required ten-cycle Wi-Fi and Storage open/close sequence, RAM recovery and no-leak check remain operator proof boundaries.

The Standard LVGL Runtime now provides a consistent developer-facing SDK layer for the currently reviewed exported components. Application code controls generated UI through public `FG_Set_*`, `FG_Show_*`, `FG_Hide_*`, `FG_Add_*` and `FG_Clear_*` declarations in `90_Studio_Export.h`. Genuine user interaction crosses back into application code through generated `FG_On_*` declarations and preservation-merged bodies in `95_UserEvents.h/.c`. Interactive setters use per-instance guards so programmatic updates remain silent and cannot be misreported as genuine user events.

This Standard Runtime is independent from the artwork-backed Interactive Asset runtimes, built-in System Runtime, Hosted Connectivity Runtime and Storage Runtime.

The current Standard LVGL physical validation group is fully reviewed and signed off across Canvas, Browser Preview, generated LVGL and the ESP32-P4:

- Led
- Bar
- Arc
- Chart
- Table
- Keyboard
- Calendar
- Scale
- Roller
- MsgBox
- ButtonMatrix

The Standard input and selection parity group is now physically proven across Canvas, Browser Preview, generated LVGL and ESP32-P4:

- Input
- Textarea
- Checkbox
- Switch
- Radio
- Progress
- CircularProgress
- NumberInput
- Select
- Spinbox

Spinbox proof used ESP32-P4, ESP-IDF 5.5.4 and LVGL 9.2.2. It covered Tray
drag/drop, Canvas rendering and step controls, Inspector synchronization,
Browser parity, native live and Standalone generation, signed and decimal
values, rollover and clamping, touch increment/decrement, multiple instances,
feature gating, collision-safe generated callbacks and Runtime API generation.
Each effective user action produced exactly one
`FG_On_<Name>_Changed(int32_t value)` call; construction and
`FG_Set_<Name>_Value(int32_t value)` remained silent.

The proof closed the Tray-to-Canvas accept-list omission, Canvas drag-wrapper
click interception, stale preview-value synchronization, stale generated
firmware artifact, malformed off-screen helper-button coordinates,
live/Standalone parity verification gaps and missing export preflight
validation. Native Spinbox remains a selected-digit editor; NumberInput is the
appropriate Standard widget for free-form numeric text entry.

The final whole-screen comparison on 2026-07-30 confirmed the active graphite/orange semantic theme and component structure across Studio and hardware. Borders, surfaces, accent states and geometry were visually aligned within the recorded scope.

Standard Input and Standard Textarea generate native `lv_textarea` objects. Touch focuses the field, but no Standard Canvas Keyboard is attached automatically. The built-in System Runtime keyboard remains separate and private to System dialogs. A shared application-keyboard service would be separate future work.

The flashed ESP32-P4 remains the authoritative final visual reference.

## Current Priorities

1. ForgeUI-native Widgets.
2. Dashboard Widget Family.
3. Dashboard Designer.
4. Template Library.
5. Runtime SDK Expansion.
6. Background Designer.
7. Higher-level Application Components.

Practical LVGL parity is complete. Existing known issues remain tracked, but
there are no remaining practical LVGL implementation or proof candidates.

## Current Must-Not-Regress Rules

- Do not weaken the authoritative Widget Registry.
- Do not bypass the Board Profile registry.
- Do not read persisted hardware state during SSR render.
- Do not create a second feature-flag source.
- Do not let generated feature headers and CMake diverge.
- Do not generate disabled runtime code and merely hide it.
- Do not reintroduce eager Wi-Fi Manager or Storage UI construction.
- Do not destroy Wi-Fi/ESP-Hosted backend state when closing Manager UI.
- Do not delete Storage RTOS resources before worker shutdown acknowledgement.
- Do not allow duplicate asset source entries.
- Do not make managed-component modifications that cannot be reproduced.
- Do not claim RAM recovery using minimum-ever-free; compare current free heap, largest block and object count.
- Do not claim repeated-cycle physical proof until an operator performs it.
- Do not return the Widget Tray to manually maintained Sidebar entries.
- Preserve registry-driven click, drag and keyboard insertion.
- Preserve deterministic, hydration-safe Widget Tray loading.
- Preserve Widget Tray search, categories, interactive asset integration and narrow-sidebar polish.
- Preserve the shared `LayoutDefinition` architecture.
- Preserve the implemented Dashboard template. Treat Industrial HMI, Control
  Panel, Monitoring, SCADA Overview and Mobile / Portrait as roadmap candidates
  until registered in code.
- Preserve template-aware AI Fill: AI owns content choice while `LayoutDefinition`, semantic regions and Auto Arrange own structure and geometry.
- Preserve free-form decimal Canvas movement; do not introduce snapping as a side effect of layout or Widget Tray work.

- Do not return template-based Dashboard generation to AI-owned pixel coordinates.
- Do not remove the authoritative AI component catalogue.
- Do not weaken canonical type validation or asset-reference validation.
- Do not introduce a parallel non-exportable layout document.
- Do not manually patch generated `90_Studio_Export.*`.
- Do not alter existing Standard Runtime APIs or `95_UserEvents` signatures for Layout Designer work.
- Do not make region Boxes consume runtime semantics beyond the existing Box visibility contract.
- Do not claim physical proof until Generate -> Build -> Flash -> visual review is completed.

## Standard LVGL Semantic Theme Milestone

ForgeUI now uses one semantic theme pipeline for the physically proven Standard component group:

```text
Selected Theme
        |
        v
Semantic Theme Resolver
        |-- Canvas
        |-- Browser Preview
        `-- LVGL Export
                |
                v
        Generated Firmware
                |
                v
           ESP32-P4
```

Canvas and Browser Preview follow the selected theme. Generated LVGL consumes the same semantic theme resolution, and the ESP32-P4 follows the selected theme after Generate -> Build -> Flash. Runtime live theme switching on the device was not added.

The Standard semantic palette is:

- `surface`
- `surfaceSecondary`
- `surfaceBorder`
- `textPrimary`
- `textSecondary`
- `accent`
- `accentText`
- `disabledText`
- `selectedSurface`

Standard components consume these semantic roles instead of hard-coded decorative colours. Primary text is independent from accent, accent text is chosen by contrast, and missing values resolve through the deterministic graphite fallback. Custom palettes export correctly.

Selected-theme changes propagate through:

- Canvas
- Browser Preview
- Code Preview
- live firmware generation
- Build & Flash
- Clean Build & Flash
- standalone ESP-IDF export

## Standard LVGL Component Runtime APIs

ForgeUI's standard LVGL components generate developer APIs only when the component owns meaningful runtime state or actions.

Completed runtime APIs:

- ✓ LED
- ✓ Bar
- ✓ Arc
- ✓ Chart
- ✓ Keyboard
- ✓ Calendar
- ✓ Roller
- ✓ Message Box
- ✓ Button Matrix
- ✓ TabView
- ✓ Tileview
- ✓ Input
- ✓ Textarea
- ✓ Switch
- ✓ Checkbox
- ✓ Radio
- ✓ Progress
- ✓ CircularProgress
- ✓ NumberInput
- ✓ Select
- ✓ Image
- ✓ Box
- ✓ IconButton
- ✓ QR Code

Inspected and intentionally API-free:

- ✓ Scale
- ✓ Line
- ✓ Icon
- ✓ Divider

Completed serialized presentation properties:

- ✓ Button Text
- ✓ Text Value
- ✓ Heading Text
- ✓ Clock Presentation

Slider Canvas interaction and native runtime are complete. The generated
collision-safe setter clamps values and remains silent; the changed hook is
reserved for genuine user interaction.

Ownership and generation rules:

- `90_Studio_Export.h` declares public `FG_*` APIs.
- `90_Studio_Export.c` retains private LVGL objects and runtime state and implements the APIs, transition helpers and LVGL event adapters.
- `95_UserEvents.h` declares generated developer hooks.
- `95_UserEvents.c` is merged in live firmware: matching developer-written function bodies are preserved and only missing declarations or stubs are appended. Existing hooks are not deleted.
- In a standalone exported project, `95_UserEvents.*` becomes developer-owned application code.
- Live `/export` and standalone `/export-idf-project` both use `studio/export-server.js` and the shared `studio/src/forgeui/ForgeUILvglExport.ts` generator.
- Generated firmware is evidence and build input, never the source of the fix; these files must not be manually patched.
- Component instances are sorted deterministically, C identifiers are sanitized, and collisions receive deterministic suffixes such as `_2`.

Interactive controls:

- expose a public setter or control API and a genuine user-event hook;
- create silently;
- keep programmatic setter calls silent;
- use per-instance guards to suppress setter-generated LVGL events;
- invoke hooks only for genuine user interaction.

Output-only controls:

- expose a public setter;
- generate no developer hook when no genuine user transition exists.

Presentation-only controls:

- expose no public runtime API;
- generate no developer hook.

Interactive Asset hook ownership remains separate.

### Standard Component API Summary

| Serialized type | Public API | Developer hook | Runtime semantics |
| --- | --- | --- | --- |
| `Led` | `FG_Set_<Name>(bool on)` | `FG_On_<Name>_Changed(bool enabled)` | Retained boolean output |
| `Bar` | `FG_Set_<Name>(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` | Clamped scalar output |
| `Arc` | `FG_Set_<Name>(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` | Clamped scalar output |
| `Chart` | `FG_Add_<Name>_Point(int32_t value)`, `FG_Clear_<Name>(void)` | `FG_On_<Name>_Point_Added(int32_t value)`, `FG_On_<Name>_Cleared(void)` | Single-series streaming output |
| `Keyboard` | `FG_Show_<Name>(void)`, `FG_Hide_<Name>(void)` | `FG_On_<Name>_Shown(void)`, `FG_On_<Name>_Hidden(void)` | Visibility service |
| `Calendar` | `FG_Set_<Name>_Date(uint16_t year, uint8_t month, uint8_t day)` | `FG_On_<Name>_Date_Changed(uint16_t year, uint8_t month, uint8_t day)` | Date selection |
| `Roller` | `FG_Set_<Name>_Selected(uint32_t index)` | `FG_On_<Name>_Changed(uint32_t index, const char * text)` | Option selection |
| `Msgbox` | `FG_Show_<Name>(void)`, `FG_Close_<Name>(void)` | shown, closed and button-pressed hooks | Temporary dialog visibility and button actions |
| `ButtonMatrix` | `FG_Set_<Name>_Selected(uint32_t button_index)` | `FG_On_<Name>_Button_Selected(uint32_t index, const char * text)` | Button selection |
| `Tabview` | `FG_Set_<Name>_Selected(uint32_t tab_index)` | `FG_On_<Name>_Changed(uint32_t tab_index)` | Retained active-tab selection |
| `Tileview` | `FG_Set_<Name>_Selected(uint32_t column, uint32_t row)` | `FG_On_<Name>_Changed(uint32_t column, uint32_t row)` | Retained active-tile coordinate |
| `Input` | `FG_Set_<Name>_Text(const char * text)` | `FG_On_<Name>_Changed(const char * text)` | Native single-line `lv_textarea`; silent setter and genuine-edit hook; no automatic keyboard |
| `Textarea` | `FG_Set_<Name>_Text(const char * text)` | `FG_On_<Name>_Changed(const char * text)` | Native multiline `lv_textarea`; silent setter and genuine-edit hook; no automatic keyboard |
| `Switch` | `FG_Set_<Name>_Checked(bool checked)` | `FG_On_<Name>_Changed(bool checked)` | Native LVGL checked state with explicit semantic track and knob states |
| `Checkbox` | `FG_Set_<Name>_Checked(bool checked)` | `FG_On_<Name>_Changed(bool checked)` | Native LVGL checked state; fallback text is empty and explicit custom labels remain serialized |
| `Radio` | `FG_Set_<Name>_Selected(bool selected)` | `FG_On_<Name>_Changed(bool selected)` | Independent circular `lv_checkbox`; empty fallback label and no grouping model |
| `Progress` | `FG_Set_<Name>_Value(int32_t value)` | None | Output-only retained native `lv_bar`; intentionally non-draggable |
| `CircularProgress` | `FG_Set_<Name>_Value(int32_t value)` | None | Output-only retained full-circle arc |
| `NumberInput` | `FG_Set_<Name>_Value(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` | Guarded numeric textarea plus native increment/decrement buttons using serialized step |
| `Select` | `FG_Set_<Name>_Selected_Index(uint32_t index)` | `FG_On_<Name>_Changed(uint32_t index, const char * text)` | Guarded native `lv_dropdown`; serialized option list |
| `Image` | `FG_Set_<Name>_Source(const void * src)` | None | Output-only raw LVGL source pointer |
| `Box` | `FG_Set_<Name>_Visible(bool visible)` | None | Layout container with runtime visibility only; root Box excluded |
| `IconButton` | `FG_Set_<Name>_Enabled(bool enabled)` | `FG_On_<Name>_Clicked(void)` | Interactive native button; serialized icon |
| `QRCode` | `FG_Set_<Name>_Text(const char * text)` | None | Output-only native `lv_qrcode`; runtime payload regeneration, semantic colours and optional quiet zone |
| `Scale` | None | None | Visual scale/tick renderer; owns no value |
| `Line` | None | None | Static two-point visual line; owns no semantic runtime state |
| `Icon` | None | None | Studio icon-picker convenience exported as a normal `lv_image`; serialized presentation only |
| `Divider` | None | None | Presentation-only visual separator; owns no runtime state |
| `Clock` | None | None | RTC-owned live time with serialized presentation configuration |
| `Button` | None added by Button Text | None added by Button Text | Static standard LVGL button with serialized visible label text |
| `Text` | None | None | Static LVGL label with serialized text content |
| `Heading` | None | None | Static LVGL heading label with serialized heading content |
| `Slider` | `FG_Set_<Name>_Value(int32_t)` | `FG_On_<Name>_Changed(int32_t)` | Physically proven in live and standalone ESP32-P4 firmware |
| `Spinbox` | `FG_Set_<Name>_Value(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` | Physically proven native selected-digit editor in live and Standalone ESP32-P4 firmware |

### LED

The basic LED is serialized as `Led`, distinct from Interactive Light and Interactive Status Indicator. It retains its `lv_obj_t *` and boolean state, defaults to initially ON, and uses `lv_led_on()` / `lv_led_off()`. `FG_Set_<Name>(bool on)` returns when the requested state is already current and calls `FG_On_<Name>_Changed(bool enabled)` only after a real transition. Creation initializes state without firing the hook.

### Bar

The basic Bar is serialized as `Bar`. It retains its `lv_obj_t *`, current integer value and configured minimum and maximum. Defaults are range `0..100` and initial value `70`; persisted range and value properties are honored, including negative ranges. The setter clamps before comparison, suppresses repeated effective values, calls `lv_bar_set_value(..., LV_ANIM_OFF)`, updates retained state and then calls the changed hook. Creation does not notify.

### Arc

The basic Arc is serialized as `Arc`. Defaults are range `0..100`, initial value `65`, normal mode, LVGL default background angles, and the existing enabled knob/native clickability. Persisted range, value, rotation, background angles and mode are honored, including negative ranges. Its setter clamps before comparison, calls `lv_arc_set_value()`, updates retained state and notifies only on a real programmatic transition. No new input event was added; existing native touch behavior and appearance are preserved.

### Chart

The Chart is serialized as `Chart` and remains a line chart with one primary-Y series. Defaults are seven points, Y range `0..100`, SHIFT update mode, `LV_PALETTE_BLUE`, and startup data `10, 30, 20, 50, 40, 70, 60`. Its chart and series pointers are retained. Persisted point count, range, division lines, update mode, series color and initial data are honored when present.

`FG_Add_<Name>_Point()` clamps each sample and calls `lv_chart_set_next_value()`. Identical consecutive values remain valid samples and each accepted sample fires the point-added hook. `FG_Clear_<Name>()` resets the series points to `LV_CHART_POINT_NONE`, refreshes the chart and fires the cleared hook. Startup data is created directly and does not fire hooks. This milestone intentionally supports the current single-series architecture only.

### Standard Keyboard

The standard `Keyboard` component is eagerly created with a private one-line textarea. Both pointers are retained and the component is initially visible. Show reattaches the textarea, clears hidden state and moves the keyboard to the foreground; Hide detaches the textarea and hides the keyboard. Repeated visibility requests are suppressed and creation does not notify. Only Show and Hide are public: LVGL objects, modes, textarea attachment and key injection remain private.

This standard Canvas Keyboard is separate from the built-in System/Wi-Fi native keyboard, whose lazy top-layer architecture is unchanged.

### Calendar

The Calendar is serialized as `Calendar`. Current hardcoded defaults are today's date `2026-06-18`, the shown month June 2026, and no initial selected or highlighted date. The selected date is retained separately from today. The generated setter validates Gregorian dates including leap years, suppresses identical selections, updates the shown date and highlighted selection, and then calls the hook. Touch selection already uses `LV_EVENT_VALUE_CHANGED` and `lv_calendar_get_pressed_date()`; touch and programmatic changes share retained state without duplicate notifications. Creation does not fire a hook. No Calendar Inspector controls were introduced.

### Roller

The Roller is serialized as `Roller`. Defaults are options `One`, `Two`, `Three`, `Four`, selected index `0`, three visible rows, normal mode and `LV_ANIM_OFF`. Persisted options, selection, visible row count and normal/infinite mode are honored. The object, selected index and option count are retained. Programmatic and `LV_EVENT_VALUE_CHANGED` touch paths share one transition helper, clamp to the final valid option, suppress repeats and pass selected text through a generated UTF-8-sized buffer valid for the duration of the callback. Creation does not notify.

### Message Box

The Message Box is serialized as `Msgbox`. It is a custom ForgeUI panel built from ordinary LVGL objects, not `lv_msgbox`. Defaults are title `Message`, body `Example message text`, buttons `OK`, `Cancel`, initially visible, and non-modal as a child of the application container. Persisted title, body and button arrays are honored.

The panel object and visibility are retained. Show/Close use shared visibility handling, suppress repeats, and Show moves the panel to the foreground. Button click callbacks use stable generated metadata to report index and text. Buttons do not automatically close the panel because that was not its existing behavior. Creation does not fire shown, closed or button hooks.

### Button Matrix

The Button Matrix is serialized as `ButtonMatrix`. Its default map is `One Two Three` / `Four Five Six`; row breaks do not count as buttons. The default selected index is `1` (`Two`), one-check is disabled, and there are no initially checked or disabled buttons. Persisted maps, selected index, checked state, one-check mode and disabled-button indexes are honored. Selected and checked remain distinct LVGL concepts.

The matrix object, button count and current selection are retained. Programmatic and `LV_EVENT_VALUE_CHANGED` touch paths share one transition helper. It clamps to a valid button, rejects disabled buttons, suppresses repeats, updates retained state before the LVGL selected-button call to prevent duplicate events, and passes text from the persistent generated map. Creation does not notify.

The first live Button Matrix inspection used a stale running Studio exporter bundle: it produced an old `90_Studio_Export.*` result while `95_UserEvents.*` reflected the newer hooks. Restarting Studio and regenerating through `/export` corrected all four files. This was stale running Studio/dev-server code, not a split between the live and standalone generators.

### Standard Canvas

Standard Canvas is a bounded LVGL container and may contain configured serialized artwork. The generic renderer must neither invent decorative SVG artwork nor discard configured artwork and render only an empty surface. Artwork resolves through the existing serialized fields and uploaded-asset registry, and Canvas and Browser Preview use the same artwork-aware renderer.

Artwork preserves contain scaling, centred alignment, clipping, transparency and serialized `x` / `y` / `w` / `h`. Generated LVGL emits a clipped Canvas parent with a centred child `lv_image`, the configured generated image symbol and the saved scale. The exporter and asset registry remain the source of truth. Physical proof of the restored Canvas-artwork path remains pending final regeneration and flash; this is separate from the proven Standard Image widget.

### TabView

TabView is serialized as `Tabview`. Three fixed tabs remain: `Tab 1`, `Tab 2` and `Tab 3`. Tab labels and tab count are not Inspector-configurable. Active selection defaults to index `0`, and persisted `selectedIndex` is honored.

Canvas and Browser Preview use a shared renderer. Preview selection initializes from serialized state and direct preview tab switching is supported. Current geometry uses a 34 px tab bar, equal/remainder tab widths, square outer bounds and explicit content/page sizing. Selected styling uses a muted accent or selected-surface treatment, an accent bottom indicator and semantic text colours. Browser Preview does not simulate native swipe animation.

Active tab is genuine semantic retained runtime state. Touch and programmatic selection share the existing transition helper, API and hook ownership. The public setter clamps indexes above the final tab, suppresses repeated effective selections, updates retained state before LVGL and calls `lv_tabview_set_active(..., LV_ANIM_OFF)`. Touch parity uses `LV_EVENT_VALUE_CHANGED` and reads `lv_tabview_get_tab_active()`. Creation is silent, and the hook fires exactly once after a real transition. Same-named components receive deterministic `_2` suffixes. TabView remains physically **PROVEN** on ESP32-P4.

Generated example:

```c
void FG_Set_Main_Tabs_Selected(uint32_t tab_index);
void FG_On_Main_Tabs_Changed(uint32_t tab_index);
```

### Tileview

Tileview is serialized as `Tileview`. The current ForgeUI contract is native swipe paging over a fixed `2 × 2` coordinate space:

- Tile 1 = column 0, row 0
- Tile 2 = column 1, row 0
- Tile 3 = column 0, row 1
- Tile 4 = column 1, row 1

TileView retains a fixed `2 × 2` coordinate model. Canvas and Browser Preview
use the same single-active-page renderer. Generated LVGL uses native
`lv_tileview_create()` and four full-size `lv_tileview_add_tile()` pages with
direction constraints matching their neighbours.

Initial selection is column `0`, row `0`; persisted `selectedColumn` / `selectedRow` or `initialColumn` / `initialRow` values are honored. Active column and row remain genuine retained runtime state, and the existing setter and hook names remain unchanged. Invalid coordinates clamp safely, unavailable objects and missing mapped tiles are rejected, repeated effective selections are suppressed, and creation remains silent.

Tileview consumes the semantic roles `surface`, `surfaceSecondary`,
`surfaceBorder` and `textPrimary`. Native swipe paging and scroll snapping are
part of the contract. Labels and the fixed grid size remain non-configurable.
Physical ESP32-P4 proof confirms silent startup, correct `2 × 2` coordinate
reporting, horizontal and vertical navigation, exactly one callback per
effective tile change, and stable repeated navigation. Observed callback
coordinates include `(1,0)`, `(0,0)`, `(1,1)` and `(0,1)`. Wi-Fi remained
connected, SD remained ready, and TabView, Spinbox and List continued working.
TileView is **PROVEN**.

Generated example:

```c
void FG_Set_Tileview_Selected(uint32_t column, uint32_t row);
void FG_On_Tileview_Changed(uint32_t column, uint32_t row);
```

Arbitrary layouts, sparse coordinates, custom directions, custom labels and Inspector grid configuration were not introduced.

### Input

`Input` exports a native single-line `lv_textarea`. It uses semantic `surface`, `surfaceBorder`, `textPrimary`, `accent` and `disabledText`, with Canvas, Browser Preview and ESP32-P4 border/theme parity physically proven. `FG_Set_<Name>_Text(const char * text)` is silent; `FG_On_<Name>_Changed(const char * text)` represents genuine user edits. Creation is silent, and a per-instance guard suppresses setter-generated events. Placeholder, password mode, accepted characters, maximum length and presentation remain serialized.

Touch focuses the native field. No Standard Canvas Keyboard is attached automatically. The built-in System Runtime keyboard remains separate and private to System dialogs.

### Textarea

`Textarea` exports a native multiline `lv_textarea` through the same semantic border/theme pipeline as Input. Canvas, Browser Preview and ESP32-P4 parity are physically proven. Runtime owns current multiline text only; placeholder remains independent serialized presentation. Its setter is guarded and silent, while genuine `LV_EVENT_VALUE_CHANGED` edits invoke the changed hook. Creation does not notify.

Touch focuses the native field. No Standard Canvas Keyboard is attached automatically; application-wide keyboard attachment remains separate future work.

### Switch

`Switch` exports native `lv_switch`, retains the object and checked state, and preserves `FG_Set_<Name>_Checked(bool checked)` plus `FG_On_<Name>_Changed(bool checked)`. The LVGL default blue leakage came from the native checked-state rule. Generated styling now explicitly defines an opaque `surfaceSecondary` main track, a transparent default indicator, an opaque `accent` indicator for `LV_PART_INDICATOR | LV_STATE_CHECKED`, and an opaque `accentText` knob. The P4 checked state follows the active theme rather than native LVGL blue. Creation and programmatic updates remain silent.

Exporter source changes require refreshing or restarting the running Studio bundle before regeneration. When exporter code changes, `90_Studio_Export.c` must be inspected after regeneration and before build/flash.

### Checkbox

`Checkbox` exports native `lv_checkbox`, retains checked state, and uses the same guarded checked-state architecture as Switch. Unwanted fallback/default label text and legacy fallback wording no longer appear; explicit custom labels remain supported and serialized. Circular/square indicator styling follows the semantic theme, and checked-state theme parity is physically proven on P4. `FG_Set_<Name>_Checked()` remains silent, genuine user changes invoke the existing hook, and creation is silent.

### Radio

`Radio` exports a retained `lv_checkbox` styled with a circular indicator. Default and legacy `"Radio"` text are removed: new Radio components serialize no fallback label, existing legacy `"Radio"` values normalize to empty, generated LVGL emits an empty checkbox label when no custom label is present, and explicit custom labels remain supported. Canvas, Browser Preview and P4 indicator-only parity are physically proven. `FG_Set_<Name>_Selected(bool selected)` and the existing hook use guarded per-instance state. Radios remain independently selectable; no Radio Group or mutual-exclusion architecture exists.

### Progress

`Progress` is an output-only native `lv_bar`. It is intentionally non-draggable, retains its object, current value and serialized range, and exposes `FG_Set_<Name>_Value(int32_t value)`. The setter clamps to the configured range and suppresses repeated effective values. It generates no developer changed hook. Canvas, Browser Preview and P4 parity are physically proven. Slider remains the interactive touch-value control; Bar and Progress retain distinct runtime contracts.

### CircularProgress

`CircularProgress` is an output-only native `lv_arc`. It retains its object and value and exposes silent `FG_Set_<Name>_Value(int32_t value)` with range clamping and repeated-value suppression. It generates no developer changed hook.

The generated control uses a full 360-degree background arc with rotation 270 degrees, `surfaceSecondary` for the remaining track, `accent` for the completed track, explicit arc opacity and width, no visible knob style, and no `LV_OBJ_FLAG_CLICKABLE`. It cannot be touch-dragged. Canvas, Browser Preview and P4 parity are physically proven.

The first generated hardware file remained stale because the running Next.js bundle predated the exporter repair. Restarting Studio and regenerating corrected the live C output.

### NumberInput

`NumberInput` is a composed generated LVGL control. One outer container owns the complete bounds and uses `surface`, a 1 px `surfaceBorder`, 6 px radius, and no outline or shadow. A retained one-line `lv_textarea` is inset inside it. Native increment and decrement `lv_button` controls occupy the rightmost 32 px and use `LV_SYMBOL_UP` and `LV_SYMBOL_DOWN`. One vertical divider separates the field and stepper area; one horizontal divider separates increment and decrement. Canvas and Browser Preview share that outer frame and divider structure.

Serialized `step` is consumed by the hardware increment/decrement callbacks. `int64_t` intermediate arithmetic protects addition and subtraction, values clamp to serialized minimum and maximum, and button-originated changes invoke the existing changed hook. `FG_Set_<Name>_Value()` remains silent. Explicit semantic styling covers field, buttons, icons, pressed, focused and disabled states. Full Canvas, Browser Preview and P4 border/theme/interaction parity, including working hardware arrows, is physically proven.

### Select

`Select` exports native `lv_dropdown`; P4 was the visual reference for the final closed-control structure. Canvas and Browser Preview now show the same visible 1 px outer border. The closed background uses `surface`, border uses `surfaceBorder`, text and arrow use `textPrimary`, focus uses `accent`, pressed/open and selected options use `selectedSurface`, pressed/selected text uses `accentText`, and disabled background/text/arrow use `surfaceSecondary` and `disabledText`.

Arrow styling explicitly covers `LV_PART_INDICATOR`. Popup-list styling is applied through `lv_dropdown_get_list()`, and selected rows explicitly cover `LV_PART_SELECTED` plus checked/pressed combinations so native LVGL blue/default styling cannot leak through. The existing selected-index setter remains guarded and silent; genuine selection invokes the existing changed hook. Canvas, Browser Preview, generated LVGL and ESP32-P4 parity are physically proven.

### Image

`Image` is output-only. LVGL-ready instances retain native `lv_image` and current source pointer and expose `FG_Set_<Name>_Source(const void * src)`. `NULL`, unavailable objects and unchanged pointers are safe no-ops. Pending or unconverted assets preserve their existing placeholder and their setter safely no-ops. The API accepts raw LVGL source pointers only: it does not introduce asset-ID, filesystem-path or runtime conversion lookup. Image conversion and asset generation remain unchanged, and no hook exists.

### Box

`Box` remains the presentation/layout container and owns runtime visibility only. Non-root generated Boxes retain their native object and visibility state and expose `FG_Set_<Name>_Visible(bool visible)`. The setter suppresses unchanged state and uses the native hidden flag. Root screen Boxes are excluded, children remain attached to the retained Box, and no hook exists. Geometry, style, layout and scrolling remain serialized.

### IconButton

`IconButton` is an interactive native button, distinct from presentation-only Icon. It retains the button and enabled state, exposes `FG_Set_<Name>_Enabled(bool enabled)`, and invokes `FG_On_<Name>_Clicked(void)` only for genuine enabled clicks. Creation and setter calls are silent; disabled IconButtons do not fire hooks. Canvas remains selectable, draggable and resizable, while Browser Preview supplies temporary pressed feedback without project mutation. Icon selection remains serialized and no runtime icon replacement API exists; Image exclusively owns source swapping.

### Slider Canvas interaction

Slider track/thumb interaction changes temporary preview value, surrounding Canvas interaction can move the component, and project JSON is not mutated. Browser Preview remains interactive with temporary local state. Native LVGL export retains the Slider and provides the completed silent setter and genuine-user change hook described in the Widget Registry and generated API sections.

### QR Code

`QRCode` is a Standard Runtime Display widget registered through the authoritative Widget Registry. Its default geometry is `180 × 180` and its default payload is `https://forgeui.co.nz`. The Inspector exposes typed content fields plus optional Foreground and Background colour overrides together with the normal geometry controls. LVGL 9.2.2 has no quiet-zone setter; Canvas and Browser Preview intentionally mirror its native integer-module sizing and centered remainder pixels without inventing an unsupported property.

Canvas and Browser Preview share one deterministic vector module renderer. The preview contains no raster QR artwork, reflects the actual encoded text, remains sharp while resized and uses the selected semantic accent and surface unless explicit colours are saved.

Generated firmware uses the native LVGL 9.2.2 QR implementation:

```c
lv_obj_t * qr = lv_qrcode_create(parent);
lv_qrcode_set_size(qr, size);
lv_qrcode_set_dark_color(qr, foreground);
lv_qrcode_set_light_color(qr, background);
lv_qrcode_update(qr, text, strlen(text));
```

Named instances generate:

```c
void FG_Set_QR_Code_Text(const char * text);
```

The setter regenerates the native QR data at runtime. QR Code intentionally generates no `95_UserEvents` callback because it is an output-only display and has no genuine user interaction. Registry insertion, normal project serialization, undo/redo, hydration-safe Tray loading, Canvas, Browser Preview, semantic theme resolution, native LVGL export and runtime API generation are covered by focused tests. Generated C, ESP32-P4 display, successful mobile scan and matching Live/Standalone behavior are physically accepted. **QR CODE — PROVEN.**

### Scale

Scale is the LVGL 9 `lv_scale` widget and is currently only a visual ruler/tick renderer. Its hardcoded export is range `0..100`, 11 total ticks, a major tick every 2 ticks, horizontal-bottom mode and labels below the scale. It owns no current value, receives no value event, retains no runtime object after creation, and generates no API or hook. No runtime API was added because a setter would invent semantics unsupported by LVGL. Runtime value APIs belong on value-owning controls such as Slider, Arc or Meter.

### Line

Line is serialized as `Line`, remains presentation-only and API-free, and continues to export native LVGL `lv_line`. Its persisted endpoint properties are `startX`, `startY`, `endX` and `endY`, relative to the Line origin.

Selected Canvas Lines expose draggable start/end handles. Endpoint dragging redraws immediately, rebases `x` / `y`, recalculates `w` / `h` and preserves relative endpoint coordinates. The existing wrapper continues to own whole-component movement. The Inspector exposes the four endpoint coordinates and Line Width. Canvas and Browser Preview share the endpoint-aware renderer.

Generated LVGL emits the stored endpoints through `lv_line_set_points()`. Legacy projects without endpoint properties resolve to start `(0,0)` and end `(width,height)`. Horizontal, vertical, 45-degree, crossed and arbitrary-angle lines are supported. Shift snapping is not implemented. Line consumes its persisted colour, opacity and thickness. Live and Standalone output were physically validated on ESP32-P4. **LINE — PROVEN.**

### Icon runtime decision

The standard `Icon` component is a Studio-only authoring convenience that provides the built-in icon picker. At export it becomes a normal LVGL `lv_image` backed by the existing generated image symbol; it does not form a separate runtime component family.

Icon owns no runtime state and intentionally generates neither a public setter nor a developer hook. Adding `FG_Set_<Icon_Name>_Source(...)` would duplicate the Standard Image runtime without adding capability. Developers who require runtime image changes must use the standard `Image` component and its `FG_Set_<Image_Name>_Source(const void * src)` API. Icon should not be used for runtime image swapping.

### Divider runtime decision

The standard `Divider` is a presentation-only visual separator. It owns no runtime state and intentionally generates neither a public API nor a developer hook.

Application code should control the visibility of the layout region containing a Divider rather than treating the Divider as an independent runtime component. When dynamic appearance or disappearance is required, place it in an appropriate parent `Box` and call `FG_Set_<Parent_Box_Name>_Visible(bool visible)`.

### Standard Text Presentation

Button, Text and Heading now have real serialized visible-text properties. These are editor and export presentation properties, not runtime state APIs.

#### Button Text

- Property: `buttonText`
- Default: `"Button text"`
- Inspector field: Button Text
- Canvas Preview, Browser Preview, live `/export` and standalone `/export-idf-project` use the saved value.
- Project JSON persists the value, while component naming remains independent from displayed text.
- Legacy projects recover existing child text before falling back to `"Button text"`.
- Generated C strings are escaped safely.
- No runtime API or `95_UserEvents` hook was added.

#### Text Value

- Property: `textValue`
- Default: `"Text value"`
- Inspector field: Text Value
- Canvas Preview and Browser Preview use the shared Standard Text renderer; live and standalone export use the saved value.
- Empty text is valid, and component naming remains independent from displayed text.
- Legacy `children`, `text` and `value` fields are supported.
- The default semantic role is `textPrimary`; legacy literal white does not override the active semantic theme by default.
- Generated LVGL explicitly applies the resolved colour with `lv_obj_set_style_text_color(...)`.
- Serialized content, `x` / `y` / `w` / `h`, font size, alignment and wrapping are preserved.
- Browser Preview polish uses top-left alignment and the current serialized/default size without preview-only centring.
- Non-default custom-theme tests prove `textPrimary` reaches Canvas, Browser Preview and exporter output.
- Shared C escaping handles backslashes, quotes, newlines, carriage returns and tabs.
- No runtime API or `95_UserEvents` hook was added.
- Physical theme confirmation remains pending final flash.

#### Heading Text

- Property: `headingText`
- Default: `"Heading title"`
- Inspector field: Heading Text
- Canvas Preview and Browser Preview use the shared Standard Heading renderer; live and standalone export use the saved value.
- Component naming remains independent from displayed text.
- Legacy `children`, `text` and `value` fields are supported.
- The default semantic role is `textPrimary`; legacy literal white does not override the active semantic theme by default.
- Generated LVGL explicitly applies the resolved text colour.
- Serialized content, `x` / `y` / `w` / `h`, size, weight and alignment are preserved.
- Browser Preview polish uses top-left alignment, stronger visual hierarchy and no preview-only centring.
- Non-default custom-theme tests prove `textPrimary` reaches Canvas, Browser Preview and exporter output.
- Safe C-string escaping remains shared.
- No runtime API or `95_UserEvents` hook was added.
- Physical theme confirmation remains pending final flash.

### Standard Wi-Fi Status Presentation

Standard Wi-Fi remains presentation driven by the existing runtime polling and
status mappings. Its serialized properties are `displayMode` (`icon-text`,
`icon-only`, or `text-only`), `showSignalStrength`, and `previewState`.
`previewState` provides deterministic Studio presentation for Disabled,
Starting, Connecting, Connected, Internet Available and Failed; firmware never
uses it as network truth. Canvas and Browser share
`ForgeUIStandardWifiStatus.ts`. Generated LVGL consumes the existing
`fg_wifi_get_snapshot()` / `fg_wifi_status_text()` backend, gives every widget
instance a collision-safe label, recognizes a future backend Internet state,
and optionally appends connected RSSI. Colours come only from semantic theme
roles. Wi-Fi Status is output-only and generates neither a public setter nor a
`95_UserEvents` hook. Canvas, Browser Preview, Live Studio and Standalone Export
presentation have completed ESP32-P4 physical validation; Wi-Fi Status is
**PROVEN**.

### Clock Presentation

Clock is serialized as `Clock` and differs from ordinary serialized text. Its presentation properties are:

```ts
hourFormat: '24' | '12'
showSeconds: boolean
blinkSeparator: boolean
```

Defaults are 24-hour format, seconds hidden and separator blinking enabled. Displayed time remains runtime state: there is no editable Clock Time field. Persisted `children: "12:34"` is only a legacy preview/startup placeholder.

The live value comes exclusively from the RTC/system-time runtime, and generated code reads time fields through `fg_rtc_get()`. Canvas Preview and Browser Preview use live browser time and respect all three presentation properties. Live and standalone export share the same settings and support `HH:MM`, `HH:MM:SS`, `hh:MM AM/PM` and `hh:MM:SS AM/PM`. Blinking affects separator characters only; separators remain visible when blinking is disabled.

Each generated Clock retains its own `lv_obj_t *` label, `lv_timer_t *` timer, separator-visible state and update callback. Duplicate names receive deterministic `_2` identifiers, so multiple Clocks can use different formats simultaneously. Immediate startup update and the one-second timer update are retained.

No timezone feature, RTC setter, `FG_Set_Clock_Time` API or `FG_On_Clock_Changed` hook was added.

### Validation Record

- The eleven-component Standard theme/parity regression reached 158/158.
- Graphite/orange, Cyber teal and Nordic light were verified across the shared semantic theme pipeline.
- Custom palette export was verified.
- Theme parity was physically reviewed through Canvas, Browser Preview, generated LVGL and ESP32-P4.
- Parity/export tests, three-theme verification, TypeScript, ESP-IDF 5.5.4, LVGL 9.2.2, firmware build, firmware flash, physical ESP32-P4 review and `git diff --check` passed for the eleven-component group.
- Focused Input, Textarea, Switch, Checkbox, Radio, Progress, NumberInput, Select, Image, Box and IconButton suites passed.
- The complete exporter regression reached 212/212 after IconButton.
- The Canvas regression suite reached 51/51 in the later Standard Runtime passes.
- Generated API and `95_UserEvents` preservation tests reached 33/33 after IconButton.
- Live and standalone hook generation and developer-body preservation tests passed for the new interactive components.
- TypeScript validation, `export-server.js` syntax and `git diff --check` passed.
- Earlier Standard Runtime milestones also validated live `/export`, standalone `/export-idf-project` and ESP-IDF 5.5.4 builds. Generated firmware was not manually patched.
- Existing developer-written hook bodies remain preserved while only missing declarations and stubs are appended.
- The full export-server suite can still report one unrelated fixture failure when `fg_upload_1024x600_neural_core_67dd4ba0.c` and `fg_upload_carbon_fiber_be774fd2.c` are already absent. The full suite is not claimed as passing in that state, and the export safety boundary remains intact.
- Switch focused exporter suite: 7 tests passed.
- Radio focused suites: 13 tests passed.
- Progress focused suites: 9 tests passed.
- Circular Progress focused suites: 5 tests passed.
- Number Input focused suites reached 19 tests during stepper implementation.
- Number Input exporter outer-container suite: 12 tests passed.
- Number Input shared preview suite: 8 tests passed.
- Select focused suites: 19 tests passed.
- ESP-IDF initially failed because an unused generated NumberInput step constant was emitted before hardware stepper controls existed. The first narrow repair removed it. After native steppers were implemented, the constant became a real hardware runtime dependency and final generated C built with it actively consumed.
- Stale Next.js browser bundles produced old exporter output more than once. The proven exporter workflow is:

  1. update exporter
  2. restart or refresh Studio
  3. regenerate
  4. inspect `90_Studio_Export.c`
  5. build
  6. flash
  7. physically compare
- Physical proof now includes the named eleven-component group and the 2026-07-30 Standard input and selection parity group. No proof beyond those explicitly recorded observations is inferred.

## Built-in System Interface

### Architecture

The System Interface is a reusable built-in platform layer. It is intentionally separate from:

- Interactive Assets
- user project screens
- generated user callbacks

It is generated alongside the user's application without becoming part of the project component tree or the Interactive Asset registry. System-owned controls use internal navigation and hardware callbacks rather than generating `FG_On_*` user hooks.

Studio and Browser Preview share a typed System page and session-state model through:

```text
ForgeUISystemPage
├── launcher
├── brightness
├── wifi
├── bluetooth
├── sound
├── storage
├── device
└── diagnostics
```

Launcher, Brightness, Diagnostics, Wi-Fi Manager and Storage Browser are implemented. Launcher cards are generated only for enabled project features; Bluetooth, Sound and Device are not emitted as always-visible disabled placeholders. Wi-Fi and Storage backends remain independent of their lazy UI lifecycles.

The shared provider owns the active System page, open and back navigation, current-session brightness and the Browser Preview Wi-Fi workflow state. The shared surface renders the same built-in interface over the Studio Canvas and Browser Preview while keeping normal project components separate.

### LVGL runtime

Generated LVGL creates:

- one persistent application container
- one System launcher container
- one Brightness container
- one Wi-Fi Manager container
- one persistent Storage container, created lazily and reused
- one reusable top-layer native LVGL keyboard, created lazily when a System dialog requires text entry

The current hardware-safe navigation implementation uses immediate container visibility switching. It does not recreate screens, project widgets or Interactive Assets. Existing Interactive Assets remain instantiated and retain their state while the System Interface is open, then continue working after return to the application.

The generated gear launcher and System controls use internal LVGL event callbacks. The Brightness slider listens for live value changes, clamps the value to `10–100`, updates its percentage label and calls the Waveshare BSP through the generated internal `FG_Set_Display_Brightness()` wrapper and `bsp_display_brightness_set()`. Brightness is session-only and is not persisted.

The generated Wi-Fi Manager owns its System page, scan list, selection state, password and forget dialogs, connected details and internal Wi-Fi callbacks. The Hosted backend remains the source of live network and connection data and supplies live AP results through the complete Hosted scan pipeline into the generated LVGL interface. The generated native `lv_keyboard` is created lazily on the LVGL top layer, retained as one reusable instance, attached through `lv_keyboard_set_textarea()`, and detached and hidden after Done or Cancel. It supports password entry, show/hide password, correct physical geometry, ForgeUI styling and Browser Preview parity without introducing generated user hooks. This reusable architecture is intended for future Device settings, MQTT, Ethernet, Bluetooth, API keys, Device naming, Login and other System dialogs; those future uses are not claimed as implemented or physically proven.

The generated Storage Runtime owns one lazily created persistent Storage container, page reuse, an eight-row reusable pool, paging, Storage navigation, status projection, Refresh, Read / Write Test, Select Item mode and the Delete Empty Folder workflow. The Storage backend remains in `40_SD.c/.h`; generated LVGL owns presentation and user intent only.

## Storage Runtime

The physically proven Storage Runtime uses:

- SDMMC Slot 0
- lazy page construction
- deferred worker
- bounded request model
- bounded eight-row pool
- page reuse
- Refresh
- Read / Write Test
- directory browsing
- folder navigation
- Select Item mode
- Delete Empty Folder
- no recursive deletion
- no full format
- no multi-select
- no rename
- no mount / unmount

File deletion, recursive deletion, full format, multi-select, rename, New Folder and mount / unmount remain future work and are not claimed as implemented or physically proven.

## Hosted Wi-Fi Recovery

The original ForgeUI-P4 Hosted Wi-Fi architecture has been recovered and physically proven:

```text
ESP32-P4
    │
Hosted SDIO
    │
SDMMC Slot 1
GPIO18/19
GPIO14-17
Reset GPIO54
    │
ESP32-C6
    │
Wi-Fi Remote
    │
ESP-IDF Wi-Fi API
```

The previous SPI Hosted configuration was incorrect for this hardware and prevented the Hosted transport from establishing. Restoring the SDIO Host Interface on SDMMC Slot 1 restored the intended transport.

The recovered Hosted backend now drives the complete built-in Wi-Fi Manager UI, including hosted scanning, AP retrieval, live network list population, selection, connection workflow, live RSSI, security, gateway, saved-network state and connected details. This extends the proven use of the existing Hosted service without changing its transport architecture, SDIO ownership or startup baseline.

## SD Coexistence

The physically proven coexistence architecture is:

```text
Hosted Wi-Fi
→ SDMMC Slot 1

SD Card
→ SDMMC Slot 0
```

The SD Card continues to use the BSP SD pins on GPIO39–44, 4-bit SDMMC, manual LDO control and the FAT filesystem. No SD runtime changes were required.

## Proven Boot Order

The physically proven startup sequence is:

```text
NVS
Display
UI
RTC
fg_wifi_init()
2500 ms delay
fg_sd_init()
fg_sd_test()
```

This ordering remains the stable baseline.

## Hosted Configuration Baseline

The recovered Hosted baseline is:

- SDIO Host Interface
- SDMMC Slot 1
- 4-bit
- 40000 kHz
- GPIO18
- GPIO19
- GPIO14
- GPIO15
- GPIO16
- GPIO17
- Reset GPIO54
- active-high reset
- 1500 ms reset delay
- reset every boot
- restart transport on failure

The associated platform baseline is:

- PSRAM XIP disabled
- ESP-IDF 5.5.4
- esp_hosted 1.4.7
- esp_wifi_remote 0.14.5
- Waveshare BSP 1.0.2

## Project Health Phase 1 — Clean Baseline

Phase 1 removed accumulated development noise and established a measurable clean project baseline without changing the proven product architecture.

Completed work:

- Removed obsolete debug logging and workshop artifacts.
- Consolidated the duplicate icon registry into one ownership path.
- Corrected optional preview-icon defaults and local component property contracts.
- Added the missing ForgeUI Canvas default-property types.
- Cleared the remaining TypeScript diagnostics.
- Established a clean ESLint baseline with no warnings or errors.
- Preserved the known legacy icon export expectation as an explicitly skipped test pending separate architectural review.

Phase 1 did not redesign the Interactive Asset Framework, exporter, Canvas model, or firmware runtime. It made the existing system cleanly checkable and left the one deliberately deferred legacy behavior visible rather than hiding it.

## Project Health Phase 2 — Safe Export Boundary

Phase 2 added a fail-closed validation boundary around all three Studio export paths:

- Build & Flash live firmware export
- Standalone ESP-IDF project export
- Clean Firmware regeneration

Validation now runs before filesystem writes. A failed preflight reports grouped diagnostics and prevents partial generated-firmware mutation.

The client-side preflight validates:

- all five Interactive Asset dimensions and state artwork
- uploaded-asset existence and LVGL conversion readiness
- generated C source paths and LVGL symbols
- Canvas dimensions, duplicate component IDs, missing runtime references, and wrong asset kinds
- Button, Toggle Switch and Three-Position callback names; Binary Output setters; image symbols; and image declarations
- valid OFF / ON and LEFT / CENTER / RIGHT state references
- generated callbacks, enums, runtime structures, public setter declarations, and referenced asset-source coverage

The server independently validates the generated payload and does not trust the browser boundary. It rejects empty code, unsafe or duplicate source paths, missing generated C files, invalid or duplicate symbols, symbols absent from their source files, and asset sources not referenced by the generated code.

Deletion is also reference-aware. Uploaded assets used by any of the five Interactive Asset types or the active Theme, and Interactive Assets assigned to Canvas components, are reported and protected before registry, persistence, Canvas, theme, blob-URL, or disk mutation occurs.

The physical Build & Flash check correctly exposed active built-in theme sources that validation found missing from firmware. The exact Neural Core and Carbon Fiber generated C sources were restored, their symbols were verified, and the server regression suite now validates those real firmware assets. Validation remains strict; the missing inputs were fixed instead of bypassing the safety boundary.

## Interactive Assets UI

The Interactive Assets panel exposes one creation entry point:

```text
+ New Interactive Asset
```

The panel owns the single Asset Type selection:

- Button
- Light
- Status Indicator
- Toggle Switch
- Three-Position Toggle

The parent-owned `selectedAssetKind` controls the active designer, visible type-specific form, AI generation mode, and new-draft initialization. Changing Asset Type switches the displayed designer and its fields. Asset Type switching is disabled while AI generation is in progress so asynchronous results cannot be directed into the wrong designer.

Clicking `+ New Interactive Asset` initializes the selected type's draft without creating a registry object. Registration occurs only on Save. Editing an existing asset automatically selects `asset.kind`, opens the correct designer, and loads the correct draft.

There are no parallel creation flows. Type-specific designers and models remain distinct internally; their save logic is coordinated through the shared panel and common registry rather than merged into a second framework.

## Direct Creator Workflow

Interactive Button, Interactive Toggle Switch, Interactive Three-Position Toggle Switch, Interactive Light and Interactive Status Indicator all share a direct Creator workflow in addition to the Interactive Assets panel.

- Canvas right-click exposes the type-specific `Open Creator` action.
- Configured components reopen the exact asset referenced by `interactiveAssetId`.
- Unconfigured components open a fresh unsaved draft.
- Opening a Creator never automatically creates, registers, saves or assigns an asset.
- A private ForgeUI navigation dispatcher carries type-scoped requests into the shared AI Studio portal.
- Button, Toggle, Light, Status Indicator and Three-Position edit requests remain separate so one Creator cannot consume another type's request. Wrong-kind asset IDs are rejected.
- The portal replaces the current Creator view rather than stacking duplicate creation surfaces.
- Outside-click and Escape dismiss the Canvas context menu.
- Inspector onboarding cards provide the same direct route when required state visuals are missing.
- Navigation requests are cleared after consumption so stale requests cannot reopen another workflow.
- `ForgeAIPanel` recognizes every direct Creator target and opens the Interactive tab rather than leaving the shared portal in Layout.

Current navigation targets include:

```text
interactive-button-designer
interactive-toggle-switch-designer
interactive-light-designer
interactive-status-indicator-designer
interactive-three-position-toggle-designer
```

For Interactive Status Indicator specifically, Canvas right-click exposes `Open Status Indicator Creator`. Configured components reopen the exact Status Indicator referenced by `interactiveAssetId`; unconfigured components open a fresh unsaved Status Indicator draft. Opening that draft does not create, register, save or assign an asset.

## Shared Interactive Asset Framework

The shared framework owns:

- Interactive Asset identity and ID generation
- Discriminated asset kinds
- Base validation and type-specific validation dispatch
- The in-memory Interactive Asset registry
- Local persistence and reload
- Uploaded state-image references
- The shared AI image-generation pipeline
- Canvas asset and dimension resolution
- Canvas assignment through `interactiveAssetId`
- Shared selection-border resizing with eight edge and corner zones
- Shared continuous Canvas boundary clamping and live Inspector geometry updates
- Shared intrinsic-dimension and alpha-bound measurement
- Stable union resolution for the four two-state sets: Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON and Status Indicator OFF/ON
- The compatible three-state LEFT/CENTER/RIGHT union path for Three-Position Toggle
- Shared linked crop generation with preserved original uploads
- Same-size fitted state crops, inactive-state preload and duplicate-write suppression
- Same-ID artwork replacement invalidation so stale measurement readiness is cleared
- Shared legacy image-dimension recovery
- Shared Browser Preview wrappers that preserve final component geometry
- Shared contain-fit LVGL scaling through registry, PNG IHDR and LVGL descriptor dimensions
- Registry-driven configured and unconfigured preview refresh
- LVGL export integration

Shared asset concepts include `schemaVersion`, `id`, `name`, `kind`, `interactionMode`, `createdAt`, `updatedAt`, `width`, `height`, and uploaded asset references for visual states.

The current discriminated kinds are:

```text
kind: button
interactionMode: momentary

kind: light
interactionMode: state

kind: statusIndicator
interactionMode: state

kind: toggleSwitch
interactionMode: state

kind: threePositionToggle
interactionMode: state
```

`ForgeUIInteractiveAsset` is the discriminated union of all five supported models. The common registry and existing v1 persistence layer store every kind. Kind-aware lookup and validation prevent an asset from being resolved as the wrong type.

Canvas components store an `interactiveAssetId`. Fresh placeholders may adopt newly created asset dimensions during assignment; existing configured components preserve their geometry. After placement, component geometry is authoritative for Canvas, Browser Preview and LVGL export. On reload, the Interactive Asset registry and uploaded-asset registry restore the records required for Canvas and export resolution.

Visible-artwork fitting is a reusable N-state union operation over the states supplied by an implemented asset type. It does not imply that arbitrary future controls are implemented. Measurement updates are deduplicated, uploaded-asset registry changes rerender previews and Inspector helpers without reselection, and generated LVGL images use centred contain-fit scaling against final component geometry.

## Interactive Button

Interactive Button uses `kind: button` and `interactionMode: momentary`. Its uploaded state-image references are:

- `normalAssetId`
- `pressedAssetId`

### Studio behavior

- AI generates Normal and Pressed images.
- Generated results map to `normalAssetId` and `pressedAssetId`.
- New drafts use consistent `200 × 100` creation dimensions and the lowest available normalized Label sequence: `Button 1`, `Button 2`, `Button 3`, and onward.
- Duplicate public callback validation is grouped by generated callback, retains component IDs as secondary diagnostics, and identifies every conflicting Button.
- The Inspector displays the live generated callback and an inline duplicate warning while the controlling Label conflicts.
- Canvas preview displays Pressed while held and returns to Normal on release.
- The asset can be assigned to an `InteractiveButton` Canvas component.
- Assignment writes `interactiveAssetId`; component geometry remains authoritative after placement and is preserved during asset replacement.
- Assignment persists across Studio restart.
- Selected Buttons use the shared selection border with eight edge and corner resize zones, continuous Canvas clamping and live Inspector geometry updates.
- Interactive Asset registry updates replace configured and unconfigured previews immediately; assignment unmounts the placeholder instead of layering previews.
- `Fit Bounds to Visible Artwork` measures transparent padding, creates one stable Normal/Pressed union crop, links new cropped assets and preserves the original uploads.
- Visible-bounds fitting is idempotent.
- Legacy artwork dimensions recover through registry metadata, PNG IHDR and generated LVGL descriptors.

### LVGL runtime behavior

The exporter creates a parent LVGL button object and a child LVGL image object:

- `LV_EVENT_PRESSED` changes to the Pressed image.
- `LV_EVENT_RELEASED` and `LV_EVENT_PRESS_LOST` restore the Normal image.
- `LV_EVENT_CLICKED` calls the generated developer hook.
- The child image uses a shared Normal/Pressed contain-fit scale derived from final component geometry and remains centred.

Generated hook example:

```c
FG_On_Button_Clicked();
```

Runtime flow:

```text
Touch
  ↓
LVGL Button
  ↓
Generated event callback
  ↓
FG_On_Button_Clicked()
  ↓
95_UserEvents.c
  ↓
Developer application logic
```

## Interactive Toggle Switch

Interactive Toggle Switch uses `kind: toggleSwitch`, `interactionMode: state`, and a saved `initialState: off | on`. Its uploaded state-image references are:

- `offAssetId`
- `onAssetId`

### Studio behavior

- The designer provides OFF and ON artwork selection.
- Direct Creator access is available from Canvas and Inspector onboarding.
- Configured components reopen the exact linked Toggle asset; unconfigured components start a fresh draft.
- The direct designer can generate a paired OFF/ON set through the shared image pipeline.
- The Toggle State Sheet Builder can instead create one combined OFF/ON source, crop two linked regions and return both visuals to the Toggle draft.
- Creator and State Sheet results update the draft only; Save and `Use on Selected` remain explicit.
- The asset, artwork references and initial state persist through the existing Interactive Asset store.
- Live preview and Canvas preview retain the selected binary state until toggled again.
- Browser Preview uses the same OFF / ON artwork and interaction model.
- The asset can be assigned to an `InteractiveToggleSwitch` Canvas component.
- Use on Selected writes `interactiveAssetId` and propagates width and height.
- The Inspector keeps a compact configured helper above Position Mode, reopens the exact linked Toggle asset, and provides explicit visible-artwork fitting and recovery guidance.
- OFF and ON intrinsic dimensions and alpha bounds are recorded through the uploaded-asset registry; registry changes refresh the helper without reselection.
- `Fit Bounds to Visible Artwork` creates one stable OFF/ON union crop, preserves the originals, links same-size fitted assets and is idempotent.
- Selected configured and unconfigured Toggles use the shared cyan selection border with four edge and four corner resize zones, continuous Canvas clamping and live Inspector geometry.
- Component geometry remains authoritative; Canvas preview artwork scales continuously with centred contain-fit behavior and generated LVGL uses the same final component bounds.

### Toggle Input Runtime

Multiple Interactive Toggle Switch instances share one generated Toggle Input Runtime:

- `fg_toggle_input_t`
- `fg_toggle_input_set()`

Each Canvas instance owns independent runtime data, artwork references, saved state and a unique developer callback. Initialization applies the configured state with notification disabled. An LVGL click inverts the current state, the shared setter stores it, selects the correct artwork, updates the child image and calls the generated hook.

Generated callback example:

```c
void FG_On_StatusToggleSwitch_Toggled(bool enabled);
```

Runtime flow:

```text
Touch
  ↓
LVGL Toggle parent button
  ↓
Shared Toggle Input Runtime
  ↓
fg_toggle_input_set(enabled, true)
  ↓
OFF / ON artwork update
  ↓
FG_On_<Name>_Toggled(bool enabled)
  ↓
95_UserEvents.c
```

## Interactive Three-Position Toggle Switch

Interactive Three-Position Toggle Switch uses `kind: threePositionToggle`, `interactionMode: state`, and the strongly typed saved state `left | center | right`. Its uploaded artwork references are:

- `leftAssetId`
- `centerAssetId`
- `rightAssetId`

### Studio behavior

- The designer retains manual LEFT, CENTER and RIGHT artwork selectors and the selectable initial state.
- `Create Three-Position Toggle Set` replaces the generic Generate action for this asset type.
- One `three-position-set` request produces a master State Sheet with exactly three horizontal state rows.
- LEFT, CENTER and RIGHT crops become three separate uploaded asset IDs.
- The generated set updates the draft only; it does not automatically save, register the Interactive Asset or assign it to Canvas.
- Direct Creator access is available from Canvas and Inspector onboarding.
- Configured components reopen the exact linked asset; unconfigured components open a fresh draft.
- The responsive unconfigured placeholder scales with the component and switches to compact icon-only presentation at small sizes.
- Initial state is selectable as LEFT, CENTER or RIGHT.
- Live preview responds across the entire rectangular width.
- A designer-only `LEFT | CENTER | RIGHT` overlay makes the three touch zones visible without modifying exported artwork.
- Canvas and Browser Preview divide the configured bounds into direct left, center and right thirds.
- Use on Selected writes `interactiveAssetId` and propagates width and height.
- Artwork references and initial state persist through the existing Interactive Asset store.
- The Inspector keeps a compact configured helper above Position Mode, reopens the exact linked Three-Position asset, and provides explicit visible-artwork fitting and recovery guidance.
- LEFT, CENTER and RIGHT intrinsic dimensions and alpha bounds are recorded through the uploaded-asset registry; registry updates rerender the helper without reselection.
- Visible-artwork fitting builds one compatible three-state union crop, preserves all originals, links same-size fitted state assets and is idempotent.
- Selected configured and unconfigured components use the shared cyan selection border with four edge and four corner resize zones, continuous Canvas clamping and live Inspector geometry.
- Component geometry is authoritative; Canvas preview and generated LVGL keep LEFT/CENTER/RIGHT artwork centred and continuously contain-fit inside the final bounds.

Live generation flow:

```text
Prompt
  -> Create Three-Position Toggle Set
  -> one master State Sheet
  -> crop workspace
  -> LEFT / CENTER / RIGHT linked crop regions
  -> optional row remapping
  -> Confirm Crops
  -> preprocessing and LVGL conversion
  -> atomic uploaded-asset registration
  -> update draft
  -> Save
  -> assign to Canvas
```

### Three-Position Input Runtime

Multiple instances share one generated Three-Position Input Runtime while retaining independent state, artwork and callbacks.

Generated enum:

```c
typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;
```

Generated runtime and helper:

```c
fg_three_way_input_t
fg_three_way_input_set()
```

Generated callback example:

```c
void FG_On_ThreePositionToggle_Changed(
    fg_three_way_state_t state
);
```

The LVGL event callback converts the absolute pointer coordinate into local control space, rejects points outside the configured rectangle and maps `local_x` to the left, center or right third. The parent button owns the full clickable rectangle; its child image is non-clickable. The shared setter validates and stores the requested enum, selects the matching artwork, updates the LVGL image and optionally notifies the per-instance developer callback. Initialization uses `notify=false`.

Runtime flow:

```text
Touch within full rectangular bounds
  ↓
Absolute pointer X converted to local_x
  ↓
LEFT / CENTER / RIGHT third selected
  ↓
fg_three_way_input_set(state, true)
  ↓
Matching artwork update
  ↓
FG_On_<Name>_Changed(fg_three_way_state_t state)
  ↓
95_UserEvents.c
```

## Interactive Light

Interactive Light uses `kind: light`, `interactionMode: state`, and a saved `initialState: off | on`. Its uploaded state-image references are:

- `offAssetId`
- `onAssetId`

### Studio behavior

- Canvas right-click and Inspector onboarding open the direct Light Creator through `interactive-light-designer`.
- Configured components reopen the exact linked Light asset; unconfigured components receive a fresh unsaved draft.
- The configured Inspector helper remains visible after assignment and `Open Light Creator` reopens the exact linked asset.
- The responsive empty state uses a lamp/indicator SVG with compact icon-only presentation at small dimensions.
- Larger empty states show OFF and ON hints.
- The unselected placeholder is near-white, the selected component is cyan, and the active indicator uses muted green.
- Inspector onboarding guidance appears when the Interactive Asset or either uploaded visual is missing; configured Lights retain a compact helper above geometry fields.
- Save and assignment remain explicit; opening the Creator does not mutate the registry or Canvas.
- Fresh placeholders adopt newly created asset dimensions; existing configured Lights preserve their geometry.
- Selected Lights use the shared selection border, continuous Canvas clamping and live Inspector geometry updates.
- Component geometry is authoritative after placement, and configured or unconfigured preview state refreshes with same-ID registry updates.
- `Fit Bounds to Visible Artwork` measures OFF/ON alpha bounds, creates one stable union crop, links both cropped assets and preserves the original uploads.
- Visible-bounds fitting is idempotent and keeps OFF/ON state changes inside stable component bounds.

## Binary Output Runtime

Interactive Light and Interactive Status Indicator now share one generated Binary Output Runtime.

The generated runtime owns:

- `fg_binary_output_t`
- `fg_binary_output_set()`

Both Interactive Asset types generate independent runtime records while reusing the same implementation.

Interactive Light and Interactive Status Indicator use the exact same exported geometry path: a transparent component-sized LVGL container and a centred child image in the shared runtime record. OFF and ON use one contain-fit scale derived from final component geometry, supporting both upscaling and downscaling while preserving aspect ratio. Dimension resolution follows uploaded-asset registry metadata, PNG IHDR data and generated `lv_image_dsc_t` descriptors, with scale 256 used only when no reliable dimensions remain. The previous legacy Status Indicator direct-image export path has been removed. This design-time geometry and fitting parity does not change the Binary Output direction: both controls remain non-clickable and application-controlled through `FG_Set_*`.

Developer-facing APIs follow the same pattern:

```c
FG_Set_Status_Light(bool enabled);

FG_Set_WiFi_Status(bool enabled);
```

Runtime flow:

```text
Developer application
        ↓
FG_Set_<Name>(bool enabled)
        ↓
Shared Binary Output Runtime
        ↓
Generated LVGL runtime
        ↓
OFF / ON artwork
        ↓
Physical ESP32-P4 display
```

This establishes the Binary Output Runtime as a reusable runtime family rather than an implementation owned by Interactive Light.
---

## Interactive Status Indicator

Interactive Status Indicator extends the Binary Output Runtime without introducing a second runtime implementation.

It supports:

- OFF artwork
- ON artwork
- saved initial state
- Browser Preview
- Canvas Preview
- AI state-image generation
- native LVGL export
- generated public setter
- multiple independent instances

The Interactive Status Indicator remains setter-only and does not generate user hooks; this is separate from the standard `Led` component and its changed hook.

Application code controls state entirely through the generated public API.

### Studio behavior

- AI generates OFF and ON images.
- Generated results map to `offAssetId` and `onAssetId`.
- Direct Canvas right-click exposes `Open Status Indicator Creator`.
- Configured components reopen their exact linked Status Indicator asset; unconfigured components open a fresh unsaved draft.
- Inspector onboarding provides the same Creator route when no Status Indicator asset is assigned; incomplete or missing references retain repair and recovery guidance.
- Configured components retain a compact Inspector helper above Position Mode with the linked asset name, initial state, OFF/ON summary, exact Creator reopening and `Fit Bounds to Visible Artwork`.
- An unconfigured component uses a responsive binary-output SVG placeholder: compact controls use icon-only mode, while larger controls show OFF / ON hints.
- Placeholder styling follows the Interactive Asset family with near-white unselected artwork, cyan selected artwork and a muted-green active indicator.
- New Status Indicators drop at `120 × 72`, replacing the previous shared `32 × 32` drop default so the component is immediately visible and selectable before artwork is assigned.
- OFF and ON intrinsic dimensions and alpha bounds are recorded automatically through the uploaded-asset registry; registry updates rerender the helper without reselection and same-ID replacement clears stale readiness.
- `Fit Bounds to Visible Artwork` builds one stable OFF/ON union crop, preserves original uploads, creates linked same-size fitted assets and reports an already-fitted idempotent state.
- Selected configured and unconfigured Status Indicators use the shared cyan selection border with four edge and four corner hit zones, continuous Canvas clamping and live Inspector geometry.
- Browser Preview and Canvas Preview use the same centered contain-fit renderer, with final component width and height controlling continuous artwork scaling rather than imposing intrinsic dimensions as a maximum.
- Intrinsic artwork aspect ratio is preserved: square artwork remains square and non-square artwork is not stretched to fill width and height independently.
- Browser Preview wrappers use the saved component bounds, making Browser Preview geometry equivalent to Canvas geometry.
- Canvas click toggles a temporary preview state.
- Preview toggling is local visual verification only; it does not mutate the saved initial state, persistence or exported firmware.
- The asset can be assigned to an `InteractiveStatusIndicator` Canvas component.
- Assignment writes `interactiveAssetId` and propagates width and height.
- Assignment persists across Studio restart.
- Resizing preserves selection and component identity and does not toggle the temporary Canvas OFF/ON state; ordinary Canvas clicks continue to toggle only the local design-time preview.

### LVGL runtime behavior

Interactive Status Indicator exports through the same Binary Output geometry path as Interactive Light. A transparent container owns the final component position and size, while a centred child image uses one OFF/ON contain-fit scale that supports both upscaling and downscaling without stretching. Component geometry remains authoritative across Canvas Preview, Browser Preview and generated LVGL output. Its initial source uses the saved `initialState`.

- It has no Button-style event callback.
- It generates no Status Indicator hook in `95_UserEvents`.
- Runtime state is controlled through a generated public setter.

Generated API example:

```c
void FG_Set_Status_Light(bool enabled);
```

Setter behavior:

```text
false → OFF image
true  → ON image
```

Runtime flow:

```text
Developer application logic
  ↓
FG_Set_Status_Light(enabled)
  ↓
Generated 90_Studio_Export.c
  ↓
LVGL image source changes
  ↓
Physical indicator state changes
```

## ForgeUI Widget Registry

The Widget Registry is the authoritative source for every ForgeUI widget. Each `WidgetDefinition` owns:

- serialized type
- display name
- category
- description
- search keywords
- default dimensions
- default properties
- insertion factory
- runtime capability
- user-event capability
- children capability
- interactive capability
- documentation ID
- availability

The Widget Tray is completely registry-driven. Future widgets are added by registering one new `WidgetDefinition` rather than modifying Sidebar implementations. Compatibility projections may expose registry data to existing consumers, but they do not become a second widget catalogue.

### Registry-wide implementation and proof audit — 2026-07-31

The authoritative registry contains 49 entries: 44 Standard widgets and five
Interactive Assets. Every entry is available in the registry-driven Tray, has
persisted defaults/insertion, a Canvas dispatch, Inspector dispatch, Browser
Preview dispatch and an LVGL export path. Focused registry/Tray tests and
component/exporter regressions provide automated evidence; no conclusive
permanent implementation was found outside the registry, so no registry
definition was added. The Dashboard category remains intentionally empty.
All 39 Standard widgets are now physically proven (100%); none remain
to be individually promoted.

```text
SPINBOX
STATUS: PROVEN
Registry → Tray → Canvas → Inspector → Browser Preview → LVGL Export
→ Runtime SDK → UserEvents → ESP32-P4 → Standalone Export
```

| Registry widget | Studio / exporter | Runtime API and hook classification | Hardware proof |
| --- | --- | --- | --- |
| Text | implemented / implemented | intentionally API-free | **PROVEN** |
| Heading | implemented / implemented | intentionally API-free | **PROVEN** |
| Button | implemented / implemented | API-free serialized text | **PROVEN** |
| IconButton | implemented / implemented | enabled setter + click hook | pending |
| Icon | implemented / implemented | generic 96 presentation API; optional 95 click | **PROVEN** |
| Box | implemented / implemented | visibility setter, no hook | **PROVEN** |
| Line | implemented / implemented | intentionally API-free | **PROVEN** |
| Divider | implemented / implemented | intentionally API-free | **PROVEN** |
| Canvas | implemented / implemented | intentionally API-free drawable surface | pending |
| Image | implemented / implemented | source setter, no hook | **PROVEN** |
| Input | implemented / implemented | text setter + change hook | physically proven |
| Textarea | implemented / implemented | text setter + change hook | physically proven |
| NumberInput | implemented / implemented | value setter + change hook | physically proven |
| Checkbox | implemented / implemented | checked setter + change hook | physically proven |
| Switch | implemented / implemented | checked setter + change hook | physically proven |
| Slider | implemented / implemented | value setter + genuine-user change hook | **PROVEN** |
| Spinner | implemented / implemented | presentation-only; no setter or hook | **PROVEN** |
| Spinbox | implemented / implemented | silent value setter + genuine-user change hook | **PROVEN** |
| List | implemented / implemented | genuine-user item click hook; no setter | **PROVEN** |
| Roller | implemented / implemented | selected setter + change hook | physically proven |
| Radio | implemented / implemented | selected setter + change hook; no group model | physically proven |
| Select | implemented / implemented | index setter + change hook | physically proven |
| Led | implemented / implemented | boolean setter + change hook | physically proven |
| Bar | implemented / implemented | value setter + change hook | physically proven |
| Arc | implemented / implemented | value setter + change hook | physically proven |
| Scale | implemented / implemented | intentionally API-free | physically proven |
| Chart | implemented / implemented | add/clear APIs + hooks | physically proven |
| Table | implemented / implemented | existing retained table runtime | physically proven |
| Clock | implemented / implemented | API-free RTC presentation | **PROVEN** |
| WiFi | implemented / implemented | collision-safe backend projection; no public widget API/hook | **PROVEN** |
| QRCode | implemented / implemented | text setter, no hook | **PROVEN; ESP32-P4 display and mobile scan passed** |
| Progress | implemented / implemented | value setter, no hook | physically proven |
| CircularProgress | implemented / implemented | value setter, no hook | physically proven |
| Tabview | implemented / implemented | selected-index setter + change hook | **PROVEN** |
| Tileview | implemented / implemented | silent coordinate setter + genuine-user change hook | **PROVEN** |
| ButtonMatrix | implemented / implemented | selection setter + hook | physically proven |
| Msgbox | implemented / implemented | show/close APIs + dialog hooks | physically proven |
| Keyboard | implemented / implemented | show/hide APIs + hooks | physically proven |
| Calendar | implemented / implemented | date setter + change hook | physically proven |
| InteractiveButton | implemented / implemented | input hook | physically proven |
| InteractiveLight | implemented / implemented | output setter | physically proven |
| InteractiveStatusIndicator | implemented / implemented | output setter | physically proven |
| InteractiveToggleSwitch | implemented / implemented | setter + input hook | physically proven |
| InteractiveThreePositionToggleSwitch | implemented / implemented | three-state input hook | physically proven |

Each row has automated registry/Tray coverage plus focused preview/export or interactive regression evidence at the current repository scope. No registry widget is missing from the Tray, Inspector, Canvas, Browser Preview or exporter dispatch. The registry's `supportsRuntimeApi` field is capability metadata: Slider exposes its generated numeric runtime, while presentation-only Spinner intentionally does not.

## ForgeUI Widget Tray

The Widget Tray renders these deterministic registry categories:

- Basic
- Input
- Display
- Navigation
- Feedback
- Dashboard
- Assets

Dashboard is intentionally retained with a zero count and compact empty state while dedicated ForgeUI Dashboard widgets await completion of LVGL widget coverage.

The Tray supports plain-text search, registered keyword search and LVGL terminology search. It supports click insertion, drag insertion and keyboard insertion through the same registered insertion metadata and normal component action path. Uploaded and Interactive Assets participate in the same Tray surface while retaining their existing registries, editors and runtime ownership.

The Tray heading and search remain sticky while categories scroll. Widget and asset rows use compact single-line names, accessible full-name titles, stable Edit alignment, visible keyboard focus, dark-theme scrollbars and narrow-sidebar-safe width constraints. Loading and ordering are deterministic and hydration-safe. The Tray does not duplicate widget definitions, insertion dimensions or capability knowledge.

## Official LVGL Reference

The permanent authoritative implementation reference for future LVGL widgets is:

```text
C:\ForgeUI\Projects\References\LVGL-9.2.2
```

Future widget work must inspect this exact version's headers, implementation, examples, configuration flags, dependencies, supported properties, runtime updates and limitations. APIs from newer LVGL versions must not be assumed.

## Proven Widget Pipeline

Every future Standard widget must follow this mandatory lifecycle:

```text
Official LVGL Reference
        ↓
Widget Registry
        ↓
Widget Tray
        ↓
Canvas
        ↓
Inspector
        ↓
Browser Preview
        ↓
LVGL Export
        ↓
Runtime API (when appropriate)
        ↓
95_UserEvents (interactive widgets only)
        ↓
ESP32-P4 Hardware
        ↓
Documentation
        ↓
PROVEN
```

Automated coverage or generated-code inspection does not substitute for build, flash and physical interaction or visual validation. Output-only widgets such as QR Code deliberately skip `95_UserEvents`; they still require physical hardware proof before promotion to PROVEN.

List has completed the applicable lifecycle without inventing a Runtime SDK
setter:

```text
Official LVGL Reference → Widget Registry → Widget Tray → Canvas
→ Inspector → Browser Preview → Native LVGL Export → 95_UserEvents
→ Live Studio firmware → Standalone Export → ESP32-P4 physical proof
→ Documentation → PROVEN
```

Its hook is `FG_On_<Name>_Item_Clicked(uint32_t index, const char * text)`;
`<Name>` is derived from the Studio component name and made collision-safe by
the generator. **LIST — PROVEN ON ESP32-P4.**

## Layout Template Library

ForgeUI contains one implemented reusable professional Layout Template:

- Dashboard

It uses the shared rendering engine, semantic-region model, vector preview,
scaling, persistence, undo/redo, Browser Preview and normal LVGL export paths.
Industrial HMI, Control Panel, Monitoring, SCADA Overview and Mobile / Portrait
remain roadmap candidates.

### LayoutDefinition

Every template is one registered `LayoutDefinition` containing:

- identity
- name
- description
- vector preview geometry
- semantic regions
- placement rules
- arrangement rules
- AI guidance

The designer renders the selected definition rather than branching into six independent implementations. Future templates are added by registering another `LayoutDefinition`.

### Template-aware AI Fill

```text
User Prompt
    ↓
AI chooses widgets
    ↓
LayoutDefinition
    ↓
Semantic Regions
    ↓
Auto Arrange
    ↓
Canvas
    ↓
Browser Preview
    ↓
LVGL Export
```

AI chooses suitable canonical widgets and content. `LayoutDefinition` owns
structure, semantic regions own placement intent, and Auto Arrange owns
deterministic geometry. Current template guidance covers Dashboard without
returning ownership of pixel coordinates to AI.

## ForgeUI Layout Designer Implementation

### Product direction

ForgeUI no longer relies on AI-generated absolute coordinates as the primary design mechanism for template-based dashboards. AI selects appropriate content and assigns semantic regions; the Layout Designer owns deterministic structure, geometry and validation.

```text
User / AI
    |
    v
Select content and semantic region
    |
    v
ForgeUI Layout Designer
    |
    +-- deterministic structural regions
    +-- editable Boxes and Dividers
    +-- region assignment
    +-- Auto Arrange
    +-- geometry validation
    |
    v
Normal ForgeUI component model
    |
    +-- Canvas
    +-- Browser Preview
    +-- Save / Reload
    +-- LVGL Export
```

Dashboard established the reference vertical slice for the current `1024 × 600` landscape target. The same reusable architecture now serves the complete six-template library. Templates create ordinary root-level ForgeUI components and record optional layout metadata in their existing `props`. Projects without this metadata continue to load unchanged.

The ownership distinction is deliberate: AI decides what the dashboard contains; ForgeUI owns the structural layout and geometry. The result remains composed of normal editable ForgeUI components. No image-only mockup or non-exportable parallel document was introduced.

### Deterministic smart regions

The Dashboard template creates five stable structural regions:

- `dashboard.header`
- `dashboard.status`
- `dashboard.main`
- `dashboard.controls`
- `dashboard.footer`

These regions are normal editable Box components, accompanied by one structural Divider and one editable Heading placeholder. All structural geometry is deterministic for the current `1024 × 600` landscape target. The Boxes use semantic theme roles.

A Region Box stores `layoutRegionKey`; an assigned component stores the corresponding key as `layoutRegionId`. Each smart Box also carries its role, label, padding, horizontal gap, vertical gap, arrangement mode, column count, row count, minimum child dimensions, ordering, structural-lock setting, semantic surface role, semantic border role, radius, border width and opacity. Generated component IDs are not used as the semantic region contract.

Regions remain manually movable and resizable on Canvas. The Inspector exposes smart-region controls when a region Box is selected and an Assigned Region selector for ordinary components. The structural lock is currently persisted as metadata; it does not yet prevent direct Canvas movement or resizing.

Old projects without region metadata load normally, and the project remains compatible with the existing component model. Region relationships are currently flat metadata rather than true serialized parent-child hierarchy. Current assignment is through Inspector; drag-to-assign is not implemented.

### Auto Arrange

Auto Arrange is deterministic and changes only `x`, `y`, `w`, `h` and absolute positioning. Its current modes are Vertical Stack, Horizontal Row, Grid, KPI Cards, Button Stack, Form Rows, Even Distribution and Fit to Region. Region bounds, padding, horizontal and vertical gaps, column and row settings, preferred catalogue sizes, minimum touch sizes, full-width controls and square-control constraints guide placement.

Auto Arrange preserves component props, runtime identity, callback ownership, region metadata, asset references, component type, runtime APIs and hooks. Stable region assignment is retained while components are moved or resized and Auto Arrange can be run again after a region is edited.

The Layout Designer does not replace the normal ForgeUI component model, serialization, theme system, Browser Preview or LVGL exporter. It produces and arranges the same components those paths already consume.

### Template-aware AI Fill implementation

Template-aware AI Fill uses the normal AI generation path. Dashboard retains this representative region-composer contract:

```json
{
  "template": "dashboard",
  "title": "System Health",
  "regions": {
    "header": [],
    "status": [],
    "main": [],
    "controls": [],
    "footer": []
  }
}
```

The AI selects canonical ForgeUI component types, supplies content and supported props, and assigns each component to a semantic region. It does not provide final pixel geometry in Dashboard template mode. Studio validates canonical types, creates the structural template, inserts real components, resolves stable region references, Auto Arranges each region, validates geometry and inserts the editable result through the existing Canvas path.

Legacy free-coordinate AI generation remains available for non-template requests. Dashboard AI Fill does not hard-code the selected application content, bypass the normal generation route or fabricate component identities.

### Manual visual result

The manually observed AI Fill Dashboard result contained a clear Header region, grouped Status panel, large central Chart region, vertically arranged control buttons and Footer status area. It produced a coherent one-screen `1024 × 600` composition, and Browser Preview successfully rendered the region-based result. This was a substantial improvement over unrestricted AI coordinate placement, but it is not claimed as final visual parity and does not prove any additional template.

### Rendering, persistence and export

Smart regions use semantic `surface`, `surfaceSecondary` and border roles through the existing theme resolver. Canvas and Browser Preview render the same saved component geometry and metadata. Existing arbitrary-props serialization preserves region settings and assignments across save/reload. Generated LVGL continues to receive ordinary ForgeUI components; focused exporter coverage confirms smart Box surface styling and export compatibility without introducing a separate runtime API or hook family.

### Current proof boundary

The Dashboard vertical slice has been manually verified in Canvas and Browser Preview, including deterministic region creation, editable Boxes, movement and resizing, stable assignment, Auto Arrange and the observed AI Fill Dashboard workflow. Automated coverage exercises the layout designer, region composer, reducer updates, panel workflow, Browser Preview and focused Box/LVGL export behavior.

This save point does not claim:

- a full Studio production build;
- a live OpenAI network test beyond the manually observed AI Fill workflow;
- an ESP-IDF firmware build;
- a hardware flash or physical ESP32-P4 parity review;
- physical ESP32-P4 parity for every template.

The six reusable definitions and their Studio workflows are complete. Drag-to-assign is not yet implemented, region relationships remain flat metadata rather than serialized hierarchy, and physical export proof remains a separate promotion gate.

## Shared AI Generation Path

All five Interactive Asset types use the same request, response, upload, registration and LVGL conversion pipeline:

```text
Interactive Asset Designer
  ↓
InteractiveAssetAIGenerator
  ↓
ForgeUIAIImagePipeline
  ↓
POST /api/forgeui-ai-hero
  ↓
AI image generation
  ↓
Uploaded Asset Registry
  ↓
LVGL image conversion
  ↓
Asset state IDs returned to designer
```

Button generation modes:

- `button-normal`
- `button-pressed`

Toggle generation modes:

- direct paired generation uses `light-off` and `light-on`
- the Toggle State Sheet Builder uses one combined OFF/ON source artwork

Three-Position generation modes:

- active Creator request: `three-position-set`
- one master generated image
- three LEFT/CENTER/RIGHT crops derived from that master

The older `three-position-left`, `three-position-center` and `three-position-right` requests remain accepted by the lower-level API for compatibility, but the active Three-Position Creator no longer uses three independent generation calls.

Light generation modes:

- `light-off`
- `light-on`

Status Indicator generation modes:

- `light-off`
- `light-on`

The type-specific differences are prompt mode, prompt template, filename prefix, State Sheet handling, and result-to-state mapping. The selected parent asset kind determines the active workflow.

```text
Button paired generation: first → normalAssetId, second → pressedAssetId
Toggle direct paired generation: first → offAssetId, second → onAssetId
Toggle State Sheet Builder: one OFF/ON source → two linked crops → offAssetId / onAssetId
Three Position: one LEFT/CENTER/RIGHT master → three linked crops → leftAssetId / centerAssetId / rightAssetId
Light: first → offAssetId, second → onAssetId
Status Indicator: first → offAssetId, second → onAssetId
```

## State Sheet Generation and Crop Architecture

The standard Toggle State Sheet Builder and Three-Position Creator reuse `StateSheetOverlay` while retaining workflow-specific state counts.

Standard Toggle uses one combined OFF/ON source with two independently positioned crop regions and a shared crop width and height. The resulting OFF and ON assets return to the Toggle draft.

Three-Position uses one master image and three crop rectangles:

- LEFT, CENTER and RIGHT retain independent X/Y positions.
- Crop width and height are shared across all three regions.
- Moving one region moves only that region.
- Resizing any region resizes all three, ensuring identical confirmed output dimensions.
- Gaps between AI-generated rows can be excluded by positioning the rectangles explicitly.
- Every region exposes edge and corner handles.
- Confirmation uses the exact crop coordinates rather than inferred row boundaries.

Synchronized Three-Position resizing follows these rules:

- RIGHT or BOTTOM resizing changes the shared dimensions without shifting region origins.
- LEFT or TOP resizing applies the same position delta to every region.
- Corner resizing combines the corresponding horizontal and vertical rules.
- Each region otherwise retains its independent base position.

Default row assignment is `TOP → LEFT`, `MIDDLE → CENTER`, `BOTTOM → RIGHT`. If AI returns states in another order, row-to-state remapping is available before confirmation. Mappings remain unique: changing one row swaps the displaced state, overlay labels update immediately, and remapping changes state assignment without changing crop geometry.

### Image-pipeline safeguards

State Sheet crops use `canvas.toDataURL('image/png')`, ensuring preprocessing receives real PNG Base64 rather than blob-URL text. Three-Position confirmation validates `data:image/png;base64` input and decodes it locally into `image/png` Blobs instead of calling `fetch()` on a data URL; converter requests continue to carry the Base64 data URL.

Three-Position registration is atomic. All three crops are prepared and converted before the Uploaded Asset Registry is mutated. A conversion failure therefore cannot partially register LEFT/CENTER/RIGHT assets, existing draft IDs remain unchanged, and the draft updates only after all three conversions succeed.

## File Ownership

### Generated and replaceable UI output

- `90_Studio_Export.c`
- `90_Studio_Export.h`

Studio regenerates these files. Generated public UI APIs, including Interactive Light setters, are declared in `90_Studio_Export.h` and implemented in `90_Studio_Export.c`. Permanent developer application logic must not be placed in them.

### User event hook layer

- `95_UserEvents.c`
- `95_UserEvents.h`

Studio creates these files for live Studio firmware and standalone export. In live firmware, the exporter merges the required declarations and stubs: matching developer-written function bodies are preserved, missing hooks are appended, and unrelated existing hooks are not deleted. After a standalone project is exported, its copies become the developer-owned hook and application-logic layer. Developers add GPIO, I/O, hardware actions and product behavior to the standalone project's `95_UserEvents.c` while preserving generated hook names.

Interactive Button click hooks, Interactive Toggle Switch toggled hooks and Interactive Three-Position Toggle changed hooks cross into this layer. Interactive Light and Interactive Status Indicator remain setter-only Binary Output Runtime controls and do not create `95_UserEvents` hooks. Separately, interactive Standard LVGL controls use generated hooks for genuine user interaction. Their programmatic setters are guarded and silent; setter-generated LVGL events do not cross into developer code.

Examples include:

```c
void FG_On_Tab_View_Changed(uint32_t tab_index);
void FG_On_Tileview_Changed(uint32_t column, uint32_t row);
void FG_On_Search_Input_Changed(const char * text);
void FG_On_Notes_Textarea_Changed(const char * text);
void FG_On_Enable_WiFi_Switch_Changed(bool checked);
void FG_On_Enable_Logging_Checkbox_Changed(bool checked);
void FG_On_Automatic_Mode_Radio_Changed(bool selected);
void FG_On_Target_Number_Input_Changed(int32_t value);
void FG_On_Mode_Select_Changed(uint32_t index, const char * text);
void FG_On_Settings_Icon_Button_Clicked(void);
```

Progress, Image, Box and QR Code are setter-only outputs and add no hooks.
Divider, Scale, Line, Clock, Button Text, Text and Heading are presentation/API-free
and add no `95_UserEvents` declarations. Icon uses generated 96 presentation
setters and adds a 95 declaration only when click is enabled. Live
`95_UserEvents.c` bodies remain preserved, missing stubs are appended, and
existing hooks are not deleted merely because their component is absent from the
current Canvas. Standalone copies become developer-owned.

## Major Files

Paths under `src/` are relative to `studio/`.

### Widget Registry and Widget Tray

- `src/forgeui/widgets/ForgeUIWidgetRegistry.ts` — authoritative widget definitions, metadata, categories and search
- `src/forgeui/widgets/ForgeUIWidgetRegistry.test.ts` — catalogue completeness, metadata, search and QR defaults
- `src/forgeui/ForgeUIWidgetSet.ts` — compatibility projection derived from the registry
- `src/components/sidebar/Sidebar.tsx` — registry-driven categories, sticky search and asset integration
- `src/components/sidebar/DragItem.tsx` — accessible compact insertion row
- `src/components/sidebar/Sidebar.test.tsx` — click, drag, keyboard, undo/redo, search, overflow and empty-state coverage
- `src/components/sidebar/Sidebar.hydration.test.tsx` — deterministic server/client hydration coverage
- `src/hooks/useDropComponent.ts` — normal insertion action path; does not own a second widget catalogue

### Layout Designer and AI Region Composer

Layout structure, geometry and focused rendering coverage:

- `src/forgeui/layout/ForgeUILayoutDesigner.ts` — shared `LayoutDefinition` template library, structural regions and arrangement
- `src/forgeui/layout/ForgeUILayoutDesigner.test.ts`
- `src/forgeui/layout/ForgeUILayoutDesigner.preview.test.tsx`
- `src/components/editor/ComponentPreview.tsx`
- `src/forgeui/preview/forgePreviewRenderer.tsx`
- `src/forgeui/ForgeUILvglExport.ts`
- `src/forgeui/ForgeUILvglExport.box.test.ts`

Inspector ownership and atomic component-model updates:

- `src/components/inspector/LayoutRegionInspector.tsx`
- `src/components/inspector/Inspector.tsx`
- `src/core/models/components.ts`
- `src/core/models/components.test.ts`

Template-aware AI contract, validation, composition and UI:

- `src/forgeui/ai/ForgeAIRegionComposer.ts`
- `src/forgeui/ai/ForgeAIRegionComposer.test.ts`
- `src/forgeui/ai/ForgeAIClient.ts`
- `src/forgeui/ai/ForgeAIEngine.ts`
- `src/forgeui/ai/ForgeAIPrompts.ts`
- `src/forgeui/ai/ForgeAIPanel.tsx`
- `src/forgeui/ai/ForgeAIPanel.stateSheet.test.tsx`
- `src/pages/api/forgeui-ai-layout.ts`

Architecture and manual-validation guide:

- `docs/FORGEUI_LAYOUT_DESIGNER.md`

### QR Code

- `src/forgeui/preview/StandardQRCodePreview.tsx` — shared deterministic Canvas and Browser vector renderer
- `src/forgeui/preview/StandardQRCodePreview.test.tsx`
- `src/components/inspector/panels/components/QRCodePanel.tsx`
- `src/components/editor/ComponentPreview.tsx`
- `src/forgeui/preview/forgePreviewRenderer.tsx`
- `src/forgeui/ForgeUILvglExport.ts` — native `lv_qrcode` creation and runtime setter
- `src/forgeui/ForgeUILvglExport.qrcode.test.ts`
- `src/utils/defaultProps.tsx`
- `firmware/ForgeUI-One/sdkconfig.defaults` — `CONFIG_LV_USE_QRCODE=y`
- `docs/FORGEUI_QR_CODE.md`

### Interactive framework

- `src/forgeui/interactive/ForgeUIInteractiveAsset.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetIds.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetRegistry.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetPersistence.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetValidation.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetResolver.ts`
- `src/forgeui/interactive/index.ts`

### Direct Creator and navigation

- `src/forgeui/ForgeUINavigation.ts`
- `src/components/editor/PreviewContainer.tsx`
- `src/components/inspector/Inspector.tsx`
- `src/components/inspector/InteractiveButtonCreatorHelper.tsx`
- `src/components/inspector/InteractiveToggleCreatorHelper.tsx`
- `src/components/inspector/InteractiveLightCreatorHelper.tsx`
- `src/components/inspector/InteractiveStatusIndicatorCreatorHelper.tsx`
- `src/components/inspector/InteractiveThreePositionToggleCreatorHelper.tsx`
- `src/forgeui/ai/ForgeAIPanel.tsx` — recognizes direct Creator targets, including Status Indicator, and selects the Interactive tab
- `src/hooks/useDropComponent.ts` — owns the `120 × 72` default Status Indicator Canvas size

### Button

- `src/forgeui/interactive/ForgeUIInteractiveButtonAsset.ts`
- `src/forgeui/interactive/ForgeUIInteractiveButtonHook.ts`
- `src/forgeui/interactive/ForgeUIInteractiveButtonVisibleBounds.ts`
- `src/forgeui/interactive/InteractiveButtonPreview.tsx`
- `src/components/editor/previews/InteractiveButtonCanvasPreview.tsx`

### Toggle Switch

- `src/forgeui/interactive/ForgeUIInteractiveToggleSwitchAsset.ts`
- `src/forgeui/interactive/InteractiveToggleSwitchPreview.tsx`
- `src/components/editor/previews/InteractiveToggleSwitchCanvasPreview.tsx`
- `src/forgeui/interactive/InteractiveLightDesigner.tsx` — shared binary-artwork designer with type-scoped Toggle, Light and Status Indicator drafts
- `src/forgeui/ai/ForgeAIPanel.tsx` — owns the Toggle State Sheet Builder and returns completed OFF/ON state IDs to the Toggle designer

The current implementation does not introduce a separate `InteractiveToggleSwitchDesigner.tsx`. Toggle retains its own direct navigation target, draft requests, State Sheet handoff, asset model, preview and generated Toggle Input Runtime while reusing the binary-artwork designer.

### Three-Position Toggle Switch

- `src/forgeui/interactive/ForgeUIInteractiveThreePositionToggleAsset.ts`
- `src/forgeui/interactive/InteractiveThreePositionTogglePreview.tsx`
- `src/forgeui/interactive/InteractiveThreePositionToggleDesigner.tsx`
- `src/forgeui/interactive/UnconfiguredThreePositionTogglePlaceholder.tsx`
- `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`
- `src/components/editor/previews/InteractiveThreePositionToggleCanvasPreview.tsx`

### Light

- `src/forgeui/interactive/ForgeUIInteractiveLightAsset.ts`
- `src/forgeui/interactive/ForgeUIInteractiveLightVisibleBounds.ts`
- `src/forgeui/interactive/InteractiveLightDesigner.tsx`
- `src/forgeui/interactive/InteractiveLightPreview.tsx`
- `src/forgeui/interactive/UnconfiguredLightPlaceholder.tsx`
- `src/components/editor/previews/InteractiveLightCanvasPreview.tsx`

### Shared visible bounds and Canvas geometry

- `src/forgeui/interactive/ForgeUITwoStateVisibleBounds.ts`
- `src/forgeui/interactive/ForgeUITwoStateVisibleBounds.test.ts`
- `src/forgeui/ForgeUIUploadedAssetRegistry.ts`
- `src/forgeui/ForgeUIUploadedAssetRegistry.test.ts`
- `src/components/editor/PreviewContainer.tsx`
- `src/components/editor/ComponentPreview.tsx`
- `src/components/editor/ComponentPreview.test.tsx`
- `src/components/editor/InteractiveToggleSwitchCanvasResize.test.tsx`
- `src/components/editor/InteractiveStatusIndicatorCanvasResize.test.tsx`
- `src/components/editor/InteractiveThreePositionToggleCanvasResize.test.tsx`

### Status Indicator

- `src/forgeui/interactive/ForgeUIInteractiveStatusIndicatorAsset.ts`
- `src/forgeui/interactive/UnconfiguredStatusIndicatorPlaceholder.tsx`
- `src/forgeui/interactive/InteractiveStatusIndicatorPreview.tsx`
- `src/forgeui/interactive/InteractiveStatusIndicatorPreview.test.tsx`
- `src/components/editor/previews/InteractiveStatusIndicatorCanvasPreview.tsx`
- `src/components/editor/previews/InteractiveStatusIndicatorCanvasPreview.test.tsx`

### Configured Inspector helpers

- `src/components/inspector/InteractiveButtonCreatorHelper.tsx`
- `src/components/inspector/InteractiveToggleCreatorHelper.tsx`
- `src/components/inspector/InteractiveLightCreatorHelper.tsx`
- `src/components/inspector/InteractiveStatusIndicatorCreatorHelper.tsx`
- `src/components/inspector/InteractiveThreePositionToggleCreatorHelper.tsx`

### Shared UI and AI

- `src/forgeui/interactive/ForgeUIInteractiveAssetPanel.tsx`
- `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`
- `src/forgeui/ai/StateSheetOverlay.tsx`
- `src/forgeui/ai/ForgeUIAIImagePipeline.ts`
- `src/pages/api/forgeui-ai-hero.ts`

### Built-in System Interface

- `src/forgeui/system/`
- `src/forgeui/system/ForgeUISystemContext.tsx` — typed page navigation, current-session brightness and Browser Preview Wi-Fi workflow state
- `src/forgeui/system/ForgeUISystemSurface.tsx` — shared Studio Canvas and Browser Preview System surface
- `src/forgeui/system/ForgeUIWifiPage.tsx` — complete Browser Preview Wi-Fi Manager surface, password workflow and connected details
- `src/forgeui/system/ForgeUISystemSurface.test.tsx`
- `src/forgeui/system/index.ts`
- `src/pages/_app.tsx` — owns the shared System provider boundary
- `src/components/editor/Editor.tsx` — hosts the System surface at the Studio device boundary
- `src/forgeui/preview/DevicePreview.tsx` — hosts the same System surface at the Browser Preview device boundary

### Exporter

- `src/forgeui/ForgeUILvglExport.ts`
- `src/forgeui/ForgeUILvglExport.system.test.ts`
- `src/forgeui/ForgeUILvglExport.led.test.ts`
- `src/forgeui/ForgeUILvglExport.bar.test.ts`
- `src/forgeui/ForgeUILvglExport.arc.test.ts`
- `src/forgeui/ForgeUILvglExport.chart.test.ts`
- `src/forgeui/ForgeUILvglExport.keyboard.test.ts`
- `src/forgeui/ForgeUILvglExport.calendar.test.ts`
- `src/forgeui/ForgeUILvglExport.roller.test.ts`
- `src/forgeui/ForgeUILvglExport.msgbox.test.ts`
- `src/forgeui/ForgeUILvglExport.buttonmatrix.test.ts`
- `src/forgeui/ForgeUILvglExport.tabview.test.ts`
- `src/forgeui/ForgeUILvglExport.tileview.test.ts`
- `src/forgeui/ForgeUILvglExport.button.test.ts`
- `src/forgeui/ForgeUILvglExport.text.test.ts`
- `src/forgeui/ForgeUILvglExport.heading.test.ts`
- `src/forgeui/ForgeUILvglExport.clock.test.ts`
- `src/forgeui/ForgeUILvglExport.input.test.ts`
- `src/forgeui/ForgeUILvglExport.textarea.test.ts`
- `src/forgeui/ForgeUILvglExport.switch.test.ts`
- `src/forgeui/ForgeUILvglExport.checkbox.test.ts`
- `src/forgeui/ForgeUILvglExport.radio.test.ts`
- `src/forgeui/ForgeUILvglExport.progress.test.ts`
- `src/forgeui/ForgeUILvglExport.numberinput.test.ts`
- `src/forgeui/ForgeUILvglExport.select.test.ts`
- `src/forgeui/ForgeUILvglExport.image.test.ts`
- `src/forgeui/ForgeUILvglExport.box.test.ts`
- `src/forgeui/ForgeUILvglExport.iconbutton.test.ts`
- `src/forgeui/preview/StandardSwitchPreview.tsx`
- `src/forgeui/preview/StandardCheckboxPreview.tsx`
- `src/forgeui/preview/StandardRadioPreview.tsx`
- `src/forgeui/preview/StandardSliderPreview.tsx`
- `src/forgeui/preview/StandardNumberInputPreview.tsx`
- `src/forgeui/preview/StandardSelectPreview.tsx`
- `src/forgeui/preview/StandardIconButtonPreview.tsx`
- `src/forgeui/ForgeUIStandardButton.ts`
- `src/forgeui/ForgeUIStandardText.ts`
- `src/forgeui/ForgeUIStandardHeading.ts`
- `src/forgeui/ForgeUIStandardClock.ts`
- `src/components/inspector/panels/components/ButtonPanel.tsx`
- `src/components/inspector/panels/components/StandardTextPanel.tsx`
- `src/components/inspector/panels/components/HeadingPanel.tsx`
- `src/components/inspector/panels/components/ClockPanel.tsx`
- `src/components/editor/previews/ButtonPreview.tsx`
- `src/components/editor/previews/TextPreview.tsx`
- `src/components/editor/previews/HeadingPreview.tsx`
- `src/components/editor/previews/ClockPreview.tsx`
- `export-server.js`
- `export-server.test.js`

The exporter owns shared generated runtime implementations, retained per-instance objects and state, public APIs, transition helpers, LVGL event adapters, generated hook declarations/stubs, deterministic collision-safe names, and built-in System containers and callbacks. Both live `/export` and standalone `/export-idf-project` use this generator through `export-server.js`. `90_Studio_Export.*` remains generated and replaceable; live-firmware `95_UserEvents.*` is preservation-merged, while standalone-export copies become developer-owned. The System Interface does not add generated user-event hooks.

### Standard semantic theme and shared previews

- `src/forgeui/preview/forgeThemeMap.ts`
- `src/forgeui/theme/ForgeThemeContext.tsx`
- `src/forgeui/preview/forgePreviewRenderer.tsx`
- `src/forgeui/preview/StandardChartPreview.tsx`
- `src/forgeui/preview/StandardCalendarPreview.tsx`
- `src/forgeui/preview/StandardScalePreview.tsx`
- `src/forgeui/preview/StandardRollerPreview.tsx`
- `src/forgeui/preview/StandardMessageBoxPreview.tsx`
- `src/forgeui/preview/StandardButtonMatrixPreview.tsx`
- `src/components/editor/previews/BarPreview.tsx`
- `src/components/editor/previews/ArcPreview.tsx`

### Generated firmware

- `firmware/ForgeUI-One/main/90_Studio_Export.c`
- `firmware/ForgeUI-One/main/90_Studio_Export.h`
- `firmware/ForgeUI-One/main/95_UserEvents.c`
- `firmware/ForgeUI-One/main/95_UserEvents.h`

## Physical ESP32-P4 Proof

### Standard LVGL Input and Selection Parity — 2026-07-30

Physical Canvas → Browser Preview → generated LVGL → ESP32-P4 proof is recorded for:

- Input
- Textarea
- Checkbox
- Switch
- Radio
- Progress
- Circular Progress
- Number Input
- Select

The final whole-screen evidence showed Canvas and P4 using the same active graphite/orange semantic theme. Borders, surfaces, accent states and component geometry were visually aligned. Number Input arrows operated on hardware, and its outer frame and internal dividers matched the shared preview. The Select outer border matched Canvas and Browser Preview. The Switch checked state used the amber accent rather than native blue. Circular Progress had no knob and could not be dragged; Progress remained intentionally noninteractive. Radio showed no fallback label. Input and Textarea remained focusable native fields with no automatic Standard keyboard attachment.

Generated user hooks for Input, Textarea, Checkbox, Switch, Radio, NumberInput and Select were present and preservation-merged. Output-only Progress and CircularProgress generated no changed hook. No physical claim beyond these observed results is made.

### Standard LVGL eleven-component theme parity

The following Standard components are physically proven across Canvas, Browser Preview, generated LVGL and ESP32-P4.

#### LED

- Runtime setter, hook and silent startup are verified.
- Semantic green is intentionally retained as a status colour independent of decorative theme colours.

#### Bar

- Canvas interaction, Browser Preview, generated LVGL, ESP32-P4, runtime setter and hook are verified.
- Negative and reversed ranges are verified.
- Track uses `surfaceSecondary`, border uses `surfaceBorder`, and indicator uses `accent`.

#### Arc

- Canvas, Browser Preview, generated LVGL, ESP32-P4, runtime setter, hook and silent startup are verified.
- Background arc uses `surfaceSecondary`, indicator uses `accent`, and knob uses `accentText`.

#### Chart

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- The native single-series `lv_chart` remains responsible for point count, runtime streaming and runtime clear.
- Parity includes themed surface, border and divisions; responsive gutters; Y-axis labels; X-axis point indexes; non-clickable sibling `lv_label` axis labels; and selected-theme text colours.
- Default Y labels are `100`, `75`, `50`, `25`, `0`.
- Default X labels are `0`, `1`, `2`, `3`, `4`, `5`, `6`.
- Runtime APIs and hooks are unchanged, and startup remains silent.

#### Table

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- Surface, cells, grid and primary text are theme-driven.
- No Table runtime API is claimed or invented.

#### Keyboard

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- Keyboard surface, keys, borders, pressed and disabled keys, and text are theme-driven.
- Show/Hide APIs and their existing hooks are preserved.

#### Calendar

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- The fixed model remains June 2026, Sunday-first, 42 date cells, six weeks, spill dates and today outline.
- Surface, border, `textPrimary`, `textSecondary` and `accent` are theme-driven.

#### Scale

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- The model remains horizontal-bottom, `0..100`, 11 ticks, labels and no surrounding panel.
- Ticks use `accent`; labels use `textPrimary`.
- Scale remains API-free.

#### Roller

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- The opaque surface, border, normal text, selected row and selected text are theme-driven.
- Selection behavior is unchanged.

#### Message Box

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- The current architecture remains a custom ForgeUI panel with title, body and buttons; it does not use `lv_msgbox_create`.
- Surface, border, text and outlined buttons are theme-driven.
- Show, Close and button hooks are preserved.

#### Button Matrix

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- Surface, button surface, border, text, selected state and disabled state are theme-driven.
- Runtime behavior is unchanged.

### Interactive Button

- Normal image displayed physically.
- Pressed image displayed on touch.
- Released state restored the Normal image.
- Physical click was detected and the generated hook was called.
- Resized and visible-bounds-fitted geometry matched Canvas and Browser Preview through generated contain-fit scaling.
- Legacy artwork dimension recovery and centred Normal/Pressed scaling were validated on ESP32-P4.
- Monitor output confirmed:

```text
[ForgeUI] FG_On_Button_Clicked clicked
[ForgeUI User Event] FG_On_Button_Clicked
```

### Interactive Light

- ON and OFF state artwork exported.
- The saved initial ON state displayed physically.
- The public setter was generated.
- The Light remained non-clickable.
- Resized and visible-bounds-fitted Light geometry matched Canvas and Browser Preview through shared OFF/ON contain-fit scaling.
- Registry, PNG IHDR and LVGL descriptor dimension resolution preserve stable centred generated geometry.
- Firmware remained stable.

### Interactive Toggle Switch

- Studio, persistence, Canvas, Browser Preview, generated Toggle Input Runtime and automated export validation are complete.
- The current Toggle Switch export has been exercised on the physical ESP32-P4.
- OFF/ON state artwork and touch state changes operate through the generated Toggle Input Runtime.
- Resized contain-fit output is not claimed as physically checked unless separately recorded.
- No claim beyond the recorded single-control OFF/ON touch workflow is made here.

### Interactive Three-Position Toggle Switch

- Generated LEFT, CENTER and RIGHT images displayed physically with consistent State Sheet styling.
- The full rectangular control was divided into three touch zones.
- LEFT, CENTER and RIGHT changed correctly on touch.
- The generated `FG_On_ThreePositionToggle_Changed` callback matched the runtime state.
- The user-event hook printed readable LEFT, CENTER and RIGHT values.
- Initial state was applied with notification disabled.
- Runtime remained stable.
- Resized contain-fit output is not claimed as physically checked unless separately recorded.

### Interactive Status Indicator

- Binary OFF/ON output and the generated `FG_Set_*` control path are physically proven within the recorded scope.
- Resized component geometry matches Browser Preview on the physical ESP32-P4.
- Centred contain-fit scaling and correct OFF/ON rendering are physically proven.
- The shared generated Binary Output runtime remained stable through the geometry parity check.

### System Interface

- The generated gear launcher is visible, touch-friendly and physically proven.
- Application-to-System navigation operates through internal LVGL callbacks.
- The System launcher and Display / Brightness page render correctly at `1024 × 600`.
- The live Brightness slider updates its percentage while dragging.
- Brightness physically controls the ESP32-P4 display backlight through `bsp_display_brightness_set()`.
- Brightness remains selected while navigating during the current device session.
- Back navigation returns from Display to System and from System to the existing application.
- Existing Interactive Assets remain alive while System is open and continue working after leaving System.

### Wi-Fi Manager

- The complete generated Wi-Fi Manager workflow is physically proven on the ESP32-P4.
- Scan Networks and Refresh populate and update the live Available Networks list from the Hosted backend.
- Live SSID population, SSID selection, RSSI, security and Connected and Saved markers are physically proven.
- Secured-network selection opens the generated password dialog and attaches the reusable native LVGL keyboard to the password textarea.
- Password entry, show/hide password, Done and Cancel operate with the correct physical geometry and top-layer ownership.
- Connect, Disconnect, Reconnect and Forget Network are physically proven through the complete UI workflow.
- Connected details display the active SSID, IP address, gateway, RSSI and signal quality, security, station MAC, AP BSSID and current status.
- Repeated Hosted scans replace prior results without duplicate rows or stale SSIDs.
- Studio and Browser Preview reproduce the same navigation, password, connection and connected-details workflow without taking ownership away from the generated LVGL System Runtime.
- Existing Interactive Assets and System navigation remain alive and stable throughout Wi-Fi interaction.
- Minor visual polish remains.

### Storage Browser

- The lazily created Storage page opens and is reused without boot or navigation regression.
- SD status and capacity display are physically proven.
- Root browsing, folder browsing and parent navigation are physically proven.
- Previous / Next paging is physically proven.
- Refresh and Read / Write Test are physically proven.
- Select Item mode selects one directory without changing normal folder navigation.
- Delete Empty Folder is physically proven through the lazy confirmation workflow.
- Hosted Wi-Fi remains alive during Storage use.
- Repeated Storage opening, browsing, Refresh and operation use do not regress the System Runtime.
- File deletion, rename, formatting, mount / unmount and recursive deletion are not claimed as implemented or physically proven.

### Hosted Wi-Fi and SD coexistence

Today's physical ESP32-P4 validation recovered the original Hosted Wi-Fi architecture and proved simultaneous Hosted connectivity and SD operation.

Hosted transport reported:

```text
transport: Identified slave [esp32c6]
H_API: Transport active
FG_WIFI: STA started
FG_WIFI: WiFi hosted init READY
```

The runtime validation proved:

- MAC address read
- automatic reconnect
- DHCP address obtained
- Wi-Fi Connected
- SD mounted successfully
- SD write/read test passed
- Wi-Fi and SD operating simultaneously

The observed coexistence message:

```text
sdmmc_host_init:
SDMMC host already initialized,
skipping init flow
```

confirms the intended use of SDMMC Slot 1 for Hosted Wi-Fi alongside SDMMC Slot 0 for the SD Card.

### System health

- Wi-Fi READY
- Wi-Fi connected
- IP assigned
- SD READY
- SD write/read test passed
- Hosted Wi-Fi and SD operating simultaneously
- No crash after interaction

## Native LVGL Keyboard Runtime and Visual Parity

The generated System Runtime owns one reusable native `lv_keyboard`, which is an `lv_buttonmatrix` subclass. It is created lazily on the LVGL top layer, attached to the active password textarea through `lv_keyboard_set_textarea()`, reused after its first creation and hidden and detached after Done or Cancel. The password workflow, show/hide behavior, Done, Cancel, physical geometry, ForgeUI styling and Browser Preview parity are physically proven. Two LVGL defaults caused the original hardware mismatch:

- the active theme supplied DPI-dependent padding, gaps, radius, font, shadow and outline;
- `lv_keyboard_create()` internally bottom-aligned the object, while `lv_obj_set_pos()` changed X/Y without clearing that alignment.

The exporter now configures the map, textarea, mode and explicit keyboard styles before final geometry. It clears unwanted theme-dependent padding, shadow and outline behavior, assigns the intended font and gaps, calls `lv_obj_set_align(..., LV_ALIGN_TOP_LEFT)`, and only then applies final position and size. No later generated call overrides the geometry.

The refined button-matrix width map is:

```text
Row 1: 4  4  4  4  4  4  4  4  4  4  4  4
Row 2: 3  3  3  3  3  3  3  3  3  3  3
Row 3: 1  1  1  1  1  1  1  1  1  1  1  1
Row 4: mode 2, left arrow 2, space 12, right arrow 2, confirm 2
```

LVGL normalizes width units independently within each row. The physical result now occupies the intended large keyboard area, aligns its textarea and keyboard, fills the available rectangle with four key rows, and matches the proven System password workflow represented in Browser Preview.

The keyboard runtime is reusable architecture for future Device settings, MQTT, Ethernet, Bluetooth, API keys, Device naming, Login and other System dialogs. Those consumers remain future work and are not claimed as implemented or physically proven.

## Verified Automated Status

- Widget Registry, Tray insertion, search, keyboard access, undo/redo and hydration-focused suites pass 21/21.
- QR Code registry, deterministic vector preview, native LVGL export and runtime API tests pass.
- The complete current LVGL exporter regression passes 236/236 across 33 suites, including QR Code.
- `git diff --check` passes for the QR and documentation work.
- The broader ForgeUI run passed QR, layout, preview, theme and exporter suites before exceeding its command timeout; two pre-existing AI State Sheet tests also exceeded their individual timeouts. That interrupted run is not represented as a full pass.
- Full TypeScript checking currently reports the pre-existing `ForgeUIStandardCircularProgress.test.tsx` JSX return-type diagnostic; no QR-specific TypeScript diagnostic is present.
- QR phone-scan validation remains pending; generated C and the current clean ESP-IDF build are now present.
- Dashboard Layout Designer geometry and Auto Arrange pass 6 focused tests.
- Browser Preview smart-region coverage passes 1 focused test.
- AI region composition passes 2 focused tests.
- Semantic Box LVGL export passes 9 focused tests.
- The focused component-model Auto Arrange reducer passes 1 test.
- The Layout Designer preview, Apply Dashboard and AI Fill workflow passes 1 focused panel/UI test.
- The total focused Layout Designer result is 20 tests passed.
- No TypeScript errors were found in the changed Layout Designer path. The unrelated pre-existing Circular Progress JSX test typing error remains.
- A full Studio production build, firmware build and hardware flash were not run for the Layout Designer milestone.
- Built-in System regressions cover launcher opening and closing, Display and Wi-Fi navigation, Back navigation, live brightness state, current-session retention, Wi-Fi scan and connection preview workflows, password and forget dialogs, connected details, disabled placeholder behavior and preservation of existing application interaction.
- LVGL System exporter regressions cover the persistent application container, internal gear callback, System, Brightness and Wi-Fi containers, disabled cards, immediate visibility navigation, live `10–100` slider behavior, Waveshare BSP brightness integration and generated ownership of the Hosted-backed Wi-Fi Manager workflow.
- Focused configured-helper, direct Creator, registry measurement, shared selection-border resize, visible-bounds, Canvas preview, Browser Preview, persistence and exporter regressions pass across the five Interactive Assets.
- Browser Preview wrapper geometry and Interactive Browser Preview parity regressions cover saved component bounds, positioning and centred contain-fit rendering.
- Binary Output regressions cover the shared exporter path, Status Indicator LVGL scaling, component-sized container generation and centred child-image generation.
- Toggle State Sheet and Three-Position State Sheet, linked-crop, row-remapping and atomic-registration regressions pass; the State Sheet suite may require its longer timeout.
- Keyboard exporter lazy-creation, reusable-instance, textarea attachment, top-layer ownership, geometry, ordering, style and relative-width regressions pass.
- Shared union geometry, intrinsic and alpha-bound metadata, linked crop, same-ID invalidation, duplicate-write suppression and idempotent fitting regressions pass.
- Earlier TypeScript milestones passed with `tsc --noEmit`; the current checkout has the separately recorded Circular Progress test JSX diagnostic.
- Focused `ForgeUILvglExport.{led,bar,arc,chart,keyboard,calendar,roller,msgbox,buttonmatrix,tabview,tileview}.test.ts` suites pass for retained runtime APIs, transition semantics, deterministic collision handling and hook preservation.
- Focused Button Text, Text Value, Heading Text and Clock Presentation suites pass across serialization, previews and shared export generation.
- TabView tests pass 5/5, Tileview tests pass 7/7, Heading tests pass 7/7, Clock tests pass 7/7, and the Button/Text/Heading/Clock presentation regression passes 29/29.
- Focused `export-server.test.js` coverage passes for generated hooks and preservation-merging of developer-owned bodies. The full suite is not claimed as passing when unrelated Neural Core and Carbon Fiber generated theme sources are absent.
- Live `/export`, standalone `/export-idf-project`, and ESP-IDF 5.5.4 build validation pass for the standard LVGL runtime API milestone.
- Scoped diff validation passes for the current implementation work.
- Client/server export validation and reference-protection coverage remain in place for all five Interactive Asset types.
- A known unrelated server fixture/source absence can fail the built-in theme-source preflight when the expected Neural Core or Carbon Fiber generated C files are not present; this does not weaken the validation boundary.

## Architectural Significance and Extension Pattern

### Standard LVGL semantic theme architecture

ForgeUI Standard LVGL components now share one semantic theme architecture. Future Standard components should:

- consume semantic theme roles;
- share Canvas and Browser rendering where practical;
- emit equivalent LVGL styling;
- preserve native LVGL interaction;
- avoid hard-coded decorative colours;
- retain the deterministic fallback;
- keep semantic status colours independent where appropriate.

This architecture provides authoring, preview and generated-firmware parity without adding runtime device theme switching.

### Layout Designer

```text
Layout Designer
├── LayoutDefinition Registry
│   └── Dashboard
├── Smart Region Boxes
├── Stable Region Assignment
├── Auto Arrange
├── Template-aware AI Fill
└── Normal ForgeUI Export Path
```

The Layout Designer composes existing project components and introduces no new firmware runtime ownership. It is independent from the Interactive Asset runtime families, built-in System Runtime, Standard LVGL runtime APIs, Hosted Connectivity and Storage Runtime.

ForgeUI now contains these reusable platform layers and services:

```text
Studio
├── AI
├── Canvas
└── Browser Preview

System Runtime
├── System Launcher
├── Display
├── Wi-Fi Manager
├── Storage Browser
├── Native LVGL Keyboard
└── Future System pages

Interactive Asset Runtime
├── Interactive Inputs
├── Three-Position Inputs
└── Binary Outputs

Standard LVGL Component Runtime
├── Scalar / visual output
│   ├── Led
│   ├── Bar
│   ├── Arc
│   ├── Progress
│   └── CircularProgress
├── Streaming output
│   └── Chart
├── Text entry
│   ├── Input
│   ├── Textarea
│   └── NumberInput
│       ├── outer container
│       ├── numeric textarea
│       ├── increment button
│       ├── decrement button
│       └── serialized step
├── Boolean / selectable input
│   ├── Switch
│   ├── Checkbox
│   └── Radio
├── Option selection
│   ├── Roller
│   ├── Select
│   ├── ButtonMatrix
│   ├── Tabview
│   └── Tileview
├── Actions
│   └── IconButton
├── Visibility / dialog services
│   ├── Keyboard
│   ├── Msgbox
│   └── Box
├── Date selection
│   └── Calendar
├── Runtime image output
│   └── Image
├── Encoded display output
│   └── QRCode
├── Serialized text/time presentation
│   ├── Button
│   ├── Text
│   ├── Heading
│   └── Clock
└── API-free visuals
    ├── Scale
    ├── Line
    ├── Icon
    └── Divider

Interactive state receives a guarded setter plus a genuine-user hook. Output
state receives a setter only. Serialized presentation normally receives no
runtime API, and components with no semantic state remain intentionally API-free.
TabView owns an active index and Tileview owns active coordinates. Clock presents
RTC-owned state. Button, Text and Heading own serialized content. Scale, Line and
Divider remain API-free. Icon has optional generic presentation and click state.

Slider Canvas interaction and generated runtime are complete. It exposes a clamped, collision-safe `FG_Set_<Name>_Value(int32_t)` setter and a genuine-user-only `FG_On_<Name>_Changed(int32_t)` hook. Initialization and programmatic updates are silent and repeated values are suppressed.

Hosted Connectivity Runtime
├── ESP-Hosted
├── Wi-Fi Remote
├── ESP32-C6
└── SDIO Slot 1

Storage Runtime
├── SDMMC Slot 0
├── Lazy Storage page
├── Deferred worker
├── Bounded request and row models
└── Safe directory operations

Generated Firmware
├── LVGL
├── ESP-IDF
├── User Events
└── Hardware Integration
```

The System Interface is not an Interactive Asset. It is a reusable platform service generated alongside the user's application. It does not enter the Interactive Asset registry, does not become a user project screen and does not generate user callbacks.

Hosted Connectivity Runtime and Storage Runtime are reusable platform services independent of Interactive Assets. Hosted Connectivity owns ESP-Hosted, Wi-Fi Remote, the ESP32-C6 and SDIO Slot 1 and provides a complete reusable Hosted Wi-Fi service consumed by the built-in Wi-Fi Manager, including hosted scanning, AP retrieval and connection workflow; Storage Runtime owns the SD Card on SDMMC Slot 0 and provides a reusable built-in Storage Browser service alongside Wi-Fi.

This separation lets enabled built-in tools reuse typed System navigation without affecting project screens or Interactive Asset runtime contracts. Launcher, Display / Brightness, Diagnostics, Wi-Fi Manager, Storage Browser and the reusable native keyboard are implemented. Wi-Fi Manager and Storage Browser are constructed on demand and destroyed safely on Back while their separately owned backends remain alive.

Interactive Button established the first **Interactive Input Runtime** within the Interactive Asset Framework.

Interactive Toggle Switch extended that family with persistent binary input state, a shared Toggle Input Runtime and per-instance changed callbacks.

Interactive Three-Position Toggle Switch established the **Three-Position Input Runtime**, proving that the framework can support strongly typed persistent multi-position state, direct geometric selection and a generated enum without modelling the control as a boolean.

Interactive Light introduced the shared **Binary Output Runtime**, proving that generated output controls could expose a simple developer API while sharing a common runtime implementation.

Interactive Status Indicator validated that the Binary Output Runtime is reusable. It extends the framework without introducing a second runtime implementation, demonstrating that additional binary output assets can be added by reusing the existing runtime while providing their own asset model, designer, preview behaviour, export handling and generated public API. Status Indicator also completes the shared direct Creator workflow across all five Interactive Assets while remaining a non-clickable physical binary output controlled through `FG_Set_*`, not an input control.

ForgeUI now extends by adding reusable runtime families rather than accumulating isolated widget implementations. Each family owns the generated C runtime appropriate to its state and interaction model. All families share Interactive Asset identity, registry, persistence, uploaded assets, AI generation, Canvas assignment, preview, export integration, validation and generated-file ownership.

ForgeUI also has reusable creation architecture, with direct Creator coverage now complete across all five Interactive Assets:

- direct Creator navigation from Canvas context menus and Inspector onboarding;
- exact configured-asset reopening and clean unconfigured drafts;
- explicit Save and assignment boundaries;
- master State Sheet generation;
- shared linked-crop editing;
- atomic conversion and uploaded-asset registration;
- type-scoped Creator requests inside the shared portal.

All five Interactive Assets now share reusable post-placement geometry architecture:

- configured Inspector and direct Creator workflows;
- one shared selection-border resize capability with eight edge and corner zones;
- continuous Canvas-boundary clamping with live Inspector updates;
- component-authoritative geometry after placement;
- registry-driven configured and unconfigured preview replacement;
- one stable two-state visible-bounds union for Button, Toggle, Light and Status Indicator, plus the compatible three-state union path for Three-Position Toggle;
- preserved original uploads and idempotent fitted assets;
- intrinsic and alpha-bound measurement with same-ID invalidation and deduplicated registry writes;
- saved component geometry across Canvas and Browser Preview;
- centred contain-fit rendering across Canvas, Browser Preview and generated LVGL output;
- final component-authoritative LVGL export geometry.

This keeps artwork ownership on reusable Interactive Assets while component placement, size and export geometry remain owned by each Canvas component. Runtime semantics remain type-specific: Button and Toggle retain their input callbacks, Three-Position retains its enum and thirds-based selection, and Light and Status Indicator retain non-clickable `FG_Set_*` output control.

The Three-Position workflow proves an extensible N-state creation pattern:

```text
one master image
  -> N linked crop regions
  -> N uploaded visual assets
  -> strongly typed runtime state
```

This architecture can support future multi-state selectors without implying that those controls are implemented today.

Future Interactive Asset types should extend the discriminated asset union and provide their own:

- asset model
- validation
- designer fields
- preview behaviour
- Canvas behaviour
- AI state mapping
- export handling
- runtime behaviour

while reusing the shared framework infrastructure for:

- Interactive Asset identity
- registry
- persistence
- uploaded asset management
- AI image generation pipeline
- Canvas assignment
- LVGL export integration
- framework-level UI coordination

Current runtime families:

```text
Interactive Input Runtime
├── Interactive Button
└── Interactive Toggle Switch

Three-Position Input Runtime
└── Interactive Three-Position Toggle Switch

Binary Output Runtime
├── Interactive Light
└── Interactive Status Indicator
```

Potential future Standard Runtime concepts include:

- Gauge
- Meter
- Seven Segment Display
- Numeric Display
- Radio Group and mutual-exclusion ownership
- dynamic Select option model

These remain future concepts only. Existing Radio and Checkbox runtimes are implemented independently, NumberInput is the implemented composed textarea-and-stepper control, and Select options remain serialized.

# Save Point History

Save points are ordered newest to oldest. Detailed subsystem engineering is maintained in the Developer Code Maps.

## FORGEUI_NATIVE_COMPONENT_1__DASHBOARD_CARD_PROVEN__ESP32P4_VALIDATED__READY_FOR_SENSOR_TILE__2026-08-02

- **First Native Component:** Dashboard Card is **PROVEN** as an
  application-level ForgeUI component above the completed LVGL layer.
- **Architecture proof:** Registry extension, semantic serialization, shared
  preview/export, Runtime SDK, UserEvents, single-component Canvas ownership
  and private internal LVGL composition are validated.
- **Hardware:** Browser, Live Studio and Standalone output matched closely on
  ESP32-P4; Runtime setters, touch and independent instances remained stable
  without crash, watchdog reset or rendering corruption.
- **Boundary:** This milestone is separate from the completed 44/44 practical
  LVGL history.
- **Next:** ForgeUI Native Component #2 — Sensor Tile.

## FORGEUI_LVGL9_COMPLETE__44_OF_44_PRACTICAL_WIDGETS_PROVEN__ESP32P4_VALIDATED__DOCUMENTATION_COMPLETE__READY_FOR_NATIVE_FORGEUI_PLATFORM__2026-08-02

- **Completion:** All 44 practical registered LVGL 9.2 widgets/components are
  physically proven on the Waveshare ESP32-P4.
- **Final proof:** Two independent Menu instances passed child-page and Back
  navigation for approximately ten cycles with stable system pages, connected
  Wi-Fi, approximately 42 KB internal RAM and no crash, watchdog reset or
  rendering corruption.
- **Platform foundation:** Browser Preview, Live Studio and Standalone Export
  parity; Widget Registry; Proven Widget Pipeline; Runtime SDK foundation;
  canonical Image/Icon pipelines; Project Hardware Profiles; Export-Time
  Feature Gating; Fi Runtime; and UserEvents are complete or mature within
  their documented boundaries.
- **Next:** ForgeUI Platform development begins with ForgeUI-native Widgets.

## FORGEUI_LVGL9_CLOSURE_BATCH3__MENU_IMPLEMENTED__READY_FOR_ESP32P4_PHYSICAL_PROOF__2026-08-02

- **Implementation:** Menu is Registry-backed and uses one serialized
  page/section/item navigation tree across Inspector, Canvas, Browser and the
  shared Live/Standalone generator.
- **Native export:** `lv_menu_create`, native pages, sections, item containers,
  separators, load-page events, root selection and LVGL back history.
- **Status:** **IMPLEMENTED — READY FOR PHYSICAL PROOF**. The proven total
  remains **43** until ESP32-P4 validation succeeds.
- **Closure boundary:** Menu hardware proof is the only remaining practical
  LVGL 9.2 closure step. Lottie remains intentionally excluded.

## FORGEUI_LVGL9_CLOSURE_BATCH2__WINDOW_ESP32P4_PROVEN__DOCUMENTATION_ALIGNED__READY_FOR_MENU__2026-08-02

- **Milestone:** Two native LVGL Windows rendered simultaneously on the
  Waveshare ESP32-P4 1024×600 display with visible headers and independent
  close controls. Both closed independently without crash, reboot, watchdog or
  obvious rendering corruption.
- **Proof boundary:** Core native Window rendering, multi-instance independence
  and close behavior are proven. Scrolling, populated child content, action
  callbacks and public Runtime SDK/UserEvents hooks are not claimed by this
  hardware proof.
- **Count:** **43 practical LVGL 9.2 widgets/components physically proven**.
- **Next:** Menu is the only remaining practical closure widget. Lottie remains
  intentionally excluded.

## FORGEUI_LVGL9_CLOSURE_BATCH1__SPAN_ANIMIMAGE_IMAGEBUTTON_ESP32P4_PROVEN__DOCUMENTATION_ALIGNED__READY_FOR_WINDOW_MENU__2026-08-02

- **Milestone:** Span, Animation Image and Image Button passed ESP32-P4
  physical validation, raising the practical LVGL 9.2 proof total to **42**.
- **Parity:** Canvas, Browser Preview, Live Studio and Standalone Export matched;
  no hardware regressions were observed.
- **Next:** Physically prove Window, then implement Menu. Lottie remains intentionally excluded.

## Historical Closure Batch 1 software milestone — superseded 2026-08-02

- **Software result:** Span, Animation Image and Image Button now traverse the
  authoritative Registry, Tray, Canvas, Inspector, Browser Preview and shared
  native Live/Standalone generator.
- **Proof boundary:** 39 established widgets remain PROVEN; these three are
  recorded here at their former pre-proof boundary; they were subsequently
  promoted to PROVEN by the 2026-08-02 milestone above.
- **Runtime:** Span is API/event-free; Animation Image has no public control API;
  Image Button owns enabled state and a genuine click hook.

## FORGEUI_FINAL_LVGL9_AUDIT__39_REGISTERED_STANDARD_WIDGETS_PROVEN__5_PRACTICAL_CLOSURE_WIDGETS__2026-08-01

- **Audit result:** The current Registry remains 39/39 physically proven, but
  the official LVGL 9.2 catalogue has six unregistered classes.
- **Closure decision:** Implement Span, Animation Image, Image Button, Window
  and Menu. Explicitly exclude Lottie pending a separate ThorVG/vector/C++ and
  framebuffer architecture decision.
- **Authority:** `docs/LVGL_9_STANDARD_WIDGET_AUDIT.md`.

## FORGEUI_STANDARD_WIDGET_PIPELINE__39_OF_39_STANDARD_WIDGETS_ESP32P4_PROVEN__BATCH_D_COMPLETE__READY_FOR_FORGEUI_WIDGETS__2026-08-01

Superseded as the current roadmap by the final LVGL 9 catalogue audit above;
its 39/39 physical-proof result remains valid for the then-current Registry.

- **Milestone:** QR Code, Icon Button, Icon final re-proof and Canvas passed
  ESP32-P4 physical validation, completing the Standard Widget Library at
  **39/39 PROVEN**.
- **Evidence:** QR rendered correctly and scanned successfully on a mobile
  phone; Clock, Wi-Fi Status, Icon Button and Canvas operated correctly in Live
  firmware; Canvas, Browser Preview, Live Studio and Standalone Export parity
  was accepted with no observed regression.
- **Next phase:** ForgeUI Widgets: Dashboard family, Window, Menu, Dashboard
  Designer, future Background Designer architecture, generated Runtime SDK
  expansion, template library and higher-level application widgets.

## FORGEUI_BOARD_PROFILES__EXPORT_TIME_FEATURE_GATING__LAZY_SYSTEM_TOOLS__CONNECTED_WIFI_45KB_FREE__RAM_OVERLAY__READY_FOR_FINAL_OPERATOR_VALIDATION__2026-07-31

- **What changed:** Added the Board Selector and board/profile registry, hydration-safe persisted project hardware state, generated `00_ForgeUI_Features.h`, C/CMake/component-manifest pruning, canonical asset deduplication, lazy Wi-Fi Manager/dialog lifecycle, acknowledged Storage-worker teardown, Diagnostics, RAM probes and the compact sysmon overlay.
- **Evidence:** Board, hydration, System exporter/lifecycle and export-server tests cover the permanent generation paths. The current generated firmware and clean ESP-IDF build contain the selected production profile. A connected Application-page serial probe recorded 45,795 bytes current internal free heap, 43,871 bytes minimum-ever, a 27,648-byte largest block and 62 LVGL objects.
- **Remaining boundary:** Operator-driven ten-cycle Wi-Fi/Storage touchscreen validation and QR phone scanning remain open. The sysmon RAM overlay is present in the built ELF but absent from the current managed-component source, so a reproducible ForgeUI-owned patch/override is still required.

## FORGEUI_SLIDER_RUNTIME__NATIVE_SPINNER__READY_FOR_ESP32P4_PROOF__2026-07-31

- **Slider:** The existing shared Canvas/Browser preview and native `lv_slider` export now have a retained generated runtime. `FG_Set_<Name>_Value(int32_t)` clamps signed and reversed serialized ranges, ignores repeats and updates silently. `FG_On_<Name>_Changed(int32_t)` is emitted through `95_UserEvents` only after a genuine LVGL value change; initialization occurs before callback registration.
- **Spinner:** `Spinner` is a Registry-owned Standard Feedback widget with Registry defaults, Tray insertion, shared Canvas/Browser rendering, Inspector controls and native LVGL 9 `lv_spinner_create()` export. Supported properties are width, height, duration, arc length, foreground/background arc widths, semantic or explicit foreground/background colours, and opacity. It has no runtime setter and no UserEvent hook.
- **Theme and gating:** Empty colour overrides resolve to the active semantic accent and secondary-surface roles in preview and export. Spinner code is generated only for serialized Spinner instances and adds no widget-specific runtime source, public declaration, hook or CMake entry.
- **Validation:** Focused Registry, Tray, hydration, shared preview and LVGL
  exporter tests pass. Slider and Spinner are physically **PROVEN** through
  live and standalone ESP32-P4 output. List rendering was physically verified
  at this milestone; its generated item callback was subsequently physically
  validated and List is now **PROVEN**.

## FORGEUI_WIDGET_REGISTRY__LAYOUT_TEMPLATE_LIBRARY__QRCODE_RUNTIME__READY_FOR_QR_HARDWARE_PROOF__2026-07-30

- **What changed:** Established Dashboard as the implemented reference
  `LayoutDefinition` and retained other professional layout concepts as
  roadmap candidates; completed the authoritative Widget Registry and
  registry-driven Widget Tray with search, categories, uploaded and Interactive
  Asset integration, hydration-safe loading and narrow-sidebar polish; and
  implemented QR Code through Registry, Tray, Canvas, Inspector, Browser
  Preview, native LVGL export, semantic theme and runtime API generation.
- **Why it changed:** Layouts and widgets needed scalable definition-driven extension points instead of Dashboard-only or Sidebar-owned implementations. Future Codex sessions also need one mandatory widget lifecycle grounded in the exact LVGL version used by ForgeUI.
- **Final architecture:** `WidgetDefinition` is authoritative for widget identity, metadata, defaults, insertion and capabilities. The Widget Tray renders registry data and assets without a second catalogue. Six layouts share `LayoutDefinition`; AI selects content, semantic regions own placement intent and Auto Arrange owns geometry. Future widgets follow Official LVGL Reference → Widget Registry → Widget Tray → Canvas → Inspector → Browser Preview → LVGL Export → Runtime API when appropriate → `95_UserEvents` for genuine interaction only → ESP32-P4 → Documentation → PROVEN. QR Code uses native `lv_qrcode`, exposes `FG_Set_QR_Code_Text(const char * text)` and intentionally creates no user-event hook.
- **Proven result:** Focused Widget Tray, search, insertion, undo/redo, hydration, QR preview, registry and runtime-export tests pass. The existing Dashboard behavior remains the layout reference while all six definitions use the shared architecture. Batch D subsequently completed ESP32-P4 display, successful mobile scan and Live/Standalone parity. QR Code is **PROVEN**.

## FORGEUI_LAYOUT_DESIGNER__DASHBOARD_SMART_REGIONS_AUTO_ARRANGE_AI_FILL__CANVAS_AND_BROWSER_PREVIEW_MANUALLY_VERIFIED__READY_FOR_EXPORT_AND_HARDWARE_PROOF__2026-07-30

- **What changed:** Completed the first Dashboard Layout Designer vertical slice with deterministic header, status, main, controls and footer smart regions; editable Box and Divider structure; manual region movement and resizing; stable component-to-region assignment; Inspector layout controls; deterministic Auto Arrange; AI Fill Dashboard through the normal AI path; Canvas and Browser Preview rendering; existing save/reload compatibility; and focused generated-LVGL exporter coverage.
- **Why it changed:** Template-based dashboards needed human-readable structural intent and repeatable geometry rather than treating AI-generated absolute coordinates as the primary design mechanism. Users and AI now select supported content and semantic regions while ForgeUI owns structure, arrangement and validation.
- **Final architecture:** The Dashboard template creates ordinary ForgeUI components with optional flat layout metadata. AI returns canonical component intent grouped into named regions without pixel geometry. The Layout Designer builds the deterministic `1024 × 600` structure, maintains stable region keys, applies Auto Arrange and returns normal components to Canvas, Browser Preview, persistence and LVGL export. Legacy free-coordinate generation remains available outside the template workflow.
- **Proven result:** The complete Dashboard vertical slice and the observed AI Fill workflow were manually verified in Canvas and Browser Preview. Automated coverage includes smart-region generation and arrangement, region-composer parsing, atomic model updates, Layout Designer panel behavior, Browser Preview and focused Box/LVGL export styling. This save point does not claim a full Studio production build, an additional live OpenAI network test, an ESP-IDF firmware build, hardware flash, physical ESP32-P4 parity or completion of Settings, Login, Form or other templates.

## FORGEUI_STANDARD_LVGL_PARITY__INPUT_TEXTAREA_CHECKBOX_SWITCH_RADIO_PROGRESS_CIRCULAR_PROGRESS_NUMBER_INPUT_SELECT__SEMANTIC_THEME_AND_BORDER_PARITY__ESP32P4_PROVEN__2026-07-30

- **What changed:** Completed theme, border, state and geometry parity for Input, Textarea, Checkbox, Switch, Radio, Progress, CircularProgress, NumberInput and Select; removed fallback Checkbox/Radio wording; repaired Switch checked-state theme leakage; completed the output-only Circular Progress runtime; completed Number Input hardware steppers and shared frame structure; completed Select closed and popup semantic styling; refreshed stale Studio exporter bundles and regenerated the final live C.
- **Why it changed:** Canvas, Browser Preview and P4 had diverged; several controls still inherited Chakra or LVGL defaults; Circular Progress and Number Input were incomplete on hardware; and stale Studio bundles produced old generated firmware despite exporter source repairs.
- **Final architecture:** Shared semantic previews are used where practical, generated LVGL explicitly owns hardware states, and the flashed P4 is authoritative final visual proof. Generated output is inspected before build. `90_Studio_Export.*` remains generated, `95_UserEvents.*` remains preservation-merged, and Standard Canvas Keyboard ownership remains separate from the private System Runtime keyboard.
- **Proven result:** The final Canvas and P4 whole-screen comparison completed with the active graphite/orange semantic theme aligned. Runtime APIs and hooks were preserved, output-only controls remained hook-free, and hardware interaction was proven for Number Input, Select, Switch, Checkbox and Radio within the observed scope. No crash occurred after interaction.

## FORGEUI_STANDARD_LVGL_CANVAS_TABVIEW_TILEVIEW_LINE_TEXT_HEADING_WIFI_PARITY__SHARED_PREVIEWS__SEMANTIC_THEME__LINE_ENDPOINTS__READY_FOR_P4_PROOF__2026-07-29

- **What changed:** Standard Canvas, TabView, TileView, Text, Heading, Line and Wi-Fi adopted shared Canvas / Browser Preview renderers where practical. At this milestone TileView still used the earlier simultaneous visible `2 × 2` panel; the current native swipe-page architecture and physical proof are documented above. Standard Line gained persisted editable endpoints, and Text/Heading/Line/Wi-Fi parity was aligned.
- **Why it changed:** Duplicated preview implementations had drifted from generated LVGL; Canvas discarded configured artwork; TabView and TileView preview selection did not follow serialized startup state; TileView generated selection did not synchronize checked visual state; Text and Heading allowed legacy literal-colour paths to bypass the semantic theme; Line was fixed to `(0,0) -> (width,height)` and used a legacy border-colour path; Wi-Fi wording, wrapping and clipping regressed; and Browser Preview typography and alignment had drifted from generated LVGL/P4 presentation.
- **Final architecture at this milestone:** Canvas and Browser Preview shared Standard renderers while generated LVGL remained the firmware implementation. TileView's retained active column/row semantics survived its subsequent migration to native `lv_tileview_create()` / `lv_tileview_add_tile()` paging.
- **Proven result:** The automated parity evidence recorded here remains valid. TileView subsequently completed ESP32-P4 physical proof and is **PROVEN**; the other group members retain their separately documented evidence levels.

## FORGEUI_STANDARD_LVGL_THEME_PARITY__ELEVEN_COMPONENTS__CANVAS_BROWSER_GENERATED_LVGL_ESP32P4_PROVEN__2026-07-29

- **What changed:** Unified the semantic theme engine across Canvas, Browser Preview and LVGL export for Led, Bar, Arc, Chart, Table, Keyboard, Calendar, Scale, Roller, MsgBox and ButtonMatrix; completed Chart Y-axis numeric labels and X-axis point-index labels; and verified custom palette export.
- **Why it changed:** The selected Studio theme needed to remain authoritative through authoring, preview, generation and the flashed device, while Standard controls retained their native LVGL interaction and existing developer contracts.
- **Final architecture:** Selected themes resolve into shared semantic roles consumed by Canvas, Browser Preview, Code Preview and generated LVGL. Generated firmware reproduces that styling after Generate -> Build -> Flash. Deterministic graphite fallback remains available, status colours may remain semantically independent, and runtime hot theme switching is intentionally absent.
- **Proven result:** Canvas parity, Browser Preview parity, generated LVGL parity and physical ESP32-P4 parity are complete for the eleven named components across Graphite/orange, Cyber teal and Nordic light. Chart axes, custom palette export, runtime APIs, hooks and silent startup are preserved. Focused regressions reached 158/158, TypeScript and `git diff --check` passed, and ESP-IDF 5.5.4 / LVGL 9.2.2 firmware was generated, built, flashed and physically reviewed.

## FORGEUI_STANDARD_LVGL_RUNTIME_V1__DEVELOPER_API_SURFACE__INTERACTIVE_OUTPUT_PRESENTATION_CLASSIFICATION__ARCHITECTURE_COMPLETE__2026-07-29

- **What changed:** Added Standard Runtime APIs and Preview parity for Input,
  Textarea, Switch, Checkbox, Radio, Progress, NumberInput, Select, Image, Box,
  IconButton and Slider; classified Divider as intentionally API-free
  presentation; preserved Button, Text, Heading and Clock as serialized
  presentation; and expanded deterministic collision handling,
  live/standalone generation and user-hook preservation coverage.
- **Why it changed:** Exported projects needed a consistent developer-facing SDK for application-to-UI control and genuine UI-to-application events. Components needed runtime APIs only where meaningful state exists, presentation conveniences required explicit API-free decisions, and Canvas interactive controls required preview interaction without breaking movement or mutating project JSON.
- **Final architecture:** Interactive controls use retained objects/state, guarded silent setters and genuine-user hooks. Output controls expose setters only. Presentation-only components expose no runtime API. `90_Studio_Export.*` remains generated; live `95_UserEvents.*` remains preservation-merged and standalone copies become developer-owned. Canvas and Browser Preview share component previews where required, while generated LVGL retains component-specific native semantics.
- **Proven result:** The complete exporter regression reached 212/212, Canvas regression reached 51/51, generated API/preservation tests reached 33/33, focused component suites passed, and TypeScript, syntax and diff checks passed. One unrelated full export-server fixture failure remains possible when the two recorded default-theme C assets are missing. No blanket physical ESP32-P4 proof is claimed for the newly completed Standard Runtime set.

## FORGEUI_STANDARD_LVGL_RUNTIME_APIS__TABVIEW_TILEVIEW__TEXT_COMPONENT_PROPERTIES__CLOCK_PRESENTATION__ARCHITECTURE_COMPLETE__2026-07-29

- **What changed:** Added TabView active-index runtime, Tileview active-coordinate runtime, Button Text, Text Value, Heading Text and Clock Presentation configuration; fixed independent retained ownership for multiple Clocks; retained Scale and Line as intentionally API-free.
- **Why it changed:** Standard components required meaningful developer control only where genuine semantic state exists, visible text placeholders needed real persisted editor properties, Clock needed configurable presentation without serializing runtime time, and multiple Clocks required independent retained state.
- **Final architecture:** Semantic state receives retained runtime APIs and hooks; static visible content receives serialized Inspector, Preview and export properties; runtime time remains RTC-owned; API-free visuals remain API-free; all live and standalone generation uses the shared exporter; and `95_UserEvents` remains preservation-merged.
- **Proven result:** This save point originally recorded automated evidence only. TabView and TileView subsequently completed their separately documented ESP32-P4 physical proof.

## FORGEUI_STANDARD_LVGL_RUNTIME_APIS__LED_BAR_ARC_CHART_KEYBOARD_CALENDAR_ROLLER_MESSAGE_BOX_BUTTON_MATRIX__LIVE_AND_STANDALONE_PROVEN__2026-07-29

- **What changed:** Added retained runtime objects/state, public `90_Studio_Export` APIs and preservation-merged `95_UserEvents` hooks for the standard LED, Bar, Arc, Chart, Keyboard, Calendar, Roller, Message Box and Button Matrix; Scale was inspected and deliberately remained API-free.
- **Why it changed:** Standard LVGL Canvas components rendered correctly but lacked a consistent, supported developer control surface in real generated firmware.
- **Final architecture:** The shared LVGL exporter generates deterministic per-instance APIs, private runtime state, transition helpers and hooks for both live `/export` and standalone `/export-idf-project`; live hook files preserve matching developer bodies and append only missing generated hooks.
- **Proven result:** Focused component and server preservation tests, TypeScript validation, both export paths and ESP-IDF 5.5.4 firmware builds passed. Generated firmware was not manually patched. Keyboard hardware interaction and blanket physical touch validation are not claimed by this save point.

## FORGEUI_SYSTEM_RUNTIME__LAZY_SD_STORAGE_BROWSER__SAFE_RUNTIME__DELETE_EMPTY_FOLDER__ESP32P4_PROVEN__READY_FOR_CANVAS_PREVIEW_PARITY__2026-07-28

- **What changed:** Added the lazy Storage Runtime, SD browser, paging, Refresh, Read / Write Test, Select Item mode and Delete Empty Folder; removed the unstable recursive delete and full-format workflow.
- **Why it changed:** The large eager Storage runtime caused boot instability, so Storage was redesigned around lazy construction and bounded runtime structures.
- **Final architecture:** A lazy System Runtime page uses a deferred worker, small request model, eight reusable rows and safe backend ownership while Hosted Wi-Fi remains unchanged.
- **Proven result:** Stable ESP32-P4 boot and Storage Runtime, SD browsing, folder navigation, Refresh, Read / Write Test and empty-folder deletion are physically proven with Hosted Wi-Fi and SD coexistence.

## FORGEUI_SYSTEM_RUNTIME__COMPLETE_WIFI_MANAGER__NATIVE_LVGL_KEYBOARD__HOSTED_CONNECTIVITY__ESP32P4_PROVEN__READY_FOR_WIFI_UI_POLISH__2026-07-27

- **What changed:** Completed the Hosted scan pipeline, repaired Hosted scan result transfer, added live Available Networks population, made Refresh perform a real Hosted scan, established a stable reusable Wi-Fi Manager runtime and physically validated it on the ESP32-P4.
- **Why it changed:** Native asynchronous assumptions were unsuitable for the Hosted transport.
- **Final architecture:** A dedicated Hosted scan pipeline owns scanning and AP retrieval, atomically replaces the runtime network model, and leaves LVGL presentation-only.
- **Proven result:** The physical ESP32-P4 shows live nearby SSIDs, RSSI, security, Connected and Saved state, the complete connection workflow and repeated scan replacement without stale entries.

## FORGEUI_WIFI_MANAGER__NATIVE_LVGL_KEYBOARD__BROWSER_PREVIEW_PARITY__PHYSICAL_ESP32P4_PROVEN__2026-07-27

- **What changed:** Completed the built-in Wi-Fi Manager across Browser Preview and generated LVGL, including Scan Networks, Refresh, SSID selection, live RSSI, Connected and Saved state display, password and forget dialogs, Connect, Disconnect, Reconnect, Forget Network and connected details; added a lazily created reusable native LVGL keyboard with top-layer ownership, textarea attachment, password entry, show/hide, Done and Cancel; and completed the associated runtime performance optimisation.
- **Why it changed:** The physically operational Hosted backend needed a complete reusable System Runtime workflow with responsive interaction, correct embedded text entry and Browser Preview parity rather than remaining a backend demonstration.
- **Final architecture:** The generated System Runtime owns the Wi-Fi Manager page, dialogs, connected details and one reusable native LVGL keyboard, while the existing Hosted Connectivity Runtime continues to own ESP-Hosted, Wi-Fi Remote, the ESP32-C6 and SDIO Slot 1. Shared typed System state supplies Browser Preview parity without moving Wi-Fi behavior into Interactive Assets or generated user callbacks.
- **Proven result:** The complete Wi-Fi interaction workflow, native keyboard geometry and behavior, Hosted-backed live data, connected details, Browser Preview parity and performance-optimised physical UI were validated on the ESP32-P4. Minor visual polish remains.

## FORGEUI_SYSTEM_INTERFACE__HOSTED_WIFI_SD_RECOVERY__SDIO_SLOT1_RESTORED__PHYSICAL_ESP32P4_PROVEN__2026-07-27

- **What changed:** Recovered the original ForgeUI-P4 Hosted Wi-Fi architecture by restoring the ESP32-P4-to-ESP32-C6 ESP-Hosted SDIO transport on SDMMC Slot 1, documented the unchanged SD Card runtime on SDMMC Slot 0, and recorded the physically proven boot order and configuration baseline.
- **Why it changed:** The previous SPI Hosted configuration did not match this hardware and prevented the Hosted transport from establishing.
- **Final architecture:** Hosted Wi-Fi uses the SDIO Host Interface, 4-bit SDMMC Slot 1 and its dedicated GPIO/reset baseline; the SD Card continues unchanged on BSP GPIO39–44 using 4-bit SDMMC Slot 0, manual LDO control and FAT. The System Runtime exposes the operational Wi-Fi backend independently of Interactive Assets.
- **Proven result:** ESP32-C6 identification, active Hosted transport, station startup, MAC read, automatic reconnect, DHCP and Wi-Fi connection were physically validated together with successful SD mount and write/read testing. Wi-Fi and SD operated simultaneously. The complete Hosted scan and Wi-Fi Manager workflow was proven at the later System Runtime save point above.

## FORGEUI_SYSTEM_INTERFACE__LVGL_RUNTIME__DISPLAY_BRIGHTNESS__ESP32P4_PROVEN__2026-07-27

- **What changed:** Introduced the built-in System Interface across Studio, Browser Preview and generated LVGL; implemented the System Launcher and Display / Brightness page; connected live brightness to the physical ESP32-P4 backlight.
- **Why it changed:** Device-level platform functions needed a reusable home that remains separate from user project screens, Interactive Assets and generated user callbacks.
- **Final architecture:** Shared typed System state drives Studio and Browser Preview, while generated LVGL keeps persistent application, System launcher and Brightness containers and navigates through immediate visibility switching. The Brightness slider calls `bsp_display_brightness_set()` through an internal clamped wrapper.
- **Proven result:** Studio, Browser Preview, LVGL and physical ESP32-P4 parity are achieved for the current System hierarchy; live backlight control and return navigation are proven, existing Interactive Assets remain alive, and the framework is ready for future Wi-Fi, Bluetooth, Audio, Storage, Device and Diagnostics pages without claiming those services are implemented.

## FORGEUI_INTERACTIVE_ASSETS__COMPLETE_WORKFLOW_PARITY__SHARED_VISIBLE_BOUNDS__CONTAIN_FIT_SCALING__READY_FOR_FEATURE_REVIEW__2026-07-27

- **What changed:** Completed Browser Preview geometry parity and shared contain-fit rendering, removed the legacy Status Indicator LVGL export path, and moved both Binary Output types onto one exported geometry implementation. Interactive Status Indicator now matches Canvas, Browser Preview and ESP32-P4.
- **Why it changed:** Eliminate the remaining visual inconsistencies between Studio previews and generated firmware.
- **Final architecture:** All five Interactive Assets now share one post-placement geometry model across Canvas, Browser Preview and generated LVGL while preserving their existing runtime behaviour.
- **Proven result:** Geometry parity is confirmed on the physical ESP32-P4, automated regressions are expanded, and the existing runtime families remain unchanged.

## FORGEUI_ALL_FIVE_INTERACTIVE_ASSETS__CONFIGURED_INSPECTOR_PARITY__SHARED_SELECTION_BORDER_RESIZE__VISIBLE_ARTWORK_FITTING__LVGL_CONTAIN_SCALING__ESP32P4_PROVEN__2026-07-27

- **What changed:** Completed configured Inspector, exact Creator reopening, shared selection-border resize, registry-driven preview refresh, visible-artwork fitting, continuous preview scaling, and generated contain-fit scaling across Toggle Switch, Status Indicator, and Three-Position Toggle, completing parity with Button and Light.
- **Why it changed:** Every Interactive Asset needed the same predictable post-placement workflow and Canvas-to-hardware geometry model without changing its established runtime contract.
- **Final architecture:** Two-state assets reuse shared stable union fitting, Three-Position uses the compatible three-state union path, Canvas components own final geometry, and the single LVGL exporter emits centred common-scale child images while each runtime family retains its existing state, callback, and setter semantics.
- **Proven result:** All five Interactive Assets now share one polished Studio workflow; existing input/output runtime behaviour remains intact, automated regressions pass, and current physical ESP32-P4 checks remain stable within the recorded scope.

## FORGEUI_INTERACTIVE_BUTTON_AND_LIGHT__WORKFLOW_POLISH__SHARED_VISIBLE_BOUNDS__CANVAS_RESIZE__LVGL_PARITY__ESP32P4_VALIDATED__2026-07-26

- **What changed:** Completed Button and Light creation, Inspector, registry-refresh, shared selection-border resize and visible-artwork fitting polish; added stable two-state union crops, linked fitted assets, legacy dimension recovery and centred contain-fit LVGL scaling.
- **Why it changed:** Reusable artwork needed predictable new-asset workflow, actionable callback diagnostics, geometry-preserving assignment, direct Canvas resizing, immediate preview replacement and physical output that matched Canvas and Browser Preview.
- **Final architecture:** Interactive Assets retain artwork and state ownership while placed components own geometry; Button and Light reuse shared resize, clamping, alpha measurement, two-state visible-bounds and linked-crop infrastructure, and export resolves image dimensions through registry metadata, PNG IHDR and LVGL descriptors.
- **Proven result:** Button and Light resizing, fitting, state changes and generated scaling match Canvas, Browser Preview and the physical ESP32-P4 while original uploads, persistence, public APIs and existing runtime behaviour remain intact.

## FORGEUI_ALL_FIVE_DIRECT_CREATORS__THREE_POSITION_STATE_SHEET__LINKED_CROPS__STATUS_INDICATOR_POLISH__KEYBOARD_PARITY__ESP32P4_PROVEN__2026-07-26

- **What changed:** Completed direct Creator coverage with Interactive Light, Three-Position and Status Indicator; added the Status Indicator responsive placeholder, `120 × 72` default drop size, corrected Interactive-tab navigation, aspect-ratio-preserving contain-fit preview and temporary local OFF / ON Canvas preview toggle; also added `Create Three-Position Toggle Set`, one-master State Sheet generation, linked crops, atomic registration, and corrected LVGL keyboard geometry.
- **Why it changed:** Visual controls needed safe component-to-Creator editing, immediately usable Canvas bounds, undistorted preview artwork, consistent multi-state generation, reliable crop conversion, and closer Studio-to-P4 keyboard parity.
- **Final architecture:** All five Interactive Assets open type-scoped drafts from Canvas and Inspector; Status Indicator requests are consumed in the Interactive tab and retain the shared Binary Output Runtime, while one Three-Position master feeds linked LEFT/CENTER/RIGHT crops before atomic registry mutation.
- **Proven result:** Status Indicator now has complete Creator-family and polished local preview behavior without changing its non-clickable physical output contract; Three-Position artwork, touch zones, callback states and the corrected keyboard remain proven on ESP32-P4.

## FORGEUI_INTERACTIVE_ASSET_FRAMEWORK_V1__BUTTON_AND_LIGHT__UNIFIED_UI_FLOW__PHYSICAL_ESP32P4_PROVEN

- **What changed:** Unified Interactive Button and Interactive Light creation under one framework-level UI flow while preserving separate type-specific models and behavior.
- **Why it changed:** The second Interactive Asset type needed to prove the architecture was reusable and the Studio needed one coherent creation entry point.
- **Final architecture:** Shared identity, registry, persistence, AI generation, Canvas assignment, and export infrastructure coordinate discriminated Button and Light implementations.
- **Proven result:** Both types passed Studio, export, ESP-IDF, and physical ESP32-P4 runtime validation, including Button touch hooks and the non-clickable Light public setter.

## FORGEUI_V2_4_1__AI_ARTWORK_NATIVE_PIPELINE__MULTI_MODE_IMAGE_PREPROCESSOR__PHYSICAL_ESP32P4_PROVEN__2026-07-17

- **What changed:** Added independent preprocessing modes for hero backgrounds, artwork, icons, normal images and Interactive Button assets.
- **Why it changed:** Artwork and icons were incorrectly passing through the full-screen hero crop-and-resize path.
- **Final architecture:** All image sources share the upload and LVGL conversion pipeline, with `assetMode` selecting the appropriate Python preprocessing branch.
- **Proven result:** Native artwork and hero behavior were physically validated on ESP32-P4 with Canvas and Preview parity.

## FORGEUI_THEME_MANAGER_POLISH_PROVEN__INDUSTRIAL_DASHBOARD_LAYOUT_PROVEN__ADVANCED_WIDGETS_NEXT__2026-07-17

- **What changed:** Polished Theme Manager asset presentation and validated an industrial dashboard layout.
- **Why it changed:** Hero backgrounds and compact uploaded icons required different presentation rules.
- **Final architecture:** Theme palettes, hero backgrounds and uploaded LVGL icon assets remain distinct asset classes inside the extracted Theme Manager.
- **Proven result:** Large hero previews, compact centered icon cards and the industrial dashboard layout were proven.

## FORGEUI_THEME_MANAGER_REFACTOR__HERO_ICON_ASSET_SEPARATION__HEADER_EXTRACTION__POLISH_AND_TEST_NEXT__2026-07-17

- **What changed:** Extracted Theme Manager from `Header.tsx` and separated hero and icon asset handling.
- **Why it changed:** Header-owned theme UI had become too large and applied hero-oriented rendering to unrelated assets.
- **Final architecture:** `ForgeUIThemeManager.tsx` owns theme-management UI while Header opens and coordinates it.
- **Proven result:** Extraction and asset classification worked without changing shared theme state.

## FORGEUI_V2_3_12__AI_LAYOUT_PROMPT_HELPER_V1__VISUAL_PROMPT_BUILDER__GUIDED_LAYOUT_GENERATION__2026-07-17

- **What changed:** Added a visual prompt helper with dashboard, heading, section and status-icon controls.
- **Why it changed:** Users needed a guided way to form reliable layout prompts without memorizing prompt structure.
- **Final architecture:** The helper composes text for the existing AI layout pipeline rather than introducing another generator.
- **Proven result:** Guided prompts generated layouts through the established parser, validator and Canvas insertion path.

## FORGEUI_V2_3_11__AI_ICON_NATIVE_SIZE_PIPELINE__ICON_PREPROCESSOR_MODE_SPLIT__ESP32P4_PHYSICAL_VALIDATION__2026-07-17

- **What changed:** Added icon-specific preprocessing that preserves native image dimensions.
- **Why it changed:** Icons were being expanded by the hero preprocessor, producing incorrect white-square assets on hardware.
- **Final architecture:** Icons use the shared asset pipeline with `icon` mode; hero preprocessing remains unchanged.
- **Proven result:** Wi-Fi, battery and clock icons matched across Canvas, Preview and physical ESP32-P4.

## FORGEUI_V2_3_10__FIRMWARE_MAINTENANCE__STUDIO_POLISH__THEME_MANAGER_REFRESH__FLASH_CONSOLE_UX__2026-07-16

- **What changed:** Completed the two-level maintenance workflow and refined Theme Manager and flash-console UX.
- **Why it changed:** Fast generated-source repair and full workspace cleanup serve different recovery needs.
- **Final architecture:** Clean Firmware resets generated source metadata; Firmware Maintenance performs the broader generated-workspace sweep.
- **Proven result:** Both maintenance paths, refreshed theme state and embedded flash feedback were validated.

## FORGEUI_V2_3_10__FIRMWARE_MAINTENANCE__CLEAN_GENERATED_FIRMWARE__WORKSPACE_MAINTENANCE__2026-07-16

- **What changed:** Split firmware maintenance into targeted generated-file repair and full generated-workspace cleanup.
- **Why it changed:** A single destructive reset was unnecessary for routine CMake or Studio-export drift.
- **Final architecture:** The lightweight path rebuilds `CMakeLists.txt` and `90_Studio_Export.*`; the full path also clears generated assets, upload cache and build output.
- **Proven result:** The maintenance menu reliably restored clean generated baselines at both levels.

## FORGEUI_V2_3_9__FIRMWARE_SWEEP_PROVEN__FACTORY_RESET__DETERMINISTIC_FIRMWARE_PIPELINE__2026-07-16

- **What changed:** Added deterministic firmware sweep and factory-reset behavior.
- **Why it changed:** Stale generated assets, declarations, CMake sources and build artifacts could survive between projects.
- **Final architecture:** One controlled sweep clears generated firmware state, recreates baseline files and lets the normal exporter regenerate the active project.
- **Proven result:** Factory reset, regeneration, clean build and physical firmware validation succeeded.

## FORGEUI_AI_SEMANTIC_ICON_RESOLVER__PROMPT_AWARE_REGISTRY_SEARCH__AUTOMATIC_ICON_ASSET_PIPELINE__CANVAS_PREVIEW_PROVEN__2026-07-15

- **What changed:** Added semantic resolution from natural-language icon intent to ForgeUI icon assets.
- **Why it changed:** AI users should not need registry names, filenames, asset IDs or LVGL symbols.
- **Final architecture:** Prompt intent is resolved through registry search and the existing upload/conversion pipeline before components enter the Canvas.
- **Proven result:** Wi-Fi, battery and clock requests produced real assets with Canvas and Preview parity.

## FORGEUI_AI_STUDIO_V2_3_3__DEVICE_AWARE_HERO_IMPORT_PIPELINE__1024X600_NATIVE_ASSETS__CANVAS_PREVIEW_P4_PARITY__2026-07-13

- **What changed:** Added device-aware hero preprocessing for generated and uploaded backgrounds.
- **Why it changed:** Original-size images did not reliably match the active 1024x600 display.
- **Final architecture:** Hero images are center-cropped to the device aspect ratio, resized, persisted and converted into native LVGL assets.
- **Proven result:** Canvas, Preview and physical ESP32-P4 displayed the same 1024x600 hero composition.

## FORGEUI_AI_STUDIO_V2_3_0__AI_HERO_ASSET_PIPELINE__BUILDER_THEME_PREVIEW_UNIFIED__LVGL_READY__2026-07-13

- **What changed:** Promoted AI hero output from temporary preview data to reusable ForgeUI assets.
- **Why it changed:** Generated artwork needed to persist, participate in themes and export to firmware.
- **Final architecture:** AI hero generation feeds the uploaded-asset registry, Theme Manager, Canvas, Preview and LVGL export through one asset record.
- **Proven result:** The selected hero persisted and exported as an LVGL-ready firmware asset.

## FORGEUI_AI_STUDIO_V2_2__LIVE_GPT_LAYOUT_AND_AI_HERO_BACKGROUND_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-13

- **What changed:** Added live AI hero-background generation alongside the proven AI layout workflow.
- **Why it changed:** ForgeUI needed both structural UI generation and visual background generation.
- **Final architecture:** Layout AI produces validated component documents while Hero AI produces images; both converge on the existing builder and export systems.
- **Proven result:** AI layouts and hero backgrounds reached the browser workflow and physical ESP32-P4.

## FORGEUI_AI_STUDIO_V2__MODERN_WORKSPACE__LIVE_GPT_LAYOUT_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-12

- **What changed:** Introduced the AI Studio workspace for live natural-language layout generation.
- **Why it changed:** The earlier AI engine required a usable Studio surface for prompting, review and Canvas insertion.
- **Final architecture:** AI requests return a validated layout document that is resolved and inserted through normal component actions.
- **Proven result:** Prompt-generated layouts rendered in Builder, Preview and exported firmware on ESP32-P4.

## FORGEUI_AI_ENGINE_V2__LIVE_GPT_TO_PHYSICAL_ESP32P4_PIPELINE_PROVEN__2026-07-12

- **What changed:** Established the first end-to-end GPT layout pipeline.
- **Why it changed:** Natural-language generation needed to reuse ForgeUI components rather than bypass the builder.
- **Final architecture:** Prompt, API, parser, validation, component insertion, LVGL export, ESP-IDF and physical runtime form one pipeline.
- **Proven result:** A live GPT-generated interface was built, flashed and displayed on ESP32-P4.

# About the Creator

Hi, I'm **Scott Forster** from New Zealand.

ForgeUI Studio began as a personal project to make embedded HMI development easier, faster and more enjoyable. As someone who enjoys solving real engineering problems, I wanted a tool that could take an idea from a simple prompt all the way through to a working interface running on physical ESP32 hardware.

Every feature in ForgeUI is developed with a simple philosophy:

> **Build it. Prove it. Flash it. Improve it.**

The project has grown into an open-source AI-assisted embedded UI platform combining visual design, AI-powered generation, LVGL and ESP-IDF into a single workflow.

ForgeUI is built in collaboration with ChatGPT, which has been an invaluable coding assistant, sounding board and development partner throughout the project. While I design the architecture, test the hardware and drive the vision, ChatGPT has helped accelerate development by assisting with implementation, refactoring and documentation.

This project is shared with the community in the hope that it makes embedded development more accessible and inspires others to build amazing products.

I welcome feedback, ideas and contributions from developers around the world.

---

**Scott Forster**  
Creator & Lead Developer — ForgeUI Studio

📧 **forgeui.esp32@gmail.com**
## 2026-08-01 — Fi Icon Runtime physical proof complete

Standard Icon now has a generic per-instance runtime foundation. The canonical
icon pipeline remains authoritative; component names allocate collision-safe
`Visible`, `Opacity` and `Color` APIs in regenerated `96_FiRuntime.c/.h`, while
optional click behavior attaches in 90 and preservation-merges its hook in 95.
Runtime API defaults on, click defaults off, and unused runtime files/assets are
gated out. The overall status is **PROVEN ON ESP32-P4** and contributes to the
completed 39/39 proof total. Physical ESP32-P4
evidence proves the 90 → 95 click path: three click-enabled instances emitted
exactly one separate collision-safe callback per deliberate tap, no callback at
startup, and SD remained ready. The unrelated Wi-Fi failure during the run is
not Fi click evidence. Batch D subsequently proved the 90 → 96 presentation
path and Standalone parity, so Icon and Fi Runtime are fully **PROVEN**. See
[`09_FORGEUI_FI_RUNTIME_GUIDE.md`](09_FORGEUI_FI_RUNTIME_GUIDE.md).

The living post-export reference for ForgeUI Native Component semantic APIs,
UserEvents, ownership and task safety is
[`10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md`](10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md).
