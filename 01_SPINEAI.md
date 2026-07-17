# FORGEUI AI SPINE — AI ASSET DESIGNER HANDOVER

## Current Save Point

```text
FORGEUI_AI_ASSET_LIBRARY_V1__GENERATION_SAVE_RELOAD_INSERT_PROVEN__PROMPT_LAYOUT_LIMITS_IDENTIFIED__NEXT_ASSET_NORMALISER_AND_TEMPLATE_GUIDANCE__2026-07-17
```

## Commit Candidate

```text
feat(ai): prove reusable asset library and document prompt-layout limits
```

---

# Project Status

```text
ACTIVE
STABLE

AI LAYOUT PIPELINE PROVEN
AI HERO PIPELINE PROVEN
SEMANTIC ICON RESOLUTION PROVEN

AI ASSET GENERATION PROVEN
AI ASSET METADATA PREVIEW PROVEN
AI ASSET CANVAS INSERTION PROVEN
AI ASSET SAVE PROVEN
AI ASSET LOCALSTORAGE RELOAD PROVEN
SAVED ASSET REINSERTION PROVEN

AI ASSET VISUAL QUALITY NOT YET RELIABLE
```

---

# Important Clarification

The AI Asset pipeline is working.

The latest tests proved that ForgeUI can:

```text
Prompt
  ↓
Generate structured reusable asset JSON
  ↓
Validate supported components
  ↓
Preview metadata / JSON
  ↓
Insert normal editable ForgeUI components
  ↓
Save structured asset
  ↓
List asset in My Forge Assets
  ↓
Persist through reload
  ↓
Reinsert saved asset into canvas
```

The current problem is not asset persistence, canvas insertion, theme rendering, browser preview or export.

The current problem is:

```text
GPT-generated absolute coordinates are visually inconsistent.
```

The model follows some spacing instructions, but still creates collisions, oversized text, poor metric grouping and decorative components that interfere with labels.

Do not confuse this with a ForgeUI renderer bug.

---

# Latest Visual Test

The latest generated battery card successfully inserted onto the normal 1024x600 canvas and rendered over the active hero background.

Observed improvements:

```text
Compact outer card
Clear main heading
Status LED in the header
Progress bars present
Two internal metric panels
Asset positioned as one grouped composition
```

Remaining problems:

```text
State-of-charge label intersects the progress area
Voltage and current values collide with labels
Temperature and health panel is cramped
Warning row overlaps LED and status text
Unrequested Health Trend chart appeared
Asset height was not sufficient for the requested content
```

Conclusion:

```text
The pipeline works.
The generated layout quality is not yet production-ready.
Longer prompt rules alone will not guarantee collision-free coordinates.
```

---

# Current Main File

```text
src/forgeui/ai/ForgeAIPanel.tsx
```

Current implemented asset functions:

```tsx
generateAsset()
saveGeneratedAsset()
insertGeneratedAsset()
insertSavedAsset()
```

Current structured asset model:

```ts
type ForgeUISavedAsset = {
  id: string
  name: string
  category: string
  style: string
  description: string
  width: number
  height: number
  layout: any[]
  createdAt: string
}
```

Current storage key:

```text
forgeui_ai_assets_v1
```

Current library badge:

```tsx
<Badge colorScheme="cyan">
  {savedAssets.length} SAVED
</Badge>
```

---

# Proven Asset Library Behaviour

The Assets tab now supports:

```text
Design Asset
Save Asset
Insert Generated Asset
List Saved Assets
Use Saved Asset
Dynamic Saved Count
LocalStorage Persistence
Reload And Reinsert
```

Saved structured assets remain separate from image/icon binary assets.

Do not move these structured JSON assets into:

```text
ForgeUIUploadedAssetRegistry
```

That registry remains for image and icon assets.

---

# Current Prompt Rules

The asset-specific prompt now:

```text
Requires one reusable widget
Rejects complete 1024x600 screens
Allows only supported ForgeUI components
Rejects Flex / Stack / Grid / Tabs / Collapse helpers
Requires absolute positioning
Requires coordinates relative to asset origin
Requests compact bounds and internal spacing
Requests no overlap
Requests final self-check
```

These rules improved the generated result, but did not solve coordinate quality completely.

Do not keep adding endless prose to the prompt without measuring whether it improves output.

---

# Correct Next Direction

The next pass should not rebuild the asset library.

The next pass should focus on deterministic asset layout quality.

Recommended order:

```text
1. Inspect generated asset JSON and calculate actual bounds.

2. Add a local asset normalisation / validation pass:
   - calculate minX / minY
   - calculate maxX+w / maxY+h
   - detect items outside declared bounds
   - detect obvious rectangle intersections
   - report collisions before Save or Insert

3. Decide whether to:
   A. reject overlapping generated assets and ask the user to regenerate
   B. auto-expand asset width / height when content exceeds bounds
   C. apply only safe coordinate normalisation

4. Add a small set of proven asset layout archetypes:
   - status card
   - metric card
   - dual-column card
   - gauge card
   - trend card
   - controls card

5. Let AI select and populate an archetype rather than inventing every coordinate from scratch.
```

Do not attempt a general automatic layout engine yet.

Start with collision detection and one proven archetype.

---

# Recommended Immediate Next Proof

Use one manually defined two-column battery-card archetype.

Example regions:

```text
Header:
  title
  status LED
  status text

Left column:
  SOC label
  SOC value
  SOC bar
  Health label
  Health value
  Health bar

Right column:
  Voltage
  Current
  Temperature
  Warning state
```

The AI should fill:

```text
text
values
component colours
status
```

The archetype should own:

```text
coordinates
width
height
spacing
```

This separates content generation from layout geometry and should produce consistent reusable assets.

---

# Do Not Touch

Keep these proven systems stable:

```text
Manual Builder
Browser Preview
DevicePreview
Theme Manager
Hero Pipeline
Uploaded Image Pipeline
Semantic Icon Resolver
React Icon Rasterisation
LVGL Export
Standalone Export
CMake Asset Injection
Firmware Build
Firmware Flash
```

---

# New Chat Opening Instruction

```text
Read 01_SPINEAI.md and continue from the current save point.

AI Asset Library V1 is now functionally proven:
generation, validation, generated insertion, save, dynamic saved count,
localStorage persistence, reload and saved-asset reinsertion all work.

The latest battery card also proved the normal Builder and browser preview
render the generated components correctly over the active hero.

Do not rebuild persistence or insertion.

The remaining issue is AI coordinate quality:
the generated widget still contains overlapping labels, values, LEDs and
bars even after stronger prompt rules.

Start by inspecting one generated asset JSON and adding a small local
asset-bounds/collision inspection helper. Do not silently redesign the
widget yet.

After collision reporting is proven, create one deterministic
two-column battery-card archetype where ForgeUI owns coordinates and the
AI supplies content and style.

Keep all existing Layout, Theme, Hero, icon, export and firmware pipelines
unchanged.
```

---

# Summary

ForgeUI now has a functional third AI workflow:

```text
Layout AI
Theme / Hero AI
Asset AI
```

Asset AI V1 is proven as a creation and persistence pipeline.

The next milestone is not more library plumbing.

The next milestone is:

```text
Reliable reusable asset geometry
```

The key architectural correction is:

```text
AI generates content and intent
ForgeUI owns proven component geometry
```
-------------------------------------------------------------------------

# FORGEUI AI SPINE — AI ASSET DESIGNER HANDOVER

## Current Save Point

```text
FORGEUI_AI_ASSET_DESIGNER_V1__GENERATION_PROVEN__METADATA_PREVIEW_READY__NEXT_CANVAS_INSERTION_AND_JSON_VIEW__2026-07-17
```

## Project Status

```text
ACTIVE

STABLE

AI LAYOUT PIPELINE PROVEN

AI HERO PIPELINE PROVEN

SEMANTIC ICON RESOLUTION PROVEN

AI ASSET DESIGNER UI V1 COMPLETE

AI ASSET GENERATION PROVEN

ASSET DOCUMENT VALIDATION PROVEN

ASSET METADATA PREVIEW PROVEN

CANVAS INSERTION NEXT
```

---

# Current Mission

ForgeUI now has three live AI creation workflows:

```text
Layout AI
Theme / Hero AI
Asset AI
```

The AI Asset Designer can now generate one reusable structured ForgeUI asset from a natural-language brief.

Current proven flow:

```text
Asset Brief
      ↓
Asset-specific prompt
      ↓
Existing ForgeAI context and engine
      ↓
Valid structured ForgeUI asset document
      ↓
Supported-component validation
      ↓
READY metadata preview
```

Next proof:

```text
Generated Asset
      ↓
Insert Into Canvas
      ↓
Normal editable ForgeUI components
      ↓
Existing Browser Preview
      ↓
Existing LVGL Export
      ↓
ESP-IDF
      ↓
Physical ESP32-P4
```

The architecture must remain narrow. Do not create a duplicate AI, preview, component, or export stack.

---

# Architecture Rules

## Hard Rule 1 — Keep AI Inside AI Playground

Do not place AI asset generation directly into the Builder.

The AI Playground remains the AI creation workspace.

Current tabs:

```text
Layout   ENABLED AND PROVEN
Theme    ENABLED AND PROVEN
Assets   ENABLED — GENERATION PROVEN
Images   DISABLED
Icons    DISABLED
Runtime  DISABLED
```

---

## Hard Rule 2 — Keep The Tab Named Assets

Do not rename the Assets tab to Widgets.

```text
Layout
→ Layout Documents

Theme
→ Theme Assets

Assets
→ Reusable Forge Assets

Images
→ Future AI Image Assets

Icons
→ Future AI Icon Assets

Runtime
→ Future Runtime Bindings
```

---

## Hard Rule 3 — Reuse Existing AI Infrastructure

Existing files:

```text
src/forgeui/ai/ForgeAIClient.ts
src/forgeui/ai/ForgeAIContext.ts
src/forgeui/ai/ForgeAIEngine.ts
src/forgeui/ai/ForgeAIPanel.tsx
src/forgeui/ai/ForgeAIParser.ts
src/forgeui/ai/ForgeAIPrompts.ts
```

The first Asset AI proof successfully reused:

```text
createForgeAIContext(...)
generateForgeAILayout(...)
```

Do not create duplicate files such as:

```text
ForgeAIWidgetClient
ForgeAIWidgetEngine
ForgeAIWidgetParser
```

Small asset-specific helpers may be added later only if the current engine becomes restrictive.

---

## Hard Rule 4 — Builder Must Not Know AI Exists

AI output must end as normal ForgeUI component data.

```text
AI Asset Document
      ↓
Normal ForgeUI Items
      ↓
Existing Store
      ↓
Canvas
      ↓
Preview
      ↓
LVGL Export
```

No AI-only Builder component or renderer.

---

## Hard Rule 5 — Do Not Touch Proven Pipelines Yet

Do not modify during the next insertion proof:

```text
ForgeUIUploadedAssetRegistry image pipeline
LVGLImage.py
Icon rasterisation pipeline
LVGL export core
Standalone export
CMake asset injection
Firmware build and flash workflow
Theme pipeline
Hero pipeline
```

The structured asset uses supported standard ForgeUI components only.

---

# Main File Being Edited

```text
src/forgeui/ai/ForgeAIPanel.tsx
```

This file currently owns:

```text
Layout AI UI
Layout Prompt Helper
Quick Layout Templates
Generated Layout JSON
Layout Canvas Insertion
Theme Hero Generator
Hero Prompt Gallery
Hero Save-To-Asset Pipeline
AI Asset Designer UI
Asset Prompt Builder
Asset Generation
Asset Metadata Preview
```

