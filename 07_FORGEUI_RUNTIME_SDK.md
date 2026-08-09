# ForgeUI Runtime SDK Direction

## Connected-service state contract

The authoritative Waveshare 7B networking architecture is [`12_FORGEUI_ESP32P4_WIFI_HOSTED_ARCHITECTURE.md`](12_FORGEUI_ESP32P4_WIFI_HOSTED_ARCHITECTURE.md). Runtime SDK and generated UI code read cached `fg_wifi_snapshot_t` state; frequently polled getters must not issue synchronous Hosted RPC calls such as `esp_wifi_sta_get_ap_info()`. Network state is captured at Wi-Fi/IP events so UI polling cannot contend with TLS traffic. Hardware Example 04 proves this shared connected-service layer with certificate-verified HTTPS and SNTP; future REST, MQTT, cloud telemetry and time integrations may reuse it without implying those services already exist.

## Hardware Example 04 — Online Services — Live Weather semantic surface

Weather 04 uses the existing Open-Meteo `weather_code` and `is_day` values to choose one of ten local background semantics. It swaps the image source on the existing LVGL background object, suppresses a duplicate assignment when the semantic background is unchanged, and does not rebuild the screen or issue another network request. Forecast/current setters and generated Fi presentation APIs remain the public boundary; application code must not manipulate private generated objects. The images are ForgeUI assets, not images downloaded from Open-Meteo.

## Hardware Example 02 — FRAM semantic surface

The physically proven MB85RC256V example updates generated UI only through
`FG_Set_FRAM_Status_Text`, `FG_Set_FRAM_Address_Text`,
`FG_Set_FRAM_Value_Text`, and `FG_Set_FRAM_Verify_Text`. Touch actions enter
developer-owned hardware code through `FG_On_WRITE_TEST_Clicked` and
`FG_On_READ_TEST_Clicked`. Boot identifies and reads the FRAM; only a deliberate
WRITE TEST event writes physical memory.

## Hardware Example 03 — NFC semantic surface

The physically proven PN532 example publishes hardware state through
`FG_Set_NFC_Device_Text`, `FG_Set_NFC_Interface_Text`,
`FG_Set_NFC_Card_Text`, `FG_Set_NFC_UID_Text`, and
`FG_Set_NFC_Read_Count_Text`. The read-only fields do not own hardware actions.
Example selection alone controls whether the PN532 source and GPIO allocation
are linked and initialized.

Current Native Component certification (2026-08-07): Dashboard Card, Sensor
Tile, Relay Panel, PWM Controller, Trend Chart, and Trend Chart Pro are
fully proven on ESP32-P4. Alarm Panel's SDK is implemented and automated tests
pass; the component is **HARDWARE VALIDATED** after fresh export, build, flash,
and correct physical rendering. Exhaustive runtime transition and callback
verification remains deferred to future Proof Module / hardware simulation work.
The practical LVGL ledger remains 44 / 44.

Network Status Card is **HARDWARE VALIDATED** as a read-only monitor. Its
persisted-ID, rename-stable and duplicate-isolated contract is:

```c
void FG_Set_<NetworkStatusCard>_Connected(bool connected);
void FG_Set_<NetworkStatusCard>_Network_Name(const char * name);
void FG_Set_<NetworkStatusCard>_IP_Address(const char * ip);
void FG_Set_<NetworkStatusCard>_Signal_Strength(int32_t percent);
void FG_Set_<NetworkStatusCard>_Status_Text(const char * text);
void FG_Set_<NetworkStatusCard>_Network_Type(int32_t type);
```

These setters are silent and the component generates zero UserEvents. Canvas
values initialize the component; live runtime values override its monitoring
fields when a snapshot becomes available. Native monitoring projection runs
before the optional System Wi-Fi Manager page gate.

Tank Level Card is **HARDWARE VALIDATED** and intentionally display-only. Its
generated contract contains only the APIs that are actually emitted:

```c
void FG_Set_<TankLevelCard>_Level(float percent);
void FG_Set_<TankLevelCard>_Volume(float value);
void FG_Set_<TankLevelCard>_Capacity(float value);
void FG_Set_<TankLevelCard>_Units(const char * units);
void FG_Set_<TankLevelCard>_LowLevel(float value);
void FG_Set_<TankLevelCard>_HighLevel(float value);
```

Persisted identity makes these names rename-stable and duplicate instances are
isolated. Setters are silent and private LVGL objects remain generator-owned.
Tank Level Card generates no UserEvents because it has no genuine interaction.

