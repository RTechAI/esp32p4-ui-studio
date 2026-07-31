# ForgeUI Internal Developer Guide

This is the primary internal manual for extending ForgeUI Studio. It explains
how authoring metadata becomes native LVGL firmware and how to preserve parity
across the complete pipeline.

Current save point:
`FORGEUI_STANDARD_LIST__ITEM_CLICK_HOOKS__READY_FOR_ESP32P4_PROOF__2026-07-31`.

For application-to-hardware examples after export, use
[05_DEVELOPER_HARDWARE_INTEGRATION.md](05_DEVELOPER_HARDWARE_INTEGRATION.md).
For exact generated signatures, use
[03_ForgeUI_Generated_Export_API_Code_Map.md](03_ForgeUI_Generated_Export_API_Code_Map.md).

## 1. Architecture

```text
Official LVGL 9 behaviour
        |
Widget Registry
        |
Tray -> serialized component graph -> hydration
        |
Inspector -> Canvas -> Browser Preview
        |
shared ForgeUILvglExport generator
        |
live firmware or Standalone ESP-IDF project
        |
90_Studio_Export Runtime APIs
95_UserEvents genuine-user callbacks
        |
ESP-IDF build -> ESP32-P4 physical proof
```

ForgeUI Studio is an authoring and generation tool. The target runs native
LVGL C, not a browser runtime. Live Build & Flash and Standalone Export consume
the same project model and generator. A feature is not complete if those paths
diverge.

### Ownership

| Layer | Owner | Rule |
|---|---|---|
| Widget catalogue | `ForgeUIWidgetRegistry.ts` | Single source of truth |
| Board support | Board Registry and profile modules | Never scatter board checks |
| Project state | serialized component graph | Hydration must preserve defaults and old projects |
| Authoring | Tray, Inspector and Canvas | No firmware semantics hidden here |
| Browser simulation | shared preview components | Visual/interaction parity, not hardware truth |
| Native generation | `ForgeUILvglExport.ts` | One live/Standalone generator |
| Export materialization | `studio/export-server.js` | Files, manifests, feature pruning and merge |
| Generated UI | `90_Studio_Export.c/.h` | Replaceable |
| Application hooks | `95_UserEvents.c/.h` | Preservation-merged live; developer-owned standalone |
| Hardware/backend | ESP-IDF application modules | Source of device truth |

## 2. Widget Registry

`studio/src/forgeui/widgets/ForgeUIWidgetRegistry.ts` owns:

- widget type and display name;
- category and search keywords;
- description and documentation ID;
- default geometry and properties;
- insertion factory;
- runtime, UserEvent, child and interaction capabilities;
- availability status.

The Tray queries this Registry. `ForgeUIWidgetSet.ts` projects it for legacy
callers. Do not add a type to a separate array and call that registration.

Registry metadata must be serializable. Defaults are authoring defaults, not a
substitute for defensive hydration or export normalization.

## 3. Standard widget pipeline

Before implementing a widget:

1. Read the official LVGL 9 reference for construction, parts, states, events,
   lifetime and configuration requirements.
2. Inspect the Registry and current status map for a partial earlier slice.
3. Decide the semantic contract:
   presentation-only, output-only, interactive, or container.
4. Identify shared models, controls, preview components, theme roles and export
   helpers to reuse.
5. Define the physical proof that would distinguish correct output from a
   browser approximation.

Then complete one vertical slice:

1. Registry metadata and defaults.
2. Tray discovery and insertion.
3. Serialization and hydration compatibility.
4. Inspector controls.
5. Canvas representation.
6. Browser Preview representation.
7. Native LVGL export.
8. Runtime API only where application-to-UI state exists.
9. UserEvent only where genuine user-to-application behaviour exists.
10. Export-Time Feature Gating.
11. Focused tests.
12. Documentation.
13. ESP-IDF build and physical proof.

Do not create placeholder LVGL, browser-only behaviour, duplicate renderers or
widget-local copies of shared naming/theme/runtime helpers.

## 4. Inspector and property models

Inspectors edit serialized properties through existing form hooks and controls.
Prefer shared `TextControl`, `NumberControl`, `SwitchControl`, colour controls
and selection controls. Put normalization used by more than one surface in a
shared Standard-widget model.

A shared model should:

- accept unknown or legacy values defensively;
- supply stable defaults;
- clamp or normalize invalid numeric data;
- filter malformed collections;
- be deterministic;
- avoid mutating serialized input.

Canvas, Browser Preview and export should consume the same normalized meaning.
Do not fix malformed values in only one renderer.

## 5. Canvas

Canvas is an editor:

- selection, move and resize gestures must remain available;
- simulated widget interaction must not unexpectedly mutate project JSON;
- child ownership and geometry must match serialization;
- preview hit targets must not hide selection handles;
- configured theme roles must be visible.

Use local preview state for temporary interaction when appropriate. Persistent
changes must pass through normal component actions so undo/redo and hydration
remain correct.

## 6. Browser Preview

Browser Preview represents intended behaviour, not a second implementation.
Reuse the same Standard preview component used by Canvas wherever editing
gestures do not require a wrapper difference.

Parity means:

- identical normalized labels, ranges, indexes and defaults;
- equivalent semantic theme roles;
- equivalent enabled, disabled, checked, pressed and selected meaning;
- no browser feature that export cannot reproduce;
- no claim of hardware proof from browser behaviour.

## 7. Theme system

Standard widgets resolve semantic roles through the ForgeUI theme helpers:

- primary and secondary surfaces;
- surface border;
- primary and secondary text;
- accent and accent text;
- selected surface;
- disabled text;
- semantic status colours where explicitly defined.

Prefer semantic roles over hard-coded colours. Explicit per-widget overrides
may replace a semantic fallback when the Registry property contract supports
them. Canvas, Browser Preview and LVGL export must resolve the same intent even
when the rendering APIs differ.

## 8. Native LVGL export

`generateForgeUILvglCode()` traverses the serialized component graph and emits
native LVGL 9 construction and runtime code. Use the installed LVGL version's
real API. Keep construction silent and deterministic.

Generated naming has two levels:

- public `FG_*` symbols, derived from component names and collision-safe;
- private `fg_*` helpers and retained state, implementation-only.

Multiple instances must never share accidental state, object names or event
data. Shared callbacks are encouraged when immutable per-instance data routes
the event correctly.

## 9. Runtime APIs

A Runtime API is application-to-UI:

```c
void FG_Set_Temperature_Bar_Value(int32_t value);
```

Generate one only when the widget owns meaningful state the application may
project. Setters should:

- guard missing objects;
- normalize and clamp inputs;
- suppress repeated effective values when appropriate;
- update retained state and LVGL consistently;
- remain silent with respect to UserEvents.

Presentation-only widgets have no API. Do not invent state because an API
would look convenient.

## 10. UserEvents

A UserEvent is UI-to-application:

```c
void FG_On_System_Menu_Item_Clicked(
    uint32_t index,
    const char * text);
```

Hooks must represent genuine user interaction only. Register callbacks after
initial state where ordering matters. Programmatic setters, construction,
hydration and startup must not call the hook.

`95_UserEvents.h` declares the generated contract. Live Studio generation
preservation-merges matching developer bodies in `95_UserEvents.c`.
Standalone Export copies that layer into the developer-owned project.

Keep hook bodies short. Queue application work rather than blocking the LVGL
thread. Do not retain callback text pointers unless the widget contract
explicitly guarantees their lifetime.

## 11. Collision-safe naming

Names derive from the user-visible component name, are converted to valid C
identifiers and allocated against existing generated symbols. Collisions use
deterministic suffixes:

```c
FG_On_System_Menu_Item_Clicked(...)
FG_On_System_Menu_2_Item_Clicked(...)
```

Tests must cover duplicate names, punctuation, numeric prefixes where relevant,
and collisions across compatible API families.

## 12. Board Profiles

Board Profiles describe supported hardware identity and capabilities. Project
hardware selection must be hydration-safe and shared by:

- live Build & Flash;
- Standalone Export;
- generated feature headers;
- dependency and source selection.

Do not infer board support from an isolated macro. A production profile needs
the complete build, flash, display, touch and dependency contract.

## 13. Export-Time Feature Gating

Feature gating is a coordinated export operation:

```text
project feature selection
 -> 00_ForgeUI_Features.h
 -> generated runtime sections
 -> CMake source list
 -> managed component dependencies
 -> idf_component.yml
```

Disabled features should not consume runtime objects, tasks, queues, source
files or dependencies through another path. Test both enabled and unused cases.

## 14. Lazy Runtime

