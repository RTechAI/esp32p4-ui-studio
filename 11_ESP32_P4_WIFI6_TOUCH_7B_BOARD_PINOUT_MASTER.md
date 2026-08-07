# Waveshare ESP32-P4-WIFI6-Touch-LCD-7B Board Pinout Master

Status: authoritative human-readable ForgeUI hardware-I/O reference  
Board audited: Waveshare `ESP32-P4-WIFI6-Touch-LCD-7B` (production board photographed in this repository)  
Last audited: 2026-08-07

> [!IMPORTANT]
> This document records current evidence; it does not configure an export. The ForgeUI **Project Hardware Profile** remains authoritative for generated export configuration. This reference must not silently override it. If the profile changes, review and align this document before selecting hardware-I/O pins.

## 1. Board identity

| Item | Current identity |
|---|---|
| Product | Waveshare ESP32-P4-WIFI6-Touch-LCD-7B |
| Display | 7-inch IPS touch display, 1024 × 600 |
| Main processor | ESP32-P4NRW32 (ESP32-P4; external wireless is required) |
| Wireless arrangement | Onboard ESP32-C6 used through ESP-Hosted; ForgeUI configures the P4 as a four-bit SDIO host |
| ForgeUI board profile | `studio/src/forgeui/boards/profiles/waveshareEsp32P4Wifi6Touch7B.ts` |
| ForgeUI generated defaults | `firmware/ForgeUI-One/sdkconfig.defaults` |
| Effective build configuration | `firmware/ForgeUI-One/sdkconfig` |
| Project hardware Kconfig | `firmware/ForgeUI-One/main/Kconfig.projbuild` |
| Managed Waveshare BSP | `firmware/ForgeUI-One/managed_components/waveshare__esp32_p4_wifi6_touch_lcd_7b/` |
| ForgeUI BSP extension | `firmware/ForgeUI-One/components/bsp_extra/` |

The board profile currently enables display, touch, backlight, Wi-Fi, audio capability, SD card, RTC, USB host capability and camera capability. Its default project features enable Wi-Fi, SD and RTC, while audio, USB host and camera default off. A feature being disabled in one project does **not** make a board-connected pin electrically unowned or automatically safe.

## 2. Physical board evidence

The following photograph is the baseline physical-board reference for future ForgeUI Hardware I/O proofs:

![Rear side of the physical ForgeUI Waveshare ESP32-P4-WIFI6-Touch-LCD-7B board](board%20pics%20rear%20side%20pinouts/ESP32-P4-WIFI6-Touch_LCD-7B/ESP32-P4-WIFI6-Touch-LCD-7B.png)

Repository path: `board pics rear side pinouts/ESP32-P4-WIFI6-Touch_LCD-7B/ESP32-P4-WIFI6-Touch-LCD-7B.png`

The photograph confirms the actual production board marking, `1024x600 Pixels`, and physical presence/labels of the bottom GPIO header, I2C, UART, CAN, RS485, RTC battery/reset/boot area, speaker, camera, TF card, USB-OTG, USB, USB-to-UART and C6-UART areas. It does not prove that a net is unused, its voltage is safe, or its power-on state is suitable.

## 3. Master GPIO ownership table

`Yes*` means usable only under the stated restriction. `No` includes pins connected to board hardware even when a corresponding optional ForgeUI feature is disabled.

