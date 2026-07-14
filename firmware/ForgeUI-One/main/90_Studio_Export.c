#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include <stdbool.h>
#include <stdio.h>

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
    // Background flavour: Test Purple
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x440066), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x440066), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784024052713_af0bbee6);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784024052713_af0bbee6);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    lv_obj_t * obj1 = lv_label_create(parent);
    lv_label_set_text(obj1, "Industrial Dashboard");
    lv_obj_set_pos(obj1, 40, 20);
    lv_obj_set_style_text_color(obj1, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj1, &lv_font_montserrat_32, 0);

    lv_obj_t * obj2 = lv_label_create(parent);
    lv_label_set_text(obj2, "Factory line overview and machine status");
    lv_obj_set_pos(obj2, 40, 70);
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj2, &lv_font_montserrat_24, 0);

    lv_obj_t * obj3 = lv_obj_create(parent);
    lv_obj_set_pos(obj3, 40, 120);
    lv_obj_set_size(obj3, 300, 180);
    lv_obj_set_style_radius(obj3, 12, 0);
    lv_obj_set_style_bg_color(obj3, lv_color_hex(0x552288), 0);
    lv_obj_set_style_bg_opa(obj3, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj3, lv_color_hex(0xFF00FF), 0);
    lv_obj_set_style_border_width(obj3, 2, 0);

    lv_obj_t * obj4 = lv_label_create(parent);
    lv_label_set_text(obj4, "Production");
    lv_obj_set_pos(obj4, 60, 140);
    lv_obj_set_style_text_color(obj4, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj4, &lv_font_montserrat_32, 0);

    lv_obj_t * obj5 = lv_label_create(parent);
    lv_label_set_text(obj5, "Units/hr: 128");
    lv_obj_set_pos(obj5, 60, 180);
    lv_obj_set_style_text_color(obj5, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj5, &lv_font_montserrat_24, 0);

    lv_obj_t * obj6 = lv_label_create(parent);
    lv_label_set_text(obj6, "Target: 140");
    lv_obj_set_pos(obj6, 60, 210);
    lv_obj_set_style_text_color(obj6, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj6, &lv_font_montserrat_24, 0);

    lv_obj_t * obj7 = lv_bar_create(parent);
    lv_obj_set_pos(obj7, 60, 245);
    lv_obj_set_size(obj7, 250, 20);
    lv_bar_set_range(obj7, 0, 100);
    lv_bar_set_value(obj7, 60, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(obj7, lv_color_hex(0x552288), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj7, lv_color_hex(0xFF00FF), LV_PART_INDICATOR);

    lv_obj_t * obj8 = lv_obj_create(parent);
    lv_obj_set_pos(obj8, 360, 120);
    lv_obj_set_size(obj8, 300, 180);
    lv_obj_set_style_radius(obj8, 12, 0);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x552288), 0);
    lv_obj_set_style_bg_opa(obj8, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj8, lv_color_hex(0xFF00FF), 0);
    lv_obj_set_style_border_width(obj8, 2, 0);

    lv_obj_t * obj9 = lv_label_create(parent);
    lv_label_set_text(obj9, "Equipment");
    lv_obj_set_pos(obj9, 380, 140);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj9, &lv_font_montserrat_32, 0);

    lv_obj_t * obj10 = lv_label_create(parent);
    lv_label_set_text(obj10, "Press A: Running");
    lv_obj_set_pos(obj10, 380, 180);
    lv_obj_set_style_text_color(obj10, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj10, &lv_font_montserrat_24, 0);

    lv_obj_t * obj11 = lv_label_create(parent);
    lv_label_set_text(obj11, "Press B: Maintenance");
    lv_obj_set_pos(obj11, 380, 210);
    lv_obj_set_style_text_color(obj11, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj11, &lv_font_montserrat_24, 0);

    lv_obj_t * obj12 = lv_label_create(parent);
    lv_label_set_text(obj12, "Press C: Running");
    lv_obj_set_pos(obj12, 380, 240);
    lv_obj_set_style_text_color(obj12, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj12, &lv_font_montserrat_24, 0);

    lv_obj_t * obj13 = lv_obj_create(parent);
    lv_obj_set_pos(obj13, 680, 120);
    lv_obj_set_size(obj13, 304, 180);
    lv_obj_set_style_radius(obj13, 12, 0);
    lv_obj_set_style_bg_color(obj13, lv_color_hex(0x552288), 0);
    lv_obj_set_style_bg_opa(obj13, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj13, lv_color_hex(0xFF00FF), 0);
    lv_obj_set_style_border_width(obj13, 2, 0);

    lv_obj_t * obj14 = lv_label_create(parent);
    lv_label_set_text(obj14, "Alerts");
    lv_obj_set_pos(obj14, 700, 140);
    lv_obj_set_style_text_color(obj14, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj14, &lv_font_montserrat_32, 0);

    lv_obj_t * obj15 = lv_label_create(parent);
    lv_label_set_text(obj15, "Temperature stable");
    lv_obj_set_pos(obj15, 700, 180);
    lv_obj_set_style_text_color(obj15, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj15, &lv_font_montserrat_24, 0);

    lv_obj_t * obj16 = lv_label_create(parent);
    lv_label_set_text(obj16, "No critical faults");
    lv_obj_set_pos(obj16, 700, 210);
    lv_obj_set_style_text_color(obj16, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj16, &lv_font_montserrat_24, 0);

    lv_obj_t * obj17 = lv_label_create(parent);
    lv_label_set_text(obj17, "Shift ends in 02:15");
    lv_obj_set_pos(obj17, 700, 240);
    lv_obj_set_style_text_color(obj17, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj17, &lv_font_montserrat_24, 0);

    lv_obj_t * obj18 = lv_label_create(parent);
    lv_label_set_text(obj18, LV_SYMBOL_SETTINGS);
    lv_obj_set_pos(obj18, 860, 20);
    lv_obj_set_style_text_color(obj18, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj18, &lv_font_montserrat_48, 0);

    lv_obj_t * obj19 = lv_label_create(parent);
    lv_label_set_text(obj19, LV_SYMBOL_SETTINGS);
    lv_obj_set_pos(obj19, 910, 20);
    lv_obj_set_style_text_color(obj19, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj19, &lv_font_montserrat_48, 0);

    lv_obj_t * obj20 = lv_label_create(parent);
    lv_label_set_text(obj20, LV_SYMBOL_SETTINGS);
    lv_obj_set_pos(obj20, 960, 20);
    lv_obj_set_style_text_color(obj20, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj20, &lv_font_montserrat_48, 0);

    lv_obj_t * obj21 = lv_obj_create(parent);
    lv_obj_set_pos(obj21, 40, 330);
    lv_obj_set_size(obj21, 944, 220);
    lv_obj_set_style_radius(obj21, 12, 0);
    lv_obj_set_style_bg_color(obj21, lv_color_hex(0x552288), 0);
    lv_obj_set_style_bg_opa(obj21, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj21, lv_color_hex(0xFF00FF), 0);
    lv_obj_set_style_border_width(obj21, 2, 0);

    lv_obj_t * obj22 = lv_label_create(parent);
    lv_label_set_text(obj22, "Sensor Readings");
    lv_obj_set_pos(obj22, 60, 350);
    lv_obj_set_style_text_color(obj22, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj22, &lv_font_montserrat_32, 0);

    lv_obj_t * obj23 = lv_chart_create(parent);
    lv_obj_set_pos(obj23, 60, 390);
    lv_obj_set_size(obj23, 600, 140);
    lv_chart_set_type(obj23, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(obj23, 7);
    lv_chart_series_t * obj23_ser = lv_chart_add_series(obj23, lv_palette_main(LV_PALETTE_BLUE), LV_CHART_AXIS_PRIMARY_Y);
    lv_chart_set_next_value(obj23, obj23_ser, 10);
    lv_chart_set_next_value(obj23, obj23_ser, 30);
    lv_chart_set_next_value(obj23, obj23_ser, 20);
    lv_chart_set_next_value(obj23, obj23_ser, 50);
    lv_chart_set_next_value(obj23, obj23_ser, 40);
    lv_chart_set_next_value(obj23, obj23_ser, 70);
    lv_chart_set_next_value(obj23, obj23_ser, 60);
    lv_chart_refresh(obj23);

    lv_obj_t * obj24 = lv_table_create(parent);
    lv_obj_set_pos(obj24, 680, 390);
    lv_obj_set_size(obj24, 280, 140);
    lv_table_set_cell_value(obj24, 0, 0, "A1");
    lv_table_set_cell_value(obj24, 0, 1, "B1");
    lv_table_set_cell_value(obj24, 1, 0, "A2");
    lv_table_set_cell_value(obj24, 1, 1, "B2");
    lv_obj_set_style_bg_color(obj24, lv_color_hex(0x552288), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj24, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_text_color(obj24, lv_color_hex(0xFFFFFF), LV_PART_ITEMS);
    lv_obj_set_style_border_color(obj24, lv_color_hex(0xFF00FF), LV_PART_ITEMS);
    lv_obj_set_style_border_width(obj24, 1, LV_PART_ITEMS);
    lv_obj_set_style_bg_color(obj24, lv_color_hex(0x663399), LV_PART_ITEMS);
    lv_obj_set_style_bg_opa(obj24, LV_OPA_COVER, LV_PART_ITEMS);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}