idf_component_register(
    SRCS
        "main.c"
        "01_FG_Runtime.c"
        "20_RTC.c"
        "30_Audio.c"
        "30_WIFI.c"
        "40_SD.c"
        "90_Studio_Export.c"
        "assets/defaults/fg_upload_ai_hero_1784342478518_b95a7dc0.c"
        "assets/uploads/fg_upload_ai_hero_1784426982819_e43478b1.c"
        "assets/uploads/fg_upload_ai_button_normal_1784423439503_1784423458965_26443786.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784423439503_1784423481741_94475ec3.c"
        "assets/uploads/fg_upload_ai_button_normal_1784425693819_1784425716390_e4c67340.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784425693819_1784425738405_e1e3a1e8.c"

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