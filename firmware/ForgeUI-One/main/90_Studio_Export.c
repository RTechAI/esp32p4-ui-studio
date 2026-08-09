#include "90_Studio_Export.h"
#include "00_ForgeUI_Features.h"
#include "05_FG_RAM_Probe.h"
#include "lvgl.h"
#include "bsp/display.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "freertos/task.h"
#include "esp_timer.h"
#include "96_FiRuntime.h"
#include <stdbool.h>
#include <stdint.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

LV_IMAGE_DECLARE(fg_upload_ai_hero_1786173676218_aeb0dfd0_rgb565);
LV_IMAGE_DECLARE(fg_upload_ai_hero_1786175544095_ef74779f_rgb565);
LV_IMAGE_DECLARE(fg_upload_ai_hero_1786175636953_e2570088_rgb565);
LV_IMAGE_DECLARE(fg_upload_ai_hero_1786176586614_981a4670_rgb565);
LV_IMAGE_DECLARE(fg_upload_ai_hero_1786175736552_7ca78d5b_rgb565);
LV_IMAGE_DECLARE(fg_upload_ai_hero_1786176018471_8897993e_rgb565);
LV_IMAGE_DECLARE(fg_upload_ai_hero_1786175833774_dcf82046_rgb565);
LV_IMAGE_DECLARE(fg_upload_ai_hero_1786176442715_8a47a244_rgb565);
LV_IMAGE_DECLARE(fg_upload_ai_hero_1786176207823_5b8eb6de_rgb565);
LV_IMAGE_DECLARE(fg_upload_ai_hero_1786175925517_846bc1d6_rgb565);
static lv_obj_t * fg_weather_background_image = NULL;
static const char * fg_weather_background_key = NULL;

static lv_obj_t * fg_wi_fi_status_label = NULL;
static lv_obj_t * fg_weather_date_label = NULL;
static lv_obj_t * fg_weather_time_label = NULL;
static lv_obj_t * fg_weather_temperature_label = NULL;
static lv_obj_t * fg_weather_condition_label = NULL;
static lv_obj_t * fg_weather_feels_like_label = NULL;
static lv_obj_t * fg_weather_humidity_label = NULL;
static lv_obj_t * fg_weather_wind_label = NULL;
static lv_obj_t * fg_weather_rain_label = NULL;
static lv_obj_t * fg_weather_uv_label = NULL;
static lv_obj_t * fg_forecast_day1_name_label = NULL;
static lv_obj_t * fg_forecast_day1_temperature_label = NULL;
static lv_obj_t * fg_forecast_day2_name_label = NULL;
static lv_obj_t * fg_forecast_day2_temperature_label = NULL;
static lv_obj_t * fg_forecast_day3_name_label = NULL;
static lv_obj_t * fg_forecast_day3_temperature_label = NULL;
static lv_obj_t * fg_forecast_day4_name_label = NULL;
static lv_obj_t * fg_forecast_day4_temperature_label = NULL;
static lv_obj_t * fg_forecast_day5_name_label = NULL;
static lv_obj_t * fg_forecast_day5_temperature_label = NULL;
static lv_obj_t * fg_weather_location_label = NULL;
static lv_obj_t * fg_application_page = NULL;
static lv_obj_t * fg_system_launcher_page = NULL;
static lv_obj_t * fg_system_brightness_page = NULL;
static lv_obj_t * fg_system_brightness_label = NULL;
static lv_obj_t * fg_box = NULL;
static bool fg_box_visible = true;
static lv_obj_t * fg_box_2 = NULL;
static bool fg_box_2_visible = true;
static lv_obj_t * fg_box_3 = NULL;
static bool fg_box_3_visible = true;
static lv_obj_t * fg_box_4 = NULL;
static bool fg_box_4_visible = true;
static lv_obj_t * fg_box_5 = NULL;
static bool fg_box_5_visible = true;
static lv_obj_t * fg_box_6 = NULL;
static bool fg_box_6_visible = true;
static lv_obj_t * fg_box_7 = NULL;
static bool fg_box_7_visible = true;
static lv_obj_t * fg_box_8 = NULL;
static bool fg_box_8_visible = true;
static lv_obj_t * fg_box_9 = NULL;
static bool fg_box_9_visible = true;
void FG_Set_Weather_Date_Text(const char * text)
{
    if (fg_weather_date_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_weather_date_label, text);
}

void FG_Set_Weather_Time_Text(const char * text)
{
    if (fg_weather_time_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_weather_time_label, text);
}

void FG_Set_Weather_Temperature_Text(const char * text)
{
    if (fg_weather_temperature_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_weather_temperature_label, text);
}

void FG_Set_Weather_Condition_Text(const char * text)
{
    if (fg_weather_condition_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_weather_condition_label, text);
}

void FG_Set_Weather_Feels_Like_Text(const char * text)
{
    if (fg_weather_feels_like_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_weather_feels_like_label, text);
}

void FG_Set_Weather_Humidity_Text(const char * text)
{
    if (fg_weather_humidity_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_weather_humidity_label, text);
}

void FG_Set_Weather_Wind_Text(const char * text)
{
    if (fg_weather_wind_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_weather_wind_label, text);
}

void FG_Set_Weather_Rain_Text(const char * text)
{
    if (fg_weather_rain_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_weather_rain_label, text);
}

void FG_Set_Weather_UV_Text(const char * text)
{
    if (fg_weather_uv_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_weather_uv_label, text);
}

void FG_Set_Forecast_Day1_Name_Text(const char * text)
{
    if (fg_forecast_day1_name_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_forecast_day1_name_label, text);
}

void FG_Set_Forecast_Day1_Temperature_Text(const char * text)
{
    if (fg_forecast_day1_temperature_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_forecast_day1_temperature_label, text);
}

void FG_Set_Forecast_Day2_Name_Text(const char * text)
{
    if (fg_forecast_day2_name_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_forecast_day2_name_label, text);
}

void FG_Set_Forecast_Day2_Temperature_Text(const char * text)
{
    if (fg_forecast_day2_temperature_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_forecast_day2_temperature_label, text);
}

void FG_Set_Forecast_Day3_Name_Text(const char * text)
{
    if (fg_forecast_day3_name_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_forecast_day3_name_label, text);
}

void FG_Set_Forecast_Day3_Temperature_Text(const char * text)
{
    if (fg_forecast_day3_temperature_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_forecast_day3_temperature_label, text);
}

void FG_Set_Forecast_Day4_Name_Text(const char * text)
{
    if (fg_forecast_day4_name_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_forecast_day4_name_label, text);
}

void FG_Set_Forecast_Day4_Temperature_Text(const char * text)
{
    if (fg_forecast_day4_temperature_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_forecast_day4_temperature_label, text);
}

void FG_Set_Forecast_Day5_Name_Text(const char * text)
{
    if (fg_forecast_day5_name_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_forecast_day5_name_label, text);
}

void FG_Set_Forecast_Day5_Temperature_Text(const char * text)
{
    if (fg_forecast_day5_temperature_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_forecast_day5_temperature_label, text);
}

void FG_Set_Weather_Location_Text(const char * text)
{
    if (fg_weather_location_label == NULL) return;
    if (text == NULL) text = "";
    lv_label_set_text(fg_weather_location_label, text);
}

static lv_obj_t * fg_system_wifi_page = NULL;
static lv_obj_t * fg_system_wifi_state_label = NULL;
static lv_obj_t * fg_system_wifi_ssid_label = NULL;
static lv_obj_t * fg_system_wifi_ip_label = NULL;
static lv_obj_t * fg_system_wifi_gateway_label = NULL;
static lv_obj_t * fg_system_wifi_rssi_label = NULL;
static lv_obj_t * fg_system_wifi_security_label = NULL;
static lv_obj_t * fg_system_wifi_raw_label = NULL;
static lv_obj_t * fg_system_wifi_scan_label = NULL;
static lv_obj_t * fg_system_wifi_network_container = NULL;
static lv_obj_t * fg_system_wifi_network_empty_label = NULL;
static lv_obj_t * fg_system_wifi_network_rows[FG_WIFI_MAX_SCAN] = {0};
static lv_obj_t * fg_system_wifi_network_labels[FG_WIFI_MAX_SCAN] = {0};
static lv_obj_t * fg_system_wifi_scan_button = NULL;
static lv_obj_t * fg_system_wifi_disconnect_button = NULL;
static lv_obj_t * fg_system_wifi_reconnect_button = NULL;
static lv_obj_t * fg_system_wifi_forget_button = NULL;
static lv_obj_t * fg_system_wifi_details_card = NULL;
static lv_obj_t * fg_system_wifi_details_label = NULL;
static lv_obj_t * fg_system_wifi_password_dialog = NULL;
static lv_obj_t * fg_system_wifi_password_input = NULL;
static lv_obj_t * fg_system_wifi_password_title = NULL;
static lv_obj_t * fg_system_wifi_password_error = NULL;
static lv_obj_t * fg_system_wifi_keyboard = NULL;
static lv_obj_t * fg_system_wifi_forget_dialog = NULL;
static lv_obj_t * fg_system_root = NULL;
static fg_wifi_network_t fg_system_wifi_networks[FG_WIFI_MAX_SCAN];
static int fg_system_wifi_network_count = 0;
static int fg_system_wifi_selected = -1;
static bool fg_system_wifi_remember = true;
static bool fg_system_wifi_page_active = false;
static lv_timer_t * fg_system_wifi_timer = NULL;
static bool fg_system_wifi_connected_probe_logged = false;
static uint8_t fg_system_brightness_percent = 100;
static void fg_wifi_tick_cb(lv_timer_t *timer);
static bool fg_system_wifi_create_page(void);
static bool fg_system_wifi_create_password_dialog(void);
static bool fg_system_wifi_create_forget_dialog(void);
static void fg_system_wifi_destroy_ui(void);
static void fg_keyboard_hide(void);
static void fg_keyboard_show_for(lv_obj_t * textarea);
static void fg_keyboard_event_cb(lv_event_t * event);
static lv_obj_t * fg_system_create_button(lv_obj_t * parent, const char * text, int32_t x, int32_t y, int32_t width, int32_t height);