Battery Card is **HARDWARE VALIDATED** as a read-only monitor. Its generated
contract contains only the implemented silent setters:

```c
void FG_Set_<BatteryCard>_Percentage(float value);
void FG_Set_<BatteryCard>_Voltage(float value);
void FG_Set_<BatteryCard>_Current(float value);
void FG_Set_<BatteryCard>_Runtime(int32_t value);
void FG_Set_<BatteryCard>_Temperature(float value);
void FG_Set_<BatteryCard>_Health(int32_t value);
void FG_Set_<BatteryCard>_Charging(bool enabled);
```

The generated stem derives from persisted identity, remains stable across
display-name changes, and isolates duplicate instances. Setters refresh the
display silently. Battery Card intentionally generates no UserEvents in the
current release; build, flash, parity, and physical rendering are confirmed,
without claiming exhaustive physical setter interaction.

## Alarm Panel contract — hardware validated; extended runtime proof deferred

Alarm Panel uses fixed-capacity per-instance storage and rejects a new ID with
`false` when full. Exact generated names derive from persisted component IDs:

```c
bool FG_Add_<AlarmPanel>_Alarm(int32_t alarm_id, const char * message,
    const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);
bool FG_Acknowledge_<AlarmPanel>_Alarm(int32_t alarm_id);
bool FG_Clear_<AlarmPanel>_Alarm(int32_t alarm_id);
void FG_Clear_All_<AlarmPanel>(void);
void FG_Set_<AlarmPanel>_Enabled(bool enabled);
bool FG_Select_<AlarmPanel>_Alarm(int32_t alarm_id);

void FG_On_<AlarmPanel>_Alarm_Added(int32_t alarm_id, FG_Alarm_Priority priority);
void FG_On_<AlarmPanel>_Alarm_Acknowledged(int32_t alarm_id);
void FG_On_<AlarmPanel>_Alarm_Cleared(int32_t alarm_id);
void FG_On_<AlarmPanel>_Alarm_Selected(int32_t alarm_id);
```

Clear and acknowledge are distinct. `autoClear` determines whether Cleared
records remain styled and visible or release their slots. Duplicate instances
have isolated arrays, APIs, and callback symbols; private LVGL objects remain
implementation details.

## Proven chart contracts

Use the exact generated stem from `90_Studio_Export.h`; `<TrendChart>` and
`<TrendChartPro>` below are semantic placeholders, not literal C identifiers.

```c
FG_Add_<TrendChart>_Point(value);
FG_Clear_<TrendChart>();
FG_Set_<TrendChart>_WarningThreshold(value);
FG_Set_<TrendChart>_AlarmThreshold(value);

FG_Add_<TrendChartPro>_Point(value);
FG_Clear_<TrendChartPro>();
FG_Set_<TrendChartPro>_Units(units);
FG_Set_<TrendChartPro>_Warning(value);
FG_Set_<TrendChartPro>_Alarm(value);
```

Chart point and threshold values use `float`; units use `const char *`.
Persisted identity keeps the Pro contract stable through presentation-label
renames, and duplicate instances remain isolated.

Generated callback declarations and calls use one canonical contract:

```c
void FG_On_<Chart>_Point_Added(float value);
void FG_On_<Chart>_Warning(void);
void FG_On_<Chart>_Alarm(void);
void FG_On_<Chart>_Recovered(void);
```

Threshold callbacks fire only on state transitions. Regeneration preserves
matching developer-owned bodies in `95_UserEvents.c`; generated code must not
overwrite application logic. Developers must not integrate through private
generated LVGL chart symbols.

The older Relay/PWM milestone immediately below is retained as historical.

Current save point:
`FORGEUI_LVGL9_COMPLETE__44_OF_44_PRACTICAL_WIDGETS_PROVEN__ESP32P4_VALIDATED__DOCUMENTATION_COMPLETE__READY_FOR_NATIVE_FORGEUI_PLATFORM__2026-08-02`.

Current ForgeUI Platform milestone:
`FORGEUI_NATIVE_COMPONENT_3__RELAY_PANEL_PROVEN__ESP32P4_VALIDATED__RUNTIME_SDK_USEREVENTS_MASTER_CONTROL_PROVEN__READY_FOR_PWM_CONTROLLER__2026-08-02`.

Dashboard Card is **ForgeUI Native Component #1 — PROVEN**. ESP32-P4 proof
verified its semantic Value, Units, Status and Progress setters, optional root
click UserEvent, collision-safe independent instances and Live/Standalone
parity. No internal Label, status indicator or Bar object is public SDK state.

