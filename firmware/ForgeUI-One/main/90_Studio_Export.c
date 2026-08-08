#include "90_Studio_Export.h"
#include "00_ForgeUI_Features.h"
#include "05_FG_RAM_Probe.h"
#include "lvgl.h"
#include "bsp/display.h"
#include "20_RTC.h"
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "freertos/task.h"
#include "esp_timer.h"
#include "95_UserEvents.h"
#include <stdbool.h>
#include <stdint.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

static lv_obj_t * fg_application_page = NULL;
static lv_obj_t * fg_fram_address_input = NULL;
static bool fg_fram_address_input_programmatic_update = false;
static lv_obj_t * fg_fram_status_input = NULL;
static bool fg_fram_status_input_programmatic_update = false;
static lv_obj_t * fg_fram_value_input = NULL;
static bool fg_fram_value_input_programmatic_update = false;
static lv_obj_t * fg_fram_verify_input = NULL;
static bool fg_fram_verify_input_programmatic_update = false;
static void fg_keyboard_hide(void);
static void fg_keyboard_show_for(lv_obj_t * textarea);
static void fg_keyboard_event_cb(lv_event_t * event);

static void fg_fram_address_input_value_changed_cb(lv_event_t * event)
{
    lv_obj_t * input = lv_event_get_current_target(event);
    if (input != fg_fram_address_input || fg_fram_address_input_programmatic_update) return;
    FG_On_FRAM_Address_Changed(lv_textarea_get_text(input));
}

void FG_Set_FRAM_Address_Text(const char * text)
{
    if (fg_fram_address_input == NULL) return;
    if (text == NULL) text = "";
    if (strcmp(lv_textarea_get_text(fg_fram_address_input), text) == 0) return;
    fg_fram_address_input_programmatic_update = true;
    lv_textarea_set_text(fg_fram_address_input, text);
    fg_fram_address_input_programmatic_update = false;
}

static void fg_fram_status_input_value_changed_cb(lv_event_t * event)
{
    lv_obj_t * input = lv_event_get_current_target(event);
    if (input != fg_fram_status_input || fg_fram_status_input_programmatic_update) return;
    FG_On_FRAM_Status_Changed(lv_textarea_get_text(input));
}

void FG_Set_FRAM_Status_Text(const char * text)
{
    if (fg_fram_status_input == NULL) return;
    if (text == NULL) text = "";
    if (strcmp(lv_textarea_get_text(fg_fram_status_input), text) == 0) return;
    fg_fram_status_input_programmatic_update = true;
    lv_textarea_set_text(fg_fram_status_input, text);
    fg_fram_status_input_programmatic_update = false;
}

static void fg_fram_value_input_value_changed_cb(lv_event_t * event)
{
    lv_obj_t * input = lv_event_get_current_target(event);
    if (input != fg_fram_value_input || fg_fram_value_input_programmatic_update) return;
    FG_On_FRAM_Value_Changed(lv_textarea_get_text(input));
}

void FG_Set_FRAM_Value_Text(const char * text)
{
    if (fg_fram_value_input == NULL) return;
    if (text == NULL) text = "";
    if (strcmp(lv_textarea_get_text(fg_fram_value_input), text) == 0) return;
    fg_fram_value_input_programmatic_update = true;
    lv_textarea_set_text(fg_fram_value_input, text);
    fg_fram_value_input_programmatic_update = false;
}

static void fg_fram_verify_input_value_changed_cb(lv_event_t * event)
{
    lv_obj_t * input = lv_event_get_current_target(event);
    if (input != fg_fram_verify_input || fg_fram_verify_input_programmatic_update) return;
    FG_On_FRAM_Verify_Changed(lv_textarea_get_text(input));
}

void FG_Set_FRAM_Verify_Text(const char * text)
{
    if (fg_fram_verify_input == NULL) return;
    if (text == NULL) text = "";
    if (strcmp(lv_textarea_get_text(fg_fram_verify_input), text) == 0) return;
    fg_fram_verify_input_programmatic_update = true;
    lv_textarea_set_text(fg_fram_verify_input, text);
    fg_fram_verify_input_programmatic_update = false;
}

static void fg_window_close_cb(lv_event_t * event)
{
    lv_obj_t * window = (lv_obj_t *)lv_event_get_user_data(event);
    if (window) lv_obj_add_flag(window, LV_OBJ_FLAG_HIDDEN);
}

