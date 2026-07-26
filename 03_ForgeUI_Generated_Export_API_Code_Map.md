# ForgeUI Generated Export API — Permanent Code Map

## Current proven save point

**FORGEUI_ALL_FIVE_INTERACTIVE_ASSETS__CONFIGURED_INSPECTOR_PARITY__SHARED_SELECTION_BORDER_RESIZE__N_STATE_VISIBLE_BOUNDS__LVGL_CONTAIN_SCALING__ESP32P4_PROVEN__2026-07-27**

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

For all five placed Interactive Asset component branches, persisted Canvas `x/y/w/h` is the generated geometry source of truth. State-image controls use that final geometry for the parent object or transparent container and centre a non-clickable child image inside it. Every required state shares one safe contain-fit scale; state switching changes only the source, not geometry. Dimension resolution uses uploaded-asset registry metadata, PNG IHDR dimensions and generated LVGL descriptors, with scale 256 only as the final safe fallback and valid scales above or below 256. Linked fitted assets are consumed automatically when their IDs replace the original state references. Browser Preview, live firmware and standalone export use the same persisted geometry model.

Runtime direction remains unchanged:

```text
Button         -> FG_On_*_Clicked(void)
Toggle         -> FG_On_*_Toggled(bool enabled)
Three-Position -> FG_On_*_Changed(fg_three_way_state_t state)
Light/Status   -> FG_Set_*(bool enabled)
```

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

The reusable asset-generation path feeding those runtime families is:

```text
ForgeUI Canvas
        |
        v
Open Creator
        |
        v
Designer
        |
        v
State Sheet generation
        |
        v
Linked crop workspace
        |
        v
Atomic uploaded-asset registration
        |
        v
Export
        |
        v
Generated runtime
        |
        v
ESP32-P4
```

Direct Creator entry points now cover all five Interactive Assets: Button, Toggle Switch, Three-Position Toggle Switch, Light and Status Indicator. Their private navigation targets are:

```text
interactive-button-designer
interactive-toggle-switch-designer
interactive-three-position-toggle-designer
interactive-light-designer
interactive-status-indicator-designer
```

These entry points select the current Canvas component and its linked Interactive Asset. The Creator and State Sheet pipeline prepares or edits the Interactive Asset and uploaded state images consumed by export; it does not replace or redefine the generated runtime-family contracts. In particular, Status Indicator Creator navigation does not change the generated Binary Output API direction or `FG_Set_*` contract.

`Fit Bounds to Visible Artwork` is an explicit design-time asset operation for Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON, Status Indicator OFF/ON and Three-Position LEFT/CENTER/RIGHT. It measures state artwork before export, calculates one stable union across the required states, creates same-size linked cropped uploaded assets, preserves original uploads, updates the existing Interactive Asset state IDs and remains idempotent. Export consumes whichever uploaded asset IDs the Interactive Asset currently references. Export does not perform alpha cropping, and fitting adds no firmware API or transport metadata.

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
- Keyboard export, including native `lv_keyboard`/buttonmatrix configuration
- Keyboard top-left alignment, relative control-width map, explicit styles, and final runtime ordering
- export of uploaded assets produced by Toggle and Three-Position State Sheet workflows
- current direct Creator integration through the component and uploaded-asset model
- final persisted component geometry for all five Interactive Asset branches
- component-sized transparent parent or container generation where applicable
- centred non-clickable child image generation
- shared two-state contain-fit scaling for Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON and Status Indicator OFF/ON through the common Binary Output path
- shared three-state contain-fit scaling for Three-Position LEFT/CENTER/RIGHT
- uploaded-asset registry dimension metadata consumption
- PNG IHDR dimension recovery
- generated LVGL descriptor-based dimension fallback
- safe scale-256 fallback and scale values above or below 256
- linked cropped state-asset consumption
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