Sensor Tile adds semantic float Value, Units, Status, Trend, Timestamp and
Colour setters plus an optional root click hook. Threshold-based automatic
colour remains private generated behavior. No internal Label or Bar pointer is
public. Status is **PROVEN**. ESP32-P4 validation confirms all six setters and
the optional click UserEvent, with Browser Preview and Live/Standalone parity.
Persisted Native Component identity keeps generated public symbols stable, and
UserEvents ownership reconciliation preserves the active developer hook across
regeneration without compiling obsolete hook APIs.

Relay Panel is **ForgeUI Native Component #3 — PROVEN**. Its seven APIs use zero-based channel indices, reject
out-of-range access, maintain reliable generated logical state and never emit
UserEvents during programmatic updates. Channel and master hooks represent only
genuine user actions; GPIO and relay drivers remain outside the Runtime SDK.

This document introduces the long-term ForgeUI Runtime SDK direction. It does
not describe a finished, separately packaged SDK product.

Today the "Runtime SDK" is the coherent developer-facing surface generated with
an interface:

- callable Runtime APIs in `90_Studio_Export.h`, including the feature-gated
  `96_FiRuntime.h` public include for Standard Icon presentation;
- genuine-user callbacks in `95_UserEvents.h`;
- required public types and semantic conventions;
- ownership and regeneration rules;
- native LVGL implementation inside generated C.

This document must evolve alongside the Widget Registry.

The maintained component-by-component usage reference, beginning with Dashboard
Card, is
[`10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md`](10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md).

## Purpose

ForgeUI should generate an interface contract that application developers can
discover and use without editing generated LVGL internals. The SDK direction
turns each proven widget capability into a predictable application boundary.

```text
application state
    -> generated Runtime API
    -> generated native LVGL

genuine user interaction
    -> generated native LVGL callback
    -> generated UserEvent declaration
    -> developer application
```

## What is generated today

Depending on the serialized widgets and selected features, export may generate:

- native LVGL object construction and styling;
- private retained objects, state and transition helpers;
- public setters and commands;
- UserEvent declarations and default diagnostic stubs;
- immutable event-routing data;
- asset declarations and source lists;
- `00_ForgeUI_Features.h`;
- CMake source and dependency selections;
- a complete live or Standalone ESP-IDF project layer.

Generation is usage- and feature-gated. Presentation-only widgets may generate
LVGL with no public SDK symbol.

Window is **PROVEN** as a native structured component, including two-instance
rendering and independent close behavior on ESP32-P4. Its close callback is
generated privately. Window currently adds no public Runtime SDK API and no
`95_UserEvents` hook; application-level open, close, title and action contracts
may be added later when their requirements are defined.

Menu is **PROVEN**. Native item links and LVGL
back history provide its navigation behavior without a public SDK surface.
Menu currently adds no Runtime API or `95_UserEvents` hook; page-selection and
application event contracts remain deferred until concrete application
requirements justify them. Hardware proof covered two independent instances,
forward/Back navigation and repeated stable operation on ESP32-P4.

## Runtime APIs

Runtime APIs project application state into the generated interface:

```c
void FG_Set_Level_Slider_Value(int32_t value);
void FG_Set_Decimal_Spinbox_Value(int32_t value);
void FG_Set_Status_LED(bool on);
void FG_Add_Temperature_Chart_Point(float value);
void FG_Clear_Temperature_Chart(void);
void FG_Set_QR_Code_Text(const char * text);
```

The exact current catalogue is authoritative in
[03_ForgeUI_Generated_Export_API_Code_Map.md](03_ForgeUI_Generated_Export_API_Code_Map.md).

IO Monitor is a read-only Native Component. For an exported stem
`Io_Monitor_Main`, its implemented semantic API is:

```c
bool FG_Set_Io_Monitor_Main_DigitalInput(const char * channel, bool state);
bool FG_Set_Io_Monitor_Main_DigitalOutput(const char * channel, bool state);
bool FG_Set_Io_Monitor_Main_AnalogInput(const char * channel, float value);
bool FG_Set_Io_Monitor_Main_AnalogOutput(const char * channel, float value);
```

These persisted-ID, rename-stable setters update isolated bounded row storage
and return whether a matching typed channel was found. Updates are silent and
require no raw LVGL manipulation. IO Monitor has no touch-related UserEvents;
runtime projection through these setters is not user interaction.

SDK rules:

