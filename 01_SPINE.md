# SPINE

## Current Save Point

```text
FORGEUI_AI_STUDIO_V2_3_0__AI_HERO_ASSET_PIPELINE__BUILDER_THEME_PREVIEW_UNIFIED__LVGL_READY__2026-07-13
```

---

# Project Status

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

AI HERO PIPELINE PROVEN

LVGL ASSET PIPELINE PROVEN
```

---

# Major Milestone

ForgeUI Studio now supports a complete AI Hero Background workflow integrated directly into the Studio.

The generated artwork is no longer a temporary preview.

AI artwork is now a reusable ForgeUI asset.

---

# Proven AI Hero Pipeline

```text
Natural Language Prompt
        ↓
OpenAI Image Generation
        ↓
Live Browser Preview
        ↓
Save To Asset Manager
        ↓
Automatic LVGL Conversion
        ↓
LVGL Ready Asset
        ↓
Theme Manager
        ↓
Builder Canvas
```

Status

```text
PROVEN
```

---

# Unified Theme Architecture

ForgeThemeContext now provides a single source of truth for:

```text
Theme Palette
Texture
Hero Background
```

Consumers

```text
Browser Preview
Builder Canvas
Theme Manager
```

All now use the same active Hero Background.

Status

```text
PROVEN
```

---

# Asset Pipeline

AI Generated Image

```text
Prompt
      ↓
OpenAI
      ↓
PNG Base64
      ↓
ForgeUI Uploaded Asset Registry
      ↓
Asset Manager
      ↓
Auto LVGL Converter
      ↓
Generated C Asset
      ↓
LVGL Ready
```

Status

```text
PROVEN
```

---

# Theme Manager

Theme Manager now supports:

```text
ForgeUI Theme Palettes

+

AI / Uploaded Background Library
```

Capabilities

```text
Select Hero Background
Live Browser Preview
Live Builder Canvas
Persistent Project Asset
```

Status

```text
PROVEN
```

---

# Builder Canvas

Builder now shares the same Hero Background rendering path as Browser Preview.

Rendering priority

```text
Hero Background
        ↓
Theme Texture
        ↓
Solid Theme Background
```

Status

```text
PROVEN
```

---

# Current AI Capabilities

## Layout AI

```text
Prompt
      ↓
GPT
      ↓
ForgeUI Layout JSON
      ↓
Validation
      ↓
Canvas
      ↓
Browser Preview
      ↓
LVGL Export
      ↓
ESP32-P4
```

Status

```text
PROVEN
```

---

## Theme AI

```text
Prompt
      ↓
OpenAI Image Generation
      ↓
Hero Background
      ↓
Asset Manager
      ↓
Automatic LVGL Conversion
      ↓
Theme Manager
      ↓
Builder Canvas
      ↓
Browser Preview
```

Status

```text
PROVEN
```

---

# Current Architecture

```text
Prompt
      │
      ├──────────────┐
      │              │
      ▼              ▼
 Layout AI      Theme AI
      │              │
      ▼              ▼
 Layout JSON     Hero Image
      │              │
      ▼              ▼
 Canvas      Uploaded Assets
      │              │
      └──────┬───────┘
             ▼
      Builder Canvas
             ▼
      Browser Preview
             ▼
      LVGL Export
             ▼
      ESP32-P4
```

---

# Next Milestone

## AI Project Generation

Goal

```text
Describe Application
        ↓
Generate Theme
        ↓
Generate Hero
        ↓
Generate Layout
        ↓
Generate Assets
        ↓
Populate Builder
        ↓
LVGL Export
        ↓
Flash ESP32-P4
```

---

# Future Vision

```text
One Prompt

↓

Complete Embedded HMI

↓

Editable Inside ForgeUI

↓

One Click Export

↓

ESP32-P4 Hardware
```

This completes the transition from an AI-assisted editor to an AI-native embedded HMI development environment.

----------------------------------------------------------------------

# SPINE

# Current Save Point

```text
FORGEUI_AI_STUDIO_V2_2__LIVE_GPT_LAYOUT_AND_AI_HERO_BACKGROUND_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-13
```

---

# Project Status

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

AI LAYOUT PIPELINE PROVEN

AI HERO BACKGROUND PIPELINE PROVEN

AI STUDIO V2.2 PROVEN
```

---

# ForgeUI Overview

ForgeUI Studio is an open-source visual LVGL v9 HMI designer, AI-assisted interface generator, asset pipeline, theme system, code generator and ESP-IDF workflow targeting ESP32-P4 hardware.

The platform now supports AI-generated layouts and AI-generated HMI hero backgrounds.

