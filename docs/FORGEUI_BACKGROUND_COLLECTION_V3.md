# ForgeUI Background Collection V3

ForgeUI Background Collection V3 adds 52 premium technology backgrounds at
exactly 1024 x 600 pixels. The collection includes six coordinated assets in
each core set—Cyber Blue, Cyber Purple, Cyber Cyan, Emerald Tech, Amber Energy,
Crimson Core, Arctic Light, and Pastel Future—plus four additional Lighter Tech
variants.

V3 uses abstract routing channels, signal ribbons, partial HUD arcs, sparse node
networks, technical meshes, layered glass geometry, and restrained edge glow.
Central card-placement regions remain deliberately calm.

## Architecture and export

V3 extends the existing `ForgeUIAssetRegistry` and Theme Manager category
filters. It introduces no new component, renderer, persistence format, firmware
background system, or export path.

Selecting a bundled background applies its PNG immediately in Browser Preview.
The existing Image Pipeline then prepares that selected asset for the shared
Live Studio and Standalone Export path. Unselected bundled assets are not
converted or included in firmware output.

## Memory

Each decoded 1024 x 600 RGB565 background requires approximately 1,228,800
bytes before LVGL and display-buffer overhead. V3 adds no animation buffers,
procedural glow, or runtime geometry. Firmware flash cost depends on the selected
asset and converter output; the complete collection is never embedded by
default.