| GPIO | Physical exposure / connector | Current board function | ForgeUI ownership | Direction | Boot/strap/reserved risk | Safe for external I/O? | Notes / evidence source |
|---:|---|---|---|---|---|---|---|
| 0 | Not identified on user connector | Module/internal net; no ForgeUI assignment proven | Unallocated in profile | Unknown | Not a P4 strap; board routing not fully established | No | Schematic only; not physically offered for proof work |
| 1 | Not identified on user connector | Module/internal net; no ForgeUI assignment proven | Unallocated in profile | Unknown | Board routing not fully established | No | Schematic only |
| 2 | Bottom header `IO2` | No board function or ForgeUI assignment found | Available candidate | Configurable | No P4 strap restriction documented | Yes | Profile/config/BSP search; physical PCB evidence; schematic header net |
| 3 | Bottom header `IO3` | No board function or ForgeUI assignment found | Available candidate | Configurable | No P4 strap restriction documented | Yes | Same evidence as GPIO2 |
| 4 | Bottom header `IO4` | No board function or ForgeUI assignment found | Available candidate | Configurable | No P4 strap restriction documented | Yes | Same evidence as GPIO2 |
| 5 | Bottom header `IO5` | No board function or ForgeUI assignment found | Available candidate | Configurable | No P4 strap restriction documented | Yes | Same evidence as GPIO2 |
| 6 | Board-internal ESP32-C6 connection | C6 `IO2` auxiliary/control connection | Board/ESP-Hosted hardware | Bidirectional/board-defined | Shared with C6 subsystem | No | Official schematic connects GPIO6 to `C6_IO2` |
| 7 | I2C `SDA`; camera/touch/RTC shared bus | BSP I2C0 SDA, touch control, ES8311 control, optional DS3231 and CSI control | BSP + ForgeUI RTC/audio consumers | Bidirectional open-drain | Shared bus with pull-ups | No (except compatible I2C device) | BSP header; RTC source; Waveshare wiki/schematic |
| 8 | I2C `SCL`; camera/touch/RTC shared bus | BSP I2C0 SCL, touch control, ES8311 control, optional DS3231 and CSI control | BSP + ForgeUI RTC/audio consumers | Output/open-drain | Shared bus with pull-ups | No (except compatible I2C device) | BSP header; RTC source; Waveshare wiki/schematic |
| 9 | Speaker/audio circuitry | I2S serial data between P4 and ES8311 | BSP audio | Output per BSP (`DOUT`); see conflict note | Active board peripheral | No | Managed BSP says DOUT; wiki table labels DSDIN on GPIO9 |
| 10 | Speaker/audio circuitry | I2S LRCK/WS | BSP audio | Output | Active board peripheral | No | BSP and wiki agree |
| 11 | Speaker/audio circuitry | I2S serial data between ES8311 and P4 | BSP audio | Input per BSP (`DSIN`); see conflict note | Active board peripheral | No | Managed BSP says DSIN; wiki table labels ASDOUT on GPIO11 |
| 12 | Speaker/audio circuitry | I2S bit clock/SCLK | BSP audio | Output | Active board peripheral | No | BSP and wiki agree |
| 13 | Speaker/audio circuitry | I2S master clock/MCLK | BSP audio | Output | Active board peripheral | No | BSP and wiki agree |
| 14 | Internal C6/ESP-Hosted | SDIO D0 | ForgeUI Wi-Fi hosted | Bidirectional | High-speed shared bus | No | Board profile and sdkconfig.defaults |
| 15 | Internal C6/ESP-Hosted | SDIO D1 | ForgeUI Wi-Fi hosted | Bidirectional | High-speed shared bus | No | Board profile and sdkconfig.defaults |
| 16 | Internal C6/ESP-Hosted | SDIO D2 | ForgeUI Wi-Fi hosted | Bidirectional | High-speed shared bus | No | Board profile and sdkconfig.defaults |
| 17 | Internal C6/ESP-Hosted | SDIO D3 | ForgeUI Wi-Fi hosted | Bidirectional | High-speed shared bus | No | Board profile and sdkconfig.defaults |
| 18 | Internal C6/ESP-Hosted | SDIO CLK | ForgeUI Wi-Fi hosted | Output | High-speed clock | No | Board profile and sdkconfig.defaults |
| 19 | Internal C6/ESP-Hosted | SDIO CMD | ForgeUI Wi-Fi hosted | Bidirectional | High-speed shared bus | No | Board profile and sdkconfig.defaults |
| 20 | Board circuitry; not on general header | Board control net not conclusively identified from extracted schematic text | No explicit ForgeUI assignment | Unknown | Board-connected; unresolved | No | Official schematic shows board connection; requires schematic visual/net confirmation |
| 21 | CAN transceiver / `CAN` connector | TWAI/CAN RX | Board CAN interface; no current ForgeUI driver | Input | Dedicated transceiver connection | No | Waveshare wiki: RXD GPIO21 |
| 22 | CAN transceiver / `CAN` connector | TWAI/CAN TX | Board CAN interface; no current ForgeUI driver | Output | Dedicated transceiver connection | No | Waveshare wiki: TXD GPIO22 |
| 23 | Touch/display area | Touch interrupt/test-point net is indicated by schematic, while BSP declares touch INT `GPIO_NUM_NC` | BSP conflict/unresolved | Input if fitted | Board-revision/BSP mismatch | No | Official schematic vs managed BSP conflict |
| 24 | USB-Serial/JTAG data | Native USB-Serial/JTAG D−/D+ pair (with GPIO25) | Debug/download hardware | Bidirectional USB | Reuse disables USB-JTAG | No | Espressif GPIO documentation; schematic USB nets |
| 25 | USB-Serial/JTAG data | Native USB-Serial/JTAG data pair (with GPIO24) | Debug/download hardware | Bidirectional USB | Reuse disables USB-JTAG | No | Espressif GPIO documentation; schematic USB nets |
| 26 | RS485 transceiver / `RS485` connector | UART TX to RS485 transceiver | Board RS485 interface | Output | Dedicated transceiver connection | No | Waveshare wiki: TXD GPIO26 |
| 27 | RS485 transceiver / `RS485` connector | UART RX from RS485 transceiver | Board RS485 interface | Input | Dedicated transceiver connection | No | Waveshare wiki: RXD GPIO27 |
| 28 | Bottom header `IO28` | No board function or ForgeUI assignment found | Available candidate | Configurable | No P4 strap restriction documented | Yes | Profile/config/BSP search; photo and schematic |
| 29 | Bottom header `IO29` | No board function or ForgeUI assignment found | Available candidate | Configurable | No P4 strap restriction documented | Yes | Profile/config/BSP search; photo and schematic |
| 30 | Bottom header `IO30` | No board function or ForgeUI assignment found | Available candidate | Configurable | No P4 strap restriction documented | Yes | Profile/config/BSP search; photo and schematic |
| 31 | Bottom header `IO31` | No board function or ForgeUI assignment found | Available candidate | Configurable | No P4 strap restriction documented | Yes | Profile/config/BSP search; photo and schematic |
| 32 | Display circuitry | LCD backlight/PWM control | BSP display | Output | Essential display function | No | `BSP_LCD_BACKLIGHT` |
| 33 | Display circuitry | LCD reset | BSP display | Output | Essential display function | No | `BSP_LCD_RST` |
| 34 | Bottom header `IO34` | No active board peripheral found | Unallocated in profile | Configurable | **ESP32-P4 strapping pin** | Yes* | Use only if external circuit cannot disturb reset sampling; Espressif strap list |
| 35 | BOOT / USB-to-UART auto-program circuit | ROM download boot selection | Boot/debug hardware | Input at reset | **Critical strapping/boot pin** | No | Schematic; Espressif boot-mode documentation |
| 36 | Bottom header `IO36`; battery/indicator circuitry | Battery divider/board indicator net shown on schematic | Board hardware | Analog/input/board-defined | **ESP32-P4 strapping pin** and board-connected | No | Photo exposes it; schematic shows BAT/resistor/LED connection; Espressif strap list |
| 37 | UART / USB-to-UART circuitry | P4 UART0 TX (console/programming path) | Console/debug | Output | **ESP32-P4 strapping pin** | No | Official schematic USB-to-UART block; ESP-IDF P4 console convention |
| 38 | UART / USB-to-UART circuitry | P4 UART0 RX (console/programming path) | Console/debug | Input | **ESP32-P4 strapping pin** | No | Official schematic USB-to-UART block; ESP-IDF P4 console convention |
| 39 | TF/SD slot | SDMMC D0 | ForgeUI SD | Bidirectional | 2.5 V LDO-powered SD domain in current profile | No | Profile, defaults, BSP and wiki |
| 40 | TF/SD slot | SDMMC D1 | ForgeUI SD | Bidirectional | 2.5 V LDO-powered SD domain | No | Profile, defaults, BSP and wiki |
| 41 | TF/SD slot | SDMMC D2 | ForgeUI SD | Bidirectional | 2.5 V LDO-powered SD domain | No | Profile, defaults, BSP and wiki |
| 42 | TF/SD slot | SDMMC D3 | ForgeUI SD | Bidirectional | 2.5 V LDO-powered SD domain | No | Profile, defaults, BSP and wiki |
| 43 | TF/SD slot | SDMMC CLK | ForgeUI SD | Output | High-speed clock; 2.5 V domain | No | Profile, defaults, BSP and wiki |
| 44 | TF/SD slot | SDMMC CMD | ForgeUI SD | Bidirectional | 2.5 V domain | No | Profile, defaults, BSP and wiki |
| 45 | TF/SD power circuitry | SD-card power switch/control shown by schematic | Board SD hardware | Output/board-defined | Board-connected | No | Official schematic; not exposed |
| 46 | Board-internal high-speed/power-domain circuitry | Exact board function unresolved | No explicit ForgeUI assignment | Unknown | Board-connected; GPIO39–48 share configurable LDO domain considerations | No | Schematic requires confirmation before any reuse |
| 47 | Board-internal high-speed/power-domain circuitry | Exact board function unresolved | No explicit ForgeUI assignment | Unknown | Board-connected; LDO-domain risk | No | Schematic requires confirmation |
| 48 | Board-internal high-speed/power-domain circuitry | Exact board function unresolved | No explicit ForgeUI assignment | Unknown | Board-connected; LDO-domain risk | No | Schematic requires confirmation |
| 49 | Schematic expansion connector revision only; not matching photographed header | No current ForgeUI assignment | Unallocated but not physically verified | Configurable | Schematic/photo revision mismatch | No | Official PDF lists GPIO49–52 at a 12-pin connector; photo labels GPIO28–36 instead |
| 50 | Schematic expansion connector revision only | No current ForgeUI assignment | Unallocated but not physically verified | Configurable | Schematic/photo revision mismatch | No | Same conflict as GPIO49 |
| 51 | Schematic expansion connector revision only | No current ForgeUI assignment | Unallocated but not physically verified | Configurable | Schematic/photo revision mismatch | No | Same conflict as GPIO49 |
| 52 | Schematic expansion connector revision only | No current ForgeUI assignment | Unallocated but not physically verified | Configurable | Schematic/photo revision mismatch | No | Same conflict as GPIO49 |
| 53 | Speaker/audio circuitry | NS4150B amplifier enable, active high | BSP audio | Output | Can enable a powered load path | No | `BSP_POWER_AMP_IO`; wiki and schematic |
| 54 | Internal C6/ESP-Hosted | ESP32-C6 reset/chip-enable control | ForgeUI Wi-Fi hosted | Output | Reset-critical | No | Board profile and sdkconfig.defaults |

