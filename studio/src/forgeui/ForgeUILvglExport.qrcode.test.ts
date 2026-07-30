import { generateForgeUILvglCode } from './ForgeUILvglExport'

const components: IComponents = {
  root: {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: ['qr'],
  },
  qr: {
    id: 'qr',
    parent: 'root',
    type: 'QRCode',
    componentName: 'QR_Code',
    props: {
      x: 20,
      y: 30,
      w: 180,
      h: 200,
      qrText: 'https://forgeui.co.nz/device/42',
      qrForeground: '#102030',
      qrBackground: '#f0f1f2',
      qrQuietZone: true,
    },
    children: [],
  },
}

describe('QRCode LVGL export', () => {
  it('uses the native LVGL 9.2 QR widget and exposes runtime text updates', () => {
    const generated = generateForgeUILvglCode(
      components,
      'graphite',
      undefined,
      { includeThemeTexture: false },
    )

    expect(generated.code).toContain(
      'fg_qr_code_qrcode = lv_qrcode_create(fg_application_page);',
    )
    expect(generated.code).toContain('lv_qrcode_set_size(obj1, 180);')
    expect(generated.code).toContain(
      'lv_qrcode_set_dark_color(obj1, lv_color_hex(0x102030));',
    )
    expect(generated.code).toContain(
      'lv_qrcode_set_light_color(obj1, lv_color_hex(0xF0F1F2));',
    )
    expect(generated.code).toContain(
      'lv_qrcode_set_data(obj1, "https://forgeui.co.nz/device/42");',
    )
    expect(generated.code).toContain(
      'lv_qrcode_set_quiet_zone(obj1, true);',
    )
    expect(generated.code).toContain(
      'void FG_Set_QR_Code_Text(const char * text)',
    )
    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_QR_Code_Text(const char * text);',
    )
  })
})
