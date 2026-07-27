#include "30_WIFI.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "esp_err.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_netif.h"
#include "esp_wifi.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const char *TAG = "FG_WIFI";
#define FG_WIFI_CONNECT_TIMEOUT_MS 20000

static bool g_ready;
static bool g_connected;
static volatile bool g_scan_in_progress;
static fg_wifi_state_t g_state = FG_WIFI_STATE_OFF;
static fg_wifi_result_t g_latest_result = FG_WIFI_OP_OK;
static TickType_t g_connect_started;
static esp_netif_t *g_sta_netif;
static char g_status[32] = "OFF";
static char g_error[48] = "";
static char g_ip[16] = "-";
static char g_gateway[16] = "-";
static char g_ssid[33] = "-";
static int g_rssi;
static fg_wifi_security_t g_security = FG_WIFI_SECURITY_UNKNOWN;
static uint8_t g_station_mac[6];
static uint8_t g_ap_bssid[6];
static char g_saved_ssid[33];
static bool g_has_saved;
static fg_wifi_network_t g_networks[FG_WIFI_MAX_SCAN];
static int g_network_count;
static portMUX_TYPE g_network_lock = portMUX_INITIALIZER_UNLOCKED;

static void set_status(const char *status, fg_wifi_result_t result)
{
    snprintf(g_status, sizeof(g_status), "%s", status ? status : "-");
    g_latest_result = result;
}

static void set_error(const char *status, fg_wifi_result_t result, const char *reason)
{
    set_status(status, result);
    snprintf(g_error, sizeof(g_error), "%s", reason ? reason : status);
    if (!g_connected) g_state = FG_WIFI_STATE_ERROR;
}

static fg_wifi_security_t security_from_auth(wifi_auth_mode_t auth)
{
    switch (auth) {
        case WIFI_AUTH_OPEN: return FG_WIFI_SECURITY_OPEN;
        case WIFI_AUTH_WEP: return FG_WIFI_SECURITY_WEP;
        case WIFI_AUTH_WPA_PSK: return FG_WIFI_SECURITY_WPA;
        case WIFI_AUTH_WPA2_PSK: return FG_WIFI_SECURITY_WPA2;
        case WIFI_AUTH_WPA_WPA2_PSK: return FG_WIFI_SECURITY_WPA_WPA2;
        case WIFI_AUTH_WPA3_PSK: return FG_WIFI_SECURITY_WPA3;
        case WIFI_AUTH_WPA2_WPA3_PSK: return FG_WIFI_SECURITY_WPA2_WPA3;
        case WIFI_AUTH_WPA2_ENTERPRISE:
        case WIFI_AUTH_WPA3_ENT_192: return FG_WIFI_SECURITY_ENTERPRISE;
        default: return FG_WIFI_SECURITY_UNKNOWN;
    }
}

const char *fg_wifi_security_text(fg_wifi_security_t security)
{
    switch (security) {
        case FG_WIFI_SECURITY_OPEN: return "Open";
        case FG_WIFI_SECURITY_WEP: return "WEP";
        case FG_WIFI_SECURITY_WPA: return "WPA";
        case FG_WIFI_SECURITY_WPA2: return "WPA2";
        case FG_WIFI_SECURITY_WPA_WPA2: return "WPA/WPA2";
        case FG_WIFI_SECURITY_WPA3: return "WPA3";
        case FG_WIFI_SECURITY_WPA2_WPA3: return "WPA2/WPA3";
        case FG_WIFI_SECURITY_ENTERPRISE: return "Enterprise";
        default: return "Unknown";
    }
}

static void clear_station(void)
{
    snprintf(g_ip, sizeof(g_ip), "-");
    snprintf(g_gateway, sizeof(g_gateway), "-");
    snprintf(g_ssid, sizeof(g_ssid), "-");
    memset(g_ap_bssid, 0, sizeof(g_ap_bssid));
    g_rssi = 0;
    g_security = FG_WIFI_SECURITY_UNKNOWN;
}

static void refresh_station(void)
{
    wifi_ap_record_t ap = {0};
    if (g_connected && esp_wifi_sta_get_ap_info(&ap) == ESP_OK) {
        snprintf(g_ssid, sizeof(g_ssid), "%s", (const char *)ap.ssid);
        g_rssi = ap.rssi;
        g_security = security_from_auth(ap.authmode);
        memcpy(g_ap_bssid, ap.bssid, sizeof(g_ap_bssid));
    }
    if (g_sta_netif) {
        esp_netif_ip_info_t info = {0};
        if (esp_netif_get_ip_info(g_sta_netif, &info) == ESP_OK) {
            snprintf(g_ip, sizeof(g_ip), IPSTR, IP2STR(&info.ip));
            snprintf(g_gateway, sizeof(g_gateway), IPSTR, IP2STR(&info.gw));
        }
    }
}

