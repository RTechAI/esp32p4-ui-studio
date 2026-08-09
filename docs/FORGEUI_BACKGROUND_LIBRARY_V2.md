# ForgeUI Background Library V2

ForgeUI Background Library V2 contains 40 professional dashboard backgrounds,
with five assets in each of these categories: Dark, Pastel, Coloured Dark,
Technical, Swirl, Gradient, Texture, and Light.

Every V2 PNG is exactly 1024 x 600 pixels and is stored under
`studio/public/assets/backgrounds/forgeui-v2`. The assets are typed entries in
the existing `ForgeUIAssetRegistry`; they are not a new component or runtime
background system.

## Selection and export

The Theme Manager displays the bundled PNG immediately in Browser Preview. On
first selection, it sends that one image through the existing ForgeUI Image
Pipeline and records the resulting ordinary uploaded asset. Live Studio and
Standalone Export therefore receive the same selected LVGL image source used by
the established hero-background export path.

Only the current selected background source is added to an export payload.
Browsing or filtering the library does not convert or include its images, and
the complete library is never embedded automatically into a firmware project.

Weather 04 is a dependency-driven multi-background use case, not a change to this rule: it includes only its ten runtime-reachable semantic backgrounds, never the complete seventeen-image Weather pack. See [ForgeUI Weather Background Pack](FORGEUI_WEATHER_BACKGROUND_PACK.md).

## Memory considerations

A full-screen 1024 x 600 image decoded as RGB565 requires approximately
1,228,800 bytes before LVGL and display-buffer overhead. Actual flash/binary
cost depends on the converter output and target colour format. The collection
uses static images only: it introduces no procedural effects, animation buffers,
or additional runtime rendering path.

For constrained projects, prefer a simple low-noise background and confirm the
generated firmware partition and PSRAM headroom after selecting it.
