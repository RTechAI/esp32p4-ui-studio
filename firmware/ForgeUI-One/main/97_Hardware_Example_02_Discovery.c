/* Hardware Example 02 — identified MB85RC256V persistence proof. */
#include "97_Hardware_Example_02_Discovery.h"
#include "90_Studio_Export.h"
#include "bsp/esp-bsp.h"
#include "driver/i2c_master.h"
#include "esp_log.h"
#include <stdio.h>
#include <stddef.h>
#include <string.h>

#define FG_FRAM_ADDRESS       0x50
#define FG_FRAM_RECORD_OFFSET 0x7FF0
#define FG_FRAM_MAGIC         0x4652414Du /* FRAM */
#define FG_FRAM_VERSION       1u
#define FG_FRAM_TEST_XOR      0xA55Au

typedef struct __attribute__((packed)) {
    uint32_t magic;
    uint32_t counter;
    uint16_t value;
    uint16_t version;
    uint16_t crc;
    uint16_t reserved;
} fg_fram_record_t;

static const char *TAG = "HW_EXAMPLE_02";
static i2c_master_dev_handle_t s_fram;
static bool s_ready;

static uint16_t crc16(const uint8_t *data, size_t length)
{
    uint16_t crc = 0xFFFF;
    while (length--) {
        crc ^= (uint16_t)*data++ << 8;
        for (unsigned bit = 0; bit < 8; ++bit)
            crc = (crc & 0x8000) ? (uint16_t)((crc << 1) ^ 0x1021) : (uint16_t)(crc << 1);
    }
    return crc;
}

static bool record_valid(const fg_fram_record_t *record)
{
    return record->magic == FG_FRAM_MAGIC && record->version == FG_FRAM_VERSION &&
           record->value == (uint16_t)(record->counter ^ FG_FRAM_TEST_XOR) &&
           record->crc == crc16((const uint8_t *)record, offsetof(fg_fram_record_t, crc));
}

static esp_err_t read_record(fg_fram_record_t *record)
{
    const uint8_t address[2] = { FG_FRAM_RECORD_OFFSET >> 8, FG_FRAM_RECORD_OFFSET & 0xFF };
    return i2c_master_transmit_receive(s_fram, address, sizeof(address),
                                       (uint8_t *)record, sizeof(*record), 100);
}

static void publish(const char *status, const fg_fram_record_t *record, const char *verify)
{
    char value[32];
    snprintf(value, sizeof(value), record ? "%04lu / 0x%04X" : "---- / ----",
             record ? (unsigned long)record->counter : 0,
             record ? record->value : 0);
    FG_Set_FRAM_Status_Text(status);
    FG_Set_FRAM_Address_Text(s_ready ? "0x50" : "--");
    FG_Set_FRAM_Value_Text(value);
    FG_Set_FRAM_Verify_Text(verify);
}

void fg_hardware_example_02_init(void)
{
    i2c_master_bus_handle_t bus = bsp_i2c_get_handle();
    if (!bus) { publish("ERROR: NO BSP BUS", NULL, "NOT RUN"); return; }

    unsigned detected = 0;
    for (uint8_t address = 0x08; address <= 0x77; ++address) {
        if (i2c_master_probe(bus, address, 50) == ESP_OK) {
            ESP_LOGI(TAG, "I2C ACK address=0x%02X", address);
            ++detected;
        }
    }
    ESP_LOGI(TAG, "discovery complete: %u address(es) ACK", detected);
    if (i2c_master_probe(bus, FG_FRAM_ADDRESS, 50) != ESP_OK) {
        publish("ERROR: NO DEVICE", NULL, "NOT RUN"); return;
    }

    i2c_master_dev_handle_t id_dev = NULL;
    const i2c_device_config_t id_cfg = { .dev_addr_length = I2C_ADDR_BIT_LEN_7,
        .device_address = 0x7C, .scl_speed_hz = 100000 };
    uint8_t target = FG_FRAM_ADDRESS << 1, id[3] = {0};
    esp_err_t err = i2c_master_bus_add_device(bus, &id_cfg, &id_dev);
    if (err == ESP_OK) err = i2c_master_transmit_receive(id_dev, &target, 1, id, 3, 100);
    if (id_dev) ESP_ERROR_CHECK(i2c_master_bus_rm_device(id_dev));
    if (err != ESP_OK || memcmp(id, (uint8_t[]){0x00, 0xA5, 0x10}, 3)) {
        ESP_LOGE(TAG, "STOP: 0x50 identity is not MB85RC256V (%02X%02X%02X)", id[0], id[1], id[2]);
        publish("ERROR: UNKNOWN 0x50", NULL, "NOT RUN"); return;
    }

    const i2c_device_config_t fram_cfg = { .dev_addr_length = I2C_ADDR_BIT_LEN_7,
        .device_address = FG_FRAM_ADDRESS, .scl_speed_hz = 400000 };
    err = i2c_master_bus_add_device(bus, &fram_cfg, &s_fram);
    if (err != ESP_OK) { publish("ERROR: ATTACH", NULL, "NOT RUN"); return; }
    s_ready = true;
    ESP_LOGI(TAG, "READY MB85RC256V address=0x50 record=0x%04X", FG_FRAM_RECORD_OFFSET);
    fg_hardware_example_02_read_test();
}

void fg_hardware_example_02_read_test(void)
{
    if (!s_ready) { publish("ERROR: NOT READY", NULL, "FAIL"); return; }
    fg_fram_record_t record = {0};
    esp_err_t err = read_record(&record);
    if (err != ESP_OK) { publish("ERROR: READ", NULL, "FAIL"); return; }
    bool valid = record_valid(&record);
    publish("READY", valid ? &record : NULL, valid ? "PASS" : "EMPTY / INVALID");
    ESP_LOGI(TAG, "READ counter=%lu value=0x%04X verify=%s",
             (unsigned long)record.counter, record.value, valid ? "PASS" : "FAIL");
}

void fg_hardware_example_02_write_test(void)
{
    if (!s_ready) { publish("ERROR: NOT READY", NULL, "FAIL"); return; }
    fg_fram_record_t previous = {0};
    (void)read_record(&previous);
    fg_fram_record_t record = { .magic = FG_FRAM_MAGIC,
        .counter = record_valid(&previous) ? previous.counter + 1 : 1,
        .version = FG_FRAM_VERSION, .reserved = 0 };
    record.value = (uint16_t)(record.counter ^ FG_FRAM_TEST_XOR);
    record.crc = crc16((const uint8_t *)&record, offsetof(fg_fram_record_t, crc));
    uint8_t payload[2 + sizeof(record)] = { FG_FRAM_RECORD_OFFSET >> 8, FG_FRAM_RECORD_OFFSET & 0xFF };
    memcpy(payload + 2, &record, sizeof(record));
    esp_err_t err = i2c_master_transmit(s_fram, payload, sizeof(payload), 100);
    fg_fram_record_t check = {0};
    if (err == ESP_OK) err = read_record(&check);
    bool pass = err == ESP_OK && !memcmp(&record, &check, sizeof(record)) && record_valid(&check);
    publish(pass ? "READY" : "ERROR: WRITE", pass ? &check : NULL, pass ? "PASS" : "FAIL");
    ESP_LOGI(TAG, "WRITE counter=%lu value=0x%04X verify=%s",
             (unsigned long)record.counter, record.value, pass ? "PASS" : "FAIL");
}
