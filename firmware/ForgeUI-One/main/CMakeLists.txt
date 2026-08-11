idf_component_register(
    SRCS
        "main.c"
        "01_FG_Runtime.c"
        "05_FG_RAM_Probe.c"
        "20_RTC.c"
        "30_WIFI.c"
        "90_Studio_Export.c"
        "95_UserEvents.c"
        "assets/defaults/fg_upload_ai_hero_1784342478518_b95a7dc0.c"
        "96_FiRuntime.c"
        "99_Hardware_Example_04_Weather.c"
        "assets/uploads/fg_upload_ai_hero_1786173676218_aeb0dfd0_rgb565.c"
        "assets/uploads/fg_upload_ai_hero_1786175544095_ef74779f_rgb565.c"
        "assets/uploads/fg_upload_ai_hero_1786175636953_e2570088_rgb565.c"
        "assets/uploads/fg_upload_ai_hero_1786176586614_981a4670_rgb565.c"
        "assets/uploads/fg_upload_ai_hero_1786175736552_7ca78d5b_rgb565.c"
        "assets/uploads/fg_upload_ai_hero_1786176018471_8897993e_rgb565.c"
        "assets/uploads/fg_upload_ai_hero_1786175833774_dcf82046_rgb565.c"
        "assets/uploads/fg_upload_ai_hero_1786176442715_8a47a244_rgb565.c"
        "assets/uploads/fg_upload_ai_hero_1786176207823_5b8eb6de_rgb565.c"
        "assets/uploads/fg_upload_ai_hero_1786175925517_846bc1d6_rgb565.c"
        "assets/uploads/fg_upload_fisun_136x136_a816186f.c"
        "assets/uploads/fg_upload_fisun_40x40_6742e7e5.c"
        "assets/uploads/fg_upload_ficloudrain_40x40_3287ad4f.c"
        "assets/icons/fg_icon_settings_fi_48px.c"

    INCLUDE_DIRS
        "."

    REQUIRES
        nvs_flash
        driver
        esp_event
        esp_app_format
        esp_netif
        esp_wifi
        esp_wifi_remote
        esp_hosted
        waveshare__esp32_p4_wifi6_touch_lcd_7b
        esp_http_client
        json
        mbedtls

    PRIV_REQUIRES
        bsp_extra
)

target_compile_definitions(${COMPONENT_LIB} PRIVATE
    LV_LVGL_H_INCLUDE_SIMPLE
)