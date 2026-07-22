# ForgeUI Generated Export API — Permanent Code Map

## Current proven save point

**FORGEUI_FIVE_INTERACTIVE_ASSETS__THREE_GENERATED_RUNTIME_FAMILIES__VALIDATED_API_BOUNDARY__TOGGLE_PHYSICAL_VALIDATION_PENDING__2026-07-22**

## Purpose and scope

This document defines the permanent boundary between:

- ForgeUI-generated UI and runtime code; and
- developer-owned application code.

It is an architectural code map, not a milestone diary, proposal, or roadmap.

This document remains separate from `02_DEVELOPER_CODE_MAP.md`:

```text
02_DEVELOPER_CODE_MAP.md
  → Whole Studio and Interactive Asset subsystem map

03_ForgeUI_Generated_Export_API_Code_Map.md
  → Generated firmware API, file ownership, hook, and public-setter boundary
```

Use this map to determine:

- where generated firmware code originates;
- which layer owns API naming and metadata;
- which files Studio writes;
- which files become developer-owned after standalone export;
- how UI input reaches developer code;
- how developer code updates UI outputs;
- which responsibilities must not be duplicated.

## System overview

The generated export layer supports five Interactive Asset types:

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

Button is momentary input. Toggle Switch is persistent boolean input. Three-Position Toggle is persistent enum input. Light and Status Indicator are developer-controlled outputs.

```text
ForgeUI Canvas
        │
        ▼
generateForgeUILvglCode()
        │
        ▼
Generated LVGL Source
Generated Button, Toggle and Three-Position hook metadata
Generated Binary Output public API metadata
Generated Asset Source List
        │
        ▼
Client Export Preflight
        │
        ▼
POST /export
        │
        ▼
Server Export Validation
        │
        ▼
Validated Asset Sources
        │
        ▼
Export Server
        │
        ▼
Generated Firmware Files
        │
        ▼
ESP-IDF Build
        │
        ▼
ESP32-P4
```

The generated output-control path is:

```text
Developer application logic
        ↓
Generated FG_Set_* public APIs
        ↓
Shared Binary Output Runtime
        ↓
Generated LVGL Runtime
        ↓
ESP32-P4 Display
```

Interactive Light and Interactive Status Indicator both use this path. The output runtime is no longer a Light-only implementation.

The generated input-control path is:

```text
UI interaction
        ↓
Generated LVGL runtime
        ↓
Generated FG_On_* hook
        ↓
95_UserEvents.c
        ↓
Developer application logic
```

## Export Validation Ownership

Export validation is a permanent two-boundary responsibility. It validates the exporter result before materialization without moving runtime generation out of the exporter.

### Client Validation

#### `studio/src/forgeui/ForgeUIExportValidation.ts`

Owns:

- Canvas validation
- Interactive Asset validation
- dimension validation
- duplicate component-ID detection
- uploaded-asset and LVGL-readiness validation
- generated Button, Toggle and Three-Position hook presence and naming validation
- generated Binary Output setter API validation
- Normal/Pressed, Toggle OFF/ON, Three-Position LEFT/CENTER/RIGHT and Binary Output OFF/ON uploaded-state validation
- generated asset-source validation
- structured, ownership-grouped diagnostics

It validates. It does not generate LVGL, firmware, hooks, setters, CMake, or runtime behavior.

The client currently validates expected hook names against `userEventHooks`, setter declarations against `publicApiDeclarations`, kind/state references, image readiness and duplicate generated identifiers. Generated enum and runtime-structure text is covered by exporter regression tests; it is not a separate client diagnostic category, so this map does not attribute unimplemented declaration parsing to the preflight.

Client validation runs after candidate source and metadata generation and before the request is sent to the export server. A failure cancels export before server submission.

### Server Validation

#### `studio/export-server.js`

In addition to materialization, the server owns:

- payload validation
- generated C-source validation
- physical generated-source existence checks
- relative path validation
- expected-symbol and generated-code reference checks
- construction of the validated asset-source list
- validation before filesystem mutation

The server does not trust client validation. No generated firmware files are written before server validation succeeds.

## Permanent input and output API model

ForgeUI controls cross the generated/developer boundary in one of two directions, with three distinct input signatures.

### Input controls: generated UI calls developer code

Input controls originate in the UI runtime and notify application code through generated developer hooks.

Input contracts:

```c
/* Momentary input: Interactive Button */
void FG_On_<Name>_Clicked(void);

/* Persistent binary input: Interactive Toggle Switch */
void FG_On_<Name>_Toggled(bool enabled);

/* Persistent three-state input: Interactive Three-Position Toggle */
void FG_On_<Name>_Changed(fg_three_way_state_t state);
```

Generated Three-Position state type:

```c
typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;
```

Input flow:

```text
Interactive Button
        ↓
LVGL CLICKED event
        ↓
Generated runtime callback
        ↓
FG_On_Button_Clicked()
        ↓
95_UserEvents.c
        ↓
Developer application logic
```

### Output controls: developer code calls generated UI

Output controls expose public functions implemented by generated UI code. Application code calls those functions to change LVGL objects.

Proven example:

```text
Developer application logic
        ↓
FG_Set_Status_Light(true)
        ↓
Shared Binary Output Runtime
        ↓
LVGL image source changes
        ↓
Physical Light displays ON state
```

```c
FG_Set_Status_Light(true);
FG_Set_WiFi_Status(true);
```

Both public APIs are implemented in generated UI code and delegate to the same generated Binary Output Runtime.

### Permanent rule

