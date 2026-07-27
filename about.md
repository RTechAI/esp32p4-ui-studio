# 🛠️ About ForgeUI Studio

ForgeUI Studio is an open-source, AI-assisted visual HMI Studio created to make embedded interface development easier, faster and more enjoyable.

It began with a simple idea: building a polished interface for real hardware should not require endless repetitive work. Designers and engineers should be able to explore an idea visually, refine it with useful tools, and still arrive at readable native code that belongs to them.

ForgeUI has grown from a drag-and-drop editor into a complete creative and engineering workflow:

```text
idea
  ↓
AI assistance
  ↓
visual editing
  ↓
native LVGL generation
  ↓
physical ESP32 hardware
```

Along the way, it has gained AI-assisted interface generation, reusable Interactive Assets, native LVGL output, integrated Build & Flash tools, standalone ESP-IDF export, and a generated System Interface. These capabilities matter because they bring the original vision closer: helping someone move from an idea to a working embedded product without losing control of the result.

---

## AI Design Studio

ForgeUI uses AI to help turn ideas into editable layouts and artwork. AI generation uses configured OpenAI services; it is an optional creative starting point, not a replacement for visual editing or engineering judgment.

```text
idea
  ↓
AI-assisted layout
  ↓
editable Canvas
  ↓
Browser Preview
  ↓
native LVGL
```

Artwork follows the same principle:

```text
prompt or uploaded image
  ↓
AI generation where requested
  ↓
local image preprocessing
  ↓
editable ForgeUI asset
  ↓
native LVGL asset
```

Image preprocessing, LVGL conversion, export, build and flash run locally.

---

## Key Architectural Advancement

ForgeUI connects a friendly visual workspace to a native embedded output. Designs remain editable in the Studio, while the generated result remains ordinary LVGL and ESP-IDF code rather than a browser runtime deployed to the device.

Reusable Interactive Assets extend that approach with saved artwork and generated runtime behaviour. They help designers reuse proven controls without giving up native LVGL output. The README and architecture documents contain the detailed runtime families and API contracts.

---

## Standalone Export

ForgeUI can produce an independent ESP-IDF project that can be built, version-controlled and extended without ForgeUI Studio.

Generated, replaceable UI lives in `90_Studio_Export.*`. After standalone export, developer integration belongs in `95_UserEvents.*` and other developer-owned application modules. Product behaviour does not need to be concentrated in `main.c`, and it should not be placed in replaceable generated UI files.

Standalone exported firmware has no runtime dependency on ForgeUI Studio.

---

## Why ForgeUI exists

Embedded UI work is rewarding, but much of it can be unnecessarily repetitive. Layout coordinates, asset conversion, boilerplate code, build steps and hardware iteration can take attention away from the experience being created.

ForgeUI exists to reduce that friction. It aims to make professional embedded interface development more approachable while respecting the realities of native firmware, physical hardware and long-term product ownership.

The goal is not to hide engineering. It is to give engineers, makers and designers a clearer path through it.

> **Build it. Prove it. Flash it. Improve it.**

That phrase captures the way ForgeUI is developed: make something useful, test it honestly, run it on the real device, learn from the result, and keep improving.

---

## What the workflow brings together

ForgeUI groups its current capabilities into a small set of connected themes:

- **AI Studio** — assistance for layouts and artwork;
- **Visual Designer** — editable Canvas and Browser Preview;
- **Interactive Assets** — reusable controls with generated native behaviour;
- **Native Export** — readable LVGL and standalone ESP-IDF output;
- **Build & Flash** — a direct path from the Studio to physical hardware.

ForgeUI supports a growing library of native LVGL widgets and reusable Interactive Assets. The focus is not the size of the component list, but a consistent path from visual editing to native firmware.

Multiple industrial and modern themes provide practical starting points for different products while remaining editable within the same visual workflow.

---

## Built for real hardware

