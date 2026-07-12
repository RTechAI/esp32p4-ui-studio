
# SPINE

## Current Save Point

```text
FORGEUI_SETUP_AND_RECOVERY__DEPENDENCY_PREFLIGHT__ESP_IDF_DETECTION__OPENAI_READY__AI_PLAYGROUND_NEXT__2026-07-12
```

---

# Project Status

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

FIRST-TIME SETUP PROVEN

DEPENDENCY RECOVERY PROVEN
```

---

# New Proven Capabilities

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