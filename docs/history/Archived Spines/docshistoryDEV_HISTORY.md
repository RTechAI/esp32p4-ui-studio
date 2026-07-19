============================================================
CURRENT ACTIVE BASELINE
============================================================

Project:
ESP32-P4 UI Studio

Previous/internal branding:
ForgeUI Studio

Current root path:
C:\ForgeUI\Projects\esp32p4-ui-studio

Current repo name:
esp32p4-ui-studio

Status:
ALIVE / MONOREPO RESTRUCTURE PROVEN / HARDWARE PIPELINE PROVEN

Current active milestone:
ESP32P4_UI_STUDIO_MONOREPO_RESTRUCTURE_PIPELINE_ALIVE__2026-05-25

Meaning:
ESP32-P4 UI Studio has now been restructured from the older ForgeUI-Studio/openchakra/ForgeUI-One layout into a cleaner monorepo architecture.

The project now behaves as one product workspace with separate internal engines:
- Studio editor side
- firmware runtime side
- tooling/orchestration side

This restructure has been tested with:
- full clean
- rebuild
- export
- flash
- physical ESP32-P4 hardware confirmation

============================================================
CURRENT CLEAN MONOREPO STRUCTURE
============================================================

esp32p4-ui-studio/
├── studio/
├── firmware/
│   └── ForgeUI-One/
├── tools/
├── START_FORGEUI_STUDIO.bat
├── README.md
├── LICENSE
├── THIRD_PARTY_LICENSES.md
└── 01_SPINE.md

Meaning:
studio/
- visual editor
- OpenChakra-derived UI designer
- React / Next.js / Chakra side
- LVGL C generator
- local export bridge

firmware/ForgeUI-One/
- ESP-IDF firmware runtime
- LVGL runtime
- BSP/display/touch ownership
- generated UI insertion point
- hardware execution target

tools/
- local orchestration scripts
- build / flash helper scripts
- future clean / flash / monitor scripts

============================================================
CURRENT PROVEN PIPELINE
============================================================

Current working flow:

START_FORGEUI_STUDIO.bat
->
launches Studio dev server
->
launches local export bridge
->
opens localhost:3000

Then:

Studio Export button
->
generates LVGL C
->
writes generated export to firmware/ForgeUI-One/main/90_Studio_Export.c
->
launches tools/flash-p4.bat
->
loads ESP-IDF environment
->
builds firmware
->
flashes ESP32-P4
->
hardware renders generated UI

This has been confirmed after:
- root rename
- folder restructure
- firmware move into /firmware
- fullclean
- rebuild
- flash
- hardware test

============================================================
CURRENT KNOWN-GOOD FILES / PATHS
============================================================

Root:
C:\ForgeUI\Projects\esp32p4-ui-studio

Studio:
C:\ForgeUI\Projects\esp32p4-ui-studio\studio

Firmware runtime:
C:\ForgeUI\Projects\esp32p4-ui-studio\firmware\ForgeUI-One

Tools:
C:\ForgeUI\Projects\esp32p4-ui-studio\tools

Studio launcher:
C:\ForgeUI\Projects\esp32p4-ui-studio\START_FORGEUI_STUDIO.bat

Export bridge:
C:\ForgeUI\Projects\esp32p4-ui-studio\studio\export-server.js

LVGL generator:
C:\ForgeUI\Projects\esp32p4-ui-studio\studio\src\forgeui\ForgeUILvglExport.ts

Flash helper:
C:\ForgeUI\Projects\esp32p4-ui-studio\tools\flash-p4.bat

Generated C output:
C:\ForgeUI\Projects\esp32p4-ui-studio\firmware\ForgeUI-One\main\90_Studio_Export.c

Generated header:
C:\ForgeUI\Projects\esp32p4-ui-studio\firmware\ForgeUI-One\main\90_Studio_Export.h

Runtime insertion point:
C:\ForgeUI\Projects\esp32p4-ui-studio\firmware\ForgeUI-One\main\02_UI_Home.c

============================================================
CURRENT IMPORTANT TRUTHS
============================================================

1.
The current root workspace is NOT the old path:
C:\ForgeUI\Projects\ForgeUI-Studio

The current root workspace IS:
C:\ForgeUI\Projects\esp32p4-ui-studio

2.
The old openchakra folder has been renamed to:
studio

3.
ForgeUI-One has been moved under:
firmware/ForgeUI-One

4.
Nested git repositories were removed from:
studio/.git
firmware/ForgeUI-One/.git

Goal:
One clean monorepo only.

5.
The ESP-IDF extension may still warn:
"No standard ESP-IDF project was found in this workspace."

That is expected because the root is now a monorepo, not the firmware folder itself.

6.
Do not use the default ESP-IDF Build/Flash button until project path integration is cleaned up.

Current known-good flash path is:
tools/flash-p4.bat

7.
COM port failures usually mean stale monitor ownership, not pipeline failure.

Fix:
- close old monitor terminals
- unplug/replug board
- rerun export/flash

============================================================
CURRENT UI / POLISH TODO
============================================================

Before first clean public push:

1.
Rename button:
P4 Export
->
Export UI to Device

2.
Add future action:
Full Clean + Flash Device

3.
Fix right-side inspector yellow header/theme.

4.
Remove or update remaining OpenChakra visible branding where appropriate:
- browser title
- default splash
- top-left legacy text if still present

5.
Keep upstream attribution:
- Premier Octet
- OpenChakra
- MIT License

6.
Clean repo before push:
remove:
- build/
- studio/.next/
- studio/node_modules/
- firmware/ForgeUI-One/build/
- sdkconfig.old
- logs/tmp files

