# ForgeUI QR Code widget

ForgeUI's QR Code is a standard Display widget backed by LVGL 9.2's native
`lv_qrcode` implementation. The Canvas and Browser Preview share one
deterministic SVG module renderer; exported firmware creates the code with
`lv_qrcode_create`.

## Inspector

- **QR Text** controls the encoded payload.
- **Foreground Colour** and **Background Colour** optionally override the
  current theme's semantic accent and surface colours.
- **Padding (Quiet Zone)** maps directly to `lv_qrcode_set_quiet_zone`.
- Width and height remain editable with the standard geometry controls. LVGL
  QR codes are square, so export uses the smaller dimension.

Keep strong foreground/background contrast for reliable scanning.

## Generated API

A component named `QR_Code` generates:

```c
void FG_Set_QR_Code_Text(const char * text);
```

Calling it regenerates the native QR modules at runtime. A `NULL` pointer is
treated as an empty string.

Useful test payloads:

```text
https://forgeui.co.nz
WIFI:T:WPA;S:ExampleNetwork;P:ExamplePassword;;
```

The Wi-Fi example contains placeholder credentials only.

## Firmware requirement

`CONFIG_LV_USE_QRCODE=y` is enabled in both the checked-in active configuration
and `sdkconfig.defaults`. LVGL supplies the bundled QR encoder; ForgeUI does not
export raster QR artwork.

## Hardware validation

Software tests verify registry insertion, vector previews, native generated C,
runtime API generation, persistence-compatible component data, and the LVGL
configuration. Physical scan validation still requires exporting, building,
flashing the target ESP32-P4 board, and scanning both a URL and Wi-Fi payload
from the real display.
