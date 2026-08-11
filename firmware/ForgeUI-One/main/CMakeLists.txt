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
        "assets/uploads/fg_upload_background_forgeui_background_v3_cyber_cyan_glass_ribbons_1786423498117_efaf7a3e.c"
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

    PRIV_REQUIRES
        bsp_extra
)

target_compile_definitions(${COMPONENT_LIB} PRIVATE
    LV_LVGL_H_INCLUDE_SIMPLE
)