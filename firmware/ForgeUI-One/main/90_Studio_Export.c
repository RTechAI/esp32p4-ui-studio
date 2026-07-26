#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;

LV_IMAGE_DECLARE(fg_upload_fitted_light_off_1785054446735_1785054446737_1bc89e30);
LV_IMAGE_DECLARE(fg_upload_fitted_light_on_1785054446735_1785054446739_b7e7c728);

typedef struct
{
    lv_obj_t * image;
    const void * off_src;
    const void * on_src;
    bool enabled;
} fg_binary_output_t;

static void fg_binary_output_set(
    fg_binary_output_t * output,
    bool enabled
)
{
    if (!output || !output->image)
    {
        return;
    }

    output->enabled = enabled;
    lv_image_set_src(
        output->image,
        enabled ? output->on_src : output->off_src
    );
}

static uint32_t fg_interactive_light_axis_scale(int32_t target, uint32_t source)
{
    if (target <= 0 || source == 0) return 256;
    uint64_t rounded = ((uint64_t)target * 256u + source / 2u) / source;
    if (rounded < 1u) return 1;
    if (rounded > 65535u) return 65535;
    return (uint32_t)rounded;
}

static uint32_t fg_interactive_light_contain_scale(
    const lv_image_dsc_t * off,
    const lv_image_dsc_t * on,
    int32_t width,
    int32_t height
)
{
    if (!off || !on ||
        off->header.w == 0 || off->header.h == 0 ||
        on->header.w == 0 || on->header.h == 0) return 256;
    uint32_t scale = fg_interactive_light_axis_scale(width, off->header.w);
    uint32_t candidate = fg_interactive_light_axis_scale(height, off->header.h);
    if (candidate < scale) scale = candidate;
    candidate = fg_interactive_light_axis_scale(width, on->header.w);
    if (candidate < scale) scale = candidate;
    candidate = fg_interactive_light_axis_scale(height, on->header.h);
    if (candidate < scale) scale = candidate;
    return scale;
}

static fg_binary_output_t fg_status_light_output = {
    .image = NULL,
    .off_src = &fg_upload_fitted_light_off_1785054446735_1785054446737_1bc89e30,
    .on_src = &fg_upload_fitted_light_on_1785054446735_1785054446739_b7e7c728,
    .enabled = false,
};

void FG_Set_Status_Light(bool enabled)
{
    fg_binary_output_set(&fg_status_light_output, enabled);
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

    lv_obj_t * fg_status_light_output_obj = lv_obj_create(parent);
    lv_obj_set_pos(fg_status_light_output_obj, 459, 29);
    lv_obj_set_size(fg_status_light_output_obj, 565, 356);
    lv_obj_set_style_bg_opa(fg_status_light_output_obj, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_border_width(fg_status_light_output_obj, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_all(fg_status_light_output_obj, 0, LV_PART_MAIN);
    fg_status_light_output.image = lv_image_create(fg_status_light_output_obj);
    fg_binary_output_set(&fg_status_light_output, false);
    lv_image_set_scale(fg_status_light_output.image, 546);
    lv_obj_center(fg_status_light_output.image);
    lv_obj_clear_flag(fg_status_light_output_obj, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_status_light_output_obj, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_clear_flag(fg_status_light_output.image, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_status_light_output.image, LV_OBJ_FLAG_SCROLLABLE);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}