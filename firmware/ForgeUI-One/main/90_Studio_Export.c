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
    // Background flavour: AI Mesh
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x020617), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x020617), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_1024x600_ai_mesh_9f3f1b39);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_1024x600_ai_mesh_9f3f1b39);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);

    lv_obj_t * obj1 = lv_led_create(parent);
    lv_obj_set_pos(obj1, 0, 21);
    lv_obj_set_size(obj1, 48, 48);
    lv_led_set_color(obj1, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj1, 255);
    lv_led_on(obj1);

    lv_obj_t * obj2 = lv_bar_create(parent);
    lv_obj_set_pos(obj2, 215, 31);
    lv_obj_set_size(obj2, 389, 28);
    lv_bar_set_range(obj2, 0, 100);
    lv_bar_set_value(obj2, 70, LV_ANIM_OFF);

    lv_obj_t * obj3 = lv_arc_create(parent);
    lv_obj_set_pos(obj3, 4, 136);
    lv_obj_set_size(obj3, 191, 76);
    lv_arc_set_range(obj3, 0, 100);
    lv_arc_set_value(obj3, 65);

    static lv_point_precise_t obj4_pts[] = {
      {0, 0},
      {142, 73}
    };
    lv_obj_t * obj4 = lv_line_create(parent);
    lv_line_set_points(obj4, obj4_pts, 2);
    lv_obj_set_pos(obj4, 752, 7);
    lv_obj_set_style_line_color(obj4, lv_color_hex(0x38BDF8), LV_PART_MAIN);
    lv_obj_set_style_line_width(obj4, 3, LV_PART_MAIN);

    lv_obj_t * obj5 = lv_button_create(parent);
    lv_obj_set_pos(obj5, 105, 242);
    lv_obj_set_size(obj5, 103, 52);
    lv_obj_set_style_radius(obj5, 12, 0);
    lv_obj_set_style_bg_color(obj5, lv_color_hex(0x07152A), 0);
    lv_obj_set_style_bg_opa(obj5, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj5, lv_color_hex(0x38BDF8), 0);
    lv_obj_set_style_border_width(obj5, 2, 0);
    lv_obj_t * obj5_label = lv_label_create(obj5);
    lv_label_set_text(obj5_label, "Push Me ");
    lv_obj_set_style_text_color(obj5_label, lv_color_hex(0xE0F2FE), 0);
    lv_obj_center(obj5_label);

    fg_clock_label = lv_label_create(parent);
    lv_label_set_text(fg_clock_label, "12:34");
    lv_obj_set_pos(fg_clock_label, 46, 486);
    lv_obj_set_size(fg_clock_label, 145, 88);
    lv_obj_set_style_text_color(fg_clock_label, lv_color_hex(0x00D4FF), 0);
    lv_obj_set_style_text_font(fg_clock_label, &lv_font_montserrat_32, 0);

    lv_obj_t * obj7 = lv_switch_create(parent);
    lv_obj_set_pos(obj7, 746, 122);
    lv_obj_set_size(obj7, 167, 77);
    lv_obj_set_style_bg_color(obj7, lv_color_hex(0x07152A), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj7, lv_color_hex(0x38BDF8), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj7, lv_color_hex(0xE0F2FE), LV_PART_KNOB);

    lv_obj_t * obj8 = lv_checkbox_create(parent);
    lv_checkbox_set_text(obj8, "Label checkbox");
    lv_obj_set_pos(obj8, 278, 81);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0xE0F2FE), LV_PART_MAIN);
    lv_obj_set_style_border_color(obj8, lv_color_hex(0x38BDF8), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x07152A), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x0EA5E9), LV_PART_INDICATOR | LV_STATE_CHECKED);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0xE0F2FE), LV_PART_INDICATOR | LV_STATE_CHECKED);

    lv_obj_t * obj9 = lv_label_create(parent);
    lv_label_set_text(obj9, LV_SYMBOL_SETTINGS);
    lv_obj_set_pos(obj9, 296, 182);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xE0F2FE), 0);
    lv_obj_set_style_text_font(obj9, &lv_font_montserrat_48, 0);

    LV_IMAGE_DECLARE(fg_upload_fialertoctagon_43e91a01);
    lv_obj_t * obj10 = lv_image_create(parent);
    lv_image_set_src(obj10, &fg_upload_fialertoctagon_43e91a01);
    lv_image_set_scale(obj10, 256);
    lv_obj_set_pos(obj10, 764, 213);
    lv_obj_set_size(obj10, 184, 85);
    lv_obj_add_flag(obj10, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_set_style_transform_pivot_x(obj10, 92, 0);
    lv_obj_set_style_transform_pivot_y(obj10, 42, 0);
    lv_obj_set_style_transform_scale(obj10, 256, 0);
    lv_obj_set_style_transform_scale(obj10, 235, LV_STATE_PRESSED);

    LV_IMAGE_DECLARE(fg_upload_fichevronright_09b0845a);
    lv_obj_t * obj11 = lv_image_create(parent);
    lv_image_set_src(obj11, &fg_upload_fichevronright_09b0845a);
    lv_image_set_scale(obj11, 256);
    lv_obj_set_pos(obj11, 841, 325);
    lv_obj_set_size(obj11, 162, 84);
    lv_obj_add_flag(obj11, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_set_style_transform_pivot_x(obj11, 81, 0);
    lv_obj_set_style_transform_pivot_y(obj11, 42, 0);
    lv_obj_set_style_transform_scale(obj11, 256, 0);
    lv_obj_set_style_transform_scale(obj11, 235, LV_STATE_PRESSED);

    LV_IMAGE_DECLARE(fg_upload_fieyeoff_9ea90dc4);
    lv_obj_t * obj12 = lv_image_create(parent);
    lv_image_set_src(obj12, &fg_upload_fieyeoff_9ea90dc4);
    lv_image_set_scale(obj12, 256);
    lv_obj_set_pos(obj12, 649, 320);
    lv_obj_set_size(obj12, 190, 87);
    lv_obj_add_flag(obj12, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_set_style_transform_pivot_x(obj12, 95, 0);
    lv_obj_set_style_transform_pivot_y(obj12, 43, 0);
    lv_obj_set_style_transform_scale(obj12, 256, 0);
    lv_obj_set_style_transform_scale(obj12, 235, LV_STATE_PRESSED);

    LV_IMAGE_DECLARE(fg_upload_fihash_a60cd16c);
    lv_obj_t * obj13 = lv_image_create(parent);
    lv_image_set_src(obj13, &fg_upload_fihash_a60cd16c);
    lv_image_set_scale(obj13, 256);
    lv_obj_set_pos(obj13, 795, 440);
    lv_obj_set_size(obj13, 202, 85);
    lv_obj_add_flag(obj13, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_set_style_transform_pivot_x(obj13, 101, 0);
    lv_obj_set_style_transform_pivot_y(obj13, 42, 0);
    lv_obj_set_style_transform_scale(obj13, 256, 0);
    lv_obj_set_style_transform_scale(obj13, 235, LV_STATE_PRESSED);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}