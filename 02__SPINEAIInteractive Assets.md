

----------------------------------------------------------------------------

## Interactive Assets — Phase 5 Complete (Reusable Live Preview)

### Overview

Phase 5 of the Interactive Asset system is now complete.

The Interactive Button designer has been refactored so the live preview is no longer embedded inside the editor panel. Instead, it has been extracted into a dedicated reusable component that owns all preview interaction logic.

This establishes the first reusable runtime renderer for Interactive Assets and provides the foundation for Canvas Integration.

---

### New Component

```
InteractiveButtonPreview.tsx
```

Responsibilities:

- Own pressed state
- Swap Normal ↔ Pressed visuals
- Handle preview interaction
- Display reusable interactive button preview

The designer now simply passes:

- Normal Asset
- Pressed Asset
- Width
- Height

to the preview renderer.

---

### Preview Behaviour

Verified:

- Normal image shown by default
- Mouse Down → Pressed visual
- Mouse Up → Normal visual
- Mouse Leave → Normal visual
- Dynamic width/height updates
- Uses actual uploaded LVGL-ready assets

---

### Designer Refactor

ForgeUIInteractiveAssetPanel now acts purely as the editor.

Responsibilities remaining inside the panel:

- Asset CRUD
- Image selection
- Validation
- Save/Delete
- Registry updates

Preview rendering has been completely separated.

---

### Architecture

```
ForgeUIInteractiveAssetPanel
            │
            ▼
InteractiveButtonPreview
            │
            ├── manages pressed state
            ├── renders Normal image
            ├── renders Pressed image
            └── handles mouse interaction
```

This creates a single source of truth for interactive button rendering.

---

### Benefits

- Cleaner designer
- No duplicated preview logic
- Easier maintenance
- Reusable across the application
- Matches ForgeUI component architecture

---

### Status

✅ Interactive Asset Registry

✅ CRUD

✅ Persistence

✅ Image References

✅ Image Selector

✅ Save/Edit/Delete

✅ Reusable Live Preview

Phase 5 is now considered **PROVEN**.

---

## Next Phase

### Phase 6 — Canvas Integration

Begin replacing static Button rendering with Interactive Button assets.

Objectives:

- Drag Interactive Button onto canvas
- Render using InteractiveButtonPreview
- Preserve Normal/Pressed behaviour
- Connect designer assets directly to runtime
- Prepare runtime hooks for physical touch events

The reusable preview component created during Phase 5 will become the rendering foundation for Canvas, Browser Preview and eventually ESP32-P4 runtime.

----------------------------------------------------------------------------------

# FORGEUI_V2_4_1__INTERACTIVE_BUTTON_IMAGE_STATES__ASSET_REFERENCES__PERSISTENCE_PROVEN

---

# Summary

This savepoint completes **Interactive Assets Phase 4**.

Interactive Buttons now reference reusable ForgeUI uploaded image assets for both visual states instead of embedding image data.

Each Interactive Button stores:

- Normal State image
- Pressed State image

using uploaded asset IDs.

---

# Completed

## Interactive Asset Designer

✔ Create Interactive Buttons

✔ Edit Interactive Buttons

✔ Delete Interactive Buttons

✔ Registry persistence

✔ Save / Reload

---

## Image State Support

Added support for:

- Normal Visual
- Pressed Visual

using uploaded ForgeUI assets.

Each state now references:

```ts
normalAssetId?: string
pressedAssetId?: string
```

instead of storing duplicated image information.

---

## Asset Browser

Interactive Button Designer now includes:

- LVGL Ready asset browser
- Normal image selector
- Pressed image selector
- Selected image previews
- Change Visual
- Clear Visual

---

## Saved Asset Cards

Saved Interactive Buttons now display:

- Button Name
- Label
- Width × Height
- Normal thumbnail
- Pressed thumbnail

making asset verification much easier.

---

# Architecture

Interactive Assets now reference existing uploaded assets.

The Uploaded Asset Registry remains the single source of truth for:

- browser preview
- asset name
- LVGL symbol
- generated C source
- export status

No image duplication occurs.

---

# Verified

Successfully tested:

✔ Normal image selection

✔ Pressed image selection

✔ Saving Interactive Button

✔ Editing Interactive Button

✔ Registry persistence

✔ Reload persistence

✔ Full ForgeUI restart restores both visual states

---

# Investigation

During testing it appeared image persistence had failed.

After investigation the cause was **not** Interactive Assets.

The issue was a stale or stopped ForgeUI asset/export server on port **3030**.

Symptoms:

- browser refresh appeared to lose previews
- saved asset IDs remained intact
- PNG files still existed on disk
- full ForgeUI restart restored previews

Therefore the Interactive Asset implementation is considered correct.

---

# Important Note

Interactive Asset persistence is proven.

The temporary missing previews after browser refresh are related to the asset server lifecycle rather than registry serialization.