---

# Core ForgeUI Pipeline

```text
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
Standalone ESP-IDF Project
        │
        ▼
ESP-IDF Build
        │
        ▼
Physical ESP32-P4
```

Status

```text
PROVEN
```

---

# AI Layout Pipeline

```text
Natural Language Prompt
        │
        ▼
GPT-5
        │
        ▼
ForgeUI Layout Document
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
ESP-IDF
        │
        ▼
Physical ESP32-P4
```

Status

```text
FULLY PROVEN
```

---

# AI Hero Background Pipeline

NEW

```text
Natural Language Prompt
        │
        ▼
GPT Image
        │
        ▼
Hero Background API
        │
        ▼
Base64 Image
        │
        ▼
ForgeThemeContext
        │
        ▼
Browser Preview
```

Status

```text
FULLY PROVEN
```

---

# AI Studio V2

ForgeUI now contains a dedicated AI workspace.

```text
ForgeUI AI Studio

Layout
Theme
Assets
Images
Icons
Runtime
```

Current Status

```text
LAYOUT ENGINE PROVEN

HERO BACKGROUND ENGINE PROVEN

MODULAR AI ARCHITECTURE PROVEN
```

---

# AI Engine Architecture

```text
ForgeAIPanel
        │
        ▼
ForgeAIEngine
        │
        ├──────────────┐
        │              │
        ▼              ▼
Layout Engine     Hero Engine
        │              │
        └──────┬───────┘
               ▼
        ForgeAIClient
               │
               ▼
     OpenAI APIs
               │
               ▼
 Layout Documents / Images
               │
               ▼
      Validation & Parsing
               │
               ▼
            ForgeUI
```

Status

```text
MODULAR

PROVEN

EXTENSIBLE
```

---

# Hero Background Engine

Completed

```text
✓ Theme Workspace

✓ Hero Prompt Editor

✓ OpenAI Image Generation

✓ Hero API

✓ Base64 Image Pipeline

✓ ForgeThemeContext Integration

✓ Live Browser Preview

✓ Runtime Theme Switching
```

Status

```text
PROVEN
```

---

# Theme System

```text
FG_PREVIEW_PALETTES
        │
        ▼
ForgeThemeContext
        │
        ├──────────────┐
        │              │
Preset Theme    AI Hero Background
        │              │
        └──────┬───────┘
               ▼
         Browser Preview
```

Status

```text
LIVE
```

---

# Browser Preview

Browser Preview now supports

```text
Preset Theme

or

AI Generated Hero Background
```

AI Hero Backgrounds automatically override preset textures.

Status

```text
PROVEN
```

---

# New API Endpoints

```text
/api/forgeui-ai-layout

/api/forgeui-ai-hero
```

Both endpoints operational.

---

# Proven AI Features

## Layout AI

```text
Natural Language
✓

GPT Generation
✓

ForgeUI JSON
✓

Validation
✓

Canvas
✓

Browser Preview
✓

LVGL Export
✓

ESP-IDF
✓

Physical Hardware
✓
```

---

## Hero AI

```text
Natural Language
✓

OpenAI Image
✓

Hero Generation
✓

Theme Context
✓

Live Preview
✓
```

---

# Current Architecture

```text
Manual Builder
        │
        ├─────────────┐
        │             │
        ▼             ▼
Visual UI      AI Layout Generation
        │             │
        ├─────────────┤
        ▼             ▼
 AI Hero Generation
        │
        ▼
 Browser Preview
        │
        ▼
 LVGL Export
        │
        ▼
 ESP-IDF
        │
        ▼
 ESP32-P4
```

---

# Current Limitation

AI Hero Backgrounds currently exist as live preview assets only.

Not yet integrated into

```text
Asset Manager

Builder Background

LVGL Export

Standalone Export

ESP32-P4 Project Assets
```

---

# Next Milestone

## AI Hero Asset Pipeline

```text
Generate Hero
        │
        ▼
Preview
        │
        ▼
Save To Asset Manager
        │
        ▼
Builder Background
        │
        ▼
LVGL Export
        │
        ▼
Standalone Export
        │
        ▼
ESP32-P4
```

Goal

```text
AI Hero Backgrounds become permanent ForgeUI assets.
```

---

# Long-Term AI Vision

```text
Prompt
        │
        ▼
Hero Background AI
        │
        ▼
Layout AI
        │
        ▼
Theme AI
        │
        ▼
Asset AI
        │
        ▼
Icon AI
        │
        ▼
Complete ForgeUI Project
```

---

# Save History