static bool saved_ssid(char out[33])
{
    if (!g_has_saved) return false;
    if (out) snprintf(out, 33, "%s", g_saved_ssid);
    return true;
}

static int network_compare(const void *left, const void *right)
{
    const fg_wifi_network_t *a = left;
    const fg_wifi_network_t *b = right;
    if (a->connected != b->connected) return a->connected ? -1 : 1;
    return b->rssi - a->rssi;
}

static void collect_scan_results(void)
{
    uint16_t count = 0;
    if (esp_wifi_scan_get_ap_num(&count) != ESP_OK) {
        set_error("SCAN_COUNT_FAIL", FG_WIFI_OP_FAILED, "Unable to read scan count");
        return;
    }
    wifi_ap_record_t records[FG_WIFI_MAX_SCAN] = {0};
    uint16_t requested = count > FG_WIFI_MAX_SCAN ? FG_WIFI_MAX_SCAN : count;
    if (requested && esp_wifi_scan_get_ap_records(&requested, records) != ESP_OK) {
        set_error("SCAN_READ_FAIL", FG_WIFI_OP_FAILED, "Unable to read scan results");
        return;
    }
    fg_wifi_network_t collected[FG_WIFI_MAX_SCAN] = {0};
    int collected_count = 0;
    char persisted[33] = "";
    bool has_saved = saved_ssid(persisted);
    for (int i = 0; i < requested; ++i) {
        const char *ssid = (const char *)records[i].ssid;
        if (!ssid[0]) continue;
        int duplicate = -1;
        for (int j = 0; j < collected_count; ++j) {
            if (strcmp(collected[j].ssid, ssid) == 0) { duplicate = j; break; }
        }
        if (duplicate >= 0 && collected[duplicate].rssi >= records[i].rssi) continue;
        int index = duplicate >= 0 ? duplicate : collected_count++;
        fg_wifi_network_t *network = &collected[index];
        memset(network, 0, sizeof(*network));
        snprintf(network->ssid, sizeof(network->ssid), "%s", ssid);
        network->rssi = records[i].rssi;
        network->security = security_from_auth(records[i].authmode);
        network->channel = records[i].primary;
        memcpy(network->bssid, records[i].bssid, sizeof(network->bssid));
        network->connected = g_connected && strcmp(g_ssid, network->ssid) == 0;
        network->saved = has_saved && strcmp(persisted, network->ssid) == 0;
    }
    qsort(collected, collected_count, sizeof(collected[0]), network_compare);
    taskENTER_CRITICAL(&g_network_lock);
    memcpy(g_networks, collected, sizeof(g_networks));
    g_network_count = collected_count;
    taskEXIT_CRITICAL(&g_network_lock);
    g_error[0] = 0;
    set_status(collected_count ? (g_connected ? "CONNECTED" : "SCAN_DONE") : "SCAN_EMPTY", FG_WIFI_OP_OK);
    if (!g_connected) g_state = FG_WIFI_STATE_READY;
}

static void hosted_scan_task(void *arg)
{
    (void)arg;
    wifi_scan_config_t config = { .show_hidden = false };
    esp_err_t err = esp_wifi_scan_start(&config, true);
    if (err == ESP_OK) {
        collect_scan_results();
    } else {
        set_error("SCAN_FAIL", FG_WIFI_OP_FAILED, esp_err_to_name(err));
    }
    g_scan_in_progress = false;
    vTaskDelete(NULL);
}

