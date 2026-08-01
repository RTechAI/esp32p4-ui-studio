import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { forgeUIAddUploadedAssets, forgeUIClearUploadedAssets } from './ForgeUIUploadedAssetRegistry'

const component = (id: string, type: ComponentType, props: any): IComponent => ({ id, type, parent: 'root', componentName: id, props: { x: 10, y: 20, w: 120, h: 80, ...props }, children: [] })
const generate = (...items: IComponent[]) => generateForgeUILvglCode({ root: { id: 'root', type: 'Box', parent: 'root', props: {}, children: items.map(item => item.id) }, ...Object.fromEntries(items.map(item => [item.id, item])) }, 'graphite', undefined, { includeThemeTexture: false })

describe('LVGL closure batch 1', () => {
  beforeEach(() => forgeUIAddUploadedAssets(['one','two','pressed','disabled'].map((id, index) => ({ id, name: `${id}.png`, type: 'image/png', size: 1, createdAt: index, browserSrc: `/assets/${id}.png`, kind: 'uploaded' as const, exportStatus: 'lvgl_ready' as const, lvgl: `fg_${id}`, cFile: `assets/fg_${id}.c`, width: 64, height: 64 }))))
  afterEach(() => forgeUIClearUploadedAssets())

  it('exports native spans and animation frames', () => {
    const generated = generate(
      component('rich', 'Span', { spans: [{ text: 'Hello', semanticColor: 'accent', fontSize: 20, underline: true }] }),
      component('motion', 'AnimImage', { frameAssetIds: ['one','two'], frameDuration: 100, loop: true, autoStart: true }),
    )
    expect(generated.code).toContain('lv_spangroup_create')
    expect(generated.code).toContain('lv_span_set_text')
    expect(generated.code).toContain('lv_animimg_set_src')
    expect(generated.code).toContain('static const void * obj2_frames[] = { &fg_one, &fg_two }')
    expect(generated.code).toContain('lv_animimg_set_duration(obj2, 200)')
    expect(generated.assetSources).toEqual(expect.arrayContaining(['assets/fg_one.c','assets/fg_two.c']))
  })

  it('exports multiple rich-text instances with ordered native styles', () => {
    const generated = generate(
      component('first_span', 'Span', { textAlign: 'center', overflow: 'clip', spans: [
        { id: 'one', text: 'One ', semanticColor: 'textPrimary', fontSize: 16 },
        { id: 'two', text: 'Two', semanticColor: 'accent', color: '#123456', fontSize: 24, underline: true },
      ] }),
      component('second_span', 'Span', { textAlign: 'right', overflow: 'ellipsis', spans: [
        { id: 'three', text: 'Three', semanticColor: 'textSecondary', fontSize: 14 },
      ] }),
    )
    expect(generated.code.match(/lv_spangroup_create/g)).toHaveLength(2)
    expect(generated.code).toContain('lv_spangroup_set_align(obj1, LV_TEXT_ALIGN_CENTER)')
    expect(generated.code).toContain('lv_spangroup_set_overflow(obj1, LV_SPAN_OVERFLOW_CLIP)')
    expect(generated.code).toContain('lv_span_set_text(obj1_span_0, "One ")')
    expect(generated.code).toContain('lv_span_set_text(obj1_span_1, "Two")')
    expect(generated.code).toContain('lv_color_hex(0x123456)')
    expect(generated.code).toContain('LV_TEXT_DECOR_UNDERLINE')
    expect(generated.code).toContain('lv_spangroup_set_align(obj2, LV_TEXT_ALIGN_RIGHT)')
    expect(generated.code).toContain('lv_spangroup_set_overflow(obj2, LV_SPAN_OVERFLOW_ELLIPSIS)')
  })

  it('exports a theme-consistent zero-frame placeholder without creating animimg', () => {
    const generated = generate(component('empty_motion', 'AnimImage', { frameAssetIds: [] }))
    expect(generated.code).toContain('lv_label_set_text(obj1_label, "Add animation frames")')
    expect(generated.code).toContain('lv_obj_set_style_bg_opa(obj1, LV_OPA_TRANSP')
    expect(generated.code).toContain('lv_obj_set_style_border_width(obj1, 1')
    expect(generated.code).toContain('lv_obj_clear_flag(obj1, LV_OBJ_FLAG_SCROLLABLE)')
    expect(generated.code).not.toContain('lv_animimg_create')
  })

  it('keeps one non-looping frame on the native animimg path', () => {
    const generated = generate(component('still_motion', 'AnimImage', {
      frameAssetIds: ['one'], frameDuration: 125, loop: false, autoStart: false,
    }))
    expect(generated.code).toContain('lv_animimg_create')
    expect(generated.code).toContain('lv_animimg_set_duration(obj1, 125)')
    expect(generated.code).toContain('lv_animimg_set_repeat_count(obj1, 0)')
    expect(generated.code).not.toContain('lv_animimg_start(obj1)')
    expect(generated.code).not.toContain('Add animation frames')
  })

  it('exports collision-safe native image buttons, APIs and click hooks', () => {
    const props = { releasedAssetId: 'one', pressedAssetId: 'pressed', disabledAssetId: 'disabled' }
    const generated = generate(component('image_action', 'ImageButton', props), component('image_action_2', 'ImageButton', props))
    expect(generated.code).toContain('lv_imagebutton_create')
    expect(generated.code).toContain('LV_IMAGEBUTTON_STATE_PRESSED')
    expect(generated.publicApiDeclarations.filter(value => value.includes('_Enabled'))).toHaveLength(2)
    expect(new Set(generated.userEventHooks).size).toBe(2)
  })
})
