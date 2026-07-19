ForgeUI_Generated_Export_API_Permanent_Code_Map_RAW.md


ForgeUI Generated Export API
Permanent Code Map
Purpose

This document is the permanent architectural map for the ForgeUI Generated Export API.

It is not a milestone log, savepoint, roadmap, or development history.

Its purpose is to define the boundary between:

ForgeUI Studio-generated UI code

and:

Developer-owned application code

This document should allow a new development session to immediately understand:

Where generated firmware files are created.
Which files may be regenerated.
Which files belong to the developer.
How Interactive Button hooks are exposed.
How future controls should expose public APIs.
How live firmware export and standalone project export remain aligned.
System Overview
ForgeUI Canvas
        │
        ▼
generateForgeUILvglCode()
        │
        ▼
Generated LVGL Source
        │
        ▼
Export Server
        │
        ├── Live ForgeUI-One Firmware
        │
        └── Standalone ESP-IDF Project
        │
        ▼
Generated UI Files
        │
        ├── 90_Studio_Export.c
        │
        └── 90_Studio_Export.h
        │
        ▼
User Hook Layer
        │
        ├── 95_UserEvents.c
        │
        └── 95_UserEvents.h
        │
        ▼
Developer Application Logic
        │
        ▼
ESP-IDF Build
        │
        ▼
ESP32-P4
1. LVGL Code Generator
Primary File
ForgeUILvglExport.ts
Primary Function
generateForgeUILvglCode()
Owns
LVGL object generation
Widget creation
Image declarations
Asset source collection
Runtime structures
Runtime callbacks
Interactive Button export
Public generated UI functions
Calls into user-owned hooks
Does Not Own
Writing files to disk
ESP-IDF project copying
CMake file writing
Customer application behaviour
Hardware-specific customer logic
2. Component Export Function
Function
buildLvglBlock()
Purpose

Walks the ForgeUI component tree and generates LVGL code for each component.

Inputs
component
components
parentVar
lines
counter
palette
usedAssetSources
Responsibilities
Walk component children
Generate unique LVGL object variables
Read component position and size
Select the correct component export branch
Add required assets to usedAssetSources
Recursively export nested children
3. Generated Object Naming

Current generated LVGL object names use:

const varName = `obj${counter.value}`

Examples:

obj1
obj2
obj3

These names are unique inside one generated export.

They are suitable for internal LVGL object variables.

They should not become the permanent public API presented to developers.

4. Public Code Names

Interactive controls should expose a stable public code name.

Example:

Visible Label:
Start Pump

Code Name:
StartPump

Generated hook:

FG_On_StartPump_Clicked()

The visible label and code name have separate responsibilities.

Visible Label

Used for:

Canvas display
Browser Preview
Button artwork
Human-readable UI text
Code Name

Used for:

Generated C functions
Callback declarations
Public control APIs
Developer integration
GPT-assisted editing after export
Rules
Code names must be valid C identifiers.
Code names must be unique within the exported project.
Visible labels may contain spaces and punctuation.
Changing visible text should not automatically break the public API.
Duplicate code names must be prevented or automatically resolved.
5. Interactive Button Export
Export Branch
case 'InteractiveButton'
Existing Responsibilities
Resolve interactiveAssetId
Resolve Interactive Button asset
Resolve Normal image
Resolve Pressed image
Validate LVGL readiness
Add asset C files
Declare LVGL images
Create LVGL button
Create child LVGL image
Create per-button runtime data
Register press events
Existing Events
LV_EVENT_PRESSED
LV_EVENT_RELEASED
LV_EVENT_PRESS_LOST
Existing Behaviour
Normal Image
        │
        ▼
Button Pressed
        │
        ▼
Pressed Image
        │
        ▼
Button Released
        │
        ▼
Normal Image

The visual-state runtime must remain unchanged when user hooks are added.

6. Interactive Button Runtime Data
Current Structure
typedef struct
{
    const void * normal_src;
    const void * pressed_src;
} fg_interactive_button_data_t;
Hook Extension