---

# Completed Work In This Pass

## 1. Assets Tab Enabled

```tsx
<Tab>Layout</Tab>
<Tab>Theme</Tab>
<Tab>Assets</Tab>
<Tab isDisabled>Images</Tab>
<Tab isDisabled>Icons</Tab>
<Tab isDisabled>Runtime</Tab>
```

---

## 2. AI Asset Designer UI Complete

Left side:

```text
AI Asset Designer
Asset Brief textarea
Design Category
Asset Style
✨ Design Asset
My Forge Assets
```

Right side:

```text
Live Asset Preview
Dynamic WAITING / READY / ERROR badge
Generated asset metadata
Save Asset
Insert Into Canvas
Show Advanced JSON
```

---

## 3. Asset State Added

Current state:

```tsx
const [assetPrompt, setAssetPrompt] =
  useState('')

const [assetPreview, setAssetPreview] =
  useState<any>(null)

const [isGeneratingAsset, setIsGeneratingAsset] =
  useState(false)

const [assetCategory, setAssetCategory] =
  useState('industrial')

const [assetStyle, setAssetStyle] =
  useState('modern')

const [assetError, setAssetError] =
  useState('')

const [assetJson, setAssetJson] =
  useState('')
```

Also restored missing Hero Gallery search state:

```tsx
const [heroPromptSearch, setHeroPromptSearch] =
  useState('')
```

---

## 4. Category And Style Selectors Controlled

Design Category is bound to:

```tsx
value={assetCategory}
onChange={(e) =>
  setAssetCategory(e.target.value)
}
```

Asset Style is bound to:

```tsx
value={assetStyle}
onChange={(e) =>
  setAssetStyle(e.target.value)
}
```

The stale uncontrolled selector containing:

```text
Composite Widget
Status Card
Gauge
Control Panel
```

was removed.

---

## 5. Asset-Specific Prompt Builder Added

Current prompt helper:

```tsx
const buildAssetGenerationPrompt = () => {
  return `Create one reusable ForgeUI asset.

Asset category:
${assetCategory}

Visual style:
${assetStyle}

User brief:
${assetPrompt}

Rules:

- Return ONE reusable ForgeUI asset.
- Do NOT create a complete 1024x600 dashboard.
- Do NOT create an application or screen.
- Generate a reusable widget only.

Use ONLY these ForgeUI components:

Box
Text
Heading
Button
Image
Icon
Led
Bar
Arc
Scale
CircularProgress
Progress
Chart

Never use:

Divider
Tabs
Collapse
Flex
VStack
HStack
SimpleGrid
Grid
Stack

- Use absolute positioning.
- Keep coordinates relative to the asset origin.
- Start x and y near 0.
- Width and height should match the widget size.

Return JSON with:

name
category
style
description
width
height
layout

Return valid JSON only.

Do not include markdown or explanations.`
}
```

Why the strict component list exists:

The first generation reached the validator but failed with:

```text
Unsupported component: Divider
```

This proved the request, AI engine, parser, and validation path were alive.

After tightening the prompt and explicitly forbidding layout-helper components, generation passed.

---

## 6. Asset Generation Wired

Current function:

```tsx
const generateAsset = async () => {
  try {
    setAssetError('')
    setIsGeneratingAsset(true)
    setAssetPreview(null)

    const prompt =
      buildAssetGenerationPrompt()

    const context = createForgeAIContext({
      userPrompt: prompt,
    })

    const document = await generateForgeAILayout({
      prompt,
      ...context,
    })

    setAssetJson(
      JSON.stringify(document, null, 2),
    )

    setAssetPreview(document)
  } catch (err: any) {
    console.error(err)

    setAssetError(
      err.message ||
        'AI asset generation failed',
    )
  } finally {
    setIsGeneratingAsset(false)
  }
}
```

The Design Asset button is wired:

```tsx
onClick={generateAsset}
```

---

## 7. Dynamic Preview State Added

The Live Asset Preview badge now reflects:

```text
WAITING
READY
ERROR
```

The preview panel displays:

```text
Generated asset name
Description
Category
Style
Component count
```

Error messages are displayed directly in the panel.

---

## 8. First Successful AI Asset Generated

Test brief:

```text
Create a compact industrial battery status card with SOC,
voltage, current, temperature and warning state.
```

Selections:

```text
Category: Industrial
Style: Modern
```

Successful result:

```text
Industrial Battery Status Card
INDUSTRIAL
MODERN
18 COMPONENTS
READY
```

This proves:

```text
Asset Designer UI works
Asset prompt builder works
Existing Forge AI engine can generate an asset document
JSON parsing works
Supported-component validation works
assetPreview state works
assetJson state works
READY metadata preview works
```

This is the first end-to-end AI Asset generation milestone.

---

# Current V1 Asset Document Shape

The live result is treated as:

```ts
type ForgeAIAssetDocument = {
  name: string
  category: string
  style: string
  description: string
  width?: number
  height?: number
  layout: any[]
}
```

Do not overbuild the permanent marketplace schema yet.

The next objective is insertion of `layout` as ordinary ForgeUI components.

---

# Current Non-Functional Controls

```text
Save Asset
→ Still disabled.

Insert Into Canvas
→ Still disabled.

Show Advanced JSON
→ Still disabled.

My Forge Assets
→ Static empty state.

Visual widget preview
→ Metadata only; actual component rendering not wired.
```

---

# Next Chat — Start Here And Continue Directly

## Immediate Step 1 — Add Asset Canvas Insertion

Add this near the existing insertion helpers:

```tsx
const insertGeneratedAsset = () => {
  if (
    !assetPreview ||
    !Array.isArray(assetPreview.layout)
  ) {
    return
  }

  try {
    setAssetError('')

    validateAiLayout(assetPreview.layout)

    const originX = 120
    const originY = 120

    const items = assetPreview.layout.map(
      (item: any) => ({
        ...item,
        props: {
          ...item.props,
          x:
            originX +
            Number(item.props?.x || 0),
          y:
            originY +
            Number(item.props?.y || 0),
        },
      }),
    )

    insertAiLayout(items)

    toast({
      title: 'Asset inserted',
      description:
        `${assetPreview.name || 'AI asset'} added to the canvas.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  } catch (err: any) {
    setAssetError(
      err.message ||
        'Failed to insert AI asset',
    )
  }
}
```

Wire the button:

```tsx
<Button
  flex={1}
  variant="outline"
  colorScheme="cyan"
  onClick={insertGeneratedAsset}
  isDisabled={
    !assetPreview ||
    !Array.isArray(assetPreview.layout)
  }
>
  Insert Into Canvas
</Button>
```

Test this before doing anything else.

Expected proof:

```text
Click Insert Into Canvas.
18 normal ForgeUI components appear together.
They are offset from the top-left by 120,120.
They remain individually editable.
Existing Builder preview still works.
```

---

## Immediate Step 2 — Wire Advanced JSON

Add state:

```tsx
const [showAssetJson, setShowAssetJson] =
  useState(false)
```

Update button:

```tsx
<Button
  size="sm"
  variant="ghost"
  colorScheme="cyan"
  onClick={() =>
    setShowAssetJson((value) => !value)
  }
  isDisabled={!assetJson}
>
  {showAssetJson
    ? 'Hide Advanced JSON'
    : 'Show Advanced JSON'}
</Button>
```

Below it add:

```tsx
<Collapse in={showAssetJson} animateOpacity>
  <Box mt={4}>
    <Textarea
      value={assetJson}
      onChange={(e) =>
        setAssetJson(e.target.value)
      }
      minH="280px"
      resize="vertical"
      bg="#050914"
      color="cyan.100"
      borderColor="gray.700"
      fontFamily="monospace"
      fontSize="sm"
    />
  </Box>
</Collapse>
```

For V1, generated JSON can be editable, but insertion should continue using `assetPreview` until an explicit Apply JSON action is added.

---

## Immediate Step 3 — Verify Asset Bounds

After insertion works, inspect the generated JSON for:

```text
width
height
minimum x/y
maximum x+w
maximum y+h
```

Do not block insertion if width and height were discarded by the current parser.

If width and height are missing, calculate bounds locally from the layout later.

Do not create a second AI engine merely to preserve these fields yet.

---

## Immediate Step 4 — Actual Visual Preview

Only after insertion works, identify the cleanest reusable component renderer already used by:

```text
Builder canvas
Browser Preview
DevicePreview
```

Preferred result:

```text
Render assetPreview.layout inside a relative preview surface
Scale to fit the available panel
Reuse existing ForgeUI rendering logic
```

Do not write a separate AI-only renderer.

Metadata preview remains acceptable until a reusable renderer is found cleanly.

---

## Immediate Step 5 — Save Asset Registry

Do not save structured assets into:

```text
ForgeUIUploadedAssetRegistry
```

That registry is for binary image/icon assets.

Create a dedicated structured registry later, for example:

```text
src/forgeui/assets/ForgeUIReusableAssetRegistry.ts
```

Possible model:

```ts
type ForgeUIReusableAsset = {
  id: string
  name: string
  category: string
  style: string
  description: string
  width: number
  height: number
  layout: any[]
  createdAt: number
}
```

Suggested localStorage key:

```text
forgeui_reusable_assets_v1
```

Only build this after canvas insertion and preview are proven.

---

# Recommended Next Milestone Order

```text
1. Insert generated asset into canvas
2. Verify all generated items remain editable
3. Verify existing browser preview
4. Wire Advanced JSON
5. Calculate or preserve asset bounds
6. Reuse existing renderer for visual asset preview
7. Build structured reusable asset registry
8. Enable Save Asset
9. Populate My Forge Assets
10. Reload and insert saved asset
11. Existing LVGL export test
12. Physical ESP32-P4 test
```

---

# Definition Of Next Success

The next milestone is proven when:

```text
User generates the Industrial Battery Status Card.

Live Asset Preview shows READY and 18 COMPONENTS.

User clicks Insert Into Canvas.

All generated components appear together around x:120, y:120.

Every component is a standard editable ForgeUI item.

Builder preview remains correct.

Existing LVGL export sees the components without a new export path.
```

---

# Risks To Watch

## Risk 1 — Coordinates Outside Compact Bounds

The reused layout engine may still produce large coordinates.

Before insertion:

```text
Inspect minimum and maximum positions.
Offset relative coordinates only.
Do not scale unless clearly necessary.
```

---

## Risk 2 — Unsupported Components Reappearing

The prompt currently forbids known layout helpers.

Always validate:

```tsx
validateAiLayout(assetPreview.layout)
```

before insertion.

---

## Risk 3 — Invented Composite Types

Reject unsupported types such as:

```text
BatteryWidget
IndustrialCard
MotorStatusWidget
CustomGauge
```

The asset must remain a composition of registered ForgeUI components.

---

## Risk 4 — Wrong Registry

Structured assets are JSON documents, not uploaded binary images.

Do not route them through image conversion or LVGL image asset registration.

---

## Risk 5 — Duplicate Renderer

Do not create an AI-only visual component system.

Reuse the Builder or preview renderer.

---

# Current Proven Systems That Must Remain Stable

```text
Manual Builder
Browser Preview
LVGL Export
Standalone Export
ESP-IDF Build
Physical ESP32-P4 Flash
AI Layout Generation
AI Layout Validation
AI Layout Canvas Insertion
AI Hero Generation
Hero Save To Uploaded Assets
Automatic LVGL Image Conversion
Theme Manager
Semantic Icon Resolver
React Icon → PNG → LVGL C pipeline
AI Asset Generation
AI Asset Metadata Preview
```

---

# Immediate Commit Candidate

```text
feat(ai): prove AI asset generation and metadata preview
```

Suggested save point:

```text
FORGEUI_AI_ASSET_DESIGNER_V1__GENERATION_PROVEN__METADATA_PREVIEW_READY__NEXT_CANVAS_INSERTION_AND_JSON_VIEW__2026-07-17
```

---

# New Chat Opening Instruction

```text
Read 01_SPINEAI.md and continue directly from the current save point.

