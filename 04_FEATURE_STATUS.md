# 04_FEATURE_STATUS.md

## Device Console status — 2026-08-11

| Capability | Status | Evidence boundary |
|---|---|---|
| Studio-wide Device Console shell/dock | **PROVEN** | Collapsible/resizable bottom dock physically reviewed in the ESP32-P4 workflow; Widgets, Canvas, and Inspector remain contained above it |
| BUILD console integration | **PROVEN** | Existing ESP-IDF Build & Flash and Clean Build & Flash output, physical flash, and board reset confirmed |
| Live Serial Monitor | **PROVEN** | Backend-owned COM5 connection at 115200 and live ESP32-P4 raw serial output displayed inside Studio |
| Safe serial/flash COM handoff | **PROVEN** | Monitor release before flashing and previous-port reconnection after successful flash verified without changing the proven ESP-IDF commands |
| Read-only I/O View | **IMPLEMENTED / TESTED** | Shared raw serial source, explicit-pattern parser, bounded/latest-state behavior, empty/error states, and regression tests; live I/O-view physical proof not yet recorded |
| Structured ForgeUI telemetry protocol | **FUTURE / NOT IMPLEMENTED** | No firmware telemetry protocol exists; I/O currently interprets explicit existing log text only |

See [ForgeUI Device Console](docs/FORGEUI_DEVICE_CONSOLE.md) for usage, ownership boundaries, troubleshooting, and exact proof wording.

## Hardware Examples physical proof — 2026-08-10

- Hardware Example 01 — GPIO Digital I/O: **PHYSICALLY PROVEN**.
- Hardware Example 02 — I²C FRAM Persistence: **PHYSICALLY PROVEN / CLOSED**. MB85RC256V Device-ID `00 A5 10` verified at `0x50`; write/read passed; counter `9` / value `0xA553` persisted across a complete power cycle.
- Hardware Example 03 — SPI NFC/RFID: **PHYSICALLY PROVEN / CLOSED**. PN532 identity (`IC=0x32`, firmware `1.6`), SAMConfig, ISO14443A polling, stable UID `04:8D:E6:5F:B7:2A:81`, card removal and held-card de-duplication were proven on the real ESP32-P4.
- Hardware Example 04 — Online Services — Live Weather: **PHYSICALLY PROVEN / CLOSED** on the stock Waveshare 7B and stock C6 through standalone export and the real Studio Build & Flash workflow. Association, DHCP, DNS, the complete TLS certificate record, certificate validation, HTTP 200, Open-Meteo current and forecast data, generated semantic UI updates, live Fi icons, SNTP/local Tauranga time and dynamic local backgrounds passed. Live fields include current/apparent temperature, humidity, wind, rain, UV, weather code, day/night, date/time and forecast days/highs/lows. Tauranga is the current example configuration; automatic location detection is not claimed.
- Hardware Example 05 — GPS / GNSS: **PHYSICALLY PROVEN** on the Waveshare 7B with a u-blox NEO-8 and ESP-IDF 5.5.4. Full-duplex UART1 on GPIO3 RX / GPIO4 TX at 9600 8N1 proved UART RX, checksum-valid NMEA, 3D fix with 12 satellites observed, latitude/longitude, altitude, speed, HDOP, UTC, UART TX, a read-only UBX-MON-VER request and checksum-valid response, generated Studio UI live updates, standalone export, and the real Build & Flash workflow. This proof does not claim mapping, navigation, routing, production vehicle navigation, or persistent UBX configuration. Public reference: `RTechAI/ForgeUI-P4-UART-GPS-GNSS`, release `v1.0.0`.
- Selection is exclusive: implementation files remain preserved, while only the selected example is generated, linked, initialized and polled.
- Studio presents all five examples through the same compact **Load Example** and **Guide** actions, ordered Example 01, Example 02, Example 03, Example 04 — Online Services / Live Weather, and Example 05 — GPS / GNSS.

The Waveshare 7B ESP32-P4 Wi-Fi/HTTPS connected runtime is **PHYSICALLY PROVEN**. Its authoritative architecture and evidence scope are in [`12_FORGEUI_ESP32P4_WIFI_HOSTED_ARCHITECTURE.md`](12_FORGEUI_ESP32P4_WIFI_HOSTED_ARCHITECTURE.md).

The reusable Weather Background Pack contains seventeen Studio-owned images. Weather 04 dynamically depends on exactly ten; seven are manual/future choices and are not compiled into this example. Minor visual polish may remain, but it does not downgrade the proven networking, data, export, icon, background or stable-runtime result.

## Current certification — 2026-08-07

**ESP32-P4 EXPORTED AND FLASHED — INITIAL PHYSICAL VALIDATION COMPLETE**

- Practical LVGL 9.2: **44 / 44 PROVEN on ESP32-P4**. Lottie remains intentionally excluded.
- Native Components: **14 current; Dashboard Card through Trend Chart Pro PROVEN; Alarm Panel, IO Monitor, Battery Card, Tank Level Card, Network Status Card, Device Summary Card, KPI Card, and Power Flow Card HARDWARE VALIDATED**.
- Battery Card: **HARDWARE VALIDATED**; intentionally read-only with no UserEvents.
- Tank Level Card: **HARDWARE VALIDATED**; intentionally display-only with no UserEvents.
- Network Status Card: **HARDWARE VALIDATED**; read-only live Wi-Fi monitoring with no UserEvents.
- Deferred without change: the Hardware I/O Proof Program, 32 MB physical flash versus 16 MB binary-header warning, GPIO32 LEDC display-startup warning, and further export infrastructure.