The structure may be extended with a callback pointer:

typedef void (*fg_interactive_button_click_cb_t)(void);

typedef struct
{
    const void * normal_src;
    const void * pressed_src;
    fg_interactive_button_click_cb_t clicked_cb;
} fg_interactive_button_data_t;
Purpose

Each exported button carries:

Its Normal image.
Its Pressed image.
Its unique developer callback.
7. Shared Interactive Button Callback
Existing Function
static void fg_interactive_button_event_cb(
    lv_event_t *event
)
Existing Responsibilities
Read event code
Resolve target button
Resolve runtime data
Resolve child image
Swap visual state
Extended Responsibility

Handle:

LV_EVENT_CLICKED

Example:

if (
    code == LV_EVENT_CLICKED &&
    data->clicked_cb
)
{
    data->clicked_cb();
}
Rule

Do not create one LVGL callback implementation per button.

Continue using one shared LVGL callback with per-button runtime data.

8. Button Hook Generation

For each exported Interactive Button, generate one unique hook.

Example buttons:

Start Pump
Stop Pump
Reset Alarm

Generated declarations:

void FG_On_StartPump_Clicked(void);
void FG_On_StopPump_Clicked(void);
void FG_On_ResetAlarm_Clicked(void);

Generated user stubs:

void FG_On_StartPump_Clicked(void)
{
    // Add application behaviour here.
}

void FG_On_StopPump_Clicked(void)
{
    // Add application behaviour here.
}

void FG_On_ResetAlarm_Clicked(void)
{
    // Add application behaviour here.
}
9. Generated UI Files
Files
90_Studio_Export.c
90_Studio_Export.h
Own
LVGL object creation
Generated runtime structures
Generated runtime event callbacks
Generated component instances
Generated public UI functions
Calls into user hooks
Regeneration Rule

These files may be replaced whenever Studio exports.

Developer application logic must not be placed inside them.

10. User Hook Files
Files
95_UserEvents.c
95_UserEvents.h
Own
Button click implementations
Application behaviour
Connections between UI controls
Calls into runtime services
Calls into hardware services
Developer custom code
Preservation Rule

These files must not be overwritten during normal re-export.

11. User Hook Header
File
95_UserEvents.h

Example:

#pragma once

#ifdef __cplusplus
extern "C" {
#endif

void FG_On_StartPump_Clicked(void);
void FG_On_StopPump_Clicked(void);

#ifdef __cplusplus
}
#endif
Purpose

Provides the generated UI with declarations for developer-owned callback implementations.

12. User Hook Source
File
95_UserEvents.c

Example:

#include "95_UserEvents.h"
#include "90_Studio_Export.h"

void FG_On_StartPump_Clicked(void)
{
    // Add application behaviour here.
}

void FG_On_StopPump_Clicked(void)
{
    // Add application behaviour here.
}
Purpose

Provides a safe place for developers or coding assistants to add behaviour after export.

13. Generated Section Headers

Each exported interactive component should include a small usage header.

Example:

//==============================================================
// ForgeUI Interactive Button
//==============================================================
//
// Display Name:
//   Start Pump
//
// Code Name:
//   StartPump
//
// User Hook:
//   FG_On_StartPump_Clicked()
//
// Add application behaviour in:
//   95_UserEvents.c
//
// Do not place application logic in this generated section.
//
//==============================================================
Purpose

Make the exported code self-documenting.

A developer or coding assistant should be able to understand the integration point without external documentation.

14. Export Server
Primary File
export-server.js
Owns
Writing generated files
Regenerating CMake
Live firmware export
Standalone project export
Asset copying
Firmware cleanup
Firmware maintenance
ESP-IDF project packaging
Does Not Own
LVGL component generation
Button hook naming rules
Widget runtime behaviour
Application logic
15. Live Firmware Export
Endpoint
POST /export
Current Responsibilities
Receive generated C source
Receive asset source list
Write 90_Studio_Export.c
Write 90_Studio_Export.h
Regenerate CMakeLists.txt
Include required asset C files
Hook Extension

