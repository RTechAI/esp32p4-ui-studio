import { generateForgeUILvglCode } from './ForgeUILvglExport'

const box = (
  id: string,
  componentName = 'Status Box',
  props: Record<string, unknown> = {},
  children: string[] = [],
): IComponent => ({
  id,
  parent: 'root',
  type: 'Box',
  componentName,
  props: {
    x: 20,
    y: 30,
    w: 240,
    h: 160,
    ...props,
  },
  children,
})

const generate = (...children: IComponent[]) =>
  generateForgeUILvglCode({
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      componentName: 'Root',
      props: {},
      children: children
        .filter(child => child.parent === 'root')
        .map(child => child.id),
    },
    ...Object.fromEntries(children.map(child => [child.id, child])),
  }, 'graphite', undefined, { includeThemeTexture: false })

describe('Standard Box generated runtime API', () => {
  it('retains each generated Box and exports visibility only', () => {
    const generated = generate(box('box'))

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Status_Box_Visible(bool visible);',
    )
    expect(generated.userEventHooks).toEqual([])
    expect(generated.code).toContain(
      'static lv_obj_t * fg_status_box = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_status_box_visible = true;',
    )
    expect(generated.code).toContain(
      'fg_status_box = lv_obj_create(fg_application_page);',
    )
  })

  it('suppresses unchanged visibility and uses the native hidden flag', () => {
    const { code } = generate(box('box'))
    const start = code.indexOf(
      'void FG_Set_Status_Box_Visible(bool visible)',
    )
    const setter = code.slice(start, start + 650)

    expect(setter).toContain(
      'if (fg_status_box == NULL || fg_status_box_visible == visible) return;',
    )
    expect(setter).toContain(
      'if (visible) lv_obj_clear_flag(fg_status_box, LV_OBJ_FLAG_HIDDEN);',
    )
    expect(setter).toContain(
      'else lv_obj_add_flag(fg_status_box, LV_OBJ_FLAG_HIDDEN);',
    )
    expect(setter).toContain('fg_status_box_visible = visible;')
    expect(setter).not.toContain('FG_On_')
  })

  it('preserves the local parent alias and nested child generation', () => {
    const child: IComponent = {
      id: 'label',
      parent: 'box',
      type: 'Text',
      componentName: 'Child Label',
      props: { value: 'Inside', x: 5, y: 6, w: 100, h: 24 },
      children: [],
    }
    const { code } = generate(
      box('box', 'Status Box', {}, ['label']),
      child,
    )

    expect(code).toContain('lv_obj_t * obj1 = fg_status_box;')
    expect(code).toContain('lv_obj_t * obj2 = lv_label_create(obj1);')
    expect(code).toContain('lv_label_set_text(obj2, "Inside");')
  })

  it('preserves existing geometry and visual styling', () => {
    const { code } = generate(box('box', 'Status Box', {
      x: 45,
      y: 55,
      w: 300,
      h: 180,
      backgroundColor: '#123456',
      borderColor: '#ABCDEF',
      borderOpacity: 50,
    }))

    expect(code).toContain('lv_obj_set_pos(fg_status_box, 45, 55);')
    expect(code).toContain('lv_obj_set_size(fg_status_box, 300, 180);')
    expect(code).toContain(
      'lv_obj_set_style_radius(fg_status_box, 12, 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_width(fg_status_box, 2, 0);',
    )
    expect(code).toContain('lv_color_hex(0x123456)')
    expect(code).toContain('lv_color_hex(0xABCDEF)')
    expect(code).toContain('lv_obj_set_style_border_opa(fg_status_box, 128, 0);')
    expect(code).toContain('lv_obj_clear_flag(fg_status_box, LV_OBJ_FLAG_SCROLLABLE);')
    expect(code).toContain('lv_obj_set_style_pad_all(fg_status_box, 0, LV_PART_MAIN);')
  })

  it('hydrates initial visibility and keeps children natively owned', () => {
    const child: IComponent = {
      id: 'child', parent: 'hidden-box', type: 'Divider', props: { x: 8, y: 8, w: 100, h: 4 }, children: [],
    }
    const { code } = generate(
      box('hidden-box', 'Hidden Box', { visible: false }, ['child']),
      child,
    )
    expect(code).toContain('fg_hidden_box_visible = false;')
    expect(code).toContain('lv_obj_add_flag(fg_hidden_box, LV_OBJ_FLAG_HIDDEN);')
    expect(code).toContain('lv_obj_t * obj2 = lv_obj_create(obj1);')
  })

  it('exports smart-region semantic surface styling without exporting metadata', () => {
    const { code } = generate(box('box', 'Main Region', {
      layoutRegionKey: 'dashboard.main',
      layoutSurfaceRole: 'surfaceSecondary',
      layoutRadius: 10,
      layoutBorderWidth: 1,
      layoutOpacity: 0.92,
    }))

    expect(code).toContain(
      'lv_obj_set_style_radius(fg_main_region, 10, 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_width(fg_main_region, 1, 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_opa(fg_main_region, 235, 0);',
    )
    expect(code).not.toContain('layoutRegionKey')
  })

  it('keeps smart Region Boxes on the existing visibility-only runtime contract', () => {
    const generated = generate(box('box', 'Main Region', {
      layoutRegionKey: 'dashboard.main',
      layoutSurfaceRole: 'surfaceSecondary',
    }))

    expect(generated.publicApiDeclarations).toEqual([
      'void FG_Set_Main_Region_Visible(bool visible);',
    ])
    expect(generated.userEventHooks).toEqual([])
    expect(generated.code).not.toContain('FG_On_Main_Region')
  })

  it('does not export an API for the non-generated root Box', () => {
    const generated = generate(box('box'))

    expect(generated.publicApiDeclarations).not.toContain(
      'void FG_Set_Root_Visible(bool visible);',
    )
    expect(generated.code).not.toContain('static lv_obj_t * fg_root')
  })

  it('allocates duplicate and sanitized collisions deterministically', () => {
    const generated = generate(
      box('a', 'Status Box'),
      box('b', 'Status Box'),
      box('c', 'Status-Box'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Status_Box_Visible(bool visible);',
      'void FG_Set_Status_Box_2_Visible(bool visible);',
      'void FG_Set_Status_Box_3_Visible(bool visible);',
    ]))
    expect(generated.code).toContain(
      'static lv_obj_t * fg_status_box_2 = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_status_box_3_visible = true;',
    )
  })

  it('never generates a Box developer callback', () => {
    const generated = generate(box('box'))

    expect(generated.userEventHooks).toEqual([])
    expect(generated.code).not.toContain('FG_On_Status_Box')
  })
})