This behaviour has previously been seen during Firmware Sweep testing.

---

# Files Updated

## ForgeUIInteractiveButtonAsset.ts

Added:

```ts
normalAssetId?: string

pressedAssetId?: string
```

---

## ForgeUIInteractiveAssetPanel.tsx

Added:

- Normal image selector
- Pressed image selector
- LVGL Ready asset browser
- Image previews
- Save/Edit restoration
- Thumbnail previews

---

# Files Confirmed Stable

No changes required to:

- ForgeUIInteractiveAsset.ts
- ForgeUIInteractiveAssetRegistry.ts
- ForgeUIInteractiveAssetPersistence.ts
- ForgeUIInteractiveAssetValidation.ts
- ForgeUIUploadedAssetRegistry.ts
- ForgeUIIconResolver.tsx

---

# Current Interactive Asset Pipeline

```
ForgeUI Uploaded Assets
        │
        ▼
LVGL Ready Images
        │
        ▼
Interactive Button Designer
        │
        ├── Normal Asset ID
        │
        └── Pressed Asset ID
        │
        ▼
Interactive Asset Registry
        │
        ▼
Persistence
        │
        ▼
Reload
        │
        ▼
Full ForgeUI Restart
        │
        ▼
Images Restored ✔
```

---

# Phase 5

Recommended next milestone:

## Live Interactive Preview

Inside the Interactive Button Designer:

- idle shows Normal image
- pointer down swaps to Pressed image
- pointer up restores Normal image
- pointer leave restores Normal image

while respecting saved width and height.

---

# Phase 6

Insert Interactive Button onto the ForgeUI canvas.

Canvas components should reference the saved Interactive Asset ID rather than duplicating image definitions.

---

# Do Not Change

Do not redesign:

- Uploaded Asset Registry
- Image conversion pipeline
- Hero pipeline
- Artwork pipeline
- Icon pipeline
- LVGL conversion pipeline

Interactive Assets should continue referencing reusable uploaded assets by ID.

---

# Status

ForgeUI Interactive Assets Phase 4 is complete and proven.

The project is now ready to begin runtime Interactive Button rendering and canvas integration.
--------------------------------------------------------------

# Spine Update — Interactive Assets Phase 3 (CRUD Complete)

---

# ForgeUI Studio V2.4.0
## Interactive Assets — Phase 3 Complete

### Status

Interactive Assets have progressed from a registry proof-of-concept into a functional reusable asset system.

The complete CRUD workflow has now been proven.

---

## Completed

### Interactive Asset Registry

- Registry creation
- Asset registration
- Asset lookup
- Asset removal
- Registry refresh
- LocalStorage persistence
- Reload on Studio startup

---

### Interactive Button Designer

Implemented reusable Interactive Button asset designer.

Supports:

- Asset Name
- Button Label
- Width
- Height

Designer can now operate in two modes:

- Create
- Edit

---

### CRUD Workflow

Proven:

- Create Interactive Button
- Edit existing asset
- Delete asset
- Save asset changes
- Reload edited assets after Studio restart

Registry and persistence remain synchronized throughout the workflow.

---

### UI Improvements

Designer now dynamically updates based on editing state.

Added:

- Edit button
- Delete button
- Dynamic heading
- Dynamic Save button text

Examples:

Create Mode

Interactive Button Designer

Save Interactive Button

Edit Mode

Edit Interactive Button

Save Changes

---

### Validation

Verified working:

✔ Create

✔ Edit

✔ Delete

✔ Registry refresh

✔ LocalStorage persistence

✔ Reload after Studio restart

✔ Updated asset values preserved

---

## Current Interactive Asset Structure

Interactive Button

Properties

- id
- name
- label
- width
- height

Future state support already reserved.

---

# Next Phase

## Phase 4 — Visual State Designer

Replace placeholder cards with full visual state selection.

Interactive Button will gain multiple visual states.

Planned states:

Normal

Pressed

Later phases:

Hover

Focused

Disabled

Selected

Each state will reference reusable ForgeUI Assets instead of hard-coded visuals.

---

## Long-Term Goal

Interactive Assets become reusable controls composed from standard ForgeUI assets.

Example:

Interactive Button

Normal
→ Image Asset

Pressed
→ Image Asset

Disabled
→ Image Asset

Focus
→ Image Asset

allowing one reusable button definition to be placed anywhere on a layout while maintaining a consistent appearance and behavior.

This becomes the foundation for reusable controls, themes, and future AI-generated interactive widgets.

---

**Save Point**

FORGEUI_INTERACTIVE_ASSETS_PHASE_3_CRUD__CREATE_EDIT_DELETE_PERSISTENCE_PROVEN__2026-07-18
--------------------------------------------------------------------

# =====================================================================
# FORGEUI INTERACTIVE ASSETS — STATUS UPDATE
# Date: 2026-07-18
# Status: PHASE 2 REGISTRY AND CACHE PERSISTENCE PROVEN
# =====================================================================

