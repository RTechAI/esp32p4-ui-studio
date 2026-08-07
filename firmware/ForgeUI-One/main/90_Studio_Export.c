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
static lv_obj_t * fg_indicator1_led = NULL;
static bool fg_indicator1_led_on = false;
static lv_obj_t * fg_indicator2_led = NULL;
static bool fg_indicator2_led_on = false;
static lv_obj_t * fg_led1_toggle_switch = NULL;
static bool fg_led1_toggle_switch_programmatic_update = false;
static void fg_led1_toggle_switch_value_changed_cb(lv_event_t * event);
static lv_obj_t * fg_led2_toggle_switch = NULL;
static bool fg_led2_toggle_switch_programmatic_update = false;
static void fg_led2_toggle_switch_value_changed_cb(lv_event_t * event);
static void fg_keyboard_hide(void);
static void fg_keyboard_show_for(lv_obj_t * textarea);
static void fg_keyboard_event_cb(lv_event_t * event);

void FG_Set_Indicator1(bool on)
{
    if (fg_indicator1_led == NULL || fg_indicator1_led_on == on) return;
    fg_indicator1_led_on = on;
    if (on) lv_led_on(fg_indicator1_led); else lv_led_off(fg_indicator1_led);
    FG_On_Indicator1_Changed(on);
}

void FG_Set_Indicator2(bool on)
{
    if (fg_indicator2_led == NULL || fg_indicator2_led_on == on) return;
    fg_indicator2_led_on = on;
    if (on) lv_led_on(fg_indicator2_led); else lv_led_off(fg_indicator2_led);
    FG_On_Indicator2_Changed(on);
}

static void fg_led1_toggle_switch_value_changed_cb(lv_event_t * event)
{
    lv_obj_t * switch_object = lv_event_get_current_target(event);
    if (switch_object != fg_led1_toggle_switch || fg_led1_toggle_switch_programmatic_update) return;
    bool checked = lv_obj_has_state(switch_object, LV_STATE_CHECKED);
    FG_On_LED1_Toggle_Changed(checked);
}

void FG_Set_LED1_Toggle_Checked(bool checked)
{
    if (fg_led1_toggle_switch == NULL) return;
    bool current_checked = lv_obj_has_state(fg_led1_toggle_switch, LV_STATE_CHECKED);
    if (current_checked == checked) return;
    fg_led1_toggle_switch_programmatic_update = true;
    if (checked) {
        lv_obj_add_state(fg_led1_toggle_switch, LV_STATE_CHECKED);
    } else {
        lv_obj_remove_state(fg_led1_toggle_switch, LV_STATE_CHECKED);
    }
    fg_led1_toggle_switch_programmatic_update = false;
}

static void fg_led2_toggle_switch_value_changed_cb(lv_event_t * event)
{
    lv_obj_t * switch_object = lv_event_get_current_target(event);
    if (switch_object != fg_led2_toggle_switch || fg_led2_toggle_switch_programmatic_update) return;
    bool checked = lv_obj_has_state(switch_object, LV_STATE_CHECKED);
    FG_On_LED2_Toggle_Changed(checked);
}

