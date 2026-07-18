# ForgeUI Interactive Assets — Phase 1 Integration (Proven)

## Overview

Phase 1 establishes the complete Interactive Asset infrastructure inside ForgeUI Studio.

The component is now fully registered from the toolbox through to the canvas and browser preview. The only remaining work is assigning an Interactive Asset to the component and exporting it.

---

# 1. Interactive Asset System

Created the core Interactive Asset framework.

Files:

- ForgeUIInteractiveAsset.ts
- ForgeUIInteractiveButtonAsset.ts
- ForgeUIInteractiveAssetRegistry.ts
- ForgeUIInteractiveAssetPersistence.ts
- ForgeUIInteractiveAssetValidation.ts
- ForgeUIInteractiveAssetIds.ts

Responsibilities:

- Interactive asset definitions
- Registry
- Save / Load
- Validation
- Asset lookup

---

# 2. Interactive Button Preview

Created

InteractiveButtonPreview.tsx

Purpose:

- Pure rendering component
- Displays Normal image
- Displays Pressed image
- Mouse down/up preview
- Contains **no registry logic**

This component should remain reusable.

---

# 3. Canvas Adapter

Created

InteractiveButtonCanvasPreview.tsx

Purpose:

Resolve everything required by the renderer.

Flow:

InteractiveButton Component

↓

component.props.interactiveAssetId

↓

Interactive Asset Registry

↓

Normal Asset
Pressed Asset

↓

InteractiveButtonPreview

All registry lookups belong here.

---

# 4. Register New Component Type

Added InteractiveButton to:

- ComponentType
- COMPONENTS
- rootComponents

ForgeUI now recognises InteractiveButton as a native component.

---

# 5. Component Preview Registration

Updated

ComponentPreview.tsx

Added:

case 'InteractiveButton'

which renders

InteractiveButtonCanvasPreview

---

# 6. Forge Preview Registration

Updated

forgePreviewRenderer.tsx

Added

case 'InteractiveButton'

Browser Preview now supports InteractiveButton exactly like the editor.

---

# 7. Sidebar Registration

Added InteractiveButton to

menuItems

This allows the sidebar menu to recognise it.

---

# 8. Component List Registration

Added InteractiveButton to

componentsList

The component is now part of the editor component catalogue.

---

# 9. Toolbox Registration

Added InteractiveButton to

forgeuiCoreWidgets

Result:

InteractiveButton now appears in the left toolbox and can be dragged onto the canvas.

---

# 10. Registration Pipeline (Proven)

The following pipeline has been completely proven:

Sidebar

↓

Drag

↓

Canvas

↓

ComponentPreview

↓

InteractiveButtonCanvasPreview

↓

InteractiveButtonPreview

Status:

✔ Appears in toolbox

✔ Drags correctly

✔ Drops correctly

✔ Renders correctly

✔ Browser preview works

✔ No crashes

---

# Current Behaviour

When dropped onto the canvas the component displays the placeholder message:

"Select both Normal and Pressed visuals to preview the button."

This is expected because no Interactive Asset has been assigned yet.

The rendering pipeline itself is fully functional.

---

# Phase 2 — Asset Assignment

The next milestone is connecting the Interactive Assets panel.

When an InteractiveButton is selected:

- Show Interactive Asset panel
- Browse Interactive Assets
- Select one

Write

component.props.interactiveAssetId

to the selected component.

---

# Live Preview Pipeline

Once connected the pipeline becomes:

InteractiveButton

↓

interactiveAssetId

↓

Interactive Asset Registry

↓

Normal Asset

Pressed Asset

↓

InteractiveButtonPreview

Result:

- Live Normal state
- Live Pressed state
- Instant preview updates

---

# Persistence

Ensure

component.props.interactiveAssetId

is:

- Saved inside project JSON
- Restored when projects reopen

---

# Export Pipeline

During LVGL export:

InteractiveButton

↓

Normal Image

Pressed Image

↓

Generated LVGL Objects

↓

ESP32-P4 Runtime

This completes the reusable Interactive Asset workflow.

---

# Current Milestone

## ✅ Phase 1 Complete

Infrastructure is fully proven.

Completed:

- Interactive Asset registry
- Interactive Button renderer
- Canvas adapter
- Component registration
- Sidebar integration
- Toolbox integration
- Drag & Drop
- Canvas rendering
- Browser Preview integration

## 🚧 Next

Connect the Interactive Assets panel to assign `interactiveAssetId` and complete the live Interactive Button workflow.