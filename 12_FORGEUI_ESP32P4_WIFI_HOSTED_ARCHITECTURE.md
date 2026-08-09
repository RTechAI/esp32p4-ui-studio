# ForgeUI ESP32-P4 Hosted Wi-Fi Architecture

This document defines the physically proven Wi-Fi and HTTPS architecture for the Waveshare ESP32-P4-WIFI6-Touch-LCD-7B. The immutable proof export is `C:\ForgeUI-Exports\ForgeUI_Export_Weather04_GateB_014`; it must not be modified.

## Hardware and component baseline

The ESP32-P4 is the main MCU. The board's stock onboard ESP32-C6 is the Wi-Fi coprocessor; users do not update or program it. The processors communicate over a 4-bit SDIO link using CLK 18, CMD 19, D0 14, D1 15, D2 16, D3 17, and C6 reset 54.

The manufacturer-matching, physically proven software baseline is ESP-IDF 5.5.4, `esp_hosted` 1.4.7, and `esp_wifi_remote` 0.14.5. ForgeUI manifests constrain these components to the compatible `1.4.*` and `0.14.*` series. The resolved versions used for physical proof were exactly 1.4.7 and 0.14.5.

The proven transport configuration is SDIO at 40 MHz, 4-bit width, streaming RX, with transmit and receive queues of 20 entries each. Fixed-max packet RX must not replace streaming RX unless later physical evidence supersedes this architecture.

## Wi-Fi initialization and state ownership

The authoritative startup sequence is:

`NVS -> esp_netif_init -> default event loop -> default STA netif -> esp_wifi_init -> register event handlers -> read/apply persisted STA configuration -> esp_wifi_set_mode -> esp_wifi_set_config -> esp_wifi_start -> WIFI_EVENT_STA_START -> explicit esp_wifi_connect -> GOT_IP`

Persisted configuration is read and reapplied before `esp_wifi_start()`. The `WIFI_EVENT_STA_START` handler explicitly calls `esp_wifi_connect()`. The previous Hosted 1.4.x ForgeUI experiment read credentials after start and issued no startup connection, leaving the UI indefinitely at `READY` without an IP address.

Frequently polled Inspector and Settings UI getters own cached state. They must not turn UI polling into synchronous coprocessor RPC traffic. In particular, `esp_wifi_sta_get_ap_info()` is used to populate the cache at connection time, not repeatedly from status getters while HTTPS is active.

## Memory and TLS architecture

ForgeUI enables PSRAM while reserving 32 KiB of internal memory with `CONFIG_SPIRAM_MALLOC_RESERVE_INTERNAL=32768`. LVGL requires a large contiguous DMA-capable rotation buffer: a 64 KiB internal reserve prevented that buffer from being allocated, while 32 KiB is physically proven with the display and Wi-Fi running together.

ESP32-P4 mbedTLS uses the default PSRAM-aware allocator and dynamic TLS buffers. Hardware AES is disabled. Hardware AES previously competed for DMA descriptors and caused an AES DMA failure; software AES avoids that contention while preserving TLS security and certificate verification.

ForgeUI connected services use a pre-request safety guard requiring at least 8192 bytes of free DMA-capable memory and a largest DMA block of at least 4096 bytes. These thresholds are physically proven for this ForgeUI runtime and SDIO configuration. They are not universal ESP32-P4 requirements.

## HTTPS physical proof

On the stock board and stock C6 firmware, the proven path completed:

`Wi-Fi -> DHCP -> DNS -> TLS ClientHello -> ServerHello -> complete 4086-byte certificate record -> certificate validation -> TLS connected -> HTTP 200`

The generated Weather Example then applied current conditions and synchronized local Tauranga time. Normal runtime retains concise connection, DNS, TLS, HTTP, weather-application, and time-synchronization logs. Full mbedTLS handshake tracing is diagnostic-only and is disabled in normal generated firmware.

## Product rule

The Waveshare 7B board profile and export system own component compatibility, pins, transport mode, queues, memory policy, TLS allocation, and certificate verification. A normal ForgeUI user must never need a C6 firmware update, USB-to-TTL adapter, manual SDIO configuration, or manual mbedTLS configuration.