After placement, component geometry is authoritative. All five Interactive Asset branches use traversed component `x/y/w/h`; reusable Interactive Asset dimensions do not replace persisted component geometry during generation. Linked fitted state assets resolve through the normal kind-specific asset lookup when their IDs are current. The same persisted geometry feeds Browser Preview, live firmware and standalone export.

Current internal object names such as `obj1`, `obj2`, and `obj3` are implementation details. They are suitable for generated LVGL variables but are not the stable developer API.

Developer-facing hook and setter names are derived separately and made unique within an export.

For Keyboard, traversal geometry remains the source of truth. The branch emits map and mode configuration before explicit styles and final top-left position/size so native `lv_keyboard` defaults cannot replace the Canvas geometry.

## Generated export result contract

`generateForgeUILvglCode()` returns:

- generated LVGL `code`;
- `assetSources: string[]` containing generated C source paths required by the UI;
- `userEventHooks: string[]` containing sanitized unique hook names for Button, Toggle and Three-Position inputs;
- `publicApiDeclarations` for Binary Output setters, including Interactive Light and Interactive Status Indicator.

These four properties are the complete current contract. All input families share the one generalized `userEventHooks` string collection; there are no separate Button, Toggle or Three-Position payload fields. Hook suffixes encode signature selection downstream: `Clicked`, `Toggled`, or `Changed`. Binary Output declarations use `publicApiDeclarations: string[]` and retain the exact `void FG_Set_*(bool enabled);` text.

Scaling helpers and resolved numeric scales live inside generated `code`. Linked fitted C sources appear in `assetSources` when fitting has replaced the Interactive Asset's state references. Intrinsic dimensions, alpha metadata, union bounds and crop coordinates do not become export payload fields. All input hooks remain in the single `userEventHooks` collection, and Binary Output declarations remain in `publicApiDeclarations`.

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

## State Sheet generation and export architecture

State Sheets are reusable generation workflows that produce the independent uploaded assets required by existing runtime families.

### Toggle State Sheet

The Toggle State Sheet Builder uses one master image containing OFF and ON artwork. Two linked crop regions retain a shared crop size while allowing independent positions. Confirming the crops extracts the two state images and registers OFF and ON together.

### Three-Position State Sheet

The Three-Position Creator uses this current path:

```text
Create Three-Position Toggle Set
        |
        v
One master State Sheet request
        |
        v
Linked crop workspace
        |
        v
LEFT / CENTER / RIGHT crops
        |
        v
Atomic uploaded-asset registration
        |
        v
Generated Three-Position runtime
```

The three crop regions share dimensions. Their positions remain independently adjustable, and row remapping can swap which cropped row becomes LEFT, CENTER, or RIGHT without generating another master. This replaces any earlier implication that Three-Position artwork is created by three independent image-generation requests.

`studio/src/forgeui/ai/InteractiveAssetAIGenerator.tsx` owns the Creator/Designer state, the single Three-Position set request, crop confirmation, and state-row assignment. `studio/src/forgeui/ai/StateSheetOverlay.tsx` owns the linked crop-region geometry and resize behavior. Direct Canvas entry is routed by `ForgeUINavigation.ts` and `PreviewContainer.tsx`; those files select context but do not generate firmware.

### AI image pipeline ownership

`studio/src/forgeui/ai/ForgeUIAIImagePipeline.ts` owns crop extraction and registration:

1. receive the single generated master;
2. represent crop results as PNG data URLs;
3. decode the Base64 PNG payloads into files for conversion;
4. convert all requested state crops;
5. register the completed uploaded assets in one atomic batch;
6. update the Interactive Asset draft only after the batch succeeds.

`Confirm Crops` is the commit boundary. The active crop-registration path does not depend on temporary blob URLs; PNG data URLs survive the crop-to-conversion handoff. A partial conversion must not partially register a state set.

State Sheet generation belongs to asset preparation. Export still resolves the resulting uploaded assets through the normal generated asset-source contract.

## Interactive Button input API

### Export branch

The `InteractiveButton` exporter branch owns:

1. reading `interactiveAssetId`;
2. resolving the Interactive Button asset by kind;
3. resolving Normal and Pressed uploaded assets;
4. using the preflight-validated Normal and Pressed image metadata;
5. adding required asset C files;
6. declaring LVGL images;
7. using final persisted component geometry for the parent LVGL button;
8. creating the child LVGL image;
9. resolving both state dimensions through registry metadata or PNG IHDR;
10. calculating one safe Normal/Pressed contain scale;
11. emitting the descriptor-based contain-scale helper call when Studio dimensions are unavailable;
12. centring the scaled child image;
13. creating per-button runtime data;
14. attaching the shared Button event callback;
15. collecting the unique generated click hook.

Button runtime generation assumes validated image assets. It does not perform late export validation while emitting runtime code.

The Button contain-fit helper evaluates both Normal and Pressed descriptor widths and heights against final component `w/h`. Both states use the same scale, so press transitions do not change placement. Reliable Studio dimensions produce a numeric scale; generated `lv_image_dsc_t.header.w/h` supplies the legacy runtime fallback, and invalid descriptors return scale 256.

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

When visible-artwork fitting has been applied, `normalAssetId` and `pressedAssetId` resolve to the linked stable-union crops. Export collects those cropped C sources; it does not modify or export through the superseded original references unless another active asset still uses them.

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
3. collects the currently linked or original required generated C sources;
4. uses final persisted component position and size;
5. creates a full-size transparent parent LVGL button;
6. creates a centred non-clickable child image;
7. calculates one common OFF/ON contain scale;
8. recovers dimensions through registry metadata, PNG IHDR, `lv_image_dsc_t.header.w/h`, then safe scale 256;
9. creates an independent `fg_toggle_input_t` record;
10. initializes from the saved state through `fg_toggle_input_set(..., notify=false)`;
11. attaches `fg_toggle_input_event_cb()`;
12. generates a unique `FG_On_*_Toggled` name and adds it to `userEventHooks`.

State changes replace the child image source without changing position, scale or parent geometry. The `fg_toggle_input_t`, `fg_toggle_input_set()`, `fg_toggle_input_event_cb()` and `void FG_On_<Name>_Toggled(bool enabled);` contracts are unchanged.

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

### Generation workflow and unchanged runtime contract

Three-Position artwork now comes from one master State Sheet request and three confirmed crops. Export still receives three independent uploaded assets, one each for LEFT, CENTER, and RIGHT. The public enum, generated callback, per-instance runtime record, and touch behavior are unchanged; only the generation workflow changed.

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
3. collects all currently linked or original required C sources;
4. generates a unique `FG_On_*_Changed` name and adds it to `userEventHooks`;
5. uses final persisted component position and size for the full transparent rectangular parent button;
6. creates a centred non-clickable child image;
7. resolves dimensions through registry metadata, PNG IHDR, LVGL descriptors and the safe scale-256 fallback;
8. applies one common LEFT/CENTER/RIGHT contain scale, including values above or below 256;
9. creates an independent `fg_three_way_input_t` record;
10. initializes the saved enum state with `notify=false`;
11. attaches the one shared `fg_three_way_input_event_cb()`.

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
6. creating a transparent container from final persisted component geometry;
7. creating a centred non-clickable child LVGL image;
8. resolving both state dimensions through registry metadata or PNG IHDR;
9. calculating one safe OFF/ON contain scale;
10. emitting the descriptor-based contain-scale helper call when Studio dimensions are unavailable;
11. selecting its initial source from saved `initialState`;
12. creating a unique public setter name;
13. emitting the setter implementation;
14. returning its declaration as public API metadata.

Light runtime generation likewise assumes validated image assets and API metadata. It does not perform late export validation while emitting runtime code.

### Runtime object behavior

Interactive Light is an output indicator, not an input control.

- It is emitted as an LVGL image.
- The image is centred inside a transparent component-sized container.
- Final container position and size come from persisted component `x/y/w/h`.
- OFF and ON use one common contain scale.
- State switching changes only the image source, not scale, centre or container geometry.
- The object remains non-clickable.
- It has no Button-style event callback.
- It produces no hook in `95_UserEvents`.
- Its initial OFF/ON image follows the saved `initialState`.