MIPI DSI display data/clock and MIPI CSI camera data/clock use dedicated P4 D-PHY pins, not ordinary numbered GPIOs in this table. Flash/PSRAM are in-package/dedicated memory signals on the ESP32-P4NRW32 design and must never be treated as expansion I/O.

## 4. Connector pinouts

Connector rows below follow the visible silkscreen order in the rear-board photograph (top-to-bottom for the vertical left-side connectors; left-to-right for the bottom header as photographed). Connector pin numbers are deliberately omitted where the PCB does not visibly number them and the schematic symbol orientation is ambiguous.

### Bottom general I/O header

| Physical order | Silkscreen / signal | ESP32-P4 GPIO | Voltage | Direction | Notes |
|---:|---|---:|---|---|---|
| 1 | `3V3` | — | 3.3 V supply | Power out | Do not short or back-drive |
| 2 | `GND` | — | 0 V | Ground | Common reference |
| 3 | `IO2` | 2 | 3.3 V logic | Configurable | Safe candidate |
| 4 | `IO3` | 3 | 3.3 V logic | Configurable | Safe candidate |
| 5 | `IO4` | 4 | 3.3 V logic | Configurable | Safe candidate |
| 6 | `IO5` | 5 | 3.3 V logic | Configurable | Safe candidate |
| 7 | `IO28` | 28 | 3.3 V logic | Configurable | Safe candidate |
| 8 | `IO29` | 29 | 3.3 V logic | Configurable | Safe candidate |
| 9 | `IO30` | 30 | 3.3 V logic | Configurable | Safe candidate |
| 10 | `IO31` | 31 | 3.3 V logic | Configurable | Safe candidate |
| 11 | `IO34` | 34 | 3.3 V logic | Configurable | Strapping pin; restricted |
| 12 | `IO36` | 36 | 3.3 V logic / board analog net | Board-defined | Strapping plus battery/indicator circuitry; do not use |

