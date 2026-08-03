# ForgeUI Runtime SDK Direction

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
void FG_Add_Temperature_Chart_Point(int32_t value);
void FG_Clear_Temperature_Chart(void);
void FG_Set_QR_Code_Text(const char * text);
```

The exact current catalogue is authoritative in
[03_ForgeUI_Generated_Export_API_Code_Map.md](03_ForgeUI_Generated_Export_API_Code_Map.md).

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
# Trend Chart

Native Trend Charts expose stable ID-derived semantic APIs:

```c
FG_Add_Engine_Rpm_Point(1825.0f);
FG_Clear_Engine_Rpm();
FG_Set_Engine_Rpm_Range(0.0f, 6000.0f);
FG_Set_Engine_Rpm_Thresholds(4500.0f, 5500.0f);
```

History storage is fixed at 32, 64, 128, or 256 samples and uses circular
updates. Runtime SDK calls update presentation only and never emit UserEvents.
# Alarm Panel

Alarm Panel exports `FG_Add_<Id>_Alarm`, `FG_Acknowledge_<Id>_Alarm`,
`FG_Clear_<Id>_Alarm` and `FG_Clear_All_<Id>_Alarms`. Generated calls update
presentation silently. Alarm selection, acknowledgement and clear UserEvents
receive the stable `const char * alarm_id` identifier.
# IO Monitor

IO Monitor exports semantic channel, state, label and set-all APIs. Channel
selection and writable-output changes are the only generated interaction hooks;
all Runtime SDK setters remain silent.
# Battery Card

Battery Card exposes semantic setters for state of charge, battery state,
electrical measurements, energy, health, time estimates and status. Setters are
silent and contain no BMS or protection behavior.
# Tank Level Card

Exports silent semantic level, volume, capacity, state, flow, threshold and status setters.
# Network Status Card API

An enabled `NetworkStatusCard` exports the stable `fg_network_state_t` enum and identity-scoped setters for state, SSID, IP, gateway, RSSI, latency, cloud, MQTT, internet, local API, and status. Storage is fixed-size and setters are silent: runtime updates never invoke UserEvents.
