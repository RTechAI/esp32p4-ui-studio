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
        "assets/uploads/fg_upload_ai_light_off_1784669208487_1784669231373_1b9d0e0b.c"
        "assets/uploads/fg_upload_ai_light_on_1784669208487_1784669253929_60fc1fac.c"
        "assets/uploads/fg_upload_ai_hero_1784669011510_d0ad3d07.c"
        "assets/uploads/fg_upload_ai_button_normal_1784669116028_1784669138607_db792bed.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784669116028_1784669162027_74d2cddf.c"

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