| Native Component | Current status | Certified scope |
|---|---|---|
| Dashboard Card | **PROVEN** | Browser Preview, Live Studio, Standalone Export, Runtime SDK, UserEvents, ESP32-P4 |
| Sensor Tile | **PROVEN** | Semantic engineering display, isolated instances, Runtime SDK/UserEvents, ESP32-P4 |
| Relay Panel | **PROVEN** | Channel/master interaction, isolated instances, Runtime SDK/UserEvents, ESP32-P4 |
| PWM Controller | **PROVEN** | Value/enable interaction, isolated instances, Runtime SDK/UserEvents, ESP32-P4 |
| Trend Chart | **PROVEN** | Lightweight technical trend, rolling history, time axis, thresholds, runtime updates, all preview/export paths, ESP32-P4 |
| Trend Chart Pro | **PROVEN** | Separate premium engineering trend, bounded history, header/units, trace/glow/fill/marker/grid/bands, transition UserEvents, all preview/export paths, ESP32-P4 |
| Alarm Panel | **HARDWARE VALIDATED** | Studio insertion, per-alarm editing/persistence, Browser Preview, repaired LVGL layout, fresh standalone export, ESP-IDF build, flash, and correct physical rendering confirmed; extended runtime transition/callback proof deferred |
| IO Monitor | **HARDWARE VALIDATED** | Read-only digital/analogue input/output monitoring; Inspector, Browser Preview, standalone export, ESP-IDF 5.5.4 build, ESP32-P4 flash, and correct physical rendering confirmed; no touch/UserEvents contract |
| Battery Card | **HARDWARE VALIDATED** | Read-only monitoring; seven silent persisted-ID setters; rename stability and duplicate isolation; Browser/Live/generated LVGL parity; battery icon, spacing/padding, and metric-tile parity; ESP-IDF 5.5.4 build, flash, and physical rendering; no exhaustive physical Runtime SDK interaction proof claimed |
| Tank Level Card | **HARDWARE VALIDATED** | Read-only monitoring; six silent persisted-ID setters; rename stability and duplicate isolation; Studio, Inspector, Browser Preview, Live Studio, generated LVGL, ESP-IDF build, flash, physical rendering, and Browser/Live/Export parity; no UserEvents |
| Network Status Card | **HARDWARE VALIDATED** | Read-only monitoring; six silent persisted-ID setters; rename stability and duplicate isolation; Studio/Browser/Live/LVGL parity; live disconnected/connected, SSID, DHCP IPv4, RSSI-derived signal, and Online/Offline projection physically confirmed on ESP32-P4 without opening the System Wi-Fi Manager; no UserEvents |
| Device Summary Card | **HARDWARE VALIDATED** | Monitoring-only device identity, status, uptime, firmware, network, and storage summary; six silent persisted-ID setters; duplicate isolation; Studio/Browser/Live/LVGL parity; 240 x 145 default and 220 x 128 minimum; correct physical ESP32-P4 rendering in the four-card dashboard; no UserEvents |
| KPI Card | **HARDWARE VALIDATED** | Generic monitoring-only KPI value, unit, context, trend, target, and semantic status; seven silent persisted-ID setters; duplicate isolation; Studio/Browser/Live/LVGL parity; compact 240 x 145 physical ESP32-P4 proof; 220 x 128 minimum; no UserEvents |
| Power Flow Card | **HARDWARE VALIDATED** | Bounded Grid/Solar/Battery/Load topology; visible static directions and readable node values; seven silent persisted-ID setters; duplicate isolation and rename stability; Studio/Browser/Live/LVGL parity; 240 x 145 default and 220 x 128 minimum; correct physical ESP32-P4 rendering; zero UserEvents |

Trend Chart Pro does not replace Trend Chart. Certification also removed the
partial-history tail artifact and unwanted LVGL point dots, placed threshold
helpers behind the live trace, and confirmed canonical callback contracts,
runtime refresh, persisted-ID stability, rename stability, and duplicate
isolation. Earlier status sections below are dated historical records where
they conflict with this current table.

## 2026-08-05 Trend Chart Pro

Trend Chart Pro is available as a separate ForgeUI Native Component. It provides a premium engineering-value header, anti-aliased Studio/browser trace, optional glow and fill, current marker, major grid, threshold presentation, auto/fixed scale, semantic Runtime SDK, and warning/alarm/recovered UserEvents. The existing Trend Chart remains unchanged. See `docs/FORGEUI_TREND_CHART_PRO.md`.

## 2026-08-02 Practical LVGL 9.2 completion

Current platform save point:
`FORGEUI_LVGL9_COMPLETE__44_OF_44_PRACTICAL_WIDGETS_PROVEN__ESP32P4_VALIDATED__DOCUMENTATION_COMPLETE__READY_FOR_NATIVE_FORGEUI_PLATFORM__2026-08-02`.

The authoritative practical LVGL status is **44 registered practical
widgets/components and 44 physically proven on ESP32-P4**. Window and Menu are
**PROVEN**. Lottie is intentionally excluded from the practical program.

Widget Registry architecture cleanup is complete at the metadata boundary:

- all 50 registered entries have explicit API, UserEvent, input,
  Interactive-Asset and child-ownership capabilities;
- metadata is aligned with generated `publicApiDeclarations` and
  `userEventHooks`;
- every `documentationId` resolves to an existing Markdown document;
- Spinbox and QR Code record their known LVGL configuration dependencies in
  preparation for future Registry-driven feature gating;
- Lottie, ObjxTempl and Editable remain quarantined; Span, AnimImage,
  ImageButton, Window and Menu are active registered widgets;
- Batch 2 Window proof promotion changes documentation status only; runtime,
  preview and generated API behavior remain unchanged.

- Board/profile ownership is registry-driven; the supported production profile is Waveshare ESP32-P4 WiFi6 Touch LCD 7B.
- Persisted project features hydrate after mount and generate `00_ForgeUI_Features.h`.
- External RTC hardware-profile control is **PHYSICALLY VALIDATED / PROVEN** on ESP32-P4. A fresh Standalone Export with Wi-Fi ON, SD ON and RTC OFF generated `FG_FEATURE_RTC 0`, made no DS3231 attach/read attempt and emitted no DS3231 unavailable/failure warning. The NVS/software fallback epoch loaded correctly while Wi-Fi, SD and normal runtime remained operational.
- `firmwareFeatures.rtc` is the authoritative persisted setting. Configure it at **ForgeUI Studio → Board: ESP32-P4 7B → Configure Hardware → Hardware Configuration → Optional Hardware → External RTC**; it is intentionally not part of the runtime System menu. Enabled mode retains DS3231 support at I2C `0x68` plus fallback behavior; Live Studio and Standalone Export inherit the project value; legacy projects missing the field normalize to `true`.
- Disabled System features are pruned from generated C, assets, CMake sources/components and `idf_component.yml`; they are not merely hidden.
- Diagnostics is implemented. Wi-Fi Manager and Storage UI/worker resources are created lazily and destroyed safely while their backends remain separately alive.
- Connected Application-page evidence records 45,795 bytes current internal free heap, a 27,648-byte largest block and 62 LVGL objects. Ten-cycle operator validation remains pending.
- QR Code displayed correctly on ESP32-P4 and was successfully scanned with a mobile phone. Live and Standalone output match. Status: **PROVEN**.
- Slider is physically proven through Studio, standalone ESP-IDF export, ESP32-P4 touch interaction, collision-safe runtime APIs and multiple instances. Status: **PROVEN**.
- Native Spinner is physically proven through Studio and standalone ESP-IDF export on ESP32-P4, including stable animation at approximately 60 FPS. Status: **PROVEN**.
- Native List is physically proven through Registry, Tray, Inspector, Canvas,
  Browser Preview, native LVGL export, `95_UserEvents`, feature gating, live
  ESP32-P4 firmware and Standalone Export. Controlled taps emitted exactly one
  callback each for `0` / `Overview`, `1` / `Settings` and `2` /
  `Diagnostics`; repeated taps remained stable. Status:
  **LIST — PROVEN ON ESP32-P4**.
