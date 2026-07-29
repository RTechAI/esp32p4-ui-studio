import fs from 'fs'
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

    const { code, publicApiDeclarations, userEventHooks } =
      generateForgeUILvglCode(components, 'graphite')
    const keyboardStart = code.indexOf('// ForgeUI Keyboard component keyboard')
    const keyboardEnd = code.indexOf(
      '    fg_system_launcher_page =',
      keyboardStart,
    )
    const keyboardBlock = code.slice(keyboardStart, keyboardEnd)

    expect(code).toContain('static lv_obj_t * fg_keyboard_keyboard = NULL;')
    expect(code).not.toContain('fg_keyboard_keyboard_textarea')
    expect(code).toContain('fg_keyboard_keyboard = lv_keyboard_create(fg_application_page);')
    expect(keyboardBlock).not.toContain('lv_textarea_create')
    expect(keyboardBlock).not.toContain('"Keyboard input"')
    expect(keyboardBlock).not.toMatch(/\bobj\d+_ta\b/)
    expect(publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Show_Keyboard(void);',
      'void FG_Hide_Keyboard(void);',
    ]))
    expect(userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Keyboard_Shown',
      'FG_On_Keyboard_Hidden',
    ]))
    expect(code).toContain('lv_obj_set_pos(obj1, 0, 408);')
    expect(code).toContain('lv_obj_set_size(obj1, 654, 192);')
    expect(code).toContain('lv_keyboard_set_textarea(obj1, NULL);')
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
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0xFFFFFF), LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_opa(obj1, LV_OPA_70, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0xF8FAFC), LV_PART_ITEMS);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_color(obj1, lv_color_hex(0x4A5568), LV_PART_ITEMS);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0xE2E8F0), LV_PART_ITEMS | LV_STATE_PRESSED);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0xF8FAFC), LV_PART_ITEMS | LV_STATE_CHECKED);',
    )
    expect(code).not.toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0x1E2328), LV_PART_MAIN);',
    )
    expect(code).not.toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0x2A3138), LV_PART_ITEMS);',
    )
    expect(code).toContain('lv_obj_set_style_radius(obj1, 8, LV_PART_MAIN);')
    expect(code).toContain('lv_obj_set_style_radius(obj1, 6, LV_PART_ITEMS);')
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

  it('uses one transition helper for safe Show and Hide behavior', () => {
    const components: IComponents = {
      root: {
        id: 'root', parent: 'root', type: 'Box', props: {},
        children: ['keyboard'],
      },
      keyboard: {
        id: 'keyboard', parent: 'root', type: 'Keyboard',
        componentName: 'Keyboard',
        props: { x: 0, y: 408, w: 654, h: 192 },
        children: [],
      },
    }
    const { code } = generateForgeUILvglCode(components, 'graphite')

    expect(code).toContain('if (keyboard == NULL) return false;')
    expect(code).toContain('bool hidden = lv_obj_has_flag(keyboard, LV_OBJ_FLAG_HIDDEN);')
    expect(code).toContain('if (!hidden) return false;')
    expect(code).toContain('if (hidden) return false;')
    expect(code).toContain('lv_keyboard_set_textarea(keyboard, NULL);')
    expect(code).toContain('lv_obj_clear_flag(keyboard, LV_OBJ_FLAG_HIDDEN);')
    expect(code).toContain('lv_obj_add_flag(keyboard, LV_OBJ_FLAG_HIDDEN);')
    expect(code).toContain('lv_obj_move_foreground(keyboard);')
    expect(code).toContain(
      'if (fg_component_keyboard_set_visible(fg_keyboard_keyboard, true)) {',
    )
    expect(code).toContain(
      'if (fg_component_keyboard_set_visible(fg_keyboard_keyboard, false)) {',
    )
    expect(code).toContain('FG_On_Keyboard_Shown();')
    expect(code).toContain('FG_On_Keyboard_Hidden();')

    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    expect(creation).not.toContain('FG_On_Keyboard_Shown();')
    expect(creation).not.toContain('FG_On_Keyboard_Hidden();')
  })

  it('allocates collision-safe names for two same-named keyboards', () => {
    const component = (id: string): IComponent => ({
      id, parent: 'root', type: 'Keyboard', componentName: 'Keyboard',
      props: { x: 0, y: 408, w: 654, h: 192 }, children: [],
    })
    const components: IComponents = {
      root: {
        id: 'root', parent: 'root', type: 'Box', props: {},
        children: ['a', 'b'],
      },
      a: component('a'),
      b: component('b'),
    }
    const generated = generateForgeUILvglCode(components, 'graphite')

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Show_Keyboard(void);',
      'void FG_Hide_Keyboard(void);',
      'void FG_Show_Keyboard_2(void);',
      'void FG_Hide_Keyboard_2(void);',
    ]))
    expect(generated.code).toContain('static lv_obj_t * fg_keyboard_keyboard = NULL;')
    expect(generated.code).toContain('static lv_obj_t * fg_keyboard_2_keyboard = NULL;')
  })

  it('can dump the live validation project payload', () => {
    if (!process.env.FORGEUI_DUMP_KEYBOARD_PAYLOAD) return
    const child = (
      id: string, type: string, props: Record<string, unknown>,
    ): IComponent => ({
      id, parent: 'root', type: type as IComponent['type'], props, children: [],
    })
    const children = [
      child('comp-MS54VF7PP1FCD', 'Led',
        { positionMode: 'absolute', x: 585, y: 167, w: 32, h: 32 }),
      child('comp-MS55EHNT4YJCW', 'Bar',
        { positionMode: 'absolute', x: 486, y: 117, w: 240, h: 43 }),
      child('comp-MS55RH11ZZV74', 'Arc',
        { positionMode: 'absolute', x: 40, y: 3, w: 120, h: 120 }),
      child('comp-MS563F9M1YGRA', 'Chart',
        { positionMode: 'absolute', x: 114, y: 161, w: 240, h: 120 }),
      child('keyboard', 'Keyboard',
        { positionMode: 'absolute', x: 370, y: 408, w: 654, h: 192 }),
    ]
    const components: IComponents = {
      root: {
        id: 'root', parent: 'root', type: 'Box', props: {},
        children: children.map(component => component.id),
      },
      ...Object.fromEntries(children.map(component => [component.id, component])),
    }
    fs.writeFileSync(
      process.env.FORGEUI_DUMP_KEYBOARD_PAYLOAD,
      JSON.stringify(generateForgeUILvglCode(
        components,
        'graphite',
        undefined,
        { includeThemeTexture: false },
      )),
    )
  })
})