static void fg_read_test_clicked_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    FG_On_READ_TEST_Clicked();
}

static void fg_write_test_clicked_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    FG_On_WRITE_TEST_Clicked();
}

static void FG_Set_Display_Brightness(uint8_t percent)
{
    if (percent < 10) percent = 10;
    if (percent > 100) percent = 100;
    (void)bsp_display_brightness_set((int)percent);
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

    lv_obj_t * obj1 = lv_label_create(fg_application_page);
    lv_obj_set_pos(obj1, 64, 38);
    lv_label_set_long_mode(obj1, LV_LABEL_LONG_WRAP);
    lv_obj_set_size(obj1, 896, 54);
    lv_label_set_text(obj1, "HARDWARE EXAMPLE 02");
    lv_obj_set_style_text_color(obj1, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj1, &lv_font_montserrat_32, 0);
    lv_obj_set_style_text_align(obj1, LV_TEXT_ALIGN_LEFT, 0);

    lv_obj_t * obj2 = lv_label_create(fg_application_page);
    lv_obj_set_pos(obj2, 66, 96);
    lv_obj_set_size(obj2, 896, 36);
    lv_label_set_long_mode(obj2, LV_LABEL_LONG_WRAP);
    lv_label_set_text(obj2, "I²C FRAM PERSISTENCE");
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj2, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(obj2, LV_TEXT_ALIGN_LEFT, 0);

    lv_obj_t * obj3 = lv_label_create(fg_application_page);
    lv_obj_set_pos(obj3, 90, 170);
    lv_label_set_long_mode(obj3, LV_LABEL_LONG_WRAP);
    lv_obj_set_size(obj3, 520, 40);
    lv_label_set_text(obj3, "FRAM MEMORY — MB85RC256V");
    lv_obj_set_style_text_color(obj3, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj3, &lv_font_montserrat_32, 0);
    lv_obj_set_style_text_align(obj3, LV_TEXT_ALIGN_LEFT, 0);

    fg_fram_status_input = lv_textarea_create(fg_application_page);
    lv_textarea_set_one_line(fg_fram_status_input, true);
    lv_textarea_set_placeholder_text(fg_fram_status_input, "Input");
    lv_textarea_set_text(fg_fram_status_input, "DISCOVERING");
    lv_obj_set_pos(fg_fram_status_input, 110, 230);
    lv_obj_set_size(fg_fram_status_input, 330, 26);
    lv_obj_set_style_bg_color(fg_fram_status_input, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_fram_status_input, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_text_color(fg_fram_status_input, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_border_color(fg_fram_status_input, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_opa(fg_fram_status_input, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_border_width(fg_fram_status_input, 1, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_fram_status_input, 6, LV_PART_MAIN);
    lv_obj_set_style_outline_width(fg_fram_status_input, 0, LV_PART_MAIN);
    lv_obj_set_style_shadow_width(fg_fram_status_input, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_left(fg_fram_status_input, 16, LV_PART_MAIN);
    lv_obj_set_style_pad_right(fg_fram_status_input, 16, LV_PART_MAIN);
    lv_obj_set_style_pad_top(fg_fram_status_input, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_bottom(fg_fram_status_input, 0, LV_PART_MAIN);
    lv_obj_set_style_bg_opa(fg_fram_status_input, LV_OPA_TRANSP, LV_PART_SCROLLBAR);
    lv_obj_set_style_border_width(fg_fram_status_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_outline_width(fg_fram_status_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_shadow_width(fg_fram_status_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_text_color(fg_fram_status_input, lv_color_hex(0xB5B6B8), LV_PART_TEXTAREA_PLACEHOLDER);
    lv_obj_set_style_border_color(fg_fram_status_input, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_border_width(fg_fram_status_input, 1, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_outline_width(fg_fram_status_input, 0, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_shadow_width(fg_fram_status_input, 0, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_text_color(fg_fram_status_input, lv_color_hex(0x7F8284), LV_PART_MAIN | LV_STATE_DISABLED);
    lv_obj_add_event_cb(fg_fram_status_input, fg_fram_status_input_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);

    fg_fram_address_input = lv_textarea_create(fg_application_page);
    lv_textarea_set_one_line(fg_fram_address_input, true);
    lv_textarea_set_placeholder_text(fg_fram_address_input, "Input");
    lv_textarea_set_text(fg_fram_address_input, "--");
    lv_obj_set_pos(fg_fram_address_input, 110, 280);
    lv_obj_set_size(fg_fram_address_input, 330, 26);
    lv_obj_set_style_bg_color(fg_fram_address_input, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_fram_address_input, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_text_color(fg_fram_address_input, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_border_color(fg_fram_address_input, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_opa(fg_fram_address_input, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_border_width(fg_fram_address_input, 1, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_fram_address_input, 6, LV_PART_MAIN);
    lv_obj_set_style_outline_width(fg_fram_address_input, 0, LV_PART_MAIN);
    lv_obj_set_style_shadow_width(fg_fram_address_input, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_left(fg_fram_address_input, 16, LV_PART_MAIN);
    lv_obj_set_style_pad_right(fg_fram_address_input, 16, LV_PART_MAIN);
    lv_obj_set_style_pad_top(fg_fram_address_input, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_bottom(fg_fram_address_input, 0, LV_PART_MAIN);
    lv_obj_set_style_bg_opa(fg_fram_address_input, LV_OPA_TRANSP, LV_PART_SCROLLBAR);
    lv_obj_set_style_border_width(fg_fram_address_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_outline_width(fg_fram_address_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_shadow_width(fg_fram_address_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_text_color(fg_fram_address_input, lv_color_hex(0xB5B6B8), LV_PART_TEXTAREA_PLACEHOLDER);
    lv_obj_set_style_border_color(fg_fram_address_input, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_border_width(fg_fram_address_input, 1, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_outline_width(fg_fram_address_input, 0, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_shadow_width(fg_fram_address_input, 0, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_text_color(fg_fram_address_input, lv_color_hex(0x7F8284), LV_PART_MAIN | LV_STATE_DISABLED);
    lv_obj_add_event_cb(fg_fram_address_input, fg_fram_address_input_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);

    fg_fram_value_input = lv_textarea_create(fg_application_page);
    lv_textarea_set_one_line(fg_fram_value_input, true);
    lv_textarea_set_placeholder_text(fg_fram_value_input, "Input");
    lv_textarea_set_text(fg_fram_value_input, "---- / ----");
    lv_obj_set_pos(fg_fram_value_input, 110, 330);
    lv_obj_set_size(fg_fram_value_input, 330, 26);
    lv_obj_set_style_bg_color(fg_fram_value_input, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_fram_value_input, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_text_color(fg_fram_value_input, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_border_color(fg_fram_value_input, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_opa(fg_fram_value_input, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_border_width(fg_fram_value_input, 1, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_fram_value_input, 6, LV_PART_MAIN);
    lv_obj_set_style_outline_width(fg_fram_value_input, 0, LV_PART_MAIN);
    lv_obj_set_style_shadow_width(fg_fram_value_input, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_left(fg_fram_value_input, 16, LV_PART_MAIN);
    lv_obj_set_style_pad_right(fg_fram_value_input, 16, LV_PART_MAIN);
    lv_obj_set_style_pad_top(fg_fram_value_input, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_bottom(fg_fram_value_input, 0, LV_PART_MAIN);
    lv_obj_set_style_bg_opa(fg_fram_value_input, LV_OPA_TRANSP, LV_PART_SCROLLBAR);
    lv_obj_set_style_border_width(fg_fram_value_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_outline_width(fg_fram_value_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_shadow_width(fg_fram_value_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_text_color(fg_fram_value_input, lv_color_hex(0xB5B6B8), LV_PART_TEXTAREA_PLACEHOLDER);
    lv_obj_set_style_border_color(fg_fram_value_input, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_border_width(fg_fram_value_input, 1, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_outline_width(fg_fram_value_input, 0, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_shadow_width(fg_fram_value_input, 0, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_text_color(fg_fram_value_input, lv_color_hex(0x7F8284), LV_PART_MAIN | LV_STATE_DISABLED);
    lv_obj_add_event_cb(fg_fram_value_input, fg_fram_value_input_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);

    fg_fram_verify_input = lv_textarea_create(fg_application_page);
    lv_textarea_set_one_line(fg_fram_verify_input, true);
    lv_textarea_set_placeholder_text(fg_fram_verify_input, "Input");
    lv_textarea_set_text(fg_fram_verify_input, "NOT RUN");
    lv_obj_set_pos(fg_fram_verify_input, 110, 380);
    lv_obj_set_size(fg_fram_verify_input, 330, 26);
    lv_obj_set_style_bg_color(fg_fram_verify_input, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(fg_fram_verify_input, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_text_color(fg_fram_verify_input, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_border_color(fg_fram_verify_input, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_opa(fg_fram_verify_input, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_border_width(fg_fram_verify_input, 1, LV_PART_MAIN);
    lv_obj_set_style_radius(fg_fram_verify_input, 6, LV_PART_MAIN);
    lv_obj_set_style_outline_width(fg_fram_verify_input, 0, LV_PART_MAIN);
    lv_obj_set_style_shadow_width(fg_fram_verify_input, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_left(fg_fram_verify_input, 16, LV_PART_MAIN);
    lv_obj_set_style_pad_right(fg_fram_verify_input, 16, LV_PART_MAIN);
    lv_obj_set_style_pad_top(fg_fram_verify_input, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_bottom(fg_fram_verify_input, 0, LV_PART_MAIN);
    lv_obj_set_style_bg_opa(fg_fram_verify_input, LV_OPA_TRANSP, LV_PART_SCROLLBAR);
    lv_obj_set_style_border_width(fg_fram_verify_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_outline_width(fg_fram_verify_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_shadow_width(fg_fram_verify_input, 0, LV_PART_SCROLLBAR);
    lv_obj_set_style_text_color(fg_fram_verify_input, lv_color_hex(0xB5B6B8), LV_PART_TEXTAREA_PLACEHOLDER);
    lv_obj_set_style_border_color(fg_fram_verify_input, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_border_width(fg_fram_verify_input, 1, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_outline_width(fg_fram_verify_input, 0, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_shadow_width(fg_fram_verify_input, 0, LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_text_color(fg_fram_verify_input, lv_color_hex(0x7F8284), LV_PART_MAIN | LV_STATE_DISABLED);
    lv_obj_add_event_cb(fg_fram_verify_input, fg_fram_verify_input_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);

    lv_obj_t * obj8 = lv_button_create(fg_application_page);
    lv_obj_set_pos(obj8, 560, 250);
    lv_obj_set_size(obj8, 170, 64);
    lv_obj_set_style_radius(obj8, 12, 0);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj8, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj8, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj8, 2, 0);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_PRESSED);
    lv_obj_set_style_border_color(obj8, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x2A3138), LV_PART_MAIN | LV_STATE_DISABLED);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0xF5F5F5), LV_PART_MAIN);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0x121417), LV_PART_MAIN | LV_STATE_PRESSED);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0x7F8284), LV_PART_MAIN | LV_STATE_DISABLED);
    lv_obj_t * obj8_label = lv_label_create(obj8);
    lv_label_set_text(obj8_label, "WRITE TEST");
    lv_obj_set_style_text_font(obj8_label, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_align(obj8_label, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_center(obj8_label);
    lv_obj_add_event_cb(obj8, fg_write_test_clicked_cb, LV_EVENT_CLICKED, NULL);

    lv_obj_t * obj9 = lv_button_create(fg_application_page);
    lv_obj_set_pos(obj9, 760, 250);
    lv_obj_set_size(obj9, 170, 64);
    lv_obj_set_style_radius(obj9, 12, 0);
    lv_obj_set_style_bg_color(obj9, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj9, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj9, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj9, 2, 0);
    lv_obj_set_style_bg_color(obj9, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_PRESSED);
    lv_obj_set_style_border_color(obj9, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_FOCUSED);
    lv_obj_set_style_bg_color(obj9, lv_color_hex(0x2A3138), LV_PART_MAIN | LV_STATE_DISABLED);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xF5F5F5), LV_PART_MAIN);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0x121417), LV_PART_MAIN | LV_STATE_PRESSED);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0x7F8284), LV_PART_MAIN | LV_STATE_DISABLED);
    lv_obj_t * obj9_label = lv_label_create(obj9);
    lv_label_set_text(obj9_label, "READ TEST");
    lv_obj_set_style_text_font(obj9_label, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_align(obj9_label, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_center(obj9_label);
    lv_obj_add_event_cb(obj9, fg_read_test_clicked_cb, LV_EVENT_CLICKED, NULL);


    fg_ram_probe_log("02 after application page creation");

}