- Native Spinbox is physically proven through Registry, Tray, Canvas,
  Inspector, Browser Preview, native LVGL export, Runtime SDK, `95_UserEvents`,
  export-time feature gating, live Studio firmware, ESP32-P4 touch and
  Standalone Export. Status: **PROVEN**.
- The built firmware contains the compact FPS/RAM overlay, but current managed LVGL source does not reproduce it. Status: implemented in the flashed artifact, durability repair required.

This document records implementation and proof status only.

## ForgeUI Native Components

Current platform milestone:
`FORGEUI_NATIVE_COMPONENT_3__RELAY_PANEL_PROVEN__ESP32P4_VALIDATED__RUNTIME_SDK_USEREVENTS_MASTER_CONTROL_PROVEN__READY_FOR_PWM_CONTROLLER__2026-08-02`.

| Native component | Status | Evidence boundary |
|---|---|---|
| Dashboard Card | **PROVEN** | Origin: ForgeUI Native; ESP32-P4 validated; Browser Preview, Live Studio, Standalone Export, Runtime SDK and UserEvents verified; one versioned serialized component with private internal LVGL composition and independent multi-instance behavior |
| Sensor Tile | **RENDERING AND USEREVENTS PROVEN; SETTER PROOF DEFERRED** | Compact `240 x 145` layout, multiple-instance rendering, readable fields, four unique callbacks, repeated touch and duplicate touch isolation physically passed on ESP32-P4; Runtime SDK generation and focused tests passed; automated multi-instance setter proof deferred to a simulator/proof module |
| Relay Panel | **RECERTIFIED — ESP32-P4 PHYSICALLY PROVEN** | Correct physical rendering; master ON/OFF; channels 0–3 operated; correct UserEvents; repeated interaction; operational runtime; Browser, Studio, and generated LVGL functionally aligned; unrelated ESP-Hosted startup assertion deferred as infrastructure work |

Native Component totals are separate from the completed practical LVGL ledger.
The 44/44 practical LVGL proof result remains unchanged. Dashboard Card is
**ForgeUI Native Component #1 — PROVEN** and establishes a separate platform
proof ledger. Sensor Tile is **ForgeUI Native Component #2**. Its physical
rendering and UserEvents evidence is proven; its automated multi-instance
setter proof is explicitly deferred.
Relay Panel is physically proven on ESP32-P4.

### Relay Panel physical recertification — 2026-08-05

Scott confirmed correct Relay Panel rendering on ESP32-P4, working master and
individual-channel controls, correct UserEvents, multiple successful
interactions, and an operational runtime. Browser, Studio, and generated LVGL
behaviour were functionally aligned. Observed UserEvents included Master ON,
Master OFF, and channels `0`, `1`, `2`, and `3` ON.

During testing, an unrelated ESP-Hosted startup assertion was observed on one
boot. Relay Panel functionality was verified independently. The issue is
external to Relay Panel recertification and investigation is deferred. This
status does not claim that ESP-Hosted or Wi-Fi transport was solved.

Accepted save point:
`FORGEUI_NATIVE_COMPONENT_3__RELAY_PANEL_RECERTIFIED__ESP32P4_PHYSICALLY_PROVEN__2026-08-05`.

### Dashboard Card physical recertification — 2026-08-05

Dashboard Card remains **PROVEN** following focused ESP32-P4 physical
recertification. Two- and three-card layouts verified the compact `240 x 145`
design, readable typography, progress bars, footer, spacing and stackability.
Repeated touches emitted only the callback belonging to the touched instance;
three independent generated callbacks were observed with no cross-triggering
or callback flood. Operation remained stable both connected and disconnected.
While connected, telemetry repeatedly showed Wi-Fi at `192.168.1.194`, SD
`READY` and approximately 38 KB internal RAM free. No Guru Meditation,
watchdog reset, LVGL assertion or heap warning was observed.

Dashboard Card-specific proof is complete. Accepted save point:
`FORGEUI_NATIVE_COMPONENT_1__DASHBOARD_CARD_RECERTIFIED__ESP32P4_PHYSICALLY_PROVEN__2026-08-05`.

### Sensor Tile compact physical record — 2026-08-05

ESP32-P4 physically confirmed the compact `240 x 145` layout, correct rendering
of multiple Sensor Tile instances, readable value, units, status, trend,
progress, and timestamp, four unique UserEvents callbacks, repeated touch
operation, duplicate-instance touch isolation, a stable application loop, and
SD remaining `READY`. No Guru Meditation, watchdog reset, LVGL assertion, or
callback flood was observed.

The full six-setter multi-instance Runtime SDK physical isolation sequence was
not conclusively completed because the temporary proof firmware workflow became
ambiguous. Do not claim that specific setter-isolation test passed.

- **Physical rendering and UserEvents: PASSED**
- **Runtime SDK generation and focused tests: PASSED**
- **Automated multi-instance setter proof: DEFERRED TO SIMULATOR/PROOF MODULE**

Truthful save point:
`FORGEUI_NATIVE_COMPONENT_2__SENSOR_TILE_COMPACT__ESP32P4_RENDER_AND_USEREVENTS_PROVEN__SDK_SIMULATOR_PROOF_DEFERRED__2026-08-05`.

A future removable Native Component Simulator / Proof Module should exercise
all generated setters, select instances, compare expected and actual values,
run duplicate isolation, emit unambiguous serial markers, avoid edits to
`95_UserEvents.c` and ambiguous binaries, and support Browser, Live Studio, and
ESP32-P4 proof modes. It is not implemented in this save point.

Current Native Component roadmap:

1. Dashboard Card — **PROVEN**
2. Sensor Tile — **PROVEN**
3. Relay Panel — **PROVEN**
4. PWM Controller — **PROVEN**
5. Trend Chart — **PROVEN**
6. Trend Chart Pro — **PROVEN**
7. Alarm Panel — **HARDWARE VALIDATED — EXPORTED, FLASHED, AND PHYSICALLY RENDERED ON ESP32-P4; EXTENDED RUNTIME INTERACTION PROOF DEFERRED TO THE FUTURE PROOF MODULE / HARDWARE SIMULATION WORK**
8. IO Monitor — **HARDWARE VALIDATED — EXPORTED, BUILT WITH ESP-IDF 5.5.4, FLASHED, AND PHYSICALLY RENDERED ON ESP32-P4; READ-ONLY WITH NO TOUCH USEREVENTS**
9. Battery Card — **HARDWARE VALIDATED — READ-ONLY; BROWSER/LIVE/GENERATED LVGL PARITY, ESP-IDF BUILD, ESP32-P4 FLASH, AND PHYSICAL RENDERING CONFIRMED; NO USEREVENTS**
10. Tank Level Card — **HARDWARE VALIDATED — DISPLAY-ONLY; BROWSER/LIVE/GENERATED LVGL PARITY, DUPLICATE ISOLATION, ESP-IDF BUILD, ESP32-P4 FLASH, AND PHYSICAL RENDERING CONFIRMED; NO USEREVENTS**
11. Network Status Card — **HARDWARE VALIDATED — READ-ONLY; LIVE WI-FI PROJECTION, DUPLICATE ISOLATION, ESP-IDF BUILD, ESP32-P4 FLASH, AND APPLICATION-PAGE UPDATES CONFIRMED; NO USEREVENTS**

12. Device Summary Card — **HARDWARE VALIDATED — MONITORING-ONLY; STACKABLE 240 x 145 DEFAULT, SIX SILENT PERSISTED-ID SETTERS, DUPLICATE ISOLATION, BROWSER/LIVE/LVGL PARITY, PHYSICAL ESP32-P4 RENDERING, AND NO USEREVENTS**

13. KPI Card — **HARDWARE VALIDATED — GENERIC MONITORING-ONLY KPI; THREE INDEPENDENT 240 x 145 CARDS PHYSICALLY CONFIRMED ON ESP32-P4, SEVEN SILENT PERSISTED-ID SETTERS, DUPLICATE ISOLATION, BROWSER/LIVE/LVGL PARITY, AND NO USEREVENTS**

14. Power Flow Card — **HARDWARE VALIDATED — BOUNDED FOUR-NODE MONITORING TOPOLOGY; VISIBLE STATIC FLOW DIRECTIONS AND READABLE VALUES; SEVEN SILENT PERSISTED-ID SETTERS; DUPLICATE ISOLATION; BROWSER/LIVE/LVGL PARITY; 240 x 145 DEFAULT, 220 x 128 MINIMUM; PHYSICAL ESP32-P4 RENDERING; ZERO USEREVENTS**

The planned fourteen-component Native Component development and certification run is complete. The next phase is the **FORGEUI HARDWARE I/O PROOF PROGRAM**, documented only in this closure pass.

This roadmap supersedes the historical PWM proof-ready paragraph below.
4. PWM Controller — **NEXT**
5. System Health
6. Network Widget
7. Storage Widget
8. Gauge Cluster
9. Energy Monitor

### PWM Controller implementation update — 2026-08-02

ForgeUI Native Component #4 is **IMPLEMENTED — READY FOR FINAL HARDWARE PROOF**. Physical ESP32-P4 evidence confirms independent value interaction for two instances, duplicate isolation, correct UserEvents identity routing, value sweeps through 100, SD remaining `READY`, operational RAM telemetry, and no observed crash or watchdog reset. Independent enable-switch behavior, silent Runtime SDK setters, connected-Wi-Fi stability and the final five-to-ten-minute soak remain pending. It owns no GPIO or LEDC configuration. The exact evidence and final procedure are in [`docs/FORGEUI_PWM_CONTROLLER.md`](docs/FORGEUI_PWM_CONTROLLER.md). Do not promote it until all four remaining gates are confirmed.

After PWM proof, the next architecture sprint is the **ForgeUI ESP32-S3 Simulator Platform**. Its recorded scope is simulated digital inputs/outputs, PWM, analogue, battery, tank, motor and relay behavior; Wi-Fi communication; repeatable hardware validation; a future Test Certificate Card; and a public hardware-proof workflow. This milestone is recorded only; no simulator code is implemented in the PWM closure task.

## Authoritative Standard Widget status matrix

Status language:

- **PROVEN**: physically exercised on the target hardware through the claimed
  live and/or Standalone path.
- **READY FOR PHYSICAL PROOF**: Registry-to-export software slice and focused tests are
  complete, but the remaining physical behaviour has not been recorded.
- **PARTIAL**: some pipeline stages exist, but the full authoritative slice or
  its evidence has not been re-established.
- **PLANNED**: roadmap only; not an implemented Standard widget.

| Standard widgets | Status | Evidence boundary |
|---|---|---|
| LED, Input, Textarea, Checkbox, Switch, Radio | **PROVEN** | Detailed physical/runtime records below |
| Progress, Circular Progress, Number Input, Select | **PROVEN** | Detailed physical/runtime records below |
| Bar, Arc, Chart, Table | **PROVEN** | Detailed physical/runtime records below |
| Keyboard, Calendar, Scale, Roller, Message Box, Button Matrix | **PROVEN** | Detailed physical/runtime records below |
| Slider | **PROVEN** | Live and Standalone ESP32-P4, touch, setter/hook and multiple instances |
| Spinner | **PROVEN** | Live and Standalone ESP32-P4 native animation at approximately 60 FPS |
| List | **PROVEN** | **LIST — PROVEN ON ESP32-P4**; live/Standalone builds and one indexed/text callback per controlled row tap |
| Spinbox | **PROVEN** | Live and Standalone ESP32-P4; drag/drop, previews, touch, setter/hook, multiple instances and gating |
| QR Code | **PROVEN** | Registry, Tray, Canvas, Inspector, shared Browser Preview, semantic colours, native export, setter, collision-safe instances, ESP32-P4 display, successful mobile scan and Live/Standalone parity passed |
| Button | **PROVEN** | Standard Button hardware proof passed on ESP32-P4 |
| Text | **PROVEN** | Multiline wrapping and presentation parity physically accepted on ESP32-P4 |
| Heading | **PROVEN** | Multiline content, wrapping, configured alignment and generated geometry physically verified on ESP32-P4 |
| Box | **PROVEN** | Geometry, styling, child ownership and Browser/Standalone nesting parity physically verified on ESP32-P4 |
| Divider | **PROVEN** | Horizontal and vertical presentation physically verified on ESP32-P4; vertical drop geometry usability improved |
| Icon | **PROVEN** | Final ESP32-P4 re-proof passed Registry/Inspector configuration, canonical ownership, semantic theme/runtime behavior, multiple instances and Canvas/Browser/Live/Standalone parity |
| Image, Line | **PROVEN** | Native `lv_image_create()` Contain scaling and native `lv_line_create()` geometry/style passed Live and Standalone ESP32-P4 proof |
| Icon Button | **PROVEN** | Canonical icon selection, disabled state, pressed feedback, native enabled setter/click hook, collision-safe instances and Canvas/Browser/Live/Standalone ESP32-P4 parity passed |
| Canvas | **PROVEN** | Rendering/export and editing-surface selection, drag, resize, supported rotation, ordering, hit testing, fractional geometry, synchronization and physical Live/Standalone parity passed |
| Wi-Fi Status, Clock | **PROVEN** | Batch C Canvas, Browser, Live and Standalone ESP32-P4 presentation physically accepted |
| TabView | **PROVEN** | ESP32-P4 touch selection remains physically proven; collision-safe selected-index setter/change hook contract retained |
| TileView | **PROVEN** | Native LVGL 9.2.2 paging; silent startup/setter; correct `2 × 2` coordinates; horizontal/vertical navigation; one callback per effective change; repeated navigation and surrounding Wi-Fi/SD/widgets stable on ESP32-P4 |