Evidence: physical PCB photograph for the production silkscreen/order; official schematic and ForgeUI/BSP audit for ownership. The current official PDF's extracted connector net list appears to show GPIO49–52 in a related 12-pin connector where the photographed production PCB instead clearly labels IO34/IO36. Treat the photographed labels as physical truth for Scott's unit, while retaining the electrical restrictions found in the schematic.

### I2C connector

| Silkscreen order | Signal | ESP32-P4 GPIO | Voltage | Direction | Notes |
|---:|---|---:|---|---|---|
| 1 | `SCL` | 8 | 3.3 V logic | Open-drain clock | Shared BSP I2C0 bus |
| 2 | `SDA` | 7 | 3.3 V logic | Bidirectional open-drain | Shared BSP I2C0 bus |
| 3 | `GND` | — | 0 V | Ground | Common ground |
| 4 | `VCC` | — | **3.3 V default; PCB-selectable 5 V/3.3 V** | Power | Photograph shows `5V`/`3V3` selector; verify solder setting before connecting |

The bus has board pull-ups. Attach only address- and voltage-compatible I2C devices. The touch controller, ES8311 codec control, optional DS3231 (`0x68`) and camera control can share this bus.

### UART connector

| Silkscreen order | Signal | ESP32-P4 GPIO | Voltage | Direction (board) | Notes |
|---:|---|---:|---|---|---|
| 1 | `TXD` | 37 | 3.3 V logic | Output | UART0 console/debug path; strapping pin |
| 2 | `RXD` | 38 | 3.3 V logic | Input | UART0 console/debug path; strapping pin |
| 3 | `GND` | — | 0 V | Ground | Common ground |
| 4 | `VCC` | — | UNKNOWN / REQUIRES CONFIRMATION at connector | Power | Do not connect until measured/confirmed |

