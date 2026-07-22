#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include <stdbool.h>
#include <stdio.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;

LV_IMAGE_DECLARE(fg_upload_ai_status_indicator_off_1784682697093_1784682720049_7d915498);
LV_IMAGE_DECLARE(fg_upload_ai_status_indicator_on_1784682697093_1784682745545_91d4e231);
LV_IMAGE_DECLARE(fg_upload_ai_status_indicator_off_1784682803488_1784682823685_bac02494);
LV_IMAGE_DECLARE(fg_upload_ai_status_indicator_on_1784682803488_1784682850209_47290330);

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

static fg_binary_output_t fg_green_power_light_on1_output = {
    .image = NULL,
    .off_src = &fg_upload_ai_status_indicator_off_1784682697093_1784682720049_7d915498,
    .on_src = &fg_upload_ai_status_indicator_on_1784682697093_1784682745545_91d4e231,
    .enabled = true,
};

static fg_binary_output_t fg_red_power_light_off1_output = {
    .image = NULL,
    .off_src = &fg_upload_ai_status_indicator_off_1784682803488_1784682823685_bac02494,
    .on_src = &fg_upload_ai_status_indicator_on_1784682803488_1784682850209_47290330,
    .enabled = false,
};

void FG_Set_Green_Power_Light_On1(bool enabled)
{
    fg_binary_output_set(&fg_green_power_light_on1_output, enabled);
}

void FG_Set_Red_Power_Light_Off1(bool enabled)
{
    fg_binary_output_set(&fg_red_power_light_off1_output, enabled);
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

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784677195962_931ea33e);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784677195962_931ea33e);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    fg_green_power_light_on1_output.image = lv_image_create(parent);
    fg_binary_output_set(&fg_green_power_light_on1_output, true);
    lv_obj_set_pos(fg_green_power_light_on1_output.image, 624, 41);
    lv_obj_set_size(fg_green_power_light_on1_output.image, 400, 300);
    lv_obj_clear_flag(fg_green_power_light_on1_output.image, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_green_power_light_on1_output.image, LV_OBJ_FLAG_SCROLLABLE);

    fg_red_power_light_off1_output.image = lv_image_create(parent);
    fg_binary_output_set(&fg_red_power_light_off1_output, false);
    lv_obj_set_pos(fg_red_power_light_off1_output.image, 219, 41);
    lv_obj_set_size(fg_red_power_light_off1_output.image, 400, 300);
    lv_obj_clear_flag(fg_red_power_light_off1_output.image, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_red_power_light_off1_output.image, LV_OBJ_FLAG_SCROLLABLE);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}