| Span | **PROVEN** | ESP32-P4 proved ordered native `lv_spangroup`, semantic/explicit colours, font sizes, underline, ordering, alignment and Canvas/Browser/Live/Standalone parity |
| Animation Image | **PROVEN** | Existing Asset Manager multi-select authoring, ordered native `lv_animimg` frames, animation, zero-frame placeholder and Canvas/Browser/Live/Standalone parity passed ESP32-P4 validation |
| Image Button | **PROVEN** | Native `lv_imagebutton` released, pressed and disabled states, enabled setter, click hook, multiple instances and Canvas/Browser/Live/Standalone parity passed ESP32-P4 validation |
| Window | **PROVEN** | Native `lv_win` creation, two simultaneous instances, headers and independent close behavior physically validated on Waveshare ESP32-P4; richer content/scroll/action behavior is not claimed by this proof |
| Menu | **PROVEN** | Two independent native instances, child-page and Back navigation, approximately ten navigation cycles, stable system pages/Wi-Fi and approximately 42 KB internal RAM physically validated on Waveshare ESP32-P4 without crash, watchdog reset or rendering corruption |

The Registry currently contains no Dashboard widgets. Window and Menu are **PROVEN**; the
dedicated Dashboard Widget family remain **PLANNED** and must not be
described as Standard-library completions.

Registry audit total: 49 entries, comprising 44 practical Standard LVGL
widgets/components and five Interactive Assets. **All 44 practical Standard
LVGL widgets/components are physically PROVEN on ESP32-P4**.

The final official-catalogue audit found five practical LVGL 9.2 closure
widgets. Batch 1 completed and physically proved Span, Animation Image and
Image Button; Batch 2 physically proved Window; the final hardware pass
physically proved Menu. Lottie is
intentionally excluded because its ThorVG/vector/C++ and framebuffer boundary
requires a separate opt-in architecture decision. Practical LVGL parity is
complete; ForgeUI Platform development is next. See
`docs/LVGL_9_STANDARD_WIDGET_AUDIT.md`.

## 2026-08-01 end-of-sprint proof update

Button, Heading, Box and Divider completed physical ESP32-P4 proof. Heading
proved multiline wrapping and alignment parity. Box proved native child
ownership and matching Browser/Standalone nesting. Divider proved its visual
geometry; its horizontal behavior is unchanged and only the untouched vertical
drop default now becomes immediately visible. Button retains its proven native
presentation status.

This sprint also replaced synthetic TileView export with native LVGL paging,
corrected Standard Text wrapping/multiline parity, and corrected native Icon
automatic sizing, source-aware scaling, centering and clipping. Text has since
completed physical proof and is **PROVEN**. Icon subsequently passed final
Batch D hardware re-proof and is **PROVEN**.

## Image and Line final physical proof

**IMAGE — PROVEN. LINE — PROVEN.** Image now uses native `lv_image_create()`
with uploaded-asset persistence, canonical Contain sizing, preserved and
legacy-recovered intrinsic dimensions, source-aware LVGL scaling, centred
alignment, opacity and visibility. The resolved `1024 × 600` proof descriptor
inside `240 × 160` bounds generated and physically validated
`calculated_scale=60`, `emitted_scale=60` and
`lv_image_set_scale(fg_image, 60)` without clipping. Line uses native
`lv_line_create()` and physically passed horizontal, vertical and arbitrary
geometry, multiple instances, colour, opacity and thickness. Live Studio and
Standalone Export matched for both widgets on ESP32-P4.

## TileView final physical proof

**✅ PROVEN**

Physical ESP32-P4 evidence confirms silent startup, correct fixed `2 × 2`
coordinate reporting, horizontal and vertical navigation, one callback per
effective tile change, and stable repeated navigation. Observed callback
coordinates included `(1,0)`, `(0,0)`, `(1,1)` and `(0,1)`. Wi-Fi remained
connected, SD remained ready, and TabView, Spinbox and List continued working.
Generated export remains native `lv_tileview_create()` plus
`lv_tileview_add_tile()` and preserves these contracts:

```c
void FG_Set_<Name>_Selected(uint32_t column, uint32_t row);
void FG_On_<Name>_Changed(uint32_t column, uint32_t row);
```

## Spinbox final physical proof

Hardware: ESP32-P4, LVGL 9.2.2 and ESP-IDF 5.5.4.

The completed proof covers Widget Registry and Tray discovery; drag/drop;
Canvas rendering and increment/decrement controls; Inspector synchronization;
Browser Preview parity; native LVGL and Standalone export parity; ESP32-P4
touch operation; increment/decrement; signed values; decimal formatting;
rollover; clamp; multiple instances; export-time feature gating; collision-safe
callbacks; and Runtime API generation.

```c
void FG_Set_<Name>_Value(int32_t value);
void FG_On_<Name>_Changed(int32_t value);
```

Exactly one changed callback was observed per effective user action.
Programmatic setters, startup and ineffective/repeated transitions remained
silent. Native LVGL Spinbox edits a selected digit; NumberInput remains the
appropriate widget for free-form numeric text entry.

Resolved proof issues were:

- Tray-to-Canvas acceptance list omission;
- Canvas drag wrapper consuming click events;
- stale Canvas preview value synchronization;
- stale generated firmware artifact;
- malformed helper-button coordinates that placed arrows off-screen;
- live/export parity verification gaps;
- missing export preflight validation.