The official schematic confirms GPIO37/GPIO38 in the USB-to-UART block, but its extracted text does not unambiguously prove the separate header's VCC rail. Do not use this connector as generic GPIO.

### CAN connector

| Silkscreen order | Signal | ESP32-P4 GPIO | Voltage | Direction | Notes |
|---:|---|---:|---|---|---|
| 1 | `+` | 22 through TJA1051 CAN transceiver | Differential bus | Bidirectional bus | CANH |
| 2 | `−` | 21 through TJA1051 CAN transceiver | Differential bus | Bidirectional bus | CANL |
| 3 | `GND` | — | 0 V | Ground | CAN reference |
| 4 | `5V` | — | 5 V supply | Power | Not a GPIO logic voltage |

The connector exposes CANH/CANL, not raw GPIO. P4 GPIO22 is CAN TX into the transceiver; GPIO21 is CAN RX from it. Confirm bus termination requirements before use.

### RS485 connector

| Silkscreen order | Signal | ESP32-P4 GPIO | Voltage | Direction | Notes |
|---:|---|---:|---|---|---|
| 1 | `A` | 26/27 through RS485 transceiver | Differential bus | Bidirectional bus | Transceiver A terminal |
| 2 | `B` | 26/27 through RS485 transceiver | Differential bus | Bidirectional bus | Transceiver B terminal |
| 3 | `GND` | — | 0 V | Ground | Bus reference |
| 4 | `5V` | — | 5 V supply | Power | Not a GPIO logic voltage |

P4 GPIO26 is RS485 UART TX into the transceiver and GPIO27 is RX from it. The connector exposes the transceiver bus, not raw TX/RX GPIO.

## 5. Reserved / do not casually use

- **ESP-Hosted/C6 SDIO:** GPIO14–GPIO19; **C6 reset:** GPIO54; **C6 auxiliary connection:** GPIO6.
- **TF/SD:** GPIO39–GPIO44, plus board SD power/control circuitry associated with GPIO45 and the configured internal LDO channel 4 at 2500 mV.
- **Current BSP I2C/touch/RTC/audio-control/camera-control bus:** GPIO7 (SDA) and GPIO8 (SCL). External compatible I2C devices may share the labeled connector; these are not free GPIOs.
- **Audio:** GPIO9–GPIO13 and amplifier enable GPIO53.
- **CAN:** GPIO21 RX and GPIO22 TX, already connected to the onboard TJA1051 transceiver.
- **RS485:** GPIO26 TX and GPIO27 RX, already connected to the onboard RS485 transceiver.
- **Display:** GPIO32 backlight control and GPIO33 reset; MIPI DSI dedicated pins.
- **Touch:** shared I2C GPIO7/8; schematic indicates GPIO23 for an interrupt/test point while the current BSP declares touch interrupt and reset unconnected. Keep GPIO23 reserved pending board-revision confirmation.
- **USB/debug/boot:** GPIO24/25 USB-Serial/JTAG; GPIO35 boot selection and auto-program circuit; GPIO37/38 UART0 and strapping. Keep all away from experiments.
- **Other strapping pins:** GPIO34 and GPIO36 are accessible but sampled at reset. GPIO36 is additionally board-connected and is not a candidate. GPIO34 is restricted.
- **Board-internal/unresolved nets:** GPIO20 and GPIO46–GPIO52. Do not use without schematic/net and physical-revision confirmation.
- **MIPI CSI camera and MIPI DSI display:** dedicated high-speed D-PHY pins and connectors; never repurpose.
- **Flash/PSRAM:** dedicated/in-package memory signals; never repurpose or probe as GPIO.

