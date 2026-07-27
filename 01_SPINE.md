# Current Save Point

**FORGEUI_SYSTEM_INTERFACE__LVGL_RUNTIME__DISPLAY_BRIGHTNESS__ESP32P4_PROVEN__2026-07-27**

## Current Proven Status..

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

ForgeUI now also includes a built-in System Interface in addition to the Interactive Asset Framework. The System Interface is proven through Studio, Browser Preview, generated LVGL and physical ESP32-P4 hardware.

Current implemented System pages:

- System Launcher
- Display / Brightness

Navigation is proven through the complete current hierarchy:

```text
Application
→ System
→ Display
→ System
→ Application
```

Display brightness is physically connected to the ESP32-P4 backlight through `bsp_display_brightness_set()`. Brightness changes live while the slider is moved and remains in memory during the current device session.

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

Only Launcher and Brightness are implemented today. Wi-Fi, Bluetooth, Sound, Storage, Device and Diagnostics are visible future page identifiers and disabled launcher placeholders; their system functions are not implemented.

The shared provider owns the active System page, open and back navigation, and current-session brightness. The shared surface renders the same built-in interface over the Studio Canvas and Browser Preview while keeping normal project components separate.

### LVGL runtime

Generated LVGL creates:

- one persistent application container
- one System launcher container
- one Brightness container

The current hardware-safe navigation implementation uses immediate container visibility switching. It does not recreate screens, project widgets or Interactive Assets. Existing Interactive Assets remain instantiated and retain their state while the System Interface is open, then continue working after return to the application.

The generated gear launcher and System controls use internal LVGL event callbacks. The Brightness slider listens for live value changes, clamps the value to `10–100`, updates its percentage label and calls the Waveshare BSP through the generated internal `FG_Set_Display_Brightness()` wrapper and `bsp_display_brightness_set()`. Brightness is session-only and is not persisted.

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

Status Indicator does not generate user hooks.

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

Studio currently creates and writes these files when it generates live Studio firmware and when it creates a standalone export. In live Studio firmware they contain regenerated test hooks. After a standalone project is exported, its copies become the developer-owned hook and application-logic layer. Developers add GPIO, I/O, hardware actions, and product behavior to the standalone project's `95_UserEvents.c` while preserving generated hook names.

Interactive Button click hooks, Interactive Toggle Switch toggled hooks and Interactive Three-Position Toggle changed hooks cross into this layer. Binary Output Runtime setters remain generated public UI APIs in `90_Studio_Export.h/.c` and do not create Light or Status Indicator hooks in `95_UserEvents`.

## Major Files

Paths under `src/` are relative to `studio/`.

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
- `src/forgeui/system/ForgeUISystemContext.tsx` — typed page navigation and current-session brightness state
- `src/forgeui/system/ForgeUISystemSurface.tsx` — shared Studio Canvas and Browser Preview System surface
- `src/forgeui/system/ForgeUISystemSurface.test.tsx`
- `src/forgeui/system/index.ts`
- `src/pages/_app.tsx` — owns the shared System provider boundary
- `src/components/editor/Editor.tsx` — hosts the System surface at the Studio device boundary
- `src/forgeui/preview/DevicePreview.tsx` — hosts the same System surface at the Browser Preview device boundary

### Exporter

- `src/forgeui/ForgeUILvglExport.ts`
- `src/forgeui/ForgeUILvglExport.system.test.ts`
- `src/forgeui/ForgeUILvglExport.keyboard.test.ts`
- `export-server.js`

The exporter owns the shared generated runtime implementations, unique per-instance records and built-in System containers and callbacks. `90_Studio_Export.*` remains generated and replaceable; live-firmware `95_UserEvents.*` may be regenerated, while standalone-export copies become developer-owned. The System Interface does not add generated user-event hooks.

### Generated firmware

- `firmware/ForgeUI-One/main/90_Studio_Export.c`
- `firmware/ForgeUI-One/main/90_Studio_Export.h`
- `firmware/ForgeUI-One/main/95_UserEvents.c`
- `firmware/ForgeUI-One/main/95_UserEvents.h`

## Physical ESP32-P4 Proof

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

### System health

- Wi-Fi READY
- Wi-Fi connected
- IP assigned
- SD READY
- No crash after interaction

## LVGL Keyboard Visual Parity

The exported keyboard uses native `lv_keyboard`, which is an `lv_buttonmatrix` subclass. Two LVGL defaults caused the original hardware mismatch:

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

LVGL normalizes width units independently within each row. The physical result now occupies the intended large keyboard area, aligns its textarea and keyboard, fills the available rectangle with four key rows, and is much closer to the Studio preview.

## Verified Automated Status

- Built-in System regressions cover launcher opening and closing, Display navigation, Back navigation, live brightness state, current-session retention, disabled placeholder behavior and preservation of existing application interaction.
- LVGL System exporter regressions cover the persistent application container, internal gear callback, System and Brightness containers, disabled cards, immediate visibility navigation, live `10–100` slider behavior and Waveshare BSP brightness integration.
- Focused configured-helper, direct Creator, registry measurement, shared selection-border resize, visible-bounds, Canvas preview, Browser Preview, persistence and exporter regressions pass across the five Interactive Assets.
- Browser Preview wrapper geometry and Interactive Browser Preview parity regressions cover saved component bounds, positioning and centred contain-fit rendering.
- Binary Output regressions cover the shared exporter path, Status Indicator LVGL scaling, component-sized container generation and centred child-image generation.
- Toggle State Sheet and Three-Position State Sheet, linked-crop, row-remapping and atomic-registration regressions pass; the State Sheet suite may require its longer timeout.
- Keyboard exporter geometry, ordering, style and relative-width regressions pass.
- Shared union geometry, intrinsic and alpha-bound metadata, linked crop, same-ID invalidation, duplicate-write suppression and idempotent fitting regressions pass.
- TypeScript validation passes with `tsc --noEmit`.
- Scoped diff validation passes for the current implementation work.
- Client/server export validation and reference-protection coverage remain in place for all five Interactive Asset types.
- A known unrelated server fixture/source absence can fail the built-in theme-source preflight when the expected Neural Core or Carbon Fiber generated C files are not present; this does not weaken the validation boundary.

## Architectural Significance and Extension Pattern

ForgeUI now consists of four major reusable layers:

```text
Studio
├── AI
├── Canvas
└── Browser Preview

System Runtime
├── System Launcher
├── Brightness
└── Future System pages

Interactive Asset Runtime
├── Interactive Inputs
├── Three-Position Inputs
└── Binary Outputs

Generated Firmware
├── LVGL
├── ESP-IDF
├── User Events
└── Hardware Integration
```

The System Interface is not an Interactive Asset. It is a reusable platform service generated alongside the user's application. It does not enter the Interactive Asset registry, does not become a user project screen and does not generate user callbacks.

This separation lets future built-in Wi-Fi, Bluetooth, Sound, Storage, Device and Diagnostics services reuse the typed System page, shared navigation and generated container framework without affecting project screens or changing existing Interactive Asset runtime contracts. These services remain future work; only the System Launcher and Display / Brightness are implemented and physically proven today.

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

Potential future runtime families include:

### Value Runtime

- Slider
- Gauge
- Progress Bar
- Numeric Display

### Selection Runtime

- Radio Button
- Checkbox
- Rotary Selector

### Displays

- Seven Segment
- Text Display
- Meter

These remain future concepts only. They are not implemented or physically proven today.

# Save Point History

Save points are ordered newest to oldest. Detailed subsystem engineering is maintained in the Developer Code Maps.

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
