# ForgeUI Runtime SDK Direction

This document introduces the long-term ForgeUI Runtime SDK direction. It does
not describe a finished, separately packaged SDK product.

Today the "Runtime SDK" is the coherent developer-facing surface generated with
an interface:

- callable Runtime APIs in `90_Studio_Export.h`;
- genuine-user callbacks in `95_UserEvents.h`;
- required public types and semantic conventions;
- ownership and regeneration rules;
- native LVGL implementation inside generated C.

This document must evolve alongside the Widget Registry.

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

## Runtime APIs

Runtime APIs project application state into the generated interface:

```c
void FG_Set_Level_Slider_Value(int32_t value);
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

## UserEvents

UserEvents carry genuine interaction into developer code:

```c
void FG_On_Level_Slider_Changed(int32_t value);

void FG_On_System_Menu_Item_Clicked(
    uint32_t index,
    const char * text);
```

They must not fire because the UI was constructed, hydrated or updated through
a setter. The developer implements application policy; generated code owns
event detection and normalized arguments.

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
