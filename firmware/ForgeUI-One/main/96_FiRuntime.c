#include "96_FiRuntime.h"

static lv_obj_t * fg_fi_comp_ms9q2mxpejp7d_object = NULL;
static bool fg_fi_comp_ms9q2mxpejp7d_image_backed = false;
static bool fg_fi_comp_ms9q2mxpejp7d_visible = true;
static uint8_t fg_fi_comp_ms9q2mxpejp7d_opacity = 255;
static uint32_t fg_fi_comp_ms9q2mxpejp7d_color = 0xF5F5F5;

static void fg_fi_apply_comp_ms9q2mxpejp7d(void)
{
    lv_obj_t * object = fg_fi_comp_ms9q2mxpejp7d_object;
    if (object == NULL) return;
    if (fg_fi_comp_ms9q2mxpejp7d_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_comp_ms9q2mxpejp7d_opacity, 0);
    if (fg_fi_comp_ms9q2mxpejp7d_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_comp_ms9q2mxpejp7d_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_comp_ms9q2mxpejp7d_color), 0);
    }
}

void fg_fi_bind_comp_ms9q2mxpejp7d(lv_obj_t * object, bool image_backed)
{
    fg_fi_comp_ms9q2mxpejp7d_object = object;
    fg_fi_comp_ms9q2mxpejp7d_image_backed = image_backed;
    fg_fi_apply_comp_ms9q2mxpejp7d();
}

void FG_Set_Comp_MS9Q2MXPEJP7D_Visible(bool visible)
{
    if (fg_fi_comp_ms9q2mxpejp7d_visible == visible) return;
    fg_fi_comp_ms9q2mxpejp7d_visible = visible;
    if (fg_fi_comp_ms9q2mxpejp7d_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_comp_ms9q2mxpejp7d_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_comp_ms9q2mxpejp7d_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Comp_MS9Q2MXPEJP7D_Opacity(uint8_t opacity)
{
    if (fg_fi_comp_ms9q2mxpejp7d_opacity == opacity) return;
    fg_fi_comp_ms9q2mxpejp7d_opacity = opacity;
    if (fg_fi_comp_ms9q2mxpejp7d_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_comp_ms9q2mxpejp7d_object, opacity, 0);
}

void FG_Set_Comp_MS9Q2MXPEJP7D_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_comp_ms9q2mxpejp7d_color == rgb) return;
    fg_fi_comp_ms9q2mxpejp7d_color = rgb;
    if (fg_fi_comp_ms9q2mxpejp7d_object == NULL) return;
    if (fg_fi_comp_ms9q2mxpejp7d_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_comp_ms9q2mxpejp7d_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_comp_ms9q2mxpejp7d_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_comp_ms9q2mxpejp7d_object, lv_color_hex(rgb), 0);
    }
}

static lv_obj_t * fg_fi_comp_ms9q3o2k5hc6o_object = NULL;
static bool fg_fi_comp_ms9q3o2k5hc6o_image_backed = false;
static bool fg_fi_comp_ms9q3o2k5hc6o_visible = true;
static uint8_t fg_fi_comp_ms9q3o2k5hc6o_opacity = 255;
static uint32_t fg_fi_comp_ms9q3o2k5hc6o_color = 0xF5F5F5;

static void fg_fi_apply_comp_ms9q3o2k5hc6o(void)
{
    lv_obj_t * object = fg_fi_comp_ms9q3o2k5hc6o_object;
    if (object == NULL) return;
    if (fg_fi_comp_ms9q3o2k5hc6o_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_comp_ms9q3o2k5hc6o_opacity, 0);
    if (fg_fi_comp_ms9q3o2k5hc6o_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_comp_ms9q3o2k5hc6o_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_comp_ms9q3o2k5hc6o_color), 0);
    }
}

void fg_fi_bind_comp_ms9q3o2k5hc6o(lv_obj_t * object, bool image_backed)
{
    fg_fi_comp_ms9q3o2k5hc6o_object = object;
    fg_fi_comp_ms9q3o2k5hc6o_image_backed = image_backed;
    fg_fi_apply_comp_ms9q3o2k5hc6o();
}