## 6. General-purpose I/O candidate table

| GPIO | Classification | Reason / evidence |
|---:|---|---|
| 2 | **SAFE GENERAL I/O** | Physically exposed; no ownership found in board profile, effective/default config, BSP, firmware or official schematic beyond header routing; not a P4 strap |
| 3 | **SAFE GENERAL I/O** | Same as GPIO2 |
| 4 | **SAFE GENERAL I/O** | Same as GPIO2 |
| 5 | **SAFE GENERAL I/O** | Same as GPIO2 |
| 28 | **SAFE GENERAL I/O** | Physically exposed; no current board/ForgeUI ownership found; not a P4 strap |
| 29 | **SAFE GENERAL I/O** | Same as GPIO28 |
| 30 | **SAFE GENERAL I/O** | Same as GPIO28 |
| 31 | **SAFE GENERAL I/O** | Same as GPIO28 |
| 34 | **SAFE WITH RESTRICTION** | ESP32-P4 strapping pin. An attached circuit must not drive or bias it incorrectly during reset; validate the chosen input/output circuit and boot state first |
| 36 | **CURRENTLY OWNED** | Exposed, but is a P4 strapping pin and the official schematic connects it to battery/indicator circuitry; not suitable for Proof #1 |

“Safe” here means no conflicting ownership was found in the audited baseline; it is not permission to exceed the ESP32-P4 electrical limits. Re-run the audit after any Project Hardware Profile, BSP, board revision or firmware configuration change.

## 7. Hardware I/O Proof allocation register

| Proof | Purpose | GPIO | Direction | Hardware | Status |
|---|---|---:|---|---|---|
| Hardware I/O Proof #1 | Physical button input | TBD | Input | Momentary pushbutton | NOT ALLOCATED |
| Hardware I/O Proof #1 | Physical LED output | TBD | Output | LED + resistor | NOT ALLOCATED |

No pin is allocated merely by appearing in the candidate table. Allocation requires a proof-specific wiring review.

## 8. Electrical rules

- ESP32-P4 GPIO uses **3.3 V logic**. Never apply 5 V directly to a GPIO.
- Join the external circuit and board with a common GND.
- Fit a suitable current-limiting resistor in series with every external LED.
- Do not drive a relay, motor, solenoid, high-power lamp or other load directly from a GPIO. Use a correctly rated transistor, MOSFET or driver, with flyback protection where applicable.
- Before using an input, check internal/external pull-up or pull-down needs and confirm it cannot disturb a strapping level during reset.
- Never assume a connector `VCC` pin is 3.3 V. The I2C connector is selectable and CAN/RS485 expose 5 V power; confirm the rail before wiring.
- Check ESP32-P4 source/sink current, peripheral conflicts, initial/high-impedance state and attached board circuitry for the specific proof before connection.
- Power down before changing wiring. Do not back-power the board through a GPIO or connector signal.

## 9. Source / evidence record

### Repository evidence audited

- **ForgeUI Project Hardware Profile:** `studio/src/forgeui/boards/profiles/waveshareEsp32P4Wifi6Touch7B.ts` — identity, 1024×600 geometry, feature capability/defaults, hosted-SDIO and SDMMC allocation, BSP component.
- **ForgeUI firmware configuration:** `firmware/ForgeUI-One/sdkconfig.defaults` and effective `firmware/ForgeUI-One/sdkconfig` — ESP-Hosted GPIO14–19/GPIO54 and SDMMC GPIO39–44 settings.
- **ForgeUI project Kconfig/runtime:** `firmware/ForgeUI-One/main/Kconfig.projbuild`, `40_SD.c`, `20_RTC.c`, `00_ForgeUI_Config.h`, `main.c`, and `30_Audio.c` — SD configuration, BSP-owned I2C bus/DS3231 use, display/backlight and audio integration.
- **Waveshare managed BSP header/source:** `firmware/ForgeUI-One/managed_components/waveshare__esp32_p4_wifi6_touch_lcd_7b/include/bsp/esp32_p4_wifi6_touch_lcd_7b.h` and `esp32_p4_wifi6_touch_lcd_7b.c` — I2C GPIO7/8, I2S GPIO9–13, amp GPIO53, backlight GPIO32, reset GPIO33, touch NC declarations and SD pins.
- **ForgeUI BSP extension:** `firmware/ForgeUI-One/components/bsp_extra/` — current audio wrapper ownership.
- **Physical PCB evidence:** rear-board photograph at the repository path in §2 — product/resolution markings and accessible connector/silkscreen layout.

