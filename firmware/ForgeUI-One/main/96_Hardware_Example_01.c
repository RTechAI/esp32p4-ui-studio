/*
 * Hardware Example 01 — 2 Buttons + 2 LEDs
 *
 * This is developer-owned application code. ForgeUI owns the editable UI,
 * generated LVGL and public Runtime SDK; this file owns board GPIO behavior.
 */

#include "96_Hardware_Example_01.h"
#include "90_Studio_Export.h"
#include "driver/gpio.h"
#include "esp_check.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "bsp/esp-bsp.h"

#define FG_EXAMPLE_BUTTON_1 GPIO_NUM_2
#define FG_EXAMPLE_LED_1    GPIO_NUM_3
#define FG_EXAMPLE_BUTTON_2 GPIO_NUM_4
#define FG_EXAMPLE_LED_2    GPIO_NUM_5
#define FG_EXAMPLE_DEBOUNCE_US (25 * 1000)

typedef struct {
    gpio_num_t gpio;
    bool raw_pressed;
    bool stable_pressed;
    int64_t raw_changed_at_us;
    void (*set_indicator)(bool on);
} fg_example_button_t;

static const char *TAG = "HW_EXAMPLE_01";
static bool initialized;
static fg_example_button_t buttons[] = {
    { FG_EXAMPLE_BUTTON_1, false, false, 0, FG_Set_Indicator1 },
    { FG_EXAMPLE_BUTTON_2, false, false, 0, FG_Set_Indicator2 },
};

static void set_indicator_locked(void (*setter)(bool), bool on)
{
    bsp_display_lock(0);
    setter(on);
    bsp_display_unlock();
}

void fg_hardware_example_01_init(void)
{
    const gpio_config_t inputs = {
        .pin_bit_mask = (1ULL << FG_EXAMPLE_BUTTON_1) |
                        (1ULL << FG_EXAMPLE_BUTTON_2),
        .mode = GPIO_MODE_INPUT,
        .pull_up_en = GPIO_PULLUP_ENABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE,
    };
    const gpio_config_t outputs = {
        .pin_bit_mask = (1ULL << FG_EXAMPLE_LED_1) |
                        (1ULL << FG_EXAMPLE_LED_2),
        .mode = GPIO_MODE_OUTPUT,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE,
    };

    ESP_ERROR_CHECK(gpio_config(&inputs));
    ESP_ERROR_CHECK(gpio_config(&outputs));
    ESP_ERROR_CHECK(gpio_set_level(FG_EXAMPLE_LED_1, 0));
    ESP_ERROR_CHECK(gpio_set_level(FG_EXAMPLE_LED_2, 0));

    const int64_t now = esp_timer_get_time();
    for (size_t index = 0; index < sizeof(buttons) / sizeof(buttons[0]); ++index) {
        const bool pressed = gpio_get_level(buttons[index].gpio) == 0;
        buttons[index].raw_pressed = pressed;
        buttons[index].stable_pressed = pressed;
        buttons[index].raw_changed_at_us = now;
        set_indicator_locked(buttons[index].set_indicator, pressed);
    }
    initialized = true;
    ESP_LOGI(TAG, "ready: buttons GPIO2/GPIO4, LEDs GPIO3/GPIO5");
}

void fg_hardware_example_01_poll(void)
{
    if (!initialized) return;
    const int64_t now = esp_timer_get_time();

    for (size_t index = 0; index < sizeof(buttons) / sizeof(buttons[0]); ++index) {
        fg_example_button_t *button = &buttons[index];
        const bool pressed = gpio_get_level(button->gpio) == 0;
        if (pressed != button->raw_pressed) {
            button->raw_pressed = pressed;
            button->raw_changed_at_us = now;
        }
        if (pressed != button->stable_pressed &&
            now - button->raw_changed_at_us >= FG_EXAMPLE_DEBOUNCE_US) {
            button->stable_pressed = pressed;
            set_indicator_locked(button->set_indicator, pressed);
        }
    }
}

void fg_hardware_example_01_set_led1(bool on)
{
    if (initialized) ESP_ERROR_CHECK(gpio_set_level(FG_EXAMPLE_LED_1, on));
}

void fg_hardware_example_01_set_led2(bool on)
{
    if (initialized) ESP_ERROR_CHECK(gpio_set_level(FG_EXAMPLE_LED_2, on));
}
