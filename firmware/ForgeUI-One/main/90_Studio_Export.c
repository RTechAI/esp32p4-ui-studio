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
    // Background flavour: Singularity
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x05020A), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x05020A), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_1024x600_creation_786cf05c);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_1024x600_creation_786cf05c);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);

    lv_obj_t * obj1 = lv_label_create(parent);
    lv_label_set_text(obj1, "Enter PIN");
    lv_obj_set_pos(obj1, 360, 45);
    lv_obj_set_style_text_color(obj1, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj1, &lv_font_montserrat_32, 0);

    lv_obj_t * obj2 = lv_textarea_create(parent);
    lv_textarea_set_one_line(obj2, true);
    lv_textarea_set_placeholder_text(obj2, "Input");
    lv_obj_set_pos(obj2, 360, 120);
    lv_obj_set_size(obj2, 300, 50);
    lv_obj_set_style_bg_color(obj2, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_border_color(obj2, lv_color_hex(0xFF7A18), 0);

    lv_obj_t * obj3 = lv_button_create(parent);
    lv_obj_set_pos(obj3, 360, 195);
    lv_obj_set_size(obj3, 85, 55);
    lv_obj_set_style_radius(obj3, 12, 0);
    lv_obj_set_style_bg_color(obj3, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj3, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj3, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj3, 2, 0);
    lv_obj_t * obj3_label = lv_label_create(obj3);
    lv_label_set_text(obj3_label, "1");
    lv_obj_set_style_text_color(obj3_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj3_label);

    lv_obj_t * obj4 = lv_button_create(parent);
    lv_obj_set_pos(obj4, 465, 195);
    lv_obj_set_size(obj4, 85, 55);
    lv_obj_set_style_radius(obj4, 12, 0);
    lv_obj_set_style_bg_color(obj4, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj4, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj4, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj4, 2, 0);
    lv_obj_t * obj4_label = lv_label_create(obj4);
    lv_label_set_text(obj4_label, "2");
    lv_obj_set_style_text_color(obj4_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj4_label);

    lv_obj_t * obj5 = lv_button_create(parent);
    lv_obj_set_pos(obj5, 570, 195);
    lv_obj_set_size(obj5, 85, 55);
    lv_obj_set_style_radius(obj5, 12, 0);
    lv_obj_set_style_bg_color(obj5, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj5, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj5, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj5, 2, 0);
    lv_obj_t * obj5_label = lv_label_create(obj5);
    lv_label_set_text(obj5_label, "3");
    lv_obj_set_style_text_color(obj5_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj5_label);

    lv_obj_t * obj6 = lv_button_create(parent);
    lv_obj_set_pos(obj6, 360, 265);
    lv_obj_set_size(obj6, 85, 55);
    lv_obj_set_style_radius(obj6, 12, 0);
    lv_obj_set_style_bg_color(obj6, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj6, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj6, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj6, 2, 0);
    lv_obj_t * obj6_label = lv_label_create(obj6);
    lv_label_set_text(obj6_label, "4");
    lv_obj_set_style_text_color(obj6_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj6_label);

    lv_obj_t * obj7 = lv_button_create(parent);
    lv_obj_set_pos(obj7, 465, 265);
    lv_obj_set_size(obj7, 85, 55);
    lv_obj_set_style_radius(obj7, 12, 0);
    lv_obj_set_style_bg_color(obj7, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj7, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj7, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj7, 2, 0);
    lv_obj_t * obj7_label = lv_label_create(obj7);
    lv_label_set_text(obj7_label, "5");
    lv_obj_set_style_text_color(obj7_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj7_label);

    lv_obj_t * obj8 = lv_button_create(parent);
    lv_obj_set_pos(obj8, 570, 265);
    lv_obj_set_size(obj8, 85, 55);
    lv_obj_set_style_radius(obj8, 12, 0);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj8, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj8, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj8, 2, 0);
    lv_obj_t * obj8_label = lv_label_create(obj8);
    lv_label_set_text(obj8_label, "6");
    lv_obj_set_style_text_color(obj8_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj8_label);

    lv_obj_t * obj9 = lv_button_create(parent);
    lv_obj_set_pos(obj9, 360, 335);
    lv_obj_set_size(obj9, 85, 55);
    lv_obj_set_style_radius(obj9, 12, 0);
    lv_obj_set_style_bg_color(obj9, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj9, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj9, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj9, 2, 0);
    lv_obj_t * obj9_label = lv_label_create(obj9);
    lv_label_set_text(obj9_label, "7");
    lv_obj_set_style_text_color(obj9_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj9_label);

    lv_obj_t * obj10 = lv_button_create(parent);
    lv_obj_set_pos(obj10, 465, 335);
    lv_obj_set_size(obj10, 85, 55);
    lv_obj_set_style_radius(obj10, 12, 0);
    lv_obj_set_style_bg_color(obj10, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj10, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj10, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj10, 2, 0);
    lv_obj_t * obj10_label = lv_label_create(obj10);
    lv_label_set_text(obj10_label, "8");
    lv_obj_set_style_text_color(obj10_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj10_label);

    lv_obj_t * obj11 = lv_button_create(parent);
    lv_obj_set_pos(obj11, 570, 335);
    lv_obj_set_size(obj11, 85, 55);
    lv_obj_set_style_radius(obj11, 12, 0);
    lv_obj_set_style_bg_color(obj11, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj11, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj11, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj11, 2, 0);
    lv_obj_t * obj11_label = lv_label_create(obj11);
    lv_label_set_text(obj11_label, "9");
    lv_obj_set_style_text_color(obj11_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj11_label);

    lv_obj_t * obj12 = lv_button_create(parent);
    lv_obj_set_pos(obj12, 360, 405);
    lv_obj_set_size(obj12, 85, 55);
    lv_obj_set_style_radius(obj12, 12, 0);
    lv_obj_set_style_bg_color(obj12, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj12, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj12, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj12, 2, 0);
    lv_obj_t * obj12_label = lv_label_create(obj12);
    lv_label_set_text(obj12_label, "Cancel");
    lv_obj_set_style_text_color(obj12_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj12_label);

    lv_obj_t * obj13 = lv_button_create(parent);
    lv_obj_set_pos(obj13, 465, 405);
    lv_obj_set_size(obj13, 85, 55);
    lv_obj_set_style_radius(obj13, 12, 0);
    lv_obj_set_style_bg_color(obj13, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj13, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj13, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj13, 2, 0);
    lv_obj_t * obj13_label = lv_label_create(obj13);
    lv_label_set_text(obj13_label, "0");
    lv_obj_set_style_text_color(obj13_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj13_label);

    lv_obj_t * obj14 = lv_button_create(parent);
    lv_obj_set_pos(obj14, 570, 405);
    lv_obj_set_size(obj14, 85, 55);
    lv_obj_set_style_radius(obj14, 12, 0);
    lv_obj_set_style_bg_color(obj14, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj14, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj14, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj14, 2, 0);
    lv_obj_t * obj14_label = lv_label_create(obj14);
    lv_label_set_text(obj14_label, "Enter");
    lv_obj_set_style_text_color(obj14_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj14_label);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}