void FG_Set_Comp_MS9Q3O2K5HC6O_Visible(bool visible)
{
    if (fg_fi_comp_ms9q3o2k5hc6o_visible == visible) return;
    fg_fi_comp_ms9q3o2k5hc6o_visible = visible;
    if (fg_fi_comp_ms9q3o2k5hc6o_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_comp_ms9q3o2k5hc6o_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_comp_ms9q3o2k5hc6o_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Comp_MS9Q3O2K5HC6O_Opacity(uint8_t opacity)
{
    if (fg_fi_comp_ms9q3o2k5hc6o_opacity == opacity) return;
    fg_fi_comp_ms9q3o2k5hc6o_opacity = opacity;
    if (fg_fi_comp_ms9q3o2k5hc6o_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_comp_ms9q3o2k5hc6o_object, opacity, 0);
}

void FG_Set_Comp_MS9Q3O2K5HC6O_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_comp_ms9q3o2k5hc6o_color == rgb) return;
    fg_fi_comp_ms9q3o2k5hc6o_color = rgb;
    if (fg_fi_comp_ms9q3o2k5hc6o_object == NULL) return;
    if (fg_fi_comp_ms9q3o2k5hc6o_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_comp_ms9q3o2k5hc6o_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_comp_ms9q3o2k5hc6o_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_comp_ms9q3o2k5hc6o_object, lv_color_hex(rgb), 0);
    }
}

static lv_obj_t * fg_fi_comp_ms9q42sgcb4eb_object = NULL;
static bool fg_fi_comp_ms9q42sgcb4eb_image_backed = false;
static bool fg_fi_comp_ms9q42sgcb4eb_visible = true;
static uint8_t fg_fi_comp_ms9q42sgcb4eb_opacity = 255;
static uint32_t fg_fi_comp_ms9q42sgcb4eb_color = 0xF5F5F5;

static void fg_fi_apply_comp_ms9q42sgcb4eb(void)
{
    lv_obj_t * object = fg_fi_comp_ms9q42sgcb4eb_object;
    if (object == NULL) return;
    if (fg_fi_comp_ms9q42sgcb4eb_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_comp_ms9q42sgcb4eb_opacity, 0);
    if (fg_fi_comp_ms9q42sgcb4eb_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_comp_ms9q42sgcb4eb_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_comp_ms9q42sgcb4eb_color), 0);
    }
}

void fg_fi_bind_comp_ms9q42sgcb4eb(lv_obj_t * object, bool image_backed)
{
    fg_fi_comp_ms9q42sgcb4eb_object = object;
    fg_fi_comp_ms9q42sgcb4eb_image_backed = image_backed;
    fg_fi_apply_comp_ms9q42sgcb4eb();
}

void FG_Set_Comp_MS9Q42SGCB4EB_Visible(bool visible)
{
    if (fg_fi_comp_ms9q42sgcb4eb_visible == visible) return;
    fg_fi_comp_ms9q42sgcb4eb_visible = visible;
    if (fg_fi_comp_ms9q42sgcb4eb_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_comp_ms9q42sgcb4eb_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_comp_ms9q42sgcb4eb_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Comp_MS9Q42SGCB4EB_Opacity(uint8_t opacity)
{
    if (fg_fi_comp_ms9q42sgcb4eb_opacity == opacity) return;
    fg_fi_comp_ms9q42sgcb4eb_opacity = opacity;
    if (fg_fi_comp_ms9q42sgcb4eb_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_comp_ms9q42sgcb4eb_object, opacity, 0);
}

void FG_Set_Comp_MS9Q42SGCB4EB_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_comp_ms9q42sgcb4eb_color == rgb) return;
    fg_fi_comp_ms9q42sgcb4eb_color = rgb;
    if (fg_fi_comp_ms9q42sgcb4eb_object == NULL) return;
    if (fg_fi_comp_ms9q42sgcb4eb_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_comp_ms9q42sgcb4eb_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_comp_ms9q42sgcb4eb_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_comp_ms9q42sgcb4eb_object, lv_color_hex(rgb), 0);
    }
}

static lv_obj_t * fg_fi_comp_ms9q4ga18lmom_object = NULL;
static bool fg_fi_comp_ms9q4ga18lmom_image_backed = false;
static bool fg_fi_comp_ms9q4ga18lmom_visible = true;
static uint8_t fg_fi_comp_ms9q4ga18lmom_opacity = 255;
static uint32_t fg_fi_comp_ms9q4ga18lmom_color = 0xF5F5F5;

static void fg_fi_apply_comp_ms9q4ga18lmom(void)
{
    lv_obj_t * object = fg_fi_comp_ms9q4ga18lmom_object;
    if (object == NULL) return;
    if (fg_fi_comp_ms9q4ga18lmom_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_comp_ms9q4ga18lmom_opacity, 0);
    if (fg_fi_comp_ms9q4ga18lmom_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_comp_ms9q4ga18lmom_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_comp_ms9q4ga18lmom_color), 0);
    }
}

void fg_fi_bind_comp_ms9q4ga18lmom(lv_obj_t * object, bool image_backed)
{
    fg_fi_comp_ms9q4ga18lmom_object = object;
    fg_fi_comp_ms9q4ga18lmom_image_backed = image_backed;
    fg_fi_apply_comp_ms9q4ga18lmom();
}

