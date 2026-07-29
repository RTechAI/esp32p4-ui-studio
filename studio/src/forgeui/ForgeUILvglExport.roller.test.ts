import fs from 'fs'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const roller = (
  id = 'roller',
  props: Record<string, unknown> = {},
  componentName = 'Option Roller',
): IComponent => ({
  id,
  parent: 'root',
  type: 'Roller',
  componentName,
  props: { x: 20, y: 20, w: 180, h: 150, ...props },
  children: [],
})

const generate = (...children: IComponent[]) => {
  const components: IComponents = {
    root: {
      id: 'root', parent: 'root', type: 'Box', props: {},
      children: children.map(child => child.id),
    },
    ...Object.fromEntries(children.map(child => [child.id, child])),
  }
  return generateForgeUILvglCode(
    components,
    'graphite',
    undefined,
    { includeThemeTexture: false },
  )
}

describe('Roller generated developer API', () => {
  it('preserves the default options, selection, rows, and normal mode', () => {
    const generated = generate(roller())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Option_Roller_Selected(uint32_t index);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Option_Roller_Changed',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_option_roller_roller = NULL;',
    )
    expect(generated.code).toContain(
      'static uint32_t fg_option_roller_roller_selected_index = 0;',
    )
    expect(generated.code).toContain(
      'static const uint32_t fg_option_roller_roller_option_count = 4;',
    )
    expect(generated.code).toContain(
      'lv_roller_set_options(obj1, "One\\nTwo\\nThree\\nFour", LV_ROLLER_MODE_NORMAL);',
    )
    expect(generated.code).toContain(
      'lv_roller_set_visible_row_count(obj1, 3);',
    )
    expect(generated.code).toContain(
      'lv_roller_set_selected(obj1, 0, LV_ANIM_OFF);',
    )
  })

  it('emits the preferred Browser visual treatment with native parts', () => {
    const { code } = generate(roller())

    expect(code).toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0x1E2328), LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_opa(obj1, LV_OPA_COVER, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_color(obj1, lv_color_hex(0xB5B6B8), LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_font(obj1, &lv_font_montserrat_16, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_align(obj1, LV_TEXT_ALIGN_CENTER, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_line_space(obj1, 5, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_width(obj1, 1, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_radius(obj1, 8, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_pad_all(obj1, 0, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_opa(obj1, LV_OPA_TRANSP, LV_PART_SELECTED);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_width(obj1, 0, LV_PART_SELECTED);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_color(obj1, lv_color_hex(0xF2A900), LV_PART_SELECTED);',
    )
    expect(code).not.toContain(
      'lv_obj_remove_style_all(obj1)',
    )
  })

  it('shares one guarded transition for programmatic and touch changes', () => {
    const { code } = generate(roller())

    expect(code).toContain(
      'if (index >= fg_option_roller_roller_option_count) index = fg_option_roller_roller_option_count - 1;',
    )
    expect(code).toContain(
      'if (index == fg_option_roller_roller_selected_index) return;',
    )
    expect(code).toContain(
      'fg_option_roller_roller_selected_index = index;',
    )
    expect(code).toContain(
      'if (update_widget) lv_roller_set_selected(fg_option_roller_roller, index, LV_ANIM_OFF);',
    )
    expect(code).toContain(
      'fg_option_roller_roller_apply_selection(index, true);',
    )
    expect(code).toContain(
      'fg_option_roller_roller_apply_selection(lv_roller_get_selected(roller), false);',
    )
    expect(code).toContain(
      'lv_obj_add_event_cb(obj1, fg_option_roller_roller_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
  })

  it('passes selected text from a callback-duration buffer', () => {
    const { code } = generate(roller())

    expect(code).toContain('char selected_text[6];')
    expect(code).toContain(
      'lv_roller_get_selected_str(fg_option_roller_roller, selected_text, sizeof(selected_text));',
    )
    expect(code).toContain(
      'FG_On_Option_Roller_Changed(index, selected_text);',
    )
  })

  it('honors persisted options, selection, rows, and infinite mode', () => {
    const { code } = generate(roller('configured', {
      options: ['Alpha', 'Beta', 'Gamma'],
      selectedIndex: 2,
      visibleRowCount: 5,
      mode: 'infinite',
    }))

    expect(code).toContain(
      'lv_roller_set_options(obj1, "Alpha\\nBeta\\nGamma", LV_ROLLER_MODE_INFINITE);',
    )
    expect(code).toContain('lv_roller_set_visible_row_count(obj1, 5);')
    expect(code).toContain('lv_roller_set_selected(obj1, 2, LV_ANIM_OFF);')
    expect(code).toContain(
      'static uint32_t fg_option_roller_roller_selected_index = 2;',
    )
  })

  it('does not fire the developer hook during creation', () => {
    const { code } = generate(roller())
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    expect(creation).not.toContain('FG_On_Option_Roller_Changed(')
  })

  it('allocates collision-safe APIs, objects, and hooks', () => {
    const generated = generate(
      roller('a'),
      roller('b'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Option_Roller_Selected(uint32_t index);',
      'void FG_Set_Option_Roller_2_Selected(uint32_t index);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Option_Roller_Changed',
      'FG_On_Option_Roller_2_Changed',
    ]))
    expect(generated.code).toContain('fg_option_roller_roller = lv_roller_create')
    expect(generated.code).toContain('fg_option_roller_2_roller = lv_roller_create')
  })

  it('can dump the live endpoint validation payload', () => {
    if (!process.env.FORGEUI_DUMP_ROLLER_PAYLOAD) return
    fs.writeFileSync(
      process.env.FORGEUI_DUMP_ROLLER_PAYLOAD,
      JSON.stringify(generate(roller())),
    )
  })
})
