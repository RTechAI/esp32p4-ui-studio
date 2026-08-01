# ForgeUI Window Widget

Status: **IMPLEMENTED — READY FOR PHYSICAL PROOF** (2026-08-02). Do not mark
Window proven until the ESP32-P4 procedure below passes.

## Architecture

Window is a registered `structured` container using the normal `IComponent`
`parent`/`children` graph. Canvas, project serialization, duplication and
deletion therefore use the established component-tree code. The browser
preview renders a header and content viewport; children are positioned relative
to the content viewport. The shared LVGL generator emits `lv_win_create`, gets
the header and content through `lv_win_get_header`/`lv_win_get_content`, and
recurses into the content object. Live Studio and Standalone Export use that
same generator.

Inspector properties cover title/alignment/icon visibility, header height and
colours, close visibility, content colour/padding/scrolling/scrollbar/clipping,
and frame border/radius. Serialized defaults keep older projects compatible:
projects without Window require no migration, and missing Window fields fall
back to the same preview/export defaults.

The close button uses a generated LVGL click callback to hide its owning
Window. No public Runtime API or `95_UserEvents` hook is emitted in this pass.
This is deliberate: the first hardware proof should establish native focus,
scroll and close behaviour before ForgeUI freezes an open/close/action ABI.
Action-button data and native generation are supported, with a maximum of four
stable serialized actions; dedicated action callbacks are deferred with that
ABI decision.

## Physical proof

1. Create a 420×300 Window at `(40, 40)` titled `Control panel`.
2. Leave the icon and close control enabled; set a 52 px header, 10 px content
   padding, Auto scrollbar, and scrolling enabled.
3. Add a Text at `(8, 8)`, Button at `(8, 52)`, Slider at `(8, 108)`, and a
   second Text below the visible content height to force vertical scrolling.
4. Duplicate the Window, move the copy to `(500, 40)`, title it `Diagnostics`,
   disable its icon and close control, and give it distinct header/content
   colours.
5. Save, close and reload the project. Confirm both child hierarchies and local
   coordinates remain intact.
6. Check Browser Preview, then export Live Studio and Standalone projects.
   Confirm both contain `lv_win_create`, unique object names, and children
   created with each Window's `_content` object as parent.
7. Build and flash the Standalone export to the Waveshare ESP32-P4 using the
   repository's normal ESP-IDF workflow. Confirm both windows render with clean
   header/content separation, content scrolls without moving the header,
   children remain clipped, and the first close button hides only its owner.
8. Power-cycle and repeat the scroll/close checks. Record photographs and the
   export commit before changing the status to **PROVEN**.

Recommended proof layout is two side-by-side Windows on the 1024×600 canvas,
with the left Window exercising scrolling and close behaviour and the right
Window exercising optional-control omission and independent naming.

## Deliberate deferrals

- Menu and Lottie are not part of this implementation.
- Docking, modal/dialog policy and reusable window templates are future work.
- Runtime open/close/title APIs and application action hooks wait for physical
  proof; the current close button is functional locally.
- The title icon uses the native LVGL image symbol during export; binding the
  full ForgeUI icon/asset picker is deferred to avoid introducing a second
  asset path.

