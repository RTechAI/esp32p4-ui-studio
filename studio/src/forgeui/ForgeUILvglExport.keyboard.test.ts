import { generateForgeUILvglCode } from './ForgeUILvglExport'

describe('Keyboard LVGL export geometry', () => {
  it('exports fixed Studio geometry and key-matrix metrics without intrinsic sizing', () => {
    const components: IComponents = {
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: ['keyboard'],
      },
      keyboard: {
        id: 'keyboard',
        parent: 'root',
        type: 'Keyboard',
        props: {
          positionMode: 'absolute',
          x: 0,
          y: 408,
          w: 654,
          h: 192,
        },
        children: [],
      },
    }

    const { code } = generateForgeUILvglCode(components, 'graphite')

    expect(code).toContain('lv_obj_t * obj1 = lv_keyboard_create(fg_application_page);')
    expect(code).toContain('lv_obj_set_pos(obj1, 0, 408);')
    expect(code).toContain('lv_obj_set_size(obj1, 654, 192);')
    expect(code).toContain('lv_obj_set_pos(obj1_ta, 0, 353);')
    expect(code).toContain('lv_obj_set_size(obj1_ta, 654, 45);')
    expect(code).toContain(
      'lv_keyboard_set_map(obj1, LV_KEYBOARD_MODE_TEXT_LOWER, obj1_map, obj1_ctrl);',
    )
    expect(code).toContain(
      '"1#", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", LV_SYMBOL_BACKSPACE, "\\n"',
    )
    expect(code).toContain(
      '"ABC", "a", "s", "d", "f", "g", "h", "j", "k", "l", LV_SYMBOL_NEW_LINE, "\\n"',
    )
    expect(code).toContain(
      '"_", "-", "z", "x", "c", "v", "b", "n", "m", ".", ",", ":", "\\n"',
    )
    expect(code).toContain(
      'LV_SYMBOL_KEYBOARD, LV_SYMBOL_LEFT, " ", LV_SYMBOL_RIGHT, LV_SYMBOL_OK, ""',
    )
    expect(code).toContain(
      'LV_KEYBOARD_CTRL_BUTTON_FLAGS | 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, LV_BUTTONMATRIX_CTRL_CHECKED | 4',
    )
    expect(code).toContain(
      'LV_KEYBOARD_CTRL_BUTTON_FLAGS | 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, LV_BUTTONMATRIX_CTRL_CHECKED | 3',
    )
    expect(code).toContain(
      'LV_KEYBOARD_CTRL_BUTTON_FLAGS | 2, LV_BUTTONMATRIX_CTRL_CHECKED | 2, 12, LV_BUTTONMATRIX_CTRL_CHECKED | 2, LV_KEYBOARD_CTRL_BUTTON_FLAGS | 2',
    )
    expect(code).not.toContain('LV_KEYBOARD_CTRL_BUTTON_FLAGS | 5')
    expect(code).not.toContain('LV_BUTTONMATRIX_CTRL_CHECKED | 7')
    expect(code).toContain('lv_obj_set_style_pad_all(obj1, 8, LV_PART_MAIN);')
    expect(code).toContain('lv_obj_set_style_pad_row(obj1, 6, LV_PART_MAIN);')
    expect(code).toContain('lv_obj_set_style_pad_column(obj1, 6, LV_PART_MAIN);')
    expect(code).toContain(
      'lv_obj_set_style_text_font(obj1, &lv_font_montserrat_12, LV_PART_ITEMS);',
    )
    expect(code).toContain('// ForgeUI Keyboard component keyboard -> obj1')
    expect(code).toContain('lv_obj_set_align(obj1, LV_ALIGN_TOP_LEFT);')
    expect(code).toContain('lv_obj_update_layout(lv_screen_active());')
    expect(code).toContain('lv_obj_get_coords(obj1, &obj1_coords);')
    expect(code).toContain('[ForgeUI][Keyboard keyboard]')
    expect(code).not.toMatch(/lv_obj_set_size\(obj1,\s*LV_SIZE_CONTENT/)
    expect(code).not.toMatch(/lv_obj_set_(?:width|height)\(obj1,\s*lv_pct/)

    const mapIndex = code.indexOf('lv_keyboard_set_map(obj1,')
    const textareaIndex = code.indexOf('lv_keyboard_set_textarea(obj1,')
    const modeIndex = code.indexOf('lv_keyboard_set_mode(obj1,')
    const styleIndex = code.indexOf('lv_obj_set_style_pad_all(obj1, 8, LV_PART_MAIN);')
    const alignIndex = code.indexOf('lv_obj_set_align(obj1, LV_ALIGN_TOP_LEFT);')
    const finalPositionIndex = code.indexOf('lv_obj_set_pos(obj1, 0, 408);')
    const finalSizeIndex = code.indexOf('lv_obj_set_size(obj1, 654, 192);')
    const layoutIndex = code.indexOf('lv_obj_update_layout(lv_screen_active());')

    expect(mapIndex).toBeGreaterThan(-1)
    expect(mapIndex).toBeLessThan(textareaIndex)
    expect(textareaIndex).toBeLessThan(modeIndex)
    expect(modeIndex).toBeLessThan(styleIndex)
    expect(styleIndex).toBeLessThan(alignIndex)
    expect(alignIndex).toBeLessThan(finalPositionIndex)
    expect(finalPositionIndex).toBeLessThan(finalSizeIndex)
    expect(finalSizeIndex).toBeLessThan(layoutIndex)

    const afterFinalGeometry = code.slice(finalSizeIndex + 1)
    expect(afterFinalGeometry).not.toMatch(/lv_obj_(?:align|center)\(obj1/)
    expect(afterFinalGeometry).not.toMatch(
      /lv_obj_set_(?:pos|x|y|size|width|height|align)\(obj1,/,
    )
  })
})