The endpoint will also need to:

Receive generated hook declarations or metadata.
Create 95_UserEvents.c if it does not exist.
Create 95_UserEvents.h if it does not exist.
Preserve existing user implementations.
Add 95_UserEvents.c to CMake.
Ensure 90_Studio_Export.c can include 95_UserEvents.h.
16. Standalone ESP-IDF Export
Endpoint
POST /export-idf-project
Current Responsibilities
Copy ForgeUI-One baseline
Remove build and development folders
Copy only required uploaded assets
Write generated Studio source
Write generated Studio header
Regenerate project CMake
Create a uniquely named export folder
Hook Extension

Every standalone project should contain:

main/
├── 90_Studio_Export.c
├── 90_Studio_Export.h
├── 95_UserEvents.c
├── 95_UserEvents.h
└── CMakeLists.txt

Because each standalone export is a new project directory, its user stub files may be created fresh.

17. CMake Generation
Current Generated Sources
main.c
01_FG_Runtime.c
20_RTC.c
30_Audio.c
30_WIFI.c
40_SD.c
90_Studio_Export.c
Required Addition
95_UserEvents.c

Example:

idf_component_register(
    SRCS
        "main.c"
        "01_FG_Runtime.c"
        "20_RTC.c"
        "30_Audio.c"
        "30_WIFI.c"
        "40_SD.c"
        "90_Studio_Export.c"
        "95_UserEvents.c"
)
18. Cleanup Behaviour
Clean Firmware

Current generated cleanup replaces:

90_Studio_Export.c
90_Studio_Export.h
CMakeLists.txt
Required Rule

A normal generated-code cleanup should not delete developer-owned user event files.

95_UserEvents.c
95_UserEvents.h

must remain preserved unless the user explicitly requests a destructive reset.

19. Firmware Maintenance

Firmware Maintenance currently removes generated assets and rebuilds the firmware workspace.

The handling of user-owned files must be explicit.

Recommended rule:

Generated assets
        → removable

Generated Studio export
        → replaceable

Build directory
        → removable

User event files
        → preserved

If a future destructive reset removes user files, the UI must clearly warn the user first.

20. Generated Public Output APIs

Buttons create input hooks.

Future generated output controls should expose public functions.

Status Light
void FG_StatusLight_On(void);
void FG_StatusLight_Off(void);
void FG_StatusLight_Toggle(void);
void FG_StatusLight_Set(bool on);
Label
void FG_StatusLabel_SetText(
    const char *text
);
Progress Bar
void FG_Progress_SetValue(
    int value
);
Screen
void FG_Show_SettingsScreen(void);
Image
void FG_WarningIcon_Show(void);
void FG_WarningIcon_Hide(void);
21. Input and Output Contract
Input Controls

Generated UI calls user code.

Button
        ↓
LVGL Event
        ↓
Generated Hook
        ↓
95_UserEvents.c

Examples:

Button clicked
Switch changed
Slider value changed
Input submitted
Dropdown changed
Output Controls

User code calls generated UI APIs.

Application Logic
        ↓
Generated Public Function
        ↓
LVGL Object Update

Examples:

Status Light on/off
Label text update
Progress value update
Screen navigation
Image visibility
22. Application Boundary

ForgeUI owns:

UI structure
Widget creation
Visual behaviour
Public UI API
Callback entry points

Developer code owns:

GPIO
Sensors
Wi-Fi application behaviour
MQTT
BLE
Motors
Relays
Business logic
Device-specific actions

Example:

void FG_On_StartPump_Clicked(void)
{
    pump_start();
    FG_PumpStatusLight_On();
}

ForgeUI does not need to understand how pump_start() works.

23. Re-Export Contract
Generated Files

May be overwritten:

90_Studio_Export.c
90_Studio_Export.h
CMakeLists.txt
User Files

