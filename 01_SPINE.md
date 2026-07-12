
# SPINE

SPINE
Current Save Point
FORGEUI_AI_ENGINE_V2__LIVE_GPT_TO_PHYSICAL_ESP32P4_PIPELINE_PROVEN__2026-07-12
Project Status
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

AI PIPELINE PROVEN
ForgeUI Overview

ForgeUI Studio is an open-source visual LVGL v9 HMI designer, AI-assisted UI generator, code generator, asset pipeline, theme system, and ESP-IDF workflow targeting ESP32-P4 hardware.

The complete embedded workflow has now been proven from natural language prompt through to physical hardware.

Core Pipeline
Visual Builder
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
Generated C
        │
        ▼
ESP-IDF Build
        │
        ▼
Physical ESP32-P4

Status

PROVEN
AI Pipeline
User Prompt
        │
        ▼
GPT-5
        │
        ▼
ForgeUI JSON Document
        │
        ▼
JSON Validation
        │
        ▼
Component Validation
        │
        ▼
Canvas
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
Generated C
        │
        ▼
ESP-IDF Build
        │
        ▼
Physical ESP32-P4

Status

PROVEN
AI Engine Architecture
ForgeAIPanel
        │
        ▼
ForgeAIEngine
        │
        ├─────────────┐
        │             │
        ▼             ▼
ForgeAIPrompts   ForgeAIContext
        │             │
        └──────┬──────┘
               ▼
       ForgeAIClient
               │
               ▼
      OpenAI Responses API
               │
               ▼
       ForgeAIParser
               │
               ▼
Validated ForgeUI Document
               │
               ▼
JSON Editor
               │
               ▼
Insert JSON
               │
               ▼
Canvas

Status

MODULAR

PROVEN
AI Features

Current capabilities

Natural Language Layout Generation

Prompt Editor

Live GPT Integration

JSON Validation

Component Validation

Template Library

ForgeUI JSON Editor

Canvas Insertion

Browser Preview

LVGL Export

Physical ESP32-P4 Deployment

Status

PROVEN
Proven Workflow
Describe Screen

↓

Generate Layout

↓

Review Generated JSON

↓

Insert Layout

↓

Preview

↓

Export

↓

Build

↓

Flash

↓

Physical Hardware

Status

PROVEN
Current Project Architecture
Visual Builder
        │
        ├──────────────┐
        │              │
        ▼              ▼
Manual Design     AI Layout Generation
        │              │
        └──────┬───────┘
               ▼
        ForgeUI JSON
               ▼
         Validation
               ▼
            Canvas
               ▼
      Browser Preview
               ▼
        LVGL Export
               ▼
        Generated C
               ▼
       ESP-IDF Build
               ▼
       Physical ESP32-P4
Next Development Phase
AI Engine V3

Current Project Context

Current Canvas

Current Theme

Current Assets

Current Icons

↓

Prompt

↓

AI Screen Modification

↓

Updated ForgeUI Document

Planned capabilities

Modify Existing Screens

Theme Generation

Asset Awareness

Icon Awareness

Project Context

Runtime Widget Generation

Multi-screen Projects

Status

NEXT

-------------------------------------------------------------


New Save Point
FORGEUI_AI_LAYOUT_GENERATION__LIVE_OPENAI_INTEGRATION__VALIDATED_JSON_PROVEN__AI_ENGINE_NEXT__2026-07-12
New Status
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

LIVE OPENAI GENERATION PROVEN

SECURE SERVER-SIDE AI PROVEN
New Proven Capability
User Prompt
        ↓
ForgeUI AI Playground
        ↓
Next.js API Route
        ↓
OpenAI Responses API
        ↓
ForgeUI JSON Document
        ↓
JSON Validation
        ↓
Browser Response

Status:

PROVEN
Newly Proven
OpenAI Integration

Proven:

OpenAI SDK
Secure server-side API key
Server-side API route
Responses API
Live authenticated requests
JSON-only generation
ForgeUI document generation
Valid document parsing
Existing validator compatibility
Proven Test Prompt
Create a modern WiFi setup screen.

Returned:

ForgeUI Layout Document

18 Components

Valid JSON

Successfully Parsed

Status:

PROVEN
Current AI Pipeline
Prompt
        ↓
OpenAI
        ↓
