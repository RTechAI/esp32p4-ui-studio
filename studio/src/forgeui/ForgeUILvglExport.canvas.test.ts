import { generateForgeUILvglCode } from './ForgeUILvglExport'

const canvas: IComponent = {
  id: 'canvas',
  parent: 'root',
  type: 'Canvas',
  componentName: 'Canvas',
  props: { x: 20, y: 30, w: 240, h: 120 },
  children: [],
}

describe('Canvas generated LVGL parity', () => {
  it('exports the empty bounded semantic Canvas surface', () => {
    const { code } = generateForgeUILvglCode({
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: [canvas.id],
      },
      [canvas.id]: canvas,
    }, 'cyber_teal', undefined, { includeThemeTexture: false })

    expect(code).toContain(
      'lv_obj_t * obj1 = lv_obj_create(fg_application_page);',
    )
    expect(code).toContain('lv_obj_set_pos(obj1, 20, 30);')
    expect(code).toContain('lv_obj_set_size(obj1, 240, 120);')
    expect(code).toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0x0F2A30), LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_color(obj1, lv_color_hex(0x14B8A6), LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_width(obj1, 2, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_radius(obj1, 8, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_pad_all(obj1, 0, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_clip_corner(obj1, true, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_clear_flag(obj1, LV_OBJ_FLAG_SCROLLABLE);',
    )
  })
})