- Use `01_SPINE.md` for architecture, milestones and product direction.
- Use `02_DEVELOPER_CODE_MAP.md` for Studio ownership and debugging paths.
- Use `03_ForgeUI_Generated_Export_API_Code_Map.md` for generated firmware APIs, hooks and export boundaries.
- Use `04_FEATURE_STATUS.md` for concise feature-by-feature proof status.

Detailed ownership maps are not duplicated here.

## Slider and Spinner ESP32-P4 proof procedure

Use a `1024 × 600` project with FPS and RAM overlays enabled. Place four `96 × 96` Spinners on the Application page:

| Label | Position | Spinner properties |
| --- | --- | --- |
| Default | `x=100, y=180` | defaults |
| Slow | `x=300, y=180` | duration `2400 ms`, arc length `120°` |
| Fast | `x=500, y=180` | duration `300 ms`, arc length `45°` |
| Themed | `x=700, y=180` | duration `1000 ms`, arc length `90°`, arc width `12`, background width `4`, accent `#22D3EE`, background `#112233`, opacity `75%` |

Add one Slider with range `-100..100`, initial value `0`, and a unique component name. Generate the live firmware, inspect `90_Studio_Export.c/.h` and `95_UserEvents.c/.h`, then build and flash the Waveshare ESP32-P4 profile. Confirm clean startup with no Slider hook and no Spinner callback; drag the Slider through both signs and confirm one hook per effective user value; call its setter with in-range, repeated, below-minimum and above-maximum values and confirm clamping without hooks. Observe all four native Spinner animations for at least ten minutes, navigate away and back ten times, and confirm geometry, colours, stable FPS/RAM recovery, no monotonic heap loss, no touch interception and no callbacks. Repeat a standalone export and compare its generated application/widget/API/hook sections with the live export.

# ==============================================================================
# 💡 STANDARD LED
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Status_LED(bool on);
```

### Behaviour

- Changes the runtime LED state.
- Duplicate states are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Status_LED_Changed(bool enabled);
```

### Behaviour

- Fired after an effective runtime state change.
- Never fired during startup.

---

## 📝 Notes

- Full Canvas ↔ Browser ↔ Generated LVGL ↔ ESP32-P4 parity.
- Semantic green status colour intentionally remains independent from decorative theme colours.
- Hardware proven.

---

# ==============================================================================
# ⌨️ STANDARD INPUT
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Text(const char * text);
```

### Behaviour

- Setter updates text silently.
- Duplicate effective values are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(const char * text);
```

### Behaviour

- Fired for genuine user edits only.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Native single-line `lv_textarea`.
- Semantic theme and border parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Touch focuses the field only; no keyboard is attached automatically.
- Hardware proven.

---

# ==============================================================================
# 📝 STANDARD TEXTAREA
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Text(const char * text);
```

### Behaviour

- Setter updates multiline text silently.
- Duplicate effective values are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(const char * text);
```

### Behaviour

- Fired for genuine user edits only.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Native multiline `lv_textarea`.
- Semantic theme and border parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Touch focuses the field only; no keyboard is attached automatically.
- Hardware proven.

---

# ==============================================================================
# ☑️ STANDARD CHECKBOX
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Checked(bool checked);
```

### Behaviour

- Setter changes checked state silently.
- Duplicate states are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(bool checked);
```

### Behaviour

- Fired after a genuine checked-state change.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Default fallback wording removed.
- Legacy fallback wording normalizes to empty.
- Explicit custom labels remain supported.
- Semantic theme and checked-state parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🔀 STANDARD SWITCH
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Checked(bool checked);
```

### Behaviour

- Setter changes checked state silently.
- Duplicate states are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(bool checked);
```

### Behaviour

- Fired after a genuine checked-state change.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Checked state uses the active amber semantic accent.
- Explicit generated styling overrides native LVGL blue.
- Semantic theme parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🔘 STANDARD RADIO
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Selected(bool selected);
```

### Behaviour

- Setter changes independent selected state silently.
- Duplicate states are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(bool selected);
```

### Behaviour

- Fired after a genuine selected-state change.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Default `"Radio"` text removed.
- Default rendering is indicator-only.
- Explicit custom labels remain supported.
- Semantic theme parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 📶 STANDARD PROGRESS
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Value(int32_t value);
```

### Behaviour

- Output-only setter clamps to the configured range.
- Duplicate effective values are ignored.
- Native `lv_bar` is non-draggable.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Progress has no genuine user transition.
- No changed hook is generated.

---

## 📝 Notes

- Output-only native `lv_bar`.
- Setter-only runtime.
- Semantic theme parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# ⭕ STANDARD CIRCULAR PROGRESS
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Value(int32_t value);
```

### Behaviour

- Output-only setter clamps to the configured range.
- Duplicate effective values are ignored.
- No touch dragging or interaction.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Circular Progress has no genuine user transition.
- No changed hook is generated.

---

## 📝 Notes

- Native `lv_arc`.
- Full 360° background arc with 270° rotation.
- `surfaceSecondary` remaining track and `accent` indicator.
- Knob removed and clickability disabled.
- Semantic theme parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🔢 STANDARD NUMBER INPUT
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Value(int32_t value);
```

### Behaviour

- Setter clamps to minimum and maximum silently.
- Hardware increment/decrement buttons consume serialized step.
- Button changes invoke the developer hook.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(int32_t value);
```

### Behaviour

- Fired after genuine text edits or hardware stepper changes.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Outer container owns the complete semantic border.
- Numeric textarea plus hardware increment and decrement buttons.
- Vertical field/stepper divider and horizontal button divider.
- Step support and minimum/maximum clamping.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🔽 STANDARD SELECT
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Selected_Index(uint32_t index);
```

### Behaviour

- Setter clamps to the available options silently.
- Duplicate effective selections are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(uint32_t index, const char * text);
```

### Behaviour

- Fired after a genuine selection change.
- Supplies selected index and text.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Native `lv_dropdown`.
- Closed control and popup list are semantically themed.
- Semantic outer border and dropdown arrow.
- Native blue selected-row styling is overridden.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 📊 STANDARD BAR
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Inspector
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Progress_Bar(int32_t value);
```

### Behaviour

- Values are clamped.
- Supports negative and reversed ranges.
- Duplicate values are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Progress_Bar_Changed(int32_t value);
```

### Behaviour

- Fired after an effective runtime value change.
- Never fired during startup.

---

## 📝 Notes