7.
Add / verify root .gitignore.

8.
Commit one clean monorepo baseline.

Suggested commit name:
ESP32P4_UI_STUDIO_CLEAN_MONOREPO_PIPELINE_ALIVE

============================================================
CURRENT PUBLIC POSITIONING
============================================================

Public repo name:
esp32p4-ui-studio

Public description direction:
Embedded LVGL UI Designer and Deployment Toolchain for ESP32-P4 Hardware

Internal product branding may still use:
ForgeUI Studio

Reason:
Repo name is optimized for ESP32-P4 / LVGL / HMI discoverability.
ForgeUI remains the project/product identity.

============================================================
HANDOVER FOR NEXT CHAT
============================================================

Start from:
ESP32P4_UI_STUDIO_MONOREPO_RESTRUCTURE_PIPELINE_ALIVE__2026-05-25

Do not go back to the old ForgeUI-Studio path.

Next chat should:
1. clean README / THIRD_PARTY_LICENSES / ForgeUI-One docs
2. clean .gitignore
3. rename P4 Export button to Export UI to Device
4. fix right inspector yellow theme
5. remove build/node_modules/.next before push
6. commit and push new clean monorepo to GitHub repo:
   RTechAI/esp32p4-ui-studio

============================================================
END CURRENT ACTIVE BASELINE
============================================================

============================================================
FORGEUI STUDIO SPINE
============================================================

Project:
ForgeUI Studio

Base:
OpenChakra

Upstream License:
MIT

Original Upstream Author:
Premier Octet

Primary Goal:
Transform an existing mature visual editor into a
ForgeUI / LVGL / ESP32-P4 visual UI designer.

Status:
ALIVE

Current Stage:
P4 fixed-device viewport architecture proven.
Editor engine mapped far enough to plan embedded/HMI mode safely.

============================================================
NEW SAVE POINT
============================================================

# FORGEUI STUDIO → P4 HARDWARE PIPELINE BREAKTHROUGH

Save point:
FORGEUI_STUDIO_ONE_BUTTON_EXPORT_FLASH_PIPELINE_PROVEN__2026-05-23

Meaning:
ForgeUI Studio has now crossed from a browser/editor proof into a real deployment-capable embedded UI tooling system.

The system can now:
- generate LVGL C
- export directly into ForgeUI-One
- launch ESP-IDF build/flash automatically
- deploy to physical ESP32-P4 hardware from the Studio workflow

This is the first true “Studio → Hardware” deployment pipeline proof.

Status:
MAJOR PRODUCT-LEVEL BREAKTHROUGH / SAVE NOW

---

# MAJOR ARCHITECTURE SHIFT

ForgeUI Studio is no longer behaving like:
- a web UI experiment
- a React playground
- a modified OpenChakra fork

It is now behaving like:
- an embedded HMI toolchain
- a deployment cockpit
- a hardware-aware UI authoring system

The architecture line has now clearly split into:

Studio Side:
- editor
- drag/drop
- property editing
- LVGL code generation
- export orchestration
- flash orchestration

Runtime Side:
- ForgeUI-One
- ESP-IDF
- BSP ownership
- LVGL runtime
- hardware drivers
- ESP32-P4 execution target

This separation is now considered:
CORRECT / PROVEN / REQUIRED

---

# CURRENT PROVEN PIPELINE

ForgeUI Studio
->
ForgeUILvglExport.ts
->
export-server.js
->
generated LVGL C
->
ForgeUI-One
->
ESP-IDF build
->
ESP32-P4 flash
->
live hardware UI

This is no longer theoretical.
Physical hardware proof confirmed.

---

# CURRENT PROVEN USER FLOW

1. Run:
C:\ForgeUI\START_FORGEUI_STUDIO.bat

2. Studio launches:
- React editor
- export bridge
- localhost:3000
- localhost:3030

3. Press:
P4 Export

4. Pipeline now performs:
- generate LVGL C
- write 90_Studio_Export.c
- launch flash-p4.bat
- ESP-IDF build
- flash ESP32-P4
- monitor serial output

5. Physical hardware updates live.

Confirmed proof text rendered on hardware:
- “First flash from studio”

---

# IMPORTANT DISCOVERY

The hardest problem was NOT:
- LVGL
- ESP-IDF
- React
- OpenChakra
- export generation

The hardest problem was:
TOOLCHAIN OWNERSHIP + WORKFLOW ORCHESTRATION

Major confusion source identified:
We were simultaneously:
- developing the Studio
- using the Studio
- building firmware
- flashing hardware

inside overlapping VS Code + terminal sessions.

This caused:
- COM port conflicts
- stale monitor ownership
- ESP-IDF environment confusion
- multiple runtime ownership confusion

This is now understood as:
NORMAL TOOLCHAIN TRANSITION PAIN

---

# IMPORTANT PRODUCT REALIZATION

Future users should NOT need:
- VS Code
- ESP-IDF knowledge
- terminals
- PowerShell
- idf.py commands

Correct future user flow:

Launch Studio
->
Design UI
->
Press Flash
->
Hardware updates

This is now the long-term architecture direction.

---

# CURRENT KNOWN-GOOD FILES

Studio exporter:
C:\ForgeUI\Projects\ForgeUI-Studio\openchakra\src\forgeui\ForgeUILvglExport.ts

Bridge server:
C:\ForgeUI\Projects\ForgeUI-Studio\openchakra\export-server.js

Flash launcher:
C:\ForgeUI\Projects\ForgeUI-Studio\tools\flash-p4.bat