ForgeUI JSON Document
        ↓
Server Validation
        ↓
Browser

Status:

PROVEN
Current Remaining Work

The backend is finished.

The remaining work is UI integration.

Current target:

Prompt
        ↓
Generate Button
        ↓
POST /api/forgeui-ai-layout
        ↓
OpenAI
        ↓
ForgeUI JSON
        ↓
setLayoutJson(...)
        ↓
Existing JSON Editor
        ↓
Insert JSON
        ↓
Canvas

No backend redesign required.

Next Architecture

This is the point where the AI should stop living inside the API route and become a proper subsystem.

ForgeAIPanel
        ↓
ForgeAIClient
        ↓
ForgeAIEngine
        ↓
ContextBuilder
        ↓
PromptBuilder
        ↓
AIProvider
        ↓
OpenAIProvider
        ↓
OpenAI

The browser should never know about OpenAI directly.

AI Engine V1

Recommended structure:

forgeui/ai/
    engine/
        ForgeAIEngine.ts
        ContextBuilder.ts
        PromptBuilder.ts
    providers/
        AIProvider.ts
        OpenAIProvider.ts
    validation/
        LayoutValidator.ts
        LayoutRepair.ts
    knowledge/
        ComponentKnowledge.ts
    types/
        ForgeAITypes.ts

Purpose:

Provider abstraction
Future Ollama support
Future Anthropic support
Future Gemini support
Theme context
Asset context
Runtime context
Automatic layout repair
Central AI orchestration
Current Priority
AI Playground V2

Immediate tasks:

Connect Generate Layout button to /api/forgeui-ai-layout.
Populate the existing JSON editor with:
setLayoutJson(JSON.stringify(document, null, 2))
Keep Insert JSON as the validation checkpoint.
Prove canvas rendering.
Prove browser preview.
Export.
Flash to the physical ESP32-P4.



## Current Save Point

```text
FORGEUI_AI_LAYOUT_GENERATION__LIVE_OPENAI_INTEGRATION__VALIDATED_JSON_PROVEN__AI_ENGINE_NEXT__2026-07-12
```

---

# Project Status

ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

LIVE OPENAI GENERATION PROVEN

SECURE SERVER-SIDE AI PROVEN

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

FIRST-TIME SETUP PROVEN

DEPENDENCY RECOVERY PROVEN
```

---

# New Proven Capabilities

User Prompt
        ↓
ForgeUI AI Playground
        ↓
Next.js API Route
        ↓
OpenAI Responses API
        ↓
ForgeUI JSON Document
        ↓
JSON Validation
        ↓
Browser Response

## ForgeUI Setup & Recovery

```text
Clone Repository
        ↓
FIRST_TIME_FORGEUI_SETUP.bat
        ↓
Verify Node.js
        ↓
Verify npm
        ↓
Install node_modules
        ↓
Locate ESP-IDF Python
        ↓
Install Pillow
        ↓
Install pypng
        ↓
Install lz4
        ↓
Verify LVGLImage.py
        ↓
Verify OpenAI Package
        ↓
Verify ESP-IDF Installation
        ↓
Validate Standalone Export Environment
        ↓
Launch ForgeUI Studio
```

### Proven

- Automatic node_modules recovery
- Automatic Python package installation
- ESP-IDF Python discovery
- LVGL converter verification
- OpenAI package verification
- ESP-IDF installation detection
- Guided repair messaging
- Successful Studio launch

---

# Core Architecture

```text
Builder
        ↓
Browser Preview
        ↓
AI Layout Generation
        ↓
Unified Image & Icon Asset Pipeline
        ↓
LVGL Export
        ↓
Standalone ESP-IDF Project
        ↓
Visual Studio Code
        ↓
ESP-IDF Extension
        ↓
Build
        ↓
Flash
        ↓
Physical ESP32-P4
```

Status:

```text
PROVEN
```

---

# Standalone Philosophy

ForgeUI Studio is a visual designer and code generator.

The generated ESP-IDF project is completely independent.

Developers are free to continue development in Visual Studio Code by adding:

- GPIO
- I²C
- SPI
- UART
- CAN
- Networking
- Drivers
- Sensors
- Application Logic

ForgeUI intentionally avoids locking projects into the Studio environment.

---

# Documentation

Updated:

- Quick Start
- Setup & Recovery
- Architecture
- AI Pipeline
- Standalone Export
- Dependency Validation
- Workspace Layout

Documentation now reflects the current architecture.

---

# Next Milestone

```text
OpenAI API Integration
        ↓