> Inputs produce generated developer hooks. Outputs expose generated public UI functions.

Input hooks may be void click hooks, bool state hooks or strongly typed enum state hooks. Outputs continue to expose `void FG_Set_<Name>(bool enabled);`.

Do not implement output controls as fake click hooks. Do not put input-event application logic inside generated UI code.

## LVGL code generator

### Primary file

```text
studio/src/forgeui/ForgeUILvglExport.ts
```

### Primary function

```ts
generateForgeUILvglCode()
```

This is the only LVGL UI exporter.

Runtime generation assumes that its candidate result will pass the dedicated client and server validation boundaries before materialization. Validation policy is not mixed into runtime generation.

### Owns

- LVGL object generation
- widget creation
- image declarations
- uploaded asset-source collection
- shared runtime structures
- shared runtime callbacks
- shared Binary Output Runtime
- generated Binary Output runtime records
- Interactive Button export
- Interactive Light export
- Interactive Status Indicator export
- Interactive Toggle Switch export
- Interactive Three-Position Toggle export
- shared Toggle Input Runtime and per-instance records
- shared Three-Position Input Runtime and per-instance records
- Toggle and Three-Position hook naming and metadata
- input callback-name uniqueness across all hook families
- shared Binary Output Runtime generation
- shared Binary Output setter generation
- per-instance Binary Output runtime record generation
- Button hook generation and metadata
- generated public output APIs and declaration metadata
- calls from generated runtime code into developer hooks
- uniqueness of generated hook and setter names

### Does not own

- writing files to disk
- ESP-IDF project copying
- CMake file writing
- customer hardware behavior
- developer application logic
- GPIO, sensors, motors, relays, networking policy, or business logic

Interactive Light introduced the Binary Output Runtime. Interactive Status Indicator reuses it through the same export descriptor, runtime-record, and setter-generation path.

The exporter emits Three-Position runtime code that uses `fg_three_way_state_t`; the enum itself is materialized by the user-event header generator in `95_UserEvents.h`.

Do not create a separate Button, Toggle, Three-Position, Light or Status Indicator exporter, or a parallel runtime generator.

## Component export traversal

The exporter walks the ForgeUI component tree and selects the correct component branch. Its traversal owns:

- child traversal
- unique internal LVGL object names
- component position and size
- component-type dispatch
- asset-source collection
- recursive export of nested children

Current internal object names such as `obj1`, `obj2`, and `obj3` are implementation details. They are suitable for generated LVGL variables but are not the stable developer API.

Developer-facing hook and setter names are derived separately and made unique within an export.

## Generated export result contract

`generateForgeUILvglCode()` returns:

- generated LVGL `code`;
- `assetSources: string[]` containing generated C source paths required by the UI;
- `userEventHooks: string[]` containing sanitized unique hook names for Button, Toggle and Three-Position inputs;
- `publicApiDeclarations` for Binary Output setters, including Interactive Light and Interactive Status Indicator.

These four properties are the complete current contract. All input families share the one generalized `userEventHooks` string collection; there are no separate Button, Toggle or Three-Position payload fields. Hook suffixes encode signature selection downstream: `Clicked`, `Toggled`, or `Changed`. Binary Output declarations use `publicApiDeclarations: string[]` and retain the exact `void FG_Set_*(bool enabled);` text.

The UI export actions in `studio/src/components/Header.tsx` send these values to both export endpoints:

- `POST /export`
- `POST /export-idf-project`

The frontend owns code generation, metadata collection, client preflight, and transport. It does not write firmware files directly. Validation occurs before materialization.

## Generated Asset Source Contract

Every generated asset source included in an export must have:

- a valid relative path under the firmware source boundary;
- an existing generated C file;
- the expected LVGL symbol in that source;
- one unique source and symbol registration;
- successful validation before CMake generation.

Built-in Theme assets participate in this same contract. They are permanent generated firmware assets, not validation-exempt resources.

## Interactive Button input API

### Export branch

The `InteractiveButton` exporter branch owns:

1. reading `interactiveAssetId`;
2. resolving the Interactive Button asset by kind;
3. resolving Normal and Pressed uploaded assets;
4. using the preflight-validated Normal and Pressed image metadata;
5. adding required asset C files;
6. declaring LVGL images;
7. creating the parent LVGL button;
8. creating the child LVGL image;
9. creating per-button runtime data;
10. attaching the shared Button event callback;
11. collecting the unique generated click hook.

Button runtime generation assumes validated image assets. It does not perform late export validation while emitting runtime code.

### Proven runtime data

```c
typedef struct
{
    const void * normal_src;
    const void * pressed_src;
    void (*clicked_cb)(void);
    const char * event_name;
} fg_interactive_button_data_t;
```

Each exported Button instance carries:

- its Normal image source;
- its Pressed image source;
- its generated developer callback pointer;
- its generated event name for runtime diagnostics.

This is implemented behavior, not a proposed extension.

### Shared Button callback

```c
static void fg_interactive_button_event_cb(lv_event_t *event)
```

One shared callback serves every exported Interactive Button. Per-instance runtime data supplies the correct images and developer hook.

Behavior:

```text
LV_EVENT_PRESSED
  → select Pressed image

LV_EVENT_RELEASED or LV_EVENT_PRESS_LOST
  → restore Normal image

LV_EVENT_CLICKED
  → print the generated event name
  → call clicked_cb when non-null
```

Do not generate one LVGL callback implementation per Button.

### Instance wiring

Each ready Button instance initializes data equivalent to:

```c
static fg_interactive_button_data_t obj1_data = {
    .normal_src = &normal_symbol,
    .pressed_src = &pressed_symbol,
    .clicked_cb = FG_On_Button_Clicked,
    .event_name = "FG_On_Button_Clicked",
};
```

It registers the shared callback for:

- `LV_EVENT_PRESSED`
- `LV_EVENT_RELEASED`
- `LV_EVENT_PRESS_LOST`
- `LV_EVENT_CLICKED`

The visual-state runtime and click-hook runtime are parts of the same generated Button implementation.

### Button hook naming

Each exported Interactive Button receives one unique hook using the `FG_On_*_Clicked` contract.

Examples:

```c
void FG_On_StartPump_Clicked(void);
void FG_On_StopPump_Clicked(void);
void FG_On_ResetAlarm_Clicked(void);
```

The exporter prevents duplicate hook names by adding a suffix when necessary. Generated C identifiers are sanitized; developer code must use the exact emitted hook name.

### Button hook metadata path

```text
InteractiveButton component
        ↓
unique FG_On_*_Clicked name
        ↓
userEventHooks returned by generateForgeUILvglCode()
        ↓
Header export payload
        ↓
export-server.js
        ↓
generateUserEventFiles()
        ↓
95_UserEvents.h declaration
95_UserEvents.c implementation stub
```

## Interactive Toggle Switch input API

### Export branch

The `InteractiveToggleSwitch` export path:

1. resolves the Toggle Switch by kind;
2. resolves OFF and ON uploaded assets;
3. collects their required generated C sources;
4. generates a unique `FG_On_*_Toggled` name and adds it to `userEventHooks`;
5. creates a full-size parent LVGL button and child image;
6. creates an independent `fg_toggle_input_t` record;
7. initializes from the saved state through `fg_toggle_input_set(..., notify=false)`;
8. attaches the shared click callback.

### Shared Toggle Input Runtime

Actual generated structure:

```c
typedef struct {
    lv_obj_t * button;
    lv_obj_t * image;
    const void * off_src;
    const void * on_src;
    bool enabled;
    void (*toggled_cb)(bool);
} fg_toggle_input_t;
```

Shared helpers:

```c
fg_toggle_input_set()
fg_toggle_input_event_cb()
```

Behavior:

```text
LV_EVENT_CLICKED
  → invert enabled
  → store independent instance state
  → update OFF/ON artwork
  → invoke toggled_cb(new bool state)
```

The structure, setter and event callback are emitted once. Each Toggle instance owns its button, image, sources, state and callback pointer.

### Generated Toggle hook

```c
void FG_On_Main_Power_Toggled(bool enabled);
```

`generateUserEventFiles()` produces a live stub that prints `ON` or `OFF`. Initialization uses `notify=false`, so loading the configured initial state does not call developer code.

## Interactive Three-Position Toggle input API

### Generated public enum

`fg_three_way_state_t` is generated in `95_UserEvents.h`, not `90_Studio_Export.h`. Generated `90_Studio_Export.c` includes `95_UserEvents.h` before using the type in runtime records and callback pointers, and developer implementations include the same header.

```c
typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;
```

### Export branch

The `InteractiveThreePositionToggleSwitch` export path:

1. resolves the asset by kind;
2. resolves LEFT, CENTER and RIGHT uploaded assets;
3. collects all required C sources;
4. generates a unique `FG_On_*_Changed` name and adds it to `userEventHooks`;
5. creates the full rectangular parent button and child image;
6. creates an independent `fg_three_way_input_t` record;
7. initializes the saved enum state with `notify=false`;
8. attaches the one shared `fg_three_way_input_event_cb()`.

### Shared Three-Position Input Runtime

Actual generated structure:

```c
typedef struct {
    lv_obj_t * button;
    lv_obj_t * image;
    const void * left_src;
    const void * center_src;
    const void * right_src;
    fg_three_way_state_t state;
    void (*changed_cb)(fg_three_way_state_t state);
} fg_three_way_input_t;
```

`fg_three_way_input_set()` validates state, stores it, selects the correct source, updates the image and optionally calls `changed_cb`. Initialization passes `notify=false`.

`fg_three_way_input_event_cb()` converts the absolute pointer coordinate into button-local space:

```c
local_x = point.x - button_coords.x1;
```

```text
first third  → FG_THREE_WAY_LEFT
middle third → FG_THREE_WAY_CENTER
last third   → FG_THREE_WAY_RIGHT
```

The parent button owns the full rectangular hit area. The child image is non-clickable, and parent and child are non-scrollable. Transparent artwork does not shrink the interaction bounds.

### Generated Three-Position hook

```c
void FG_On_ModeSelector_Changed(fg_three_way_state_t state);
```

The generated live stub maps enum values to readable `LEFT`, `CENTER` and `RIGHT` output. One shared runtime is emitted; per-instance state, artwork and callback pointers remain independent.

## Interactive Light output API

### Export preparation and branch

Interactive Light export owns:

1. reading `interactiveAssetId`;
2. resolving the Interactive Light asset by kind;
3. resolving OFF and ON uploaded assets;
4. using the preflight-validated OFF and ON image metadata;
5. adding required asset C files;
6. creating a non-clickable LVGL image;
7. selecting its initial source from saved `initialState`;
8. creating a unique public setter name;
9. emitting the setter implementation;
10. returning its declaration as public API metadata.

Light runtime generation likewise assumes validated image assets and API metadata. It does not perform late export validation while emitting runtime code.

