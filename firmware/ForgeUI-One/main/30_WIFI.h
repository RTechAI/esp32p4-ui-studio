#pragma once

#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// ============================================================
// ForgeUI One Hosted WiFi System
// ============================================================
//
// File:
// 30_WIFI.h
//
// Created by:
// Scott Forster
//
// Contact:
// forgeui.esp32@gmail.com
//
// Purpose:
// ESP32-P4 hosted WiFi backend.
//
// Features:
// - hosted WiFi init
// - scan
// - connect/disconnect
// - IP status tracking
// - network forget/reset
// - scan result caching
//
// Runtime Model:
// - backend owns WiFi state
// - UI sends intent only
// - event handler sets flags
// - fg_wifi_pump() processes deferred work
//
// Hardware Path:
//
// ESP32-P4
//   -> ESP-Hosted
//   -> SDIO
//   -> ESP32-C6
//   -> WiFi Remote
//
// Rules:
// - no LVGL ownership
// - no UI styling
// - no direct UI dependencies
//
// ============================================================

// ============================================================
// Runtime WiFi Init
// ============================================================

typedef enum
{
    FG_WIFI_STATE_OFF = 0,
    FG_WIFI_STATE_INIT,
    FG_WIFI_STATE_READY,
    FG_WIFI_STATE_CONNECTING,
    FG_WIFI_STATE_CONNECTED,
    FG_WIFI_STATE_DISCONNECTED,
    FG_WIFI_STATE_SCANNING,
    FG_WIFI_STATE_ERROR
} fg_wifi_state_t;

// Initialise hosted WiFi backend
void fg_wifi_init(void);

// Runtime WiFi pump/helper
void fg_wifi_pump(void);

// ============================================================
// Runtime Status Helpers
// ============================================================

bool fg_wifi_is_ready(void);

bool fg_wifi_is_connected(void);

fg_wifi_state_t fg_wifi_state(void);

const char *fg_wifi_status_text(void);

const char *fg_wifi_ip_text(void);

const char *fg_wifi_ssid_text(void);

// Returns the current station RSSI in dBm, or 0 when unavailable.
int fg_wifi_rssi(void);

bool fg_wifi_scan_in_progress(void);

// ============================================================
// WiFi Scan Helpers
// ============================================================

void fg_wifi_scan_start(void);

int fg_wifi_get_scan_results(char ssids[][33],
                             int max);

// ============================================================
// Connection Helpers
// ============================================================

void fg_wifi_connect(const char *ssid,
                     const char *pass);

void fg_wifi_disconnect(void);

void fg_wifi_forget(void);

#ifdef __cplusplus
}
#endif