Natural Language UI Generation
        ↓
Theme Generation
        ↓
Asset Generation
        ↓
AI Playground V2
```

---

# Current Priority

```text
AI Playground
```

Goal:

```text
Prompt
        ↓
OpenAI
        ↓
Validated ForgeUI JSON
        ↓
Canvas
        ↓
Browser Preview
        ↓
LVGL Export
        ↓
Physical ESP32-P4
```

The existing JSON validation pipeline has already been proven.

The next stage is connecting the OpenAI backend to generate validated ForgeUI layouts and themes directly from natural language prompts.

Hostrical bellow here
# SPINE

## Current Save Point

```text
FORGEUI_AI_LAYOUT_GENERATION__OPENAI_BACKEND_FOUNDATION__SECURE_ENVIRONMENT__2026-07-12
Project Status
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

ForgeUI Studio is an open-source visual LVGL v9 HMI designer, code generator, asset pipeline, theme system, AI layout playground, and ESP-IDF workflow targeting ESP32-P4 hardware.

Core Pipeline
Builder
    ↓
Browser Preview
    ↓
LVGL Export
    ↓
Generated C
    ↓
Standalone ESP-IDF Project
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4

Status:

FULLY PROVEN
Current Architecture Truth
Asset Pipeline
Uploaded Asset
    ↓
Asset Manager
    ↓
LVGLImage.py
    ↓
Generated LVGL C Asset
    ↓
Asset Registry
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4

Status:

PROVEN
React Icon Asset Pipeline
React Icon
    ↓
renderToStaticMarkup()
    ↓
SVG
    ↓
Canvas Conversion
    ↓
PNG
    ↓
Base64 browserSrc
    ↓
ForgeUI Uploaded Asset
    ↓
Asset Manager
    ↓
LVGLImage.py
    ↓
Generated LVGL C Asset
    ↓
Asset Registry
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4

Status:

FULLY PROVEN

MULTIPLE UNIQUE ICONS

PHYSICAL HARDWARE VERIFIED
Asset Architecture Rules
React Icons are exported as LVGL image assets.

Icons use the same export pipeline as Image widgets.

Do not create a second icon export pipeline.

Do not bypass Asset Manager.

PNG remains the LVGLImage.py input format.

Persist browserSrc.

Persist uploadedAssetId.

Persist assetName.

Blob URLs are temporary session resources only.

Base64 browserSrc is the persistent browser representation.
Icon Export Architecture
Icon Widget
    ↓
Use As Icon Widget
    ↓
React Icon
    ↓
PNG Generation
    ↓
ForgeUI Uploaded Asset
    ↓
LVGLImage.py
    ↓
Generated LVGL C Asset
    ↓
Asset Registry
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
ESP32-P4

Status:

PROVEN

MULTIPLE UNIQUE ICONS

PHYSICAL ESP32-P4 VERIFIED

Compatibility rule:

LV_SYMBOL support remains available only as a backwards compatibility fallback.

Primary icon export path is LVGL image assets.
Icon Library V1

Status:

FULLY PROVEN

Proven:

9514 React Icons
✓

Search
✓

Visual Browser
✓

Multi Select
✓

Selected Asset Tray
✓

Add Selected To Assets
✓

Use As Icon Widget
✓

Single Inspector Icon Selector
✓

Duplicate Preset Icon Dropdown Removed
✓

Duplicate Browse Icons Button Removed
✓

Current Icon Opens Icon Browser
✓

Automatic Icon Browser On New Icon Drop
✓

Existing Icon Move Does Not Reopen Browser
✓

Canvas Render
✓

Preview Render
✓

Browser Persistence
✓

PNG Generation
✓

Base64 Persistence
✓

Asset Manager Integration
✓

LVGLImage.py Conversion
✓

Generated C Assets
✓

LVGL Export
✓

ESP-IDF Build
✓

Physical ESP32-P4 Flash
✓

Multiple Unique Icons
✓

Builder / Preview / Export / P4 Parity
✓

Unified Image Asset Pipeline
✓
Icon Widget Workflow
Drag Icon
    ↓