AI Asset generation is now proven inside:
src/forgeui/ai/ForgeAIPanel.tsx

A compact Industrial Battery Status Card generated successfully with:
READY
INDUSTRIAL
MODERN
18 COMPONENTS

The first failure was Unsupported component: Divider.
The asset prompt was tightened to allow only registered canvas components
and forbid Divider, Flex, Stack, Grid, Tabs, Collapse and other helpers.

Do not rebuild the AI engine.
Do not touch Layout, Theme, Hero, icon, export or firmware pipelines.

Start by adding insertGeneratedAsset(), offset the asset layout to
origin x:120 y:120, validate it with validateAiLayout(), and wire the
Insert Into Canvas button.

Test canvas insertion immediately before continuing.

After insertion is proven, wire Show Advanced JSON.
Then locate and reuse the existing ForgeUI renderer for a real visual
asset preview. Do not create an AI-only renderer.

Structured asset persistence comes later in a dedicated reusable asset
registry. Do not put structured JSON assets into
ForgeUIUploadedAssetRegistry.
```

---

# Summary

ForgeUI now has a working third AI workflow:

```text
Layout AI
Theme AI
Asset AI
```

The Asset AI is no longer a UI shell.

It can now:

```text
Accept an asset brief
Use category and style
Generate one compact structured asset
Reject unsupported components
Store formatted JSON
Show READY metadata
Report component count
```

The next critical proof is:

```text
READY Asset
      ↓
Insert Into Canvas
      ↓
Editable Normal ForgeUI Components
      ↓
Existing Preview
      ↓
Existing Export
```

Keep the next chat focused on that insertion proof. Do not jump ahead into persistence or a marketplace schema until the generated asset is alive on the normal ForgeUI canvas.

-----------------------------------------------------------------------------------


# FORGEUI AI SPINE — AI ASSET DESIGNER HANDOVER

## Current Save Point

```text
FORGEUI_AI_ASSET_DESIGNER_V1__ASSET_STUDIO_UI__PROMPT_STATE_READY__NEXT_ASSET_SCHEMA_AND_GENERATION_PIPELINE__2026-07-17
```

## Project Status

```text
ACTIVE

STABLE

AI LAYOUT PIPELINE PROVEN

AI HERO PIPELINE PROVEN

SEMANTIC ICON RESOLUTION PROVEN

AI ASSET DESIGNER UI V1 COMPLETE

ASSET GENERATION NOT WIRED YET
```

---

# Current Mission

ForgeUI is moving beyond complete AI-generated layouts and AI-generated hero backgrounds into reusable AI-generated Forge assets.

The new direction is:

```text
Prompt
      ↓
AI creates one reusable Forge asset
      ↓
Live Asset Preview
      ↓
Save to Forge Asset Library
      ↓
Insert into Canvas
      ↓
Existing ForgeUI Preview
      ↓
Existing LVGL Export
      ↓
ESP-IDF
      ↓
Physical ESP32-P4
```

The important rule is that this must extend the existing ForgeUI architecture rather than create a second parallel AI, preview, asset or export pipeline.

---

# Architecture Rules

## Hard Rule 1 — Keep AI Inside AI Playground

Do not place AI asset generation directly into the Builder canvas.

The AI Playground remains the AI creation workspace.

Current AI Playground tabs:

```text
Layout
Theme
Assets
Images
Icons
Runtime
```

Current status:

```text
Layout   ENABLED AND PROVEN
Theme    ENABLED AND PROVEN
Assets   ENABLED — UI V1 COMPLETE
Images   DISABLED
Icons    DISABLED
Runtime  DISABLED
```

---

## Hard Rule 2 — Keep the Tab Named Assets

Do not rename the Assets tab to Widgets.

The AI Playground is becoming a collection of AI creators:

```text
Layout
→ Layout Documents

Theme
→ Theme Assets

Assets
→ Reusable Forge Assets

Images
→ Future AI Image Assets

Icons
→ Future AI Icon Assets

Runtime
→ Future Runtime Bindings
```

Assets is the correct scalable name.

---

## Hard Rule 3 — Reuse Existing AI Infrastructure

Existing files:

```text
src/forgeui/ai/ForgeAIClient.ts
src/forgeui/ai/ForgeAIContext.ts
src/forgeui/ai/ForgeAIEngine.ts
src/forgeui/ai/ForgeAIPanel.tsx
src/forgeui/ai/ForgeAIParser.ts
src/forgeui/ai/ForgeAIPrompts.ts
```

Do not create a duplicate stack such as:

```text
ForgeAIWidgetClient
ForgeAIWidgetEngine
ForgeAIWidgetParser
```

Preferred future additions, only if needed:

```text
ForgeAIAssetPrompts.ts
ForgeAIAssetDocument.ts
```

Reuse the existing context, engine, validation concepts and component registry.

---

## Hard Rule 4 — Builder Must Not Know AI Exists

The Builder should receive standard ForgeUI components.

The AI path should end in normal ForgeUI layout/component data.

```text
AI Asset Document
      ↓
Normal ForgeUI Items
      ↓
Existing Store
      ↓
Canvas
      ↓
Preview
      ↓
