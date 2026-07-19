# 📑 SPINE & SYSTEM DOCUMENTATION

## 🎯 Current Save Point
```text
FORGEUI_AI_ENGINE_V2__LIVE_GPT_TO_PHYSICAL_ESP32P4_PIPELINE_PROVEN__2026-07-12
FORGEUI_AI_LAYOUT_GENERATION__LIVE_OPENAI_INTEGRATION__VALIDATED_JSON_PROVEN__AI_ENGINE_NEXT__2026-07-12
```

---

## 🚦 Project Status
* **ACTIVE**
* **STABLE**
* **PHYSICAL HARDWARE PROVEN** (Waveshare 7" 1024x600 MIPI-DSI)
* **LIVE OPENAI GENERATION PROVEN**
* **SECURE SERVER-SIDE AI PROVEN**
* **FIRST-TIME WORKSPACE SETUP PROVEN**
* **DEPENDENCY AUTOMATION RECOVERY PROVEN**

---

## 📝 ForgeUI Overview
ForgeUI Studio is an open-source visual LVGL v9 HMI designer, AI-assisted user interface generator, structured asset conversion pipeline, global theme builder, and decoupled ESP-IDF architecture utility targeting advanced **ESP32-P4** silicon. 

The complete embedded system pipeline has been verified from raw natural language input strings down to real-world physical runtime rendering at **60+ FPS**.

---

## 📈 Core Execution Architecture

```text
Visual Builder / Canvas
        │
        ▼
Browser Layout Preview
        │
        ▼
LVGL 9 Source Export
        │
        ▼
Generated Decoupled C Sources
        │
        ▼
ESP-IDF Build Environment (v5.5.4)
        │
        ▼
Physical ESP32-P4 Target Board
```
* **STATUS:** `PROVEN`

---

## 🤖 End-to-End AI Pipeline

```text
User Natural Language Prompt
        │
        ▼
OpenAI Responses API (GPT Engine)
        │
        ▼
ForgeUI JSON Specification Document
        │
        ▼
Automated Schema JSON Validation
        │
        ▼
Embedded Component Rule Validation
        │
        ▼
Canvas Instantiation & Layout Grid
        │
        ▼
Browser Renderer Preview
        │
        ▼
Highly-Optimized LVGL Export
        │
        ▼
Pristine Generated C Sources (.c/.h)
        │
        ▼
ESP-IDF Toolchain / Ninja Compiler
        │
        ▼
Physical ESP32-P4 Silicon Display
```
* **STATUS:** `PROVEN`

---

## 🧠 Server-Side AI Subsystem Architecture

```text
ForgeAIPanel (Studio Workspace UI)
        │
        ▼
ForgeAIEngine (Central AI Orchestrator)
        │
        ├──────────────────────────────┐
        │                              │
        ▼                              ▼
ForgeAIPrompts (Prompt Rules)   ForgeAIContext (Active State Canvas)
        │                              │
        └──────────────┬───────────────┘
                       ▼
                 ForgeAIClient
                       │
                       ▼
         Secure Next.js API Routes
                       │
                       ▼
              OpenAI Responses API
                       │
                       ▼
                ForgeAIParser
                       │
                       ▼
          Validated ForgeUI Document
                       │
                       ▼
           Monaco / JSON Code Editor
                       │
                       ▼
          Dynamic Canvas Insertion
                       │
                       ▼
                WYSIWYG Canvas
```
* **STATUS:** `MODULAR` | `PROVEN`

---

## ⚡ Current AI Feature Sets
* **Natural Language Layout Generation:** Translates complex industrial and consumer HMI text descriptions directly to spatial layout arrays.
* **Prompt Engineering Interface:** Native prompt editor optimizing inputs for predictable embedded system shapes.
* **Secure Server-Side Proxies:** Protects OpenAI SDK private credentials behind a Next.js server route away from the client browser.
* **Automatic JSON Validation:** Checks and repairs output fields prior to rendering loops.
* **Canvas Interoperability:** Instant schema parsing allows manual drag-and-drop modification of AI layout blocks.
* **Unified Template Libraries:** Speeds up early interface mockups using baseline components.

---

## 🛠️ Proven Developer Workflows

```text
Describe Screen Interface ➔ Generate Layout Schema ➔ Review Output JSON 
        ➔ Insert to Canvas ➔ Preview Locally ➔ Standalone Code Export 
        ➔ CMake Configuration ➔ Toolchain Flashing ➔ Physical Hardware Run
```
* **STATUS:** `PROVEN`

---

## 📦 Workspace Setup & Recovery Flowchart

```text
Clone GitHub Repository
        │
        ▼
Execute 'FIRST_TIME_FORGEUI_SETUP.bat'
        │
        ▼
Verify System Node.js & npm Status
        │
        ▼
Automated Installation of 'node_modules'
        │
        ▼
Locate System ESP-IDF Python Virtual Env
        │
        ▼
Install Python Graphics Dependencies (Pillow, pypng, lz4)
        │
        ▼
Verify Native 'LVGLImage.py' Compilation Scripts
        │
        ▼
Verify Local OpenAI SDK Integration
        │
        ▼
Validate Standalone C Project Export Environment
        │
        ▼
Launch Active ForgeUI Studio Web Server
```
* **STATUS:** `PROVEN`

---

## 🎨 Asset & Component Workspace Registry
```text
main/
├── CMakeLists.txt         <-- Component registration & strict macro requirements
├── main.c                 <-- Global RTOS scheduler and initial driver startup
├── 00_ForgeUI_Config.h    <-- Hardware pin configurations and canvas layout boundaries
├── 01_FG_Runtime.c        <-- Asynchronous execution loop hooks for screen redraws
├── 20_RTC.c               <-- High-accuracy DS3231 I2C real-time clock tickers
├── 30_Audio.c             <-- Asynchronous MP3 / WAV hardware decoder hooks
├── 30_WIFI.c              <-- Hosted SDIO networking driver hooks utilizing co-processors
├── 40_SD.c                <-- Local SPIFFS / FATFS SD storage block initializations
├── 90_Studio_Export.c     <-- Pure, native LVGL v9 HMI generated UI source file
└── assets/
    └── uploads/           <-- Auto-converted binary frames (Neural Core background assets)
```

---

## 🏛️ Standalone Project Philosophy
ForgeUI Studio strictly acts as an **accelerator, visual designer, and framework generation toolchain**. 

The exported project code contains **zero vendor lock-in**. It ships as a standard, fully configured ESP-IDF template. Developers are completely free to disconnect from the studio environment and execute custom low-level engineering directly inside Visual Studio Code or terminal environments by wrapping features onto the decoupled hooks:
* Direct Peripherals (`GPIO`, `I2C`, `SPI`, `UART`, `TWAI/CAN`)
* High-Performance Driver Layers (`DMA`, `PPA` hardware acceleration pipelines)
* Cloud Networking & Middleware Layers
* Advanced Business Logic Tasks

---

## 🚀 Upcoming Development Phase: AI Engine V3

### Architectural Target
```text
ForgeAIPanel ➔ ForgeAIClient ➔ ForgeAIEngine ➔ ContextBuilder ➔ PromptBuilder ➔ AIProvider (OpenAI / Ollama / Anthropic / Gemini)
```

### Module Structure Expansion Plan
```text
forgeui/ai/
├── engine/
│   ├── ForgeAIEngine.ts        <-- Core AI abstraction orchestra block
│   ├── ContextBuilder.ts       <-- Packages current layout, canvas themes, & asset maps
│   └── PromptBuilder.ts        <-- Generates instructions for layout adjustments
├── providers/
│   ├── AIProvider.ts           <-- Abstract interface class for model agnostic calls
│   └── OpenAIProvider.ts       <-- Live cloud provider connector (Add-on: Ollama/Gemini)
├── validation/
│   ├── LayoutValidator.ts      <-- Deep node verification checks
│   └── LayoutRepair.ts         <-- Automatic healing of corrupted JSON nodes
└── knowledge/
    └── ComponentKnowledge.ts   <-- Frozen component properties library for LVGL 9 APIs
```

### Planned Capabilities
* **Active Screen Modification:** Mutate, scale, or edit existing interfaces using localized contextual prompt updates without replacing the whole design document.
* **Automated Design Theme Generator:** Generate custom light, dark, and specialized hex theme states from text commands.
* **Asset Aware Prompts:** Checks `assets/uploads/` arrays so the engine knows what background files are locally compilation-ready.
* **Automatic Layout Repair:** Catches broken coordinates or missing elements before compilation, self-correcting structural nodes.
* **Multi-Screen Project Tracking:** Enables generation and contextual mapping of complex workflows spanning multiple independent container screens.

---

## 🎯 Current Priority: AI Playground V2
1. Map physical **Generate Layout** visual buttons to server endpoint `/api/forgeui-ai-layout`.
2. Map response JSON specs into the system editor via `setLayoutJson(JSON.stringify(document, null, 2))`.
3. Use the **Insert JSON** block as a manual layout verification gateway.
4. Scale tested design panels over real targets to expand custom interface libraries.
