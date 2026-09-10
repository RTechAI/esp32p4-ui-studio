# ForgeUI Studio — ESP32-P4 & LVGL Visual UI Designer

> ## ForgeUI Studio development has moved to ForgeUI Hosted
>
> This repository contains the original **local/open-source ForgeUI Studio for ESP32-P4 and LVGL 9**.
>
> **Active ForgeUI Studio development now continues in ForgeUI Hosted Studio:**
>
> ### https://studio.forgeui.co.nz
>
> **ForgeUI Hosted Studio is currently free for personal use.**
>
> Design, preview and export native **LVGL 9 / ESP-IDF interfaces for ESP32-P4** directly from your browser.
>
> This GitHub project is **no longer under active feature development**, but remains available for developers who want to **run ForgeUI locally, inspect the source, modify it, fork it, or use its existing ESP32-P4 development and export tooling**.
>
> **AI generation in ForgeUI Hosted uses separate AI Credits.**

---

## ForgeUI Hosted Studio — Current ForgeUI Development

**ForgeUI Studio** is a visual embedded UI and HMI development environment for **ESP32-P4, LVGL 9 and ESP-IDF**.

The actively developed version is now **ForgeUI Hosted Studio**, available in the browser:

### [Try ForgeUI Hosted Studio](https://studio.forgeui.co.nz)

ForgeUI Hosted provides a visual workflow for building embedded interfaces:

```text
Drag & Drop / AI Layout Generation
            ↓
Editable ForgeUI Components
            ↓
Canvas
            ↓
Browser Preview
            ↓
Native LVGL Generation
            ↓
ESP-IDF Project Export
            ↓
Build & Flash ESP32-P4 Hardware
```

Current Hosted development includes multi-board support, visual Canvas design, Browser Preview, native LVGL generation, ESP-IDF export, board-aware AI Layout Generation, themes, assets, system interfaces and ForgeUI Native Components.

**Hosted access is currently free for personal use. AI generation credits are separate.**

Learn more at:

- **ForgeUI Studio:** https://studio.forgeui.co.nz
- **ForgeUI website:** https://forgeui.co.nz
- **Supported hardware:** https://forgeui.co.nz/hardware
- **UI Library:** https://forgeui.co.nz/ui-library
- **Documentation:** https://forgeui.co.nz/docs
- **Developer Portal:** https://forgeui.co.nz/developers

---

# Local / Open-Source ForgeUI Studio

This repository preserves the original local **ForgeUI Studio ESP32-P4 visual UI development environment**.

It remains available for developers who prefer a local development workflow or want access to the ForgeUI source.

The local Studio provides:

- Drag-and-drop ESP32-P4 UI design
- Native **LVGL 9** component generation
- **ESP-IDF** integration
- Browser Preview
- Standalone ESP-IDF project export
- Runtime APIs and UserEvents
- ForgeUI Native Components
- Interactive Assets
- Board profiles
- Hardware configuration
- Integrated Build & Flash
- Device Console and serial monitoring
- Wi-Fi and storage interfaces
- Optional local AI-assisted workflows
- Developer-owned generated firmware

ForgeUI does **not** deploy HTML, CSS, JavaScript, Node.js or a browser runtime to the ESP32.

Generated interfaces compile as **native LVGL C inside ESP-IDF**.

> **Design visually. Generate native LVGL. Build real ESP32-P4 firmware.**

---

## ESP32-P4 & LVGL Hardware Proof

This local ForgeUI release contains substantial real-hardware validation.

### LVGL 9

**44 / 44 practical LVGL 9.2 widgets/components were physically proven on ESP32-P4 hardware.**

The component library includes controls, displays, charts, text entry, containers, images, navigation, QR Code, icons, Canvas and other practical LVGL interface elements.

ForgeUI also developed a library of **ForgeUI Native Components** for embedded dashboards and control applications.

Examples include:

- Dashboard Card
- Sensor Tile
- Relay Panel
- PWM Controller
- Trend Chart
- Trend Chart Pro
- Alarm Panel
- IO Monitor
- Battery Card
- Tank Level Card
- Network Status Card
- KPI Card
- Device Summary Card
- Power Flow Card

The repository retains the detailed engineering documentation and physical-validation records for these components.

---

## ESP32-P4 Hardware Examples

Five embedded hardware examples were physically proven through the ForgeUI workflow:

1. **GPIO Digital I/O**
2. **I2C FRAM Persistence**
3. **SPI NFC / RFID**
4. **Online Services / Live Weather**
5. **GPS / GNSS**

These examples demonstrate ForgeUI interfaces working with real embedded peripherals and services rather than UI simulation alone.

---

## ESP32-P4 Hardware

The original local release was developed and physically validated primarily around:

### Waveshare ESP32-P4-WIFI6-Touch-LCD-7B

- ESP32-P4
- 7-inch touchscreen
- 1024 × 600 landscape
- LVGL 9.2
- ESP-IDF 5.5.x
- ESP32-C6 Hosted Wi-Fi
- SD storage
- native Build & Flash

The current **ForgeUI Hosted Studio** has expanded the ForgeUI multi-board direction beyond this original local-release baseline.

See the current supported hardware:

### https://forgeui.co.nz/hardware

---

## Native ESP-IDF / LVGL Export

ForgeUI-generated standalone exports are normal **ESP-IDF projects**.

Developers can:

- open the exported project in Visual Studio Code;
- build and flash using ESP-IDF;
- add application modules and FreeRTOS tasks;
- integrate GPIO, sensors and peripherals;
- call generated UI APIs;
- handle user interaction through generated hooks;
- continue development without ForgeUI.

The exported firmware does not require a ForgeUI runtime service or internet connection on the ESP32-P4.

Your exported embedded application remains developer-owned.

---

## Local ForgeUI Workflow

```text
Visual UI Design
      ↓
ForgeUI Components
      ↓
Canvas
      ↓
Browser Preview
      ↓
Native LVGL C
      ↓
ESP-IDF
      ↓
ESP32-P4
```

ForgeUI was designed to reduce the repetitive work involved in manually creating embedded LVGL interfaces while retaining native firmware ownership.

---

## Running This Repository Locally

This repository remains available for developers who specifically want the original local/open-source ForgeUI Studio.

The established local bootstrap targets Windows development.

1. Install Git.
2. Install Node.js 20.
3. Install Python.
4. Install ESP-IDF 5.5.x.
5. Clone this repository.
6. Run `FIRST_TIME_FORGEUI_SETUP.bat`.
7. Start ForgeUI Studio using the provided launcher.
8. Create a project, preview the interface and generate/export the firmware.

See:

[Getting Started with ForgeUI Studio](GETTING_STARTED%20FORGEUI_STUDIO.md)

> **Note:** This repository is retained as the local/open-source ForgeUI release. New ForgeUI product development is focused on **ForgeUI Hosted Studio**.

---

## AI-Assisted UI Development

This local repository contains its original optional AI-assisted workflows.

Local AI functionality follows the API/configuration instructions included with this repository.

The actively developed **ForgeUI Hosted Studio** provides its own integrated AI Layout Generation workflow.

Hosted AI generation uses **ForgeUI AI Credits** and is separate from free personal Hosted Studio access.

---

## ForgeUI Documentation

This repository remains an extensive engineering reference for the original ForgeUI platform.

Key documentation includes:

| Document | Purpose |
|---|---|
| [01 — Spine](01_SPINE.md) | ForgeUI architecture and milestones |
| [02 — Developer Code Map](02_DEVELOPER_CODE_MAP.md) | Studio implementation and ownership |
| [03 — Generated Export API Code Map](03_ForgeUI_Generated_Export_API_Code_Map.md) | Generated firmware APIs and hooks |
| [04 — Feature Status](04_FEATURE_STATUS.md) | Feature and validation evidence |
| [05 — Developer Guide](05_DEVELOPER_GUIDE.md) | Architecture, widgets and validation |
| [Developer Hardware Integration](05_DEVELOPER_HARDWARE_INTEGRATION.md) | GPIO, sensors and hardware integration |
| [Device Console](docs/FORGEUI_DEVICE_CONSOLE.md) | Build, serial monitoring and hardware insight |
| [Native Component Runtime Guide](10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md) | Native Component runtime APIs |

Historical proof documents remain in the repository as an engineering record of the local ForgeUI development line.

---

## Repository Structure

```text
esp32p4-ui-studio/
├── studio/       Local ForgeUI Studio application
├── firmware/     ESP-IDF firmware and generated output
├── docs/         Feature guides and engineering records
├── tools/        Setup and development tooling
├── reference/    Reference material
└── README.md     Repository overview
```

---

## Open Source & Local Use

This repository remains available for local development and use under its existing licence terms.

Developers are welcome to inspect the code, experiment with it, modify it and use the existing ForgeUI ESP32-P4/LVGL development tooling as permitted by the repository licence.

Active ForgeUI product development has simply moved to the Hosted Studio rather than continuing on this local release line.

---

# Continue with ForgeUI Studio

## Current ForgeUI Studio

### [Try ForgeUI Hosted Studio →](https://studio.forgeui.co.nz)

Build **ESP32-P4 and LVGL 9 interfaces visually in your browser**.

**Currently free for personal use.**

AI Layout Generation uses separate AI Credits.

## Local / Open-Source Release

You are already viewing it:

### [RTechAI / esp32p4-ui-studio](https://github.com/RTechAI/esp32p4-ui-studio)

Use this repository if you want the original local ForgeUI Studio source, development environment and engineering reference.

---

## ForgeUI Links

- **ForgeUI Hosted Studio:** https://studio.forgeui.co.nz
- **ForgeUI:** https://forgeui.co.nz
- **Hardware:** https://forgeui.co.nz/hardware
- **UI Library:** https://forgeui.co.nz/ui-library
- **Documentation:** https://forgeui.co.nz/docs
- **Developers:** https://forgeui.co.nz/developers
- **GitHub:** https://github.com/RTechAI/esp32p4-ui-studio
- **Contact:** forgeui.esp32@gmail.com

---

**ForgeUI Studio — Visual ESP32-P4, LVGL 9 and ESP-IDF UI development.**

**Active development continues in [ForgeUI Hosted Studio](https://studio.forgeui.co.nz).**
