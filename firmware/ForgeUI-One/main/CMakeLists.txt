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
        "assets/uploads/fg_upload_ai_light_off_1784622942204_1784622973939_5812ab17.c"
        "assets/uploads/fg_upload_ai_light_on_1784622942204_1784623002094_a6681a57.c"
        "assets/uploads/fg_upload_ai_hero_1784534316385_6390cae0.c"
        "assets/uploads/fg_upload_ai_button_normal_1784618978195_1784618998837_9a9d4c98.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784618978195_1784619035670_b407a0a0.c"

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