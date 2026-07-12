#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include <stdbool.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;

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

    if (!fg_wifi_label)
    {
        return;
    }

    fg_wifi_pump();

    char wifi_buf[128];
    snprintf(wifi_buf, sizeof(wifi_buf), "WIFI\n%s\nIP: %s", fg_wifi_status_text(), fg_wifi_ip_text());
    lv_label_set_text(fg_wifi_label, wifi_buf);
}

// ForgeUI LVGL Export Proof V1
// Generated from ForgeUI Studio

void fg_studio_export_create(lv_obj_t *parent)
{
    // Background flavour: Neural Core
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x05030A), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x05030A), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_1024x600_neural_core_67dd4ba0);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_1024x600_neural_core_67dd4ba0);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);

    lv_obj_t * obj1 = lv_obj_create(parent);
    lv_obj_set_pos(obj1, 0, 0);
    lv_obj_set_size(obj1, 1024, 600);
    lv_obj_set_style_radius(obj1, 12, 0);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj1, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj1, 2, 0);

    lv_obj_t * obj2 = lv_label_create(parent);
    lv_label_set_text(obj2, "Rapid Charge");
    lv_obj_set_pos(obj2, 36, 24);
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj2, &lv_font_montserrat_32, 0);

    lv_obj_t * obj3 = lv_led_create(parent);
    lv_obj_set_pos(obj3, 820, 34);
    lv_obj_set_size(obj3, 22, 22);
    lv_led_set_color(obj3, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj3, 255);
    lv_led_on(obj3);

    lv_obj_t * obj4 = lv_label_create(parent);
    lv_label_set_text(obj4, "Vehicle Connected");
    lv_obj_set_pos(obj4, 850, 28);
    lv_obj_set_style_text_color(obj4, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj4, &lv_font_montserrat_24, 0);

    lv_obj_t * obj5 = lv_arc_create(parent);
    lv_obj_set_pos(obj5, 58, 112);
    lv_obj_set_size(obj5, 280, 280);
    lv_arc_set_range(obj5, 0, 100);
    lv_arc_set_value(obj5, 60);
    lv_obj_set_style_arc_color(obj5, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_arc_color(obj5, lv_color_hex(0xD946EF), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj5, lv_color_hex(0x05030A), LV_PART_KNOB);

    lv_obj_t * obj6 = lv_label_create(parent);
    lv_label_set_text(obj6, "68%");
    lv_obj_set_pos(obj6, 134, 198);
    lv_obj_set_style_text_color(obj6, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj6, &lv_font_montserrat_32, 0);

    lv_obj_t * obj7 = lv_label_create(parent);
    lv_label_set_text(obj7, "Battery Charge");
    lv_obj_set_pos(obj7, 134, 244);
    lv_obj_set_style_text_color(obj7, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj7, &lv_font_montserrat_24, 0);

    lv_obj_t * obj8 = lv_obj_create(parent);
    lv_obj_set_pos(obj8, 372, 104);
    lv_obj_set_size(obj8, 592, 292);
    lv_obj_set_style_radius(obj8, 12, 0);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj8, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj8, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj8, 2, 0);

    lv_obj_t * obj9 = lv_label_create(parent);
    lv_label_set_text(obj9, "Power: 148 kW");
    lv_obj_set_pos(obj9, 404, 132);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj9, &lv_font_montserrat_24, 0);

    lv_obj_t * obj10 = lv_label_create(parent);
    lv_label_set_text(obj10, "Energy Delivered: 34.6 kWh");
    lv_obj_set_pos(obj10, 404, 178);
    lv_obj_set_style_text_color(obj10, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj10, &lv_font_montserrat_24, 0);

    lv_obj_t * obj11 = lv_label_create(parent);
    lv_label_set_text(obj11, "Time Remaining: 18 min");
    lv_obj_set_pos(obj11, 404, 224);
    lv_obj_set_style_text_color(obj11, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj11, &lv_font_montserrat_24, 0);

    lv_obj_t * obj12 = lv_label_create(parent);
    lv_label_set_text(obj12, "Cost So Far: $12.40");
    lv_obj_set_pos(obj12, 404, 270);
    lv_obj_set_style_text_color(obj12, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj12, &lv_font_montserrat_24, 0);

    lv_obj_t * obj13 = lv_bar_create(parent);
    lv_obj_set_pos(obj13, 404, 322);
    lv_obj_set_size(obj13, 520, 24);
    lv_bar_set_range(obj13, 0, 100);
    lv_bar_set_value(obj13, 60, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(obj13, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj13, lv_color_hex(0xD946EF), LV_PART_INDICATOR);

    lv_obj_t * obj14 = lv_button_create(parent);
    lv_obj_set_pos(obj14, 404, 382);
    lv_obj_set_size(obj14, 220, 64);
    lv_obj_set_style_radius(obj14, 12, 0);
    lv_obj_set_style_bg_color(obj14, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj14, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj14, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj14, 2, 0);
    lv_obj_t * obj14_label = lv_label_create(obj14);
    lv_label_set_text(obj14_label, "Stop Charging");
    lv_obj_set_style_text_color(obj14_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj14_label);

    lv_obj_t * obj15 = lv_button_create(parent);
    lv_obj_set_pos(obj15, 646, 382);
    lv_obj_set_size(obj15, 220, 64);
    lv_obj_set_style_radius(obj15, 12, 0);
    lv_obj_set_style_bg_color(obj15, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj15, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj15, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj15, 2, 0);
    lv_obj_t * obj15_label = lv_label_create(obj15);
    lv_label_set_text(obj15_label, "Charging Details");
    lv_obj_set_style_text_color(obj15_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj15_label);

    lv_obj_t * obj16 = lv_button_create(parent);
    lv_obj_set_pos(obj16, 910, 516);
    lv_obj_set_size(obj16, 86, 44);
    lv_obj_set_style_radius(obj16, 12, 0);
    lv_obj_set_style_bg_color(obj16, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj16, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj16, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj16, 2, 0);
    lv_obj_t * obj16_label = lv_label_create(obj16);
    lv_label_set_text(obj16_label, "Help");
    lv_obj_set_style_text_color(obj16_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj16_label);

    lv_obj_t * obj17 = lv_label_create(parent);
    lv_label_set_text(obj17, "Charger ID: NZ-FAST-014");
    lv_obj_set_pos(obj17, 40, 546);
    lv_obj_set_style_text_color(obj17, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj17, &lv_font_montserrat_24, 0);

    lv_obj_t * obj18 = lv_label_create(parent);
    lv_label_set_text(obj18, "Network: Online");
    lv_obj_set_pos(obj18, 388, 546);
    lv_obj_set_style_text_color(obj18, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj18, &lv_font_montserrat_24, 0);

    lv_obj_t * obj19 = lv_label_create(parent);
    lv_label_set_text(obj19, "Payment: Approved");
    lv_obj_set_pos(obj19, 648, 546);
    lv_obj_set_style_text_color(obj19, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj19, &lv_font_montserrat_24, 0);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}