void FG_Set_Box_Visible(bool visible)
{
    if (fg_box == NULL || fg_box_visible == visible) return;
    if (visible) lv_obj_clear_flag(fg_box, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_box, LV_OBJ_FLAG_HIDDEN);
    fg_box_visible = visible;
}

void FG_Set_Box_2_Visible(bool visible)
{
    if (fg_box_2 == NULL || fg_box_2_visible == visible) return;
    if (visible) lv_obj_clear_flag(fg_box_2, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_box_2, LV_OBJ_FLAG_HIDDEN);
    fg_box_2_visible = visible;
}

void FG_Set_Box_3_Visible(bool visible)
{
    if (fg_box_3 == NULL || fg_box_3_visible == visible) return;
    if (visible) lv_obj_clear_flag(fg_box_3, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_box_3, LV_OBJ_FLAG_HIDDEN);
    fg_box_3_visible = visible;
}

void FG_Set_Box_4_Visible(bool visible)
{
    if (fg_box_4 == NULL || fg_box_4_visible == visible) return;
    if (visible) lv_obj_clear_flag(fg_box_4, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_box_4, LV_OBJ_FLAG_HIDDEN);
    fg_box_4_visible = visible;
}

void FG_Set_Box_5_Visible(bool visible)
{
    if (fg_box_5 == NULL || fg_box_5_visible == visible) return;
    if (visible) lv_obj_clear_flag(fg_box_5, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_box_5, LV_OBJ_FLAG_HIDDEN);
    fg_box_5_visible = visible;
}

void FG_Set_Box_6_Visible(bool visible)
{
    if (fg_box_6 == NULL || fg_box_6_visible == visible) return;
    if (visible) lv_obj_clear_flag(fg_box_6, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_box_6, LV_OBJ_FLAG_HIDDEN);
    fg_box_6_visible = visible;
}

void FG_Set_Box_7_Visible(bool visible)
{
    if (fg_box_7 == NULL || fg_box_7_visible == visible) return;
    if (visible) lv_obj_clear_flag(fg_box_7, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_box_7, LV_OBJ_FLAG_HIDDEN);
    fg_box_7_visible = visible;
}

void FG_Set_Box_8_Visible(bool visible)
{
    if (fg_box_8 == NULL || fg_box_8_visible == visible) return;
    if (visible) lv_obj_clear_flag(fg_box_8, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_box_8, LV_OBJ_FLAG_HIDDEN);
    fg_box_8_visible = visible;
}

void FG_Set_Box_9_Visible(bool visible)
{
    if (fg_box_9 == NULL || fg_box_9_visible == visible) return;
    if (visible) lv_obj_clear_flag(fg_box_9, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_box_9, LV_OBJ_FLAG_HIDDEN);
    fg_box_9_visible = visible;
}

static void fg_window_close_cb(lv_event_t * event)
{
    lv_obj_t * window = (lv_obj_t *)lv_event_get_user_data(event);
    if (window) lv_obj_add_flag(window, LV_OBJ_FLAG_HIDDEN);
}

static void FG_Set_Display_Brightness(uint8_t percent)
{
    if (percent < 10) percent = 10;
    if (percent > 100) percent = 100;
    fg_system_brightness_percent = percent;
    (void)bsp_display_brightness_set((int)percent);
}

static void fg_system_show_page(lv_obj_t * page)
{
    if (!page || !fg_application_page) return;
    if (fg_application_page) lv_obj_add_flag(fg_application_page, LV_OBJ_FLAG_HIDDEN);
    if (fg_system_launcher_page) lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);
    if (fg_system_brightness_page) lv_obj_add_flag(fg_system_brightness_page, LV_OBJ_FLAG_HIDDEN);
    if (fg_system_wifi_page) lv_obj_add_flag(fg_system_wifi_page, LV_OBJ_FLAG_HIDDEN);
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
    fg_system_wifi_page_active = false;
    fg_system_show_page(fg_application_page);
    fg_ram_probe_log("13 after returning to the application page");
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
    if (!fg_system_wifi_create_page()) return;
    fg_system_wifi_page_active = true;
    fg_wifi_tick_cb(NULL);
    fg_system_show_page(fg_system_wifi_page);
    fg_ram_probe_log("12 after opening the Manager");
}

static void fg_system_wifi_back_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_wifi_page_active = false;
    fg_system_show_page(fg_system_launcher_page);
    fg_system_wifi_destroy_ui();
    fg_ram_probe_log("14 after closing the Manager");
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

static void fg_system_wifi_reconnect_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    (void)fg_wifi_reconnect();
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_refresh_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    if (!fg_wifi_scan_in_progress()) (void)fg_wifi_scan_start();
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_password_cancel_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_keyboard_hide();
    if (fg_system_wifi_password_input) lv_textarea_set_text(fg_system_wifi_password_input, "");
    if (fg_system_wifi_password_error) lv_label_set_text(fg_system_wifi_password_error, "");
    if (fg_system_wifi_password_dialog) lv_obj_add_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);
    fg_wifi_tick_cb(NULL);
}

static void fg_keyboard_hide(void)
{
    if (!fg_system_wifi_keyboard) return;
    lv_keyboard_set_textarea(fg_system_wifi_keyboard, NULL);
    lv_obj_add_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN);
    if (fg_system_wifi_password_dialog) {
        lv_obj_set_align(fg_system_wifi_password_dialog, LV_ALIGN_TOP_LEFT);
        lv_obj_set_pos(fg_system_wifi_password_dialog, 232, 135);
    }
}

static void fg_keyboard_show_for(lv_obj_t * textarea)
{
    if (!textarea) return;
    if (fg_system_wifi_keyboard &&
        !lv_obj_has_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN) &&
        lv_keyboard_get_textarea(fg_system_wifi_keyboard) == textarea) return;
    // Replaces eager screen-child creation: fg_system_wifi_keyboard = lv_keyboard_create(parent);
    if (!fg_system_wifi_keyboard) {
        fg_system_wifi_keyboard = lv_keyboard_create(lv_layer_top());
        lv_obj_set_align(fg_system_wifi_keyboard, LV_ALIGN_TOP_LEFT);
        lv_obj_add_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_IGNORE_LAYOUT | LV_OBJ_FLAG_FLOATING);
        lv_obj_set_pos(fg_system_wifi_keyboard, 0, 350);
        lv_obj_set_size(fg_system_wifi_keyboard, 1024, 250);
        lv_obj_set_style_bg_opa(fg_system_wifi_keyboard, LV_OPA_COVER, LV_PART_MAIN);
        lv_obj_set_style_bg_color(fg_system_wifi_keyboard, lv_color_hex(0x1E2328), LV_PART_MAIN);
        lv_obj_set_style_border_width(fg_system_wifi_keyboard, 1, LV_PART_MAIN);
        lv_obj_set_style_border_color(fg_system_wifi_keyboard, lv_color_hex(0xF2A900), LV_PART_MAIN);
        lv_obj_set_style_radius(fg_system_wifi_keyboard, 6, LV_PART_MAIN);
        lv_obj_set_style_shadow_width(fg_system_wifi_keyboard, 0, LV_PART_MAIN);
        lv_obj_set_style_pad_all(fg_system_wifi_keyboard, 8, LV_PART_MAIN);
        lv_obj_set_style_pad_row(fg_system_wifi_keyboard, 6, LV_PART_MAIN);
        lv_obj_set_style_pad_column(fg_system_wifi_keyboard, 6, LV_PART_MAIN);
        lv_obj_set_style_text_font(fg_system_wifi_keyboard, &lv_font_montserrat_18, LV_PART_ITEMS);
        lv_obj_set_style_bg_opa(fg_system_wifi_keyboard, LV_OPA_COVER, LV_PART_ITEMS);
        lv_obj_set_style_bg_color(fg_system_wifi_keyboard, lv_color_hex(0x2A3138), LV_PART_ITEMS);
        lv_obj_set_style_text_color(fg_system_wifi_keyboard, lv_color_hex(0xF5F5F5), LV_PART_ITEMS);
        lv_obj_set_style_border_width(fg_system_wifi_keyboard, 1, LV_PART_ITEMS);
        lv_obj_set_style_border_color(fg_system_wifi_keyboard, lv_color_hex(0xF2A900), LV_PART_ITEMS);
        lv_obj_set_style_radius(fg_system_wifi_keyboard, 4, LV_PART_ITEMS);
        lv_obj_set_style_shadow_width(fg_system_wifi_keyboard, 0, LV_PART_ITEMS);
        lv_obj_add_event_cb(fg_system_wifi_keyboard, fg_keyboard_event_cb, LV_EVENT_ALL, NULL);
        lv_obj_add_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN);
    }
    if (lv_keyboard_get_textarea(fg_system_wifi_keyboard) != textarea) {
        lv_keyboard_set_textarea(fg_system_wifi_keyboard, textarea);
    }
    lv_keyboard_set_mode(fg_system_wifi_keyboard, LV_KEYBOARD_MODE_TEXT_LOWER);
    if (textarea == fg_system_wifi_password_input) {
        lv_obj_set_align(fg_system_wifi_password_dialog, LV_ALIGN_TOP_LEFT);
        lv_obj_set_pos(fg_system_wifi_password_dialog, 232, 18);
    }
    lv_obj_set_align(fg_system_wifi_keyboard, LV_ALIGN_TOP_LEFT);
    lv_obj_set_pos(fg_system_wifi_keyboard, 0, 350);
    lv_obj_set_size(fg_system_wifi_keyboard, 1024, 250);
    lv_obj_clear_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN);
    lv_obj_move_foreground(fg_system_wifi_keyboard);
}