- Inspector supports Minimum, Maximum and Initial Value.
- Direct Canvas click and drag authoring.
- Rounded LVGL parity.
- Canvas movement preserved.
- Semantic theme: track uses `surfaceSecondary`, border uses `surfaceBorder`, indicator uses `accent`.
- Hardware proven.

---

# ==============================================================================
# 🌀 STANDARD ARC
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Inspector
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Value_Arc(int32_t value);
```

### Behaviour

- Values are clamped.
- Supports negative, reversed and equal ranges.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Value_Arc_Changed(int32_t value);
```

### Behaviour

- Fired after an effective runtime value change.
- Never fired during startup.

---

## 📝 Notes

- Inspector supports Minimum, Maximum and Initial Value.
- Direct Canvas stroke adjustment.
- Transparent centre remains available for movement.
- Browser Preview parity.
- Semantic theme: background arc uses `surfaceSecondary`, indicator uses `accent`, knob uses `accentText`.
- Hardware proven.

### Current Limitation

- Rotation, background angles and mode are exporter-supported but not yet editable in the Inspector.

---

# ==============================================================================
# 📈 STANDARD CHART
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime APIs
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime APIs (90_Studio_Export)

```c
void FG_Add_Data_Chart_Point(int32_t value);
void FG_Clear_Data_Chart(void);
```

### Behaviour

- Runtime values are clamped.
- Points are appended to the current series.
- Clear removes the entire series.
- Startup population does not invoke runtime APIs.

---

## 🧩 Developer Hooks (95_UserEvents)

```c
void FG_On_Data_Chart_Point_Added(int32_t value);
void FG_On_Data_Chart_Cleared(void);
```

### Behaviour

- Fired when a runtime point is added.
- Fired when the chart is cleared.
- Never fired during startup.

---

## 📝 Notes

- Shared Canvas and Browser renderer.
- Native `lv_chart` retained.
- Responsive plot geometry and gutters.
- Y-axis labels: `100`, `75`, `50`, `25`, `0`.
- X-axis point-index labels: `0`, `1`, `2`, `3`, `4`, `5`, `6`.
- Axis labels are non-clickable sibling `lv_label` objects.
- X labels derive from point indexes; no category, date or timestamp semantics are invented.
- Selected-theme surface, border, divisions and secondary label text.
- Hardware proven.

### Current Limitation

- Chart Inspector controls are not yet available.

---

# ==============================================================================
# 🗂️ STANDARD TABLE
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- ESP32-P4 Hardware

---

## ⚙ Runtime API (90_Studio_Export)

**None generated**

### Behaviour

- Static LVGL table component.
- Exported cell values match Studio.
- No runtime API currently required.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Static display component.
- No runtime events.

---

## 📝 Notes

- Selected semantic theme surface.
- Consistent `surfaceSecondary` cell fill.
- `surfaceBorder` grid and outer bounds.
- `textPrimary` cell text.
- Rounded clipped frame.
- Canvas, Browser and P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🧱 FORGEUI LAYOUT DESIGNER
# ==============================================================================

## Current Template

**Dashboard — Reference Implementation**

## Status

**🟡 CANVAS AND BROWSER PREVIEW MANUALLY VERIFIED — GENERATED OUTPUT AND HARDWARE PROOF PENDING**

---

## ✔ Verified

- Deterministic Dashboard template
- Header smart region
- Status smart region
- Main smart region
- Controls smart region
- Footer smart region
- Real editable Box components
- One Divider
- One Heading placeholder
- Manual region selection
- Manual region movement
- Manual region resizing
- Stable Inspector-based region assignment
- Auto Arrange
- AI Fill Dashboard
- Canonical component validation
- Canvas rendering
- Browser Preview rendering
- Existing project component model
- Existing save/reload architecture
- Focused Box exporter coverage
- 20 focused Layout Designer tests

---

## 🧩 Architecture

```text
Natural-language prompt
        ↓
Layout Designer
        ↓
Dashboard Template
        ↓
AI Fill
        ↓
Normal ForgeUI Components
        ↓
Canvas
        ↓
Browser Preview
        ↓
LVGL Export
```

AI Fill selects canonical supported content and semantic regions. ForgeUI Layout Designer owns template structure and final geometry. Smart Regions are normal editable Box components. Auto Arrange computes final child `x/y/w/h`. The existing component document remains authoritative, and the existing LVGL exporter receives normal ForgeUI components.

Layout Designer does not introduce a new runtime family, public API family, User Event hook family, generated firmware document or export payload field. It resolves into normal ForgeUI components before export.

---

## ⚙ Generated Runtime API

**No Layout Designer-specific API generated**

Region Boxes remain Standard Box components. Non-root Boxes may retain the existing visibility setter where applicable. Contained controls retain their normal component-specific APIs and hooks. Layout Designer itself generates no `FG_Set_*` or `FG_On_*` contract.

```text
Dashboard Controls region
  ├── Start Button
  ├── Pause Button
  └── Reset Button

Region Box
  → normal generated LVGL object
  → optional existing Box visibility API

Contained controls
  → retain their existing generated runtime contracts
```

---

## 🗂 Current Template Status

✅ Dashboard

### Future Template Candidates

- ⬜ Settings
- ⬜ Login
- ⬜ Form
- ⬜ Machine Status
- ⬜ Sidebar
- ⬜ Split View
- ⬜ Card Grid
- ⬜ Control Panel

These are planned template extensions. They are not implemented or proven in the current save point. Dashboard is the only completed structural template.

---

## Not Yet Proven

- Full Studio production build
- Additional live OpenAI network testing beyond the manually observed AI Fill workflow
- Current generated `90_Studio_Export.c` inspection
- Generated LVGL project inspection
- Dashboard → Generate → Build → Flash parity
- ESP-IDF firmware build for the Layout Designer dashboard
- ESP32-P4 flash
- Physical Canvas ↔ Browser Preview ↔ generated LVGL ↔ ESP32-P4 parity
- Settings, Login, Form, Machine Status or other structural templates

---

## 📝 Notes

- Dashboard regions remain movable and resizable after application.
- Region assignment currently occurs through Inspector.
- Drag-to-assign is not implemented.
- Structural-lock metadata exists but direct Canvas enforcement is not yet complete.
- Legacy free-coordinate AI generation remains available for compatibility.
- Dashboard template mode uses Studio-owned region geometry rather than AI-owned pixel coordinates.
- Generated firmware cannot distinguish between manually placed and AI-filled components.

---

# ==============================================================================
# ⌨️ STANDARD KEYBOARD
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime APIs
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime APIs (90_Studio_Export)