### External authoritative evidence audited

- [Waveshare product wiki](https://www.waveshare.com/wiki/ESP32-P4-WIFI6-Touch-LCD-7B) — board identity; I2C GPIO7/8; SDMMC GPIO39–44; ESP32-C6 hosted arrangement; audio, RS485 GPIO26/27 and CAN GPIO21/22 mappings.
- [Waveshare official schematic PDF](https://files.waveshare.com/wiki/ESP32-P4-WIFI6-Touch-LCD-7B/ESP32-P4-WIFI6-Touch-LCD-7B.pdf) — connector circuitry, USB/debug, C6, audio, CAN/RS485, display/touch, battery and header nets.
- [Waveshare official example repository](https://github.com/waveshareteam/ESP32-P4-WIFI6-Touch-LCD-7B) — product example baseline and official wiki linkage.
- [Espressif ESP32-P4 GPIO documentation](https://docs.espressif.com/projects/esp-idf/en/stable/esp32p4/api-reference/peripherals/gpio.html) — GPIO34–38 strapping status and GPIO24/25 USB-JTAG default use.
- [Espressif ESP32-P4 boot-mode documentation](https://docs.espressif.com/projects/esptool/en/latest/esp32p4/advanced-topics/boot-mode-selection.html) — GPIO35 boot/download behavior.

### Conflicts and unresolved evidence

1. **Audio data directions:** the current managed BSP defines GPIO9 as `BSP_I2S_DOUT` and GPIO11 as `BSP_I2S_DSIN`; the current Waveshare wiki table describes GPIO9 as DSDIN and GPIO11 as ASDOUT. ForgeUI follows its compiled BSP. Do not rewire or reinterpret these pins until Waveshare resolves the documentation mismatch.
2. **Touch interrupt/reset:** the schematic extraction indicates a GPIO23 interrupt/test-point connection, while the current managed BSP defines touch reset and interrupt as `GPIO_NUM_NC`. GPIO23 remains reserved and unresolved.
3. **Production header versus schematic connector:** Scott's production PCB photograph clearly labels the bottom header `3V3 GND IO2 IO3 IO4 IO5 IO28 IO29 IO30 IO31 IO34 IO36`. The current official schematic PDF's extracted 12-pin connector region also presents GPIO49–52 nets in a way that cannot be reconciled confidently with that production silkscreen. The photograph establishes physical availability; it does not erase schematic electrical warnings, particularly GPIO36's battery/indicator connection.
4. **UART VCC and exact independent-header wiring:** GPIO37/38 are proven in the USB-to-UART/console circuit and correspond to P4 UART0 TX/RX, but the separate labeled header VCC rail is not unambiguous in extracted schematic text. Measure/confirm it before use.
5. **GPIO20 and GPIO46–52:** board connections appear in the schematic, but their exact production-board roles were not proven sufficiently for external use. They remain reserved/unknown.

## 10. Document ownership rule

`11_ESP32_P4_WIFI6_TOUCH_7B_BOARD_PINOUT_MASTER.md` is the human-readable ForgeUI hardware I/O reference.

The Project Hardware Profile remains authoritative for generated export configuration.

If the board profile changes, this document must be reviewed and aligned.

## 11. Audit conclusion

- Current unrestricted general-I/O candidates: **GPIO2, GPIO3, GPIO4, GPIO5, GPIO28, GPIO29, GPIO30 and GPIO31**.
- Restricted candidate: **GPIO34**, because it is a strapping pin.
- Do not use header GPIO36: it is a strapping pin and is tied to board battery/indicator circuitry in the official schematic.
- At least two unrestricted GPIOs are available for Hardware I/O Proof #1, but **none have been allocated** in this document.
- Hardware I/O Proof #1 remains **NOT ALLOCATED** and is not proven.