static void fg_keyboard_event_cb(lv_event_t * event)
{
    lv_event_code_t code = lv_event_get_code(event);
    if (code == LV_EVENT_READY || code == LV_EVENT_CANCEL) {
        fg_keyboard_hide();
    }
}

static void fg_keyboard_open_cb(lv_event_t * event)
{
    lv_obj_t * textarea = lv_event_get_target(event);
    fg_keyboard_show_for(textarea);
}

static void fg_system_wifi_password_show_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    if (!fg_system_wifi_password_input) return;
    bool hidden = lv_textarea_get_password_mode(fg_system_wifi_password_input);
    lv_textarea_set_password_mode(fg_system_wifi_password_input, !hidden);
}

static void fg_system_wifi_remember_cb(lv_event_t * event)
{
    lv_obj_t * button = lv_event_get_target(event);
    fg_system_wifi_remember = !fg_system_wifi_remember;
    lv_obj_t * label = lv_obj_get_child(button, 0);
    if (label) lv_label_set_text(label, fg_system_wifi_remember ? LV_SYMBOL_OK " Remember password" : "Remember password");
}

static void fg_system_wifi_password_connect_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    if (fg_system_wifi_selected < 0 || fg_system_wifi_selected >= fg_system_wifi_network_count) return;
    const char * password = lv_textarea_get_text(fg_system_wifi_password_input);
    size_t password_length = strlen(password);
    if (password_length < 8 || password_length > 63) {
        lv_label_set_text(fg_system_wifi_password_error, "Password must be 8 to 63 characters");
        return;
    }
    fg_wifi_result_t result = fg_wifi_connect_network(&fg_system_wifi_networks[fg_system_wifi_selected], password, fg_system_wifi_remember);
    if (result != FG_WIFI_OP_ACCEPTED && result != FG_WIFI_OP_OK) {
        lv_label_set_text(fg_system_wifi_password_error, "Unable to start connection");
        return;
    }
    fg_keyboard_hide();
    lv_obj_add_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_network_cb(lv_event_t * event)
{
    int index = (int)(intptr_t)lv_event_get_user_data(event);
    if (index < 0 || index >= fg_system_wifi_network_count) return;
    fg_system_wifi_selected = index;
    fg_wifi_network_t * network = &fg_system_wifi_networks[index];
    if (network->connected) { fg_wifi_tick_cb(NULL); return; }
    if (network->security == FG_WIFI_SECURITY_OPEN) {
        (void)fg_wifi_connect_network(network, NULL, fg_system_wifi_remember);
    } else {
        if (!fg_system_wifi_create_password_dialog()) return;
        lv_textarea_set_text(fg_system_wifi_password_input, "");
        lv_textarea_set_password_mode(fg_system_wifi_password_input, true);
        lv_label_set_text_fmt(fg_system_wifi_password_title, "Connect to %s", network->ssid);
        lv_label_set_text(fg_system_wifi_password_error, "");
        lv_obj_clear_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);
        lv_obj_move_foreground(fg_system_wifi_password_dialog);
    }
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_forget_request_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    if (!fg_system_wifi_create_forget_dialog()) return;
    lv_obj_clear_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);
    lv_obj_move_foreground(fg_system_wifi_forget_dialog);
}

static void fg_system_wifi_forget_cancel_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    lv_obj_add_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);
}

