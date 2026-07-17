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