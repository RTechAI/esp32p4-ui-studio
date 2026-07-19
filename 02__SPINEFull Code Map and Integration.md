# ForgeUI Interactive Assets — Physical Pressed-State Runtime Proven

## Savepoint

`FORGEUI_INTERACTIVE_BUTTON_PHYSICAL_PRESSED_STATE__LVGL_EVENT_RUNTIME_PROVEN`

---

# Overview

The ForgeUI Interactive Button pipeline is now fully operational from Studio through to physical ESP32-P4 hardware.

Interactive Buttons now automatically export their runtime behavior using the existing LVGL exporter.

No duplicate exporter was created.

The existing architecture has been extended without redesign.

---

# Proven Features

- Interactive Asset Definitions
- Interactive Button Asset Type
- Registry
- Persistence
- Validation
- ID Generation
- Designer
- Create
- Edit
- Delete
- Save
- Normal Image Picker
- Pressed Image Picker
- Live Preview
- Toolbox
- Drag & Drop
- Canvas
- Browser Preview
- Selection
- Borders
- Multi-Instance
- Use On Selected
- Inspector Sync
- Redux Sync
- Immediate Refresh
- Restart Persistence
- LVGL Export
- Firmware Build
- Firmware Flash
- Physical ESP32-P4 Rendering
- Physical Pressed State
- Physical Release State

---

# LVGL Runtime

The existing exporter now automatically generates:

## Shared Runtime Data

```c
typedef struct
{
    const void * normal_src;
    const void * pressed_src;
} fg_interactive_button_data_t;
```

---

## Shared Event Callback

```c
static void fg_interactive_button_event_cb(lv_event_t *event)
```

This callback automatically:

- Detects button pressed
- Swaps to the pressed image
- Detects release
- Restores the normal image
- Handles press-lost events safely

---

# Automatic Export

Each Interactive Button now exports:

- LV Button
- LV Image
- Runtime asset data
- Event callbacks
- Normal image
- Pressed image

No manual firmware coding is required.

---

# Automatic Event Wiring

Every generated button is automatically connected to:

- `LV_EVENT_PRESSED`
- `LV_EVENT_RELEASED`
- `LV_EVENT_PRESS_LOST`

Each instance maintains its own runtime image state.

Multiple buttons are fully supported.

---

# Existing Export Pipeline Preserved

The implementation continues to reuse:

- `generateForgeUILvglCode()`
- `getInteractiveAsset()`
- `forgeUIGetUploadedAssets()`
- `asset.lvgl`
- `asset.cFile`
- `usedAssetSources`
- `LV_IMAGE_DECLARE()`

No duplicate exporter.

No special runtime.

No firmware changes outside the exporter.

---

# Physical Hardware Validation

Successfully proven on ESP32-P4.

Verified:

- Build
- Flash
- Boot
- Normal image displayed
- Pressed image displayed while held
- Normal image restored after release
- Multiple Interactive Buttons working simultaneously

---

# Architecture Status

The Interactive Button system is now complete through the entire pipeline.

Studio

↓

Registry

↓

Persistence

↓

Canvas

↓

Browser Preview

↓

LVGL Export

↓

Firmware Build

↓

ESP32-P4 Runtime

↓

Touch Events

↓

Pressed Image

↓

Release Image

---

# Next Phase

The next milestone is Interactive Actions.

Instead of only changing appearance, buttons will execute configurable actions.

Examples include:

- Navigate to another screen
- Show or hide components
- Toggle visibility
- Toggle LEDs
- Update text
- Start animations
- Trigger runtime callbacks
- Execute generated user code
- Send future hardware events

The visual state system is now complete.

The next stage is connecting Interactive Buttons to runtime behaviour.

--------------------------------------------------------------------------------


# ForgeUI Interactive Assets

# Full Code Map & Integration Spine

---

# Purpose

This document is the permanent integration map for the ForgeUI Interactive Asset system.

Its purpose is to prevent future development sessions from:

* Searching through multiple files to discover ownership.
* Reinvestigating already solved problems.
* Accidentally rebuilding proven systems.
* Losing track of the data flow.

This document defines:

* Every major file.
* Ownership of each subsystem.
* Data flow.
* Integration points.
* Proven fixes.
* Components that must not be rewritten.
* Where to begin when debugging.
* The next development phase.

---

# System Overview

```
Natural-Language Prompt
        │
        ▼
Shared AI Image Pipeline
        │
        ├── Normal Button Image
        │
        └── Pressed Button Image
        │
        ▼
Uploaded Image Asset Registry
        │
        ▼
LVGL Image Conversion
        │
        ▼
Interactive Asset Designer
        │
        ▼
Interactive Asset Registry
        │
        ▼
Interactive Button Component
        │
        ▼
Canvas Preview
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
ESP32-P4 Runtime
```