static void fg_system_wifi_forget_confirm_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    (void)fg_wifi_forget();
    lv_obj_add_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);
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
    if (!button) return NULL;
    lv_obj_set_pos(button, x, y);
    lv_obj_set_size(button, width, height);
    lv_obj_set_style_radius(button, 12, 0);
    lv_obj_set_style_bg_color(button, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_border_color(button, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(button, 2, 0);
    lv_obj_set_style_bg_color(button, lv_color_hex(0xF2A900), LV_STATE_PRESSED);
    lv_obj_set_style_border_color(button, lv_color_hex(0xF2A900), LV_STATE_PRESSED);
    lv_obj_set_style_bg_color(button, lv_color_hex(0x2A3138), LV_STATE_FOCUSED);
    lv_obj_set_style_border_color(button, lv_color_hex(0xF2A900), LV_STATE_FOCUSED);
    lv_obj_set_style_bg_color(button, lv_color_hex(0x2A3138), LV_STATE_DISABLED);
    lv_obj_set_style_border_color(button, lv_color_hex(0xF2A900), LV_STATE_DISABLED);
    lv_obj_set_style_opa(button, LV_OPA_40, LV_STATE_DISABLED);
    lv_obj_t * label = lv_label_create(button);
    if (!label) { lv_obj_delete(button); return NULL; }
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

static const char * fg_wifi_signal_quality(int rssi)
{
    if (rssi >= -55) return "Excellent";
    if (rssi >= -67) return "Good";
    if (rssi >= -75) return "Fair";
    return "Weak";
}

static void fg_wifi_tick_cb(lv_timer_t *timer)
{
    LV_UNUSED(timer);

    fg_wifi_pump();
    if (!fg_system_wifi_connected_probe_logged && fg_wifi_is_connected()) { fg_system_wifi_connected_probe_logged = true; fg_ram_probe_log("17 connected on application page"); }

    if (fg_system_wifi_password_dialog &&
        !lv_obj_has_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN)) return;

    fg_wifi_snapshot_t widget_snapshot;
    bool widget_snapshot_ready = fg_wifi_get_snapshot(&widget_snapshot) == FG_WIFI_OP_OK;
    const char * widget_status = "Disabled";
    if (widget_snapshot_ready) {
        const char * backend_status = fg_wifi_status_text();
        if (backend_status && (strcmp(backend_status, "INTERNET") == 0 || strcmp(backend_status, "INTERNET_AVAILABLE") == 0)) widget_status = "Internet Available";
        else {
        switch (widget_snapshot.state) {
            case FG_WIFI_STATE_INIT: widget_status = "Starting"; break;
            case FG_WIFI_STATE_READY:
            case FG_WIFI_STATE_DISCONNECTING:
            case FG_WIFI_STATE_DISCONNECTED:
            case FG_WIFI_STATE_SCANNING: widget_status = "Starting"; break;
            case FG_WIFI_STATE_CONNECTING: widget_status = "Connecting"; break;
            case FG_WIFI_STATE_CONNECTED: widget_status = "Connected"; break;
            case FG_WIFI_STATE_ERROR: widget_status = "Failed"; break;
            default: widget_status = "Disabled"; break;
        }
        }
    }
    if (fg_wi_fi_status_label) {
        char widget_buf[96];
        snprintf(widget_buf, sizeof(widget_buf), LV_SYMBOL_WIFI " %s", widget_status);
        lv_label_set_text(fg_wi_fi_status_label, widget_buf);
    }

    if (!fg_system_wifi_page || !fg_system_wifi_page_active) return;
    fg_wifi_snapshot_t snapshot;
    if (fg_wifi_get_snapshot(&snapshot) != FG_WIFI_OP_OK) return;
    const char * state_text = "Wi-Fi Off";
    switch (snapshot.state) {
        case FG_WIFI_STATE_INIT: state_text = "Turning On"; break;
        case FG_WIFI_STATE_READY: state_text = "Ready"; break;
        case FG_WIFI_STATE_CONNECTING: state_text = "Connecting"; break;
        case FG_WIFI_STATE_CONNECTED: state_text = "Connected"; break;
        case FG_WIFI_STATE_DISCONNECTING: state_text = "Disconnecting"; break;
        case FG_WIFI_STATE_DISCONNECTED: state_text = "Disconnected"; break;
        case FG_WIFI_STATE_SCANNING: state_text = "Scanning"; break;
        case FG_WIFI_STATE_ERROR: state_text = "Failed"; break;
        default: break;
    }
    if (fg_system_wifi_state_label) lv_label_set_text(fg_system_wifi_state_label, state_text);
    const char * empty = "--";
    // Browser parity fields formerly combined as "Current network     %s", "IP address          %s", and "Gateway             %s".
    if (fg_system_wifi_ssid_label) lv_label_set_text(fg_system_wifi_ssid_label, snapshot.connected && snapshot.ssid[0] ? snapshot.ssid : empty);
    if (fg_system_wifi_ip_label) lv_label_set_text(fg_system_wifi_ip_label, snapshot.connected && snapshot.ip[0] ? snapshot.ip : empty);
    if (fg_system_wifi_gateway_label) lv_label_set_text(fg_system_wifi_gateway_label, snapshot.connected && snapshot.gateway[0] ? snapshot.gateway : empty);
    if (fg_system_wifi_rssi_label) {
        // Browser parity format: "Signal              %d dBm - %s".
        if (snapshot.connected) lv_label_set_text_fmt(fg_system_wifi_rssi_label, "%d dBm - %s", snapshot.rssi, fg_wifi_signal_quality(snapshot.rssi));
        else lv_label_set_text(fg_system_wifi_rssi_label, empty);
    }
    // Browser parity formats: "Security            %s" and "Status              %s%s%s".
    if (fg_system_wifi_security_label) lv_label_set_text(fg_system_wifi_security_label, snapshot.connected ? fg_wifi_security_text(snapshot.security) : empty);
    if (fg_system_wifi_raw_label) lv_label_set_text_fmt(fg_system_wifi_raw_label, "%s%s%s", fg_wifi_status_text(), snapshot.error_reason[0] ? " - " : "", snapshot.error_reason);
    if (fg_system_wifi_details_label) {
        if (snapshot.connected) lv_label_set_text_fmt(fg_system_wifi_details_label, "Station MAC  %02X:%02X:%02X:%02X:%02X:%02X\nAP BSSID     %02X:%02X:%02X:%02X:%02X:%02X", snapshot.station_mac[0], snapshot.station_mac[1], snapshot.station_mac[2], snapshot.station_mac[3], snapshot.station_mac[4], snapshot.station_mac[5], snapshot.ap_bssid[0], snapshot.ap_bssid[1], snapshot.ap_bssid[2], snapshot.ap_bssid[3], snapshot.ap_bssid[4], snapshot.ap_bssid[5]);
        else lv_label_set_text_fmt(fg_system_wifi_details_label, "Station MAC  %s\nAP BSSID     %s", empty, empty);
    }
    if (fg_system_wifi_scan_label) lv_label_set_text(fg_system_wifi_scan_label, snapshot.scan_in_progress ? "Scanning for nearby networks..." : "Available Networks");
    if (snapshot.scan_in_progress) lv_obj_add_state(fg_system_wifi_scan_button, LV_STATE_DISABLED); else lv_obj_clear_state(fg_system_wifi_scan_button, LV_STATE_DISABLED);
    if (snapshot.connected || snapshot.state == FG_WIFI_STATE_CONNECTING) lv_obj_clear_state(fg_system_wifi_disconnect_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_wifi_disconnect_button, LV_STATE_DISABLED);
    if (snapshot.ready && snapshot.state != FG_WIFI_STATE_CONNECTING) lv_obj_clear_state(fg_system_wifi_reconnect_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_wifi_reconnect_button, LV_STATE_DISABLED);
    if (snapshot.saved) lv_obj_clear_state(fg_system_wifi_forget_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_wifi_forget_button, LV_STATE_DISABLED);
    fg_system_wifi_network_count = fg_wifi_get_networks(fg_system_wifi_networks, FG_WIFI_MAX_SCAN);
    if (fg_system_wifi_network_empty_label) {
        lv_label_set_text(fg_system_wifi_network_empty_label, snapshot.scan_in_progress ? "Scanning for nearby networks..." : "No Wi-Fi networks found");
        if (fg_system_wifi_network_count == 0) lv_obj_clear_flag(fg_system_wifi_network_empty_label, LV_OBJ_FLAG_HIDDEN);
        else lv_obj_add_flag(fg_system_wifi_network_empty_label, LV_OBJ_FLAG_HIDDEN);
    }
    for (int i = 0; i < FG_WIFI_MAX_SCAN; ++i) {
        if (i >= fg_system_wifi_network_count) { lv_obj_add_flag(fg_system_wifi_network_rows[i], LV_OBJ_FLAG_HIDDEN); continue; }
        fg_wifi_network_t * network = &fg_system_wifi_networks[i];
        lv_obj_clear_flag(fg_system_wifi_network_rows[i], LV_OBJ_FLAG_HIDDEN);
        lv_label_set_text_fmt(fg_system_wifi_network_labels[i], "%s%s  %s  %d dBm%s%s", network->security == FG_WIFI_SECURITY_OPEN ? "" : LV_SYMBOL_CHARGE " ", network->ssid, fg_wifi_security_text(network->security), network->rssi, network->connected ? "  [Connected]" : "", network->saved ? "  [Saved]" : "");
        if (i == fg_system_wifi_selected) lv_obj_add_state(fg_system_wifi_network_rows[i], LV_STATE_CHECKED);
        else lv_obj_clear_state(fg_system_wifi_network_rows[i], LV_STATE_CHECKED);
    }
    lv_obj_update_layout(fg_system_wifi_network_container);
}

void FG_Set_Weather_Background_Key(const char * key)
{
    if (!key || !fg_weather_background_image) return;
    if (fg_weather_background_key && strcmp(fg_weather_background_key, key) == 0) return;
    const void * source = NULL;
    if (strcmp(key, "weather.clear.day") == 0) source = &fg_upload_ai_hero_1786173676218_aeb0dfd0_rgb565;
    else if (strcmp(key, "weather.clear.night") == 0) source = &fg_upload_ai_hero_1786175544095_ef74779f_rgb565;
    else if (strcmp(key, "weather.partly_cloudy.day") == 0) source = &fg_upload_ai_hero_1786175636953_e2570088_rgb565;
    else if (strcmp(key, "weather.partly_cloudy.night") == 0) source = &fg_upload_ai_hero_1786176586614_981a4670_rgb565;
    else if (strcmp(key, "weather.overcast") == 0) source = &fg_upload_ai_hero_1786175736552_7ca78d5b_rgb565;
    else if (strcmp(key, "weather.fog") == 0) source = &fg_upload_ai_hero_1786176018471_8897993e_rgb565;
    else if (strcmp(key, "weather.rain.day") == 0) source = &fg_upload_ai_hero_1786175833774_dcf82046_rgb565;
    else if (strcmp(key, "weather.rain.night") == 0) source = &fg_upload_ai_hero_1786176442715_8a47a244_rgb565;
    else if (strcmp(key, "weather.snow") == 0) source = &fg_upload_ai_hero_1786176207823_5b8eb6de_rgb565;
    else if (strcmp(key, "weather.thunderstorm") == 0) source = &fg_upload_ai_hero_1786175925517_846bc1d6_rgb565;
    if (!source) return;
    lv_image_set_src(fg_weather_background_image, source);
    fg_weather_background_key = key;
}

static bool fg_system_wifi_create_page(void)
{
    if (fg_system_wifi_page) return true;
    if (!fg_system_root) return false;
    fg_system_wifi_page = lv_obj_create(fg_system_root);
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
    lv_obj_t * wifi_refresh = fg_system_create_button(fg_system_wifi_page, LV_SYMBOL_REFRESH "  Refresh", 822, 14, 174, 58);
    lv_obj_add_event_cb(wifi_refresh, fg_system_wifi_refresh_cb, LV_EVENT_CLICKED, NULL);

    lv_obj_t * wifi_status_panel = lv_obj_create(fg_system_wifi_page);
    lv_obj_set_pos(wifi_status_panel, 28, 96);
    lv_obj_set_size(wifi_status_panel, 440, 248);
    lv_obj_clear_flag(wifi_status_panel, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_radius(wifi_status_panel, 12, 0);
    lv_obj_set_style_bg_color(wifi_status_panel, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_border_color(wifi_status_panel, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(wifi_status_panel, 1, 0);
    fg_system_wifi_state_label = lv_label_create(wifi_status_panel);
    lv_label_set_text(fg_system_wifi_state_label, "Off");
    lv_obj_t * wifi_connection_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_connection_caption, "CONNECTION STATUS");
    lv_obj_set_pos(wifi_connection_caption, 14, 8);
    lv_obj_set_style_text_color(wifi_connection_caption, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(wifi_connection_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_connection_caption, &lv_font_montserrat_12, 0);
    lv_obj_set_pos(fg_system_wifi_state_label, 14, 26);
    lv_obj_set_style_text_color(fg_system_wifi_state_label, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_text_font(fg_system_wifi_state_label, &lv_font_montserrat_28, 0);
    lv_obj_t * wifi_ssid_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_ssid_caption, "Current Network");
    lv_obj_set_pos(wifi_ssid_caption, 14, 68);
    lv_obj_set_style_text_color(wifi_ssid_caption, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(wifi_ssid_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_ssid_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_ssid_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_ssid_label, 14, 86);
    lv_obj_set_width(fg_system_wifi_ssid_label, 190);
    lv_label_set_long_mode(fg_system_wifi_ssid_label, LV_LABEL_LONG_DOT);
    lv_obj_set_style_text_color(fg_system_wifi_ssid_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_ssid_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_ssid_label, &lv_font_montserrat_16, 0);
    lv_obj_t * wifi_ip_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_ip_caption, "IP Address");
    lv_obj_set_pos(wifi_ip_caption, 220, 68);
    lv_obj_set_style_text_color(wifi_ip_caption, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(wifi_ip_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_ip_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_ip_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_ip_label, 220, 86);
    lv_obj_set_style_text_color(fg_system_wifi_ip_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_ip_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_ip_label, &lv_font_montserrat_16, 0);
    lv_obj_t * wifi_gateway_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_gateway_caption, "Gateway");
    lv_obj_set_pos(wifi_gateway_caption, 14, 126);
    lv_obj_set_style_text_color(wifi_gateway_caption, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(wifi_gateway_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_gateway_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_gateway_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_gateway_label, 14, 144);
    lv_obj_set_style_text_color(fg_system_wifi_gateway_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_gateway_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_gateway_label, &lv_font_montserrat_16, 0);
    lv_obj_t * wifi_signal_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_signal_caption, "Signal");
    lv_obj_set_pos(wifi_signal_caption, 220, 126);
    lv_obj_set_style_text_color(wifi_signal_caption, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(wifi_signal_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_signal_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_rssi_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_rssi_label, 220, 144);
    lv_obj_set_style_text_color(fg_system_wifi_rssi_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_rssi_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_rssi_label, &lv_font_montserrat_16, 0);
    lv_obj_t * wifi_security_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_security_caption, "Security");
    lv_obj_set_pos(wifi_security_caption, 14, 184);
    lv_obj_set_style_text_color(wifi_security_caption, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(wifi_security_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_security_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_security_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_security_label, 14, 202);
    lv_obj_set_style_text_color(fg_system_wifi_security_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_security_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_security_label, &lv_font_montserrat_16, 0);
    lv_obj_t * wifi_status_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_status_caption, "Status");
    lv_obj_set_pos(wifi_status_caption, 220, 184);
    lv_obj_set_style_text_color(wifi_status_caption, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(wifi_status_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_status_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_raw_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_raw_label, 220, 202);
    lv_obj_set_width(fg_system_wifi_raw_label, 190);
    lv_label_set_long_mode(fg_system_wifi_raw_label, LV_LABEL_LONG_DOT);
    lv_obj_set_style_text_color(fg_system_wifi_raw_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_raw_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_raw_label, &lv_font_montserrat_16, 0);

    fg_system_wifi_scan_button = fg_system_create_button(fg_system_wifi_page, "Scan", 28, 360, 96, 44);
    lv_obj_add_event_cb(fg_system_wifi_scan_button, fg_system_wifi_scan_cb, LV_EVENT_CLICKED, NULL);
    fg_system_wifi_disconnect_button = fg_system_create_button(fg_system_wifi_page, "Disconnect", 136, 360, 96, 44);
    lv_obj_add_event_cb(fg_system_wifi_disconnect_button, fg_system_wifi_disconnect_cb, LV_EVENT_CLICKED, NULL);
    fg_system_wifi_reconnect_button = fg_system_create_button(fg_system_wifi_page, "Reconnect", 244, 360, 96, 44);
    lv_obj_add_event_cb(fg_system_wifi_reconnect_button, fg_system_wifi_reconnect_cb, LV_EVENT_CLICKED, NULL);
    fg_system_wifi_forget_button = fg_system_create_button(fg_system_wifi_page, "Forget", 352, 360, 96, 44);
    lv_obj_add_event_cb(fg_system_wifi_forget_button, fg_system_wifi_forget_request_cb, LV_EVENT_CLICKED, NULL);

    fg_system_wifi_details_card = lv_obj_create(fg_system_wifi_page);
    lv_obj_set_pos(fg_system_wifi_details_card, 28, 420);
    lv_obj_set_size(fg_system_wifi_details_card, 440, 144);
    lv_obj_clear_flag(fg_system_wifi_details_card, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_radius(fg_system_wifi_details_card, 12, 0);
    lv_obj_set_style_bg_color(fg_system_wifi_details_card, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_border_color(fg_system_wifi_details_card, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_system_wifi_details_card, 1, 0);
    lv_obj_set_style_pad_all(fg_system_wifi_details_card, 0, 0);
    lv_obj_t * wifi_details_title = lv_label_create(fg_system_wifi_details_card);
    lv_label_set_text(wifi_details_title, "Connected Network");
    lv_obj_set_pos(wifi_details_title, 16, 12);
    lv_obj_set_style_text_color(wifi_details_title, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(wifi_details_title, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(wifi_details_title, &lv_font_montserrat_16, 0);
    fg_system_wifi_details_label = lv_label_create(fg_system_wifi_details_card);
    lv_obj_set_pos(fg_system_wifi_details_label, 16, 46);
    lv_obj_set_style_text_color(fg_system_wifi_details_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_details_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_details_label, &lv_font_montserrat_14, 0);

    fg_system_wifi_scan_label = lv_label_create(fg_system_wifi_page);
    lv_label_set_text(fg_system_wifi_scan_label, "Available Networks");
    lv_obj_set_pos(fg_system_wifi_scan_label, 500, 100);
    lv_obj_set_style_text_font(fg_system_wifi_scan_label, &lv_font_montserrat_20, 0);
    lv_obj_t * wifi_scan_hint = lv_label_create(fg_system_wifi_page);
    lv_label_set_text(wifi_scan_hint, "Select a network to connect");
    lv_obj_set_pos(wifi_scan_hint, 500, 124);
    lv_obj_set_style_text_color(wifi_scan_hint, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(wifi_scan_hint, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_scan_hint, &lv_font_montserrat_12, 0);
    fg_system_wifi_network_container = lv_obj_create(fg_system_wifi_page);
    lv_obj_set_pos(fg_system_wifi_network_container, 490, 148);
    lv_obj_set_size(fg_system_wifi_network_container, 506, 404);
    lv_obj_set_style_radius(fg_system_wifi_network_container, 12, 0);
    lv_obj_set_style_bg_color(fg_system_wifi_network_container, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_border_color(fg_system_wifi_network_container, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_system_wifi_network_container, 1, 0);
    lv_obj_set_flex_flow(fg_system_wifi_network_container, LV_FLEX_FLOW_COLUMN);
    lv_obj_set_style_pad_all(fg_system_wifi_network_container, 10, 0);
    lv_obj_set_style_pad_gap(fg_system_wifi_network_container, 8, 0);
    fg_system_wifi_network_empty_label = lv_label_create(fg_system_wifi_network_container);
    lv_label_set_text(fg_system_wifi_network_empty_label, "No Wi-Fi networks found");
    lv_obj_add_flag(fg_system_wifi_network_empty_label, LV_OBJ_FLAG_FLOATING);
    lv_obj_set_style_text_color(fg_system_wifi_network_empty_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_network_empty_label, LV_OPA_70, 0);
    lv_obj_set_style_text_align(fg_system_wifi_network_empty_label, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_center(fg_system_wifi_network_empty_label);
    for (int i = 0; i < FG_WIFI_MAX_SCAN; ++i) {
        fg_system_wifi_network_rows[i] = lv_button_create(fg_system_wifi_network_container);
        lv_obj_set_size(fg_system_wifi_network_rows[i], LV_PCT(100), 50);
        lv_obj_set_style_radius(fg_system_wifi_network_rows[i], 9, 0);
        lv_obj_set_style_pad_hor(fg_system_wifi_network_rows[i], 12, 0);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x2A3138), 0);
        lv_obj_set_style_bg_opa(fg_system_wifi_network_rows[i], LV_OPA_COVER, 0);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF2A900), 0);
        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 1, 0);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF5F5F5), 0);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF2A900), LV_STATE_PRESSED);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF2A900), LV_STATE_PRESSED);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0x121417), LV_STATE_PRESSED);
        lv_obj_set_style_opa(fg_system_wifi_network_rows[i], LV_OPA_80, LV_STATE_PRESSED);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x1E2328), LV_STATE_FOCUSED);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF2A900), LV_STATE_FOCUSED);
        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 2, LV_STATE_FOCUSED);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF5F5F5), LV_STATE_FOCUSED);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x1E2328), LV_STATE_FOCUS_KEY);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF2A900), LV_STATE_FOCUS_KEY);
        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 2, LV_STATE_FOCUS_KEY);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF5F5F5), LV_STATE_FOCUS_KEY);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF2A900), LV_STATE_CHECKED);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF2A900), LV_STATE_CHECKED);
        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 3, LV_STATE_CHECKED);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0x121417), LV_STATE_CHECKED);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x2A3138), LV_STATE_DISABLED);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF2A900), LV_STATE_DISABLED);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF5F5F5), LV_STATE_DISABLED);
        lv_obj_set_style_opa(fg_system_wifi_network_rows[i], LV_OPA_40, LV_STATE_DISABLED);
        lv_obj_add_event_cb(fg_system_wifi_network_rows[i], fg_system_wifi_network_cb, LV_EVENT_CLICKED, (void *)(intptr_t)i);
        fg_system_wifi_network_labels[i] = lv_label_create(fg_system_wifi_network_rows[i]);
        lv_obj_align(fg_system_wifi_network_labels[i], LV_ALIGN_LEFT_MID, 0, 0);
        lv_obj_set_width(fg_system_wifi_network_labels[i], 458);
        lv_label_set_long_mode(fg_system_wifi_network_labels[i], LV_LABEL_LONG_DOT);
        lv_obj_add_flag(fg_system_wifi_network_rows[i], LV_OBJ_FLAG_HIDDEN);
    }
    lv_obj_add_flag(fg_system_wifi_page, LV_OBJ_FLAG_HIDDEN);
    fg_ram_probe_log("07 after Wi-Fi Manager page creation");

    return fg_system_wifi_page != NULL;
}