Icon Widget Created
    ↓
Icon Widget Selected
    ↓
Icon Browser Opens Automatically
    ↓
Choose React Icon
    ↓
Use As Icon Widget
    ↓
Existing Image Asset Pipeline
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
ESP32-P4

Status:

PROVEN
Theme Pipeline

Single source of truth:

FG_PREVIEW_PALETTES
    ↓
Theme Manager
    ↓
ForgeThemeContext
    ↓
Builder
    ↓
Preview
    ↓
Export
    ↓
ESP32-P4

Status:

PROVEN

NO DRIFT

Rule:

FG_PREVIEW_PALETTES remains the only source of truth.
Runtime Systems
RTC Runtime
20_RTC
    ↓
Clock Widget

Status:

PROVEN ON PHYSICAL ESP32-P4

Ownership:

RTC owns truth.

Clock owns display.

LVGL timer owns refresh.
WiFi Runtime
30_WIFI
    ↓
WiFi Widget

Status:

PROVEN ON PHYSICAL ESP32-P4

Ownership:

WiFi runtime owns truth.

Widget owns display.

LVGL timer owns refresh.
Runtime Architecture Rule
Runtime owns truth.

Widget owns display.

LVGL timer owns refresh.

UI owns neither.
Proven Widgets
Core Widgets
Button
Text
Heading
Input
Textarea
Switch
Checkbox
Radio
Slider
Progress
CircularProgress
NumberInput
Select
Image
Box
Icon
IconButton

Status:

Builder
✓

Preview
✓

Export
✓

ESP32-P4
✓
LVGL Widgets
Led
Bar
Arc
Chart
Calendar
Keyboard
Scale
Table
Roller
Msgbox
ButtonMatrix
Canvas
Line
Tabview
Tileview
AnimImage

Status:

Builder
✓

Preview
✓

Export
✓

ESP32-P4
✓
Runtime Widgets
Clock
✓

WiFi
✓

Status:

PHYSICAL ESP32-P4 PROVEN
Theme Manager V2

Status:

PROVEN
Build and Flash Pipeline

Status:

PROVEN

Proven:

Export Project
✓

Detached Standalone Export
✓

Independent VS Code Build
✓

ESP-IDF Extension Build
✓

ESP-IDF Reconfigure
✓

Independent Build Environment
✓

Clean Build
✓

Build and Flash
✓

Independent Physical ESP32-P4 Flash
✓

Physical Hardware Flash
✓
Standalone Export Pipeline

Status:

FULLY PROVEN

Proven:

ForgeUI Export
✓

Standalone ESP-IDF Project
✓

Fresh Laptop Verification
✓

VS Code Workflow
✓

ESP-IDF Extension
✓

Independent Build
✓

Independent Flash
✓

Physical ESP32-P4
✓

Architecture:

ForgeUI Studio
    ↓
Export Project
    ↓
Standalone ESP-IDF Project
    ↓
VS Code
    ↓
ESP-IDF Extension
    ↓
Build
    ↓
Flash
    ↓
Physical ESP32-P4

Rules:

Exported projects are completely standalone.

ForgeUI Studio is not required after export.

ESP-IDF owns build and flash.

ForgeUI owns project generation.

Every exported project must remain independently buildable.
AI Playground V1

Status:

PROVEN

Existing proven flow:

Template Button
    ↓
Layout Document
    ↓
JSON Editor
    ↓
validateAiLayout()
    ↓
insertAiLayout()
    ↓
Canvas
    ↓
Preview
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
Physical ESP32-P4

Proven template documents:

WiFi Setup

Login

Dashboard

Settings

Sensor Dashboard

Machine Status

Diagnostics

Touch Keypad

WiFi Drawer

Proven:

Template Load
✓

JSON Validation
✓

Canvas Insert
✓

Builder Render
✓

Preview Render
✓

LVGL Export
✓

Physical ESP32-P4 Flash
✓
OpenAI Backend Foundation

Status:

FOUNDATION PROVEN

SECURE ENVIRONMENT PROVEN

Completed:

OpenAI Platform Account
✓

API Billing
✓

API Credits
✓

API Key Created
✓

Original Key Rotated
✓

Replacement Key Stored Locally
✓

Official OpenAI Node SDK Installed
✓

Next.js API Route Created
✓