---

# 1. Interactive Asset Core

## Files

```
ForgeUIInteractiveAsset.ts
ForgeUIInteractiveButtonAsset.ts
ForgeUIInteractiveAssetRegistry.ts
ForgeUIInteractiveAssetPersistence.ts
ForgeUIInteractiveAssetValidation.ts
ForgeUIInteractiveAssetIds.ts
```

---

## ForgeUIInteractiveAsset.ts

Owns the base Interactive Asset definition shared by all future interactive asset types.

---

## ForgeUIInteractiveButtonAsset.ts

Defines the Interactive Button asset.

Stores:

* Asset ID
* Asset Name
* Button Label
* Width
* Height
* Normal Image Asset ID
* Pressed Image Asset ID

Typical properties

```ts
normalAssetId
pressedAssetId
width
height
label
```

This is the master definition for an Interactive Button.

---

## ForgeUIInteractiveAssetRegistry.ts

Owns the in-memory registry.

Responsibilities

* Register
* Lookup
* Remove
* Update
* Enumerate

Used by:

* Interactive Asset Panel
* Canvas Preview
* Browser Preview
* Export pipeline

Do **not** duplicate this registry in React state or Redux.

---

## ForgeUIInteractiveAssetPersistence.ts

Owns saving and loading.

Main function

```ts
saveInteractiveAssets()
```

Proven

* Save
* Reload
* Restart persistence
* Assignment persistence

---

## ForgeUIInteractiveAssetValidation.ts

Validation rules.

Stops invalid Interactive Assets entering:

* Registry
* Export pipeline

---

## ForgeUIInteractiveAssetIds.ts

Owns ID generation.

```ts
createInteractiveAssetId()
```

Do not generate IDs elsewhere.

---

# 2. Uploaded Image Asset Registry

## File

```
ForgeUIUploadedAssetRegistry.ts
```

This registry owns every uploaded image used by ForgeUI.

Examples

* Normal Button Images
* Pressed Button Images
* Artwork
* Icons
* Hero Backgrounds
* LVGL Images

Interactive Assets store **references only**.

They never store the image itself.

---

## Main Type

```
ForgeUIUploadedAsset
```

Contains

```
id
name
type
size
createdAt
browserSrc
kind
exportStatus
lvgl
cFile
```

---

## Export Status

```
browser_only
pending_conversion
lvgl_ready
```

The Interactive Button designer filters for

```ts
asset.type.startsWith("image/") &&
asset.exportStatus === "lvgl_ready"
```

---

## Registry Functions

```
forgeUICreateUploadedAsset()
forgeUIGetUploadedAssets()
forgeUIAddUploadedAssets()
forgeUIUpdateUploadedAsset()
forgeUIDeleteUploadedAsset()
forgeUIClearUploadedAssets()
```

---

## Persistence

Registry key

```
forgeui_uploaded_assets_v1
```

Persistent browser fallback

```
http://localhost:3030/forgeui-assets/uploads/${asset.lvgl}.png
```

---

## Registry Update Event

Every asset change dispatches

```ts
window.dispatchEvent(
    new Event("forgeui-assets-updated")
)
```

The Interactive Asset Panel listens for this event.

Do not replace this mechanism.

---

# 2A. Shared AI Image Pipeline

## File

```text
ForgeUIAIImagePipeline.ts
```

This is the shared AI image generation and LVGL preparation helper.

It must be reused by:

- Hero Background generation
- Artwork generation
- Interactive Button Normal generation
- Interactive Button Pressed generation
- Future AI-generated visual-state assets

Do not create a second upload or conversion pipeline for interactive controls.

---

## Main Function

```ts
generateAIImageAsset()
```

Options:

```ts
type AIImageGenerationMode =
  | 'hero'
  | 'artwork'
  | 'button-normal'
  | 'button-pressed'
```

```ts
type GenerateAIImageAssetOptions = {
  prompt: string
  filePrefix: string
  generationMode: AIImageGenerationMode
  assetMode:
    | 'hero'
    | 'artwork'
    | 'image'
    | 'icon'
}
```

---

## Generation Request

The helper calls:

```text
/api/forgeui-ai-hero
```

Request:

```ts
body: JSON.stringify({
  prompt: trimmedPrompt,
  mode: generationMode,
})
```

The existing endpoint name remains for compatibility, but the endpoint now supports multiple generation modes.