### Runtime object behavior

Interactive Light is an output indicator, not an input control.

- It is emitted as an LVGL image.
- The object remains non-clickable.
- It has no Button-style event callback.
- It produces no hook in `95_UserEvents`.
- Its initial OFF/ON image follows the saved `initialState`.

### Proven public setter

Example declaration:

```c
void FG_Set_Status_Light(bool enabled);
```

The generated implementation delegates to the Light instance's Binary Output runtime record:

```c
void FG_Set_Status_Light(bool enabled)
{
    fg_binary_output_set(&fg_status_light_output, enabled);
}
```

Contract:

```text
false → OFF artwork
true  → ON artwork
```

Setter names use `FG_Set_*`. Duplicate API names receive a numeric suffix.

### Binary Output public declaration metadata path

```text
InteractiveLight or InteractiveStatusIndicator component
        ↓
unique FG_Set_* name
        ↓
setter implementation in generated LVGL code
        ↓
publicApiDeclarations returned by generateForgeUILvglCode()
        ↓
Header export payload
        ↓
export-server.js
        ↓
generateStudioExportHeader()
        ↓
declaration in 90_Studio_Export.h
```

The export server validates declarations against the supported setter signature before writing them:

```c
void FG_Set_<Name>(bool enabled);
```

## Binary Output Runtime

The generated Binary Output Runtime is the permanent implementation family for two-state output assets.

It is unrelated to Toggle Input even though both cross an API boundary with a boolean:

```text
Toggle Switch: UI changes state → developer hook receives bool
Binary Output: developer calls setter → UI changes state
```

Generated runtime structure:

```c
typedef struct
{
    lv_obj_t * image;
    const void * off_src;
    const void * on_src;
    bool enabled;
} fg_binary_output_t;
```

Generated state-change function:

```c
static void fg_binary_output_set(
    fg_binary_output_t * output,
    bool enabled
)
{
    if (!output || !output->image)
    {
        return;
    }

    output->enabled = enabled;
    lv_image_set_src(
        output->image,
        enabled ? output->on_src : output->off_src
    );
}
```

This structure and function are generated once per export. Interactive Light introduced them; Interactive Status Indicator reuses them unchanged.

Every exported Binary Output instance creates its own `fg_binary_output_t` record containing its LVGL image, OFF source, ON source, and saved state. Multiple records remain independent even when instances reuse the same artwork.

Every generated Binary Output setter calls `fg_binary_output_set()` with its own record. Future Binary Output assets must reuse this implementation rather than emit another binary state structure or switching function.

## Interactive Status Indicator output API

### Export preparation and branch

Interactive Status Indicator export owns:

1. reading `interactiveAssetId`;
2. resolving the Interactive Status Indicator asset by kind;
3. resolving OFF and ON uploaded artwork;
4. using the preflight-validated OFF and ON image metadata;
5. adding required asset C files without duplicating reused artwork sources;
6. creating a Binary Output export descriptor;
7. creating a non-clickable LVGL image;
8. selecting its initial source from saved `initialState`;
9. creating a unique `fg_binary_output_t` runtime record;
10. creating a deterministic public setter name;
11. emitting a setter that delegates to `fg_binary_output_set()`;
12. returning its declaration as public API metadata.

### Runtime behavior

- OFF artwork is stored in `off_src`.
- ON artwork is stored in `on_src`.
- the saved initial state initializes the instance independently.
- `false` selects OFF and `true` selects ON.
- multiple Status Indicator and Light records can coexist.
- no click callback is registered.
- no event hook or metadata is generated for `95_UserEvents.c/.h`.

Example generated record and setter:

```c
static fg_binary_output_t fg_wifi_status_output = {
    .image = NULL,
    .off_src = &wifi_status_off,
    .on_src = &wifi_status_on,
    .enabled = false,
};

void FG_Set_WiFi_Status(bool enabled)
{
    fg_binary_output_set(&fg_wifi_status_output, enabled);
}
```

Interactive Status Indicator contributes its setter declaration through `publicApiDeclarations`, exactly like Interactive Light. Only its per-instance record, artwork references, initial state, and setter name are unique; the Binary Output Runtime implementation remains shared.

## Generated UI files

### `90_Studio_Export.c`

Owns generated implementation:

- LVGL object creation
- generated component instances
- generated runtime structures
- shared runtime callbacks
- Button callback wiring
- calls into Button user hooks
- shared Toggle Input Runtime, per-instance records and bool-hook calls
- shared Three-Position Input Runtime, per-instance records and enum-hook calls
- shared Binary Output Runtime and per-instance records
- Binary Output OFF/ON runtime image references
- Light public setter implementations
- Interactive Status Indicator public setter implementations
- `fg_studio_export_create(...)`

It must not contain customer hardware behavior or permanent application logic.

### `90_Studio_Export.h`

Owns generated public declarations:

- `fg_studio_export_create(lv_obj_t *parent)`
- generated Binary Output `FG_Set_*` APIs for Light and Status Indicator
- required public includes and C/C++ linkage guards

It does not contain user implementations.

`90_Studio_Export.h` includes `lvgl.h` and `<stdbool.h>`, declares `fg_studio_export_create(...)`, and declares Binary Output setters. It does not own `fg_three_way_state_t`; that enum is generated in `95_UserEvents.h`. All Binary Output public APIs are declared in `90_Studio_Export.h` and implemented in `90_Studio_Export.c`. Binary Output assets never place setter implementations or event hooks in `95_UserEvents.c`.

### Regeneration rule

