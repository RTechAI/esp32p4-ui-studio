# ForgeUI Layout Designer

## Architecture

The initial complete vertical slice is Dashboard. It creates ordinary root-level
ForgeUI components and adds optional metadata to their existing `props`.
Projects without this metadata load unchanged.

AI Fill decides what supported content belongs in each semantic region. The
Layout Designer owns the structural template and final geometry. The result is
made from normal editable ForgeUI components and continues through the existing
save/reload, preview, and export pipeline; there is no parallel image-only or
non-exportable layout document.

Smart-region Boxes use stable logical keys such as `dashboard.main`.
Components assigned to a region store `layoutRegionId` with that key. The
reference is independent of generated component IDs, so ordinary save/reload,
copy, duplication, Browser Preview, and LVGL export continue to use the existing
component serialization.

Supported metadata includes region role, label, padding, horizontal and vertical
gaps, arrangement, columns, rows, minimum child size, ordering, structural lock,
semantic surface/border roles, radius, border width, and opacity.

Legacy free-coordinate AI generation remains available. Dashboard template mode
uses the region-composer response contract: AI selects canonical content and
assigns it to `header`, `status`, `main`, `controls`, or `footer`; Studio creates
the structural components and owns all geometry.

## Dashboard template

The deterministic 1024×600 structure contains:

- `dashboard.header`
- `dashboard.status`
- `dashboard.main`
- `dashboard.controls`
- `dashboard.footer`
- one structural Divider
- one editable Heading placeholder

The Layout Designer preview and Apply Dashboard action work without AI.
All regions are normal editable Boxes. Semantic `surface` and
`surfaceSecondary` roles resolve through the active theme in Canvas, Browser
Preview, and generated LVGL.

## Inspector and Auto Arrange

Selecting a smart Box exposes arrangement, padding, columns, horizontal gap,
vertical gap, structural lock, and Auto Arrange Region. Selecting another
component exposes an Assigned region selector.

Auto Arrange supports vertical, horizontal, grid, KPI cards, button stack, form
rows, even distribution, and fit-to-region. It changes only absolute geometry.
Preferred catalogue sizes, minimum touch sizes, square controls, and full-width
controls influence the result.

## AI Fill Dashboard

AI Fill Dashboard places a template marker in the normal AI prompt. The model
returns title and canonical components grouped by named region without pixel
geometry. Studio validates and flattens that response, creates the Dashboard
template, assigns stable region references, auto-arranges each region, and
inserts the resulting real components through the existing Canvas insertion
path.

## Manual check

1. Start Studio and open the AI Playground Layout tab.
2. In Layout Designer, choose Dashboard and inspect the five-region preview.
3. Click **Apply Dashboard**.
4. Close the Playground and select each region Box on Canvas.
5. In Inspector, change padding, gaps, columns, or arrangement.
6. Assign a dropped component using Inspector → Layout Region.
7. Select its region and click **Auto Arrange Region**.
8. Move or resize the region and run Auto Arrange again.
9. Save and reopen the project; confirm region settings and assignments remain.
10. Open Browser Preview and confirm the same five themed panels and content.
11. Export LVGL and confirm the region Boxes remain normal `lv_obj` objects.
12. For AI content, reopen Layout Designer, click **AI Fill Dashboard**, edit
    the generated request if desired, and click **Generate Layout**.

The manually observed AI Fill result produced a clear Header, grouped Status
panel, large central Chart, vertical control-button area, and Footer status area
in one coherent 1024×600 composition. Browser Preview rendered the same
region-based result. This is a substantial improvement over unrestricted AI
coordinate placement, not a claim of final physical parity.

## Focused validation

- Layout Designer geometry and Auto Arrange: 6 tests.
- Browser Preview region coverage: 1 test.
- AI region composer: 2 tests.
- Box LVGL export: 9 tests.
- Component-model Auto Arrange reducer: 1 test.
- Layout Designer preview/apply/AI Fill UI workflow: 1 test.
- Total: 20 focused tests passed.

No TypeScript errors were found in the changed Layout Designer path. The
unrelated pre-existing Circular Progress JSX test typing error remains. A full
Studio production build, ESP-IDF build, hardware flash, and physical ESP32-P4
review were not performed for this milestone.

## Current limitations

- Dashboard is the only completed structural template in this vertical slice.
- Region assignment is currently through Inspector; drag-to-assign is not yet
  implemented.
- Region relationships are flat metadata rather than serialized hierarchy.
- Structural lock is stored and editable but does not yet prevent direct Canvas
  movement/resizing.
- AI Fill requires the configured OpenAI service. The observed workflow was
  checked manually; automated tests do not make a live network request.