Backend Health Check Proven
✓

Local Environment Variable Configured
✓

.env Removed From Git Tracking
✓

.env Permanently Ignored
✓

Security Commit Pushed
✓

OpenAI SDK installation:

npm install openai --legacy-peer-deps

Reason:

ForgeUI contains legacy peer dependency conflicts.

Do not use npm audit fix --force.

Do not modernise unrelated dependencies during AI integration.
Next.js Routing Truth

ForgeUI uses:

studio/src/pages

Correct API route:

studio/src/pages/api/forgeui-ai-layout.ts

Do not create:

studio/pages

Reason:

A second root-level pages directory overrides the existing source pages router.

This causes the ForgeUI homepage to return a 404.

Backend proof:

GET /api/forgeui-ai-layout

Returns:

{
  "ok": true,
  "status": "ForgeUI AI backend alive"
}

Status:

PROVEN
OpenAI Security Architecture
studio/.env
    ↓
OPENAI_API_KEY
    ↓
Next.js Server API Route
    ↓
OpenAI API

Rules:

Never use NEXT_PUBLIC_OPENAI_API_KEY.

Never place the OpenAI key in React code.

Never store the OpenAI key in Redux.

Never store the OpenAI key in localStorage.

Never commit .env.

Never expose the key to the browser.

All OpenAI requests must pass through a server-side API route.

Git security state:

studio/.env
    ↓
Ignored by studio/.gitignore
    ↓
Not tracked by Git

Verified:

git check-ignore -v .env
✓

git ls-files .env
returns nothing
✓

Security commit:

security: stop tracking local environment secrets

Status:

PUSHED TO GITHUB
AI Layout Generation Architecture

Target architecture:

User Prompt
    ↓
ForgeUI AI Playground
    ↓
POST /api/forgeui-ai-layout
    ↓
ForgeUI System Prompt
    ↓
OpenAI
    ↓
ForgeUI Layout Document
    ↓
JSON Editor
    ↓
validateAiLayout()
    ↓
Insert JSON
    ↓
Canvas
    ↓
Preview
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
Physical ESP32-P4

The model must generate ForgeUI JSON only.

It must not generate:

React

JSX

HTML

CSS

TypeScript

Arbitrary JavaScript

Expected document format:

{
  "name": "Screen Name",
  "category": "AI Generated",
  "description": "Screen description",
  "layout": [
    {
      "type": "Heading",
      "props": {
        "positionMode": "absolute",
        "x": 360,
        "y": 90,
        "w": 320,
        "h": 60,
        "children": "Example"
      }
    }
  ]
}
AI Component Source of Truth

The AI must only use components exposed by:

aiSupportedComponents

The existing validator uses:

validateAiLayout()

Target architecture:

aiSupportedComponents
    ↓
Backend Prompt Schema
    ↓
OpenAI
    ↓
Generated Layout
    ↓
validateAiLayout()

Rules:

Do not maintain a second unsupported hard-coded component registry.

aiSupportedComponents must remain the AI component source of truth.

Generated layouts must pass validateAiLayout().
Current Active Mission
FORGEUI_AI_LAYOUT_GENERATION__OPENAI_BACKEND_INTEGRATION__2026-07-12

Goal:

Prompt
    ↓
OpenAI
    ↓
ForgeUI Layout Document
    ↓
JSON Editor
    ↓
Existing Validation
    ↓
Canvas
    ↓
Preview
    ↓
LVGL Export
    ↓
Physical ESP32-P4

Immediate implementation:

Convert the backend health route from a GET-only proof into a POST generation endpoint.

Read OPENAI_API_KEY server-side.

Send a ForgeUI-specific system prompt.

Generate one valid ForgeUI layout document.

Return generated JSON to the browser.

Do not modify the proven insertion, preview, export, or firmware pipeline yet.

First target prompt:

Create a modern WiFi setup screen.

Expected milestone:

Natural Language
    ↓
OpenAI
    ↓
Valid ForgeUI JSON
    ↓
JSON Editor
Current Next Mission
FORGEUI_AI_LAYOUT_GENERATION__PROMPT_TO_JSON_EDITOR__2026-07-12

Tasks:

1. Update:
   studio/src/pages/api/forgeui-ai-layout.ts

2. Accept POST:
   {
     prompt: string
   }

