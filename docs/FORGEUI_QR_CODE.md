# ForgeUI QR Code widget

ForgeUI's QR Code is a standard Display widget backed by LVGL 9.2's native
`lv_qrcode` implementation. The Canvas and Browser Preview share one
deterministic SVG module renderer; exported firmware creates the code with
`lv_qrcode_create`.

## Inspector

- Drag **QR Code** onto the Canvas, select it, then choose a **Content Type**
  and edit its fields in the component Inspector. This configuration belongs
  to the selected component, not global Settings or the Theme Manager.
- Supported content types are Plain Text, Website URL, Wi-Fi, Email, Phone,
  SMS, and Custom.
- Website URLs are encoded exactly as entered; ForgeUI does not add or remove
  a protocol.
- Custom payloads are encoded unchanged.
- **Foreground Colour** and **Background Colour** optionally override the
  current theme's semantic accent and surface colours.
- The installed LVGL 9.2.2 `lv_qrcode_update()` layout is authoritative:
  no synthetic four-module quiet zone is added. Canvas and Browser Preview
  mirror LVGL's integer module scale and centered remainder pixels.
- Width and height remain editable with the standard geometry controls. LVGL
  QR codes are square, so export uses the smaller dimension.

Keep strong foreground/background contrast for reliable scanning.

### Payload formats

- Plain Text: the entered text.
- Website URL: the entered URL, unchanged.
- Wi-Fi:
  `WIFI:T:<WPA|WEP|nopass>;S:<ssid>;P:<password>;H:<true|false>;;`
- Email: `mailto:<address>?subject=<encoded subject>&body=<encoded message>`.
- Phone: `tel:<number>`.
- SMS: `sms:<number>?body=<encoded message>`.
- Custom: the raw payload, unchanged.

Wi-Fi example:

```text
WIFI:T:WPA;S:ExampleNetwork;P:ExamplePassword;H:false;;
```

Wi-Fi values escape `\`, `;`, `,`, `:`, and `"` with a preceding backslash.
Email query fields and SMS message bodies use URI percent encoding.

Missing required content displays an Inspector warning but does not prevent
saving or exporting.

## Rendering pipeline and parity decision

- Studio Canvas and Browser Preview both render
  `StandardQRCodePreview.tsx`. They previously used the npm `qrcode` matrix
  with an additional four-module SVG quiet zone.
- `ForgeUILvglExport.ts` and the generated ESP32-P4 runtime use LVGL 9.2.2's
  native `lv_qrcode_create()` and `lv_qrcode_update()`.
- LVGL 9.2.2 has no quiet-zone setter. It uses the largest whole-pixel module
  scale that fits and centers any remainder pixels in its square canvas.

Those two configurations caused the visible border mismatch. The shared
`ForgeUIStandardQRCode.ts` geometry now makes Canvas, Browser Preview and the
exporter follow the native LVGL sizing contract. The same module also owns
`resolveQRCodePayload()`, so every rendering path encodes the same Inspector
configuration. The unsupported quiet-zone property and inspector control
remain absent.

Projects created before Content Type was introduced remain compatible. When
`contentType` is absent, the existing `qrText` value is treated as Custom and
is preserved exactly. Loading does not destructively rewrite project data.

## Generated API

A component named `QR_Code` generates:

```c
void FG_Set_QR_Code_Text(const char * text);
```

Calling it regenerates the native QR modules at runtime. A `NULL` pointer is
treated as an empty string. Inspector configuration supplies the static
startup value; the setter changes only that QR object and preserves its
geometry and colours.

`90_Studio_Export.c` owns generated object creation, the static startup
payload, and the generated setter. Developer event logic belongs in
`95_UserEvents.c`; it may call the public setter but must not edit generated
object construction.

## Firmware requirement

`CONFIG_LV_USE_QRCODE=y` is enabled in both the checked-in active configuration
and `sdkconfig.defaults`. LVGL supplies the bundled QR encoder; ForgeUI does not
export raster QR artwork.

## Hardware validation

Generated C inspection, the clean ESP-IDF build, correct ESP32-P4 display,
successful mobile-phone scan and matching Live/Standalone behavior are complete.
QR Code is **PROVEN**.

Software tests verify registry insertion, vector previews, native generated C,
runtime API generation, persistence-compatible component data, and the LVGL
configuration. The Batch D physical record includes export, build, flash,
real-display scanning and Live/Standalone parity.