The Light contain-fit helper evaluates both OFF and ON descriptor dimensions against final component geometry. Dimension ownership follows the same chain as Button:

```text
Uploaded Asset Registry metadata
  → PNG IHDR dimensions
  → generated lv_image_dsc_t.header.w/h
  → safe scale 256
```

When visible-artwork fitting has been applied, Light resolution and `assetSources` use the linked stable-union OFF/ON crops. Original uploads remain unchanged and are exported only when still actively referenced elsewhere.

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

The Binary Output API contract is unchanged by contain scaling. `fg_binary_output_set()` continues to switch only `image` source. Light and Status Indicator object creation use final component geometry, a transparent component-sized container, a centred child image and one shared OFF/ON scale before the runtime record is used.

Every exported Binary Output instance creates its own `fg_binary_output_t` record containing its LVGL image, OFF source, ON source, and saved state. Multiple records remain independent even when instances reuse the same artwork.

Every generated Binary Output setter calls `fg_binary_output_set()` with its own record. Future Binary Output assets must reuse this implementation rather than emit another binary state structure or switching function.

## Keyboard generated runtime ownership

The `Keyboard` branch exports a native `lv_keyboard`, whose internal key surface is the widget's buttonmatrix. Native LVGL keyboard creation has a default alignment and built-in map/style behavior, so creating the object and setting only its outer size is not sufficient for Studio parity.

The exporter owns this ordered setup:

1. create the associated textarea;
2. create `lv_keyboard`;
3. install the four-row map and its buttonmatrix control-width array;
4. associate the textarea;
5. select `LV_KEYBOARD_MODE_TEXT_LOWER`;
6. apply explicit main-part padding, row/column gaps, border, radius, colors, outline and shadow;
7. apply explicit item-part padding, border, radius, colors, outline, shadow, text line spacing and `lv_font_montserrat_12`;
8. replace the native default alignment with `LV_ALIGN_TOP_LEFT`;
9. apply the final Canvas-relative position and size;
10. update layout after final geometry.

Map/mode setup precedes final style and geometry because those native APIs own buttonmatrix configuration. No later align or size call may override the Canvas values.

The control-width map uses LVGL's numeric buttonmatrix width units combined with control flags. Normal alpha widths and special-key widths are normalized row by row; Space remains deliberately wider, while mode, Backspace, Enter, arrows and confirm retain only the relative width required by the Studio layout. These are proportional controls, not screen-resolution compensation.

Current row width units are:

```text
row 1: 1#/alpha/Backspace = 4
row 2: ABC/alpha/Enter     = 3
row 3: symbol/alpha keys   = 1
row 4: keyboard/left       = 2, Space = 12, right/confirm = 2
```

Keyboard export therefore owns:

- `LV_ALIGN_TOP_LEFT` correction for the native `lv_keyboard` default alignment;
- four-row map order;
- relative buttonmatrix width map;
- explicit main and item padding;
- explicit row and column gaps;
- explicit item font and line spacing;
- theme-preserving border, color and radius styles;
- map/mode/style/alignment/geometry call ordering;
- final parity with the component's exported Canvas geometry.

## Interactive Status Indicator output API

### Export preparation and branch

Interactive Status Indicator export owns:

1. reading `interactiveAssetId`;
2. resolving the Interactive Status Indicator asset by kind;
3. resolving OFF and ON uploaded artwork;
4. using the preflight-validated OFF and ON image metadata;
5. adding required asset C files without duplicating reused artwork sources;
6. creating a Binary Output export descriptor from final persisted component geometry;
7. creating a transparent component-sized container and centred non-clickable child image;
8. resolving dimensions through registry metadata, PNG IHDR, LVGL descriptors and safe scale 256;
9. applying the common Binary Output OFF/ON contain scale;
10. selecting its initial source from saved `initialState`;
11. creating a unique `fg_binary_output_t` runtime record;
12. creating a deterministic public setter name;
13. emitting a setter that delegates to `fg_binary_output_set()`;
14. returning its declaration as public API metadata.

