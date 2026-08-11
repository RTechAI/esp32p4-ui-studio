# ForgeUI Device Console

## Overview

The ForgeUI Device Console brings the embedded development loop closer to the visual design environment: **design, build, flash, monitor, and inspect hardware**. It is a collapsible, vertically resizable bottom dock below the complete Studio workspace. Widgets, Canvas, and Inspector resize above it, and the console is never part of the Canvas or exported interface.

The three tabs have separate responsibilities:

- **BUILD** shows the existing ESP-IDF Build & Flash workflow.
- **MONITOR** shows authoritative raw serial output from one backend-owned connection.
- **I/O** derives a read-only summary from explicit patterns in that same raw output.

ForgeUI integrates ESP-IDF; it does not replace ESP-IDF, Visual Studio Code, or a general-purpose debugger.

## Opening the Device Console

Use **Console** in the Studio toolbar to open or collapse the dock. Drag the divider at its upper edge to change its height. Collapsing the dock does not stop a build or serial connection.

Starting **Build & Flash** or **Clean Build & Flash** opens the console automatically with **BUILD** selected.

## BUILD

BUILD preserves the proven ForgeUI build and flash pipeline and presents its output inside the Studio. It provides live ESP-IDF compilation and flash output, running/completion status, automatic scrolling, **Clear**, and explicit **Stop**. The existing ESP-IDF commands, board configuration, export validation, and firmware generation remain authoritative underneath this view.

## MONITOR

MONITOR is a live raw serial terminal owned by the local ForgeUI backend, not browser Web Serial.

1. Open **MONITOR**.
2. Choose **Refresh** if the required port is not listed.
3. Select the intended Windows COM port.
4. Keep the default **115200** baud unless the device uses another rate.
5. Choose **Connect**.

MONITOR provides port enumeration, selectable baud, Connect, Disconnect, Refresh, Clear, auto-scroll, and connection/error state. It preserves device text without interpreting or filtering it. The current backend uses approximately 500 ms polling and keeps a bounded 256 KiB serial buffer; these are current architecture details, not public API guarantees.

### Build/Flash port handoff

ForgeUI prevents MONITOR and ESP-IDF flashing from competing for the same COM port:

1. ForgeUI records whether MONITOR was connected.
2. It closes and releases the serial port and waits for closure.
3. The existing ESP-IDF flash operation runs.
4. After a successful flash, ForgeUI attempts to reconnect the previous port and baud.

If release fails, flashing does not start with competing port ownership. If reconnection fails after a successful flash, the flash remains successful and MONITOR reports a separate, non-fatal error.

## I/O

I/O is a **read-only interpretation layer**. It shares MONITOR's serial status and raw log; it does not open another connection, own the COM port, send commands, control hardware, change firmware, or replace MONITOR.

Only explicitly recognised values are shown. Current categories can include:

- **SYSTEM:** boot/reset and explicitly logged heap/internal memory;
- **NETWORK:** Wi-Fi state, IPv4 address, and explicitly logged RSSI;
- **STORAGE:** explicit SD READY, DISABLED, FAIL, or ERROR state;
- **GPIO:** explicit HIGH or LOW messages;
- **GPS:** explicit fix, satellite, and labelled coordinate values;
- **I2C:** explicitly reported addresses and names only when the runtime supplies a name;
- **UART:** explicit RX or TX activity; and
- **CAN:** explicitly labelled state, count, ID, or data summaries.

Unknown and malformed lines are ignored safely. The parser examines a bounded recent window and keeps latest state per identity rather than unbounded history. It does not mutate MONITOR output. If nothing is recognised, use MONITOR for the complete raw text.

The I/O view is **IMPLEMENTED / TESTED**, but live structured I/O presentation has not yet been recorded as physically proven. No ForgeUI telemetry protocol has been released. A future versioned format could provide more authoritative structured insight without changing MONITOR's raw-output role.

## Troubleshooting

### Port does not appear

- Choose **Refresh**.
- Check the USB connection and USB/UART driver.
- Confirm Windows has enumerated the expected COM port.
- Ensure another serial terminal is not holding the port.

### Access denied or port busy

Close other serial monitors or terminals using the port, then retry. ForgeUI deliberately avoids opening a duplicate connection.

### No MONITOR output

Verify the selected COM port and baud. Reset the device if appropriate. Some devices emit output only during boot or application events.

### I/O is empty

Confirm MONITOR is receiving data. I/O displays only recognised, explicit runtime patterns; it does not guess state or decode arbitrary output. MONITOR remains the complete source.

### MONITOR does not reconnect after flashing

The flash may still have completed successfully. Refresh the port list if USB enumeration changed, select the port if necessary, and reconnect manually.

## Physical proof status

- Device Console shell, layout containment, Build & Flash, physical flash, and board reset: **PHYSICALLY PROVEN on ESP32-P4**.
- Live MONITOR on COM5 at 115200 with ESP32-P4 output visible in Studio: **PHYSICALLY PROVEN**.
- Read-only I/O parsing and presentation: **IMPLEMENTED / TESTED; physical live I/O-view proof not yet recorded**.

## Future “Under the Hood” evidence

This guide is the natural home for a future evidence sequence showing visual design, BUILD, FLASH, MONITOR, I/O, and the physical ESP32-P4 result. Add only genuine screenshots captured from the proven workflow; do not substitute mock hardware evidence.
