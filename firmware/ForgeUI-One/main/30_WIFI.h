#pragma once

#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

#define FG_WIFI_MAX_SCAN 12

typedef enum {
    FG_WIFI_STATE_OFF = 0,
    FG_WIFI_STATE_INIT,
    FG_WIFI_STATE_READY,
    FG_WIFI_STATE_CONNECTING,
    FG_WIFI_STATE_CONNECTED,
    FG_WIFI_STATE_DISCONNECTING,
    FG_WIFI_STATE_DISCONNECTED,
    FG_WIFI_STATE_SCANNING,
    FG_WIFI_STATE_ERROR
} fg_wifi_state_t;

typedef enum {
    FG_WIFI_OP_OK = 0,
    FG_WIFI_OP_ACCEPTED,
    FG_WIFI_OP_BUSY,
    FG_WIFI_OP_ALREADY_RUNNING,
    FG_WIFI_OP_NOT_READY,
    FG_WIFI_OP_INVALID_ARGUMENT,
    FG_WIFI_OP_FAILED,
    FG_WIFI_OP_AUTH_FAILED,
    FG_WIFI_OP_TIMEOUT
} fg_wifi_result_t;

typedef enum {
    FG_WIFI_SECURITY_OPEN = 0,
    FG_WIFI_SECURITY_WEP,
    FG_WIFI_SECURITY_WPA,
    FG_WIFI_SECURITY_WPA2,
    FG_WIFI_SECURITY_WPA_WPA2,
    FG_WIFI_SECURITY_WPA3,
    FG_WIFI_SECURITY_WPA2_WPA3,
    FG_WIFI_SECURITY_ENTERPRISE,
    FG_WIFI_SECURITY_UNKNOWN
} fg_wifi_security_t;

typedef struct {
    char ssid[33];
    int rssi;
    fg_wifi_security_t security;
    bool connected;
    bool saved;
    uint8_t bssid[6];
    uint8_t channel;
} fg_wifi_network_t;

typedef struct {
    fg_wifi_state_t state;
    char ssid[33];
    int rssi;
    char ip[16];
    char gateway[16];
    fg_wifi_security_t security;
    uint8_t station_mac[6];
    uint8_t ap_bssid[6];
    fg_wifi_result_t latest_result;
    char error_reason[48];
    bool ready;
    bool connected;
    bool scan_in_progress;
    bool saved;
} fg_wifi_snapshot_t;

void fg_wifi_init(void);
void fg_wifi_pump(void);

bool fg_wifi_is_ready(void);
bool fg_wifi_is_connected(void);
fg_wifi_state_t fg_wifi_state(void);
const char *fg_wifi_status_text(void);
const char *fg_wifi_ip_text(void);
const char *fg_wifi_ssid_text(void);
int fg_wifi_rssi(void);
bool fg_wifi_scan_in_progress(void);

fg_wifi_result_t fg_wifi_get_snapshot(fg_wifi_snapshot_t *snapshot);
const char *fg_wifi_security_text(fg_wifi_security_t security);

fg_wifi_result_t fg_wifi_scan_start(void);
int fg_wifi_get_networks(fg_wifi_network_t *networks, int max);
int fg_wifi_get_scan_results(char ssids[][33], int max);

fg_wifi_result_t fg_wifi_connect_network(const fg_wifi_network_t *network,
                                         const char *password,
                                         bool remember);
void fg_wifi_connect(const char *ssid, const char *pass);
fg_wifi_result_t fg_wifi_disconnect(void);
fg_wifi_result_t fg_wifi_forget(void);
fg_wifi_result_t fg_wifi_reconnect(void);

#ifdef __cplusplus
}
#endif