3. Reject empty prompts.

4. Read OPENAI_API_KEY only on the server.

5. Call OpenAI using the installed official SDK.

6. Require JSON-only output.

7. Return:
   {
     ok: true,
     document: ...
   }

8. Add a prompt Textarea to ForgeAIPanel.tsx.

9. Add a Generate Layout button.

10. Populate layoutJson using:
    setLayoutJson(JSON.stringify(document, null, 2))

11. Preserve manual Insert JSON as the validation checkpoint.

12. Do not auto-insert during V1.

13. Prove generated output in the JSON editor.

14. Insert the generated layout into Builder.

15. Prove Builder render.

16. Prove full Preview render.

17. Export the generated layout.

18. Build and flash the generated layout to physical ESP32-P4.
AI Playground V1 Safety Rule

During V1:

Prompt
    ↓
Generate
    ↓
JSON Editor
    ↓
User Reviews JSON
    ↓
Insert JSON

Do not use:

Prompt
    ↓
Automatic Canvas Insertion

Reason:

The existing JSON editor and Insert JSON button provide a visible validation checkpoint.

The proven manual insertion workflow must remain intact during initial AI integration.
Long-Term AI Vision
Prompt
    ↓
OpenAI
    ↓
Layout
    ↓
Theme
    ↓
Background
    ↓
Icons
    ↓
Fonts
    ↓
Assets
    ↓
Complete ForgeUI Project

Possible future outputs:

Layout JSON

Theme selection

Colour palette

Background image prompt

Icon selection

Widget styling

Multi-screen navigation

Runtime widget recommendations

Complete editable project

Long-term rule:

AI must extend ForgeUI systems.

AI must not bypass ForgeUI systems.
Launcher Truth

ForgeUI is started using the existing VBS launcher.

Set WshShell = CreateObject("WScript.Shell")

' Stop old ForgeUI Node processes first
WshShell.Run "cmd /c taskkill /F /IM node.exe >nul 2>&1", 0, True
WshShell.Run "cmd /c taskkill /F /IM npm.cmd >nul 2>&1", 0, True

WScript.Sleep 2000

' Start ForgeUI
WshShell.CurrentDirectory = "C:\ForgeUI\Projects\esp32p4-ui-studio\studio"

WshShell.Run "cmd /c npm run dev", 0, False
WshShell.Run "cmd /c node export-server.js", 0, False

WScript.Sleep 1000

WshShell.Run "http://localhost:3000", 1, False

Rules:

Do not change the VBS launcher during AI backend implementation.

Do not change the ForgeUI homepage route.

Do not create a second Next.js pages directory.
Current Save History
FORGEUI_ICON_WORKFLOW_AUTO_BROWSER__SINGLE_ICON_SELECTOR__EXISTING_ASSET_PIPELINE_PRESERVED__2026-07-12

↓

security: stop tracking local environment secrets

↓

FORGEUI_AI_BACKEND_FOUNDATION__OPENAI_SDK__SECURE_ENVIRONMENT__2026-07-12

Current milestone:

FORGEUI_AI_LAYOUT_GENERATION__OPENAI_BACKEND_FOUNDATION__SECURE_ENVIRONMENT__2026-07-12
Non-Negotiable Rules
Do not rebuild RTC.

Do not rebuild WiFi.

Do not create duplicate theme systems.

Do not create duplicate runtime systems.

Do not bypass Builder.

Do not bypass Preview.

Do not bypass Export.

Do not bypass the component store.

Do not create a second asset pipeline.

Do not create a second icon export pipeline.

React Icons must export through the Image asset pipeline.

Do not generate arbitrary React or JSX.

Do not expose the OpenAI API key to the browser.

Do not use NEXT_PUBLIC_OPENAI_API_KEY.

Do not commit .env.

Do not create a second AI component allow-list.

Use aiSupportedComponents as the AI component source of truth.

Generated AI layouts must pass validateAiLayout().

AI output must land in the existing JSON editor before insertion.

Do not auto-insert generated layouts during V1.

Do not create studio/pages.

Use studio/src/pages/api for Next.js API routes.

Do not change the VBS launcher during backend integration.

Do not run npm audit fix --force.

Do not modernise unrelated dependencies during AI integration.

Every exported project must remain standalone and independently buildable.

Extend proven systems.