The exporter consumes the final saved OFF/ON asset references and component geometry only. It does not export Creator navigation, Inspector onboarding, local Canvas preview click behavior or temporary design-time state. It emits one centred non-clickable child image, one independent `fg_binary_output_t` record and one generated `FG_Set_*` API per Status Indicator.

### Design-time preview versus generated runtime

- Canvas right-click can open the exact linked Status Indicator Creator.
- An unconfigured component opens a fresh unsaved draft.
- A new Status Indicator defaults to `120 × 72` on Canvas.
- Canvas and Browser Preview share centered contain-fit rendering that preserves intrinsic artwork aspect ratio.
- Canvas click may toggle a temporary local OFF / ON preview state for visual verification.
- Local preview toggling does not mutate saved `initialState`, persistence or generated firmware.
- The exported Status Indicator remains non-clickable, emits no user hook and changes runtime state only through `FG_Set_<Name>(bool enabled)`.

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
- Button parent geometry, shared Normal/Pressed contain scale and centred child image
- calls into Button user hooks
- shared Toggle Input Runtime, per-instance records and bool-hook calls
- shared Three-Position Input Runtime, per-instance records and enum-hook calls
- shared Binary Output Runtime and per-instance records
- Keyboard native map, control widths, explicit styles and top-left alignment
- final Keyboard setup ordering and Canvas-relative geometry
- Binary Output OFF/ON runtime image references
- Light component-sized container, shared OFF/ON contain scale and centred child image
- generated Button, Toggle, Three-Position and Binary Output LVGL descriptor fallback helpers
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
- resized and visible-bounds-fitted artwork matched Canvas and Browser Preview
- generated contain-fit scaling used final persisted component geometry

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
- resized and visible-bounds-fitted artwork matched Canvas and Browser Preview
- common OFF/ON contain scaling used final persisted component geometry
- firmware remained stable

### Interactive Toggle Switch input path

Physically confirmed for the exercised control:

- OFF and ON artwork displayed through touch state changes
- persistent boolean runtime selected the correct artwork
- generated Toggle interaction remained stable

This proof does not claim unperformed multi-instance or stress coverage.

### Interactive Status Indicator output path

Physically confirmed:

- OFF and ON artwork exported through the Binary Output path
- saved initial state displayed
- generated `FG_Set_*` API controlled the Status Indicator
- Status Indicator remained non-clickable and generated no event hook
- Interactive Light and Status Indicator consumed the same `fg_binary_output_t` / `fg_binary_output_set()` implementation
- multiple Binary Output instance records remained independent
- generated setter APIs addressed the correct instances

Design-time local preview clicking is intentionally not exported and is not physical input behavior.

### Interactive Three-Position Toggle input path

Physically confirmed:

- one generated LEFT/CENTER/RIGHT artwork set exported as three independent assets
- the full rectangular control was divided into three working touch zones
- each zone selected the correct LEFT, CENTER, or RIGHT runtime state
- the generated `FG_On_*_Changed(fg_three_way_state_t state)` callback reported the matching readable state
- initialization did not spuriously notify application code
- repeated interaction remained stable without a crash

The proof validates the current component instance and generated runtime. It does not imply unperformed multi-instance stress coverage.

### System health

- Wi-Fi READY
- IP assigned
- SD READY
- no crash after interaction

The Button, exercised Toggle Switch, Three-Position input-hook path, and shared Light/Status Indicator Binary Output setter path are implemented and physically proven within the scopes stated above. Keyboard geometry, alignment, row fill and functional special keys are also proven on the 1024x600 ESP32-P4 display.

## Automated Validation

### Current validation boundary

