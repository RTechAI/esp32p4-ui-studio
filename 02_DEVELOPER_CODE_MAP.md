# ForgeUI Studio — Developer Code Map

## Purpose

This document is the permanent navigation map for ForgeUI Studio.

It is **not** a milestone log or project history.

Its purpose is to immediately orientate a new ChatGPT session so it knows where every major subsystem lives before suggesting code changes.

Always consult this document before asking where a feature is implemented.

---

# System Overview

```text
ForgeUI Studio
│
├── Builder
├── AI Playground
├── Theme System
├── Asset Library
├── Interactive Assets
├── Browser Preview
├── Export Pipeline
└── ESP32-P4 Runtime
```

---

# AI Playground

Owns:

- Layout AI
- Hero AI
- Artwork AI
- Asset AI
- Interactive Button AI

Primary file:

```text
ForgeAIPanel.tsx
```

Supporting files:

```text
ForgeAIClient.ts
ForgeAIContext.ts
ForgeAIEngine.ts
ForgeAIParser.ts
ForgeAIPrompts.ts
ForgeUIAIImagePipeline.ts
```

Never create a second AI pipeline.

---

# Interactive Assets

Purpose

Reusable multi-state controls.

Core files

```text
ForgeUIInteractiveAsset.ts
ForgeUIInteractiveButtonAsset.ts
ForgeUIInteractiveAssetRegistry.ts
ForgeUIInteractiveAssetPersistence.ts
ForgeUIInteractiveAssetValidation.ts
ForgeUIInteractiveAssetIds.ts
ForgeUIInteractiveAssetPanel.tsx
```

Renderer

```text
InteractiveButtonPreview.tsx
```

Canvas Adapter

```text
InteractiveButtonCanvasPreview.tsx
```

Responsibilities

- Registry
- CRUD
- Persistence
- Assignment
- Preview
- AI Button Designer

---

# Uploaded Asset System

Primary file

```text
ForgeUIUploadedAssetRegistry.ts
```

Owns

- Hero backgrounds
- Artwork
- Icons
- Button images
- LVGL assets

Interactive Assets store references only.

Never duplicate uploaded image data.

---

# Theme System

Primary files

```text
ForgeThemeContext.tsx
ForgeUIThemeManager.tsx
```

Owns

- Themes
- Hero backgrounds
- Theme persistence

---

# Builder

Owns

- Toolbox
- Canvas
- Drag & Drop
- Inspector
- Component properties
- Selection

Important files

```text
ComponentPreview.tsx
PreviewContainer.tsx
Editor.tsx
```

---

# Browser Preview

Primary file

```text
forgePreviewRenderer.tsx
```

Purpose

Browser preview should always mirror the physical ESP32-P4.

Never create a separate rendering implementation.

---

# Export Pipeline

Primary entry

```text
generateForgeUILvglCode()
```

Owns

- LVGL generation
- Asset export
- Runtime generation
- CMake generation

Interactive Buttons extend this exporter.

Do not create separate exporters.

---

# Image Pipeline

Primary helper

```text
ForgeUIAIImagePipeline.ts
```

Preprocessor

```text
ForgeUIImagePreprocessor.py
```

Converter

```text
LVGLImage.py
```

Supported asset modes

```text
hero
artwork
image
icon
button-normal
button-pressed
```

---

# Runtime

Current responsibility

Visual runtime only.

Generated code owns

- Pressed state
- Released state
- Runtime image switching

Future runtime behaviour should be exposed through generated callback hooks.

ForgeUI should not generate customer application logic.

---

# Registry Ownership

Interactive Assets

```text
ForgeUIInteractiveAssetRegistry.ts
```

Uploaded Assets

```text
ForgeUIUploadedAssetRegistry.ts
```

Themes

```text
ForgeThemeContext.tsx
```

Never duplicate registry ownership.

---

# Rendering Flow

```text
AI
    ↓
Registry
    ↓
Canvas
    ↓
Browser Preview
    ↓
LVGL Export
    ↓
ESP32-P4
```

Every new feature should follow this pipeline.

---

# Where To Start

| Feature | Start Here |
|----------|------------|
| AI | ForgeAIPanel.tsx |
| Interactive Buttons | ForgeUIInteractiveAssetPanel.tsx |
| Uploaded Images | ForgeUIUploadedAssetRegistry.ts |
| Themes | ForgeUIThemeManager.tsx |
| Canvas Rendering | ComponentPreview.tsx |
| Browser Preview | forgePreviewRenderer.tsx |
| Export | generateForgeUILvglCode() |
| LVGL Image Conversion | ForgeUIImagePreprocessor.py |

---

# Architecture Rules

- Extend existing systems.
- Never duplicate registries.
- Never duplicate exporters.
- Never duplicate renderers.
- Browser Preview and ESP32-P4 should behave identically.
- Generated firmware contains UI only.
- Customer application logic belongs outside generated code.

---

# Purpose Of This Document

This document exists solely to help new development sessions quickly locate ownership of the ForgeUI codebase.

It should remain stable and only be updated when ownership changes.

It is **not** intended to record milestones, savepoints or project history.