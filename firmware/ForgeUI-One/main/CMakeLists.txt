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
        "99_Hardware_Example_05_GPS.c"
        "assets/uploads/fg_upload_background_forgeui_background_v3_cyber_blue_edge_routes_1786355864130_e6e7fb80.c"
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