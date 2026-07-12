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

    lv_obj_t * obj1 = lv_label_create(parent);
    lv_label_set_text(obj1, "Machine Dashboard");
    lv_obj_set_pos(obj1, 30, 20);
    lv_obj_set_style_text_color(obj1, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj1, &lv_font_montserrat_32, 0);

    lv_obj_t * obj2 = lv_button_create(parent);
    lv_obj_set_pos(obj2, 790, 18);
    lv_obj_set_size(obj2, 200, 54);
    lv_obj_set_style_radius(obj2, 12, 0);
    lv_obj_set_style_bg_color(obj2, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj2, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj2, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj2, 2, 0);
    lv_obj_t * obj2_label = lv_label_create(obj2);
    lv_label_set_text(obj2_label, "Settings");
    lv_obj_set_style_text_color(obj2_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj2_label);

    lv_obj_t * obj3 = lv_button_create(parent);
    lv_obj_set_pos(obj3, 30, 90);
    lv_obj_set_size(obj3, 220, 90);
    lv_obj_set_style_radius(obj3, 12, 0);
    lv_obj_set_style_bg_color(obj3, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj3, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj3, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj3, 2, 0);
    lv_obj_t * obj3_label = lv_label_create(obj3);
    lv_label_set_text(obj3_label, "EMERGENCY STOP");
    lv_obj_set_style_text_color(obj3_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj3_label);

    lv_obj_t * obj4 = lv_obj_create(parent);
    lv_obj_set_pos(obj4, 280, 90);
    lv_obj_set_size(obj4, 180, 120);
    lv_obj_set_style_radius(obj4, 12, 0);
    lv_obj_set_style_bg_color(obj4, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj4, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj4, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj4, 2, 0);

    lv_obj_t * obj5 = lv_label_create(parent);
    lv_label_set_text(obj5, "Motor Status");
    lv_obj_set_pos(obj5, 305, 105);
    lv_obj_set_style_text_color(obj5, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj5, &lv_font_montserrat_24, 0);

    lv_obj_t * obj6 = lv_led_create(parent);
    lv_obj_set_pos(obj6, 340, 140);
    lv_obj_set_size(obj6, 48, 48);
    lv_led_set_color(obj6, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj6, 255);
    lv_led_on(obj6);

    lv_obj_t * obj7 = lv_label_create(parent);
    lv_label_set_text(obj7, "Running");
    lv_obj_set_pos(obj7, 305, 212);
    lv_obj_set_style_text_color(obj7, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj7, &lv_font_montserrat_24, 0);

    lv_obj_t * obj8 = lv_obj_create(parent);
    lv_obj_set_pos(obj8, 500, 90);
    lv_obj_set_size(obj8, 240, 240);
    lv_obj_set_style_radius(obj8, 12, 0);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj8, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj8, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj8, 2, 0);

    lv_obj_t * obj9 = lv_label_create(parent);
    lv_label_set_text(obj9, "Temperature");
    lv_obj_set_pos(obj9, 545, 105);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj9, &lv_font_montserrat_24, 0);

    lv_obj_t * obj10 = lv_arc_create(parent);
    lv_obj_set_pos(obj10, 545, 140);
    lv_obj_set_size(obj10, 150, 150);
    lv_arc_set_range(obj10, 0, 100);
    lv_arc_set_value(obj10, 65);

    lv_obj_t * obj11 = lv_label_create(parent);
    lv_label_set_text(obj11, "78°C");
    lv_obj_set_pos(obj11, 573, 180);
    lv_obj_set_style_text_color(obj11, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj11, &lv_font_montserrat_24, 0);

    lv_obj_t * obj12 = lv_obj_create(parent);
    lv_obj_set_pos(obj12, 770, 90);
    lv_obj_set_size(obj12, 240, 240);
    lv_obj_set_style_radius(obj12, 12, 0);
    lv_obj_set_style_bg_color(obj12, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj12, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj12, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj12, 2, 0);

    lv_obj_t * obj13 = lv_label_create(parent);
    lv_label_set_text(obj13, "Pressure");
    lv_obj_set_pos(obj13, 835, 105);
    lv_obj_set_style_text_color(obj13, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj13, &lv_font_montserrat_24, 0);

    lv_obj_t * obj14 = lv_arc_create(parent);
    lv_obj_set_pos(obj14, 825, 140);
    lv_obj_set_size(obj14, 150, 150);
    lv_arc_set_range(obj14, 0, 100);
    lv_arc_set_value(obj14, 65);

    lv_obj_t * obj15 = lv_label_create(parent);
    lv_label_set_text(obj15, "4.2 bar");
    lv_obj_set_pos(obj15, 846, 180);
    lv_obj_set_style_text_color(obj15, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj15, &lv_font_montserrat_24, 0);

    lv_obj_t * obj16 = lv_obj_create(parent);
    lv_obj_set_pos(obj16, 30, 230);
    lv_obj_set_size(obj16, 400, 120);
    lv_obj_set_style_radius(obj16, 12, 0);
    lv_obj_set_style_bg_color(obj16, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj16, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj16, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj16, 2, 0);

    lv_obj_t * obj17 = lv_label_create(parent);
    lv_label_set_text(obj17, "RPM");
    lv_obj_set_pos(obj17, 55, 245);
    lv_obj_set_style_text_color(obj17, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj17, &lv_font_montserrat_24, 0);

    lv_obj_t * obj18 = lv_label_create(parent);
    lv_label_set_text(obj18, "1420");
    lv_obj_set_pos(obj18, 55, 280);
    lv_obj_set_style_text_color(obj18, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj18, &lv_font_montserrat_24, 0);

    lv_obj_t * obj19 = lv_label_create(parent);
    lv_label_set_text(obj19, "RPM");
    lv_obj_set_pos(obj19, 200, 292);
    lv_obj_set_style_text_color(obj19, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj19, &lv_font_montserrat_24, 0);

    lv_obj_t * obj20 = lv_bar_create(parent);
    lv_obj_set_pos(obj20, 30, 390);
    lv_obj_set_size(obj20, 960, 34);
    lv_bar_set_range(obj20, 0, 100);
    lv_bar_set_value(obj20, 60, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(obj20, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj20, lv_color_hex(0xD946EF), LV_PART_INDICATOR);

    lv_obj_t * obj21 = lv_label_create(parent);
    lv_label_set_text(obj21, "System Load");
    lv_obj_set_pos(obj21, 30, 438);
    lv_obj_set_style_text_color(obj21, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj21, &lv_font_montserrat_24, 0);

    lv_obj_t * obj22 = lv_table_create(parent);
    lv_obj_set_pos(obj22, 30, 470);
    lv_obj_set_size(obj22, 960, 105);
    lv_table_set_cell_value(obj22, 0, 0, "A1");
    lv_table_set_cell_value(obj22, 0, 1, "B1");
    lv_table_set_cell_value(obj22, 1, 0, "A2");
    lv_table_set_cell_value(obj22, 1, 1, "B2");
    lv_obj_set_style_bg_color(obj22, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj22, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_text_color(obj22, lv_color_hex(0xFFFFFF), LV_PART_ITEMS);
    lv_obj_set_style_border_color(obj22, lv_color_hex(0xD946EF), LV_PART_ITEMS);
    lv_obj_set_style_border_width(obj22, 1, LV_PART_ITEMS);
    lv_obj_set_style_bg_color(obj22, lv_color_hex(0x1E1035), LV_PART_ITEMS);
    lv_obj_set_style_bg_opa(obj22, LV_OPA_COVER, LV_PART_ITEMS);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}