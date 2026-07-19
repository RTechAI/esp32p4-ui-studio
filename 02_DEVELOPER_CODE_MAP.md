ForgeUI Interactive Assets — Physical Pressed-State Runtime Proven

Savepoint

FORGEUI_INTERACTIVE_BUTTON_PHYSICAL_PRESSED_STATE__LVGL_EVENT_RUNTIME_PROVEN

Overview

The ForgeUI Interactive Button pipeline is now fully operational from Studio through to physical ESP32-P4 hardware.

Interactive Buttons now automatically export their runtime behavior using the existing LVGL exporter.

No duplicate exporter was created.

The existing architecture has been extended without redesign.

Proven Features

Interactive Asset Definitions

Interactive Button Asset Type

Registry

Persistence

Validation

ID Generation

Designer

Create

Edit

Delete

Save

Normal Image Picker

Pressed Image Picker

Live Preview

Toolbox

Drag & Drop

Canvas

Browser Preview

Selection

Borders

Multi-Instance

Use On Selected

Inspector Sync

Redux Sync

Immediate Refresh

Restart Persistence

LVGL Export

Firmware Build

Firmware Flash

Physical ESP32-P4 Rendering

Physical Pressed State

Physical Release State

LVGL Runtime

The existing exporter now automatically generates:

Shared Runtime Data

typedef struct
{
    const void * normal_src;
    const void * pressed_src;
} fg_interactive_button_data_t;

Shared Event Callback

static void fg_interactive_button_event_cb(lv_event_t *event)

This callback automatically:

Detects button pressed

Swaps to the pressed image

Detects release

Restores the normal image

Handles press-lost events safely

Automatic Export

Each Interactive Button now exports:

LV Button

LV Image

Runtime asset data

Event callbacks

Normal image

Pressed image

No manual firmware coding is required.

Automatic Event Wiring

Every generated button is automatically connected to:

LV_EVENT_PRESSED

LV_EVENT_RELEASED

LV_EVENT_PRESS_LOST

Each instance maintains its own runtime image state.

Multiple buttons are fully supported.

Existing Export Pipeline Preserved

The implementation continues to reuse:

generateForgeUILvglCode()

getInteractiveAsset()

forgeUIGetUploadedAssets()

asset.lvgl

asset.cFile

usedAssetSources

LV_IMAGE_DECLARE()

No duplicate exporter.

No special runtime.

No firmware changes outside the exporter.

Physical Hardware Validation

Successfully proven on ESP32-P4.

Verified:

Build

Flash

Boot

Normal image displayed

Pressed image displayed while held

Normal image restored after release

Multiple Interactive Buttons working simultaneously

Architecture Status

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

Next Phase

The next milestone is Interactive Actions.

Instead of only changing appearance, buttons will execute configurable actions.

Examples include:

Navigate to another screen

Show or hide components

Toggle visibility

Toggle LEDs

Update text

Start animations

Trigger runtime callbacks

Execute generated user code

Send future hardware events

The visual state system is now complete.

The next stage is connecting Interactive Buttons to runtime behaviour.

ForgeUI Interactive Assets

Full Code Map & Integration Spine

Purpose

This document is the permanent integration map for the ForgeUI Interactive Asset system.

Its purpose is to prevent future development sessions from:

Searching through multiple files to discover ownership.

Reinvestigating already solved problems.

Accidentally rebuilding proven systems.

Losing track of the data flow.

This document defines:

Every major file.

Ownership of each subsystem.

Data flow.

Integration points.

Proven fixes.

Components that must not be rewritten.

Where to begin when debugging.

The next development phase.

System Overview

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

1. Interactive Asset Core

Files

ForgeUIInteractiveAsset.ts
ForgeUIInteractiveButtonAsset.ts
ForgeUIInteractiveAssetRegistry.ts
ForgeUIInteractiveAssetPersistence.ts
ForgeUIInteractiveAssetValidation.ts
ForgeUIInteractiveAssetIds.ts

ForgeUIInteractiveAsset.ts

Owns the base Interactive Asset definition shared by all future interactive asset types.

ForgeUIInteractiveButtonAsset.ts

Defines the Interactive Button asset.

Stores:

Asset ID

Asset Name

Button Label

Width

Height

Normal Image Asset ID

Pressed Image Asset ID

Typical properties

normalAssetId
pressedAssetId
width
height
label

This is the master definition for an Interactive Button.

ForgeUIInteractiveAssetRegistry.ts

Owns the in-memory registry.

Responsibilities

Register

Lookup

Remove

Update

Enumerate

Used by:

Interactive Asset Panel

Canvas Preview

Browser Preview

Export pipeline

Do not duplicate this registry in React state or Redux.

ForgeUIInteractiveAssetPersistence.ts

Owns saving and loading.

Main function

saveInteractiveAssets()

Proven

Save

Reload

Restart persistence

Assignment persistence

ForgeUIInteractiveAssetValidation.ts

Validation rules.

Stops invalid Interactive Assets entering:

Registry

Export pipeline

ForgeUIInteractiveAssetIds.ts

Owns ID generation.

createInteractiveAssetId()

Do not generate IDs elsewhere.

2. Uploaded Image Asset Registry

File

ForgeUIUploadedAssetRegistry.ts

This registry owns every uploaded image used by ForgeUI.

Examples

Normal Button Images

Pressed Button Images

Artwork

Icons

Hero Backgrounds

LVGL Images

Interactive Assets store references only.

They never store the image itself.

Main Type

ForgeUIUploadedAsset

Contains

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

Export Status

browser_only
pending_conversion
lvgl_ready

The Interactive Button designer filters for

asset.type.startsWith("image/") &&
asset.exportStatus === "lvgl_ready"

Registry Functions

forgeUICreateUploadedAsset()
forgeUIGetUploadedAssets()
forgeUIAddUploadedAssets()
forgeUIUpdateUploadedAsset()
forgeUIDeleteUploadedAsset()
forgeUIClearUploadedAssets()

Persistence

Registry key

forgeui_uploaded_assets_v1

Persistent browser fallback

http://localhost:3030/forgeui-assets/uploads/${asset.lvgl}.png

Registry Update Event

Every asset change dispatches

window.dispatchEvent(
    new Event("forgeui-assets-updated")
)

The Interactive Asset Panel listens for this event.

Do not replace this mechanism.

2A. Shared AI Image Pipeline

File

ForgeUIAIImagePipeline.ts

This is the shared AI image generation and LVGL preparation helper.

It must be reused by:

Hero Background generation

Artwork generation

Interactive Button Normal generation

Interactive Button Pressed generation

Future AI-generated visual-state assets

Do not create a second upload or conversion pipeline for interactive controls.

Main Function

generateAIImageAsset()

Options:

type AIImageGenerationMode =
  | 'hero'
  | 'artwork'
  | 'button-normal'
  | 'button-pressed'

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

Generation Request

The helper calls:

/api/forgeui-ai-hero

Request:

body: JSON.stringify({
  prompt: trimmedPrompt,
  mode: generationMode,
})

The existing endpoint name remains for compatibility, but the endpoint now supports multiple generation modes.

Do not assume this endpoint is hero-only.

Asset Creation Flow

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

LVGL Conversion

The helper calls:

http://localhost:3030/convert-lvgl-image

Request:

body: JSON.stringify({
  fileName: uploadedAsset.name,
  symbolName: uploadedAsset.lvgl,
  base64: uploadedAsset.browserSrc,
  assetMode,
})

Successful conversion updates:

exportStatus: 'lvgl_ready'
lvgl: conversionPayload.symbolName
cFile: conversionPayload.assetSource
browserSrc:
  conversionPayload.browserSrc ||
  uploadedAsset.browserSrc

Generation Mode vs Asset Mode

These are separate responsibilities.

generationMode

Controls what the AI creates.

hero
artwork
button-normal
button-pressed

assetMode

Controls image preprocessing and LVGL conversion.

hero
artwork
image
icon

For the current Interactive Button implementation:

generationMode: 'button-normal'
assetMode: 'artwork'

and:

generationMode: 'button-pressed'
assetMode: 'artwork'

Do not combine these two concepts.

3A. AI Interactive Button Designer

The existing file remains:

ForgeUIInteractiveAssetPanel.tsx

The panel now also owns the AI Interactive Button generation controls.

Additional state:

const [
  aiPrompt,
  setAiPrompt,
] = useState('')

const [
  isGeneratingAIButton,
  setIsGeneratingAIButton,
] = useState(false)

AI Generation Handler

generateAIButton()

Responsibilities:

Validate the prompt.

Enable the generation loading state.

Generate the Normal state.

Generate the Pressed state.

Refresh uploaded assets.

Assign both generated asset IDs.

Close the manual visual selector.

Restore the loading state.

Flow:

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

Important Behaviour

The AI generation handler does not directly:

Save the Interactive Asset

Register the Interactive Button

Assign it to a component

Render the button

Implement press behaviour

It only generates and selects the two uploaded visual assets.

The existing designer continues to own:

Asset name

