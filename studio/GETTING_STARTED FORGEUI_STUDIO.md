# 🚀 ForgeUI Studio: Getting Started Guide

ForgeUI Studio is an AI-assisted visual embedded HMI Studio for ESP32-P4. It combines a drag-and-drop Visual Builder, AI layout and artwork generation, reusable Interactive Assets, native LVGL export, integrated build and flash, and standalone ESP-IDF project export.

Current proven architecture:

```text
FORGEUI_INTERACTIVE_ASSET_FRAMEWORK_V1__BUTTON_AND_LIGHT__UNIFIED_UI_FLOW__PHYSICAL_ESP32P4_PROVEN
```

This guide focuses on getting a new user running quickly. For detailed subsystem ownership and generated API internals, see:

- [`02_DEVELOPER_CODE_MAP.md`](../02_DEVELOPER_CODE_MAP.md)
- [`03_ForgeUI_Generated_Export_API_Code_Map.md`](../03_ForgeUI_Generated_Export_API_Code_Map.md)

---

## Quick start

### 1. Clone or open the repository

```bash
git clone <your-repository-url> esp32p4-ui-studio
cd esp32p4-ui-studio
```

If you already have the project, open its root directory in File Explorer or Visual Studio Code.

### 2. Check prerequisites

ForgeUI's Windows setup expects:

- Node.js 20 LTS with npm
- Python 3.11
- Git
- ESP-IDF 5.5.x for firmware build and flash
- the USB drivers required by your ESP32-P4 board
- Visual Studio Code with the Espressif ESP-IDF extension for standalone project development

AI features additionally require an OpenAI API key. The Visual Builder and non-AI workflows can still run without one.

### 3. Run first-time setup

From the repository root, launch:

```text
FIRST_TIME_FORGEUI_SETUP.bat
```

The setup utility checks the local environment and offers safe repairs. It can:

- verify Node.js and npm;
- install Studio npm dependencies when missing;
- locate a compatible Python environment;
- install Pillow, pypng, and lz4 when required;
- validate `tools/lvgl/LVGLImage.py`;
- check the firmware template and ESP-IDF export support;
- check whether an OpenAI API key is configured;
- check the local Studio ports.

It does not automatically install Node.js, Python, ESP-IDF, USB drivers, or Visual Studio Code.

### 4. Configure AI features (optional)

Create:

```text
studio/.env.local
```

Add:

```text
OPENAI_API_KEY=your_key_here
```

Never commit `.env.local` or an API key to source control.

### 5. Start ForgeUI Studio

Run:

```text
START_FORGEUI_STUDIO_HIDDEN.vbs
```

This starts:

- the Next.js Studio on port `3000`;
- the local export, image-conversion, and hardware bridge on port `3030`.

The launcher opens:

```text
http://localhost:3000
```

To stop the local ForgeUI processes, run:

```text
STOP_FORGEUI_STUDIO.bat
```

---

## First project workflow

```text
Visual Builder
        │
        ▼
Interactive Assets
        │
        ▼
Canvas
        │
        ▼
Browser Preview
        │
        ▼
Native LVGL Export
        │
        ▼
Standalone ESP-IDF Project
        │
        ▼
Visual Studio Code
        │
        ▼
ESP-IDF Build
        │
        ▼
ESP32-P4
```

Interactive Assets are optional. A project can contain standard ForgeUI widgets, Interactive Assets, or both.

### 1. Build a screen

Use the Visual Builder to add, position, resize, and configure components on the Canvas. You can work manually or use ForgeUI AI Studio to generate an editable starting layout.

Typical first steps:

1. Choose a theme or background.
2. Add components from the Studio component library.
3. Set component position, size, text, and visual properties.
4. Use Browser Preview to check the complete screen.

### 2. Use AI assistance (optional)

ForgeUI AI currently supports:

- layout generation;
- Layout Prompt Helper;
- hero background generation;
- standalone artwork generation;
- Interactive Button state artwork;
- Interactive Light state artwork;
- semantic icon generation and resolution.

AI layouts enter the normal Canvas workflow and remain editable. AI-generated artwork enters the same uploaded-asset and native LVGL conversion pipeline as manually imported artwork.

### 3. Add an Interactive Asset (optional)

Open the Interactive Assets panel and choose:

```text
+ New Interactive Asset
```

Select the Asset Type:

- Button
- Light

You can select existing LVGL-ready images or generate the state artwork with AI. Save the asset, select a compatible Canvas component, and use **Use on Selected** to assign it.

### 4. Preview

Use the Canvas for editing and state interaction, then open Browser Preview to inspect the complete interface before export.

Canvas-only Light toggling is a temporary preview aid. It does not change the Light's saved initial state or create a clickable Light in firmware.

### 5. Build, flash, or export

Choose the workflow that matches your goal:

- Use the integrated Studio build and flash controls for rapid validation on the configured ESP32-P4 hardware.
- Use **Export Standalone Project** when you are ready to continue application development independently in Visual Studio Code.

---

## Interactive Asset Framework

Interactive Assets are reusable visual definitions that can be assigned to compatible Canvas components before export.

Current types:

| Asset type | Visual states | Firmware role |
|---|---|---|
| Interactive Button | Normal, Pressed | Input control with a generated click hook |
| Interactive Light | OFF, ON | Output indicator with a generated public setter |

Both types share the same registry, persistence, uploaded-asset, AI image, LVGL conversion, Canvas assignment, and export pipeline.

### Interactive Button

An Interactive Button can use manually selected or AI-generated Normal and Pressed artwork.

In Preview and firmware:

```text
Normal
  ↓
Touch
  ↓
Pressed
  ↓
Release or Press Lost
  ↓
Normal
```

Each exported Button receives a generated developer hook, such as:

```c
void FG_On_StartPump_Clicked(void);
```

In a standalone exported project, add the hook's application behavior in `95_UserEvents.c`.

### Interactive Light

An Interactive Light can use manually selected or AI-generated OFF and ON artwork. Its saved initial state determines which image appears when firmware creates the UI.

Light is non-clickable in firmware. Application code controls it through a generated public API, for example:

```c
FG_Set_Status_Light(true);  // ON
FG_Set_Status_Light(false); // OFF
```

The Canvas can toggle a temporary preview without changing the saved state or exported runtime behavior.

---

## Generated project structure

ForgeUI keeps generated UI/runtime code separate from application integration code.

### Generated and replaceable

- `90_Studio_Export.c`
- `90_Studio_Export.h`

These files contain generated UI construction, runtime support, and public UI APIs. ForgeUI may regenerate them. Do not add permanent hardware or product logic to them.

### Developer integration layer

- `95_UserEvents.c`
- `95_UserEvents.h`

Studio creates these files as part of export. In the Studio-controlled live firmware they are generated test hooks and may be replaced. In a standalone exported project, their copies become the developer integration layer for Button hooks and application behavior.

The basic direction is:

```text
Button input
  → generated UI calls FG_On_* hook
  → developer implements behavior in 95_UserEvents.c

Light output
  → developer calls FG_Set_* API
  → generated UI updates the LVGL object
```

For the complete ownership contract, see [`03_ForgeUI_Generated_Export_API_Code_Map.md`](../03_ForgeUI_Generated_Export_API_Code_Map.md).

---

## Standalone ESP-IDF export

**Export Standalone Project** creates a separate ESP-IDF workspace under:

```text
C:\ForgeUI-Exports
```

The exported project includes:

- generated UI and runtime code in `90_Studio_Export.c/.h`;
- generated Button hook declarations and stubs in `95_UserEvents.c/.h`;
- generated public Light declarations in `90_Studio_Export.h`;
- required LVGL image assets;
- an ESP-IDF CMake source list;
- the ForgeUI-One firmware baseline.

After export, the project is independent of ForgeUI Studio. Open it directly in Visual Studio Code and use the official Espressif ESP-IDF extension to build, flash, monitor, version-control, and maintain it.

Recommended application workflow:

1. Export the project from ForgeUI Studio.
2. Open the exported folder in Visual Studio Code.
3. Add Button behavior and product integration in the developer-owned application layer.
4. Include `90_Studio_Export.h` where application code needs generated Light setters.
5. Build, flash, and monitor through ESP-IDF.

Do not edit generated `90_Studio_Export.c/.h` to add application logic.

---

## Build and hardware notes

The current ForgeUI-One baseline targets:

- Waveshare ESP32-P4-WiFi6-Touch-LCD-7B;
- ESP-IDF 5.5.x;
- LVGL 9;
- a 1024×600 display configuration.

Board configuration, USB setup, component dependencies, and ESP-IDF environment details can vary by workstation. Run the first-time setup check before troubleshooting the Studio itself.

---

## Troubleshooting quick checks

### Studio does not open

- Confirm Node.js and npm are available.
- Run `FIRST_TIME_FORGEUI_SETUP.bat` again.
- Check that ports `3000` and `3030` are free.
- Confirm both the Studio and `export-server.js` processes started.

### AI generation fails

- Confirm `OPENAI_API_KEY` is present in `studio/.env.local` or the Windows environment.
- Restart Studio after changing environment configuration.
- Check the Studio terminal output for the API error.

### Image conversion fails

- Confirm Python 3.11 is available.
- Run the setup utility to validate Pillow, pypng, and lz4.
- Confirm `tools/lvgl/LVGLImage.py` exists.
- Confirm the local export server is running on port `3030`.

### Firmware build or flash fails

- Confirm ESP-IDF 5.5.x and the board USB drivers are configured.
- Use **Clean Firmware** for a targeted generated-file reset.
- Use **Firmware Maintenance** only when a full generated-asset and build-cache sweep is required.
- Re-export before building a standalone project.

### Interactive Asset is missing after restart

- Confirm the asset was saved before closing Studio.
- Confirm its state images were converted to LVGL-ready uploaded assets.
- Reassign the saved asset to the compatible Canvas component if necessary.

---

# About the Creator

Hi, I'm **Scott Forster** from New Zealand, creator of **ForgeUI Studio**.

ForgeUI began as a personal project with a simple goal: make professional embedded HMI development faster, more approachable and more enjoyable. I wanted a tool that could take an idea—from a rough sketch or a natural-language prompt—all the way through to a working interface running on real ESP32-P4 hardware.

Today, ForgeUI Studio combines visual design, AI-assisted layout generation, native LVGL code generation, reusable Interactive Assets and standalone ESP-IDF export into a single development workflow. Every major feature is developed against physical hardware, with new capabilities only considered complete once they have been built, exported, compiled, flashed and verified on an ESP32-P4.

My development philosophy remains simple:

> **Build it. Prove it. Flash it. Improve it.**

ForgeUI is developed using modern AI-assisted engineering practices. I define the product vision, architecture, hardware validation and engineering direction, while AI coding tools—including **ChatGPT** and **Codex**—assist with implementation, refactoring, testing, documentation and design reviews. Every change is reviewed and validated before becoming part of the project.

The goal is not simply to build another UI designer, but to create an open, native-first embedded development platform that removes repetitive engineering work while preserving complete control of the generated firmware.

ForgeUI Studio is open source because I believe powerful embedded development tools should be accessible to everyone. I hope it helps engineers, students, makers and companies build better products more quickly, and I welcome ideas, feedback and contributions from the community.

---

**Scott Forster**  
Creator & Lead Developer — ForgeUI Studio

📧 **forgeui.esp32@gmail.com**