LVGL Export
```

No AI-specific component renderer should be added to the Builder.

---

## Hard Rule 5 — Do Not Touch Proven Pipelines Yet

During the first AI Asset pass, do not modify:

```text
ForgeUIUploadedAssetRegistry image pipeline
LVGLImage.py
Icon rasterisation pipeline
LVGL export core
Standalone export
CMake asset injection
Firmware build and flash workflow
Theme pipeline
Hero pipeline
```

The first proof should use supported standard ForgeUI components only.

---

# Main File Being Edited

```text
src/forgeui/ai/ForgeAIPanel.tsx
```

This file currently owns:

```text
Layout AI UI
Layout Prompt Helper
Quick Layout Templates
Generated Layout JSON
Layout Canvas Insertion
Theme Hero Generator
Hero Prompt Gallery
Hero Save-To-Asset Pipeline
AI Asset Designer UI
```

---

# Completed Work In This Pass

## 1. Assets Tab Enabled

The tab list now contains:

```tsx
<Tab>Layout</Tab>
<Tab>Theme</Tab>
<Tab>Assets</Tab>
<Tab isDisabled>Images</Tab>
<Tab isDisabled>Icons</Tab>
<Tab isDisabled>Runtime</Tab>
```

Assets is no longer disabled.

---

## 2. AI Asset Designer UI Added

A complete Assets tab shell now exists.

Left side:

```text
AI Asset Designer
Prompt Textarea
Design Category
Asset Style
Design Asset Button
Forge Asset Library
```

Right side:

```text
Live Asset Preview
WAITING badge
Preview placeholder
Save Asset
Insert Into Canvas
Show Advanced JSON
Asset Creator information card
```

Current interface is intentionally a shell. The preview, save, insert and JSON controls are not yet functional.

---

## 3. Main Heading Updated

Current heading:

```text
AI Asset Designer
```

Current subtitle:

```text
Design reusable ForgeUI widgets and industrial components using AI.
```

---

## 4. Design Category Added

The original Asset Type selector was replaced with a design-domain selector.

Current intended options:

```text
Industrial
Energy
Automotive
Marine
Medical
General UI
```

Current JSX pattern:

```tsx
<Text
  fontSize="xs"
  color="gray.400"
  mb={1}
>
  Design Category
</Text>

<Select
  size="sm"
  defaultValue="industrial"
  bg="#050914"
>
  <option value="industrial">
    Industrial
  </option>

  <option value="energy">
    Energy
  </option>

  <option value="automotive">
    Automotive
  </option>

  <option value="marine">
    Marine
  </option>

  <option value="medical">
    Medical
  </option>

  <option value="general">
    General UI
  </option>
</Select>
```

Important: this selector is currently uncontrolled and is not yet connected to React state.

---

## 5. Asset Style Added

The old size selector was replaced with a visual-style selector.

Current options:

```text
Modern
Industrial
Glass
Minimal
Cyber
```

Current JSX pattern:

```tsx
<Text
  fontSize="xs"
  color="gray.400"
  mb={1}
>
  Asset Style
</Text>

<Select
  size="sm"
  defaultValue="modern"
  bg="#050914"
>
  <option value="modern">
    Modern
  </option>

  <option value="industrial">
    Industrial
  </option>

  <option value="glass">
    Glass
  </option>

  <option value="minimal">
    Minimal
  </option>

  <option value="cyber">
    Cyber
  </option>
</Select>
```

Important: this selector is currently uncontrolled and is not yet connected to React state.

---

## 6. Live Asset Preview Text Updated

Current heading:

```text
Live Asset Preview
```

Current subtitle:

```text
Design an industrial asset using the Asset Brief.
Review it here before saving it to your Forge Asset Library.
```

Preview is still a placeholder.

---

## 7. Asset Prompt State Added

Near the other ForgeAIPanel state declarations, these were added:

```tsx
const [assetPrompt, setAssetPrompt] =
  useState('')

const [assetPreview, setAssetPreview] =
  useState<any>(null)

const [isGeneratingAsset, setIsGeneratingAsset] =
  useState(false)
```

Notes:

```text
assetPrompt
→ Connected to the Assets textarea.

assetPreview
→ Added but not used yet.

isGeneratingAsset
→ Connected to the Design Asset button loading state.
```

---

## 8. Asset Textarea Connected To State

The Assets tab textarea now uses:

```tsx
value={assetPrompt}

onChange={(e) =>
  setAssetPrompt(e.target.value)
}
```

Full intended pattern:

```tsx
<Textarea
  value={assetPrompt}
  onChange={(e) =>
    setAssetPrompt(e.target.value)
  }
  placeholder="Create a compact industrial battery status card with SOC, voltage, current, temperature and warning state..."
  minH="180px"
  resize="vertical"
  bg="#050914"
  color="white"
  borderColor="rgba(139, 92, 246, 0.52)"
  _hover={{
    borderColor: 'purple.400',
  }}
  _focus={{
    borderColor: 'purple.300',
    boxShadow: '0 0 0 1px #c4b5fd',
  }}
/>
```

---

## 9. Design Asset Button Prepared

The original disabled Generate Asset button was replaced with:

```tsx
<Button
  width="100%"
  colorScheme="purple"
  mt={4}
  isLoading={isGeneratingAsset}
  loadingText="Designing..."
  isDisabled={!assetPrompt.trim()}
>
  ✨ Design Asset
</Button>
```

Current status:

```text
Prompt empty
→ Button disabled.

Prompt entered
→ Button enabled.

Generation active
→ Loading state ready.

onClick
→ NOT WIRED YET.
```

---

# Current UI Labels To Verify

Before starting backend work, quickly confirm the running UI displays:

```text
AI Asset Designer

Design reusable ForgeUI widgets and industrial components using AI.

Design Category

Asset Style

✨ Design Asset

Forge Asset Library

