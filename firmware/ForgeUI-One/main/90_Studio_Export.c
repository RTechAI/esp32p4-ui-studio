#include "90_Studio_Export.h"
#include "lvgl.h"
#include "bsp/display.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;
static lv_obj_t * fg_application_page = NULL;
static lv_obj_t * fg_system_launcher_page = NULL;
static lv_obj_t * fg_system_brightness_page = NULL;
static lv_obj_t * fg_system_brightness_label = NULL;
static lv_obj_t * fg_system_wifi_page = NULL;
static lv_obj_t * fg_system_wifi_state_label = NULL;
static lv_obj_t * fg_system_wifi_ssid_label = NULL;
static lv_obj_t * fg_system_wifi_ip_label = NULL;
static lv_obj_t * fg_system_wifi_rssi_label = NULL;
static lv_obj_t * fg_system_wifi_raw_label = NULL;
static lv_obj_t * fg_system_wifi_scan_label = NULL;
static lv_obj_t * fg_system_wifi_network_container = NULL;
static lv_obj_t * fg_system_wifi_network_list = NULL;
static lv_obj_t * fg_system_wifi_scan_button = NULL;
static lv_obj_t * fg_system_wifi_disconnect_button = NULL;
static lv_obj_t * fg_system_wifi_connect_button = NULL;
static char fg_system_wifi_network_cache[512] = "";
static uint8_t fg_system_brightness_percent = 100;
static void fg_wifi_tick_cb(lv_timer_t *timer);

static void FG_Set_Display_Brightness(uint8_t percent)
{
    if (percent < 10) percent = 10;
    if (percent > 100) percent = 100;
    fg_system_brightness_percent = percent;
    (void)bsp_display_brightness_set((int)percent);
}

static void fg_system_show_page(lv_obj_t * page)
{
    if (!fg_application_page || !fg_system_launcher_page || !fg_system_brightness_page || !fg_system_wifi_page) return;
    lv_obj_add_flag(fg_application_page, LV_OBJ_FLAG_HIDDEN);
    lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);
    lv_obj_add_flag(fg_system_brightness_page, LV_OBJ_FLAG_HIDDEN);
    lv_obj_add_flag(fg_system_wifi_page, LV_OBJ_FLAG_HIDDEN);
    lv_obj_clear_flag(page, LV_OBJ_FLAG_HIDDEN);
    lv_obj_move_foreground(page);
}

static void fg_system_open_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_show_page(fg_system_launcher_page);
}

static void fg_system_close_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_show_page(fg_application_page);
}

static void fg_system_open_brightness_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_show_page(fg_system_brightness_page);
}

static void fg_system_brightness_back_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_show_page(fg_system_launcher_page);
}

static void fg_system_open_wifi_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_wifi_tick_cb(NULL);
    fg_system_show_page(fg_system_wifi_page);
}

static void fg_system_wifi_back_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_show_page(fg_system_launcher_page);
}

static void fg_system_wifi_scan_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    if (fg_wifi_scan_in_progress()) return;
    fg_wifi_scan_start();
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_disconnect_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_wifi_disconnect();
    fg_wifi_tick_cb(NULL);
}

static void fg_system_brightness_changed_cb(lv_event_t * event)
{
    lv_obj_t * slider = lv_event_get_target(event);
    if (!slider) return;
    uint8_t percent = (uint8_t)lv_slider_get_value(slider);
    FG_Set_Display_Brightness(percent);
    if (fg_system_brightness_label) {
        lv_label_set_text_fmt(fg_system_brightness_label, "%u%%", (unsigned)fg_system_brightness_percent);
    }
}

