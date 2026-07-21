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
        "assets/uploads/fg_upload_ai_light_off_1784666064013_1784666094577_0ef9c4ed.c"
        "assets/uploads/fg_upload_ai_light_on_1784666064013_1784666137323_26b61b1c.c"
        "assets/uploads/fg_upload_industrial_panel_8775311d.c"
        "assets/uploads/fg_upload_ai_button_normal_1784665943770_1784665976971_80c831f1.c"
        "assets/uploads/fg_upload_ai_button_pressed_1784665943770_1784666002468_d617a3f8.c"

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