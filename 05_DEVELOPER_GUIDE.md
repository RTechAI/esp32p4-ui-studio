# ForgeUI Internal Developer Guide

This is the primary internal manual for extending ForgeUI Studio. It explains
how authoring metadata becomes native LVGL firmware and how to preserve parity
across the complete pipeline.

Current save point:
`FORGEUI_LVGL9_COMPLETE__44_OF_44_PRACTICAL_WIDGETS_PROVEN__ESP32P4_VALIDATED__DOCUMENTATION_COMPLETE__READY_FOR_NATIVE_FORGEUI_PLATFORM__2026-08-02`.

Current ForgeUI Platform milestone:
`FORGEUI_NATIVE_COMPONENT_3__RELAY_PANEL_PROVEN__ESP32P4_VALIDATED__RUNTIME_SDK_USEREVENTS_MASTER_CONTROL_PROVEN__READY_FOR_PWM_CONTROLLER__2026-08-02`.

Dashboard Card is **ForgeUI Native Component #1 — PROVEN**. It validates the
application-level composite pattern while remaining one serialized and
Canvas-owned component. Extend this pattern through the existing Registry,
preview, shared generator, Runtime SDK and UserEvents; do not expose private
LVGL composition. Sensor Tile is **ForgeUI Native Component #2 — PROVEN**
through the same pattern. Its semantic serialization, Browser Preview,
Live/Standalone output, Runtime SDK, UserEvents, stable public identity,
ownership reconciliation and ESP32-P4 behavior are validated. Runtime symbols
and active developer hooks survive regeneration correctly.

Relay Panel is now **PROVEN** through the same architecture on ESP32-P4. It uses zero-based bounded channels, silent semantic Runtime
setters, genuine-user channel/master hooks and application-owned hardware
drivers. PWM Controller is next and has not started. Confirmation prompts are deliberately deferred until one shared
Browser/LVGL confirmation path exists.

For application-to-hardware examples after export, use
[05_DEVELOPER_HARDWARE_INTEGRATION.md](05_DEVELOPER_HARDWARE_INTEGRATION.md).
The current hardware-example sequence is Example 01, Example 02, Example 03,
Example 04 — Online Services / Live Weather, and Example 05 — GPS / GNSS. The
physically proven GPS/GNSS wiring, Studio loading, standalone export, and
ESP-IDF 5.5.4 Build & Flash workflow are in
[11.05_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_05__GPS_GNSS.md](11.05_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_05__GPS_GNSS.md).
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
90_Studio_Export Runtime APIs and generated 96_FiRuntime presentation APIs
95_UserEvents genuine-user callbacks
        |