## Savepoint

**FORGEUI_V2_4_0__INTERACTIVE_ASSET_REGISTRY_AND_CACHE_PERSISTENCE_PROVEN__PHASE2_COMPLETE__READY_FOR_PERSISTENT_PACKAGES__2026-07-18**

---

# Current Status

Interactive Assets Phase 2 is now COMPLETE.

The Interactive subsystem remains isolated inside:

```text
src/forgeui/interactive/
```

The existing Hero, Artwork, Theme and Uploaded Asset systems remain untouched.

The AI Playground Interactive tab is fully integrated and stable.

---

# Files Currently Present

```text
src/forgeui/interactive/
  ForgeUIInteractiveAsset.ts
  ForgeUIInteractiveAssetIds.ts
  ForgeUIInteractiveAssetPanel.tsx
  ForgeUIInteractiveAssetPersistence.ts
  ForgeUIInteractiveAssetRegistry.ts
  ForgeUIInteractiveAssetRegistry.test.ts
  ForgeUIInteractiveAssetValidation.ts
  ForgeUIInteractiveButtonAsset.ts
  index.ts
```

---

# Interactive Button Foundation Proven

The Interactive Button model is now stable.

Current properties:

```text
schemaVersion
id
name
kind
interactionMode
label
width
height
normal
pressed
createdAt
updatedAt
```

Current interaction mode:

```text
momentary
```

Current visual state:

```text
backgroundColor
borderColor
textColor
borderWidth
borderRadius
```

Default asset creation is proven through:

```ts
createDefaultInteractiveButtonAsset()
```

ID generation is proven through:

```ts
createInteractiveAssetId()
```

---

# Validation Proven

The validation layer now successfully verifies:

```text
✓ schemaVersion
✓ id
✓ name
✓ kind
✓ interactionMode
✓ label
✓ width
✓ height
✓ createdAt
✓ updatedAt
✓ normal state
✓ pressed state
```

Invalid Interactive Button assets are rejected before registration.

---

# Registry Proven

The Interactive Asset Registry remains completely independent of React.

Implemented functions:

```ts
registerInteractiveAsset()
getInteractiveAsset()
getAllInteractiveAssets()
updateInteractiveAsset()
removeInteractiveAsset()
clearInteractiveAssetRegistry()

exportInteractiveAssets()
importInteractiveAssets()
```

Verified behaviour:

```text
Create
↓

Validate
↓

Register
↓

Retrieve

↓

Update

↓

Retrieve Updated Asset

↓

Remove

↓

Registry Empty
```

Duplicate IDs are rejected correctly.

Updates preserve:

```text
id
schemaVersion
kind
```

while automatically refreshing:

```text
updatedAt
```

---

# Registry Testing Proven

Temporary developer controls inside:

```text
ForgeUIInteractiveAssetPanel.tsx
```

successfully verified:

```text
✓ Register
✓ Get
✓ Get All
✓ Update
✓ Remove
```

Console proof:

```text
Registry after register: [{...}]

Updated Asset:
label = Updated Button

Retrieved:
label = Updated Button

Removed: true

Registry after remove: []
```

---

# Persistence Layer Added

A dedicated persistence layer now exists.

```text
ForgeUIInteractiveAssetPersistence.ts
```

Responsibilities:

```text
saveInteractiveAssets()

reloadInteractiveAssets()

clearInteractiveAssetStorage()
```

The registry remains storage-independent.

Current architecture:

```text
Registry

↓

exportInteractiveAssets()

↓

JSON

↓

localStorage

↓

reloadInteractiveAssets()

↓

importInteractiveAssets()

↓

Registry Restored
```

This separation is intentional.

Do not move browser storage logic into the registry.

---

# Cache Persistence Proven

The following sequence has now been successfully verified:

```text
Create Interactive Button

↓

Register

↓

Save

↓

Clear Registry

↓

Reload Registry

↓

Asset Restored
```

Console proof:

```text
Reloaded Assets: [{...}]
```

This proves the registry cache survives reconstruction from localStorage.

---

# Current Boundary

The current persistence layer is intentionally only a cache.

It is **NOT** the final storage implementation.

The long-term source of truth remains:

```text
forgeui-assets/
  interactive/
    buttons/
      <button-id>/
        asset.json
        normal.png
        pressed.png
```

Future additions:

```text
normal.c
pressed.c
```

The current cache layer exists only to prove the registry architecture before moving to disk-backed packages.

---

# Phase 2 Complete

Completed:

```text
✓ Interactive Button model

✓ Default asset creation

✓ ID generation

✓ Validation

✓ Registry

✓ Register

✓ Retrieve

✓ Retrieve All

✓ Update

✓ Remove

✓ Export

✓ Import

✓ Cache Persistence

✓ Cache Reload
```

Not started:

```text
✗ Disk package persistence

✗ asset.json generation

✗ normal.png persistence

✗ pressed.png persistence

✗ Server endpoints

✗ Interactive Asset Library

✗ Interactive Button Designer

✗ AI generation

✗ Editor insertion

✗ Browser interaction

✗ LVGL export

✗ ESP32-P4 runtime
```

---

# Next Development Phase

Begin:

## Persistent Interactive Button Packages

Primary objective:

Create one manually supplied Interactive Button package stored on disk.

Required proof:

```text
Create Interactive Button

↓

Save asset.json

↓

Save normal.png

↓

Save pressed.png

↓

Restart ForgeUI Studio

↓

Reload Package

↓

Delete Package

↓

Files Removed
```

Do NOT begin:

```text
AI generation

Editor insertion

LVGL export

GPIO

Runtime behaviour
```

First prove real package persistence.

---

# Architecture Moving Forward

Registry:

```text
CRUD only
```

Persistence:

```text
Storage only
```

Designer:

```text
UI only
```

Library:

```text
Browse only
```

Preview:

```text
Interaction only
```

Export:

```text
LVGL only
```

Keep these responsibilities separate.

---

# Cleanup Before Phase 3

The temporary developer controls were created only to prove Phase 2.

These include:

```text
Test Registry

Test Update

Test Remove

Test Reload
```

They should be removed once disk-backed persistence has been verified.

Replace them with the future Interactive Asset Manager.

---

# Current Project Rule

Interactive Assets remain a completely separate subsystem.

Never merge them into:

```text
Hero Assets

Artwork Assets

Theme Assets

Uploaded Assets
```

Continue building through small vertical slices.

Avoid large framework rewrites.

Protect the existing proven ForgeUI systems.

---

# Phase 2 Sign-Off

Phase 2 is now complete.

The Interactive Asset Registry, validation layer and cache persistence have all been successfully proven.

The next milestone is real disk-backed Interactive Button packages before any designer or editor integration begins.
----------------------------------------------------------------------------

# =====================================================================
# FORGEUI INTERACTIVE ASSETS — STATUS UPDATE
# Date: 2026-07-18
# Status: PHASE 1 PROVEN
# =====================================================================

## Savepoint

FORGEUI_V2_4_0__INTERACTIVE_ASSETS_PHASE1_PROVEN__AI_PLAYGROUND_EXTENDED__TAB_INTEGRATION_COMPLETE__2026-07-18

---

# Current Status

Interactive Assets have now been successfully integrated into ForgeUI Studio.

The AI Playground has been extended with a dedicated Interactive tab without affecting the existing Hero, Artwork, Theme or Uploaded Asset pipelines.

The following are now verified working:

✓ ForgeAIPanel loads normally
✓ Interactive tab appears after Assets
✓ ForgeUIInteractiveAssetPanel loads correctly
✓ Runtime integration is stable
✓ Existing AI Playground functionality remains intact

Phase 1 is now considered COMPLETE.

---

# Runtime Issue Resolved

A React runtime error occurred during integration:

Element type is invalid...

Root cause:

The Interactive panel was temporarily imported incorrectly during development while the feature was being wired into ForgeAIPanel.

The issue has now been resolved.

Current working import:

```tsx
import ForgeUIInteractiveAssetPanel
  from '~forgeui/interactive/ForgeUIInteractiveAssetPanel'
```

Current panel:

```tsx
<TabPanel px={0} pt={5}>
  <ForgeUIInteractiveAssetPanel />
</TabPanel>
```

This integration is now considered stable.

Do not revisit this unless the panel itself changes.

---

# Confirmed UI Layout

```
Layout
Theme
Assets
Interactive
Images (disabled)
Icons (disabled)
Runtime (disabled)
```

The Interactive tab is now part of the permanent AI Playground.

---

# Current Interactive Panel

Current panel is intentionally lightweight.

Purpose:

• prove registration
• prove routing
• prove tab integration
• provide a safe foundation

Current message:

Phase 1
Interactive Assets

Functional reusable controls with multiple visual states.

Interactive Button V1 foundation is ready.
Designer controls will be added after the registry and validation test passes.

This placeholder is expected.

---

# Phase 1 Complete

Completed:

✓ feature folder
✓ registry foundation
✓ validation
✓ IDs
✓ panel component
✓ AI Playground integration
✓ runtime verification

Nothing from the Hero or Artwork systems was modified.

---

# Next Development Phase

Begin Phase 2.

Primary objective:

Create the Interactive Asset Registry and prove the complete registration pipeline.

Success criteria:

• registerInteractiveAsset()
• getInteractiveAssets()
• getInteractiveAssetById()
• updateInteractiveAsset()
• removeInteractiveAsset()

Verify assets survive reload before editor insertion begins.

Do NOT begin LVGL export yet.

Do NOT begin GPIO.

Do NOT begin event logic.

