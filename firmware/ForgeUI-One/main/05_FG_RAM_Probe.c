#include "05_FG_RAM_Probe.h"

#include "esp_heap_caps.h"
#include "esp_log.h"
#include "lvgl.h"

static size_t fg_ram_probe_count_objects(lv_obj_t *object)
{
    if (object == NULL) return 0;
    size_t count = 1;
    const uint32_t child_count = lv_obj_get_child_count(object);
    for (uint32_t index = 0; index < child_count; ++index) {
        count += fg_ram_probe_count_objects(
            lv_obj_get_child(object, (int32_t)index)
        );
    }
    return count;
}

void fg_ram_probe_log(const char *stage)
{
    lv_obj_t *screen = lv_screen_active();
    lv_obj_t *top = lv_layer_top();
    size_t object_count = fg_ram_probe_count_objects(screen);
    if (top != NULL && top != screen) {
        object_count += fg_ram_probe_count_objects(top);
    }
    ESP_LOGI(
        "FG_RAM_STAGE",
        "%s internal_free=%u internal_min=%u internal_largest=%u lvgl_objects=%u",
        stage != NULL ? stage : "-",
        (unsigned)heap_caps_get_free_size(MALLOC_CAP_INTERNAL),
        (unsigned)heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL),
        (unsigned)heap_caps_get_largest_free_block(MALLOC_CAP_INTERNAL),
        (unsigned)object_count
    );
}