static bool fg_system_wifi_create_password_dialog(void)
{
    if (fg_system_wifi_password_dialog) return true;
    if (!fg_system_root) return false;
    fg_system_wifi_password_dialog = lv_obj_create(fg_system_root);
    lv_obj_set_size(fg_system_wifi_password_dialog, 560, 330);
    lv_obj_set_align(fg_system_wifi_password_dialog, LV_ALIGN_TOP_LEFT);
    lv_obj_set_pos(fg_system_wifi_password_dialog, 232, 135);
    fg_system_wifi_password_title = lv_label_create(fg_system_wifi_password_dialog);
    lv_label_set_text(fg_system_wifi_password_title, "Enter Wi-Fi Password");
    lv_obj_align(fg_system_wifi_password_title, LV_ALIGN_TOP_MID, 0, 12);
    fg_system_wifi_password_input = lv_textarea_create(fg_system_wifi_password_dialog);
    lv_obj_set_size(fg_system_wifi_password_input, 470, 60);
    lv_obj_align(fg_system_wifi_password_input, LV_ALIGN_TOP_MID, 0, 65);
    lv_textarea_set_one_line(fg_system_wifi_password_input, true);
    lv_textarea_set_password_mode(fg_system_wifi_password_input, true);
    lv_textarea_set_max_length(fg_system_wifi_password_input, 63);
    lv_textarea_set_placeholder_text(fg_system_wifi_password_input, "8 to 63 characters");
    lv_obj_add_flag(fg_system_wifi_password_input, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);
    lv_obj_add_event_cb(fg_system_wifi_password_input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);
    lv_obj_add_event_cb(fg_system_wifi_password_input, fg_keyboard_open_cb, LV_EVENT_CLICKED, NULL);
    fg_system_wifi_password_error = lv_label_create(fg_system_wifi_password_dialog);
    lv_label_set_text(fg_system_wifi_password_error, "");
    lv_obj_set_style_text_color(fg_system_wifi_password_error, lv_color_hex(0xEF4444), 0);
    lv_obj_align(fg_system_wifi_password_error, LV_ALIGN_TOP_MID, 0, 128);
    lv_obj_t * password_show = fg_system_create_button(fg_system_wifi_password_dialog, "Show / Hide", 36, 145, 150, 50);
    lv_obj_add_event_cb(password_show, fg_system_wifi_password_show_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * password_remember = fg_system_create_button(fg_system_wifi_password_dialog, LV_SYMBOL_OK " Remember password", 196, 145, 310, 50);
    lv_obj_add_event_cb(password_remember, fg_system_wifi_remember_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * password_cancel = fg_system_create_button(fg_system_wifi_password_dialog, "Cancel", 36, 220, 220, 58);
    lv_obj_add_event_cb(password_cancel, fg_system_wifi_password_cancel_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * password_connect = fg_system_create_button(fg_system_wifi_password_dialog, "Connect", 276, 220, 230, 58);
    lv_obj_add_event_cb(password_connect, fg_system_wifi_password_connect_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_add_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);
    fg_ram_probe_log("08 after Wi-Fi password dialog creation");

    return fg_system_wifi_password_dialog != NULL;
}

static bool fg_system_wifi_create_forget_dialog(void)
{
    if (fg_system_wifi_forget_dialog) return true;
    if (!fg_system_root) return false;
    fg_system_wifi_forget_dialog = lv_obj_create(fg_system_root);
    lv_obj_set_size(fg_system_wifi_forget_dialog, 540, 240);
    lv_obj_center(fg_system_wifi_forget_dialog);
    lv_obj_t * forget_text = lv_label_create(fg_system_wifi_forget_dialog);
    lv_label_set_text(forget_text, "Forget saved Wi-Fi credentials?\nA password will be required to reconnect.");
    lv_obj_align(forget_text, LV_ALIGN_TOP_MID, 0, 25);
    lv_obj_t * forget_cancel = fg_system_create_button(fg_system_wifi_forget_dialog, "Cancel", 30, 135, 220, 58);
    lv_obj_add_event_cb(forget_cancel, fg_system_wifi_forget_cancel_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * forget_confirm = fg_system_create_button(fg_system_wifi_forget_dialog, "Forget Network", 270, 135, 230, 58);
    lv_obj_add_event_cb(forget_confirm, fg_system_wifi_forget_confirm_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_add_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);
    fg_ram_probe_log("09 after Wi-Fi forget dialog creation");

    return fg_system_wifi_forget_dialog != NULL;
}

static void fg_system_wifi_destroy_ui(void)
{
    fg_keyboard_hide();
    if (fg_system_wifi_keyboard) lv_keyboard_set_textarea(fg_system_wifi_keyboard, NULL);
    if (fg_system_wifi_password_dialog) lv_obj_delete(fg_system_wifi_password_dialog);
    fg_system_wifi_password_dialog = NULL;
    fg_system_wifi_password_input = NULL;
    fg_system_wifi_password_title = NULL;
    fg_system_wifi_password_error = NULL;
    if (fg_system_wifi_forget_dialog) lv_obj_delete(fg_system_wifi_forget_dialog);
    fg_system_wifi_forget_dialog = NULL;
    if (fg_system_wifi_page) lv_obj_delete(fg_system_wifi_page);
    fg_system_wifi_page = NULL;
    fg_system_wifi_state_label = NULL;
    fg_system_wifi_ssid_label = NULL;
    fg_system_wifi_ip_label = NULL;
    fg_system_wifi_gateway_label = NULL;
    fg_system_wifi_rssi_label = NULL;
    fg_system_wifi_security_label = NULL;
    fg_system_wifi_raw_label = NULL;
    fg_system_wifi_scan_label = NULL;
    fg_system_wifi_network_container = NULL;
    fg_system_wifi_network_empty_label = NULL;
    fg_system_wifi_scan_button = NULL;
    fg_system_wifi_disconnect_button = NULL;
    fg_system_wifi_reconnect_button = NULL;
    fg_system_wifi_forget_button = NULL;
    fg_system_wifi_details_card = NULL;
    fg_system_wifi_details_label = NULL;
    for (int i = 0; i < FG_WIFI_MAX_SCAN; ++i) {
        fg_system_wifi_network_rows[i] = NULL;
        fg_system_wifi_network_labels[i] = NULL;
    }
    fg_system_wifi_network_count = 0;
    fg_system_wifi_selected = -1;
}

// ForgeUI LVGL Export Proof V1
// Generated from ForgeUI Studio

void fg_studio_export_create(lv_obj_t *parent)
{
    fg_system_root = parent;
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

    fg_weather_background_image = lv_image_create(fg_application_page);
    lv_image_set_src(fg_weather_background_image, &fg_upload_ai_hero_1786173676218_aeb0dfd0_rgb565);
    lv_obj_set_pos(fg_weather_background_image, 0, 0);
    lv_obj_set_size(fg_weather_background_image, 1024, 600);
    lv_obj_move_background(fg_weather_background_image);

    fg_box = lv_obj_create(fg_application_page);
    lv_obj_t * obj1 = fg_box;
    lv_obj_set_pos(fg_box, 24, 24);
    lv_obj_set_size(fg_box, 480, 72);
    fg_box_visible = true;
    lv_obj_clear_flag(fg_box, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_scrollbar_mode(fg_box, LV_SCROLLBAR_MODE_OFF);
    lv_obj_set_style_pad_all(fg_box, 0, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_box, 12, 0);
    lv_obj_set_style_bg_color(fg_box, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_box, 82, 0);
    lv_obj_set_style_border_color(fg_box, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_box, 1, 0);
    lv_obj_set_style_border_opa(fg_box, 255, 0);

    fg_box_2 = lv_obj_create(fg_application_page);
    lv_obj_t * obj2 = fg_box_2;
    lv_obj_set_pos(fg_box_2, 520, 24);
    lv_obj_set_size(fg_box_2, 480, 72);
    fg_box_2_visible = true;
    lv_obj_clear_flag(fg_box_2, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_scrollbar_mode(fg_box_2, LV_SCROLLBAR_MODE_OFF);
    lv_obj_set_style_pad_all(fg_box_2, 0, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_box_2, 12, 0);
    lv_obj_set_style_bg_color(fg_box_2, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_box_2, 82, 0);
    lv_obj_set_style_border_color(fg_box_2, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_box_2, 1, 0);
    lv_obj_set_style_border_opa(fg_box_2, 255, 0);

    fg_box_3 = lv_obj_create(fg_application_page);
    lv_obj_t * obj3 = fg_box_3;
    lv_obj_set_pos(fg_box_3, 24, 112);
    lv_obj_set_size(fg_box_3, 600, 244);
    fg_box_3_visible = true;
    lv_obj_clear_flag(fg_box_3, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_scrollbar_mode(fg_box_3, LV_SCROLLBAR_MODE_OFF);
    lv_obj_set_style_pad_all(fg_box_3, 0, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_box_3, 12, 0);
    lv_obj_set_style_bg_color(fg_box_3, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_box_3, 82, 0);
    lv_obj_set_style_border_color(fg_box_3, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_box_3, 1, 0);
    lv_obj_set_style_border_opa(fg_box_3, 255, 0);

    fg_box_4 = lv_obj_create(fg_application_page);
    lv_obj_t * obj4 = fg_box_4;
    lv_obj_set_pos(fg_box_4, 24, 372);
    lv_obj_set_size(fg_box_4, 976, 80);
    fg_box_4_visible = true;
    lv_obj_clear_flag(fg_box_4, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_scrollbar_mode(fg_box_4, LV_SCROLLBAR_MODE_OFF);
    lv_obj_set_style_pad_all(fg_box_4, 0, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_box_4, 12, 0);
    lv_obj_set_style_bg_color(fg_box_4, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_box_4, 82, 0);
    lv_obj_set_style_border_color(fg_box_4, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_box_4, 1, 0);
    lv_obj_set_style_border_opa(fg_box_4, 255, 0);

    fg_box_5 = lv_obj_create(fg_application_page);
    lv_obj_t * obj5 = fg_box_5;
    lv_obj_set_pos(fg_box_5, 24, 468);
    lv_obj_set_size(fg_box_5, 180, 108);
    fg_box_5_visible = true;
    lv_obj_clear_flag(fg_box_5, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_scrollbar_mode(fg_box_5, LV_SCROLLBAR_MODE_OFF);
    lv_obj_set_style_pad_all(fg_box_5, 0, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_box_5, 12, 0);
    lv_obj_set_style_bg_color(fg_box_5, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_box_5, 82, 0);
    lv_obj_set_style_border_color(fg_box_5, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_box_5, 1, 0);
    lv_obj_set_style_border_opa(fg_box_5, 255, 0);

    fg_box_6 = lv_obj_create(fg_application_page);
    lv_obj_t * obj6 = fg_box_6;
    lv_obj_set_pos(fg_box_6, 223, 468);
    lv_obj_set_size(fg_box_6, 180, 108);
    fg_box_6_visible = true;
    lv_obj_clear_flag(fg_box_6, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_scrollbar_mode(fg_box_6, LV_SCROLLBAR_MODE_OFF);
    lv_obj_set_style_pad_all(fg_box_6, 0, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_box_6, 12, 0);
    lv_obj_set_style_bg_color(fg_box_6, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_box_6, 82, 0);
    lv_obj_set_style_border_color(fg_box_6, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_box_6, 1, 0);
    lv_obj_set_style_border_opa(fg_box_6, 255, 0);

    fg_box_7 = lv_obj_create(fg_application_page);
    lv_obj_t * obj7 = fg_box_7;
    lv_obj_set_pos(fg_box_7, 422, 468);
    lv_obj_set_size(fg_box_7, 180, 108);
    fg_box_7_visible = true;
    lv_obj_clear_flag(fg_box_7, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_scrollbar_mode(fg_box_7, LV_SCROLLBAR_MODE_OFF);
    lv_obj_set_style_pad_all(fg_box_7, 0, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_box_7, 12, 0);
    lv_obj_set_style_bg_color(fg_box_7, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_box_7, 82, 0);
    lv_obj_set_style_border_color(fg_box_7, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_box_7, 1, 0);
    lv_obj_set_style_border_opa(fg_box_7, 255, 0);

    fg_box_8 = lv_obj_create(fg_application_page);
    lv_obj_t * obj8 = fg_box_8;
    lv_obj_set_pos(fg_box_8, 621, 468);
    lv_obj_set_size(fg_box_8, 180, 108);
    fg_box_8_visible = true;
    lv_obj_clear_flag(fg_box_8, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_scrollbar_mode(fg_box_8, LV_SCROLLBAR_MODE_OFF);
    lv_obj_set_style_pad_all(fg_box_8, 0, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_box_8, 12, 0);
    lv_obj_set_style_bg_color(fg_box_8, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_box_8, 82, 0);
    lv_obj_set_style_border_color(fg_box_8, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_box_8, 1, 0);
    lv_obj_set_style_border_opa(fg_box_8, 255, 0);

    fg_box_9 = lv_obj_create(fg_application_page);
    lv_obj_t * obj9 = fg_box_9;
    lv_obj_set_pos(fg_box_9, 820, 468);
    lv_obj_set_size(fg_box_9, 180, 108);
    fg_box_9_visible = true;
    lv_obj_clear_flag(fg_box_9, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_scrollbar_mode(fg_box_9, LV_SCROLLBAR_MODE_OFF);
    lv_obj_set_style_pad_all(fg_box_9, 0, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_box_9, 12, 0);
    lv_obj_set_style_bg_color(fg_box_9, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_box_9, 82, 0);
    lv_obj_set_style_border_color(fg_box_9, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(fg_box_9, 1, 0);
    lv_obj_set_style_border_opa(fg_box_9, 255, 0);

    fg_weather_location_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_weather_location_label, 36, 36);
    lv_label_set_long_mode(fg_weather_location_label, LV_LABEL_LONG_WRAP);
    lv_obj_set_size(fg_weather_location_label, 456, 48);
    lv_label_set_text(fg_weather_location_label, "TAURANGA");
    lv_obj_set_style_text_color(fg_weather_location_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_weather_location_label, &lv_font_montserrat_32, 0);
    lv_obj_set_style_text_align(fg_weather_location_label, LV_TEXT_ALIGN_LEFT, 0);

    fg_weather_date_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_weather_date_label, 479, 28);
    lv_obj_set_size(fg_weather_date_label, 456, 25);
    lv_label_set_long_mode(fg_weather_date_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_weather_date_label, "SATURDAY 8 AUGUST");
    lv_obj_set_style_text_color(fg_weather_date_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_weather_date_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_weather_date_label, LV_TEXT_ALIGN_RIGHT, 0);

    fg_weather_time_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_weather_time_label, 473, 59);
    lv_obj_set_size(fg_weather_time_label, 456, 25);
    lv_label_set_long_mode(fg_weather_time_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_weather_time_label, "8:20 PM");
    lv_obj_set_style_text_color(fg_weather_time_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_weather_time_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_weather_time_label, LV_TEXT_ALIGN_RIGHT, 0);

    fg_weather_temperature_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_weather_temperature_label, 36, 124);
    lv_label_set_long_mode(fg_weather_temperature_label, LV_LABEL_LONG_WRAP);
    lv_obj_set_size(fg_weather_temperature_label, 369, 112);
    lv_label_set_text(fg_weather_temperature_label, "18°");
    lv_obj_set_style_text_color(fg_weather_temperature_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_weather_temperature_label, &lv_font_montserrat_48, 0);
    lv_obj_set_style_text_align(fg_weather_temperature_label, LV_TEXT_ALIGN_LEFT, 0);

    fg_weather_condition_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_weather_condition_label, 36, 244);
    lv_obj_set_size(fg_weather_condition_label, 369, 48);
    lv_label_set_long_mode(fg_weather_condition_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_weather_condition_label, "CLEAR SKY");
    lv_obj_set_style_text_color(fg_weather_condition_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_weather_condition_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_weather_condition_label, LV_TEXT_ALIGN_LEFT, 0);

    fg_weather_feels_like_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_weather_feels_like_label, 36, 296);
    lv_obj_set_size(fg_weather_feels_like_label, 369, 48);
    lv_label_set_long_mode(fg_weather_feels_like_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_weather_feels_like_label, "Feels like 17°");
    lv_obj_set_style_text_color(fg_weather_feels_like_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_weather_feels_like_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_weather_feels_like_label, LV_TEXT_ALIGN_LEFT, 0);

    LV_IMAGE_DECLARE(fg_upload_fisun_136x136_13d13edc);
    lv_obj_t * obj16 = lv_image_create(fg_application_page);
    lv_image_set_src(obj16, &fg_upload_fisun_136x136_13d13edc);
    lv_image_set_scale(obj16, 235);
    lv_image_set_pivot(obj16, 68, 68);
    lv_obj_set_pos(obj16, 464, 166);
    lv_obj_set_size(obj16, 136, 136);
    lv_image_set_inner_align(obj16, LV_IMAGE_ALIGN_CENTER);
    lv_obj_set_style_image_recolor(obj16, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_image_recolor_opa(obj16, LV_OPA_COVER, 0);
    lv_obj_set_style_opa(obj16, 255, 0);
    fg_fi_bind_weather_current_icon(obj16, true);
    lv_obj_clear_flag(obj16, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);

    fg_weather_humidity_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_weather_humidity_label, 36, 384);
    lv_obj_set_size(fg_weather_humidity_label, 232, 56);
    lv_label_set_long_mode(fg_weather_humidity_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_weather_humidity_label, "HUMIDITY 72%");
    lv_obj_set_style_text_color(fg_weather_humidity_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_weather_humidity_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_weather_humidity_label, LV_TEXT_ALIGN_LEFT, 0);

    fg_weather_wind_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_weather_wind_label, 276, 384);
    lv_obj_set_size(fg_weather_wind_label, 232, 56);
    lv_label_set_long_mode(fg_weather_wind_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_weather_wind_label, "WIND 11 km/h");
    lv_obj_set_style_text_color(fg_weather_wind_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_weather_wind_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_weather_wind_label, LV_TEXT_ALIGN_LEFT, 0);

    fg_weather_rain_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_weather_rain_label, 516, 384);
    lv_obj_set_size(fg_weather_rain_label, 232, 56);
    lv_label_set_long_mode(fg_weather_rain_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_weather_rain_label, "RAIN 10%");
    lv_obj_set_style_text_color(fg_weather_rain_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_weather_rain_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_weather_rain_label, LV_TEXT_ALIGN_LEFT, 0);

    fg_weather_uv_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_weather_uv_label, 756, 384);
    lv_obj_set_size(fg_weather_uv_label, 232, 56);
    lv_label_set_long_mode(fg_weather_uv_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_weather_uv_label, "UV 2");
    lv_obj_set_style_text_color(fg_weather_uv_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_weather_uv_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_weather_uv_label, LV_TEXT_ALIGN_LEFT, 0);

    fg_forecast_day1_name_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_forecast_day1_name_label, 36, 476);
    lv_obj_set_size(fg_forecast_day1_name_label, 156, 20);
    lv_label_set_long_mode(fg_forecast_day1_name_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_forecast_day1_name_label, "SUN");
    lv_obj_set_style_text_color(fg_forecast_day1_name_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_forecast_day1_name_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_forecast_day1_name_label, LV_TEXT_ALIGN_CENTER, 0);

    LV_IMAGE_DECLARE(fg_upload_fisun_40x40_7ac15a67);
    lv_obj_t * obj22 = lv_image_create(fg_application_page);
    lv_image_set_src(obj22, &fg_upload_fisun_40x40_7ac15a67);
    lv_image_set_scale(obj22, 237);
    lv_image_set_pivot(obj22, 20, 20);
    lv_obj_set_pos(obj22, 94, 498);
    lv_obj_set_size(obj22, 40, 40);
    lv_image_set_inner_align(obj22, LV_IMAGE_ALIGN_CENTER);
    lv_obj_set_style_image_recolor(obj22, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_image_recolor_opa(obj22, LV_OPA_COVER, 0);
    lv_obj_set_style_opa(obj22, 255, 0);
    fg_fi_bind_forecast_day1_icon(obj22, true);
    lv_obj_clear_flag(obj22, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);

    fg_forecast_day1_temperature_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_forecast_day1_temperature_label, 36, 540);
    lv_obj_set_size(fg_forecast_day1_temperature_label, 156, 24);
    lv_label_set_long_mode(fg_forecast_day1_temperature_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_forecast_day1_temperature_label, "17° / 9°");
    lv_obj_set_style_text_color(fg_forecast_day1_temperature_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_forecast_day1_temperature_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_forecast_day1_temperature_label, LV_TEXT_ALIGN_CENTER, 0);

    fg_forecast_day2_name_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_forecast_day2_name_label, 235, 476);
    lv_obj_set_size(fg_forecast_day2_name_label, 156, 20);
    lv_label_set_long_mode(fg_forecast_day2_name_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_forecast_day2_name_label, "MON");
    lv_obj_set_style_text_color(fg_forecast_day2_name_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_forecast_day2_name_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_forecast_day2_name_label, LV_TEXT_ALIGN_CENTER, 0);

    lv_obj_t * obj25 = lv_image_create(fg_application_page);
    lv_image_set_src(obj25, &fg_upload_fisun_40x40_7ac15a67);
    lv_image_set_scale(obj25, 237);
    lv_image_set_pivot(obj25, 20, 20);
    lv_obj_set_pos(obj25, 293, 498);
    lv_obj_set_size(obj25, 40, 40);
    lv_image_set_inner_align(obj25, LV_IMAGE_ALIGN_CENTER);
    lv_obj_set_style_image_recolor(obj25, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_image_recolor_opa(obj25, LV_OPA_COVER, 0);
    lv_obj_set_style_opa(obj25, 255, 0);
    fg_fi_bind_forecast_day2_icon(obj25, true);
    lv_obj_clear_flag(obj25, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);

    fg_forecast_day2_temperature_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_forecast_day2_temperature_label, 235, 540);
    lv_obj_set_size(fg_forecast_day2_temperature_label, 156, 24);
    lv_label_set_long_mode(fg_forecast_day2_temperature_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_forecast_day2_temperature_label, "16° / 10°");
    lv_obj_set_style_text_color(fg_forecast_day2_temperature_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_forecast_day2_temperature_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_forecast_day2_temperature_label, LV_TEXT_ALIGN_CENTER, 0);

    fg_forecast_day3_name_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_forecast_day3_name_label, 434, 476);
    lv_obj_set_size(fg_forecast_day3_name_label, 156, 20);
    lv_label_set_long_mode(fg_forecast_day3_name_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_forecast_day3_name_label, "TUE");
    lv_obj_set_style_text_color(fg_forecast_day3_name_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_forecast_day3_name_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_forecast_day3_name_label, LV_TEXT_ALIGN_CENTER, 0);

    LV_IMAGE_DECLARE(fg_upload_ficloudrain_40x40_bfe0fcc6);
    lv_obj_t * obj28 = lv_image_create(fg_application_page);
    lv_image_set_src(obj28, &fg_upload_ficloudrain_40x40_bfe0fcc6);
    lv_image_set_scale(obj28, 237);
    lv_image_set_pivot(obj28, 20, 20);
    lv_obj_set_pos(obj28, 492, 498);
    lv_obj_set_size(obj28, 40, 40);
    lv_image_set_inner_align(obj28, LV_IMAGE_ALIGN_CENTER);
    lv_obj_set_style_image_recolor(obj28, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_image_recolor_opa(obj28, LV_OPA_COVER, 0);
    lv_obj_set_style_opa(obj28, 255, 0);
    fg_fi_bind_forecast_day3_icon(obj28, true);
    lv_obj_clear_flag(obj28, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);

    fg_forecast_day3_temperature_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_forecast_day3_temperature_label, 434, 540);
    lv_obj_set_size(fg_forecast_day3_temperature_label, 156, 24);
    lv_label_set_long_mode(fg_forecast_day3_temperature_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_forecast_day3_temperature_label, "14° / 8°");
    lv_obj_set_style_text_color(fg_forecast_day3_temperature_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_forecast_day3_temperature_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_forecast_day3_temperature_label, LV_TEXT_ALIGN_CENTER, 0);

    fg_forecast_day4_name_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_forecast_day4_name_label, 633, 476);
    lv_obj_set_size(fg_forecast_day4_name_label, 156, 20);
    lv_label_set_long_mode(fg_forecast_day4_name_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_forecast_day4_name_label, "WED");
    lv_obj_set_style_text_color(fg_forecast_day4_name_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_forecast_day4_name_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_forecast_day4_name_label, LV_TEXT_ALIGN_CENTER, 0);

    lv_obj_t * obj31 = lv_image_create(fg_application_page);
    lv_image_set_src(obj31, &fg_upload_fisun_40x40_7ac15a67);
    lv_image_set_scale(obj31, 237);
    lv_image_set_pivot(obj31, 20, 20);
    lv_obj_set_pos(obj31, 691, 498);
    lv_obj_set_size(obj31, 40, 40);
    lv_image_set_inner_align(obj31, LV_IMAGE_ALIGN_CENTER);
    lv_obj_set_style_image_recolor(obj31, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_image_recolor_opa(obj31, LV_OPA_COVER, 0);
    lv_obj_set_style_opa(obj31, 255, 0);
    fg_fi_bind_forecast_day4_icon(obj31, true);
    lv_obj_clear_flag(obj31, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);

    fg_forecast_day4_temperature_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_forecast_day4_temperature_label, 633, 540);
    lv_obj_set_size(fg_forecast_day4_temperature_label, 156, 24);
    lv_label_set_long_mode(fg_forecast_day4_temperature_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_forecast_day4_temperature_label, "17° / 7°");
    lv_obj_set_style_text_color(fg_forecast_day4_temperature_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_forecast_day4_temperature_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_forecast_day4_temperature_label, LV_TEXT_ALIGN_CENTER, 0);

    fg_forecast_day5_name_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_forecast_day5_name_label, 832, 476);
    lv_obj_set_size(fg_forecast_day5_name_label, 156, 20);
    lv_label_set_long_mode(fg_forecast_day5_name_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_forecast_day5_name_label, "THU");
    lv_obj_set_style_text_color(fg_forecast_day5_name_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_forecast_day5_name_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_forecast_day5_name_label, LV_TEXT_ALIGN_CENTER, 0);

    lv_obj_t * obj34 = lv_image_create(fg_application_page);
    lv_image_set_src(obj34, &fg_upload_fisun_40x40_7ac15a67);
    lv_image_set_scale(obj34, 237);
    lv_image_set_pivot(obj34, 20, 20);
    lv_obj_set_pos(obj34, 890, 498);
    lv_obj_set_size(obj34, 40, 40);
    lv_image_set_inner_align(obj34, LV_IMAGE_ALIGN_CENTER);
    lv_obj_set_style_image_recolor(obj34, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_image_recolor_opa(obj34, LV_OPA_COVER, 0);
    lv_obj_set_style_opa(obj34, 255, 0);
    fg_fi_bind_forecast_day5_icon(obj34, true);
    lv_obj_clear_flag(obj34, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);

    fg_forecast_day5_temperature_label = lv_label_create(fg_application_page);
    lv_obj_set_pos(fg_forecast_day5_temperature_label, 832, 540);
    lv_obj_set_size(fg_forecast_day5_temperature_label, 156, 24);
    lv_label_set_long_mode(fg_forecast_day5_temperature_label, LV_LABEL_LONG_WRAP);
    lv_label_set_text(fg_forecast_day5_temperature_label, "16° / 9°");
    lv_obj_set_style_text_color(fg_forecast_day5_temperature_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(fg_forecast_day5_temperature_label, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(fg_forecast_day5_temperature_label, LV_TEXT_ALIGN_CENTER, 0);

    lv_obj_t * fg_wi_fi_status_label_container = lv_obj_create(fg_application_page);
    lv_obj_set_pos(fg_wi_fi_status_label_container, 855, 368);
    lv_obj_set_size(fg_wi_fi_status_label_container, 120, 60);
    lv_obj_clear_flag(fg_wi_fi_status_label_container, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_wi_fi_status_label_container, 0, 0);
    lv_obj_set_style_border_width(fg_wi_fi_status_label_container, 0, 0);
    lv_obj_set_style_bg_opa(fg_wi_fi_status_label_container, LV_OPA_TRANSP, 0);
    fg_wi_fi_status_label = lv_label_create(fg_wi_fi_status_label_container);
    lv_label_set_text(fg_wi_fi_status_label, "Failed");
    lv_obj_set_size(fg_wi_fi_status_label, 120, LV_SIZE_CONTENT);
    lv_obj_set_style_text_color(fg_wi_fi_status_label, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_text_font(fg_wi_fi_status_label, &lv_font_montserrat_20, 0);
    lv_obj_set_style_text_align(fg_wi_fi_status_label, LV_TEXT_ALIGN_LEFT, 0);
    lv_label_set_long_mode(fg_wi_fi_status_label, LV_LABEL_LONG_CLIP);
    lv_obj_align(fg_wi_fi_status_label, LV_ALIGN_LEFT_MID, 0, 0);


    fg_ram_probe_log("02 after application page creation");
    LV_IMAGE_DECLARE(fg_icon_settings_fi_48px);
    lv_obj_t * system_gear = fg_system_create_button(fg_application_page, "", 948, 18, 58, 58);
    lv_obj_set_style_radius(system_gear, LV_RADIUS_CIRCLE, 0);
    lv_obj_t * system_gear_label = lv_obj_get_child(system_gear, 0);
    lv_obj_add_flag(system_gear_label, LV_OBJ_FLAG_HIDDEN);
    lv_obj_t * system_gear_icon = lv_image_create(system_gear);
    lv_image_set_src(system_gear_icon, &fg_icon_settings_fi_48px);
    lv_image_set_scale(system_gear_icon, 149);
    lv_obj_set_style_image_recolor(system_gear_icon, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_image_recolor_opa(system_gear_icon, LV_OPA_COVER, 0);
    lv_obj_center(system_gear_icon);
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
    lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);
    fg_ram_probe_log("03 after Settings launcher creation");

#if !FG_FEATURE_DIAGNOSTICS
    lv_sysmon_hide_performance(NULL);
#endif
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
    fg_ram_probe_log("04 after Brightness page creation");

    fg_wifi_tick_cb(NULL);
    if (!fg_system_wifi_timer) fg_system_wifi_timer = lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
    fg_ram_probe_log("10 after Wi-Fi timer creation");
}