Generated export target:
C:\ForgeUI\Projects\ForgeUI-Studio\ForgeUI-One\main\90_Studio_Export.c

Generated export header:
C:\ForgeUI\Projects\ForgeUI-Studio\ForgeUI-One\main\90_Studio_Export.h

Runtime insertion point:
C:\ForgeUI\Projects\ForgeUI-Studio\ForgeUI-One\main\02_UI_Home.c

One-click Studio launcher:
C:\ForgeUI\START_FORGEUI_STUDIO.bat

---

# CURRENT KNOWN-GOOD FLASH RULE

If flash fails with:
- COM port busy
- PermissionError(13)
- Access denied

Cause is usually:
- stale idf.py monitor
- stale VS Code terminal
- old COM ownership

Fix:
- close old monitor terminals
- unplug/replug device
- rerun export/flash

This is NOT considered a pipeline architecture failure.

---

# IMPORTANT VS CODE REALIZATION

The parent workspace:
C:\ForgeUI\Projects\ForgeUI-Studio

is NOT itself an ESP-IDF project.

ForgeUI-One is the actual ESP-IDF target project.

This means:
- ESP-IDF extension auto-detection becomes confused
- default Build/Flash buttons do not naturally bind correctly
- custom orchestration is currently preferred

This is expected with the current split architecture.

---

# CURRENT LONG-TERM DIRECTION

Do NOT:
- embed React into firmware
- merge OpenChakra into ESP-IDF
- make firmware own Studio logic

Correct direction is:

Studio
generates
LVGL artifacts

ForgeUI-One
executes
hardware runtime

This architecture is now considered:
LOCKED / CORRECT / PRODUCT VIABLE

---

Commit name:

FORGEUI_STUDIO_ONE_BUTTON_P4_PIPELINE_PROVEN

============================================================
END SAVE POINT
============================================================

============================================================
OLD SAVE POINT
============================================================

Save point:
FORGEUI_STUDIO_SPECIAL_PREVIEW_NORMALIZATION_WAVE1__WRAPPER_ARCH_PROVEN__2026-05-21

Meaning:
ForgeUI Studio has now successfully proven the wrapper-owned special preview normalization architecture across multiple component families inside the modified OpenChakra engine.

This marks the transition from:
- isolated resize hacks

to:
- a repeatable renderer ownership model.

The architecture direction is now confirmed as viable.

Status:
MAJOR ARCHITECTURE BREAKTHROUGH / SAVE NOW

============================================================
MAJOR ARCHITECTURE TRUTH PROVEN
============================================================

Correct ownership model:

ComponentPreview
->
PreviewContainer / WithChildrenPreviewContainer
->
special preview content

PreviewContainer owns:
- resize
- resize handles
- helper border
- selection
- hover state
- geometry
- wrapper sizing
- react-rnd integration
- position persistence
- width/height persistence

Special preview files own:
- visual rendering only
- component-specific display logic only
- optional child/drop behavior only

Special preview files should NOT own:
- useInteractive()
- geometry
- positioning
- resize
- helper border
- wrapper sizing
- forgeuiPositionProps()

============================================================
MAJOR DISCOVERY
============================================================

The primary source of broken behavior was NOT:
- OpenChakra core
- Redux
- drag/drop engine
- PreviewContainer
- react-rnd

The real issue source was:

OLD SPECIAL PREVIEW BYPASS ARCHITECTURE

Symptoms identified repeatedly:
- stuck top-left
- helper border detached
- resize handle detached
- full-width stretch
- intrinsic inline collapse
- clipping
- resize ignored

Cause:
special preview files owning geometry internally instead of allowing PreviewContainer to own it.

============================================================
CURRENT KNOWN-GOOD NORMALIZED COMPONENTS
============================================================

Confirmed working:
- Button
- CloseButton
- IconButton
- Icon
- Link
- Alert
- AspectRatio
- AvatarGroup
- Badge
- Box
- Center
- Container
- FormControl (raw component)
- Avatar (acceptable baseline)
- Select (acceptable baseline)
- Kbd
- Radio
- Switch
- multiple intrinsic Chakra controls now normalized successfully

Additional proven architecture truth:
Many Chakra primitives previously treated as "simple components"
were actually intrinsic inline renderers that bypassed proper
wrapper-owned geometry behavior.

The correct normalization pattern is now proven:

- remove component from raw/simple bucket
- move component into explicit normalized case
- wrap using PreviewContainer
- force width/height ownership at wrapper layer
- force full-size render behavior in preview layer
- render children explicitly when required

This pattern is now considered:
SAFE / REPEATABLE / PROVEN

============================================================
CURRENT DEFERRED COMPOUND/PRESET CLEANUP BUCKET
============================================================

Intentionally deferred:
- Breadcrumb preset
- Accordion preset family
- Tabs preset family
- FormControl preset
- Highlight
- Alert child helpers
- AvatarBadge
- FormHelperText
- FormErrorMessage

Important:
Many of these are:
- compound-slot components
- child-only helpers
- intrinsic inline controls
- preset composition layouts

These are NOT core architecture failures anymore.

============================================================
IMPORTANT CLASSIFICATION DISCOVERY
============================================================

ForgeUI Studio components now clearly separate into categories:

------------------------------------------------------------
CATEGORY 1 — Stable Wrapper Components
------------------------------------------------------------

Examples:
- Button
- Badge
- Box
- Center
- Container

These already behave correctly using:
- PreviewContainer
- WithChildrenPreviewContainer

------------------------------------------------------------
CATEGORY 2 — Old Special Preview Bypass Components
------------------------------------------------------------

Examples:
- Alert
- AspectRatio
- Icon
- AvatarGroup
- Link

