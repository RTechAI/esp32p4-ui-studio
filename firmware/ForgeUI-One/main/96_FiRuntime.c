#include "96_FiRuntime.h"

static lv_obj_t * fg_fi_weather_current_icon_object = NULL;
static bool fg_fi_weather_current_icon_image_backed = false;
static bool fg_fi_weather_current_icon_visible = true;
static uint8_t fg_fi_weather_current_icon_opacity = 255;
static uint32_t fg_fi_weather_current_icon_color = 0xF5F5F5;

static void fg_fi_apply_weather_current_icon(void)
{
    lv_obj_t * object = fg_fi_weather_current_icon_object;
    if (object == NULL) return;
    if (fg_fi_weather_current_icon_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_weather_current_icon_opacity, 0);
    if (fg_fi_weather_current_icon_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_weather_current_icon_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_weather_current_icon_color), 0);
    }
}

void fg_fi_bind_weather_current_icon(lv_obj_t * object, bool image_backed)
{
    fg_fi_weather_current_icon_object = object;
    fg_fi_weather_current_icon_image_backed = image_backed;
    fg_fi_apply_weather_current_icon();
}

void FG_Set_Weather_Current_Icon_Visible(bool visible)
{
    if (fg_fi_weather_current_icon_visible == visible) return;
    fg_fi_weather_current_icon_visible = visible;
    if (fg_fi_weather_current_icon_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_weather_current_icon_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_weather_current_icon_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Weather_Current_Icon_Opacity(uint8_t opacity)
{
    if (fg_fi_weather_current_icon_opacity == opacity) return;
    fg_fi_weather_current_icon_opacity = opacity;
    if (fg_fi_weather_current_icon_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_weather_current_icon_object, opacity, 0);
}

void FG_Set_Weather_Current_Icon_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_weather_current_icon_color == rgb) return;
    fg_fi_weather_current_icon_color = rgb;
    if (fg_fi_weather_current_icon_object == NULL) return;
    if (fg_fi_weather_current_icon_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_weather_current_icon_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_weather_current_icon_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_weather_current_icon_object, lv_color_hex(rgb), 0);
    }
}

static lv_obj_t * fg_fi_forecast_day1_icon_object = NULL;
static bool fg_fi_forecast_day1_icon_image_backed = false;
static bool fg_fi_forecast_day1_icon_visible = true;
static uint8_t fg_fi_forecast_day1_icon_opacity = 255;
static uint32_t fg_fi_forecast_day1_icon_color = 0xF5F5F5;

static void fg_fi_apply_forecast_day1_icon(void)
{
    lv_obj_t * object = fg_fi_forecast_day1_icon_object;
    if (object == NULL) return;
    if (fg_fi_forecast_day1_icon_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_forecast_day1_icon_opacity, 0);
    if (fg_fi_forecast_day1_icon_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_forecast_day1_icon_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_forecast_day1_icon_color), 0);
    }
}

void fg_fi_bind_forecast_day1_icon(lv_obj_t * object, bool image_backed)
{
    fg_fi_forecast_day1_icon_object = object;
    fg_fi_forecast_day1_icon_image_backed = image_backed;
    fg_fi_apply_forecast_day1_icon();
}

void FG_Set_Forecast_Day1_Icon_Visible(bool visible)
{
    if (fg_fi_forecast_day1_icon_visible == visible) return;
    fg_fi_forecast_day1_icon_visible = visible;
    if (fg_fi_forecast_day1_icon_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_forecast_day1_icon_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_forecast_day1_icon_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Forecast_Day1_Icon_Opacity(uint8_t opacity)
{
    if (fg_fi_forecast_day1_icon_opacity == opacity) return;
    fg_fi_forecast_day1_icon_opacity = opacity;
    if (fg_fi_forecast_day1_icon_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_forecast_day1_icon_object, opacity, 0);
}

void FG_Set_Forecast_Day1_Icon_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_forecast_day1_icon_color == rgb) return;
    fg_fi_forecast_day1_icon_color = rgb;
    if (fg_fi_forecast_day1_icon_object == NULL) return;
    if (fg_fi_forecast_day1_icon_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_forecast_day1_icon_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_forecast_day1_icon_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_forecast_day1_icon_object, lv_color_hex(rgb), 0);
    }
}