First prove the asset pipeline.

---

# Current Project Rule

Interactive Assets remain a completely separate subsystem.

Never merge them into:

• Hero Assets
• Artwork Assets
• Theme Assets
• Uploaded Assets

Reuse utilities where appropriate but keep storage and behaviour independent.

This separation is intentional and should be maintained throughout development.

------------------------------------------------------------------------------


# Current Savepoint Update — 2026-07-18

## Savepoint

**FORGEUI_V2_4_0__INTERACTIVE_ASSET_FOUNDATION_CREATED__UI_HOOK_DEFERRED__2026-07-18**

## Current State

The Interactive Assets feature foundation has been started as a separate ForgeUI subsystem.

The working feature directory is:

```text
src/forgeui/interactive/
```

The initial foundation files have been created:

```text
src/forgeui/interactive/
  Asset.ts
  ButtonAsset.ts
  AssetIds.ts
  AssetValidation.ts
  AssetRegistry.ts
  index.ts
```

Use this shorter directory and filename convention going forward.

The earlier proposed directory:

```text
src/forgeui/interactive-assets/
```

is superseded by:

```text
src/forgeui/interactive/
```

Do not create a second parallel Interactive Assets directory.

## UI Integration Decision

The Interactive feature will eventually be exposed through a new top-level tab in `ForgeAIPanel.tsx`, positioned directly after `Assets`:

```text
Layout
Theme
Assets
Interactive
Images
Icons
Runtime
```

The attempted tab-only edit was reverted because a Chakra UI `<Tab>` must be added together with its matching `<TabPanel>`.

Current `ForgeAIPanel.tsx` tabs remain unchanged:

```tsx
<Tab>Layout</Tab>
<Tab>Theme</Tab>
<Tab>Assets</Tab>
<Tab isDisabled>Images</Tab>
<Tab isDisabled>Icons</Tab>
<Tab isDisabled>Runtime</Tab>
```

Do not add `<Tab>Interactive</Tab>` until the matching panel component exists and both edits can be made together.

## Planned UI Component

Create:

```text
src/forgeui/interactive/ForgeUIInteractiveAssetPanel.tsx
```

`ForgeAIPanel.tsx` should only import and mount this component.

Do not place the full Interactive Asset designer, library, registry or storage implementation directly inside `ForgeAIPanel.tsx`.

Future hook:

```tsx
import ForgeUIInteractiveAssetPanel
  from '~forgeui/interactive/ForgeUIInteractiveAssetPanel'
```

Matching tab:

```tsx
<Tab>Interactive</Tab>
```

Matching panel, placed after the complete existing Assets `TabPanel`:

```tsx
<TabPanel px={0} pt={5}>
  <ForgeUIInteractiveAssetPanel />
</TabPanel>
```

Add the tab and panel in the same change so their indexes remain aligned.

## Immediate Next Step

Before wiring the new tab:

1. Review the six foundation files.
2. Confirm the models, ID generator, validation and registry compile.
3. Add a small registration/retrieval test.
4. Create a standalone `ForgeUIInteractiveAssetPanel.tsx` shell.
5. Only then add the matching `Interactive` tab and `TabPanel`.

Do not begin persistence, image generation, LVGL export or editor insertion until Phase 1 is verified.

---

# ForgeUI Interactive Assets Spine

## Feature Name

**ForgeUI Interactive Assets**

## Initial Milestone

**Interactive Button V1**

## Purpose

Create a new, parallel asset system for AI-generated functional controls.

This system must remain separate from the existing proven pipelines for:

* Hero backgrounds
* Artwork assets
* Uploaded images
* Theme assets
* Icons

Interactive Assets are not just images.

Each Interactive Asset is a reusable package containing:

* visual states
* control metadata
* preview behaviour
* future LVGL export behaviour
* future event hooks
* persistent storage

The first asset type is a simple momentary button.

---

# Core Rule

Do not modify or repurpose the existing Hero or Artwork asset pipelines.

Build Interactive Assets as a new feature area with small, controlled integration points into the editor, preview and exporter.

Avoid large refactors.

Avoid duplicated logic where a small shared utility can safely be reused.

Do not create a generic over-engineered framework before the first button works.

---

# V1 Button Behaviour

The first Interactive Button has only two visual states:

* Normal
* Pressed

Behaviour:

```text
Pointer or touch down
→ show Pressed state

Pointer or touch released
→ show Normal state
```

This is a momentary button.

Do not add yet:

* counters
* toggles
* GPIO
* Wi-Fi actions
* linked LEDs
* custom user code
* screen navigation
* persistent state
* long press
* double click

First prove the complete asset pipeline.

---

# Target Workflow

