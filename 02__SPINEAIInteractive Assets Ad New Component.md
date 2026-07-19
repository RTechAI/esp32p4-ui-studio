# ForgeUI Interactive Assets — Phase 2 Assignment Integration

## Overview

The Interactive Asset infrastructure is fully operational.

Phase 2 has begun by connecting the Interactive Asset panel to the editor. The assignment UI has been implemented, but selected-component detection is currently preventing assignment.

---

# 1. Interactive Asset System

Core Interactive Asset framework completed.

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

Created:

- InteractiveButtonPreview.tsx

Purpose:

- Pure rendering component
- Displays Normal image
- Displays Pressed image
- Mouse down/up preview
- No registry logic

This component should remain a reusable renderer only.

---

# 3. Canvas Adapter

Created:

- InteractiveButtonCanvasPreview.tsx

Responsibilities:

- Read

```ts
component.props.interactiveAssetId
```

- Lookup Interactive Asset
- Resolve Normal image
- Resolve Pressed image
- Pass assets into:

```tsx
<InteractiveButtonPreview />
```

All registry logic remains here.

---

# 4. Component Registration

InteractiveButton is registered in:

- ComponentType
- COMPONENTS
- rootComponents
- componentsList
- menuItems
- forgeuiCoreWidgets

Result:

- Appears in toolbox
- Drag & Drop works
- Canvas rendering works
- Browser preview works

---

# 5. Preview Registration

Added to:

- ComponentPreview.tsx
- forgePreviewRenderer.tsx

Both render:

```tsx
<InteractiveButtonCanvasPreview component={component} />
```

---

# 6. Proven Pipeline

The following workflow is now proven:

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

- ✔ Toolbox registration
- ✔ Drag & Drop
- ✔ Canvas rendering
- ✔ Browser Preview
- ✔ Registry lookup architecture
- ✔ No runtime crashes

---

# 7. Interactive Asset Designer

The Interactive Asset panel now supports:

- Create Interactive Button
- Edit
- Delete
- Save
- Normal image selection
- Pressed image selection
- Live preview
- Registry persistence

---

# 8. Assignment UI Added

The Interactive Asset list now includes:

- **Use on Selected**
- Edit
- Delete

Assignment handler added:

```ts
const assignInteractiveAsset = (
  asset: ForgeUIInteractiveButtonAsset,
) => {
  if (!selectedIsInteractiveButton) {
    return
  }

  setValue('interactiveAssetId', asset.id)
}
```

The panel now accesses:

```ts
const selectedComponent =
  useSelector(getSelectedComponent)

const { setValue } = useForm()
```

---

# Current Blocker

The assignment button remains disabled.

Current check:

```ts
const selectedIsInteractiveButton =
  selectedComponent?.type === 'InteractiveButton'
```

Even after selecting an InteractiveButton on the canvas, **Use on Selected** remains greyed out.

This indicates one of the following:

- Opening the AI Playground clears the current selection.
- `getSelectedComponent()` is returning a different object than expected.
- The Playground is outside the active inspector selection context.
- The component type is stored differently than expected.

The assignment UI is complete.

The remaining work is resolving selected-component detection.

---

# Next Chat — Start Here

Open:

```
ForgeUIInteractiveAssetPanel.tsx
```

Inspect:

```ts
const selectedComponent =
  useSelector(getSelectedComponent)
```

Determine:

- What `selectedComponent` actually contains.
- Whether opening the Playground clears the selection.
- Whether another selector should be used.
- Whether assignment should use the existing Inspector selection API instead.

Do **not** modify:

- InteractiveButtonPreview
- InteractiveButtonCanvasPreview
- Registry
- Persistence
- Renderer

Those systems are already complete.

---

# Remaining Pipeline

Once selection is detected correctly:

InteractiveButton

↓

Use on Selected

↓

interactiveAssetId

↓

InteractiveButtonCanvasPreview

↓

Registry lookup

↓

Normal image

↓

Pressed image

↓

Live canvas preview

↓

Browser preview

↓

LVGL export

↓

ESP32-P4 runtime

---

# Current Milestone

## ✅ Completed

- Interactive Asset registry
- Interactive Button renderer
- Canvas adapter
- Component registration
- Sidebar integration
- Toolbox integration
- Drag & Drop
- Canvas rendering
- Browser preview
- Interactive Asset designer
- Interactive Asset persistence
- Assignment UI

## 🚧 Remaining

Resolve selected-component detection so **Use on Selected** can write:

```ts
component.props.interactiveAssetId
```

After that, verify:

- Live Normal state
- Live Pressed state
- Project save/load persistence
- LVGL export
- ESP32-P4 runtime integration