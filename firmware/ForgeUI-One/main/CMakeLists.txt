idf_component_register(
    SRCS
        "main.c"
        "01_FG_Runtime.c"
        "20_RTC.c"
        "30_Audio.c"
        "30_WIFI.c"
        "40_SD.c"
        "90_Studio_Export.c"
        "95_UserEvents.c"
        "assets/defaults/fg_upload_ai_hero_1784342478518_b95a7dc0.c"
        "assets/uploads/fg_upload_ai_status_indicator_off_1784682697093_1784682720049_7d915498.c"
        "assets/uploads/fg_upload_ai_status_indicator_on_1784682697093_1784682745545_91d4e231.c"
        "assets/uploads/fg_upload_ai_status_indicator_off_1784682803488_1784682823685_bac02494.c"
        "assets/uploads/fg_upload_ai_status_indicator_on_1784682803488_1784682850209_47290330.c"
        "assets/uploads/fg_upload_ai_hero_1784677195962_931ea33e.c"

    INCLUDE_DIRS
        "."

    REQUIRES
        nvs_flash
        driver
        esp_event
        esp_netif
        esp_wifi
        esp_wifi_remote
        esp_hosted
        fatfs
        sdmmc
        waveshare__esp32_p4_wifi6_touch_lcd_7b

    PRIV_REQUIRES
        bsp_extra
)

target_compile_definitions(${COMPONENT_LIB} PRIVATE
    LV_LVGL_H_INCLUDE_SIMPLE
)