- focused LVGL exporter regressions pass;
- Keyboard exporter geometry, call-order and control-width regressions pass;
- State Sheet and crop-pipeline tests pass;
- Three-Position generated runtime regressions pass;
- Button final-geometry, registry-dimension, PNG IHDR, LVGL descriptor fallback and linked-crop export regressions pass;
- Light final-geometry, common OFF/ON scale, centring, initial-state and linked-crop export regressions pass;
- Toggle, Status Indicator and Three-Position final-geometry, common state-scale, centring, fallback and linked fitted-asset export regressions pass;
- Canvas, Browser Preview, live/standalone generator and persistence regressions preserve geometry ownership;
- TypeScript validation passes;
- export-server syntax/regression validation passes where applicable;
- scoped diff validation for this subsystem passes.

Do not preserve historical suite totals here. Unrelated repository fixtures or pre-existing whitespace findings must be reported separately from this subsystem rather than presented as a generated-export failure.

## Debug map

| Problem | Start here | Then inspect |
|---|---|---|
| Generated LVGL object is wrong | `ForgeUILvglExport.ts` component branch | resolved component props and Interactive Asset |
| Button hook is absent from export result | `ForgeUILvglExport.ts` Button branch | `userEventHooks` set and hook naming |
| Button hook name is wrong or duplicated | hook-name helpers in `ForgeUILvglExport.ts` | component name, asset label/name, uniqueness set |
| Button visual state is wrong | `fg_interactive_button_event_cb` generation | per-instance Normal/Pressed sources |
| Button export ignores resized geometry | `ForgeUILvglExport.ts` Button branch | persisted component `w/h`, parent size and child image centring |
| Button hardware artwork remains at native size | generated `lv_image_set_scale(...)` | Normal/Pressed contain scale and dimension fallback path |
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
| Three-Position State Sheet is missing or stale | `InteractiveAssetAIGenerator.tsx` three-position-set flow | master request, crop workspace and linked asset ID |
| LEFT/CENTER/RIGHT crops map to the wrong states | State Sheet row mapping | unique row assignments and crop-to-state draft update |
| Three-Position runtime is duplicated | runtime emission in `ForgeUILvglExport.ts` | single `fg_three_way_input_t` / `fg_three_way_input_set()` generation guard |
| Generated LEFT/CENTER/RIGHT stub is wrong | `generateUserEventFiles()` | `_Changed` signature branch and readable-state expression |
| Light setter is missing from C source | Light export preparation in `ForgeUILvglExport.ts` | LVGL readiness and unique API name |
| Light declaration is missing from header | `publicApiDeclarations` export result | Header payload and `generateStudioExportHeader()` |
| Light starts in wrong state | Light export branch | saved `initialState` and initial image symbol |
| Light is clickable or generates a hook | Light export branch | remove Button-style callback/hook behavior |
| Light export ignores resized geometry | `ForgeUILvglExport.ts` Light branch | persisted component `x/y/w/h`, transparent container and centred child image |
| OFF/ON state change alters visible size or position | generated Light contain-scale call | common state-pair scale, identical centring and linked crop dimensions |
| Numeric contain scale is wrong | contain-scale calculation in `ForgeUILvglExport.ts` | final component dimensions and both state-image dimensions |
| Legacy image emits the wrong scale | `forgeUIResolveUploadedAssetDimensions()` | registry metadata, PNG IHDR bytes, generated LVGL descriptor helper, safe 256 fallback |
| PNG IHDR fallback is not used | `ForgeUIUploadedAssetRegistry.ts` | data-URL decoding and `forgeUIParsePngDimensions()` |
| LVGL descriptor fallback is missing | generated Button or Light contain-scale helper | both `lv_image_dsc_t.header.w/h` values and scale-256 guard |
| Fitted artwork exports original state symbols | kind-specific Interactive Asset state IDs | linked cropped uploaded assets, resolver and `assetSources` |
| Visible-artwork fitting changes original uploads | `ForgeUITwoStateVisibleBounds.ts` | linked crop registration and state-reference replacement |
| Configured preview remains stale after asset replacement | kind-specific Canvas preview | Interactive Asset registry event and uploaded-asset registry refresh; this occurs before generated export |
| Status Indicator setter is missing | Binary Output export preparation in `ForgeUILvglExport.ts` | kind-aware lookup, LVGL readiness, and unique API name |
| Status Indicator starts in wrong state | Status Indicator export branch | saved `initialState` and per-instance runtime record |
| Status Indicator looks stretched in Canvas or Browser Preview | `InteractiveStatusIndicatorPreview.tsx` | intrinsic image dimensions and centered contain-fit styles; this is outside generated firmware ownership |
| Status Indicator Canvas click does nothing | `InteractiveStatusIndicatorCanvasPreview.tsx` | temporary local preview state; do not debug generated `FG_Set_*` for this design-time issue |
| Status Indicator is clickable on hardware | `ForgeUILvglExport.ts` Status Indicator branch | verify no event callback or clickable flag was emitted |
| Status Indicator setter does not change state | generated `fg_binary_output_t` record and `FG_Set_*` | saved OFF/ON symbols and setter-to-runtime-record mapping |
| Binary Output instances affect each other | generated runtime records | setter-to-record mapping and unique runtime names |
| Binary Output Runtime is duplicated | runtime emission in `ForgeUILvglExport.ts` | shared `fg_binary_output_t` and `fg_binary_output_set()` generation |
| Export rejected before files are written | `ForgeUIExportValidation.ts` | `export-server.js` |
| Missing generated C source | `export-server.js` | Uploaded Asset Registry |
| Invalid generated asset source | `ForgeUIExportValidation.ts` | exporter asset collection |
| Stale uploaded state asset blocks export | `ForgeUIExportValidation.ts` asset-kind/state checks | Uploaded Asset Registry and generated source existence |
| Duplicate generated API | `ForgeUIExportValidation.ts` | `ForgeUILvglExport.ts` |
| Duplicate `LV_IMAGE_DECLARE` | `ForgeUILvglExport.ts` | export validation |
| Theme asset validation failure | `export-server.js` | built-in Theme assets |
| Direct Open Creator action targets the wrong asset | `ForgeUINavigation.ts` | `PreviewContainer.tsx`, component ID and linked Interactive Asset ID |
| Confirm Crops does not complete | `InteractiveAssetAIGenerator.tsx` | crop validity, PNG data URLs and `ForgeUIAIImagePipeline.ts` |
| Only part of a state set is registered | `ForgeUIAIImagePipeline.ts` | conversion completion before `forgeUIAddUploadedAssets()` atomic batch |
| Toggle linked crops drift in size | Toggle State Sheet crop workspace | shared crop dimensions and linked resize rules |
| Keyboard is centered or offset at runtime | `ForgeUILvglExport.ts` Keyboard branch | `LV_ALIGN_TOP_LEFT` after map/mode and final `lv_obj_set_pos()` ordering |
| Keyboard outer size falls back to native geometry | Keyboard final setup ordering | final `lv_obj_set_size()` and absence of later alignment/size calls |
| Keyboard special keys have wrong proportions | Keyboard buttonmatrix control array | numeric width units, control flags and row totals |
| Keyboard theme padding changes key fill | Keyboard `LV_PART_MAIN` / `LV_PART_ITEMS` styles | explicit pad, gaps, border, font and style ordering |
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
| Canvas, Browser Preview, live and standalone sizes differ | persisted component geometry and `generateForgeUILvglCode()` | shared generator result, contain-fit scale, centring and selected linked state assets |