These required normalization.

Pattern now proven:
- wrap in PreviewContainer
- remove useInteractive from preview
- remove internal geometry ownership
- force width/height 100%
- content-only preview rendering

------------------------------------------------------------
CATEGORY 3 — Tiny Inline Visual Components
------------------------------------------------------------

Examples:
- Checkbox
- FormLabel
- Spinner
- CircularProgress

These are visually small relative to wrapper size.

This is now considered:
- visual scaling behavior

NOT:
- architecture failure

------------------------------------------------------------
CATEGORY 4 — Compound/Preset Layout Systems
------------------------------------------------------------

Examples:
- Breadcrumb
- Accordion
- Tabs
- FormControl preset

These are multi-component layout systems and will need a later dedicated preset/layout architecture pass.

============================================================
CURRENT ACTIVE ARCHITECTURE
============================================================

ComponentPreview
->
PreviewContainer / WithChildrenPreviewContainer
->
special preview renderer

NOT:

special preview
->
own geometry
->
own resize
->
own wrapper

============================================================
CURRENT IMPORTANT RUNTIME FILES
============================================================

Core geometry owner:
- PreviewContainer.tsx

Owns:
- react-rnd
- geometry
- resize persistence
- helper border
- wrapper sizing

Complex child wrapper:
- WithChildrenPreviewContainer.tsx

Owns:
- child-capable layouts
- nested drop regions

Renderer router:
- ComponentPreview.tsx

Now becoming:
- renderer ownership switchboard
- normalization routing layer

============================================================
CURRENT STABLE ABSOLUTE POSITIONING TRUTH
============================================================

Absolute positioning system remains alive and proven.

Current runtime path:
- x/y/w/h props alive
- react-rnd alive
- inspector updates alive
- wrapper persistence alive

Current architecture remains:
- embedded coordinate-based workflow
- fixed-device viewport workflow

============================================================
OLD SAVE POINT
============================================================

Save point:
FORGEUI_STUDIO_TO_FORGEUI_ONE_P4_FLASH_PROOF_OK__2026-05-22

Meaning:
ForgeUI Studio has now proven the first real end-to-end bridge from Studio-side generated/exported LVGL code into the ForgeUI-One ESP32-P4 runtime template.

This is the first confirmed physical hardware proof that ForgeUI Studio can drive a real ForgeUI runtime target.

Status:
MAJOR BREAKTHROUGH / HARDWARE PROOF COMPLETE

Confirmed working:
- ForgeUI-Studio opened as parent workspace
- openchakra remains the Studio/editor side
- ForgeUI-One now lives beside openchakra as the runtime target template
- ForgeUI-One builds from inside the ForgeUI-Studio workspace
- stale copied CMake/build/bootloader cache issue fixed by deleting old build cache
- ForgeUI-One flashes cleanly from:
  C:\ForgeUI\Projects\ForgeUI-Studio\ForgeUI-One
- ESP32-P4 boots successfully
- ForgeUI-One one-page runtime still alive
- 90_Studio_Export.c / .h added as first Studio export bridge
- 02_UI_Home.c calls fg_studio_export_create(parent)
- physical P4 screen displayed:
  "Hello from ForgeUI Studio"

Architecture now proven:

ForgeUI Studio
->
generated/exported LVGL C bridge
->
ForgeUI-One runtime template
->
ESP-IDF build
->
ESP32-P4 flash
->
live LVGL object on hardware

Important correction:
Do NOT embed React into firmware.
Do NOT turn ForgeUI-One into a React runtime.
Do NOT tangle OpenChakra directly into ESP-IDF.

Correct ownership:
- ForgeUI Studio = editor / exporter / flasher / tool cockpit
- ForgeUI-One = runtime firmware template / BSP owner / LVGL hardware target
- 90_Studio_Export.c = generated bridge file owned by Studio export path

Current folder structure:

C:\ForgeUI\Projects\ForgeUI-Studio\
  openchakra\
  ForgeUI-One\

Current build / flash proof commands:

cd C:\ForgeUI\Projects\ForgeUI-Studio\ForgeUI-One
idf.py build
idf.py flash monitor

Important implementation note:
VS Code ESP-IDF buttons may not attach automatically because the root workspace is ForgeUI-Studio, not ForgeUI-One.
PowerShell build/flash is the known-good path for now.

Next mission:
Replace the hand-written 90_Studio_Export.c proof with a Studio-generated export file.

Next practical step:
Make ForgeUI Studio export one simple generated LVGL screen/card/label into:

ForgeUI-One/main/90_Studio_Export.c
ForgeUI-One/main/90_Studio_Export.h

Then build and flash again.

Goal:
Studio button/export action writes the file, then PowerShell or future Studio command builds/flashes it.

============================================================
END SAVE UPDATE
============================================================

============================================================
NEW SAVE POINT
============================================================

Save point:
FORGEUI_STUDIO_TO_HARDWARE_TEXT_STYLE_EXPORT_OK__2026-05-23

Meaning:
ForgeUI Studio has successfully exported generated LVGL C directly into ForgeUI-One through the localhost bridge, ForgeUI-One compiled/flashed the generated screen to ESP32-P4, and live runtime rendering on real hardware was visually confirmed.

This is now the first proven end-to-end Studio-to-hardware toolchain with generated styling applied.

Status:
MAJOR MILESTONE / REAL HARDWARE PIPELINE PROVEN

