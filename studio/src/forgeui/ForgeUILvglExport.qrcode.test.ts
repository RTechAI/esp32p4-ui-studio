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
    expect(generated.code).toContain('lv_obj_set_pos(obj1, 20, 40);')
    expect(generated.code).toContain(
      'lv_qrcode_set_dark_color(obj1, lv_color_hex(0x102030));',
    )
    expect(generated.code).toContain(
      'lv_qrcode_set_light_color(obj1, lv_color_hex(0xF0F1F2));',
    )
    expect(generated.code).toContain(
      'lv_qrcode_update(obj1, "https://forgeui.co.nz/device/42", strlen("https://forgeui.co.nz/device/42"));',
    )
    expect(generated.code).not.toContain('lv_qrcode_set_data')
    expect(generated.code).not.toContain('lv_qrcode_set_quiet_zone')
    expect(generated.code).toContain(
      'void FG_Set_QR_Code_Text(const char * text)',
    )
    expect(generated.code).toContain(
      'lv_qrcode_update(fg_qr_code_qrcode, qr_text, strlen(qr_text));',
    )
    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_QR_Code_Text(const char * text);',
    )
  })

  it('coerces persisted string geometry before centering the native QR object', () => {
    const persistedComponents: IComponents = {
      ...components,
      qr: {
        ...components.qr,
        props: {
          ...components.qr.props,
          x: '647',
          y: '131',
          w: '220',
          h: '180',
        },
      },
    }

    const generated = generateForgeUILvglCode(
      persistedComponents,
      'graphite',
      undefined,
      { includeThemeTexture: false },
    )

    expect(generated.code).toContain(
      'fg_qr_code_qrcode = lv_qrcode_create(fg_application_page);',
    )
    expect(generated.code).toContain('lv_obj_set_pos(obj1, 667, 131);')
    expect(generated.code).toContain('lv_qrcode_set_size(obj1, 180);')
    expect(generated.code).toContain(
      'lv_qrcode_update(obj1, "https://forgeui.co.nz/device/42", strlen("https://forgeui.co.nz/device/42"));',
    )
    expect(generated.code).not.toContain('lv_obj_set_pos(obj1, 64720, 1310);')
    expect(generated.code).not.toContain('quietZone')
  })

  it('uses the shared resolved Wi-Fi payload without changing QR geometry', () => {
    const wifiComponents: IComponents = {
      ...components,
      qr: {
        ...components.qr,
        props: {
          ...components.qr.props,
          contentType: 'wifi',
          qrWifiSSID: 'Office;Guest',
          qrWifiPassword: 'pass:word',
          qrWifiSecurity: 'WPA',
          qrWifiHidden: true,
          x: '647',
          y: '131',
          w: '180',
          h: '220',
        },
      },
    }

    const generated = generateForgeUILvglCode(
      wifiComponents,
      'graphite',
      undefined,
      { includeThemeTexture: false },
    )

    expect(generated.code).toContain('lv_obj_set_pos(obj1, 647, 151);')
    expect(generated.code).toContain('lv_qrcode_set_size(obj1, 180);')
    expect(generated.code).toContain(
      'lv_qrcode_update(obj1, "WIFI:T:WPA;S:Office\\\\;Guest;P:pass\\\\:word;H:true;;",',
    )
    expect(generated.code).toContain(
      'void FG_Set_QR_Code_Text(const char * text)',
    )
    expect(generated.code).toContain(
      'lv_qrcode_update(fg_qr_code_qrcode, qr_text, strlen(qr_text));',
    )
    expect(generated.code).not.toContain('quietZone')
  })

  it('allocates collision-safe runtime APIs for multiple named instances', () => {
    const second = {
      ...components.qr,
      id: 'qr-2',
      componentName: 'QR Code',
      props: {
        ...components.qr.props,
        x: 240,
        qrText: 'https://forgeui.co.nz/device/43',
      },
    }
    const third = {
      ...components.qr,
      id: 'qr-3',
      componentName: 'QR-Code',
      props: {
        ...components.qr.props,
        x: 460,
        qrText: 'https://forgeui.co.nz/device/44',
      },
    }
    const generated = generateForgeUILvglCode({
      ...components,
      qr: {
        ...components.qr,
        componentName: 'QR Code',
      },
      root: {
        ...components.root,
        children: ['qr', second.id, third.id],
      },
      [second.id]: second,
      [third.id]: third,
    }, 'graphite', undefined, { includeThemeTexture: false })

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_QRCode_Text(const char * text);',
      'void FG_Set_QRCode_2_Text(const char * text);',
      'void FG_Set_QRCode_3_Text(const char * text);',
    ]))
    expect(generated.code).toContain(
      'static lv_obj_t * fg_qrcode_2_qrcode = NULL;',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_qrcode_3_qrcode = NULL;',
    )
  })
})