static void event_handler(void *arg, esp_event_base_t base, int32_t id, void *data)
{
    (void)arg;
    if (base == WIFI_EVENT && id == WIFI_EVENT_STA_START) {
        g_state = FG_WIFI_STATE_READY;
        set_status("READY", FG_WIFI_OP_OK);
    } else if (base == WIFI_EVENT && id == WIFI_EVENT_STA_DISCONNECTED) {
        wifi_event_sta_disconnected_t *event = data;
        bool was_connecting = g_state == FG_WIFI_STATE_CONNECTING;
        g_connected = false;
        clear_station();
        if (was_connecting && event &&
            (event->reason == WIFI_REASON_AUTH_FAIL ||
             event->reason == WIFI_REASON_4WAY_HANDSHAKE_TIMEOUT ||
             event->reason == WIFI_REASON_HANDSHAKE_TIMEOUT)) {
            set_error("AUTH_FAILED", FG_WIFI_OP_AUTH_FAILED, "Authentication failed");
        } else if (was_connecting) {
            set_error("CONNECT_FAILED", FG_WIFI_OP_FAILED, "Connection failed");
        } else {
            g_state = FG_WIFI_STATE_DISCONNECTED;
            set_status("DISCONNECTED", FG_WIFI_OP_OK);
        }
    } else if (base == IP_EVENT && id == IP_EVENT_STA_GOT_IP) {
        g_connected = true;
        g_state = FG_WIFI_STATE_CONNECTED;
        g_error[0] = 0;
        refresh_station();
        set_status("CONNECTED", FG_WIFI_OP_OK);
    }
}

void fg_wifi_init(void)
{
    g_state = FG_WIFI_STATE_INIT;
    set_status("INIT", FG_WIFI_OP_ACCEPTED);
    esp_err_t err = esp_netif_init();
    if (err != ESP_OK && err != ESP_ERR_INVALID_STATE) { set_error("NETIF_FAIL", FG_WIFI_OP_FAILED, esp_err_to_name(err)); return; }
    err = esp_event_loop_create_default();
    if (err != ESP_OK && err != ESP_ERR_INVALID_STATE) { set_error("EVENT_FAIL", FG_WIFI_OP_FAILED, esp_err_to_name(err)); return; }
    if (!g_sta_netif) g_sta_netif = esp_netif_create_default_wifi_sta();
    wifi_init_config_t config = WIFI_INIT_CONFIG_DEFAULT();
    err = esp_wifi_init(&config);
    if (err != ESP_OK && err != ESP_ERR_INVALID_STATE) { set_error("WIFI_FAIL", FG_WIFI_OP_FAILED, esp_err_to_name(err)); return; }
    esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID, event_handler, NULL, NULL);
    esp_event_handler_instance_register(IP_EVENT, IP_EVENT_STA_GOT_IP, event_handler, NULL, NULL);
    if (esp_wifi_set_mode(WIFI_MODE_STA) != ESP_OK) { set_error("MODE_FAIL", FG_WIFI_OP_FAILED, "Station mode failed"); return; }
    err = esp_wifi_start();
    if (err != ESP_OK && err != ESP_ERR_WIFI_CONN) { set_error("START_FAIL", FG_WIFI_OP_FAILED, esp_err_to_name(err)); return; }
    vTaskDelay(pdMS_TO_TICKS(500));
    esp_wifi_get_mac(WIFI_IF_STA, g_station_mac);
    wifi_config_t persisted = {0};
    esp_wifi_set_storage(WIFI_STORAGE_FLASH);
    if (esp_wifi_get_config(WIFI_IF_STA, &persisted) == ESP_OK && persisted.sta.ssid[0]) {
        snprintf(g_saved_ssid, sizeof(g_saved_ssid), "%s", (const char *)persisted.sta.ssid);
        g_has_saved = true;
    }
    g_ready = true;
    g_state = FG_WIFI_STATE_READY;
    set_status("READY", FG_WIFI_OP_OK);
    ESP_LOGI(TAG, "Hosted WiFi ready");
}

void fg_wifi_pump(void)
{
    TickType_t now = xTaskGetTickCount();
    if (g_state == FG_WIFI_STATE_CONNECTING &&
        (now - g_connect_started) > pdMS_TO_TICKS(FG_WIFI_CONNECT_TIMEOUT_MS)) {
        esp_wifi_disconnect();
        set_error("CONNECT_TIMEOUT", FG_WIFI_OP_TIMEOUT, "Connection timed out");
    }
}

bool fg_wifi_is_ready(void) { return g_ready; }
bool fg_wifi_is_connected(void) { return g_connected; }
fg_wifi_state_t fg_wifi_state(void) { return g_scan_in_progress && !g_connected ? FG_WIFI_STATE_SCANNING : g_state; }
const char *fg_wifi_status_text(void) { return g_status; }
const char *fg_wifi_ip_text(void) { return g_ip; }
const char *fg_wifi_ssid_text(void) { if (g_connected) refresh_station(); return g_ssid; }
int fg_wifi_rssi(void) { if (g_connected) refresh_station(); return g_rssi; }
bool fg_wifi_scan_in_progress(void) { return g_scan_in_progress; }