ForgeUI is developed against physical ESP32-P4 hardware, not simulations alone. Browser previews are valuable, but a new runtime feature is considered proven only after it has been successfully exported, built, flashed and validated on the device.

That discipline keeps the project grounded. The aim is not merely to create interfaces that look convincing in a design tool, but interfaces that become dependable native LVGL applications on real ESP32 hardware.

The current reference platform is the Waveshare ESP32-P4-WiFi6-Touch-LCD-7B. Detailed hardware and runtime architecture belongs in the project documentation rather than on this page.

## Current proven capabilities

ForgeUI’s major proven achievements include AI-assisted layout and artwork workflows, reusable Interactive Assets, native LVGL generation, Canvas and Browser Preview parity, integrated Build & Flash, standalone ESP-IDF export, and continuous physical validation on ESP32-P4 hardware.

---

## AI as an engineering assistant

AI is an important part of ForgeUI, both inside the product and during its development.

ChatGPT and Codex act as engineering assistants that help accelerate implementation, documentation, testing and refactoring. They provide useful analysis, help explore alternatives and reduce repetitive development effort.

The product vision, architecture, engineering direction and physical hardware validation remain under Scott’s direction. AI supports that process; it does not independently design or develop ForgeUI.

This approach reflects the wider purpose of the project: use AI where it genuinely helps, while keeping human judgment, authorship and responsibility at the centre.

---

## Future direction

ForgeUI is heading toward a broader, more flexible embedded UI platform while keeping the workflow approachable. Future work will deepen visual authoring, reusable controls, hardware integration and project portability without hiding the native code beneath the design experience.

The direction is guided by a few lasting goals: reduce repetitive engineering, keep generated code readable, remain open and extensible, and help both hobbyists and professional engineers build real products faster.

---

## Open-source philosophy

ForgeUI is open source because useful embedded tools should be understandable, adaptable and available to the people building with them.

Standalone ESP-IDF projects are intended to remain ordinary developer-owned projects. Generated code should be readable, native and practical to extend—not locked behind a subscription or dependent on a ForgeUI runtime service.

Open development also makes it possible for people to learn from the project, challenge its assumptions and help it grow in directions that serve real embedded work.

ForgeUI welcomes feedback, ideas, testing and contributions from developers around the world.

---

## Acknowledgements

ForgeUI Studio builds upon visual design workspace foundations originally created by Premier Octet and has since been extensively adapted for native LVGL, ESP-IDF and ESP32-P4 workflows.

It also stands on the work of open-source communities behind LVGL, ESP-IDF, React, Next.js, Chakra UI and the project’s other dependencies. Their respective licenses and attribution remain preserved with the project.

Thank you to everyone who shares knowledge, reports issues, tests new ideas or contributes to open-source embedded development.

---

## Learn More

This About page intentionally stays focused on the project’s purpose and vision. Detailed features and architecture are documented in:

- [README](README.md)
- [Project Spine](01_SPINE.md)
- [Developer Code Map](02_DEVELOPER_CODE_MAP.md)
- [Generated Export API Code Map](03_ForgeUI_Generated_Export_API_Code_Map.md)

---

## About the Creator

Hi, I’m **Scott Forster** from New Zealand.

ForgeUI began as a personal experiment born from curiosity and a love of solving real engineering problems. I wanted a tool that could take a rough idea, help shape it visually, and carry it all the way to a working interface on physical ESP32 hardware.

Through continuous building, testing and physical validation, that experiment has evolved into an open-source engineering platform. What keeps me excited about ForgeUI is the possibility of making embedded development feel more creative and approachable without making it less real. I want people to be able to experiment quickly, understand what is generated, and confidently turn their ideas into products they own.

This project is shared with the community in the hope that it helps others learn, create and build something meaningful.

**Scott Forster**

Creator & Lead Developer — ForgeUI Studio

📧 **forgeui.esp32@gmail.com**

---

## ForgeUI philosophy

Build it.

Prove it.

Flash it.

Improve it.