static lv_obj_t * fg_system_create_button(lv_obj_t * parent, const char * text, int32_t x, int32_t y, int32_t width, int32_t height)
{
    lv_obj_t * button = lv_button_create(parent);
    lv_obj_set_pos(button, x, y);
    lv_obj_set_size(button, width, height);
    lv_obj_set_style_radius(button, 12, 0);
    lv_obj_set_style_bg_color(button, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_border_color(button, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(button, 2, 0);
    lv_obj_t * label = lv_label_create(button);
    lv_label_set_text(label, text);
    lv_obj_set_style_text_color(label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_align(label, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_center(label);
    return button;
}

static void fg_system_create_disabled_card(lv_obj_t * parent, const char * text, int32_t x, int32_t y)
{
    lv_obj_t * card = lv_obj_create(parent);
    lv_obj_set_pos(card, x, y);
    lv_obj_set_size(card, 220, 180);
    lv_obj_clear_flag(card, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_radius(card, 12, 0);
    lv_obj_set_style_bg_color(card, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(card, LV_OPA_50, 0);
    lv_obj_set_style_border_color(card, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(card, 1, 0);
    lv_obj_t * label = lv_label_create(card);
    lv_label_set_text(label, text);
    lv_obj_set_style_text_color(label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(label, LV_OPA_60, 0);
    lv_obj_set_style_text_align(label, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_center(label);
}

static void fg_clock_tick_cb(lv_timer_t *timer)
{
    LV_UNUSED(timer);

    static bool show_colon = true;

    char time_buf[16];
    fg_rtc_format_time(time_buf, sizeof(time_buf));

    if (!show_colon)
    {
        time_buf[2] = ' ';
    }

    show_colon = !show_colon;

    if (fg_clock_label)
    {
        lv_label_set_text(fg_clock_label, time_buf);
    }
}

static void fg_wifi_tick_cb(lv_timer_t *timer)
{
    LV_UNUSED(timer);

    fg_wifi_pump();

    if (fg_wifi_label) {
        char wifi_buf[128];
        snprintf(wifi_buf, sizeof(wifi_buf), "WIFI\n%s\nIP: %s", fg_wifi_status_text(), fg_wifi_ip_text());
        lv_label_set_text(fg_wifi_label, wifi_buf);
    }

    if (!fg_system_wifi_page) return;

    const char * state_text = "OFF";
    switch (fg_wifi_state()) {
        case FG_WIFI_STATE_INIT: state_text = "Initializing"; break;
        case FG_WIFI_STATE_READY: state_text = "Ready"; break;
        case FG_WIFI_STATE_CONNECTING: state_text = "Connecting"; break;
        case FG_WIFI_STATE_CONNECTED: state_text = "Connected"; break;
        case FG_WIFI_STATE_DISCONNECTED: state_text = "Disconnected"; break;
        case FG_WIFI_STATE_SCANNING: state_text = "Scanning"; break;
        case FG_WIFI_STATE_ERROR: state_text = "Error"; break;
        case FG_WIFI_STATE_OFF:
        default: break;
    }
    bool scanning = fg_wifi_scan_in_progress();
    if (fg_system_wifi_state_label) lv_label_set_text(fg_system_wifi_state_label, scanning ? "Scanning" : state_text);
    if (fg_system_wifi_ssid_label) lv_label_set_text_fmt(fg_system_wifi_ssid_label, "Network: %s", fg_wifi_ssid_text());
    if (fg_system_wifi_ip_label) lv_label_set_text_fmt(fg_system_wifi_ip_label, "IP: %s", fg_wifi_ip_text());
    if (fg_system_wifi_rssi_label) {
        int rssi = fg_wifi_rssi();
        if (rssi == 0) lv_label_set_text(fg_system_wifi_rssi_label, "Signal: unavailable");
        else lv_label_set_text_fmt(fg_system_wifi_rssi_label, "Signal: %d dBm", rssi);
    }
    if (fg_system_wifi_raw_label) lv_label_set_text_fmt(fg_system_wifi_raw_label, "Status: %s", fg_wifi_status_text());
    if (fg_system_wifi_scan_label) lv_label_set_text(fg_system_wifi_scan_label, scanning ? "Scanning for nearby networks..." : "Available Networks");

    if (fg_system_wifi_scan_button) {
        if (scanning) lv_obj_add_state(fg_system_wifi_scan_button, LV_STATE_DISABLED);
        else lv_obj_clear_state(fg_system_wifi_scan_button, LV_STATE_DISABLED);
    }
    if (fg_system_wifi_disconnect_button) {
        fg_wifi_state_t state = fg_wifi_state();
        if (state == FG_WIFI_STATE_CONNECTED || state == FG_WIFI_STATE_CONNECTING) lv_obj_clear_state(fg_system_wifi_disconnect_button, LV_STATE_DISABLED);
        else lv_obj_add_state(fg_system_wifi_disconnect_button, LV_STATE_DISABLED);
    }

    char ssids[12][33] = {{0}};
    int count = fg_wifi_get_scan_results(ssids, 12);
    char network_text[512] = "";
    size_t used = 0;
    for (int i = 0; i < count && used < sizeof(network_text); i++) {
        int written = snprintf(network_text + used, sizeof(network_text) - used, "%s%s", i ? "\n" : "", ssids[i]);
        if (written < 0 || (size_t)written >= sizeof(network_text) - used) break;
        used += (size_t)written;
    }
    if (count == 0) snprintf(network_text, sizeof(network_text), "%s", scanning ? "Scanning..." : "No networks found. Tap Scan Networks.");
    if (fg_system_wifi_network_list && strcmp(network_text, fg_system_wifi_network_cache) != 0) {
        snprintf(fg_system_wifi_network_cache, sizeof(fg_system_wifi_network_cache), "%s", network_text);
        lv_label_set_text(fg_system_wifi_network_list, fg_system_wifi_network_cache);
    }
}

// ForgeUI LVGL Export Proof V1
// Generated from ForgeUI Studio

void fg_studio_export_create(lv_obj_t *parent)
{
    // Background flavour: Industrial Carbon
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    fg_application_page = lv_obj_create(parent);
    lv_obj_set_pos(fg_application_page, 0, 0);
    lv_obj_set_size(fg_application_page, 1024, 600);
    lv_obj_clear_flag(fg_application_page, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_application_page, 0, 0);
    lv_obj_set_style_border_width(fg_application_page, 0, 0);
    lv_obj_set_style_radius(fg_application_page, 0, 0);
    lv_obj_set_style_bg_color(fg_application_page, lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(fg_application_page, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784342478518_b95a7dc0);
    lv_obj_t * bg_texture_0 = lv_image_create(fg_application_page);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784342478518_b95a7dc0);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);


    lv_obj_t * system_gear = fg_system_create_button(fg_application_page, LV_SYMBOL_SETTINGS, 922, 18, 84, 84);
    lv_obj_t * system_gear_label = lv_obj_get_child(system_gear, 0);
    lv_obj_set_style_text_font(system_gear_label, &lv_font_montserrat_48, 0);
    lv_obj_add_event_cb(system_gear, fg_system_open_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_move_foreground(system_gear);

    fg_system_launcher_page = lv_obj_create(parent);
    lv_obj_set_pos(fg_system_launcher_page, 0, 0);
    lv_obj_set_size(fg_system_launcher_page, 1024, 600);
    lv_obj_clear_flag(fg_system_launcher_page, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_system_launcher_page, 0, 0);
    lv_obj_set_style_border_width(fg_system_launcher_page, 0, 0);
    lv_obj_set_style_radius(fg_system_launcher_page, 0, 0);
    lv_obj_set_style_bg_color(fg_system_launcher_page, lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(fg_system_launcher_page, LV_OPA_COVER, 0);

    lv_obj_t * system_back = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_LEFT "  Back", 22, 14, 132, 58);
    lv_obj_add_event_cb(system_back, fg_system_close_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * system_title = lv_label_create(fg_system_launcher_page);
    lv_label_set_text(system_title, "System");
    lv_obj_set_style_text_color(system_title, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(system_title, &lv_font_montserrat_32, 0);
    lv_obj_align(system_title, LV_ALIGN_TOP_MID, 0, 25);

    lv_obj_t * display_card = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_EYE_OPEN "\nDisplay", 42, 102, 220, 180);
    lv_obj_add_event_cb(display_card, fg_system_open_brightness_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * wifi_card = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_WIFI "\nWi-Fi", 282, 102, 220, 180);
    lv_obj_add_event_cb(wifi_card, fg_system_open_wifi_cb, LV_EVENT_CLICKED, NULL);
    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_BLUETOOTH "\nBluetooth\nComing Later", 522, 102);
    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_VOLUME_MAX "\nSound\nComing Later", 762, 102);
    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_SD_CARD "\nStorage\nComing Later", 42, 302);
    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_HOME "\nDevice\nComing Later", 282, 302);
    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_WARNING "\nDiagnostics\nComing Later", 522, 302);
    lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);

    fg_system_wifi_page = lv_obj_create(parent);
    lv_obj_set_pos(fg_system_wifi_page, 0, 0);
    lv_obj_set_size(fg_system_wifi_page, 1024, 600);
    lv_obj_clear_flag(fg_system_wifi_page, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_system_wifi_page, 0, 0);
    lv_obj_set_style_border_width(fg_system_wifi_page, 0, 0);
    lv_obj_set_style_radius(fg_system_wifi_page, 0, 0);
    lv_obj_set_style_bg_color(fg_system_wifi_page, lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(fg_system_wifi_page, LV_OPA_COVER, 0);

    lv_obj_t * wifi_back = fg_system_create_button(fg_system_wifi_page, LV_SYMBOL_LEFT "  Back", 22, 14, 132, 58);
    lv_obj_add_event_cb(wifi_back, fg_system_wifi_back_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * wifi_title = lv_label_create(fg_system_wifi_page);
    lv_label_set_text(wifi_title, LV_SYMBOL_WIFI "  Wi-Fi");
    lv_obj_set_style_text_color(wifi_title, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(wifi_title, &lv_font_montserrat_32, 0);
    lv_obj_align(wifi_title, LV_ALIGN_TOP_MID, 0, 25);

    lv_obj_t * wifi_status_panel = lv_obj_create(fg_system_wifi_page);
    lv_obj_set_pos(wifi_status_panel, 28, 96);
    lv_obj_set_size(wifi_status_panel, 440, 282);
    lv_obj_clear_flag(wifi_status_panel, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_radius(wifi_status_panel, 12, 0);
    lv_obj_set_style_bg_color(wifi_status_panel, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_border_color(wifi_status_panel, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(wifi_status_panel, 1, 0);
    fg_system_wifi_state_label = lv_label_create(wifi_status_panel);
    lv_label_set_text(fg_system_wifi_state_label, "Off");
    lv_obj_set_pos(fg_system_wifi_state_label, 14, 10);
    lv_obj_set_style_text_color(fg_system_wifi_state_label, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_text_font(fg_system_wifi_state_label, &lv_font_montserrat_28, 0);
    fg_system_wifi_ssid_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_ssid_label, 14, 64);
    lv_obj_set_width(fg_system_wifi_ssid_label, 390);
    lv_label_set_long_mode(fg_system_wifi_ssid_label, LV_LABEL_LONG_DOT);
    fg_system_wifi_ip_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_ip_label, 14, 104);
    fg_system_wifi_rssi_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_rssi_label, 14, 144);
    fg_system_wifi_raw_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_raw_label, 14, 184);
    lv_obj_set_width(fg_system_wifi_raw_label, 390);
    lv_label_set_long_mode(fg_system_wifi_raw_label, LV_LABEL_LONG_DOT);

    fg_system_wifi_scan_button = fg_system_create_button(fg_system_wifi_page, LV_SYMBOL_REFRESH "  Scan Networks", 28, 394, 210, 62);
    lv_obj_add_event_cb(fg_system_wifi_scan_button, fg_system_wifi_scan_cb, LV_EVENT_CLICKED, NULL);
    fg_system_wifi_disconnect_button = fg_system_create_button(fg_system_wifi_page, "Disconnect", 248, 394, 220, 62);
    lv_obj_add_event_cb(fg_system_wifi_disconnect_button, fg_system_wifi_disconnect_cb, LV_EVENT_CLICKED, NULL);
    fg_system_wifi_connect_button = fg_system_create_button(fg_system_wifi_page, "Connect", 28, 468, 440, 58);
    lv_obj_add_state(fg_system_wifi_connect_button, LV_STATE_DISABLED);
    lv_obj_t * wifi_connect_help = lv_label_create(fg_system_wifi_page);
    lv_label_set_text(wifi_connect_help, "Network selection and password support are coming later.");
    lv_obj_set_pos(wifi_connect_help, 42, 540);
    lv_obj_set_style_text_opa(wifi_connect_help, LV_OPA_60, 0);

    fg_system_wifi_scan_label = lv_label_create(fg_system_wifi_page);
    lv_label_set_text(fg_system_wifi_scan_label, "Available Networks");
    lv_obj_set_pos(fg_system_wifi_scan_label, 500, 100);
    lv_obj_set_style_text_font(fg_system_wifi_scan_label, &lv_font_montserrat_20, 0);
    fg_system_wifi_network_container = lv_obj_create(fg_system_wifi_page);
    lv_obj_set_pos(fg_system_wifi_network_container, 490, 136);
    lv_obj_set_size(fg_system_wifi_network_container, 506, 416);
    lv_obj_set_style_radius(fg_system_wifi_network_container, 12, 0);
    lv_obj_set_style_bg_color(fg_system_wifi_network_container, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_border_color(fg_system_wifi_network_container, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_system_wifi_network_container, 1, 0);
    fg_system_wifi_network_list = lv_label_create(fg_system_wifi_network_container);
    lv_obj_set_pos(fg_system_wifi_network_list, 8, 8);
    lv_obj_set_width(fg_system_wifi_network_list, 462);
    lv_label_set_long_mode(fg_system_wifi_network_list, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_system_wifi_network_list, "No networks found. Tap Scan Networks.");
    lv_obj_add_flag(fg_system_wifi_page, LV_OBJ_FLAG_HIDDEN);

    fg_system_brightness_page = lv_obj_create(parent);
    lv_obj_set_pos(fg_system_brightness_page, 0, 0);
    lv_obj_set_size(fg_system_brightness_page, 1024, 600);
    lv_obj_clear_flag(fg_system_brightness_page, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_system_brightness_page, 0, 0);
    lv_obj_set_style_border_width(fg_system_brightness_page, 0, 0);
    lv_obj_set_style_radius(fg_system_brightness_page, 0, 0);
    lv_obj_set_style_bg_color(fg_system_brightness_page, lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(fg_system_brightness_page, LV_OPA_COVER, 0);

    lv_obj_t * brightness_back = fg_system_create_button(fg_system_brightness_page, LV_SYMBOL_LEFT "  Back", 22, 14, 132, 58);
    lv_obj_add_event_cb(brightness_back, fg_system_brightness_back_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * brightness_title = lv_label_create(fg_system_brightness_page);
    lv_label_set_text(brightness_title, "Brightness");
    lv_obj_set_style_text_color(brightness_title, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(brightness_title, &lv_font_montserrat_32, 0);
    lv_obj_align(brightness_title, LV_ALIGN_TOP_MID, 0, 25);
    lv_obj_t * brightness_icon = lv_label_create(fg_system_brightness_page);
    lv_label_set_text(brightness_icon, LV_SYMBOL_EYE_OPEN);
    lv_obj_set_style_text_color(brightness_icon, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_text_font(brightness_icon, &lv_font_montserrat_48, 0);
    lv_obj_align(brightness_icon, LV_ALIGN_TOP_MID, 0, 130);
    fg_system_brightness_label = lv_label_create(fg_system_brightness_page);
    lv_label_set_text_fmt(fg_system_brightness_label, "%u%%", (unsigned)fg_system_brightness_percent);
    lv_obj_set_style_text_color(fg_system_brightness_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_system_brightness_label, &lv_font_montserrat_48, 0);
    lv_obj_align(fg_system_brightness_label, LV_ALIGN_TOP_MID, 0, 210);
    lv_obj_t * brightness_slider = lv_slider_create(fg_system_brightness_page);
    lv_obj_set_size(brightness_slider, 720, 32);
    lv_obj_align(brightness_slider, LV_ALIGN_TOP_MID, 0, 340);
    lv_slider_set_range(brightness_slider, 10, 100);
    lv_slider_set_value(brightness_slider, fg_system_brightness_percent, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(brightness_slider, lv_color_hex(0x2A3138), LV_PART_MAIN);
    lv_obj_set_style_bg_color(brightness_slider, lv_color_hex(0xF2A900), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(brightness_slider, lv_color_hex(0xF5F5F5), LV_PART_KNOB);
    lv_obj_set_style_pad_all(brightness_slider, 12, LV_PART_KNOB);
    lv_obj_add_event_cb(brightness_slider, fg_system_brightness_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);
    lv_obj_t * brightness_min = lv_label_create(fg_system_brightness_page);
    lv_label_set_text(brightness_min, "10%");
    lv_obj_set_style_text_color(brightness_min, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_pos(brightness_min, 140, 390);
    lv_obj_t * brightness_max = lv_label_create(fg_system_brightness_page);
    lv_label_set_text(brightness_max, "100%");
    lv_obj_set_style_text_color(brightness_max, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_pos(brightness_max, 828, 390);
    lv_obj_add_flag(fg_system_brightness_page, LV_OBJ_FLAG_HIDDEN);

    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}