void FG_Set_LED2_Toggle_Checked(bool checked)
{
    if (fg_led2_toggle_switch == NULL) return;
    bool current_checked = lv_obj_has_state(fg_led2_toggle_switch, LV_STATE_CHECKED);
    if (current_checked == checked) return;
    fg_led2_toggle_switch_programmatic_update = true;
    if (checked) {
        lv_obj_add_state(fg_led2_toggle_switch, LV_STATE_CHECKED);
    } else {
        lv_obj_remove_state(fg_led2_toggle_switch, LV_STATE_CHECKED);
    }
    fg_led2_toggle_switch_programmatic_update = false;
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
    lv_label_set_text(obj1, "HARDWARE EXAMPLE 01");
    lv_obj_set_style_text_color(obj1, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj1, &lv_font_montserrat_32, 0);
    lv_obj_set_style_text_align(obj1, LV_TEXT_ALIGN_LEFT, 0);

    lv_obj_t * obj2 = lv_label_create(fg_application_page);
    lv_obj_set_pos(obj2, 66, 96);
    lv_obj_set_size(obj2, 896, 36);
    lv_label_set_long_mode(obj2, LV_LABEL_LONG_WRAP);
    lv_label_set_text(obj2, "2 BUTTONS + 2 LEDS");
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj2, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(obj2, LV_TEXT_ALIGN_LEFT, 0);

    lv_obj_t * obj3 = lv_label_create(fg_application_page);
    lv_obj_set_pos(obj3, 90, 166);
    lv_label_set_long_mode(obj3, LV_LABEL_LONG_WRAP);
    lv_obj_set_size(obj3, 360, 40);
    lv_label_set_text(obj3, "PHYSICAL INPUTS");
    lv_obj_set_style_text_color(obj3, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj3, &lv_font_montserrat_32, 0);
    lv_obj_set_style_text_align(obj3, LV_TEXT_ALIGN_LEFT, 0);

    lv_obj_t * obj4 = lv_label_create(fg_application_page);
    lv_obj_set_pos(obj4, 110, 232);
    lv_obj_set_size(obj4, 210, 34);
    lv_label_set_long_mode(obj4, LV_LABEL_LONG_WRAP);
    lv_label_set_text(obj4, "Button 1      Indicator 1");
    lv_obj_set_style_text_color(obj4, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj4, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(obj4, LV_TEXT_ALIGN_LEFT, 0);

    fg_indicator1_led = lv_led_create(fg_application_page);
    lv_obj_set_pos(fg_indicator1_led, 342, 231);
    lv_obj_set_size(fg_indicator1_led, 36, 36);
    lv_led_set_color(fg_indicator1_led, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(fg_indicator1_led, 255);
    lv_led_off(fg_indicator1_led);
    fg_indicator1_led_on = false;

    lv_obj_t * obj6 = lv_label_create(fg_application_page);
    lv_obj_set_pos(obj6, 110, 306);
    lv_obj_set_size(obj6, 210, 34);
    lv_label_set_long_mode(obj6, LV_LABEL_LONG_WRAP);
    lv_label_set_text(obj6, "Button 2      Indicator 2");
    lv_obj_set_style_text_color(obj6, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj6, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(obj6, LV_TEXT_ALIGN_LEFT, 0);

    fg_indicator2_led = lv_led_create(fg_application_page);
    lv_obj_set_pos(fg_indicator2_led, 342, 305);
    lv_obj_set_size(fg_indicator2_led, 36, 36);
    lv_led_set_color(fg_indicator2_led, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(fg_indicator2_led, 255);
    lv_led_off(fg_indicator2_led);
    fg_indicator2_led_on = false;

    lv_obj_t * obj8 = lv_label_create(fg_application_page);
    lv_obj_set_pos(obj8, 574, 166);
    lv_label_set_long_mode(obj8, LV_LABEL_LONG_WRAP);
    lv_obj_set_size(obj8, 360, 40);
    lv_label_set_text(obj8, "PHYSICAL OUTPUTS");
    lv_obj_set_style_text_color(obj8, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj8, &lv_font_montserrat_32, 0);
    lv_obj_set_style_text_align(obj8, LV_TEXT_ALIGN_LEFT, 0);

    lv_obj_t * obj9 = lv_label_create(fg_application_page);
    lv_obj_set_pos(obj9, 594, 232);
    lv_obj_set_size(obj9, 190, 34);
    lv_label_set_long_mode(obj9, LV_LABEL_LONG_WRAP);
    lv_label_set_text(obj9, "LED1 Toggle");
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj9, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(obj9, LV_TEXT_ALIGN_LEFT, 0);

    fg_led1_toggle_switch = lv_switch_create(fg_application_page);
    lv_obj_set_pos(fg_led1_toggle_switch, 820, 229);
    lv_obj_set_size(fg_led1_toggle_switch, 64, 36);
    lv_obj_add_state(fg_led1_toggle_switch, LV_STATE_CHECKED);
    lv_obj_set_style_bg_color(fg_led1_toggle_switch, lv_color_hex(0x2A3138), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(fg_led1_toggle_switch, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_bg_color(fg_led1_toggle_switch, lv_color_hex(0xF2A900), LV_PART_INDICATOR);
    lv_obj_set_style_bg_opa(fg_led1_toggle_switch, LV_OPA_TRANSP, LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(fg_led1_toggle_switch, lv_color_hex(0xF2A900), LV_PART_INDICATOR | LV_STATE_CHECKED);
    lv_obj_set_style_bg_opa(fg_led1_toggle_switch, LV_OPA_COVER, LV_PART_INDICATOR | LV_STATE_CHECKED);
    lv_obj_set_style_bg_color(fg_led1_toggle_switch, lv_color_hex(0x121417), LV_PART_KNOB);
    lv_obj_set_style_bg_opa(fg_led1_toggle_switch, LV_OPA_COVER, LV_PART_KNOB);
    lv_obj_add_event_cb(fg_led1_toggle_switch, fg_led1_toggle_switch_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);

    lv_obj_t * obj11 = lv_label_create(fg_application_page);
    lv_obj_set_pos(obj11, 594, 306);
    lv_obj_set_size(obj11, 190, 34);
    lv_label_set_long_mode(obj11, LV_LABEL_LONG_WRAP);
    lv_label_set_text(obj11, "LED2 Toggle");
    lv_obj_set_style_text_color(obj11, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj11, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_align(obj11, LV_TEXT_ALIGN_LEFT, 0);

    fg_led2_toggle_switch = lv_switch_create(fg_application_page);
    lv_obj_set_pos(fg_led2_toggle_switch, 820, 303);
    lv_obj_set_size(fg_led2_toggle_switch, 64, 36);
    lv_obj_add_state(fg_led2_toggle_switch, LV_STATE_CHECKED);
    lv_obj_set_style_bg_color(fg_led2_toggle_switch, lv_color_hex(0x2A3138), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(fg_led2_toggle_switch, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_bg_color(fg_led2_toggle_switch, lv_color_hex(0xF2A900), LV_PART_INDICATOR);
    lv_obj_set_style_bg_opa(fg_led2_toggle_switch, LV_OPA_TRANSP, LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(fg_led2_toggle_switch, lv_color_hex(0xF2A900), LV_PART_INDICATOR | LV_STATE_CHECKED);
    lv_obj_set_style_bg_opa(fg_led2_toggle_switch, LV_OPA_COVER, LV_PART_INDICATOR | LV_STATE_CHECKED);
    lv_obj_set_style_bg_color(fg_led2_toggle_switch, lv_color_hex(0x121417), LV_PART_KNOB);
    lv_obj_set_style_bg_opa(fg_led2_toggle_switch, LV_OPA_COVER, LV_PART_KNOB);
    lv_obj_add_event_cb(fg_led2_toggle_switch, fg_led2_toggle_switch_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);


    fg_ram_probe_log("02 after application page creation");

}