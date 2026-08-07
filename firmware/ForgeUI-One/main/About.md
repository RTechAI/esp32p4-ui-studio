Production-ready LVGL v9 framework and ESP-IDF baseline for the ESP32-P4 RISC-V MCU.

ForgeUI provides a clean, modular, hardware-proven embedded UI foundation for developers building real ESP32-P4 products using LVGL and ESP-IDF.

Pre-configured and tested on the:

Waveshare ESP32-P4-WIFI6-Touch-LCD-7B

ForgeUI removes the painful low-level bring-up stage by already integrating:

- EK79007 display path
- GT911 touch support
- ESP-Hosted WiFi
- ESP32-C6 remote WiFi transport
- optional per-project DS3231 RTC support with software/NVS fallback
- SD card integration
- LVGL v9 runtime
- modular UI architecture
- keyboard overlays
- configurable feature system
- clean ownership boundaries

ForgeUI intentionally avoids demo-driven runtime architecture and instead focuses on:

- stable hardware bring-up
- clean module ownership
- reusable embedded UI patterns
- safe LVGL runtime rules
- production-oriented structure
- real-world ESP32-P4 integration

Core architecture principles:

- main.c owns boot order only
- backends own system truth
- UI renders state only
- no unsafe async LVGL calls
- modular compile-time feature control
- no hidden subsystem ownership

Current proven features include:

- display operational
- touch operational
- hosted WiFi operational
- WiFi scan/connect/disconnect
- RTC persistence
- audio path support
- SD card support
- theme foundation
- keyboard overlay system
- status drawer architecture
- single-page and modular UI baselines

External RTC is selected in **ForgeUI Studio → Board: ESP32-P4 7B → Configure Hardware → Hardware Configuration → Optional Hardware → External RTC**. The persisted `firmwareFeatures.rtc` project setting controls DS3231 support at I2C `0x68` for Live Studio and Standalone Export; it is not a runtime System-menu option. Disabled output uses `FG_FEATURE_RTC 0`, makes no DS3231 hardware access and retains software/NVS time. Legacy projects missing the field normalize to enabled.

ForgeUI is designed as a clean starting point for:

- embedded products
- industrial UI systems
- ESP32-P4 experimentation
- LVGL projects
- touch-screen appliances
- dashboards
- games
- kiosk systems
- hardware prototypes
- commercial firmware platforms

Built using:

- ESP-IDF v5.5.x
- LVGL v9
- ESP-Hosted
- Waveshare BSP ecosystem
- Espressif managed components

ForgeUI intentionally favors clarity, stability, and maintainability over demo complexity.

Powered by ForgeUI.