- generate APIs only for meaningful widget state or commands;
- normalize inputs at the generated boundary;
- guard unavailable LVGL objects;
- keep programmatic updates silent;
- avoid exposing private LVGL object pointers as the application contract.

Batch D retains the existing SDK rules. QR Code exposes only its meaningful
text-regeneration setter and no hook. Icon Button exposes only enabled state
plus a genuine-click hook; icon-source swapping remains owned by Image. Both
families allocate collision-safe names for multiple instances.

## UserEvents

Battery Card is read-only and exposes seven silent persisted-ID setters for
percentage, voltage, current, charging, health, runtime minutes, and temperature.
Health is `0..3` (Good through Replace). Duplicate instances remain isolated and
no Battery Card UserEvent is generated. See
[`docs/FORGEUI_BATTERY_CARD.md`](docs/FORGEUI_BATTERY_CARD.md).


UserEvents carry genuine interaction into developer code:

```c
void FG_On_Level_Slider_Changed(int32_t value);
void FG_On_Decimal_Spinbox_Changed(int32_t value);

void FG_On_System_Menu_Item_Clicked(
    uint32_t index,
    const char * text);
```

They must not fire because the UI was constructed, hydrated or updated through
a setter. The developer implements application policy; generated code owns
event detection and normalized arguments.

Live regeneration ownership is signature-based. Active hook bodies are
preserved, new active hooks receive one diagnostic stub, and untouched obsolete
Native Component stubs are removed. Customised obsolete Native Component hooks
are preserved in a labelled `#if 0` legacy block rather than compiled against a
Runtime SDK they no longer own. No custom body is migrated to another component
by type, title, position or creation order. Use `90_Studio_Export.h` for the
current Runtime API and `95_UserEvents.h` for active generated hooks.

## Proven Spinbox contract

Spinbox is physically validated through the complete generated SDK boundary on
ESP32-P4 with ESP-IDF 5.5.4 and LVGL 9.2.2:

```c
void FG_Set_<Name>_Value(int32_t value);
void FG_On_<Name>_Changed(int32_t value);
```

Values are native integer backing values; decimal places affect display only.
The setter clamps and suppresses repeats without invoking UserEvents. Native
touch increment/decrement and selected-digit edits invoke exactly one callback
per effective change. Multiple instances and duplicate component names retain
independent state and collision-safe generated symbols.

The contract is emitted only when required by the serialized interface and
selected export features. Live Studio firmware and Standalone Export use the
same generator and export preflight checks. Native LVGL Spinbox is a
digit-selection editor; NumberInput remains the SDK control for free-form
numeric text entry.

## Naming conventions

- Public generated symbols use the `FG_` prefix.
- Runtime APIs generally use `FG_Set_*`, `FG_Add_*`, `FG_Clear_*`,
  `FG_Show_*`, `FG_Hide_*` or `FG_Close_*`.
- UserEvents use `FG_On_*`.
- Private implementation symbols use `fg_*`.
- Names derive from component names after C-identifier sanitization.
- Duplicate names receive deterministic `_2`, `_3` and later suffixes.

Example:

```c
FG_On_System_Menu_Item_Clicked(...)
FG_On_System_Menu_2_Item_Clicked(...)
```

## Developer workflow

1. Name components semantically in Studio.
2. Generate live firmware or a Standalone project.
3. Include `90_Studio_Export.h` where application code projects state.
4. Implement generated hooks declared by `95_UserEvents.h`.
5. Keep hooks short and delegate work to application tasks/services.
6. Rebuild and physically validate on the selected Board Profile.
7. Re-export when the interface contract changes.

Live Studio regeneration preservation-merges matching UserEvent bodies.
Standalone projects become developer-owned after export.

## Relationship to LVGL

The Runtime SDK is a generated semantic layer over native LVGL, not a
replacement renderer and not a web runtime. LVGL objects and private helpers
remain implementation details in `90_Studio_Export.c`.

Advanced developers may use LVGL elsewhere in their application, but stable
product integration should prefer generated APIs instead of reaching into
private generated object names.

## Relationship to exported projects

A Standalone Export is a normal ESP-IDF project. It does not require Studio,
OpenAI, a cloud runtime, a subscription or a device-side ForgeUI service.
Generated headers travel with the project and define its interface-specific SDK
surface.

The Runtime SDK direction does not currently promise:

- binary compatibility across arbitrary regenerated projects;
- one universal header containing every possible widget;
- a separately versioned library package;
- remote device management;
- reflection or dynamic widget discovery on the device.

