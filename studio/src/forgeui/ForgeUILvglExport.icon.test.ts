import { generateForgeUILvglCode } from './ForgeUILvglExport'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from './ForgeUIUploadedAssetRegistry'

const generate = (...icons: IComponent[]) => generateForgeUILvglCode({
  root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: icons.map(icon => icon.id) },
  ...Object.fromEntries(icons.map(icon => [icon.id, icon])),
}, 'graphite', undefined, { includeThemeTexture: false })

const icon = (id: string, props: Record<string, unknown> = {}): IComponent => ({
  id, parent: 'root', type: 'Icon', componentName: id,
  props: { x: 40, y: 50, w: 96, h: 96, icon: 'FiSettings', boxSize: 64, ...props },
  children: [],
})

describe('Standard Icon LVGL export', () => {
  afterEach(() => forgeUIClearUploadedAssets())

  it('uses the bundled settings asset without an external proof dependency', () => {
    const generated = generate(icon('Proof Icon', { color: '#22D3EE', opacity: 75 }))
    expect(generated.assetSources).toContain('assets/icons/fg_icon_settings_fi_48px.c')
    expect(generated.code).toContain('lv_image_create(fg_application_page)')
    expect(generated.code).toContain('&fg_icon_settings_fi_48px')
    expect(generated.code).toContain('lv_obj_set_pos(obj1, 40, 50);')
    expect(generated.code).toContain('lv_obj_set_size(obj1, 96, 96);')
    expect(generated.code).toContain('lv_image_set_inner_align(obj1, LV_IMAGE_ALIGN_CENTER);')
    expect(generated.code).toContain('lv_image_set_scale(obj1, 341);')
    expect(generated.code).toContain('lv_image_set_pivot(obj1, 24, 24);')
    expect(generated.code).toContain('lv_color_hex(0x22D3EE)')
    expect(generated.code).toContain('lv_obj_set_style_opa(obj1, 191, 0);')
  })

  it('fits the 48 px native source to resized bounds when no explicit icon size exists', () => {
    const generated = generate(icon('resized', { boxSize: undefined, w: 96, h: 80 }))
    expect(generated.code).toContain('&fg_icon_settings_fi_48px')
    expect(generated.code).toContain('lv_obj_set_size(obj1, 96, 80);')
    expect(generated.code).toContain('lv_image_set_scale(obj1, 395);')
    expect(generated.code).toContain('lv_image_set_pivot(obj1, 24, 24);')
    expect(generated.code).toContain('lv_image_set_inner_align(obj1, LV_IMAGE_ALIGN_CENTER);')
  })

  it('fits a 64 px uploaded source to the same automatic preview target', () => {
    forgeUIAddUploadedAssets([{
      id: 'airplay',
      name: 'FiAirplay',
      type: 'image/png',
      size: 16384,
      createdAt: 1,
      browserSrc: 'http://localhost:3030/forgeui-assets/uploads/airplay.png',
      kind: 'uploaded',
      exportStatus: 'lvgl_ready',
      lvgl: 'fg_upload_fiairplay_test',
      cFile: 'assets/uploads/fg_upload_fiairplay_test.c',
      width: 64,
      height: 64,
    }])
    const generated = generate(icon('airplay', {
      icon: 'FiAirplay',
      boxSize: undefined,
      w: 96,
      h: 80,
      uploadedAssetId: 'airplay',
      src: 'http://localhost:3030/forgeui-assets/uploads/airplay.png',
    }))
    expect(generated.code).toContain('&fg_upload_fiairplay_test')
    expect(generated.code).toContain('lv_image_set_scale(obj1, 296);')
    expect(generated.code).toContain('lv_image_set_pivot(obj1, 32, 32);')
    expect(generated.code).toContain('lv_obj_set_size(obj1, 96, 80);')
    expect(generated.code).toContain('LV_IMAGE_ALIGN_CENTER')
  })

  it('migrates a persisted legacy Icon Selector asset without stored dimensions', () => {
    forgeUIAddUploadedAssets([{
      id: 'legacy-airplay', name: 'FiAirplay.png', type: 'image/png', size: 1,
      createdAt: 1, browserSrc: 'http://localhost:3030/forgeui-assets/uploads/airplay.png',
      kind: 'uploaded', exportStatus: 'lvgl_ready', lvgl: 'fg_legacy_airplay',
      cFile: 'assets/uploads/fg_legacy_airplay.c',
    }])
    const generated = generate(icon('legacy selector', {
      icon: 'FiAirplay', boxSize: undefined, w: 48, h: 48,
      uploadedAssetId: 'legacy-airplay',
    }))
    expect(generated.code).toContain('lv_image_set_scale(obj1, 176);')
    expect(generated.code).toContain('lv_image_set_pivot(obj1, 32, 32);')
  })

  it('keeps multiple instances independent with runtime APIs but no default events', () => {
    const generated = generate(icon('first'), icon('second', { x: 180, icon: 'FiWifi' }))
    expect(generated.code).toContain('lv_obj_t * obj1 = lv_image_create')
    expect(generated.code).toContain('lv_obj_t * obj2 = lv_label_create')
    expect(generated.code).toContain('LV_SYMBOL_WIFI')
    expect(generated.fiRuntimeHeader).toContain('FG_Set_First_Visible')
    expect(generated.fiRuntimeHeader).toContain('FG_Set_Second_Color')
    expect(generated.userEventHooks).toEqual([])
  })

  it('emits one deterministic block for Live and Standalone consumers', () => {
    const proofIcon = icon('parity', {
      boxSize: undefined,
      w: 96,
      h: 80,
      color: '#22D3EE',
      opacity: 75,
    })
    const live = generate(proofIcon)
    const standalone = generate(proofIcon)
    expect(standalone.code).toBe(live.code)
    expect(standalone.assetSources).toEqual(live.assetSources)
  })

  it('rejects an unsupported legacy icon instead of exporting a placeholder', () => {
    expect(() => generate(icon('legacy', { icon: 'FiCamera' }))).toThrow(
      'Icon FiCamera requires a converted LVGL asset; refusing placeholder export.',
    )
  })
})