Confirmed working:
- one-click BAT launcher starts Studio + Bridge
- ForgeUI Studio dev server runs on localhost:3000
- export bridge runs on localhost:3030
- P4 Export button generates LVGL C
- generated LVGL C writes into ForgeUI-One
- ForgeUI-One builds with ESP-IDF
- ForgeUI-One flashes to ESP32-P4
- ESP32-P4 renders the generated UI on the physical screen
- generated Text now exports readable white text styling
- generated font sizing path started through LVGL font export

Current proven runtime display:
- ForgeUI One
- "It’s a good day to code"
- Sat 23
- 09:28

Important correction:
The dark/unreadable text issue was not a hardware/display issue.
It was an export styling issue.

Fix applied in:
src/forgeui/ForgeUILvglExport.ts

Text export now emits:
lv_obj_set_style_text_color(label, lv_color_hex(0xFFFFFF), 0);

This proves generated styling can flow from Studio exporter into real LVGL runtime.

============================================================
CURRENT KNOWN-GOOD FOLDERS / FILES
============================================================

Parent workspace:
C:\ForgeUI\Projects\ForgeUI-Studio\

Studio editor:
C:\ForgeUI\Projects\ForgeUI-Studio\openchakra\

ForgeUI runtime target:
C:\ForgeUI\Projects\ForgeUI-Studio\ForgeUI-One\

Main Studio exporter:
C:\ForgeUI\Projects\ForgeUI-Studio\openchakra\src\forgeui\ForgeUILvglExport.ts

Local export bridge:
C:\ForgeUI\Projects\ForgeUI-Studio\openchakra\export-server.js

Generated C output:
C:\ForgeUI\Projects\ForgeUI-Studio\ForgeUI-One\main\90_Studio_Export.c

Generated header:
C:\ForgeUI\Projects\ForgeUI-Studio\ForgeUI-One\main\90_Studio_Export.h

Runtime insertion point:
C:\ForgeUI\Projects\ForgeUI-Studio\ForgeUI-One\main\02_UI_Home.c

One-click launcher:
C:\ForgeUI\START_FORGEUI_STUDIO.bat

============================================================
CURRENT ONE-CLICK LAUNCHER
============================================================

File:
C:\ForgeUI\START_FORGEUI_STUDIO.bat

Current working content:

@echo off

cd /d C:\ForgeUI\Projects\ForgeUI-Studio\openchakra
start "ForgeUI Studio" powershell -NoExit -Command "npm run dev"

timeout /t 2 >nul

cd /d C:\ForgeUI\Projects\ForgeUI-Studio\openchakra
start "ForgeUI Bridge" powershell -NoExit -Command "node export-server.js"

timeout /t 2 >nul

start "" "http://localhost:3000"

Notes:
- No pause line.
- Bridge file is export-server.js, not server.js.
- export-server.js lives inside openchakra.
- If bridge fails, check PowerShell path first.

============================================================
CURRENT BUILD / FLASH COMMANDS
============================================================

Run from:

cd C:\ForgeUI\Projects\ForgeUI-Studio\ForgeUI-One

Build:

idf.py build

Flash and monitor:

idf.py flash monitor

Fast combined command:

idf.py build flash monitor

If COM port is needed:

idf.py -p COMx flash monitor

============================================================
CURRENT EXPORT PIPELINE TRUTH
============================================================

ForgeUI Studio
->
src/forgeui/ForgeUILvglExport.ts
->
localhost bridge:
http://localhost:3030/export
->
openchakra/export-server.js
->
ForgeUI-One/main/90_Studio_Export.c
->
ForgeUI-One ESP-IDF build
->
ESP32-P4 flash
->
live LVGL render on hardware

This is no longer theoretical.
This has been physically proven.

============================================================
CURRENT NEXT MILESTONE
============================================================

Next export upgrades should be:

1. export background colours
2. export box colours
3. export radius
4. export button colours
5. export font sizes cleanly
6. export alignment helpers
7. export images/icons
8. export nested layouts safely

Do not drift into React runtime.
Do not embed Studio into firmware.
Studio generates LVGL artifacts.
ForgeUI-One owns hardware runtime.

============================================================
END SAVE UPDATE
============================================================



============================================================
EXPORT PIPELINE TRUTH — NOW PROVEN
============================================================

ForgeUI Studio is no longer only generating preview code.

The project has now proven a live editor-to-firmware bridge.

Current proven export/runtime flow:

ForgeUI Studio
(editor/runtime preview)
->
LVGL C generator
->
localhost export bridge (:3030)
->
writes generated output into:
ForgeUI-One/main/90_Studio_Export.c
->
ForgeUI-One ESP-IDF build
->
ESP32-P4 flash
->
live LVGL runtime on hardware

This is now the PRIMARY architecture direction.

============================================================
IMPORTANT OWNERSHIP RULE
============================================================

ForgeUI Studio does NOT own:
- BSP
- display drivers
- touch drivers
- WiFi
- SD
- audio
- runtime loop
- LVGL runtime lifecycle

ForgeUI-One owns:
- ESP-IDF runtime
- BSP
- hardware bring-up
- LVGL lifecycle
- display/touch/audio/WiFi/SD
- runtime task ownership
- application shell

ForgeUI Studio owns:
- editor
- viewport
- component layout
- property editing
- export generation
- future flashing/tooling workflow

Generated export files are:
- build artifacts
- replaceable/generated outputs
- not hand-owned runtime architecture files

============================================================
CURRENT GENERATED FILE CONTRACT
============================================================

Current generated bridge files:

90_Studio_Export.c
90_Studio_Export.h

Current runtime integration:

02_UI_Home.c
->
fg_studio_export_create(parent)

This establishes the first stable runtime insertion point.

============================================================
IMPORTANT STRATEGIC DIRECTION
============================================================