```text
FORGEUI_AI_ENGINE_V2__LIVE_GPT_TO_PHYSICAL_ESP32P4_PIPELINE_PROVEN__2026-07-12

↓

FORGEUI_AI_STUDIO_V2__MODERN_WORKSPACE__LIVE_GPT_LAYOUT_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-12

↓

FORGEUI_AI_STUDIO_V2_2__LIVE_GPT_LAYOUT_AND_AI_HERO_BACKGROUND_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-13
```

---

# Summary

ForgeUI has now proven **two independent AI pipelines**.

```text
Natural Language
        │
        ├──────────────┐
        ▼              ▼
 Layout AI      Hero Background AI
        │              │
        └──────┬───────┘
               ▼
          Browser Preview
               ▼
           LVGL Export
               ▼
            ESP-IDF
               ▼
        Physical ESP32-P4
```

ForgeUI has now evolved beyond an AI-assisted layout designer into an AI-assisted embedded HMI design platform capable of generating both interface layouts and professional hero artwork directly from natural language prompts.


----------------------------------------------------------------------------------------

# SPINE

# Current Save Point

```text
FORGEUI_AI_STUDIO_V2__MODERN_WORKSPACE__LIVE_GPT_LAYOUT_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-12
```

---

# Project Status

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

AI LAYOUT PIPELINE PROVEN

AI STUDIO V2 PROVEN
```

---

# ForgeUI Overview

ForgeUI Studio is an open-source visual LVGL v9 HMI designer, AI-assisted interface generator, asset pipeline, theme system, code generator, and ESP-IDF workflow targeting ESP32-P4 hardware.

The platform now supports end-to-end AI-assisted interface generation from natural language through to physical embedded hardware.

---

# Core ForgeUI Pipeline

```text
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
Standalone ESP-IDF Project
        │
        ▼
ESP-IDF Build
        │
        ▼
Physical ESP32-P4
```

Status:

```text
PROVEN
```

---

# AI Layout Pipeline

```text
Natural Language Prompt
        │
        ▼
GPT-5
        │
        ▼
ForgeUI Layout Document
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
```

Status:

```text
FULLY PROVEN
```

---

# AI Studio V2

ForgeUI now contains a dedicated AI workspace.

```text
ForgeUI AI Studio

Layout
Theme
Assets
Images
Icons
Runtime
```

Current Status

```text
LAYOUT ENGINE PROVEN

THEME ENGINE FOUNDATION COMPLETE

MODULAR AI ARCHITECTURE PROVEN
```

---

# AI Engine Architecture

```text
ForgeAIPanel
        │
        ▼
ForgeAIEngine
        │
        ├──────────────┐
        │              │
        ▼              ▼
Layout Engine     Theme Engine
        │              │
        └──────┬───────┘
               ▼
        ForgeAIClient
               │
               ▼
     OpenAI Responses API
               │
               ▼
      Structured Documents
               │
               ▼
      Validation & Parsing
               │
               ▼
            ForgeUI
```

Status

```text
MODULAR

PROVEN

EXTENSIBLE
```

---

# Proven AI Layout Workflow

```text
Describe Screen
        │
        ▼
Generate Layout
        │
        ▼
Validated ForgeUI Document
        │
        ▼
Review
        │
        ▼
Insert Into Canvas
        │
        ▼
Builder
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
ESP-IDF
        │
        ▼
Physical ESP32-P4
```

Status

```text
PROVEN
```

---

# AI Studio V2 Workspace

Proven

- Modern AI Workspace
- GPT Prompt Editor
- Live OpenAI Integration
- Template Library
- Structured ForgeUI Documents
- JSON Validation
- Component Validation
- Canvas Insertion
- Browser Preview
- LVGL Export
- ESP-IDF Build
- Physical ESP32-P4 Deployment

Status

```text
PROVEN
```

---

# Theme System

Single source of truth

```text
FG_PREVIEW_PALETTES
        │
        ▼
ForgeThemeContext
        │
        ├─────────────┐
        │             │
Preset Theme   Custom AI Theme
        │             │
        └──────┬──────┘
               ▼
           Preview
               ▼
           Builder
               ▼
            Export
               ▼
         ESP32-P4
```

Completed

```text
✓ ForgePreviewPalette

✓ ForgeThemeContext

✓ Custom Palette Support

✓ Theme Document

✓ Theme Parser

✓ Theme Prompt Builder

✓ Theme Engine

✓ Shared AI Client
```

Current Status

```text
BACKEND COMPLETE

UI INTEGRATION NEXT
```

---

# Current Architecture

```text
Manual Design
        │
        ├──────────────┐
        │              │
        ▼              ▼