fg_wifi_result_t fg_wifi_get_snapshot(fg_wifi_snapshot_t *snapshot)
{
    if (!snapshot) return FG_WIFI_OP_INVALID_ARGUMENT;
    if (g_connected) refresh_station();
    memset(snapshot, 0, sizeof(*snapshot));
    snapshot->state = fg_wifi_state();
    snprintf(snapshot->ssid, sizeof(snapshot->ssid), "%s", g_ssid);
    snapshot->rssi = g_rssi;
    snprintf(snapshot->ip, sizeof(snapshot->ip), "%s", g_ip);
    snprintf(snapshot->gateway, sizeof(snapshot->gateway), "%s", g_gateway);
    snapshot->security = g_security;
    memcpy(snapshot->station_mac, g_station_mac, sizeof(snapshot->station_mac));
    memcpy(snapshot->ap_bssid, g_ap_bssid, sizeof(snapshot->ap_bssid));
    snapshot->latest_result = g_latest_result;
    snprintf(snapshot->error_reason, sizeof(snapshot->error_reason), "%s", g_error);
    snapshot->ready = g_ready;
    snapshot->connected = g_connected;
    snapshot->scan_in_progress = g_scan_in_progress;
    char persisted[33] = "";
    snapshot->saved = saved_ssid(persisted) && strcmp(persisted, snapshot->ssid) == 0;
    return FG_WIFI_OP_OK;
}

fg_wifi_result_t fg_wifi_scan_start(void)
{
    if (!g_ready) return g_latest_result = FG_WIFI_OP_NOT_READY;
    if (g_scan_in_progress) return g_latest_result = FG_WIFI_OP_ALREADY_RUNNING;
    if (g_state == FG_WIFI_STATE_CONNECTING || g_state == FG_WIFI_STATE_DISCONNECTING) return g_latest_result = FG_WIFI_OP_BUSY;
    taskENTER_CRITICAL(&g_network_lock);
    memset(g_networks, 0, sizeof(g_networks));
    g_network_count = 0;
    taskEXIT_CRITICAL(&g_network_lock);
    g_scan_in_progress = true;
    set_status("SCANNING", FG_WIFI_OP_ACCEPTED);
    if (xTaskCreate(hosted_scan_task, "fg_wifi_scan", 4096, NULL, 5, NULL) != pdPASS) {
        g_scan_in_progress = false;
        set_error("SCAN_TASK_FAIL", FG_WIFI_OP_FAILED, "Unable to start scan task");
        return FG_WIFI_OP_FAILED;
    }
    return FG_WIFI_OP_ACCEPTED;
}

int fg_wifi_get_networks(fg_wifi_network_t *networks, int max)
{
    if (!networks || max <= 0) return 0;
    taskENTER_CRITICAL(&g_network_lock);
    int count = g_network_count < max ? g_network_count : max;
    memcpy(networks, g_networks, count * sizeof(networks[0]));
    taskEXIT_CRITICAL(&g_network_lock);
    return count;
}

int fg_wifi_get_scan_results(char ssids[][33], int max)
{
    if (!ssids || max <= 0) return 0;
    int count = g_network_count < max ? g_network_count : max;
    for (int i = 0; i < count; ++i) snprintf(ssids[i], 33, "%s", g_networks[i].ssid);
    return count;
}

fg_wifi_result_t fg_wifi_connect_network(const fg_wifi_network_t *network, const char *password, bool remember)
{
    if (!g_ready) return g_latest_result = FG_WIFI_OP_NOT_READY;
    if (!network || !network->ssid[0]) return g_latest_result = FG_WIFI_OP_INVALID_ARGUMENT;
    if (g_scan_in_progress || g_state == FG_WIFI_STATE_CONNECTING) return g_latest_result = FG_WIFI_OP_BUSY;
    bool open = network->security == FG_WIFI_SECURITY_OPEN;
    if (!open && (!password || strlen(password) < 8 || strlen(password) > 63)) {
        set_error("INVALID_PASSWORD", FG_WIFI_OP_INVALID_ARGUMENT, "Password must be 8 to 63 characters");
        return FG_WIFI_OP_INVALID_ARGUMENT;
    }
    wifi_config_t config = {0};
    snprintf((char *)config.sta.ssid, sizeof(config.sta.ssid), "%s", network->ssid);
    if (!open) snprintf((char *)config.sta.password, sizeof(config.sta.password), "%s", password);
    config.sta.threshold.authmode = open ? WIFI_AUTH_OPEN : WIFI_AUTH_WPA_PSK;
    esp_wifi_disconnect();
    esp_wifi_set_storage(remember ? WIFI_STORAGE_FLASH : WIFI_STORAGE_RAM);
    esp_err_t err = esp_wifi_set_config(WIFI_IF_STA, &config);
    esp_wifi_set_storage(WIFI_STORAGE_FLASH);
    if (err != ESP_OK) { set_error("CONFIG_FAIL", FG_WIFI_OP_FAILED, esp_err_to_name(err)); return FG_WIFI_OP_FAILED; }
    if (remember) {
        snprintf(g_saved_ssid, sizeof(g_saved_ssid), "%s", network->ssid);
        g_has_saved = true;
    }
    g_state = FG_WIFI_STATE_CONNECTING;
    g_connect_started = xTaskGetTickCount();
    g_error[0] = 0;
    set_status("CONNECTING", FG_WIFI_OP_ACCEPTED);
    err = esp_wifi_connect();
    if (err != ESP_OK) { set_error("CONNECT_FAIL", FG_WIFI_OP_FAILED, esp_err_to_name(err)); return FG_WIFI_OP_FAILED; }
    return FG_WIFI_OP_ACCEPTED;
}