ForgeUI-One should remain:
- simple
- stable
- hardware-owned
- runtime-owned

Studio should inject:
- generated screens
- generated widgets
- generated layouts

NOT:
- editor runtime logic
- React runtime
- browser runtime
- web renderer

Correct long-term architecture:

ForgeUI Studio
->
generated LVGL artifacts
->
ForgeUI runtime templates
->
embedded hardware targets

============================================================
CURRENT KNOWN-GOOD EXPORT PATH
============================================================

Studio dev server:
npm run dev

Export bridge server:
node export-server.js

Current export endpoint:
http://localhost:3030/export

Current export proof:
P4 Export button successfully writes generated LVGL C into:

ForgeUI-One/main/90_Studio_Export.c

============================================================
NEXT MILESTONE
============================================================

Next export evolution goals:

- multiple objects
- boxes
- buttons
- colors/styles
- width/height export
- x/y coordinate export
- generated layout trees
- multiple pages/screens
- future LVGL component mapping

Current export proof is:
FOUNDATIONAL / REAL / MAJOR

============================================================
PROJECT LOCATION
============================================================

Current project path:

C:\ForgeUI\Projects\ForgeUI-Studio\openchakra

============================================================
DEV SERVER
============================================================

Run using:

npm run dev

Then open:

http://localhost:3000

============================================================
IMPORTANT INSTALL NOTE
============================================================

Install required:

npm install --legacy-peer-deps

Normal npm install produced dependency conflicts.

Current workaround is acceptable.

============================================================
PROJECT DIRECTION
============================================================

ForgeUI Studio is NOT intended to become another generic web-page builder.

The intended direction is:

ForgeUI Studio
->
ESP32-P4 UI designer
->
LVGL layout designer
->
future LVGL export/code generation system

The editor should eventually allow:

- drag/drop embedded widgets
- fixed-screen HMI layout design
- LVGL-style screen/page design
- ForgeUI component design
- device viewport presets
- screen/page management
- export toward embedded targets

Primary hardware focus:

ESP32-P4
LVGL
Waveshare ESP32-P4 boards

Current active board target:

Waveshare ESP32-P4 7B 1024x600

Critical design rule:
Do NOT drift back into generic website-builder thinking.

ForgeUI Studio should behave more like:

- LVGL designer
- embedded HMI editor
- kiosk/dashboard editor
- industrial touchscreen designer

NOT:
- normal website builder
- responsive web-page editor
- mobile/desktop breakpoint builder

============================================================
IMPORTANT PROJECT TRUTH
============================================================

The project is NO LONGER:

"build editor from scratch"

The project IS NOW:

adapt a mature existing editor engine

This dramatically reduces complexity and risk.

OpenChakra already provides:

- drag/drop
- selection
- hover state
- inspector panel
- component previews
- component tree/state model
- undo/redo hooks
- code export pipeline
- layout system
- React rendering system
- Redux/Rematch state management
- split code panel
- persistence/local storage direction

ForgeUI Studio should build ON TOP of this,
not rewrite the engine.

============================================================
LICENSE / IP STATUS
============================================================

Base project:
OpenChakra

Original author:
Premier Octet

License:
MIT

This allows:

- use
- modification
- commercialization
- redistribution
- forking
- rebranding

Requirement:
Original MIT copyright/license notice must remain.

Do NOT:

- remove upstream MIT license
- pretend original engine was authored from scratch
- hide upstream attribution

Future recommendation:

- keep original LICENSE
- add THIRD_PARTY_LICENSES.md
- clearly separate ForgeUI-owned logic from upstream code
- keep ForgeUI-specific additions mostly under src/forgeui/
- document modified upstream areas

============================================================
FORGEUI-SPECIFIC WORK COMPLETED
============================================================

------------------------------------------------------------
1. Branding pass
------------------------------------------------------------

Header now shows:

ForgeUI Studio

Browser title partially updated.

Engine left untouched.

------------------------------------------------------------
2. ForgeUI workbench theme
------------------------------------------------------------

Editor.tsx updated with:

- dark navy workbench
- cyan grid lines
- embedded UI designer feel
- centered device screen
- isolated viewport frame

This replaced the default light OpenChakra canvas look.

------------------------------------------------------------
3. Device abstraction layer
------------------------------------------------------------

New file created:

src/forgeui/ForgeUIDeviceConfig.ts

Purpose:
Single source of truth for device targets.

Current active device:

Waveshare ESP32-P4 7B 1024x600

Important rule:
NO hardcoded device sizes throughout the engine.

ALL viewport sizing should come from:

FORGEUI_ACTIVE_DEVICE

------------------------------------------------------------
4. Device config expanded
------------------------------------------------------------

Device config should include:

- id
- name
- width
- height
- gridSize

Current intended config direction:

export type ForgeUIDeviceTarget = {
  id: string
  name: string
  width: number
  height: number
  gridSize: number
}

Current active device ID:

waveshare-p4-7b-1024x600

Also keep a generic fallback target such as:

generic-800x600

------------------------------------------------------------
5. P4 viewport implemented
------------------------------------------------------------

Editor.tsx now renders:

outer workbench
->
centered device frame
->
active root drop target
->
rendered components

Current viewport:

1024x600
centered
rounded
subtle glow/shadow
embedded-dashboard aesthetic

Important architecture truth:

Correct structure is:

outer workbench
->
inner device viewport
->
drop target + rendered components

NOT:

infinite fullscreen canvas.

------------------------------------------------------------
6. Grid now follows device config
------------------------------------------------------------

Editor grid now uses:

FORGEUI_ACTIVE_DEVICE.gridSize

