

#include "nvs_flash.h"
#include "nvs.h"
#include "esp_log.h"
#include "esp_err.h"
#include "esp_heap_caps.h"
#include "esp_system.h"
#include "lvgl.h"
#include "bsp/esp-bsp.h"
#include "bsp/display.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "30_WIFI.h"
#include "20_RTC.h"
#include "40_SD.h"
#include "05_FG_RAM_Probe.h"
#include "00_ForgeUI_Config.h"

#include "01_FG_Runtime.h"
#include "96_Hardware_Example_01.h"

void fg_sidebar_init(void);

static const char *TAG = "APP_MAIN";

void app_main(void)
{
    ESP_LOGI(TAG, "BOOT 01 app_main reset=%d heap=%u min_heap=%u",
             (int)esp_reset_reason(),
             (unsigned)esp_get_free_heap_size(),
             (unsigned)esp_get_minimum_free_heap_size());
    // ---- NVS INIT ----
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
    {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);
    // ---- DISPLAY INIT ----
    bsp_display_cfg_t cfg = {
        .lvgl_port_cfg = ESP_LVGL_PORT_INIT_CONFIG(),
        .buffer_size = BSP_LCD_DRAW_BUFF_SIZE,
        .double_buffer = BSP_LCD_DRAW_BUFF_DOUBLE,
        .flags = {
            .buff_dma = true,
            .buff_spiram = false,
            .sw_rotate = true,
        }
    };

    ESP_LOGI(TAG, "BOOT 02 display init begin");
    lv_display_t *display_result = bsp_display_start_with_config(&cfg);
    ESP_LOGI(TAG, "BOOT 03 display init end handle=%p heap=%u min_heap=%u",
             display_result,
             (unsigned)esp_get_free_heap_size(),
             (unsigned)esp_get_minimum_free_heap_size());

    bsp_display_backlight_on();
    ESP_LOGI(TAG, "BOOT 04 backlight on / LVGL lock");

        // ---- UI INIT ----
    bsp_display_lock(0);
    fg_runtime_init();
    bsp_display_unlock();
    fg_hardware_example_01_init();
    ESP_LOGI(TAG, "BOOT 20 UI init returned heap=%u min_heap=%u",
             (unsigned)esp_get_free_heap_size(),
             (unsigned)esp_get_minimum_free_heap_size());

    // ---- TIME INIT (external RTC or software/NVS fallback) ----
    fg_rtc_init();

#if FORGEUI_ENABLE_WIFI
    bool wifi_ready = false;
#endif

#if FORGEUI_ENABLE_SD
    bool sd_ready = false;
#endif

    ESP_LOGI(TAG, "========================================");
    ESP_LOGI(TAG, "FORGEUI ONE BOOT");
    ESP_LOGI(TAG, "WiFi feature: %s", FORGEUI_ENABLE_WIFI ? "ON" : "OFF");
    ESP_LOGI(TAG, "SD feature: %s", FORGEUI_ENABLE_SD ? "ON" : "OFF");
    ESP_LOGI(TAG, "RTC feature: %s", FORGEUI_ENABLE_RTC ? "ON" : "OFF");
    ESP_LOGI(TAG, "========================================");

#if FORGEUI_ENABLE_WIFI

    // ========================================================
    // WiFi Init
    // ========================================================

    ESP_LOGI(TAG, "========================================");
    ESP_LOGI(TAG, "WIFI INIT");
    ESP_LOGI(TAG, "========================================");

    fg_wifi_init();
    fg_ram_probe_log("06 after Wi-Fi backend initialization");

    vTaskDelay(pdMS_TO_TICKS(2500));

    wifi_ready = fg_wifi_is_ready();

    ESP_LOGI(TAG,
             "WiFi: %s | IP: %s",
             fg_wifi_status_text(),
             fg_wifi_ip_text());

#endif

   #if FORGEUI_ENABLE_SD
    
   // ========================================================
   // SD Init
   // ========================================================

    ESP_LOGI(TAG, "========================================");
    ESP_LOGI(TAG, "MOUNT SD AFTER WIFI");
    ESP_LOGI(TAG, "========================================");

    if (fg_sd_init())
    {
        sd_ready = true;
        ESP_LOGI(TAG, "SD READY");
        fg_sd_test();
    }
    else
    {
        sd_ready = false;
        ESP_LOGE(TAG, "SD AFTER WIFI-FIRST INIT: FAILED");
    }
#endif

    ESP_LOGI(TAG, "========================================");
    ESP_LOGI(TAG, "BOOT TEST RESULT");

#if FORGEUI_ENABLE_WIFI
    ESP_LOGI(TAG, "WiFi ready: %s", wifi_ready ? "READY" : "FAIL");
    ESP_LOGI(TAG, "WiFi status: %s | IP: %s",
             fg_wifi_status_text(),
             fg_wifi_ip_text());
#else
    ESP_LOGI(TAG, "WiFi: DISABLED");
#endif

#if FORGEUI_ENABLE_SD
    ESP_LOGI(TAG, "SD ready: %s", sd_ready ? "READY" : "FAIL");
#else
    ESP_LOGI(TAG, "SD: DISABLED");
#endif

    ESP_LOGI(TAG, "========================================");

    // ---- MAIN LOOP ----
    uint32_t last_1hz = lv_tick_get();

    while (1)
    {
        vTaskDelay(pdMS_TO_TICKS(10));
        fg_hardware_example_01_poll();

#if FORGEUI_ENABLE_WIFI
        // ---- WIFI SERVICE PUMP ----
        fg_wifi_pump();
#endif

        uint32_t now = lv_tick_get();

        if ((now - last_1hz) >= 1000)
        {
            last_1hz = now;

 #if FORGEUI_ENABLE_WIFI
            const char *wifi_status = fg_wifi_status_text();
            const char *wifi_ip = fg_wifi_ip_text();
#else
            const char *wifi_status = "DISABLED";
            const char *wifi_ip = "-";
#endif

#if FORGEUI_ENABLE_SD
            const char *sd_status = sd_ready ? "READY" : "FAIL";
#else
            const char *sd_status = "DISABLED";
#endif

            ESP_LOGI(TAG, "WiFi: %s | IP: %s | SD: %s",
                     wifi_status,
                     wifi_ip,
                     sd_status);
        }
    }
}