```text
Open Interactive Asset Designer
→ Select Button
→ Enter asset name
→ Enter visual prompt
→ Set width and height
→ Generate Normal state
→ Generate Pressed state
→ Review both states
→ Save Interactive Button
→ Button appears in Interactive Asset Library
→ Restart ForgeUI Studio
→ Button remains available
→ Insert button into editor
→ Press button in preview
→ Visual state changes
→ Export to LVGL
→ Test touch behaviour on ESP32-P4
```

---

# Feature Directory

Create a dedicated feature area:

```text
src/forgeui/interactive-assets/
```

Recommended structure:

```text
interactive-assets/
  models/
    InteractiveAsset.ts
    InteractiveButtonAsset.ts

  registry/
    InteractiveAssetRegistry.ts

  storage/
    InteractiveAssetStorage.ts

  designer/
    InteractiveAssetDesigner.tsx
    ButtonAssetDesigner.tsx

  library/
    InteractiveAssetLibrary.tsx
    InteractiveAssetCard.tsx

  preview/
    InteractiveButtonPreview.tsx

  export/
    InteractiveButtonExporter.ts

  utils/
    interactiveAssetIds.ts
    interactiveAssetValidation.ts

  index.ts
```

Keep files focused.

Do not place the whole feature inside one large component.

---

# Persistent Disk Structure

Create a separate persistent storage location:

```text
forgeui-assets/
  interactive/
    buttons/
      <button-id>/
        asset.json
        normal.png
        pressed.png
        normal.c
        pressed.c
```

The `.c` files are added later when LVGL conversion is implemented.

The first persistence milestone only requires:

```text
asset.json
normal.png
pressed.png
```

---

# Interactive Asset Base Model

Create a common base model.

Suggested shape:

```ts
export type InteractiveAssetKind =
  | 'button'

export type InteractiveAssetStatus =
  | 'draft'
  | 'visual_ready'
  | 'lvgl_ready'
  | 'error'

export interface InteractiveAssetBase {
  id: string
  name: string
  kind: InteractiveAssetKind
  width: number
  height: number
  createdAt: string
  updatedAt: string
  status: InteractiveAssetStatus
}
```

Do not add unused future asset types yet.

Add new kinds only when their implementation begins.

---

# Interactive Button Model

Suggested shape:

```ts
export interface InteractiveButtonAsset
  extends InteractiveAssetBase {
  kind: 'button'

  interactionMode: 'momentary'

  normal: {
    browserSrc: string
    filePath?: string
    lvglSymbol?: string
    cFile?: string
  }

  pressed: {
    browserSrc: string
    filePath?: string
    lvglSymbol?: string
    cFile?: string
  }
}
```

The saved asset must always contain both states before being considered ready.

---

# Asset Manifest

Each saved button package contains an `asset.json`.

Example:

```json
{
  "id": "interactive_button_1721270000000_a1b2c3d4",
  "name": "Industrial Start Button",
  "kind": "button",
  "interactionMode": "momentary",
  "width": 180,
  "height": 64,
  "status": "visual_ready",
  "normal": {
    "file": "normal.png"
  },
  "pressed": {
    "file": "pressed.png"
  },
  "createdAt": "2026-07-18T00:00:00.000Z",
  "updatedAt": "2026-07-18T00:00:00.000Z"
}
```

Keep the manifest readable and versionable.

A schema version may be added:

```json
{
  "schemaVersion": 1
}
```

---

# Registry Responsibilities

Create:

```text
InteractiveAssetRegistry.ts
```

It should provide focused operations:

```ts
getInteractiveAssets()
getInteractiveAssetById(id)
registerInteractiveAsset(asset)
updateInteractiveAsset(asset)
removeInteractiveAsset(id)
reloadInteractiveAssets()
```

The registry must not depend on React.

It should not contain UI logic.

It should not contain image-generation logic.

---

# Storage Responsibilities

Create:

```text
InteractiveAssetStorage.ts
```

It should handle:

* saving manifests
* saving normal-state images
* saving pressed-state images
* loading saved packages
* deleting saved packages
* validating expected files
* returning browser-safe asset paths

Do not store permanent image data only in memory.

Do not rely only on `localStorage`.

Disk-backed persistence is required.

A small cached registry may use local storage if helpful, but disk is the source of truth.

---

# Interactive Asset Designer

Create a new dedicated designer panel.

Do not mix it into Theme Manager.

Do not hide it inside the existing Artwork generator.

Suggested initial controls:

```text
Interactive Asset Type
Button

Asset Name

Prompt

Width

Height

Generate Normal State

Generate Pressed State

Save Interactive Button
```

Initial size defaults:

```text
Width: 180
Height: 64
```

Reasonable limits:

```text
Minimum width: 48
Maximum width: 512

Minimum height: 32
Maximum height: 256
```

---

# Designer State

The Button Designer should track:

```ts
name
prompt
width
height
normalPreview
pressedPreview
isGeneratingNormal
isGeneratingPressed
isSaving
error
```

The Save button remains disabled until:

* name is present
* normal state exists
* pressed state exists
* width and height are valid