ESP-IDF build -> ESP32-P4 physical proof
```

ForgeUI Studio is an authoring and generation tool. The target runs native
LVGL C, not a browser runtime. Live Build & Flash and Standalone Export consume
the same project model and generator. A feature is not complete if those paths
diverge.

For asset-backed projects, the real lifecycle is: load, materialize required conversions, perform applicable cleanup, collect actual dependencies, verify existence, run strict validation, generate, build, then flash only on an explicit Build & Flash action. `assets/...` is canonical relative to `firmware/ForgeUI-One/main` and retains that structure in standalone export. Cleanup preserves permanent Studio sources and committed permanent derived assets. Ephemeral Fi conversions may be removed only when authoritative rematerialization is guaranteed before validation. Never weaken missing-generated-C refusal or substitute a placeholder.

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
| Fi Icon presentation runtime | `96_FiRuntime.c/.h` | Generated and replaceable; call its APIs but keep permanent logic elsewhere |
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

The current generated hook set owns Native Component callback signatures.
Regeneration preserves an active customised body exactly, adds one placeholder
for a newly active hook, and removes an obsolete Native Component hook only
when its body is the untouched ForgeUI diagnostic placeholder. Obsolete
customised Native Component hooks are retained inside a clearly marked
non-compiling legacy block so stale Runtime SDK calls cannot break firmware.
Standard widget hooks and unrelated developer functions are not reconciled by
this Native Component cleanup. Treat `90_Studio_Export.h` as the source of truth
for Runtime SDK names and `95_UserEvents.h` as the active callback contract.

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

### GPT/operator proof handoff

Treat the active GPT as the technical manager for the complete proof loop. Once
the software slice, focused tests and both export paths are ready, the required
handoff phrase is **Export to IDF**. The operator performs the normal Studio
standalone export, opens it in VS Code, flashes the ESP32-P4, exercises the
specified interactions and pastes the terminal output back. The GPT audits the
returned evidence, completes documentation and totals, marks PROVEN only after
the evidence supports it, and stops before starting another widget. Do not
substitute repeated direct COM-port troubleshooting unless the operator asks.

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

All 44 registered practical Standard LVGL widgets/components are physically
proven. Closure Batch 1 proved Span, Animation Image and Image Button; Closure
Batch 2 proved Window; the final hardware pass proved Menu. Lottie remains an
explicit dependency-heavy exclusion. Practical LVGL parity is complete and
the next chapter is ForgeUI Platform development, beginning with ForgeUI-native
Widgets. Future work must reuse proven generated contracts rather than
introduce speculative duplicates.

### Native Spinbox example

Spinbox is a completed, physically proven interactive numeric slice:

- one normalization model feeds Canvas, Browser Preview and export;
- the Registry owns discovery, defaults and Runtime/UserEvent capabilities;
- Canvas helper controls update the component store while the drag wrapper
  preserves editor movement outside interactive hit targets;
- Browser Preview simulates native integer-backed digit formatting;
- export uses `lv_spinbox_create` plus native touch helper buttons;
- `FG_Set_<Name>_Value(int32_t)` is silent;
- `FG_On_<Name>_Changed(int32_t)` is genuine-user-only;
- decimals are display formatting over the integer backing value.

The final ESP32-P4 / ESP-IDF 5.5.4 / LVGL 9.2.2 proof covered Registry, Tray
drag/drop, Canvas controls, Inspector synchronization, Browser Preview, native
live export, Runtime SDK, `95_UserEvents`, feature gating and Standalone Export.
It confirmed increment/decrement, signed values, decimal formatting, rollover,
clamp, multiple instances, collision-safe names and exactly one hook per
effective user action. Programmatic setters remained silent.

Proof resolved the Tray-to-Canvas accept-list omission, click-consuming Canvas
drag wrapper, stale preview synchronization, stale generated firmware artifact,
off-screen helper arrows caused by malformed coordinates, live/Standalone
parity verification gaps and missing export preflight validation.

Native LVGL Spinbox is a digit-selection editor, not a free-form numeric text
field. Use NumberInput when arbitrary numeric text entry is required.

The authoritative registry contains 44 practical Standard LVGL
widgets/components. **All 44 are physically proven on ESP32-P4**; Menu is
**PROVEN**.

### Native List proof

List uses native `lv_list_create`, optional `lv_list_add_text`, and one
`lv_list_add_button` per normalized item. It has no retained selection state
and therefore no Runtime setter. Interactive rows generate the collision-safe
`FG_On_<Name>_Item_Clicked(uint32_t index, const char * text)` hook. `<Name>` is
derived from the Studio component name and made collision-safe by the generator.
On the Waveshare ESP32-P4-WIFI6-Touch-LCD-7B, controlled single taps on
Overview, Settings and Diagnostics produced exactly one callback each with
matching indices 0, 1 and 2 and text. Repeated taps remained stable; TabView
and Spinbox continued operating; Wi-Fi remained connected; SD remained ready;
runtime remained stable; and connected-stage internal RAM was approximately
39 KB free. Live and standalone ESP-IDF 5.5.4 builds use LVGL 9.2.2 and compile
from the same generated output. **LIST — PROVEN ON ESP32-P4**.

See [FORGEUI_SPINBOX_WIDGET.md](docs/FORGEUI_SPINBOX_WIDGET.md).
## 2026-08-01 end-of-sprint engineering state

The practical Standard LVGL proof ledger is **43**, with Menu active in the
Registry and ready for physical proof. Text, Clock, Wi-Fi Status, Image and
Line are proven through native constructors, shared preview/export models,
Live/Standalone output and ESP32-P4 physical validation. Button,
Heading, Box and Divider are physically proven. The sprint also completed
native TileView replacement, Text multiline wrapping parity, Icon automatic
sizing/clipping correction, Divider vertical-drop usability, Heading
multiline/alignment parity and Box child/nesting parity. Text has since
completed physical validation and is **PROVEN**. Batch D subsequently completed
Icon final physical re-proof together with QR Code, Icon Button and Canvas.
## Calling a Standard Fi Icon at runtime

Enable **Generate runtime API** on the Icon (on by default), give the component
a stable name, include `90_Studio_Export.h` or `96_FiRuntime.h`, then call:

```c
FG_Set_Living_Room_AirPlay_Visible(true);
FG_Set_Living_Room_AirPlay_Opacity(220);
FG_Set_Living_Room_AirPlay_Color(0xF2A900);
```

Enable **tap/click** only for an input icon, then implement the generated
`FG_On_Living_Room_AirPlay_Clicked(void)` body in `95_UserEvents.c`. Live Studio
regeneration replaces 90 and 96 but preservation-merges matching 95 bodies.
Standalone output becomes developer-owned under the normal export rules. Full
contract: [`09_FORGEUI_FI_RUNTIME_GUIDE.md`](09_FORGEUI_FI_RUNTIME_GUIDE.md).

For ForgeUI Native Component semantic setters, root UserEvents, generated-file
ownership and LVGL task-safety, use
[`10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md`](10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md).

Current evidence is **PROVEN ON ESP32-P4**. The
90 → 95 click path is physically **PROVEN** on ESP32-P4 across three independent,
collision-safe callbacks, exactly once per deliberate tap and never at startup.
SD stayed ready; an observed Wi-Fi failure was unrelated. The 90 → 96
presentation path is physically proven: color, opacity, hide/show, pre-bind
retention, repeated silent setters, independent presentation instances,
Standalone parity and click-disabled non-interaction were accepted. The
setters, Icon and complete Fi Runtime are physically proven.