## File responsibility summary

### `studio/src/forgeui/ForgeUILvglExport.ts`

Owns generated LVGL source, all five Interactive Asset branches, shared Button/Toggle/Three-Position/Binary Output runtimes, two-state and three-state contain-fit calculations and descriptor helpers, final persisted component geometry, component-sized parent/container objects, centred child images, Keyboard native map/alignment/control widths/styles/final geometry ordering, per-instance records, sanitized unique hook names, setter names, linked cropped asset consumption, and all exporter metadata. Never writes files directly.

### `studio/src/forgeui/ForgeUIUploadedAssetRegistry.ts`

Owns uploaded image records, intrinsic dimension metadata, alpha-content metadata, PNG IHDR parsing and the registry-first dimension resolution used before generated LVGL descriptor fallback.

### `studio/src/forgeui/interactive/ForgeUITwoStateVisibleBounds.ts`

Owns non-destructive stable state-set alpha unions, compatible source-dimension validation, component-geometry mapping and linked crop generation used by Button, Toggle, Light, Status Indicator and Three-Position before export. Its filename and Button/Light compatibility APIs remain unchanged.

### `studio/src/forgeui/interactive/ForgeUIInteractiveButtonVisibleBounds.ts`

Owns the Button-facing Normal/Pressed wrapper over shared visible-bounds fitting.

