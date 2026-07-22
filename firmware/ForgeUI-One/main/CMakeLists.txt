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
        "assets/uploads/fg_upload_ai_light_off_1784677420538_1784677443359_cd0a7737.c"
        "assets/uploads/fg_upload_ai_light_on_1784677420538_1784677467382_7cc4b1f8.c"
        "assets/uploads/fg_upload_ai_light_off_1784677508462_1784677530750_9b68369e.c"
        "assets/uploads/fg_upload_ai_light_on_1784677508462_1784677552965_a4060f3c.c"
        "assets/uploads/fg_upload_ai_light_off_1784678975755_1784679000762_85a1e4d7.c"
        "assets/uploads/fg_upload_ai_light_on_1784678975755_1784679024330_3cbb5034.c"
        "assets/uploads/fg_upload_ai_hero_1784677195962_931ea33e.c"
        "assets/uploads/fg_upload_ai_button_normal_1784677240652_1784677263363_f19e1afc.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784677240652_1784677288928_db03b335.c"
        "assets/uploads/fg_upload_ai_button_normal_1784677321403_1784677340179_f471c4db.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784677321403_1784677360790_3c1521ce.c"
        "assets/uploads/fg_upload_ai_button_normal_1784678892980_1784678916596_c921e640.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784678892980_1784678941099_8de82729.c"

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