Label

Width

Height

Save

Edit

Delete

Assignment

Preview

Do not move existing save logic into the AI generation handler.

Proven AI Generation

Confirmed:

Prompt accepted

Generate Button action runs

Loading state works

Normal image generated

Pressed image generated

Both images registered

Both images converted to LVGL

Both marked lvgl_ready

Both automatically selected

Designer preview refreshes

Live press preview works

Saved asset works on the canvas

Canvas press and release states work

3. Interactive Asset Designer

File

ForgeUIInteractiveAssetPanel.tsx

This is the primary editor.

Owns

Asset List

Create

Edit

Delete

Save

Normal Image Picker

Pressed Image Picker

Live Preview

Selected Component Detection

Assignment

Registry Refresh

When changing the designer,

START HERE

Important Imports

useSelector
getSelectedComponent
useForm
useDispatch

Registry

createDefaultInteractiveButtonAsset()
createInteractiveAssetId()
getAllInteractiveAssets()
registerInteractiveAsset()
reloadInteractiveAssets()
removeInteractiveAsset()
saveInteractiveAssets()
updateInteractiveAsset()

Uploaded Assets

forgeUIGetUploadedAssets()

Renderer

InteractiveButtonPreview

Selected Component

const selectedComponent =
    useSelector(getSelectedComponent)

const selectedIsInteractiveButton =
    selectedComponent?.type === "InteractiveButton"

This is proven.

Do not reopen previous selection investigations unless a regression occurs.

Assignment Handler

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

Why Both Updates Exist

Form

setValue()

Keeps Inspector in sync.

Redux

dispatch.components.updateProps()

Immediately refreshes the canvas.

Without Redux

Assignment saved
↓

Canvas remained placeholder
↓

Moving component forced refresh

This bug is fixed.

Do not remove either update.

Asset Refresh

Interactive Assets

refreshAssets()

Uploaded Images

refreshUploadedAssets()

Uses

forgeUIGetUploadedAssets()

Important

setUploadedAssets([...assets])

A copied array is required because the registry exists outside React.

Asset Event Listener

window.addEventListener(
    "forgeui-assets-updated",
    handleAssetsUpdated,
)

Cleanup

window.removeEventListener(...)

Create

createDefaultInteractiveButtonAsset()
↓

registerInteractiveAsset()

↓

saveInteractiveAssets()

Edit

updateInteractiveAsset()

↓

saveInteractiveAssets()

↓

refreshAssets()

Delete

removeInteractiveAsset()

↓

saveInteractiveAssets()

↓

refreshAssets()

4. Pure Renderer

File

InteractiveButtonPreview.tsx

Purpose

Pure rendering only.

Owns

Normal State

Pressed State

Mouse Down

Mouse Up

Local Press State

Must not know about

Redux

Selection

Registry

Persistence

Assignment

Uploaded Assets

When changing visual rendering,

START HERE

5. Canvas Adapter

File

InteractiveButtonCanvasPreview.tsx

Purpose

Bridge between the component and the renderer.

Owns

Registry lookup

Uploaded image lookup

Asset resolution

Reads

component.props.interactiveAssetId

Looks up

getInteractiveAsset()

Then

forgeUIGetUploadedAssets()

Passes resolved assets into

InteractiveButtonPreview

Do not move lookup logic into the renderer.

6. Component Property Contract

Every Interactive Button stores only

component.props.interactiveAssetId

The component never stores

Images

Symbols

Width

Height

Those remain inside their registries.

7. Component Registration

InteractiveButton is registered in

ComponentType
COMPONENTS
rootComponents
componentsList
menuItems
forgeuiCoreWidgets

Controls

Toolbox

Drag

Drop

AI Awareness

Widget Catalogue

If the component disappears,

check these registrations first.

8. Canvas Preview Registration

File

ComponentPreview.tsx

Routes

InteractiveButton
↓

InteractiveButtonCanvasPreview

9. Browser Preview Registration

File

forgePreviewRenderer.tsx

Uses the exact same adapter

InteractiveButtonCanvasPreview

Canvas and Browser Preview remain identical.

10. Editor Selection

File

Editor.tsx

Fixed issue

Background clicks previously cleared selection.

Working code

if (event.target !== event.currentTarget) {
    return
}

Selection is now preserved.

11. PreviewContainer

File

PreviewContainer.tsx

Owns

Selection Border

Resize

Drag Wrapper

Position Updates

Event Forwarding

Selection

selectedComponentId === component.id

Only the selected component receives the highlight.

Mouse events are forwarded through the wrapper.

Without them

