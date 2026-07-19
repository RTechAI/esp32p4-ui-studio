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
        "assets/uploads/fg_upload_ai_hero_1784436916528_7ffc60f0.c"
        "assets/uploads/fg_upload_ai_button_normal_1784439468551_1784439487718_3df058ce.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784439468551_1784439510435_2b233f89.c"
        "assets/uploads/fg_upload_ai_button_normal_1784439532374_1784439551627_25c295cc.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784439532374_1784439571494_67480b60.c"
        "assets/uploads/fg_upload_ai_button_normal_1784439655817_1784439674734_0b40ebb9.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784439655817_1784439696420_92b6d476.c"

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