```c
void FG_Show_Keyboard(void);
void FG_Hide_Keyboard(void);
```

### Behaviour

- Shows the standalone keyboard.
- Hides the keyboard.
- Standalone keyboard is not automatically attached to a textarea.

---

## 🧩 Developer Hooks (95_UserEvents)

```c
void FG_On_Keyboard_Shown(void);
void FG_On_Keyboard_Hidden(void);
```

### Behaviour

- Fired when the keyboard is shown.
- Fired when the keyboard is hidden.
- Never fired during startup.

---

## 📝 Notes

- Standalone textarea removed.
- Selected semantic theme surface, keys, borders, states and text.
- Semi-transparent panel.
- Opaque keys.
- Show/Hide APIs preserved.
- Wi-Fi and Storage keyboards remain independent.
- Hardware proven.

---

# ==============================================================================
# 📅 STANDARD CALENDAR
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Calendar_Date(uint16_t year, uint8_t month, uint8_t day);
```

### Behaviour

- Validates Gregorian dates, including leap years.
- Suppresses repeated effective selections.
- Updates the shown and selected date.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Calendar_Date_Changed(uint16_t year, uint8_t month, uint8_t day);
```

### Behaviour

- Fired after an effective date change.
- Touch and runtime updates use the same retained date.
- Never fired during startup.

---

## 📝 Notes

- Fixed proof model: June 2026.
- Sunday-first, 42 date cells and six visible weeks.
- Spill dates and today outline preserved.
- Selected semantic theme surface, border, primary/secondary text and accent.
- Hardware proven.

---

# ==============================================================================
# 📏 STANDARD SCALE
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- ESP32-P4 Hardware

---

## ⚙ Runtime API (90_Studio_Export)

**None generated**

### Behaviour

- Static native LVGL scale.
- Owns no current runtime value.
- No runtime API is required.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Presentation-only component.
- No runtime events.

---

## 📝 Notes

- Horizontal-bottom layout.
- Range `0..100`.
- 11 ticks with six numeric labels.
- No surrounding panel.
- Ticks use `accent`; labels use `textPrimary`.
- Hardware proven.

---

# ==============================================================================
# 🎛️ STANDARD ROLLER
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Option_Roller_Selected(uint32_t index);
```

### Behaviour

- Clamps selection to the available options.
- Suppresses repeated effective selections.
- Preserves native Roller scrolling and snapping.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Option_Roller_Changed(uint32_t index, const char * text);
```

### Behaviour

- Fired after an effective selection change.
- Supplies the selected index and option text.
- Never fired during startup.

---

## 📝 Notes

- Canvas and Browser share the same renderer.
- Opaque selected-theme surface.
- Border, normal text and selected text use semantic theme roles.
- Visible row count and native behavior preserved.
- Hardware proven.

---

# ==============================================================================
# 💬 STANDARD MSGBOX
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime APIs
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime APIs (90_Studio_Export)

```c
void FG_Show_Message(void);
void FG_Close_Message(void);
```

### Behaviour

- Shows and foregrounds the Message Box.
- Closes the Message Box.
- Duplicate visibility changes are ignored.
- Startup does not invoke the runtime APIs.

---

## 🧩 Developer Hooks (95_UserEvents)

```c
void FG_On_Message_Shown(void);
void FG_On_Message_Closed(void);
void FG_On_Message_Button_Pressed(uint32_t index, const char * text);
```

### Behaviour

- Shown and Closed hooks follow effective visibility changes.
- Button hook supplies the selected button index and text.
- Never fired during startup.

---

## 📝 Notes

- Custom ForgeUI panel; does not use `lv_msgbox_create`.
- Title, body and outlined buttons preserved.
- Selected semantic theme surface, border and text.
- Canvas, Browser and P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🔢 STANDARD BUTTONMATRIX
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Menu_Matrix_Selected(uint32_t button_index);
```

### Behaviour

- Clamps selection to the available buttons.
- Rejects disabled buttons.
- Suppresses repeated effective selections.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Menu_Matrix_Button_Selected(uint32_t index, const char * text);
```

### Behaviour

- Fired after an effective button selection.
- Supplies the selected button index and text.
- Never fired during startup.

---

## 📝 Notes

- Row breaks do not count as buttons.
- Selected and checked states remain distinct.
- Selected semantic theme surface, buttons, borders, text, selected and disabled states.
- Canvas, Browser and P4 parity.
- Hardware proven.
## Fi Icon Runtime — 2026-08-01

Architecture reference: [`09_FORGEUI_FI_RUNTIME_GUIDE.md`](09_FORGEUI_FI_RUNTIME_GUIDE.md).

Native Component developer runtime reference:
[`10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md`](10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md).
This status ledger remains authoritative for proof promotion and totals.

The generic Fi Icon Runtime vertical slice is **PROVEN ON ESP32-P4**.
Standard Icon supports default-on generated visibility,
opacity and color setters in `96_FiRuntime`, plus default-off optional click
hooks in `95_UserEvents`. Image-backed and supported LVGL-symbol-backed objects
share the same instance contract and canonical 92% sizing model. This software
milestone now promotes Icon: Standard proof is **39/39 (100%)** with none
remaining.

**FI ICON CLICK HOOKS — PHYSICALLY PROVEN.** On ESP32-P4, three separate
click-enabled icons were touchable and emitted three separate collision-safe
callbacks—`FG_On_Comp_MS9QE1N7GA5O3_Clicked`,
`FG_On_Comp_MS9Q2MXPEJP7D_Clicked`, and
`FG_On_Comp_MS9Q42SGCB4EB_Clicked`—with exactly one callback per deliberate tap
and no startup callback. This proves the 90 → 95 click path. SD remained ready;
the Wi-Fi failure observed during the run was unrelated to this proof.

**FI RUNTIME PRESENTATION SETTERS — PHYSICALLY PROVEN.** The 90 → 96 path,
including presentation state, independent instances, click-disabled behavior
and Standalone parity, passed final ESP32-P4 validation. Fi Runtime and Icon are
fully **PROVEN**.
# Network Status Card — HARDWARE VALIDATED

ForgeUI Native Component #11 is hardware validated across registry/defaults,
versioned normalization, Inspector, Browser Preview, Live Studio, LVGL 9.2
export, silent fixed-storage Runtime SDK, persisted-ID duplication isolation,
and zero UserEvents. ESP32-P4 validation confirmed live Wi-Fi projection on the
application page without opening the System Wi-Fi Manager. See
`docs/FORGEUI_NETWORK_STATUS_CARD.md`.