static lv_obj_t * fg_fi_forecast_day2_icon_object = NULL;
static bool fg_fi_forecast_day2_icon_image_backed = false;
static bool fg_fi_forecast_day2_icon_visible = true;
static uint8_t fg_fi_forecast_day2_icon_opacity = 255;
static uint32_t fg_fi_forecast_day2_icon_color = 0xF5F5F5;

static void fg_fi_apply_forecast_day2_icon(void)
{
    lv_obj_t * object = fg_fi_forecast_day2_icon_object;
    if (object == NULL) return;
    if (fg_fi_forecast_day2_icon_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_forecast_day2_icon_opacity, 0);
    if (fg_fi_forecast_day2_icon_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_forecast_day2_icon_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_forecast_day2_icon_color), 0);
    }
}

void fg_fi_bind_forecast_day2_icon(lv_obj_t * object, bool image_backed)
{
    fg_fi_forecast_day2_icon_object = object;
    fg_fi_forecast_day2_icon_image_backed = image_backed;
    fg_fi_apply_forecast_day2_icon();
}

void FG_Set_Forecast_Day2_Icon_Visible(bool visible)
{
    if (fg_fi_forecast_day2_icon_visible == visible) return;
    fg_fi_forecast_day2_icon_visible = visible;
    if (fg_fi_forecast_day2_icon_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_forecast_day2_icon_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_forecast_day2_icon_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Forecast_Day2_Icon_Opacity(uint8_t opacity)
{
    if (fg_fi_forecast_day2_icon_opacity == opacity) return;
    fg_fi_forecast_day2_icon_opacity = opacity;
    if (fg_fi_forecast_day2_icon_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_forecast_day2_icon_object, opacity, 0);
}

void FG_Set_Forecast_Day2_Icon_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_forecast_day2_icon_color == rgb) return;
    fg_fi_forecast_day2_icon_color = rgb;
    if (fg_fi_forecast_day2_icon_object == NULL) return;
    if (fg_fi_forecast_day2_icon_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_forecast_day2_icon_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_forecast_day2_icon_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_forecast_day2_icon_object, lv_color_hex(rgb), 0);
    }
}

static lv_obj_t * fg_fi_forecast_day3_icon_object = NULL;
static bool fg_fi_forecast_day3_icon_image_backed = false;
static bool fg_fi_forecast_day3_icon_visible = true;
static uint8_t fg_fi_forecast_day3_icon_opacity = 255;
static uint32_t fg_fi_forecast_day3_icon_color = 0xF5F5F5;

static void fg_fi_apply_forecast_day3_icon(void)
{
    lv_obj_t * object = fg_fi_forecast_day3_icon_object;
    if (object == NULL) return;
    if (fg_fi_forecast_day3_icon_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_forecast_day3_icon_opacity, 0);
    if (fg_fi_forecast_day3_icon_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_forecast_day3_icon_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_forecast_day3_icon_color), 0);
    }
}

void fg_fi_bind_forecast_day3_icon(lv_obj_t * object, bool image_backed)
{
    fg_fi_forecast_day3_icon_object = object;
    fg_fi_forecast_day3_icon_image_backed = image_backed;
    fg_fi_apply_forecast_day3_icon();
}

void FG_Set_Forecast_Day3_Icon_Visible(bool visible)
{
    if (fg_fi_forecast_day3_icon_visible == visible) return;
    fg_fi_forecast_day3_icon_visible = visible;
    if (fg_fi_forecast_day3_icon_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_forecast_day3_icon_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_forecast_day3_icon_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Forecast_Day3_Icon_Opacity(uint8_t opacity)
{
    if (fg_fi_forecast_day3_icon_opacity == opacity) return;
    fg_fi_forecast_day3_icon_opacity = opacity;
    if (fg_fi_forecast_day3_icon_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_forecast_day3_icon_object, opacity, 0);
}

void FG_Set_Forecast_Day3_Icon_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_forecast_day3_icon_color == rgb) return;
    fg_fi_forecast_day3_icon_color = rgb;
    if (fg_fi_forecast_day3_icon_object == NULL) return;
    if (fg_fi_forecast_day3_icon_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_forecast_day3_icon_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_forecast_day3_icon_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_forecast_day3_icon_object, lv_color_hex(rgb), 0);
    }
}