`90_Studio_Export.c` and `90_Studio_Export.h` are generated and replaceable whenever Studio exports.

Never place developer application logic in them.

## Export Safety Boundary

Failed client or server validation preserves the previous generated state:

- `90_Studio_Export.c`
- `90_Studio_Export.h`
- `95_UserEvents.c`
- `95_UserEvents.h`
- generated asset sources
- generated `CMakeLists.txt`

These files remain unchanged until a successful export replaces them. Preservation on failed validation is part of the generated export API contract, not merely an implementation convenience.

## Default Theme Validation

Built-in generated Theme assets participate in validation exactly like uploaded assets. A missing built-in generated C file correctly stops export before firmware mutation.

The physical Build & Flash regression exposed missing Neural Core and Carbon Fiber sources. It was resolved by restoring the legitimate generated firmware assets and verifying their expected LVGL symbols. Validation was strengthened and retained; it was not bypassed or weakened.

## Generated user hook layer

### `95_UserEvents.h`

Studio generates declarations for all collected input hooks and the Three-Position enum type:

```c
#pragma once

#include <stdbool.h>

typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;

#ifdef __cplusplus
extern "C" {
#endif

void FG_On_Start_Clicked(void);
void FG_On_Main_Power_Toggled(bool enabled);
void FG_On_ModeSelector_Changed(fg_three_way_state_t state);

#ifdef __cplusplus
}
#endif
```

The generated UI includes this header when any Button, Toggle or Three-Position input requires hooks.

### `95_UserEvents.c`

Studio generates Button, Toggle and Three-Position hook implementations for the current export. Stable server tests cover the signatures and readable state output. Representative stubs are:

```c
#include "95_UserEvents.h"
#include <stdio.h>

void FG_On_Button_Clicked(void)
{
    printf("[ForgeUI User Event] FG_On_Button_Clicked\n");
}

void FG_On_Main_Power_Toggled(bool enabled)
{
    printf("[ForgeUI User Event] FG_On_Main_Power_Toggled: %s\n", enabled ? "ON" : "OFF");
}

void FG_On_ModeSelector_Changed(fg_three_way_state_t state)
{
    const char * text = state == FG_THREE_WAY_LEFT ? "LEFT" : state == FG_THREE_WAY_RIGHT ? "RIGHT" : "CENTER";
    printf("[ForgeUI User Event] FG_On_ModeSelector_Changed: %s\n", text);
}
```

Interactive Light and Interactive Status Indicator do not add anything to these files. No Binary Output asset generates a hook in `95_UserEvents.c/.h`.

## Header Ownership

### `studio/src/components/Header.tsx`

Coordinates:

- Build & Flash
- Clean Build & Flash
- standalone ESP-IDF project export
- client preflight before export submission
- transport of validated exporter metadata
- transport of `userEventHooks` for Button, Toggle Switch, and Three-Position Toggle hooks
- transport of Binary Output setter metadata, including Light and Status Indicator

The exact exporter fields transported are `code`, `assetSources`, `userEventHooks`, and `publicApiDeclarations`. The single `userEventHooks` collection carries the sanitized `_Clicked`, `_Toggled`, and `_Changed` names; `publicApiDeclarations` carries exact Binary Output setter declarations.

Header coordinates export and starts flashing only after export succeeds. It does not validate generated firmware files itself, invent hooks or setters, materialize files, or define runtime behavior.

## Export server

### Primary file

```text
studio/export-server.js
```

### Owns

- receiving and validating generated code and API metadata
- validating payloads, paths, generated C sources, physical source existence, symbols, and source references
- producing the validated asset-source list
- normalizing supported public declarations
- normalizing and generating all supported user-hook signatures through `generateUserEventFiles()`
- generating `90_Studio_Export.h`
- generating `95_UserEvents.c/.h`
- writing generated files
- copying required image assets
- generating CMake source lists
- live firmware export
- standalone ESP-IDF project export
- project packaging and maintenance operations

### Does not own

- LVGL component generation
- Button, Toggle Switch, Three-Position Toggle, Light, or Status Indicator runtime behavior
- hook-name or runtime-API invention
- hook signature selection beyond materializing the established `_Clicked`, `_Toggled`, and `_Changed` suffix contract
- Light setter-name selection
- application logic
- customer hardware behavior

`generateUserEventFiles()` emits void, `bool`, or `fg_three_way_state_t` declarations and stubs from the validated hook suffix. It places `<stdbool.h>` and the Three-Position enum in `95_UserEvents.h` when required. `generateStudioExportHeader()` uses `normalizePublicApiDeclarations()` for the public Binary Output declarations in `90_Studio_Export.h`.

The server owns validation, materialization, generated headers, generated hooks, generated CMake, generated assets, and project copying. The export server materializes validated exporter results; it does not invent runtime or widget behavior.

## Live firmware export

### Endpoint

```text
POST /export
```

The endpoint receives the exact payload fields `code`, `assetSources`, `userEventHooks`, and `publicApiDeclarations`. They carry generated C source, required assets, every Button/Toggle/Three-Position input hook, and every Light/Status Indicator public setter declaration respectively.

It generates and writes:

- `firmware/ForgeUI-One/main/90_Studio_Export.c`
- `firmware/ForgeUI-One/main/90_Studio_Export.h`
- `firmware/ForgeUI-One/main/95_UserEvents.c`
- `firmware/ForgeUI-One/main/95_UserEvents.h`
- `firmware/ForgeUI-One/main/CMakeLists.txt`
- required generated image assets