## Capability model

The Widget Registry already records whether a widget supports Runtime APIs,
UserEvents, children and interaction. Over time this should become a published,
searchable Widget Capability Matrix covering:

- authoring properties;
- native LVGL mapping;
- generated setters/commands;
- UserEvent signatures;
- theme roles;
- feature dependencies;
- live/Standalone support;
- automated, build and physical proof status;
- supported Board Profiles.

The matrix must be generated or checked against Registry metadata where
practical so documentation cannot drift into a second catalogue.

## Future documentation direction

The ForgeUI website should eventually provide:

- searchable Runtime API reference;
- searchable UserEvent reference;
- widget-by-widget capability pages;
- copyable integration examples;
- ownership and threading guidance;
- versioned Board Profile support;
- proof badges linked to evidence;
- migration notes when generated contracts change.

This repository remains authoritative until that reference is implemented and
validated.

## Future Hardware Lab integration

A future Hardware Lab may connect generated SDK entries to repeatable evidence:

- target Board Profile;
- ESP-IDF and LVGL versions;
- build artifact identity;
- automated flash/run procedure;
- touch/action script;
- expected serial events;
- screenshots or recordings;
- FPS and memory observations;
- live/Standalone parity.

This is a direction, not a current automated service. `04_FEATURE_STATUS.md`
remains the present evidence ledger.

## Evolution rules

When a Widget Registry capability changes:

1. update generator and focused tests;
2. update the generated API Code Map;
3. update this SDK direction where the public pattern changes;
4. update Feature Status without overstating proof;
5. preserve live/Standalone parity;
6. document compatibility consequences.

The Runtime SDK should grow from physically credible widget contracts. It must
not become a speculative list of APIs disconnected from native LVGL behaviour.

Current registry evidence is **39 of 39 Standard widgets physically proven
(100%)**. Batch D completed QR Code, Icon Button, Icon final re-proof and Canvas
across the applicable Canvas, Browser Preview, Live and Standalone paths. List
is proven with no setter and one collision-safe
`FG_On_<Name>_Item_Clicked(uint32_t index, const char * text)` callback per
physical row action. Hook names are derived from the Studio component name and
made collision-safe by the generator. TabView remains **PROVEN**.
## 2026-08-01 proof ledger synchronization

Clock and Standard Wi-Fi Status deliberately remain outside `96_FiRuntime`.
Clock projects RTC-owned time through serialized formatting. Wi-Fi Status
projects the existing Wi-Fi backend snapshot through serialized presentation.
Neither has meaningful application-owned setter state, and neither generates a
`95_UserEvents` hook. This API-free decision is part of the capability-driven
Runtime SDK contract, not a missing implementation.

The generated Runtime SDK remains capability-driven. The practical Standard
LVGL proof total is **42**. Button, Text, Heading, Box, Divider, Clock, Wi-Fi
Status, Icon, Span, Animation Image and Image Button are proven. Icon's generic
generated presentation API and optional click contract passed final ESP32-P4
re-proof.
## Generated Fi presentation layer — 2026-08-01

This document remains the generated Runtime SDK reference and naming philosophy.
The Fi-specific canonical pipeline, ownership model and future semantic direction
are documented separately in
[`09_FORGEUI_FI_RUNTIME_GUIDE.md`](09_FORGEUI_FI_RUNTIME_GUIDE.md).

`96_FiRuntime.c/.h` is the first dedicated generated presentation layer in the
Runtime SDK. It owns per-instance Standard Icon visibility, opacity and color
state and safely retains calls made before object binding. 90 remains the LVGL
construction/event layer; 95 remains the only preservation-merged behavior
layer. Default-on presentation and default-off click are resolved per serialized
instance by Registry metadata. File and CMake emission are feature-gated. The
overall feature status is **PROVEN ON ESP32-P4** and contributes to the
practical Standard LVGL proof total of **42**. Batch 1 added and physically
proved three registered widgets. Span and Animation Image intentionally add no
public SDK surface; native Image Button adds a collision-safe
`FG_Set_<Name>_Enabled(bool)` setter and `FG_On_<Name>_Clicked(void)` hook. The
90 → 95 click path is
physically **PROVEN** on ESP32-P4: three independent collision-safe icon hooks
each emitted exactly once per deliberate tap and never on startup. SD remained
ready, and the run's Wi-Fi failure was unrelated. The 90 → 96 presentation path
is also **PROVEN ON ESP32-P4**, including presentation state, independent
instances and Standalone parity.
