# LVGL 9.2 Practical Closure — Batch 1

Status: **PROVEN ON ESP32-P4** for Span, Animation Image and Image Button.

## Architecture

All three widgets are normal Widget Registry entries. Canvas and Browser use
the same preview components. Animation Image and Image Button resolve artwork
from the existing uploaded Asset Registry and Canonical Image Pipeline. Live
Studio and Standalone Export consume the same `ForgeUILvglExport.ts` branches
and export-time feature dependencies.

Span emits native `lv_spangroup_create`, ordered `lv_span_t` records, semantic
or explicit colours, supported Montserrat sizes, underline, alignment and
overflow configuration. It has no Runtime API or UserEvent.

Span authoring uses one normalized `ForgeUISpan` record across defaults,
Inspector, Canvas, Browser and export. Each record has a stable ID, text,
semantic colour, optional explicit colour override, supported font size and
underline state. The Inspector performs immutable add, edit, move up/down and
remove operations and exposes overall alignment plus clip/ellipsis overflow.
Legacy records without IDs and JSON-serialized collections normalize safely.
When the collection is empty, `Add rich-text span` is an actionable Canvas and
Browser placeholder that creates the first persisted item.

Animation Image emits native `lv_animimg_create`, an ordered LVGL-ready frame
array, total animation duration derived from per-frame duration, repeat count
and initial start state. A public start/stop/frame API is intentionally deferred
until it can own pause/resume and frame selection without relying on LVGL
animation internals.

When zero valid frames are assigned, all four presentation paths show the same
transparent, semantic-border placeholder with centred `Add animation frames`
text. The exporter deliberately creates a styled presentation object instead
of an empty `lv_animimg`. One or more valid frames continue through the native
animation path unchanged. This is an empty-state parity refinement, not an
AnimImage functional defect.

The Studio authoring workflow uses the existing Asset Manager in multi-select
mode. Clicking the empty-state message or choosing frames from the Inspector
opens that manager with the widget's current selection. Applying the selection
updates `frameAssetIds` atomically. Inspector controls then support adding an
empty slot, replacing individual assets, moving frames up or down, removing
frames, duration, looping and initial running state. No separate asset registry,
upload path or image conversion flow exists for Animation Image.

Image Button emits native `lv_imagebutton_create` with released, pressed and
disabled center sources. It exposes `FG_Set_<Name>_Enabled(bool)` and
`FG_On_<Name>_Clicked(void)` with deterministic collision suffixes.

## Physical proof record

ESP32-P4 validation confirmed Span ordering, semantic and explicit colours,
font sizing, underline and alignment; Animation Image authoring, ordered frame
animation and zero-frame parity; and Image Button released, pressed, disabled
and click behavior. Canvas, Browser Preview, Live Studio and Standalone Export
matched with no observed hardware regression.

Authoritative save point:
`FORGEUI_LVGL9_CLOSURE_BATCH1__SPAN_ANIMIMAGE_IMAGEBUTTON_ESP32P4_PROVEN__DOCUMENTATION_ALIGNED__READY_FOR_WINDOW_MENU__2026-08-02`.