via:

const GRID_SIZE = FORGEUI_ACTIVE_DEVICE.gridSize

and:

backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`

This avoids hardcoding 20px grid values inside the editor.

------------------------------------------------------------
7. Viewport sizing lock added
------------------------------------------------------------

Inner device Box should apply deviceProps before the locked dimensions.

Correct order:

{...deviceProps}
ref={drop}
width={FORGEUI_ACTIVE_DEVICE.width}
height={FORGEUI_ACTIVE_DEVICE.height}
minWidth={FORGEUI_ACTIVE_DEVICE.width}
minHeight={FORGEUI_ACTIVE_DEVICE.height}
maxWidth={FORGEUI_ACTIVE_DEVICE.width}
maxHeight={FORGEUI_ACTIVE_DEVICE.height}

Reason:
components.root.props must NOT be allowed to accidentally override the active hardware viewport size.

============================================================
CURRENT ACTIVE DEVICE CONFIG
============================================================

Current config file:

src/forgeui/ForgeUIDeviceConfig.ts

Current intended structure:

export type ForgeUIDeviceTarget = {
  id: string
  name: string
  width: number
  height: number
  gridSize: number
}

Current intended active target:

id:
waveshare-p4-7b-1024x600

name:
Waveshare ESP32-P4 7B 1024x600

width:
1024

height:
600

gridSize:
20

Future expansion planned:

- 800x480
- 800x600
- 1024x600
- portrait targets
- square screens
- future ESP32-S3 targets
- future ESP32-P4 targets
- simulator/browser targets

Future device profile fields may include:

- rotation
- safeArea
- lvgl.hor_res
- lvgl.ver_res
- lvgl color depth
- previewScale
- exportProfile

============================================================
CURRENT ARCHITECTURE DISCOVERIES
============================================================

The project architecture is cleaner than expected.

Important runtime ownership:

src/components/editor/Editor.tsx
owns:
- workbench
- canvas/playground
- device viewport
- root drop target placement

src/forgeui/ForgeUIDeviceConfig.ts
owns:
- hardware target truth
- viewport size truth
- grid size truth
- future export target truth

src/components/editor/ComponentPreview.tsx
owns:
- component preview routing
- type switch
- render dispatcher

src/components/editor/PreviewContainer.tsx
owns:
- simple component preview wrapper
- useInteractive connection

src/components/editor/WithChildrenPreviewContainer.tsx
likely owns:
- child-capable component preview wrapper
- nested drop behavior
- visual helper behavior

src/components/editor/previews/
owns:
- specific complex widget previews

src/hooks/useInteractive.ts
owns:
- selection
- hover
- double-click text edit trigger
- drag source
- visual helper borders/shadows

src/hooks/useDropComponent.ts
owns:
- drop target logic
- add component
- move component
- add meta component

src/hooks/useForm.ts
owns:
- inspector/property update pipe

src/core/models/components.ts
owns:
- editor component state
- addComponent
- moveComponent
- updateProps
- deleteProps
- select
- hover
- duplicate
- delete

src/core/models/composer/composer.ts
owns:
- composer node creation helper
- generated component IDs
- default props injection

src/components/inspector/controls/NumberControl.tsx
owns:
- reusable numeric prop editor

src/components/inspector/CustomPropsPanel.tsx
owns:
- manual custom prop entry/edit/delete

============================================================
CURRENT ENGINE TRUTH
============================================================

Current editor state model is tree/layout based.

State shape is effectively:

component:
- id
- type
- parent
- children[]
- props
- rootParentType

This means OpenChakra is currently:

React/Chakra layout composer

NOT YET:

absolute-position embedded HMI designer

This is acceptable for now.

Reason:
The state system is props-driven and clean enough to extend.

============================================================
CRITICAL ARCHITECTURE FINDING
============================================================

The editor already stores component settings in:

component.props

The inspector writes through:

Inspector Control
->
useForm()
->
dispatch.components.updateProps()
->
component.props[name] = value

This means future embedded layout properties can be added without rewriting the state engine.

Future props can include:

x
y
w
h
positionMode

Example:

props: {
  x: 120,
  y: 60,
  w: 300,
  h: 120,
  positionMode: "absolute"
}

This is a major win.

============================================================
COMPONENT PREVIEW ARCHITECTURE
============================================================

ComponentPreview.tsx uses a type switch.

This is a major ForgeUI opportunity.

Current pattern:

switch (type)

Current Chakra routing:

type={Chakra[type]}

This means current runtime preview is React/Chakra based.

Future ForgeUI-native components can be added cleanly as new cases.

Future examples:

FGButton
FGTile
FGLabel
FGGauge
FGStatusTile
FGTopBar
FGSidebar
FGTelemetryCard
FGMapCard
FGPreOpCard
FGGpsRibbon

Critical rule:
Chakra should eventually become preview/runtime convenience only.

Long-term architecture should separate:

ForgeUI Component Definition
->
Editor State
->
Preview Renderer
->
Export Renderer

============================================================
RENDERER SPLIT RULE
============================================================

Current:

Editor State
->
React/Chakra Preview

Future:

Editor State
->
ForgeUI Component Definition
->
React/Chakra Preview Renderer
->
LVGL C Export Renderer

Important:
Do NOT let Chakra-specific assumptions pollute the future LVGL export model.

============================================================
DRAG/DROP DISCOVERY
============================================================

Current drag/drop model:

useInteractive:
- makes components draggable
- item includes id, type, isMoved

useDropComponent:
- accepts drops
- if moved: moveComponent(parentId, componentId)
- if meta: addMetaComponent(...)
- else: addComponent(parentName, type, rootParentType)

Current drop model does NOT yet store:

- x position
- y position
- width
- height
- device coordinates

It only adds or moves components inside a parent tree.

This means:
ForgeUI Studio is not yet coordinate-based.

Do not panic.
Do not rewrite it yet.

Correct next direction:
add optional embedded/HMI coordinate mode later.

============================================================
INSPECTOR DISCOVERY
============================================================

useForm.ts confirms all inspector controls write to selected component props.

NumberControl.tsx confirms a reusable numeric editor already exists.

This means future ForgeUI Studio can add a Position/Layout panel using existing controls.

Future PositionPanel idea:

NumberControl name="x" label="X"
NumberControl name="y" label="Y"
NumberControl name="w" label="Width"
NumberControl name="h" label="Height"

This is likely the safest path to add embedded layout editing.

============================================================
IMPORTANT STRATEGIC DECISION
============================================================

ForgeUI Studio has two possible futures:

OPTION A:
Layout Builder

- Chakra/Flex/Grid driven
- responsive-ish
- easier
- more React-like
- less LVGL accurate

OPTION B:
Embedded HMI Designer

- fixed screen
- x/y coordinates
- draggable widgets
- real screen bounds
- closer to LVGL
- closer to industrial HMI tools
- better for ESP32-P4

Decision:
OPTION B is the correct long-term direction.

But:
Do NOT rewrite the engine now.

Correct path:
Add optional embedded positioning mode beside the current layout model.

============================================================
PHASED DEVELOPMENT PLAN
============================================================

------------------------------------------------------------
PHASE 1 — Stabilize current editor shell
------------------------------------------------------------

Keep current architecture alive.

Current goals:
- stable ForgeUI branding
- fixed device viewport
- device config
- grid from config
- root viewport lock
- no broken drag/drop
- no broken inspector

Status:
Mostly achieved.

------------------------------------------------------------
PHASE 2 — Map remaining engine
------------------------------------------------------------

Still inspect:

WithChildrenPreviewContainer.tsx
property panel wrapper
sidebar component list / registry
export/code generation path
template system
undo/local persistence path

Do not modify heavily yet.

------------------------------------------------------------
PHASE 3 — Add ForgeUI embedded layout props
------------------------------------------------------------

Add optional props:

x
y
w
h
positionMode

Do this safely through props, not by rewriting state.

Possible new file:

src/components/inspector/panels/ForgeUILayoutPanel.tsx

or:

src/forgeui/ForgeUILayoutPanel.tsx

------------------------------------------------------------
PHASE 4 — Add embedded preview wrapper
------------------------------------------------------------

Preview wrappers should eventually support:

positionMode === "absolute"

by rendering:

position: absolute
left: x
top: y
width: w
height: h

inside the fixed viewport.

Flow layout can still exist for legacy Chakra mode.

------------------------------------------------------------
PHASE 5 — Add proper drop coordinates
------------------------------------------------------------

useDropComponent can later read monitor offsets and convert to viewport-local x/y.

Needed later:
- root viewport ref
- client offset
- viewport bounding rect
- grid snap
- bounds clamp

Do NOT do this until Phase 3/4 are stable.

------------------------------------------------------------
PHASE 6 — Add ForgeUI-native widgets
------------------------------------------------------------

Create ForgeUI components such as:

FGTile
FGButton
FGLabel
FGGauge
FGStatusCard
FGTelemetryCard

Add to:
- sidebar registry
- ComponentPreview switch
- default props
- future LVGL export map

------------------------------------------------------------
PHASE 7 — Add LVGL export path
------------------------------------------------------------

Long-term export output examples:

lv_obj_t * tile = lv_obj_create(parent);
lv_obj_set_pos(tile, 120, 60);
lv_obj_set_size(tile, 300, 120);
lv_obj_set_style_bg_color(tile, lv_color_hex(0x101826), 0);

Do NOT attempt export rewrite yet.

============================================================
CURRENT NEXT STEPS
============================================================

Immediate next files to inspect:

1.
WithChildrenPreviewContainer.tsx

Reason:
Likely owns nested drop target behavior and child rendering.

2.
Main inspector/property panel wrapper

Reason:
Need to know where to insert future ForgeUI layout panel.

3.
Sidebar/component registry

Reason:
Need to know where ForgeUI components will appear.

4.
Export/code generation path

Reason:
Need to understand future LVGL export insertion point.

5.
templates/default props

Reason:
Need to understand where default component props are born.

============================================================
CURRENT DEVELOPMENT RULES
============================================================

Do NOT rewrite the editor engine.

Do NOT hardcode device sizes everywhere.

Do NOT randomly modify Redux/state internals.

Do NOT start LVGL export yet.

Do NOT start absolute drag/drop yet.

Do NOT break existing Chakra drag/drop while exploring.

Build ForgeUI-specific logic in:

src/forgeui/

Where upstream files must be modified:
- keep changes small
- document them
- avoid hiding original attribution

Keep:
- upstream engine
- ForgeUI layer
- future export layer

cleanly separated.

Small safe changes only.

No giant uncontrolled rewrites.

Maintain stable revert points frequently.

============================================================
CURRENT ASSESSMENT
============================================================

This is the first ForgeUI Studio direction that appears:

- technically viable
- scalable
- maintainable
- realistic
- not insane to build alone
- not a blank-page editor nightmare

The current direction is GOOD.

The project now has a credible path:

OpenChakra engine
->
ForgeUI fixed viewport workbench
->
ForgeUI component set
->
embedded coordinate mode
->
LVGL export generator

============================================================
END OF SPINE
============================================================