The live `95_UserEvents.c/.h` files are Studio-generated test hooks and may be regenerated. They are not manually created and are not the permanent location for product application logic.

## Standalone ESP-IDF export

### Endpoint

```text
POST /export-idf-project
```

The endpoint creates an independent project under:

```text
C:\ForgeUI-Exports
```

The generated project contains:

```text
main/
├── 90_Studio_Export.c
├── 90_Studio_Export.h
├── 95_UserEvents.c
├── 95_UserEvents.h
├── required generated assets
└── CMakeLists.txt
```

Studio creates all four API-layer files at export time. Once the standalone project exists, its `95_UserEvents.c/.h` copies become the developer-owned integration layer for Button, Toggle Switch, and Three-Position Toggle callbacks. Developer code calls Light and Status Indicator setters declared by `90_Studio_Export.h`. ForgeUI Studio does not continuously regenerate, build, flash, or synchronize that exported project.

## File ownership boundary

| File or concern | Live ForgeUI-One firmware | Standalone exported project |
|---|---|---|
| `90_Studio_Export.c` | Studio-generated and replaceable | Generated UI implementation |
| `90_Studio_Export.h` | Studio-generated and replaceable | Generated public API declarations |
| `95_UserEvents.c/.h` | Studio-generated test hook layer; may be regenerated | Developer-owned application/hook layer after export |
| Generated image `.c` files | Studio-managed | Exported project assets |
| `CMakeLists.txt` | Generated by export server | Generated project build registration |
| GPIO, I/O, hardware actions | Do not keep permanently here | Add in developer-owned application layer |
| Product/business logic | Do not keep permanently here | Developer-owned |

### Ownership rules

1. Studio owns the live firmware workspace and may regenerate its generated UI and hook files.
2. Studio creates the standalone project's initial hook files.
3. After export, the developer owns the standalone project and its `95_UserEvents.c/.h` application layer.
4. Generated public UI functions remain declared in `90_Studio_Export.h` and implemented in `90_Studio_Export.c`.
5. Developer code may include `90_Studio_Export.h` to call output APIs.
6. Generated UI code includes `95_UserEvents.h` to call input hooks.
7. Permanent product logic must not be stored in the live Studio firmware copy.

Do not claim that live `95_UserEvents.c/.h` files are manually created or preserved through Studio regeneration. The preservation boundary begins with the independent standalone project after export.

## CMake integration

The export server generates the component source list and includes:

```text
main.c
01_FG_Runtime.c
20_RTC.c
30_Audio.c
30_WIFI.c
40_SD.c
90_Studio_Export.c
95_UserEvents.c
required generated asset sources
```

Only server-validated asset sources are admitted to the generated CMake list. Both the generated UI runtime and generated/developer hook layer are compiled into the ESP-IDF application.

Do not create a separate CMake pipeline for Interactive Assets or public APIs.

## Application boundary

ForgeUI owns:

- UI structure
- LVGL widget creation
- visual runtime behavior
- generated input callback entry points
- generated public output functions
- API naming and uniqueness
- export metadata
- generated firmware files

Developer code owns:

- GPIO
- sensors
- Wi-Fi application behavior
- MQTT and BLE application behavior
- motors and relays
- business logic
- device-specific actions
- decisions about when to call generated output APIs

Example standalone application integration:

```c
#include "90_Studio_Export.h"
#include "95_UserEvents.h"

void FG_On_StartPump_Clicked(void)
{
    pump_start();
    FG_Set_Running_Light(true);
}

void FG_On_Main_Power_Toggled(bool enabled)
{
    power_set_enabled(enabled);
    FG_Set_Power_Status(enabled);
}

void FG_On_ModeSelector_Changed(fg_three_way_state_t state)
{
    machine_set_mode(state);
}
```

ForgeUI owns the callback signatures and `FG_Set_*` APIs. The developer owns the example hardware functions and the decisions that connect input events to output state.

## Proven physical ESP32-P4 behavior

The validated pipeline successfully exports Hero artwork, the Industrial Carbon Theme, Interactive Button, Interactive Light, and Interactive Status Indicator together. Their layout and artwork align across the Canvas, Browser Preview, and physical ESP32-P4 output.

The generated firmware retains the complete exported UI and no longer falls back to an empty `fg_studio_export_create()`. Button runtime, the shared Binary Output Runtime, generated hooks, public setters, per-instance runtime records, asset sources, generated headers, and generated CMake participate in the same successful export.

### Interactive Button input path

Physically confirmed:

- Normal artwork displayed
- Pressed artwork displayed on touch
- release restored Normal artwork
- physical click detected
- generated shared callback executed
- generated user hook executed

Monitor output:

```text
[ForgeUI] FG_On_Button_Clicked clicked
[ForgeUI User Event] FG_On_Button_Clicked
```

### Interactive Light output path

Physically confirmed:

- OFF and ON image assets exported
- saved initial ON state displayed
- `FG_Set_*` public setter generated
- Light remained non-clickable
- firmware remained stable

### Interactive Toggle Switch input path

Physical ESP32-P4 validation is pending. Automated coverage verifies generated initial state, OFF/ON visual switching, the persistent boolean runtime, and `FG_On_*_Toggled(bool enabled)` generation, but does not constitute proof of touch behavior or serial output on hardware.

### Interactive Status Indicator output path

Physically confirmed:

- OFF and ON artwork exported through the Binary Output path
- saved initial state displayed
- generated `FG_Set_*` API controlled the Status Indicator
- Status Indicator remained non-clickable and generated no event hook
- Interactive Light and Status Indicator consumed the same `fg_binary_output_t` / `fg_binary_output_set()` implementation
- multiple Binary Output instance records remained independent
- generated setter APIs addressed the correct instances

### Interactive Three-Position Toggle input path

Physical ESP32-P4 validation is pending. Hardware proof must cover boot initial state, LEFT/CENTER/RIGHT selection away from screen origin, correct readable serial state, independent instances, and stable operation without a crash.

### System health

- Wi-Fi READY
- IP assigned
- SD READY
- no crash after interaction

The Button input-hook path and the shared Light/Status Indicator Binary Output setter path are implemented and physically proven. Toggle Switch and Three-Position Toggle physical validation remains pending.

## Automated Validation

### Full validation

- 23 Jest suites passed
- 137 tests passed
- 1 intentional legacy test skipped
- zero TypeScript diagnostics
- zero ESLint warnings or errors
- export-server syntax validation passed
- git diff validation passed

The intentional skip remains the documented legacy icon-export baseline; it is not an untracked failure.

## Debug map

| Problem | Start here | Then inspect |
|---|---|---|
| Generated LVGL object is wrong | `ForgeUILvglExport.ts` component branch | resolved component props and Interactive Asset |
| Button hook is absent from export result | `ForgeUILvglExport.ts` Button branch | `userEventHooks` set and hook naming |
| Button hook name is wrong or duplicated | hook-name helpers in `ForgeUILvglExport.ts` | component name, asset label/name, uniqueness set |
| Button visual state is wrong | `fg_interactive_button_event_cb` generation | per-instance Normal/Pressed sources |
| Button CLICKED does not reach hook | Button event registration | `.clicked_cb`, `95_UserEvents.h/.c` |
| Toggle hook is absent | Toggle branch in `ForgeUILvglExport.ts` | `userEventHooks`, sanitized `_Toggled` name, and `generateUserEventFiles()` |
| Toggle callback receives the wrong bool | generated `fg_toggle_input_event_cb()` | inversion order, `fg_toggle_input_set()`, and `.toggled_cb` |
| Toggle visual state does not persist | per-instance `fg_toggle_input_t` record | saved `initialState` and OFF/ON sources |
| Toggle runtime is duplicated | runtime emission in `ForgeUILvglExport.ts` | single `fg_toggle_input_t` / `fg_toggle_input_set()` generation guard |
| Three-Position hook is absent | Three-Position branch in `ForgeUILvglExport.ts` | `userEventHooks`, sanitized `_Changed` name, and `generateUserEventFiles()` |
| `fg_three_way_state_t` is missing | `generateUserEventFiles()` | `_Changed` hook detection and generated `95_UserEvents.h` |
| Wrong Three-Position zone is selected | generated `fg_three_way_input_event_cb()` | thirds calculation and component width |
| Three-Position coordinates are wrong away from x=0 | `fg_three_way_input_event_cb()` | `point.x - button_coords.x1` local conversion and bounds check |
| Child image intercepts touch | Three-Position object creation | child clickable flag and parent full-bounds clickability |
| Three-Position runtime is duplicated | runtime emission in `ForgeUILvglExport.ts` | single `fg_three_way_input_t` / `fg_three_way_input_set()` generation guard |
| Generated LEFT/CENTER/RIGHT stub is wrong | `generateUserEventFiles()` | `_Changed` signature branch and readable-state expression |
| Light setter is missing from C source | Light export preparation in `ForgeUILvglExport.ts` | LVGL readiness and unique API name |
| Light declaration is missing from header | `publicApiDeclarations` export result | Header payload and `generateStudioExportHeader()` |
| Light starts in wrong state | Light export branch | saved `initialState` and initial image symbol |
| Light is clickable or generates a hook | Light export branch | remove Button-style callback/hook behavior |
| Status Indicator setter is missing | Binary Output export preparation in `ForgeUILvglExport.ts` | kind-aware lookup, LVGL readiness, and unique API name |
| Status Indicator starts in wrong state | Status Indicator export branch | saved `initialState` and per-instance runtime record |
| Binary Output instances affect each other | generated runtime records | setter-to-record mapping and unique runtime names |
| Binary Output Runtime is duplicated | runtime emission in `ForgeUILvglExport.ts` | shared `fg_binary_output_t` and `fg_binary_output_set()` generation |
| Export rejected before files are written | `ForgeUIExportValidation.ts` | `export-server.js` |
| Missing generated C source | `export-server.js` | Uploaded Asset Registry |
| Invalid generated asset source | `ForgeUIExportValidation.ts` | exporter asset collection |
| Stale uploaded state asset blocks export | `ForgeUIExportValidation.ts` asset-kind/state checks | Uploaded Asset Registry and generated source existence |
| Duplicate generated API | `ForgeUIExportValidation.ts` | `ForgeUILvglExport.ts` |
| Duplicate `LV_IMAGE_DECLARE` | `ForgeUILvglExport.ts` | export validation |
| Theme asset validation failure | `export-server.js` | built-in Theme assets |
| API metadata is absent from request | `Header.tsx` | `/export` and `/export-idf-project` payloads |
| Input hook metadata is missing from payload | `Header.tsx` | exact `userEventHooks` field from `generateForgeUILvglCode()` |
| Server rejects a valid hook signature | `generateUserEventFiles()` suffix handling | `_Clicked`, `_Toggled`, `_Changed` validation and endpoint payload |
| Generated header is wrong | `generateStudioExportHeader()` | `normalizePublicApiDeclarations()` |
| Hook files are missing | `generateUserEventFiles()` | received `userEventHooks` and export endpoint |
| Live files are unexpectedly replaced | live ownership policy | `/export` writes generated live output |
| Standalone project lacks APIs | `/export-idf-project` | copied/written files and public metadata |
| CMake cannot find hooks or assets | generated `CMakeLists.txt` | export server source collection |
| Linker reports missing Button callback | `95_UserEvents.h/.c` | exact generated hook name |
| Linker reports missing Binary Output setter | `90_Studio_Export.h/.c` | exact Light or Status Indicator setter declaration/definition |
| Physical behavior differs from export | generated C and symbols | LVGL object wiring and copied asset sources |