Large System tools may own UI-local resources only while open. Lazy Runtime
requires:

- demand creation;
- guarded repeated entry;
- safe asynchronous shutdown where workers are involved;
- deletion after acknowledgement;
- pointer nulling;
- backend lifetime documented separately.

Destroying a Wi-Fi Manager page must not imply shutting down ESP-Hosted.
Destroying Storage UI must not imply unmounting or deleting the SD backend.

## 15. Live and Standalone ownership

Live generation writes the reference firmware used by Studio Build & Flash.
Studio may regenerate replaceable output while preserving matching UserEvent
bodies.

Standalone Export creates a normal developer-owned ESP-IDF project. It must
contain the same generated application widget/API/hook sections for the same
project and feature profile. Studio does not manage that project afterward.

Permanent product logic belongs in application modules and the developer hook
layer, not manual patches to `90_Studio_Export.*`.

## 16. Testing philosophy

Test the contract, not only snapshots:

- Registry completeness and unique metadata;
- Tray search and insertion;
- default persistence and hydration;
- Inspector property updates;
- Canvas selection and editing behaviour;
- Browser Preview meaning;
- exact native LVGL calls;
- semantic theme selectors;
- multiple instances;
- collision-safe APIs and hooks;
- startup and programmatic suppression;
- export when used and absence when unused;
- `95_UserEvents` declaration/stub generation and preservation;
- live/Standalone payload parity;
- server syntax and generated file ownership.

Never weaken a test merely to accept new output. Update expectations when the
documented contract intentionally changes.

## 17. Physical proof philosophy

Automated tests, Browser Preview, generated C, successful ESP-IDF build and
physical proof are different evidence levels.

**PROVEN** requires recorded target-hardware behaviour for the claimed scope.
Typical proof includes:

- clean build and flash;
- correct geometry and theme;
- touch behaviour;
- expected serial hook output;
- silent startup and setters;
- multiple instances;
- navigation/lifecycle repetition;
- FPS, heap and leak observation where relevant;
- Standalone parity when claimed.

Until then use **READY FOR PROOF** or **PARTIAL**.

## 18. Documentation standards

Every completed slice must update:

- `01_SPINE.md` for architecture or milestone changes;
- `02_DEVELOPER_CODE_MAP.md` for ownership/file changes;
- `03_ForgeUI_Generated_Export_API_Code_Map.md` for generated SDK changes;
- `04_FEATURE_STATUS.md` for evidence;
- this guide for workflow changes;
- `07_FORGEUI_RUNTIME_SDK.md` when the public generated surface changes;
- a focused widget guide when authoring or integration needs detail;
- `README.md` only for current project-level capabilities.

Do not copy a status claim into many places without naming the authoritative
evidence document. Historical documents belong under `docs/history`.

## 19. Widget completion checklist

- [ ] Official LVGL 9 reference inspected
- [ ] Registry is authoritative
- [ ] No earlier partial Standard widget skipped
- [ ] Defaults serialize and hydrate
- [ ] Inspector uses shared controls
- [ ] Canvas remains editable
- [ ] Browser Preview matches meaning
- [ ] Native LVGL is real and feature-gated
- [ ] Runtime API classification justified
- [ ] UserEvent classification justified
- [ ] Naming is collision-safe
- [ ] Multiple instances tested
- [ ] Startup/programmatic suppression tested
- [ ] Live and Standalone generation tested
- [ ] Documentation aligned
- [ ] Physical proof recorded before PROVEN

## 20. Current direction

Finish and physically prove the Standard Widget library first. Do not begin the
dedicated Dashboard Widget family early. The Runtime SDK documentation should
grow from proven generated contracts rather than speculative APIs.

### Native Spinbox example

Spinbox is a reference interactive numeric slice:

- one normalization model feeds Canvas, Browser Preview and export;
- the Registry owns discovery, defaults and Runtime/UserEvent capabilities;
- Canvas is non-interactive to preserve editor movement;
- Browser Preview simulates native integer-backed digit formatting;
- export uses `lv_spinbox_create` plus native touch helper buttons;
- `FG_Set_<Name>_Value(int32_t)` is silent;
- `FG_On_<Name>_Changed(int32_t)` is genuine-user-only;
- decimals are display formatting over the integer backing value.

See [FORGEUI_SPINBOX_WIDGET.md](docs/FORGEUI_SPINBOX_WIDGET.md).
