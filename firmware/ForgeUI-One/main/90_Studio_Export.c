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
    // Background flavour: Industrial Carbon
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784342478518_b95a7dc0);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784342478518_b95a7dc0);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    // ForgeUI Keyboard component comp-MS0XM66LKUFGW -> obj1
    static const char * const obj1_map[] = {
        "1#", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", LV_SYMBOL_BACKSPACE, "\n",
        "ABC", "a", "s", "d", "f", "g", "h", "j", "k", "l", LV_SYMBOL_NEW_LINE, "\n",
        "_", "-", "z", "x", "c", "v", "b", "n", "m", ".", ",", ":", "\n",
        LV_SYMBOL_KEYBOARD, LV_SYMBOL_LEFT, " ", LV_SYMBOL_RIGHT, LV_SYMBOL_OK, ""
    };
    static const lv_buttonmatrix_ctrl_t obj1_ctrl[] = {
        LV_KEYBOARD_CTRL_BUTTON_FLAGS | 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, LV_BUTTONMATRIX_CTRL_CHECKED | 4,
        LV_KEYBOARD_CTRL_BUTTON_FLAGS | 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, LV_BUTTONMATRIX_CTRL_CHECKED | 3,
        LV_BUTTONMATRIX_CTRL_CHECKED | 1, LV_BUTTONMATRIX_CTRL_CHECKED | 1, 1, 1, 1, 1, 1, 1, 1, LV_BUTTONMATRIX_CTRL_CHECKED | 1, LV_BUTTONMATRIX_CTRL_CHECKED | 1, LV_BUTTONMATRIX_CTRL_CHECKED | 1,
        LV_KEYBOARD_CTRL_BUTTON_FLAGS | 2, LV_BUTTONMATRIX_CTRL_CHECKED | 2, 12, LV_BUTTONMATRIX_CTRL_CHECKED | 2, LV_KEYBOARD_CTRL_BUTTON_FLAGS | 2
    };
    lv_obj_t * obj1_ta = lv_textarea_create(parent);
    lv_textarea_set_one_line(obj1_ta, true);
    lv_textarea_set_placeholder_text(obj1_ta, "Keyboard input");
    lv_obj_set_pos(obj1_ta, 58, 73);
    lv_obj_set_size(obj1_ta, 744, 45);
    lv_obj_t * obj1 = lv_keyboard_create(parent);
    lv_keyboard_set_map(obj1, LV_KEYBOARD_MODE_TEXT_LOWER, obj1_map, obj1_ctrl);
    lv_keyboard_set_textarea(obj1, obj1_ta);
    lv_keyboard_set_mode(obj1, LV_KEYBOARD_MODE_TEXT_LOWER);
    lv_obj_set_style_pad_all(obj1, 8, LV_PART_MAIN);
    lv_obj_set_style_pad_row(obj1, 6, LV_PART_MAIN);
    lv_obj_set_style_pad_column(obj1, 6, LV_PART_MAIN);
    lv_obj_set_style_border_width(obj1, 1, LV_PART_MAIN);
    lv_obj_set_style_border_color(obj1, lv_color_hex(0xF2A900), LV_PART_MAIN);
    lv_obj_set_style_radius(obj1, 8, LV_PART_MAIN);
    lv_obj_set_style_outline_width(obj1, 0, LV_PART_MAIN);
    lv_obj_set_style_shadow_width(obj1, 0, LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x1E2328), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_pad_all(obj1, 0, LV_PART_ITEMS);
    lv_obj_set_style_border_width(obj1, 0, LV_PART_ITEMS);
    lv_obj_set_style_radius(obj1, 6, LV_PART_ITEMS);
    lv_obj_set_style_outline_width(obj1, 0, LV_PART_ITEMS);
    lv_obj_set_style_shadow_width(obj1, 0, LV_PART_ITEMS);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x2A3138), LV_PART_ITEMS);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_COVER, LV_PART_ITEMS);
    lv_obj_set_style_text_color(obj1, lv_color_hex(0xF5F5F5), LV_PART_ITEMS);
    lv_obj_set_style_text_font(obj1, &lv_font_montserrat_12, LV_PART_ITEMS);
    lv_obj_set_style_text_line_space(obj1, 0, LV_PART_ITEMS);
    lv_obj_set_align(obj1, LV_ALIGN_TOP_LEFT);
    lv_obj_set_pos(obj1, 58, 128);
    lv_obj_set_size(obj1, 744, 230);
    lv_obj_update_layout(lv_screen_active());
    lv_area_t obj1_coords;
    lv_obj_get_coords(obj1, &obj1_coords);
    printf("[ForgeUI][Keyboard comp-MS0XM66LKUFGW] obj=obj1 parent=%p local=(%ld,%ld) size=%ldx%ld content=%ldx%ld abs=(%ld,%ld)-(%ld,%ld) parent=%ldx%ld virtual_buttonmatrix=%ldx%ld children=%lu\n",
        (void *)parent, (long)lv_obj_get_x(obj1), (long)lv_obj_get_y(obj1),
        (long)lv_obj_get_width(obj1), (long)lv_obj_get_height(obj1),
        (long)lv_obj_get_content_width(obj1), (long)lv_obj_get_content_height(obj1),
        (long)obj1_coords.x1, (long)obj1_coords.y1, (long)obj1_coords.x2, (long)obj1_coords.y2,
        (long)lv_obj_get_width(parent), (long)lv_obj_get_height(parent),
        (long)lv_obj_get_width(obj1), (long)lv_obj_get_height(obj1),
        (unsigned long)lv_obj_get_child_count(obj1));


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}