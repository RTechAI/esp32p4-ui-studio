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
        "assets/uploads/fg_upload_fitted_light_off_1785110606315_1785110606316_0c32e275.c"
        "assets/uploads/fg_upload_fitted_light_on_1785110606315_1785110606320_4801858a.c"
        "assets/uploads/fg_upload_fitted_light_off_1785111287678_1785111287679_03dccde9.c"
        "assets/uploads/fg_upload_fitted_light_on_1785111287678_1785111287684_bc83b5a3.c"
        "assets/uploads/fg_upload_toggle_off_1785113534964_99c95bb6.c"
        "assets/uploads/fg_upload_toggle_on_1785113534964_eab9fe21.c"
        "assets/uploads/fg_upload_ai_three_position_left_1785113659171_1785113659175_fc98c81f.c"
        "assets/uploads/fg_upload_ai_three_position_center_1785113659171_1785113659177_ab79ef8f.c"
        "assets/uploads/fg_upload_ai_three_position_right_1785113659171_1785113659180_8141307b.c"
        "assets/defaults/fg_upload_ai_hero_1784342478518_b95a7dc0.c"
        "assets/uploads/fg_upload_trimmed_button_normal_1785110636353_1785110636354_a3fc58a1.c"
        "assets/uploads/fg_upload_trimmed_button_pressed_1785110636353_1785110636358_b8783690.c"

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