Preserve:

Builder
    ↓
Preview
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
ESP32-P4
Handover Note
Infrastructure setup is complete.

The OpenAI account, billing, API credits, rotated API key, official SDK, server route, secure environment, and Git protection are in place.

The current backend route is only a proven health check.

The next chat begins by converting the existing API route into a real POST OpenAI layout-generation endpoint.

Do not revisit account setup.

Do not recreate the API route elsewhere.

Do not create a root-level studio/pages folder.

Do not change the VBS launcher.

Do not touch the proven template, validator, insertion, preview, export, or ESP32-P4 pipeline until the backend returns valid ForgeUI JSON.

First implementation target:

Prompt:
Create a modern WiFi setup screen.

Expected result:

Prompt
    ↓
OpenAI
    ↓
Valid ForgeUI Layout Document
    ↓
Existing JSON Editor


NOTES

Recommended first implementation

Start smaller than the full proposed tree:

studio/src/forgeui/ai/
├── engine/
│   ├── ForgeAIEngine.ts
│   ├── PromptBuilder.ts
│   ├── ContextBuilder.ts
│   └── AIProvider.ts
├── providers/
│   └── OpenAIProvider.ts
├── validation/
│   ├── LayoutValidator.ts
│   └── LayoutRepair.ts
├── knowledge/
│   └── ComponentKnowledge.ts
└── types/
    └── ForgeAITypes.ts

Theme and asset context can be added immediately after prompt-to-layout works:

ThemeContext.ts
AssetContext.ts

That avoids building empty abstractions before the first generated screen is proven.

Core contract

The engine should expose one clean function:

const result = await forgeAIEngine.generateLayout({
  prompt,
  device,
  currentTheme,
  availableAssets,
  currentLayout,
})

And return:

type ForgeAIGenerationResult = {
  success: boolean
  document?: ForgeUILayoutDocument
  warnings: string[]
  repairs: string[]
  rawResponse?: string
  error?: string
}

The UI should never call OpenAI directly.

Provider abstraction
export interface AIProvider {
  generate(request: AIProviderRequest): Promise<AIProviderResponse>
}

Then:

export class OpenAIProvider implements AIProvider

Later these can be added without changing the engine:

LocalAIProvider
OllamaProvider
AnthropicProvider
GeminiProvider

The engine only understands AIProvider.

Engine responsibility

ForgeAIEngine.ts should orchestrate the whole sequence:

build context
    ↓
build prompt
    ↓
call provider
    ↓
parse response
    ↓
validate document
    ↓
repair safe problems
    ↓
validate again
    ↓
return result

Conceptually:

export class ForgeAIEngine {
  constructor(private provider: AIProvider) {}

  async generateLayout(
    request: ForgeAIGenerationRequest,
  ): Promise<ForgeAIGenerationResult> {
    const context = buildForgeAIContext(request)

    const providerRequest = buildLayoutPrompt({
      userPrompt: request.prompt,
      context,
    })

    const response = await this.provider.generate(providerRequest)

    const parsed = parseLayoutDocument(response.content)
    const validation = validateLayoutDocument(parsed, context)

    if (validation.valid) {
      return {
        success: true,
        document: parsed,
        warnings: validation.warnings,
        repairs: [],
      }
    }

    const repaired = repairLayoutDocument(parsed, validation, context)
    const repairedValidation = validateLayoutDocument(repaired.document, context)

    return {
      success: repairedValidation.valid,
      document: repairedValidation.valid ? repaired.document : undefined,
      warnings: repairedValidation.warnings,
      repairs: repaired.repairs,
      error: repairedValidation.valid
        ? undefined
        : 'Generated layout could not be repaired safely.',
    }
  }
}
ComponentKnowledge should be generated from ForgeUI truth

Do not maintain a second handwritten list of supported components if the existing registry already defines them.

ComponentKnowledge.ts should adapt the proven registry into AI-friendly knowledge:

type AIComponentDefinition = {
  type: string
  description: string
  allowedProps: string[]
  requiredProps: string[]
  defaults: Record<string, unknown>
  layoutRules?: string[]
}

Example:

{
  type: 'Button',
  description: 'Interactive push button with visible label.',
  allowedProps: [
    'x',
    'y',
    'w',
    'h',
    'text',
    'fontSize',
    'backgroundColor',
    'color',
  ],
  requiredProps: ['x', 'y', 'w', 'h'],
  defaults: {
    text: 'Button',
    w: 140,
    h: 48,
  },
}

