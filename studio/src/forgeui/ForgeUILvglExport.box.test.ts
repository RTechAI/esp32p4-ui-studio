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
    }))

    expect(code).toContain('lv_obj_set_pos(fg_status_box, 45, 55);')
    expect(code).toContain('lv_obj_set_size(fg_status_box, 300, 180);')
    expect(code).toContain(
      'lv_obj_set_style_radius(fg_status_box, 12, 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_width(fg_status_box, 2, 0);',
    )
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