### `studio/src/forgeui/interactive/ForgeUIInteractiveLightVisibleBounds.ts`

Owns the Light-facing OFF/ON wrapper and linked fitted-asset naming over shared visible-bounds fitting.

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
29. Three-Position generation uses one master State Sheet request, but export and runtime retain three independent LEFT/CENTER/RIGHT uploaded assets.
30. Confirm Crops registers a complete converted state set atomically; partial state-set registration is not a valid current path.
31. State Sheet row remapping changes crop-to-state assignment without changing the generated runtime API.
32. Keyboard map/mode configuration precedes explicit style, `LV_ALIGN_TOP_LEFT`, final position and final size.
33. Keyboard dimensions come from the Canvas component; no global or resolution-specific scaling is introduced.
34. Creator navigation selects component/asset context, while the exporter remains the sole owner of generated LVGL and runtime behavior.
35. Direct Creator access across all five Interactive Assets does not change generated API direction.
36. Status Indicator Canvas Preview may toggle local state for visual verification, but temporary preview state is never exported.
37. Generated Status Indicator LVGL remains non-clickable and Binary Output state remains developer-controlled through `FG_Set_*`.
38. Component geometry becomes authoritative after placement; reusable Interactive Asset dimensions do not overwrite persisted component geometry during export.
39. Generated LVGL position and size for all five Interactive Asset branches always use persisted component `x/y/w/h`.
40. Interactive Asset families that export two-state contained artwork reuse the common contain-fit scaling model rather than inventing independent geometry rules.
41. Legacy image dimensions resolve in this order: uploaded-asset registry metadata, PNG IHDR, generated LVGL descriptor dimensions, then safe scale 256.
42. Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON and Status Indicator OFF/ON each use one common state-pair scale and centred child-image placement; Three-Position LEFT/CENTER/RIGHT uses one common three-state scale.
43. Canvas, Browser Preview, live firmware and standalone export must remain visually equivalent for the same persisted component geometry and state assets.
44. Visible-artwork fitting exports linked cropped state assets and never modifies the original uploaded images.

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

Any compatible two-state artwork family must reuse the established geometry path: component-authoritative bounds, registry metadata, PNG IHDR recovery, LVGL descriptor fallback, one safe contain scale and centred image placement. If it supports visible-artwork fitting, it must create linked cropped assets through the shared two-state visible-bounds framework and preserve original uploads.

Generated export also supports reusable generation workflows:

```text
Reusable generation workflow
  Master image
    -> linked crop regions
    -> state-to-row remapping
    -> atomic uploaded-asset registration
    -> existing runtime-family export
```

Toggle uses the pattern for two states and Three-Position uses it for three. The architectural extension point is an N-state generation workflow: one master, N linked crop regions, an explicit unique state mapping, and one atomic registration boundary. This describes how a future state set should feed an existing or deliberately extended runtime contract; it does not claim that additional widgets or runtime families are implemented.

## Permanent architecture statement

> ForgeUI generates the interface. ForgeUI exposes the interface. The developer supplies the application.

Maintain this document only when the generated API or ownership boundary changes.
