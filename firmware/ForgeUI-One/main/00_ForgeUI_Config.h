// ============================================================
// ForgeUI One Runtime
// ============================================================
//
// Created by Scott Forster
// Contact: forgeui.esp32@gmail.com
//
// Minimal ESP32-P4 firmware runtime target
// for ESP32-P4 UI Studio.
//
// Responsibilities:
// - ESP-IDF boot
// - BSP display/touch startup
// - LVGL lifecycle
// - generated Studio export execution
// - optional backend hardware services
//
// Studio owns:
// - layout
// - widgets
// - themes
// - colours
// - generated LVGL UI
//
// Powered by ForgeUI
//
// ============================================================

// #define FORGEUI_ENABLE_STUDIO_EXPORT_TEST  1
#define FORGEUI_ENABLE_STUDIO_EXPORT_TEST  2

#pragma once

#include "driver/i2c_master.h"
#include "00_ForgeUI_Features.h"

// ============================================================
// ForgeUI Version
// ============================================================

#define FORGEUI_VERSION_MAJOR              1
#define FORGEUI_VERSION_MINOR              0
#define FORGEUI_VERSION_PATCH              0

// ============================================================
// Core Feature Switches
// ============================================================
//
// These switches control which ForgeUI One modules are compiled
// into the live runtime.
//
// Keep the single-page base light.
// Turn optional hardware features on only when needed.
//
// ============================================================

#define FORGEUI_ENABLE_RTC                 FG_FEATURE_RTC
#define FORGEUI_ENABLE_WIFI                FG_FEATURE_WIFI
#define FORGEUI_ENABLE_SD                  FG_FEATURE_SD_CARD
#define FORGEUI_ENABLE_AUDIO               FG_FEATURE_AUDIO

// ============================================================
// Display Options
// ============================================================

#define FORGEUI_ROTATION_0                 0
#define FORGEUI_ROTATION_180               1

#define FORGEUI_DISPLAY_ROTATION           FORGEUI_ROTATION_180

// ============================================================
// WiFi Backend Options
// ============================================================
//
// ESP32-P4 has no native WiFi radio.
//
// ForgeUI One WiFi path:
//
// ESP32-P4
// -> ESP-Hosted
// -> SDIO
// -> ESP32-C6
// -> WiFi Remote
//
// ============================================================

#define FORGEUI_WIFI_BACKEND_NONE          0
#define FORGEUI_WIFI_BACKEND_HOSTED        1

#if FORGEUI_ENABLE_WIFI
#define FORGEUI_WIFI_BACKEND               FORGEUI_WIFI_BACKEND_HOSTED
#else
#define FORGEUI_WIFI_BACKEND               FORGEUI_WIFI_BACKEND_NONE
#endif

// ============================================================
// RTC Backend Options
// ============================================================

#define FORGEUI_RTC_BACKEND_NONE           0
#define FORGEUI_RTC_BACKEND_ESP_NVS        1
#define FORGEUI_RTC_BACKEND_DS3231         2

// ============================================================
// Active RTC Backend
// ============================================================
//
// DS3231 is the preferred retained-time backend.
// ESP_NVS is a fallback/software-only option.
//
// ============================================================

#if FORGEUI_ENABLE_RTC
#define FORGEUI_RTC_BACKEND                FORGEUI_RTC_BACKEND_DS3231
#else
#define FORGEUI_RTC_BACKEND                FORGEUI_RTC_BACKEND_ESP_NVS
#endif

// ============================================================
// DS3231 Settings
// ============================================================
//
// Board path:
// - DS3231 on BSP I2C bus
// - address 0x68
// - ESP32-P4 I2C_NUM_0
//
// ============================================================

#define FORGEUI_DS3231_ADDR                0x68
#define FORGEUI_DS3231_I2C_PORT            I2C_NUM_0

#define FORGEUI_DS3231_SDA_IO              7
#define FORGEUI_DS3231_SCL_IO              8

// ============================================================
// SD / WiFi Boot Order Truth
// ============================================================
//
// Current proven stable Hosted WiFi + SD order:
//
//   WiFi init first
//   -> SD mount second
//
// Do not mount SD before Hosted WiFi on this ESP32-P4 board
// unless this has been retested and proven again.
//
// ============================================================

// ============================================================
// Runtime Ownership Rules
// ============================================================
//
// main.c:
// - boot order only
// - board bring-up only
// - LVGL startup only
//
// backend modules:
// - own hardware state
// - own system truth
//
// UI modules:
// - render only
// - send intent only
// - no hardware ownership
//
// ============================================================

// ============================================================
// ForgeUI One Identity
// ============================================================
//
// This project is ForgeUI One.
//
// Do not reintroduce old runtime names:
// - ForkGuard
// - Reactor UI
// - LVGL demo widgets
// - vendor demo runtime ownership
//
// Old names may only appear in historical notes,
// never in active module ownership.
//
// ============================================================
//
// Powered by ForgeUI
//
// Build cool stuff.
// Enjoy.
// Let me know how your project goes.
//
// ============================================================