void FG_Set_Comp_MS9Q4GA18LMOM_Visible(bool visible)
{
    if (fg_fi_comp_ms9q4ga18lmom_visible == visible) return;
    fg_fi_comp_ms9q4ga18lmom_visible = visible;
    if (fg_fi_comp_ms9q4ga18lmom_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_comp_ms9q4ga18lmom_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_comp_ms9q4ga18lmom_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Comp_MS9Q4GA18LMOM_Opacity(uint8_t opacity)
{
    if (fg_fi_comp_ms9q4ga18lmom_opacity == opacity) return;
    fg_fi_comp_ms9q4ga18lmom_opacity = opacity;
    if (fg_fi_comp_ms9q4ga18lmom_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_comp_ms9q4ga18lmom_object, opacity, 0);
}

void FG_Set_Comp_MS9Q4GA18LMOM_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_comp_ms9q4ga18lmom_color == rgb) return;
    fg_fi_comp_ms9q4ga18lmom_color = rgb;
    if (fg_fi_comp_ms9q4ga18lmom_object == NULL) return;
    if (fg_fi_comp_ms9q4ga18lmom_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_comp_ms9q4ga18lmom_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_comp_ms9q4ga18lmom_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_comp_ms9q4ga18lmom_object, lv_color_hex(rgb), 0);
    }
}

static lv_obj_t * fg_fi_comp_ms9qe1n7ga5o3_object = NULL;
static bool fg_fi_comp_ms9qe1n7ga5o3_image_backed = false;
static bool fg_fi_comp_ms9qe1n7ga5o3_visible = true;
static uint8_t fg_fi_comp_ms9qe1n7ga5o3_opacity = 255;
static uint32_t fg_fi_comp_ms9qe1n7ga5o3_color = 0xF5F5F5;

static void fg_fi_apply_comp_ms9qe1n7ga5o3(void)
{
    lv_obj_t * object = fg_fi_comp_ms9qe1n7ga5o3_object;
    if (object == NULL) return;
    if (fg_fi_comp_ms9qe1n7ga5o3_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(object, fg_fi_comp_ms9qe1n7ga5o3_opacity, 0);
    if (fg_fi_comp_ms9qe1n7ga5o3_image_backed) {
        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_comp_ms9qe1n7ga5o3_color), 0);
        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_comp_ms9qe1n7ga5o3_color), 0);
    }
}

void fg_fi_bind_comp_ms9qe1n7ga5o3(lv_obj_t * object, bool image_backed)
{
    fg_fi_comp_ms9qe1n7ga5o3_object = object;
    fg_fi_comp_ms9qe1n7ga5o3_image_backed = image_backed;
    fg_fi_apply_comp_ms9qe1n7ga5o3();
}

void FG_Set_Comp_MS9QE1N7GA5O3_Visible(bool visible)
{
    if (fg_fi_comp_ms9qe1n7ga5o3_visible == visible) return;
    fg_fi_comp_ms9qe1n7ga5o3_visible = visible;
    if (fg_fi_comp_ms9qe1n7ga5o3_object == NULL) return;
    if (visible) lv_obj_clear_flag(fg_fi_comp_ms9qe1n7ga5o3_object, LV_OBJ_FLAG_HIDDEN);
    else lv_obj_add_flag(fg_fi_comp_ms9qe1n7ga5o3_object, LV_OBJ_FLAG_HIDDEN);
}

void FG_Set_Comp_MS9QE1N7GA5O3_Opacity(uint8_t opacity)
{
    if (fg_fi_comp_ms9qe1n7ga5o3_opacity == opacity) return;
    fg_fi_comp_ms9qe1n7ga5o3_opacity = opacity;
    if (fg_fi_comp_ms9qe1n7ga5o3_object == NULL) return;
    lv_obj_set_style_opa(fg_fi_comp_ms9qe1n7ga5o3_object, opacity, 0);
}

void FG_Set_Comp_MS9QE1N7GA5O3_Color(uint32_t rgb)
{
    rgb &= 0xFFFFFFu;
    if (fg_fi_comp_ms9qe1n7ga5o3_color == rgb) return;
    fg_fi_comp_ms9qe1n7ga5o3_color = rgb;
    if (fg_fi_comp_ms9qe1n7ga5o3_object == NULL) return;
    if (fg_fi_comp_ms9qe1n7ga5o3_image_backed) {
        lv_obj_set_style_image_recolor(fg_fi_comp_ms9qe1n7ga5o3_object, lv_color_hex(rgb), 0);
        lv_obj_set_style_image_recolor_opa(fg_fi_comp_ms9qe1n7ga5o3_object, LV_OPA_COVER, 0);
    } else {
        lv_obj_set_style_text_color(fg_fi_comp_ms9qe1n7ga5o3_object, lv_color_hex(rgb), 0);
    }
}