Do not assume this endpoint is hero-only.

---

## Asset Creation Flow

```text
generateAIImageAsset()
        ↓
AI API request
        ↓
Generated browser image
        ↓
Create File
        ↓
forgeUICreateUploadedAsset()
        ↓
forgeUIAddUploadedAssets()
        ↓
LVGL conversion server
        ↓
forgeUIUpdateUploadedAsset()
        ↓
ForgeUIUploadedAsset returned
```

---

## LVGL Conversion

The helper calls:

```text
http://localhost:3030/convert-lvgl-image
```

Request:

```ts
body: JSON.stringify({
  fileName: uploadedAsset.name,
  symbolName: uploadedAsset.lvgl,
  base64: uploadedAsset.browserSrc,
  assetMode,
})
```

Successful conversion updates:

```ts
exportStatus: 'lvgl_ready'
lvgl: conversionPayload.symbolName
cFile: conversionPayload.assetSource
browserSrc:
  conversionPayload.browserSrc ||
  uploadedAsset.browserSrc
```

---

## Generation Mode vs Asset Mode

These are separate responsibilities.

### generationMode

Controls what the AI creates.

```text
hero
artwork
button-normal
button-pressed
```

### assetMode

Controls image preprocessing and LVGL conversion.

```text
hero
artwork
image
icon
```

For the current Interactive Button implementation:

```ts
generationMode: 'button-normal'
assetMode: 'artwork'
```

and:

```ts
generationMode: 'button-pressed'
assetMode: 'artwork'
```

Do not combine these two concepts.

---

# 3A. AI Interactive Button Designer

The existing file remains:

```text
ForgeUIInteractiveAssetPanel.tsx
```

The panel now also owns the AI Interactive Button generation controls.

Additional state:

```ts
const [
  aiPrompt,
  setAiPrompt,
] = useState('')

const [
  isGeneratingAIButton,
  setIsGeneratingAIButton,
] = useState(false)
```

---

## AI Generation Handler

```ts
generateAIButton()
```

Responsibilities:

1. Validate the prompt.
2. Enable the generation loading state.
3. Generate the Normal state.
4. Generate the Pressed state.
5. Refresh uploaded assets.
6. Assign both generated asset IDs.
7. Close the manual visual selector.
8. Restore the loading state.

Flow:

```text
AI Prompt
    ↓
generateAIButton()
    ↓
generateAIImageAsset(
  generationMode: 'button-normal'
)
    ↓
Normal ForgeUIUploadedAsset
    ↓
generateAIImageAsset(
  generationMode: 'button-pressed'
)
    ↓
Pressed ForgeUIUploadedAsset
    ↓
refreshUploadedAssets()
    ↓
setNormalAssetId()
    ↓
setPressedAssetId()
    ↓
InteractiveButtonPreview refresh
```

---

## Important Behaviour

The AI generation handler does not directly:

- Save the Interactive Asset
- Register the Interactive Button
- Assign it to a component
- Render the button
- Implement press behaviour

It only generates and selects the two uploaded visual assets.

The existing designer continues to own:

- Asset name
- Label
- Width
- Height
- Save
- Edit
- Delete
- Assignment
- Preview

Do not move existing save logic into the AI generation handler.

---

## Proven AI Generation

Confirmed:

- Prompt accepted
- Generate Button action runs
- Loading state works
- Normal image generated
- Pressed image generated
- Both images registered
- Both images converted to LVGL
- Both marked `lvgl_ready`
- Both automatically selected
- Designer preview refreshes
- Live press preview works
- Saved asset works on the canvas
- Canvas press and release states work

---


# 3. Interactive Asset Designer

## File

```
ForgeUIInteractiveAssetPanel.tsx
```

This is the primary editor.

Owns

* Asset List
* Create
* Edit
* Delete
* Save
* Normal Image Picker
* Pressed Image Picker
* Live Preview
* Selected Component Detection
* Assignment
* Registry Refresh

When changing the designer,

**START HERE**

---

## Important Imports

```
useSelector
getSelectedComponent
useForm
useDispatch
```

Registry

```
createDefaultInteractiveButtonAsset()
createInteractiveAssetId()
getAllInteractiveAssets()
registerInteractiveAsset()
reloadInteractiveAssets()
removeInteractiveAsset()
saveInteractiveAssets()
updateInteractiveAsset()
```

Uploaded Assets

```
forgeUIGetUploadedAssets()
```

Renderer

```
InteractiveButtonPreview
```

---

## Selected Component