static lv_obj_t * fg_fi_forecast_day4_icon_object = NULL;
static bool fg_fi_forecast_day4_icon_image_backed = false;
static bool fg_fi_forecast_day4_icon_visible = true;
static uint8_t fg_fi_forecast_day4_icon_opacity = 255;
static uint32_t fg_fi_forecast_day4_icon_color = 0xF5F5F5;

static void fg_fi_apply_forecast_day4_icon(void)
{
    lv_obj_t * object = fg_fi_forecast_day4_icon_object;
    if (object == NULL) return;
    if (fg_fi_forecast_day4_icon_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_forecast_day4_icon_opacity, 0);
    if (fg_fi_forecast_day4_icon_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_forecast_day4_icon_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_forecast_day4_icon_color), 0);
    }
}

void fg_fi_bind_forecast_day4_icon(lv_obj_t * object, bool image_backed)
{
    fg_fi_forecast_day4_icon_object = object;
    fg_fi_forecast_day4_icon_image_backed = image_backed;
    fg_fi_apply_forecast_day4_icon();
}

void FG_Set_Forecast_Day4_Icon_Visible(bool visible)
{
    if (fg_fi_forecast_day4_icon_visible == visible) return;
    fg_fi_forecast_day4_icon_visible = visible;
    if (fg_fi_forecast_day4_icon_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_forecast_day4_icon_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_forecast_day4_icon_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Forecast_Day4_Icon_Opacity(uint8_t opacity)
{
    if (fg_fi_forecast_day4_icon_opacity == opacity) return;
    fg_fi_forecast_day4_icon_opacity = opacity;
    if (fg_fi_forecast_day4_icon_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_forecast_day4_icon_object, opacity, 0);
}

void FG_Set_Forecast_Day4_Icon_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_forecast_day4_icon_color == rgb) return;
    fg_fi_forecast_day4_icon_color = rgb;
    if (fg_fi_forecast_day4_icon_object == NULL) return;
    if (fg_fi_forecast_day4_icon_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_forecast_day4_icon_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_forecast_day4_icon_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_forecast_day4_icon_object, lv_color_hex(rgb), 0);
    }
}

static lv_obj_t * fg_fi_forecast_day5_icon_object = NULL;
static bool fg_fi_forecast_day5_icon_image_backed = false;
static bool fg_fi_forecast_day5_icon_visible = true;
static uint8_t fg_fi_forecast_day5_icon_opacity = 255;
static uint32_t fg_fi_forecast_day5_icon_color = 0xF5F5F5;

static void fg_fi_apply_forecast_day5_icon(void)
{
    lv_obj_t * object = fg_fi_forecast_day5_icon_object;
    if (object == NULL) return;
    if (fg_fi_forecast_day5_icon_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_forecast_day5_icon_opacity, 0);
    if (fg_fi_forecast_day5_icon_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_forecast_day5_icon_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_forecast_day5_icon_color), 0);
    }
}

void fg_fi_bind_forecast_day5_icon(lv_obj_t * object, bool image_backed)
{
    fg_fi_forecast_day5_icon_object = object;
    fg_fi_forecast_day5_icon_image_backed = image_backed;
    fg_fi_apply_forecast_day5_icon();
}

void FG_Set_Forecast_Day5_Icon_Visible(bool visible)
{
    if (fg_fi_forecast_day5_icon_visible == visible) return;
    fg_fi_forecast_day5_icon_visible = visible;
    if (fg_fi_forecast_day5_icon_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_forecast_day5_icon_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_forecast_day5_icon_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Forecast_Day5_Icon_Opacity(uint8_t opacity)
{
    if (fg_fi_forecast_day5_icon_opacity == opacity) return;
    fg_fi_forecast_day5_icon_opacity = opacity;
    if (fg_fi_forecast_day5_icon_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_forecast_day5_icon_object, opacity, 0);
}

void FG_Set_Forecast_Day5_Icon_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_forecast_day5_icon_color == rgb) return;
    fg_fi_forecast_day5_icon_color = rgb;
    if (fg_fi_forecast_day5_icon_object == NULL) return;
    if (fg_fi_forecast_day5_icon_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_forecast_day5_icon_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_forecast_day5_icon_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_forecast_day5_icon_object, lv_color_hex(rgb), 0);
    }
}