Live Asset Preview
```

The source uploaded during the pass still showed some earlier labels in places, so verify the current local file is the final edited version.

Possible stale labels to search for:

```text
Asset Type
Composite Widget
Generate Asset
My Forge Assets
Asset Preview
```

Replace any remaining stale wording before backend work.

---

# Current Non-Functional Controls

These are still intentionally disabled or unwired:

```text
✨ Design Asset
→ Enabled by prompt but has no onClick.

Save Asset
→ Disabled.

Insert Into Canvas
→ Disabled.

Show Advanced JSON
→ Disabled.

Forge Asset Library
→ Static empty state.

Live Asset Preview
→ Static placeholder.

Design Category
→ No state.

Asset Style
→ No state.
```

---

# Next Chat — Start Here

## Step 1 — Verify The UI Compiles

Run the Studio and confirm:

```text
Assets tab opens.
Prompt accepts text.
Design Asset button enables after text entry.
No TypeScript errors.
No React runtime errors.
Layout tab still works.
Theme tab still works.
```

Do not proceed until the existing Layout and Theme tabs remain stable.

---

## Step 2 — Add Category And Style State

Add near the existing asset state:

```tsx
const [assetCategory, setAssetCategory] =
  useState('industrial')

const [assetStyle, setAssetStyle] =
  useState('modern')

const [assetError, setAssetError] =
  useState('')

const [assetJson, setAssetJson] =
  useState('')
```

Bind Design Category:

```tsx
<Select
  size="sm"
  value={assetCategory}
  onChange={(e) =>
    setAssetCategory(e.target.value)
  }
  bg="#050914"
>
```

Bind Asset Style:

```tsx
<Select
  size="sm"
  value={assetStyle}
  onChange={(e) =>
    setAssetStyle(e.target.value)
  }
  bg="#050914"
>
```

---

## Step 3 — Decide The V1 Asset Document Shape

Do not build a large permanent marketplace schema yet.

Use a minimal V1 document that closely matches the existing layout document:

```ts
type ForgeAIAssetDocument = {
  name: string
  category: string
  style: string
  description: string
  width: number
  height: number
  layout: any[]
}
```

Suggested output example:

```json
{
  "name": "Battery Status Card",
  "category": "energy",
  "style": "industrial",
  "description": "Compact battery health and operating status card.",
  "width": 360,
  "height": 220,
  "layout": [
    {
      "type": "Box",
      "props": {
        "positionMode": "absolute",
        "x": 0,
        "y": 0,
        "w": 360,
        "h": 220
      }
    },
    {
      "type": "Heading",
      "props": {
        "positionMode": "absolute",
        "x": 20,
        "y": 16,
        "w": 220,
        "h": 36,
        "children": "Battery Pack"
      }
    }
  ]
}
```

The V1 goal is not a perfect marketplace object.

The V1 goal is:

```text
Generate
Preview
Insert
```

Saving and persistence can follow once this is proven.

---

## Step 4 — Reuse Existing AI Engine First

Preferred first experiment:

Reuse:

```ts
createForgeAIContext(...)
generateForgeAILayout(...)
```

Build a strict asset-specific prompt inside ForgeAIPanel or a small new prompt helper.

Suggested function:

```tsx
const buildAssetGenerationPrompt = () => {
  return `Create one reusable ForgeUI asset.

Asset category:
${assetCategory}

Visual style:
${assetStyle}

User brief:
${assetPrompt}

Rules:
- Return one compact reusable ForgeUI asset, not a complete 1024x600 dashboard.
- Use only supported ForgeUI components.
- Use absolute positioning.
- Keep every component inside the asset bounds.
- Use x and y positions relative to the asset origin.
- Start coordinates near x: 0 and y: 0.
- Include name, category, style, description, width, height and layout.
- Return valid ForgeUI JSON only.`
}
```

Then:

```tsx
const generateAsset = async () => {
  try {
    setAssetError('')
    setIsGeneratingAsset(true)

    const prompt =
      buildAssetGenerationPrompt()

    const context = createForgeAIContext({
      userPrompt: prompt,
    })

    const document =
      await generateForgeAILayout({
        prompt,
        ...context,
      })

    // Normalise or wrap result into the V1 asset document.
    // Validate layout with the existing component validator.
    // Then set preview and JSON state.
  } catch (err: any) {
    setAssetError(
      err.message ||
        'AI asset generation failed',
    )
  } finally {
    setIsGeneratingAsset(false)
  }
}
```

Wire button:

```tsx
onClick={generateAsset}
```

Important:

The current `generateForgeAILayout()` parser may discard fields it does not expect.

Inspect these before forcing the schema:

```text
ForgeAIEngine.ts
ForgeAIParser.ts
ForgeAIPrompts.ts
API route /api/forgeui-ai-layout
```

Determine whether the existing return object preserves:

```text
width
height
style
```

If not, either:

```text
A. Wrap the returned layout locally into an asset document.

or

B. Add a small asset-specific generation function inside the existing engine architecture.
```

Do not create an entirely independent AI stack.

---

## Step 5 — Reuse Existing Validation

Current function inside ForgeAIPanel:

```tsx
validateAiLayout(layout)
```

Reuse it for:

```tsx
validateAiLayout(assetDocument.layout)
```

Also add minimal asset bounds validation:

```text
width is a positive number
height is a positive number
layout is an array
every component is supported
every item contains props
```

Do not overbuild validation during V1.

---

## Step 6 — First Preview Strategy

Do not immediately create a new full renderer.

Preferred strategy:

Use the same component preview/rendering machinery already used by ForgeUI wherever possible.

If a reusable renderer cannot be accessed cleanly yet, the first proof may display:

```text
Generated asset name
Description
Width × Height
Component count
Advanced JSON
```

Then wire actual visual preview as the next small step.

Do not block AI generation on creating a perfect preview renderer.

---

## Step 7 — First Insert Strategy

The asset layout uses coordinates relative to its own origin.

Before inserting into the main canvas, offset each item:

```tsx
const insertGeneratedAsset = () => {
  if (!assetPreview) {
    return
  }

  const originX = 120
  const originY = 120

  const items = assetPreview.layout.map(
    (item: any) => ({
      ...item,
      props: {
        ...item.props,
        x:
          originX +
          Number(item.props.x || 0),
        y:
          originY +
          Number(item.props.y || 0),
      },
    }),
  )

  insertAiLayout(items)
}
```

This uses the existing proven insertion path.

Initial proof:

```text
AI generates one compact asset.
User clicks Insert Into Canvas.
Its normal ForgeUI components appear together on canvas.
Builder remains editable.
Preview works.
Existing export still sees normal components.
```

This is the critical V1 milestone.

---

# Save-To-Library Strategy — Do Not Rush

The current `ForgeUIUploadedAssetRegistry` is designed for image/icon binary assets.

An AI structured widget asset is different:

```text
Uploaded image/icon asset
→ browserSrc
→ LVGL image C asset