void fg_wifi_connect(const char *ssid, const char *pass)
{
    fg_wifi_network_t network = {0};
    snprintf(network.ssid, sizeof(network.ssid), "%s", ssid ? ssid : "");
    network.security = pass && pass[0] ? FG_WIFI_SECURITY_WPA2 : FG_WIFI_SECURITY_OPEN;
    (void)fg_wifi_connect_network(&network, pass, true);
}

fg_wifi_result_t fg_wifi_disconnect(void)
{
    if (!g_ready) return g_latest_result = FG_WIFI_OP_NOT_READY;
    g_state = FG_WIFI_STATE_DISCONNECTING;
    set_status("DISCONNECTING", FG_WIFI_OP_ACCEPTED);
    esp_err_t err = esp_wifi_disconnect();
    if (err != ESP_OK && err != ESP_ERR_WIFI_NOT_CONNECT) { set_error("DISCONNECT_FAIL", FG_WIFI_OP_FAILED, esp_err_to_name(err)); return FG_WIFI_OP_FAILED; }
    g_connected = false;
    clear_station();
    g_state = FG_WIFI_STATE_DISCONNECTED;
    set_status("DISCONNECTED", FG_WIFI_OP_OK);
    return FG_WIFI_OP_OK;
}

fg_wifi_result_t fg_wifi_forget(void)
{
    if (!g_ready) return g_latest_result = FG_WIFI_OP_NOT_READY;
    (void)esp_wifi_disconnect();
    wifi_config_t blank = {0};
    esp_wifi_set_storage(WIFI_STORAGE_FLASH);
    if (esp_wifi_set_config(WIFI_IF_STA, &blank) != ESP_OK) {
        set_error("FORGET_FAIL", FG_WIFI_OP_FAILED, "Unable to erase saved credentials");
        return FG_WIFI_OP_FAILED;
    }
    for (int i = 0; i < g_network_count; ++i) g_networks[i].saved = false;
    g_saved_ssid[0] = 0;
    g_has_saved = false;
    g_connected = false;
    clear_station();
    g_state = FG_WIFI_STATE_DISCONNECTED;
    set_status("FORGOTTEN", FG_WIFI_OP_OK);
    return FG_WIFI_OP_OK;
}

fg_wifi_result_t fg_wifi_reconnect(void)
{
    if (!g_ready) return g_latest_result = FG_WIFI_OP_NOT_READY;
    if (!g_has_saved) {
        set_error("NO_SAVED_NETWORK", FG_WIFI_OP_INVALID_ARGUMENT, "No saved network");
        return FG_WIFI_OP_INVALID_ARGUMENT;
    }
    wifi_config_t config = {0};
    if (esp_wifi_get_config(WIFI_IF_STA, &config) != ESP_OK || !config.sta.ssid[0]) {
        set_error("NO_SAVED_NETWORK", FG_WIFI_OP_INVALID_ARGUMENT, "No saved network");
        return FG_WIFI_OP_INVALID_ARGUMENT;
    }
    g_state = FG_WIFI_STATE_CONNECTING;
    g_connect_started = xTaskGetTickCount();
    set_status("CONNECTING", FG_WIFI_OP_ACCEPTED);
    if (esp_wifi_connect() != ESP_OK) {
        set_error("RECONNECT_FAIL", FG_WIFI_OP_FAILED, "Reconnect failed");
        return FG_WIFI_OP_FAILED;
    }
    return FG_WIFI_OP_ACCEPTED;
}