---

# Image Generation Rules

Generate each state separately.

Do not request one image containing both button states.

Normal-state prompt additions should request:

* isolated reusable UI button
* transparent background
* exact requested dimensions
* no mockup
* no surrounding dashboard
* no hand or finger
* no device frame
* button fills the usable canvas
* consistent centered design

Pressed-state prompt additions should request:

* same design as the normal state
* visibly depressed or illuminated
* same dimensions
* same shape
* same text
* same icon placement
* no layout changes
* transparent background

The pressed state should look like the same control being touched, not a different button.

---

# Important Generation Limitation

Image generation may not produce perfectly matching states.

For V1, allow separate generation and manual retry.

Future improvement:

* generate Pressed state from the Normal image
* apply controlled brightness, inset, scale or shading changes
* avoid relying on two unrelated generations

Do not block V1 on solving this perfectly.

---

# Interactive Asset Library

Create a separate library panel:

```text
Interactive Asset Library
```

Each card should show:

* name
* control type
* dimensions
* normal preview
* pressed preview
* status
* Insert
* Delete

Optional development control:

* Test Pressed State

The library must reload from disk after Studio restart.

---

# First Persistence Test

Before editor insertion is added, prove this exact flow:

```text
Generate Normal state
Generate Pressed state
Save button package
Close Studio
Restart Studio
Open Interactive Asset Library
Saved button is still present
Normal and Pressed images both load
Delete removes the package from disk and library
```

Do not proceed to editor integration until this works reliably.

---

# Editor Component

After persistence is proven, add one new editor component:

```text
InteractiveButton
```

Suggested component data:

```ts
{
  type: 'InteractiveButton',
  props: {
    interactiveAssetId: string,
    interactionMode: 'momentary'
  }
}
```

Do not duplicate the image data inside every component instance.

Each instance references the saved Interactive Asset by ID.

---

# Editor Insertion

When the user clicks Insert:

* create an `InteractiveButton`
* use the asset width and height
* place it at a sensible visible position
* select it
* ensure the selection border matches the button size
* do not insert it inside an oversized wrapper
* do not default it to the top-left if an editor insertion position is available

The component must remain movable and resizable.

Resizing should not alter the original saved asset package.

---

# Browser Preview Behaviour

Create:

```text
InteractiveButtonPreview.tsx
```

Required behaviour:

```text
pointer down
→ pressed image

pointer up
→ normal image

pointer cancel
→ normal image

pointer leave while pressed
→ normal image
```

Also support touch through pointer events where possible.

Avoid separate mouse and touch implementations unless required.

The preview should not modify the saved asset.

State belongs to the component preview instance.

---

# Editor Behaviour

In editor mode, pressing the button should not accidentally drag it.

The interaction system must distinguish:

* selecting or moving the component in editor mode
* operating the component in interactive preview mode

Do not break existing editor drag behaviour.

A dedicated preview mode may be used for functional interaction.

---

# LVGL Export

Only begin LVGL export after browser preview works.

The generated output requires:

* Normal image asset
* Pressed image asset
* LVGL image declarations
* clickable LVGL object
* press event
* release event
* visual state swap

Possible LVGL implementation:

```text
lv_imagebutton
```

or:

```text
lv_obj + lv_image
```

Choose the implementation that provides the cleanest LVGL v9 behaviour and export reliability.

Do not assume the implementation before checking the current ForgeUI exporter patterns.

---

# LVGL Button Behaviour

Required V1 behaviour:

```text
LV_EVENT_PRESSED
→ show pressed image

LV_EVENT_RELEASED
→ show normal image

LV_EVENT_PRESS_LOST
→ show normal image
```

The exported button must return to Normal if the touch is dragged away.

---

# Generated Code Boundaries

The generated control should expose a future callback hook, but V1 does not need application logic.

A future-friendly hook may be reserved:

```c
void forgeui_interactive_button_clicked(
    lv_event_t *event
);
```

For V1, this may remain empty or omitted.

Do not add unused complex callback systems.

---

# Export Package Naming

Use stable and safe names.

Example asset ID:

```text
interactive_button_1721270000000_a1b2c3d4
```

Example LVGL symbols:

```text
fg_interactive_button_1721270000000_a1b2c3d4_normal
fg_interactive_button_1721270000000_a1b2c3d4_pressed
```

Sanitize user-facing names before using them in files or C symbols.

The asset ID must remain the source of truth.

---

# Integration Points

The new feature may make small changes to:

* main navigation or tool panel registration
* editor component registration
* component preview routing
* default component sizing
* export component routing
* server endpoint registration
* static asset serving

Keep each integration change small.

Do not rewrite these systems.

---

# Files the Feature May Freely Create

```text
src/forgeui/interactive-assets/**
forgeui-assets/interactive/**
```

---

# Existing Areas That Must Remain Stable

Do not refactor or replace:

```text
Hero asset pipeline
Artwork asset pipeline
Uploaded asset registry
Theme Manager
Theme persistence
Firmware flashing
Firmware maintenance
Standalone export baseline
Existing LVGL image conversion
Builder core
Existing image insertion
```

Reuse proven utilities through adapters where safe.

Do not move existing files merely to make the new feature look cleaner.

---

# AI Coding-Agent Permissions

The coding AI may:

* create files inside the Interactive Assets feature directory
* create server routes required for Interactive Asset storage
* add small registration entries
* add isolated component routing
* reuse existing image-generation and image-conversion utilities
* add types and tests related to Interactive Assets

The coding AI must not:

* redesign the whole asset system
* merge Interactive Assets into existing uploaded artwork records
* change proven image export behaviour globally
* modify firmware flashing logic
* change partition tables
* rewrite editor drag-and-drop
* rename broad project directories
* add speculative asset types

---

# Implementation Phases

## Phase 1 — Foundation

Create:

* feature folder
* base asset type
* Interactive Button type
* ID generator
* validation
* registry shell
* storage shell

Success condition:

```text
A valid InteractiveButtonAsset object can be created,
validated, registered and retrieved.
```

---

## Phase 2 — Persistent Packages

Create:

* save endpoint
* load endpoint
* delete endpoint
* manifest persistence
* normal PNG persistence
* pressed PNG persistence
* static serving

Success condition:

```text
A manually supplied two-state button package
survives Studio restart.
```

---

## Phase 3 — Button Designer

Create:

* Interactive Asset Designer
* Button type only
* name
* prompt
* width
* height
* Normal generation
* Pressed generation
* preview
* Save button

Success condition:

```text
AI-generated Normal and Pressed states
can be saved as one Interactive Button package.
```

---

## Phase 4 — Interactive Asset Library

Create:

* library list
* asset cards
* preview both states
* status
* delete
* reload

Success condition:

```text
Saved button packages are visible,
reload correctly and can be deleted.
```

---

## Phase 5 — Editor Insertion

Create:

* InteractiveButton component
* component registration
* insert action
* default native size
* selection support
* inspector summary

Success condition:

```text
A saved Interactive Button can be inserted,
selected, moved and resized on the canvas.
```

---

## Phase 6 — Browser Interaction

Create:

* Normal state rendering
* Pressed state rendering
* pointer event handling
* release and cancel handling

Success condition:

```text
The button visually presses and releases
inside Browser Preview.
```

---

## Phase 7 — LVGL Export

Create:

* image conversion for both states
* asset source collection
* C symbol declarations
* clickable LVGL object
* state swap event callback
* standalone export support

Success condition:

```text
The exported project builds successfully
with both button image states included.
```

---

## Phase 8 — Physical ESP32-P4 Test

Test:

* button displays
* touch target matches button
* pressed state appears immediately
* released state restores correctly
* dragging away restores Normal
* no crashes
* no missing assets
* standalone export works
* Studio flash works

Success condition:

```text
AI-generated Interactive Button
works on the physical ESP32-P4.
```

---

# First Release Boundary

Interactive Assets V1 is complete when:

* one Button type exists
* two visual states exist
* packages persist to disk
* library reloads them
* buttons insert into the editor
* browser press/release works
* LVGL export works
* physical ESP32-P4 touch works

Nothing else is required for V1.

---

# Next Asset After Button

After Button V1 is fully proven, create:

**Interactive LED V1**

States:

* Off
* On

Then connect:

```text
Button pressed
→ LED On

Button released
→ LED Off
```

That will prove communication between an input asset and an output asset.

Do not begin LED work until the Button pipeline is signed off.

---

# Future Interactive Asset Types

Future candidates:

```text
LED
Switch
Toggle Button
Slider
Rotary Control
Progress Indicator
Gauge
Alarm Indicator
Navigation Button
Numeric Stepper
Keypad Button
```

These are roadmap items only.

Do not scaffold them yet.

---

# Development Principles

* One working control before a generic framework.
* Separate visual generation from application behaviour.
* Save reusable packages, not loose images.
* Keep disk as the source of truth.
* Keep editor instances linked by asset ID.
* Keep proven systems untouched.
* Use explicit registration points.
* Test persistence before editor integration.
* Test browser behaviour before LVGL export.
* Test Studio flash and standalone export.
* Keep names short and understandable.
* Avoid giant files.
* Avoid hidden side effects.
* Avoid speculative abstractions.
* Build the smallest complete vertical slice.

---

# First Coding Instruction

Begin with Phase 1 only.

Create the Interactive Assets feature folder, base model, Interactive Button model, validation, ID generation and registry.

Do not build UI yet.

Do not add image generation yet.

Do not modify the existing artwork or hero pipelines.

Return:

* files created
* files changed
* full code for each new file
* any registration edits
* a short test showing that an Interactive Button can be registered and retrieved