## File responsibility summary

### `studio/src/forgeui/ForgeUILvglExport.ts`

Owns generated LVGL source, all five Interactive Asset branches, shared Button/Toggle/Three-Position/Binary Output runtimes, per-instance records, sanitized unique hook names, setter names, and all exporter metadata. Never writes files directly.

### `studio/src/components/Header.tsx`

Coordinates Build & Flash, Clean Build & Flash, standalone export, client preflight, and transport of `code`, `assetSources`, all `userEventHooks`, and Binary Output `publicApiDeclarations`. Never invents runtime APIs or validates materialized firmware files.

### `studio/export-server.js`

Owns validation of accepted metadata; normalization and generation of void, bool, and enum user hooks; generated headers; disk writes; assets; CMake; and project packaging. Never invents widget behavior.

### `90_Studio_Export.c`

Owns generated UI plus shared Button, Toggle Input, Three-Position Input, and Binary Output runtime implementations; per-instance records; calls to all input hooks; and Light/Status Indicator setter implementations. Never contains developer product logic.

### `90_Studio_Export.h`

Owns `fg_studio_export_create(...)` and every Binary Output `FG_Set_*` declaration, with required public includes such as `<stdbool.h>`. The Three-Position enum is actually owned by `95_UserEvents.h`, not this header. Never contains user implementations.

### `95_UserEvents.c`

In live firmware, owns Studio-generated Button click, Toggle bool-state, and Three-Position enum-state test stubs. In a standalone export, becomes the developer-owned callback/application implementation layer.

### `95_UserEvents.h`

In live firmware, owns the generated Three-Position enum and Button, Toggle, and Three-Position hook declarations. In a standalone export, forms part of the developer-owned hook interface while preserving exact generated names used by the UI.

### `CMakeLists.txt`

Owns compilation source registration and is generated by the export server.

## Architectural invariants

Preserve these rules:

1. `generateForgeUILvglCode()` remains the only LVGL UI exporter.
2. Interactive Button uses a void `FG_On_*_Clicked(void)` hook.
3. Interactive Toggle Switch uses a persistent `FG_On_*_Toggled(bool enabled)` hook.
4. Interactive Three-Position Toggle uses `FG_On_*_Changed(fg_three_way_state_t state)` and local component coordinates for touch selection.
5. Outputs generate public `FG_Set_*` UI functions and no event hooks.
6. Button, Toggle, and Three-Position calls live in `90_Studio_Export.c`; their enum/declarations/stubs live in `95_UserEvents.c/.h`.
7. All Binary Output setters are declared and implemented entirely in `90_Studio_Export.h/.c`.
8. `Header.tsx` transports exporter metadata but does not create APIs.
9. `export-server.js` writes files but does not define widget behavior.
10. Live `95_UserEvents.c/.h` files are Studio-generated and replaceable.
11. Standalone `95_UserEvents.c/.h` files become developer-owned after export.
12. Customer hardware and business logic never belongs in generated UI files.
13. Client validation occurs before export submission.
14. Server validation occurs before filesystem mutation.
15. Only validated asset sources are written to CMake.
16. Built-in Theme assets participate in validation.
17. Generated runtime assumes validated inputs.
18. Failed validation preserves the previous generated firmware.
19. The Binary Output Runtime is generated once per export.
20. Every Binary Output Interactive Asset reuses the shared runtime implementation.
21. Future Binary Output assets extend the existing runtime rather than generating new runtime implementations.
22. Toggle Input Runtime is generated once per export.
23. Three-Position Input Runtime is generated once per export.
24. Per-instance runtime state remains independent in every runtime family.
25. Generated enum types are visible wherever hook declarations and developer implementations require them.
26. Header and export server transport or materialize metadata but never invent runtime APIs.
27. Hook generation preserves exact sanitized unique names across all hook families.
28. Missing or stale state assets fail validation before filesystem mutation.

## Extension rule

Current proven runtime families:

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

Future generated APIs must follow the established direction model:

- momentary input → `FG_On_*_Clicked(void)`;
- persistent binary input → `FG_On_*_Toggled(bool enabled)`;
- persistent multi-state input → `FG_On_*_Changed(fg_three_way_state_t state)`;
- binary output → `FG_Set_*(bool enabled)`.

Future output controls should extend the Binary Output Runtime and expose generated `FG_Set_*` APIs without duplicating `fg_binary_output_t`, `fg_binary_output_set()`, or shared setter generation.

Future controls must extend the existing exporter, export-result metadata, Header transport, export-server materialization, generated files, and ownership model. They must not introduce a parallel exporter, a second hook generator, a second generated-header system, or a separate firmware API layer.

## Permanent architecture statement

> ForgeUI generates the interface. ForgeUI exposes the interface. The developer supplies the application.

Maintain this document only when the generated API or ownership boundary changes.