```ts
const selectedComponent =
    useSelector(getSelectedComponent)

const selectedIsInteractiveButton =
    selectedComponent?.type === "InteractiveButton"
```

This is proven.

Do not reopen previous selection investigations unless a regression occurs.

---

## Assignment Handler

```ts
const assignInteractiveAsset = (
    asset: ForgeUIInteractiveButtonAsset,
) => {
    if (
        !selectedIsInteractiveButton ||
        !selectedComponent
    ) {
        return
    }

    setValue(
        "interactiveAssetId",
        asset.id,
    )

    dispatch.components.updateProps({
        id: selectedComponent.id,
        name: "interactiveAssetId",
        value: asset.id,
    })
}
```

---

## Why Both Updates Exist

### Form

```ts
setValue()
```

Keeps Inspector in sync.

### Redux

```ts
dispatch.components.updateProps()
```

Immediately refreshes the canvas.

Without Redux

```
Assignment saved
↓

Canvas remained placeholder
↓

Moving component forced refresh
```

This bug is fixed.

Do not remove either update.

---

## Asset Refresh

Interactive Assets

```ts
refreshAssets()
```

Uploaded Images

```ts
refreshUploadedAssets()
```

Uses

```ts
forgeUIGetUploadedAssets()
```

Important

```ts
setUploadedAssets([...assets])
```

A copied array is required because the registry exists outside React.

---

## Asset Event Listener

```ts
window.addEventListener(
    "forgeui-assets-updated",
    handleAssetsUpdated,
)
```

Cleanup

```ts
window.removeEventListener(...)
```

---

## Create

```
createDefaultInteractiveButtonAsset()
↓

registerInteractiveAsset()

↓

saveInteractiveAssets()
```

---

## Edit

```
updateInteractiveAsset()

↓

saveInteractiveAssets()

↓

refreshAssets()
```

---

## Delete

```
removeInteractiveAsset()

↓

saveInteractiveAssets()

↓

refreshAssets()
```

---

# 4. Pure Renderer

## File

```
InteractiveButtonPreview.tsx
```

Purpose

Pure rendering only.

Owns

* Normal State
* Pressed State
* Mouse Down
* Mouse Up
* Local Press State

Must **not** know about

* Redux
* Selection
* Registry
* Persistence
* Assignment
* Uploaded Assets

When changing visual rendering,

**START HERE**

---

# 5. Canvas Adapter

## File

```
InteractiveButtonCanvasPreview.tsx
```

Purpose

Bridge between the component and the renderer.

Owns

* Registry lookup
* Uploaded image lookup
* Asset resolution

Reads

```ts
component.props.interactiveAssetId
```

Looks up

```ts
getInteractiveAsset()
```

Then

```ts
forgeUIGetUploadedAssets()
```

Passes resolved assets into

```
InteractiveButtonPreview
```

Do **not** move lookup logic into the renderer.

---

# 6. Component Property Contract

Every Interactive Button stores only

```ts
component.props.interactiveAssetId
```

The component never stores

* Images
* Symbols
* Width
* Height

Those remain inside their registries.

---

# 7. Component Registration

InteractiveButton is registered in

```
ComponentType
COMPONENTS
rootComponents
componentsList
menuItems
forgeuiCoreWidgets
```

Controls

* Toolbox
* Drag
* Drop
* AI Awareness
* Widget Catalogue

If the component disappears,

check these registrations first.

---

# 8. Canvas Preview Registration

## File

```
ComponentPreview.tsx
```

Routes

```
InteractiveButton
↓

InteractiveButtonCanvasPreview
```

---

# 9. Browser Preview Registration

## File

```
forgePreviewRenderer.tsx
```

Uses the exact same adapter

```
InteractiveButtonCanvasPreview
```

Canvas and Browser Preview remain identical.

---

# 10. Editor Selection

## File

```
Editor.tsx
```

Fixed issue

Background clicks previously cleared selection.

Working code

```ts
if (event.target !== event.currentTarget) {
    return
}
```

Selection is now preserved.

---

# 11. PreviewContainer

## File

```
PreviewContainer.tsx
```

Owns

* Selection Border
* Resize
* Drag Wrapper
* Position Updates
* Event Forwarding

Selection

```ts
selectedComponentId === component.id
```

Only the selected component receives the highlight.

Mouse events are forwarded through the wrapper.

Without them

* Selection breaks
* Buttons appear locked
* Latest component owns focus

---

# 12. useInteractive

Correct

```ts
drag(ref)

return {
    props,
    ref,
    drag,
}
```

Do not restore

```ts
ref: drag(ref)
```

---

# 13. Resize Updates

Component properties expect

