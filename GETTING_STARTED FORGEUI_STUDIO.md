# 🚀 ForgeUI Studio – Getting Started

Welcome to **ForgeUI Studio**.

ForgeUI is an AI-assisted visual HMI Studio for the **ESP32-P4**, combining drag-and-drop interface design, AI-assisted workflows, reusable Interactive Assets, native LVGL code generation, integrated build and flash, and standalone ESP-IDF project export.

This guide is designed for **first-time users**. If you're starting with a brand-new Windows installation, follow the steps below and you'll have ForgeUI running in just a few minutes.

For detailed architecture and generated API documentation, see:

- `02_DEVELOPER_CODE_MAP.md`
- `03_ForgeUI_Generated_Export_API_Code_Map.md`

---

# Before You Begin

# 🌐 Developer Portal

The official **ForgeUI Developer Portal** is the recommended starting point for new users and developers:

https://forgeui.co.nz/developers

The Developer Portal contains:

- Getting Started guides
- Installation instructions
- Supported boards
- Documentation
- Example projects
- Export architecture
- Developer workflows
- Roadmap
- Community resources
- Contribution information

The website is the primary source for current documentation, while this repository contains the detailed engineering references. Developers can continue using the Markdown architecture documents when they need deeper implementation details.

---

There are only a few applications you should install yourself before using ForgeUI Studio.

## Required Software

### Windows 11

Ensure Windows Update is fully up to date.

---

### GitHub Desktop

Download:

https://github.com/apps/desktop

GitHub Desktop is the easiest way to clone and update ForgeUI Studio.

---

### Visual Studio Code (Recommended)

Download:

https://code.visualstudio.com/

Visual Studio Code is recommended if you intend to modify ForgeUI Studio or develop standalone exported firmware projects.

---

### ESP-IDF v5.5.4

Download the **ESP-IDF v5.5.4 Offline Installer**:

https://dl.espressif.com/dl/esp-idf/

The offline installer is currently the recommended installation method.

---

# 🚀 Quick Start

```text
Windows Setup
        │
        ▼
Run FIRST_TIME_FORGEUI_SETUP.bat
        │
        ▼
Launch ForgeUI Studio
        │
        ▼
Create UI
        │
        ▼
Browser Preview
        │
        ▼
Build & Flash
        │
        ▼
Export Standalone ESP-IDF Project
        │
        ▼
Continue Development
```

---

# Step 1 — Create Your ForgeUI Workspace

Open **Command Prompt**.

Create the recommended workspace:

```text
C:
cd \
mkdir ForgeUI
mkdir ForgeUI\Projects
cd ForgeUI\Projects
```

Clone ForgeUI Studio:

```bash
git clone https://github.com/RTechAI/esp32p4-ui-studio.git
```

---

# Step 2 — Run First-Time Setup

Open the project folder and simply run:

```text
FIRST_TIME_FORGEUI_SETUP.bat
```

This is the **ForgeUI Bootstrap Installer**.

It automatically prepares your development environment.

During setup ForgeUI will:

- Verify the project structure
- Install Node.js 20 automatically (if required)
- Verify npm
- Install Studio dependencies
- Build ForgeUI Studio
- Verify Python
- Verify LVGL conversion tools
- Verify ESP-IDF installation
- Check Studio ports
- Check optional AI configuration
- Verify the firmware template

If everything is successful you will see:

```text
FORGEUI PREFLIGHT PASSED
```

You will then be prompted to launch ForgeUI Studio.

No manual Node.js installation is normally required.

---

# Optional AI Features

ForgeUI Studio works perfectly **without** an OpenAI API key.

The following features are fully available without AI:

- Visual Builder
- Drag-and-drop Canvas
- Browser Preview
- Theme Manager
- Interactive Assets
- Native LVGL Export
- Build and Flash
- Standalone ESP-IDF Export

Only the AI-powered features require an API key:

- AI Layout Generator
- AI Prompt Helper
- Hero Background Generation
- AI Artwork Generation
- Interactive Asset Artwork Generation

If no API key is configured, ForgeUI will display a warning during preflight but Studio will still launch normally.

To enable AI features create:

```text
studio\.env.local
```

Add:

```text
OPENAI_API_KEY=your_openai_api_key
```

Replace `your_openai_api_key` with your own OpenAI API key.

> **Important**
>
> - `.env.local` is a local configuration file.
> - Never commit it to GitHub.
> - Missing this file only disables AI features.

Restart ForgeUI Studio after creating or modifying `.env.local`.

---

# First Launch

After setup completes choose:

```text
Start ForgeUI Studio
```

ForgeUI will start:

- Studio (Port 3000)
- Local Export Server (Port 3030)

Your browser will automatically open:

```text
http://localhost:3000
```

---

# Your First ForgeUI Project

The normal ForgeUI workflow is simple:

```text
Create Screen
        │
        ▼
Browser Preview
        │
        ▼
Build & Flash
        │
        ▼
Export Standalone Project
        │
        ▼
Continue Development in ESP-IDF
```

---

# Creating a Screen

Use the Visual Builder to:

- Drag components onto the Canvas
- Resize and position them
- Apply themes
- Configure text and appearance
- Preview the final interface

You can design completely manually or use the built-in AI tools to generate a starting layout.

---

# Interactive Assets

Interactive Assets are reusable controls that connect artwork to generated firmware behaviour.

Current Interactive Assets include:

- Interactive Button
- Interactive Toggle Switch
- Interactive Three-Position Toggle Switch
- Interactive Light
- Interactive Status Indicator

Each asset can use manually imported artwork or AI-generated artwork.

Once assigned to a Canvas component, ForgeUI automatically exports the required LVGL runtime code.

---

# Browser Preview

Browser Preview allows you to interact with your interface before exporting.

It mirrors the generated firmware as closely as possible while providing instant feedback during development.

---

# Device Console

Use the compact **Console** toolbar control to open the collapsible, resizable bottom dock below Widgets, Canvas, and Inspector. The console is a Studio tool and is never exported as part of the designed UI.

- **BUILD** shows the existing ESP-IDF Build & Flash output and opens automatically when a build starts.
- **MONITOR** connects through the local ForgeUI backend to a selected Windows COM port. The default baud is 115200; raw device output remains unchanged.
- **I/O** is a read-only summary of explicit values recognised in that same serial output. It does not control hardware or own another serial connection.

When MONITOR is connected, ForgeUI releases the port before Build & Flash, waits for closure, and attempts to reconnect after a successful flash. See the [Device Console guide](docs/FORGEUI_DEVICE_CONSOLE.md) for complete controls and troubleshooting.

---

# Exporting

ForgeUI supports two workflows.

## Rapid Development

Use the integrated Build and Flash tools to immediately test on your connected ESP32-P4.

---

## Standalone Development

Choose:

```text
Export Standalone Project
```

ForgeUI creates a complete ESP-IDF project in:

```text
C:\ForgeUI-Exports
```

The exported project is completely independent from ForgeUI Studio.

Continue development using:

- Visual Studio Code
- ESP-IDF and its Visual Studio Code extension
- Git
- Your own application code

ForgeUI Studio is not required during normal firmware development after export. The standalone project can be built, version controlled and extended using the developer's preferred ESP-IDF workflow.

---

# Generated Files

ForgeUI separates generated code from developer code.

```text
Generated UI
        │
        ▼
90_Studio_Export.*
        │
        ▼
95_UserEvents.*
        │
        ▼
Developer Application Code
```

`90_Studio_Export.*` contains generated UI and runtime code.

`95_UserEvents.*` is the intended location for developer hardware control and application behaviour.

Using the supported workflow, generated files can safely regenerate without overwriting developer application logic.

## Generated Files

```text
90_Studio_Export.c
90_Studio_Export.h
```

These files are automatically regenerated.

Do **not** place permanent application logic inside them.

---

## Developer Files

```text
95_UserEvents.c
95_UserEvents.h
```

These are where your hardware control and application behaviour belong after exporting a standalone project.

---

# Expected Preflight Warnings

The following warnings are normal.

## OpenAI API Key Not Configured

AI features will be disabled.

ForgeUI Studio will still operate normally.

---

## ESP-IDF Shell Not Activated

Only relevant when compiling or flashing standalone firmware.

The Studio itself will continue to operate normally.

---

# Troubleshooting

## Studio will not start

Run:

```text
FIRST_TIME_FORGEUI_SETUP.bat
```

Again.

The setup utility safely verifies and repairs the Studio installation.

---

## AI Features Do Not Work

Confirm:

```text
studio\.env.local
```

contains:

```text
OPENAI_API_KEY=your_openai_api_key
```

Restart ForgeUI Studio afterwards.

---

## Image Conversion Problems

Run the First-Time Setup utility again.

It validates:

- Python
- Pillow
- pypng
- lz4
- LVGLImage.py

---

## Firmware Build Problems

Confirm:

- ESP-IDF v5.5.x is installed
- USB drivers are installed
- An ESP-IDF shell is active

---

# About ForgeUI

ForgeUI Studio was created by **Scott Forster** from New Zealand.

Its goal is simple:

> **Build embedded interfaces visually. Export clean native firmware. Keep developers in complete control of the generated code.**

ForgeUI now combines:

- AI Studio
- Interactive Asset Framework
- Standard LVGL Component Runtime
- Built-in System Runtime
- Browser Preview
- Native LVGL generation
- Standalone ESP-IDF export

Together these layers make ForgeUI a complete embedded application generation platform rather than only a visual editor. Generated firmware includes semantic runtime APIs for supported Standard LVGL widgets while maintaining a strict ownership boundary between generated UI code and developer application code.

Every major feature is developed and validated on physical ESP32-P4 hardware before being considered complete.

ForgeUI is built using modern AI-assisted engineering workflows, with architecture, validation and product direction led by Scott Forster, while implementation assistance is provided by AI development tools including ChatGPT and Codex.

The philosophy behind ForgeUI remains:

> **Build it. Prove it. Flash it. Improve it.**

Happy building!