Must be preserved:

95_UserEvents.c
95_UserEvents.h
New Hook Behaviour

When a new button is added, the exporter should add a new declaration and stub without deleting existing user implementations.

This may require marker-managed sections.

Example:

// FORGEUI GENERATED HOOKS BEGIN

void FG_On_StartPump_Clicked(void);
void FG_On_StopPump_Clicked(void);

// FORGEUI GENERATED HOOKS END

Developer-owned code must remain outside generated marker sections.

24. Possible Stub Management Strategies
Strategy A — Weak Functions

Generated UI provides weak empty functions.

__attribute__((weak))
void FG_On_StartPump_Clicked(void)
{
}

Developer code may provide a strong implementation elsewhere.

Advantages
Simple
Export always compiles
No user file parsing
Disadvantages
Less obvious to new developers
Stubs may still live in generated code
Developer must create matching implementations
Strategy B — Preserved User Files

Generate:

95_UserEvents.c
95_UserEvents.h

and preserve them.

Advantages
Clear developer entry point
Easy for GPT and VS Code
Self-documenting export
Clean separation
Disadvantages
Requires safe update logic for newly added hooks
Recommended Direction

Use preserved user files as the permanent architecture.

Weak generated defaults may be used internally as a temporary safety mechanism if needed.

25. Debug Map
Problem	Start Here
Hook not generated	ForgeUILvglExport.ts
Wrong hook name	Public code-name helper
Duplicate hook names	Code-name uniqueness logic
Click does not fire	fg_interactive_button_event_cb()
Visual state broken	Existing Interactive Button runtime
Hook file missing	export-server.js
User file overwritten	Export server preservation logic
CMake cannot find hook file	Generated CMakeLists.txt
Standalone project missing hooks	/export-idf-project
Live firmware missing hooks	/export
Cleanup deleted user code	Cleanup endpoints
Linker reports missing callback	Hook declarations and implementations
26. File Ownership Rules
ForgeUILvglExport.ts

Owns generated LVGL source and public API design.

Never writes files directly.

export-server.js

Owns disk writing and project packaging.

Never invents widget behaviour.

90_Studio_Export.c

Owns generated LVGL runtime.

Never contains customer application logic.

90_Studio_Export.h

Owns generated public UI function declarations.

Never contains user implementations.

95_UserEvents.c

Owns customer callback implementations.

Must be preserved.

95_UserEvents.h

Owns callback declarations shared with generated UI.

Generated sections may be managed carefully, but developer additions must be preserved.

CMakeLists.txt

Owns compilation source registration.

Generated by the export server.

27. Integration Flow
Interactive Button Component
        │
        ▼
Code Name Resolution
        │
        ▼
generateForgeUILvglCode()
        │
        ├── LVGL Button Runtime
        ├── Hook Call
        └── Public API Metadata
        │
        ▼
export-server.js
        │
        ├── 90_Studio_Export.c
        ├── 90_Studio_Export.h
        ├── 95_UserEvents.c
        ├── 95_UserEvents.h
        └── CMakeLists.txt
        │
        ▼
Developer Opens Project
        │
        ▼
Adds Logic To 95_UserEvents.c
        │
        ▼
Build
        │
        ▼
ESP32-P4
28. First Implementation Target

The first Generated Export API implementation should support:

One or more Interactive Buttons

Each button receives:

FG_On_<CodeName>_Clicked()

The existing button visual-state runtime remains unchanged.

Validation:

Two Interactive Buttons
        │
        ├── Unique hook 1
        └── Unique hook 2
        │
        ▼
95_UserEvents.c
        │
        ▼
ESP-IDF Build
        │
        ▼
Physical ESP32-P4
Permanent Architecture Rule
ForgeUI generates the interface.

ForgeUI exposes the interface.

The developer supplies the application.

This document is the permanent architectural map for the ForgeUI Generated Export API and should be maintained only when ownership or integration boundaries change.