Structured Forge asset
→ JSON layout document
→ reusable normal components
```

Do not force structured widget documents into `ForgeUIUploadedAssetRegistry` unless the registry is deliberately expanded.

Recommended future registry:

```text
ForgeUICompositeAssetRegistry
```

or more generally:

```text
ForgeUIReusableAssetRegistry
```

Potential model:

```ts
type ForgeUIReusableAsset = {
  id: string
  name: string
  category: string
  style: string
  description: string
  width: number
  height: number
  layout: any[]
  createdAt: number
}
```

Persistence can later use a dedicated localStorage key, for example:

```text
forgeui_reusable_assets_v1
```

Do not implement this before generation, preview and insertion are proven.

---

# Recommended V1 Milestone Order

```text
1. UI compile verification

2. Category and style state

3. Asset-specific prompt builder

4. AI generation call

5. Validate generated layout

6. Show generated metadata and JSON

7. Insert generated components into canvas

8. Visual preview

9. Save reusable asset registry

10. Asset Library listing

11. Reload saved asset

12. Export and physical P4 test
```

This order reduces risk and keeps every step testable.

---

# Definition Of V1 Success

V1 is proven when:

```text
User opens Assets tab.

User enters:
"Create a compact industrial battery status card with SOC,
voltage, current, temperature and warning state."

User selects:
Energy
Industrial

User clicks:
✨ Design Asset

ForgeUI returns one compact structured asset.

Generated asset passes supported-component validation.

User reviews metadata or JSON.

User clicks:
Insert Into Canvas

The asset appears as editable standard ForgeUI components.

Browser preview renders it.

Existing LVGL export accepts the components without a new export path.
```

Physical hardware validation can then follow.

---

# Risks To Watch

## Risk 1 — Full-Screen Coordinates

The existing layout AI may generate coordinates for 1024x600.

Asset prompt must strongly require:

```text
compact bounds
relative coordinates
x/y starting near zero
not a complete screen
```

---

## Risk 2 — Unsupported Components

Always call:

```tsx
validateAiLayout(...)
```

before preview or insertion.

---

## Risk 3 — AI Inventing Composite Component Types

The AI must not return:

```text
BatteryWidget
MotorWidget
IndustrialCard
CustomGauge
```

unless those are real supported ForgeUI component types.

It should compose assets from existing supported components such as:

```text
Box
Heading
Text
Led
Bar
Arc
Button
Switch
Icon
Image
```

---

## Risk 4 — Saving To The Wrong Registry

Do not treat structured layout JSON as a PNG/image asset.

Keep binary assets and reusable structured assets conceptually separate.

---

## Risk 5 — Duplicate Render Pipeline

Do not write a bespoke AI-only visual system.

The generated asset must ultimately be ordinary ForgeUI components.

---

# Current Proven Systems That Must Remain Stable

```text
Manual Builder
Browser Preview
LVGL Export
Standalone Export
ESP-IDF Build
Physical ESP32-P4 Flash
AI Layout Generation
AI Layout Validation
AI Layout Canvas Insertion
AI Hero Generation
Hero Save To Uploaded Assets
Automatic LVGL Image Conversion
Theme Manager
Semantic Icon Resolver
React Icon → PNG → LVGL C pipeline
```

---

# Immediate Next Commit Candidate

After the current UI/state work:

```text
feat(ai): add AI Asset Designer workspace and prompt state
```

Suggested save point:

```text
FORGEUI_AI_ASSET_DESIGNER_V1__ASSET_STUDIO_UI__PROMPT_STATE_READY__NEXT_ASSET_SCHEMA_AND_GENERATION_PIPELINE__2026-07-17
```

---

# New Chat Opening Instruction

Start the next chat with:

```text
Read 01_SPINEAI.md.

We have completed the AI Asset Designer V1 UI inside
src/forgeui/ai/ForgeAIPanel.tsx.

The Assets tab is enabled.
assetPrompt, assetPreview and isGeneratingAsset state exist.
The textarea is bound to assetPrompt.
The Design Asset button enables and has loading state but no onClick.

Do not touch the proven Layout, Theme, export, icon or hero pipelines.

Start by verifying the current UI compiles, then add assetCategory,
assetStyle, assetError and assetJson state. After that inspect the existing
ForgeAIEngine and parser to decide the smallest clean way to generate one
compact reusable asset document using supported ForgeUI components.
```

---

# Summary

ForgeUI now has the front end of a third AI workflow:

```text
Layout AI
Theme AI
Asset AI
```

The Asset Designer is deliberately not a second builder.

It is an AI workspace that will create compact, reusable sets of standard ForgeUI components.

The correct next proof is:

```text
Prompt
      ↓
Compact Asset Document
      ↓
Validation
      ↓
Insert As Normal Components
      ↓
Canvas
      ↓
Preview
      ↓
Existing Export
```

Keep the architecture narrow, reuse the proven engine, and prove generation plus canvas insertion before building persistence or a permanent asset marketplace schema.