Visual Editor    AI Layout Generation
        │              │
        └──────┬───────┘
               ▼
        ForgeUI Document
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
```

Status

```text
PROVEN
```

---

# Proven Features

## Visual Builder

```text
Builder
✓

Preview
✓

Export
✓

ESP32-P4
✓
```

---

## AI Layout Generation

```text
Natural Language
✓

GPT Generation
✓

ForgeUI JSON
✓

Validation
✓

Canvas
✓

Preview
✓

LVGL Export
✓

ESP-IDF
✓

Physical Hardware
✓
```

---

## Theme System

```text
Preset Themes
✓

Live Theme Switching
✓

Shared Theme Context
✓

AI Theme Foundation
✓
```

---

## Asset Pipeline

```text
Uploaded Assets
✓

React Icons
✓

Unified Image Pipeline
✓

LVGLImage.py
✓

Generated C Assets
✓

ESP32-P4
✓
```

---

## Runtime Widgets

```text
RTC
✓

WiFi
✓
```

Ownership Rule

```text
Runtime owns truth.

Widget owns display.

LVGL timer owns refresh.
```

---

# Current Mission

## AI Theme Engine

```text
Prompt
        │
        ▼
GPT
        │
        ▼
Validated Theme Document
        │
        ▼
setCustomPalette()
        │
        ▼
Entire Studio Repaints Live
```

Status

```text
NEXT
```

---

# Long-Term AI Vision

```text
Prompt
        │
        ▼
Layout AI
        │
        ▼
Theme AI
        │
        ▼
Image AI
        │
        ▼
Asset AI
        │
        ▼
Icon AI
        │
        ▼
Runtime Assistant
        │
        ▼
Complete ForgeUI Project
```

---

# Current Save History

```text
FORGEUI_AI_ENGINE_V2__LIVE_GPT_TO_PHYSICAL_ESP32P4_PIPELINE_PROVEN__2026-07-12

↓

FORGEUI_AI_STUDIO_V2__MODERN_WORKSPACE__LIVE_GPT_LAYOUT_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-12
```

---

# Non-Negotiable Rules

- Preserve Builder.
- Preserve Preview.
- Preserve LVGL Export.
- Preserve Standalone Export.
- Preserve ESP-IDF compatibility.
- Preserve Physical Hardware parity.
- Do not duplicate asset pipelines.
- Do not duplicate theme systems.
- Do not duplicate runtime systems.
- AI must extend ForgeUI systems, never bypass them.
- All generated layouts must pass validation before insertion.
- Exported projects must remain completely standalone.

---

# Next Milestone

```text
ForgeUI AI Theme Engine

Prompt
        │
        ▼
GPT
        │
        ▼
Forge Theme Document
        │
        ▼
Theme Validation
        │
        ▼
setCustomPalette()
        │
        ▼
Entire Studio Repaints
        │
        ▼
Preview
        │
        ▼
LVGL Export
        │
        ▼
ESP32-P4
```

---

# Summary

ForgeUI has now proven an end-to-end AI-assisted embedded UI workflow.

```text
Natural Language
        │
        ▼
GPT
        │
        ▼
Validated ForgeUI Layout
        │
        ▼
Visual Editing
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
ESP-IDF
        │
        ▼
Physical ESP32-P4
```

This milestone marks the transition of ForgeUI from a visual LVGL editor into an AI-assisted embedded interface design platform.

# About the Creator

Hi, I'm **Scott Forster** from New Zealand.

ForgeUI Studio began as a personal project to make embedded HMI development easier, faster and more enjoyable. As someone who enjoys solving real engineering problems, I wanted a tool that could take an idea from a simple prompt all the way through to a working interface running on physical ESP32 hardware.

Every feature in ForgeUI is developed with a simple philosophy:

> **Build it. Prove it. Flash it. Improve it.**

The project has grown into an open-source AI-assisted embedded UI platform combining visual design, AI-powered generation, LVGL, and ESP-IDF into a single workflow.

ForgeUI is built in collaboration with ChatGPT, which has been an invaluable coding assistant, sounding board and development partner throughout the project. While I design the architecture, test the hardware and drive the vision, ChatGPT has helped accelerate development by assisting with implementation, refactoring and documentation.

This project is shared with the community in the hope that it makes embedded development more accessible and inspires others to build amazing products.

I welcome feedback, ideas and contributions from developers around the world.

---

**Scott Forster**  
Creator & Lead Developer — ForgeUI Studio

📧 **forgeui.esp32@gmail.com**