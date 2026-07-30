# AI Layout Creator asset catalogue

The AI Layout Creator uses `ForgeAIComponentCatalogue.ts` as its authoritative
capability boundary. The catalogue is derived from the Studio palette and only
marks a component AI-visible when it has all three required paths: Canvas
preview, Browser Preview, and generated LVGL export.

As of 2026-07-30, 42 palette component types satisfy that contract. Every other
palette type is present in `forgeAIIntentionalExclusions` with an explicit
reason. Most exclusions are Chakra/composite editor elements without a
dedicated Standard LVGL contract. `Lottie` and `Spinner` are specifically
excluded because their browser preview has no generated LVGL exporter path.
System-owned WiFi Manager and Storage Browser pages are not palette components;
they remain generated system features rather than AI-placeable widgets.

The catalogue records canonical type, aliases, category, defaults, supported
properties, default size, preview/export capability, and asset requirements.
Generated layouts always save canonical Studio type names. The parser merges
shared preview defaults, clamps geometry, normalizes common value/range
properties, and rejects unknown types.

Project assets are prompt context, not names the model may invent. Uploaded
images and Interactive assets are supplied by their registries with exact IDs
and export-readiness. Asset-backed components may only reference matching
available assets. Icons continue to use exact names returned by the ForgeUI icon
search.

`ForgeAIAllAssetsCoverage.ts` provides the developer-only **All Assets
Coverage** fixture. It lays out each AI-visible component exactly once across
multiple flat 1024x600 documents, matching the current one-screen, top-level AI
document architecture. It also contains representative form, dashboard, and
navigation layouts. Nested parent relationships are intentionally not claimed:
the current AI insertion format is flat and inserts components under root.

The focused catalogue test is the regression guardrail. It fails when a palette
component is neither catalogued nor explicitly excluded, when aliases conflict,
or when All Assets Coverage no longer contains every AI-visible component
exactly once.

## Prompt Builder coverage

The Layout Prompt Builder derives its grouped component choices from the same
42-entry catalogue. Every AI-visible type appears exactly once under Text,
Inputs, Selection Controls, Indicators, Charts, Containers, Navigation, Tables,
Runtime Components, or Interactive Assets. Build Prompt writes every selected
canonical type into the natural-language request, which then follows the normal
AI context, API, parser, and insertion path.

The **All Components Test** action selects every currently usable catalogue entry and asks
for one instance of each in a compact categorized dashboard. Uploaded images
and Interactive components are selectable only when their matching
export-ready project assets exist. Their exact registry IDs are written into the
prompt; missing asset-backed choices remain disabled rather than receiving
fabricated IDs.

## Purpose-aware composition and geometry repair

The catalogue answers what ForgeUI can create; the user request determines what
belongs on the current screen. The layout system prompt establishes exactly one
landscape screen, a soft component budget, a maximum of two normal large
controls, deliberate Box/Line/Divider composition, one clear Heading, and
internal region planning. Specialist controls such as Keyboard, Calendar,
Msgbox, Tabview, Tileview, ButtonMatrix, and Textarea require matching user
intent rather than appearing because they are in the catalogue.

AI-generated documents pass through `ForgeAILayoutEngine.ts` after parsing and
before canvas insertion. Valid model coordinates are preserved. The repair pass
only clamps unsafe bounds, restores useful minimum sizes, moves colliding
rectangles to the nearest valid position, and performs at most one corrective
pass. Box containment is treated as deliberate background composition rather
than a collision, and structural Boxes are emitted before content so they
remain behind related controls. Lines and Dividers cannot overlap interactive
controls.

The quality score checks collision count, clipping, outer margins, heading
visibility, large-control readability, and excessive empty space. All Components
Test is explicitly labelled as a component coverage test rather than a normal
interface. It has an isolated adaptive coverage layout that preserves every
selected type once without being used to tune ordinary screen design. The
current serialized AI document remains one flat screen; no implicit pages,
scrolling, or hidden panels are introduced.

## Layout Designer relationship

The authoritative catalogue remains the boundary for what AI may select. In
Dashboard template mode, AI Fill chooses canonical supported components,
content, props, and semantic regions; the Layout Designer creates the
deterministic structure and owns final geometry. Ordinary free-coordinate
generation remains available for compatibility. Both routes produce normal
editable ForgeUI components and use the existing Canvas, save/reload, Browser
Preview, validation, and LVGL export paths.