```
string
```

Always convert

```ts
String(value)
```

---

# 14. Redux Update Flow

```
dispatch.components.updateProps()

↓

Redux

↓

ComponentPreview

↓

Canvas Preview

↓

Registry Lookup

↓

Image Refresh
```

---

# 15. Inspector Update

```
setValue()

↓

Inspector
```

Both Form and Redux updates are required.

---

# 16. Full Assignment Pipeline

```
Toolbox
↓

Canvas Component

↓

Component Preview

↓

Canvas Adapter

↓

Placeholder

↓

User Selects Component

↓

Selection Updates

↓

Interactive Asset Panel

↓

Use on Selected

↓

setValue()

↓

Redux updateProps()

↓

Canvas Refresh

↓

Registry Lookup

↓

Uploaded Asset Lookup

↓

InteractiveButtonPreview

↓

Normal Image

↓

Pressed Image

↓

Browser Preview

↓

Restart Persistence
```

---

# 17. Multi-Instance

Proven

* Multiple Interactive Buttons
* Independent Selection
* Independent Assets
* Immediate Updates
* Restart Persistence

---

# 18. Resolved Issues

Do not reopen unless reproduced.

✔ Use on Selected disabled

✔ Selection cleared

✔ Every button selected

✔ Latest button owned focus

✔ Assignment appeared only after moving

✔ React ref error

✔ updateProps number conversion

---

# 19. Proven Systems

Do not rebuild

```
ForgeUIInteractiveAssetRegistry.ts
ForgeUIInteractiveAssetPersistence.ts
ForgeUIUploadedAssetRegistry.ts
InteractiveButtonPreview.tsx
InteractiveButtonCanvasPreview.tsx
ComponentPreview.tsx
forgePreviewRenderer.tsx
```

---

# 20. Debug Map

| Problem                 | Start Here                         |
| ----------------------- | ---------------------------------- |
| Cannot create/edit      | ForgeUIInteractiveAssetPanel.tsx   |
| Missing uploaded images | ForgeUIUploadedAssetRegistry.ts    |
| Assignment missing      | InteractiveButtonCanvasPreview.tsx |
| Cannot select           | PreviewContainer.tsx / Editor.tsx  |
| All buttons selected    | PreviewContainer.tsx               |
| Browser Preview broken  | forgePreviewRenderer.tsx           |
| Missing toolbox entry   | Component Registration             |
| Lost after restart      | Persistence + Registry             |
| Pressed state broken    | InteractiveButtonPreview.tsx       |
| Wrong image             | InteractiveButtonCanvasPreview.tsx |

---

# 21. Proven Features

Completed

* Interactive Asset Definitions
* Button Asset Type
* Registry
* Persistence
* Validation
* ID Generation
* Designer
* Create
* Edit
* Delete
* Save
* Normal Picker
* Pressed Picker
* AI Button Generator
* AI Prompt Input
* Dual-State AI Image Generation
* Automatic Uploaded Asset Registration
* Automatic LVGL Conversion
* Automatic Designer Assignment
* Live Preview
* Toolbox
* Drag & Drop
* Canvas
* Browser Preview
* Selection
* Borders
* Multi-Instance
* Use on Selected
* Inspector Sync
* Redux Sync
* Immediate Refresh
* Restart Persistence
---
# 22. Next Phase

## LVGL Export

Do **not** revisit the assignment system.

Instead, locate the existing exporter for

* Button
* Image
* IconButton
* Switch

Use

```ts
component.props.interactiveAssetId
```

Resolve

```ts
getInteractiveAsset()
```

Resolve uploaded assets

```ts
forgeUIGetUploadedAssets()
```

Use

```
asset.lvgl
asset.cFile
```

Generate an LVGL Interactive Button using the existing export architecture.

---

# 23. Future Runtime Hooks

After visual behaviour is proven

Possible properties

```ts
component.props.interactiveActionId
```

or

```ts
component.props.onPressAction
```

Future targets

* Page Navigation
* Visibility
* Value Updates
* GPIO
* Runtime Functions
* Generated Logic

Do not build hooks before physical button behaviour is proven.

---

# 24. Physical Validation Checklist

```
Create Interactive Asset
↓

Assign Normal Image
↓

Assign Pressed Image
↓

Drag Interactive Button
↓

Assign Asset
↓

Export

↓

Compile

↓

Flash ESP32-P4

↓

Normal Image

↓

Press

↓

Pressed Image

↓

Release

↓

Normal Image Restored
```


This is the canonical integration spine for the Interactive Asset system and should be updated as each new phase is completed rather than replaced.
