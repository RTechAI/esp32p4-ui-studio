idf_component_register(
    SRCS
        "main.c"
        "01_FG_Runtime.c"
        "05_FG_RAM_Probe.c"
        "20_RTC.c"
        "30_WIFI.c"
        "40_SD.c"
        "50_DIAGNOSTICS.c"
        "90_Studio_Export.c"
        "95_UserEvents.c"
        "assets/defaults/fg_upload_ai_hero_1784342478518_b95a7dc0.c"
        "96_FiRuntime.c"
        "assets/uploads/fg_upload_fiairplay_64x64_3e15f892.c"
        "assets/uploads/fg_upload_ficast_64x64_080c1cb7.c"
        "assets/uploads/fg_upload_fiarrowupcircle_64x64_0dd7076f.c"
        "assets/uploads/fg_upload_ficloudoff_64x64_8b31949f.c"
        "assets/uploads/fg_upload_ficheckcircle_64x64_20c4a1fe.c"
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
        fatfs
        sdmmc
        spi_flash
        waveshare__esp32_p4_wifi6_touch_lcd_7b

    PRIV_REQUIRES
        bsp_extra
)

target_compile_definitions(${COMPONENT_LIB} PRIVATE
    LV_LVGL_H_INCLUDE_SIMPLE
)