The AI should receive only component information relevant to generation, not the entire internal component implementation.

ContextBuilder responsibilities

ContextBuilder.ts should assemble:

Device dimensions
Supported components
Current ForgeUI theme
Available assets
Current layout, when editing
Generation mode
Export constraints

The first context object could be:

type ForgeAIContext = {
  device: {
    name: string
    width: number
    height: number
    gridSize: number
  }
  components: AIComponentDefinition[]
  theme?: ForgeAIThemeContext
  assets?: ForgeAIAssetContext[]
  currentDocument?: ForgeUILayoutDocument
  rules: {
    absolutePositioning: boolean
    keepInsideCanvas: boolean
    uniqueIds: boolean
    lvglCompatibleOnly: boolean
  }
}
PromptBuilder responsibility

The prompt builder should produce both a strong system instruction and a structured user request.

It should instruct the provider to:

Return JSON only
Use the exact ForgeUI document shape
Use only supplied component types
Use only supported properties
Keep objects within 1024 × 600
Use absolute positioning
Avoid overlaps where possible
Create unique IDs
Produce LVGL-compatible screens

The model should not be responsible for knowing ForgeUI from memory. ForgeUI supplies the knowledge every time.

Validation versus repair

Keep these separate.

LayoutValidator.ts identifies problems:

Unsupported component
Missing layout array
Invalid coordinate
Off-screen element
Missing ID
Duplicate ID
Invalid dimensions
Unsupported property
Invalid document shape

LayoutRepair.ts only performs deterministic, safe fixes:

Clamp x and y
Clamp width and height
Generate missing IDs
Remove unsupported properties
Apply missing defaults
Remove unsupported components
Normalize numbers

It should not creatively redesign the screen.

For example:

x = Math.max(0, Math.min(x, canvasWidth - width))
y = Math.max(0, Math.min(y, canvasHeight - height))

If a document is structurally broken or mostly unsupported, repair should fail rather than silently inventing a different screen.

First engine mode

Begin with one mode only:

generate-layout

Later add:

modify-layout
generate-theme
generate-widget
generate-assets
explain-layout
repair-layout

Use a discriminated request:

type ForgeAIRequest =
  | {
      mode: 'generate-layout'
      prompt: string
    }
  | {
      mode: 'modify-layout'
      prompt: string
      currentDocument: ForgeUILayoutDocument
    }
API boundary

The browser-side engine should not hold the API key or call OpenAI directly.

Recommended path:

ForgeAIPanel
    ↓
ForgeAIClient
    ↓
POST /api/forgeui-ai/generate
    ↓
Server-side ForgeAIEngine
    ↓
OpenAIProvider

Depending on the current Next.js structure, this would be either:

studio/src/pages/api/forgeui-ai/generate.ts

or:

studio/src/app/api/forgeui-ai/generate/route.ts

The API key remains server-side.

UI changes after the engine exists

The playground then only needs:

Prompt textarea
Generate button
Loading state
Generation error
Warnings and repairs
Generated JSON editor
Insert JSON button

Flow:

const result = await generateForgeUILayout(prompt)

if (result.success && result.document) {
  setLayoutJson(JSON.stringify(result.document, null, 2))
}

Insertion continues through the existing proven function.

Best build order
1. ForgeAITypes.ts
2. AIProvider.ts
3. ComponentKnowledge.ts
4. ContextBuilder.ts
5. PromptBuilder.ts
6. LayoutValidator.ts
7. LayoutRepair.ts
8. OpenAIProvider.ts
9. ForgeAIEngine.ts
10. API route
11. ForgeAIPanel integration
12. Generate and flash the first AI-created screen
Next save-point target
FORGEUI_AI_ENGINE_V1__PROVIDER_ABSTRACTION__PROMPT_TO_VALIDATED_LAYOUT__JSON_EDITOR_PROVEN__2026-07-12

The first physical proof should be:

“Create an industrial battery monitoring dashboard”
        ↓
ForgeAIEngine
        ↓
Validated ForgeUI JSON
        ↓
Existing canvas insertion
        ↓
LVGL export
        ↓
Physical ESP32-P4