Selection breaks

Buttons appear locked

Latest component owns focus

12. useInteractive

Correct

drag(ref)

return {
    props,
    ref,
    drag,
}

Do not restore

ref: drag(ref)

13. Resize Updates

Component properties expect

string

Always convert

String(value)

14. Redux Update Flow

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

15. Inspector Update

setValue()

↓

Inspector

Both Form and Redux updates are required.

16. Full Assignment Pipeline

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

17. Multi-Instance

Proven

Multiple Interactive Buttons

Independent Selection

Independent Assets

Immediate Updates

Restart Persistence

18. Resolved Issues

Do not reopen unless reproduced.

✔ Use on Selected disabled

✔ Selection cleared

✔ Every button selected

✔ Latest button owned focus

✔ Assignment appeared only after moving

✔ React ref error

✔ updateProps number conversion

19. Proven Systems

Do not rebuild

ForgeUIInteractiveAssetRegistry.ts
ForgeUIInteractiveAssetPersistence.ts
ForgeUIUploadedAssetRegistry.ts
InteractiveButtonPreview.tsx
InteractiveButtonCanvasPreview.tsx
ComponentPreview.tsx
forgePreviewRenderer.tsx

20. Debug Map

Problem

Start Here

Cannot create/edit

ForgeUIInteractiveAssetPanel.tsx

Missing uploaded images

ForgeUIUploadedAssetRegistry.ts

Assignment missing

InteractiveButtonCanvasPreview.tsx

Cannot select

PreviewContainer.tsx / Editor.tsx

All buttons selected

PreviewContainer.tsx

Browser Preview broken

forgePreviewRenderer.tsx

Missing toolbox entry

Component Registration

Lost after restart

Persistence + Registry

Pressed state broken

InteractiveButtonPreview.tsx

Wrong image

InteractiveButtonCanvasPreview.tsx

21. Proven Features

Completed

Interactive Asset Definitions

Button Asset Type

Registry

Persistence

Validation

ID Generation

Designer

Create

Edit

Delete

Save

Normal Picker

Pressed Picker

AI Button Generator

AI Prompt Input

Dual-State AI Image Generation

Automatic Uploaded Asset Registration

Automatic LVGL Conversion

Automatic Designer Assignment

Live Preview

Toolbox

Drag & Drop

Canvas

Browser Preview

Selection

Borders

Multi-Instance

Use on Selected

Inspector Sync

Redux Sync

Immediate Refresh

Restart Persistence

22. Next Phase

LVGL Export

Do not revisit the assignment system.

Instead, locate the existing exporter for

Button

Image

IconButton

Switch

Use

component.props.interactiveAssetId

Resolve

getInteractiveAsset()

Resolve uploaded assets

forgeUIGetUploadedAssets()

Use

asset.lvgl
asset.cFile

Generate an LVGL Interactive Button using the existing export architecture.

23. Future Runtime Hooks

After visual behaviour is proven

Possible properties

component.props.interactiveActionId

or

component.props.onPressAction

Future targets

Page Navigation

Visibility

Value Updates

GPIO

Runtime Functions

Generated Logic

Do not build hooks before physical button behaviour is proven.

24. Physical Validation Checklist

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

This is the canonical integration spine for the Interactive Asset system and should be updated as each new phase is completed rather than replaced.

EXPORTER SIDE

Interactive Button LVGL Export — Integration Map (Proven)

Overview

The Interactive Button now exports completely through the existing ForgeUI LVGL exporter.

No second exporter was created.

The implementation extends the existing export pipeline only.

This section documents every integration point so future development does not need to search the project.

Primary Export File

All Interactive Button export logic lives inside:

generateForgeUILvglCode()

within the ForgeUI LVGL exporter.

This remains the single source of truth for firmware generation.

Do not create another exporter.

Imports Added

The exporter now imports:

import { getInteractiveAsset } from './interactive'

import { forgeUIGetUploadedAssets }
from './ForgeUIUploadedAssetRegistry'

Purpose:

Resolve Interactive Assets

Resolve uploaded LVGL-ready assets

Locate exported C files

Locate LVGL symbol names

Export Flow

Each InteractiveButton component now exports using the following pipeline:

Canvas Component

↓

interactiveAssetId

↓

getInteractiveAsset()

↓

normalAssetId

pressedAssetId

↓

forgeUIGetUploadedAssets()

↓

LVGL Ready Assets

↓

asset.lvgl

asset.cFile

↓

LV_IMAGE_DECLARE()

↓

Generated Runtime Button

InteractiveButton Export Case

A dedicated exporter now exists:

case 'InteractiveButton'

Responsibilities:

Resolve Interactive Asset

Resolve Normal asset

Resolve Pressed asset

Validate LVGL readiness

Export runtime button

Export runtime image

Register event callbacks

Existing Systems Reused

The exporter intentionally reuses the existing infrastructure.

No duplicate asset pipeline exists.

Reused systems:

generateForgeUILvglCode()

getInteractiveAsset()

forgeUIGetUploadedAssets()

asset.lvgl

asset.cFile

usedAssetSources

LV_IMAGE_DECLARE()

Asset Validation

Before export the following is verified:

Interactive Asset exists

↓

Normal Asset exists

↓

Pressed Asset exists

↓

Both are LVGL Ready

↓

Export images

Else

Generate fallback placeholder button

This prevents broken firmware exports when assets are missing.

Asset Source Collection

The exporter automatically adds required generated C files:

usedAssetSources.add(
    normalAsset.cFile
)

usedAssetSources.add(
    pressedAsset.cFile
)

These become part of the generated firmware build automatically.

LVGL Image Declarations

Each exported button generates:

LV_IMAGE_DECLARE(normalSymbol);

LV_IMAGE_DECLARE(pressedSymbol);

Duplicate declarations are avoided when both states reference the same image.

Runtime Objects Generated

Each Interactive Button exports:

lv_button

↓

lv_image

↓

Normal image

↓

Runtime data

↓

Event callbacks

No additional runtime object types were introduced.

Runtime Support Added

The exporter now emits one shared runtime structure:

typedef struct
{
    const void * normal_src;
    const void * pressed_src;
}
fg_interactive_button_data_t;

This is generated once for the entire project.

Runtime Event Callback

The exporter also emits one shared callback:

fg_interactive_button_event_cb()

Responsibilities:

Handle LV_EVENT_PRESSED

Handle LV_EVENT_RELEASED

Handle LV_EVENT_PRESS_LOST

Swap button artwork

Restore normal state

This callback is reused by every exported Interactive Button.

Per Button Runtime Data

Each exported button automatically creates:

static fg_interactive_button_data_t objX_data

containing:

Normal image pointer

Pressed image pointer

Each button therefore maintains completely independent runtime state.

Automatic Event Wiring

Each exported Interactive Button automatically registers:

LV_EVENT_PRESSED

LV_EVENT_RELEASED

LV_EVENT_PRESS_LOST

No manual firmware coding is required.

Generated Runtime Behaviour

Physical runtime now behaves as:

Normal

↓

Touch

↓

Pressed Image

↓

Release

↓

Normal Image

↓

Press Lost

↓

Normal Image

Proven Hardware Result

Verified on the physical ESP32-P4:

Build successful

Flash successful

Boot successful

Normal image displayed

Pressed image displayed

Release restores normal image

Multiple buttons operate independently

Current Export Ownership

Future Interactive Controls should continue extending the existing exporter.

Do not create:

InteractiveButtonExporter.ts

Separate LVGL generator

Parallel runtime generator

Everything should continue through:

generateForgeUILvglCode()

↓

case 'InteractiveButton'

↓

Shared runtime callback

↓

Generated LVGL project

----------------------

---

---

## Generated Hook Layer

Purpose

Expose generated UI controls to user application code.

Generated files

```text
95_UserEvents.c
95_UserEvents.h

Responsibilities

Interactive Button callbacks
Future Status Light control
Future Widget callbacks
Customer application behaviour

Rules

Generated UI calls user hooks.
User hooks never modify generated code.
User hook files are preserved during re-export.

That section will become the foundation of everything you're about to build.

---

## I also love one subtle thing you've done

You no longer describe features.

You describe **ownership**.

For example:


Renderer

Owns rendering only.

Never performs registry lookups.


That single sentence is worth pages of documentation because it immediately tells a developer what **not** to do.

---

## Going forward

I think you now have **three permanent documents**:

1. **ForgeUI Studio — Developer Code Map** *(entire project map)*
2. **ForgeUI Interactive Assets — Permanent Code Map** *(subsystem map)*
3. **Milestones / Savepoints** *(history only)*

That separation is exactly what large software projects do. It means a new session can orient itself quickly, while milestone documents stay focused on progress instead of architecture.

I wouldn't make this document much bigger now. Keep it as a navigation map. Every time you add a subsystem—like Status Lights, Gauges, or User Hooks—just add another ownership section. If you can still answer "where does this live?" in under 30 seconds by reading this document, then it's doing its job perfectly.

This is now the proven architecture for Interactive Asset export.