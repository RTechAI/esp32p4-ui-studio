import fs from 'fs'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const matrix = (
  id = 'matrix',
  props: Record<string, unknown> = {},
  componentName = 'Menu Matrix',
): IComponent => ({
  id,
  parent: 'root',
  type: 'ButtonMatrix',
  componentName,
  props: { x: 20, y: 20, w: 300, h: 160, ...props },
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

describe('Button Matrix generated developer API', () => {
  it('preserves the default map, row break, selection, and modes', () => {
    const generated = generate(matrix())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Menu_Matrix_Selected(uint32_t button_index);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Menu_Matrix_Button_Selected',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_menu_matrix_button_matrix = NULL;',
    )
    expect(generated.code).toContain(
      'static uint32_t fg_menu_matrix_button_matrix_selected_index = 1;',
    )
    expect(generated.code).toContain(
      'static const uint32_t fg_menu_matrix_button_matrix_button_count = 6;',
    )
    expect(generated.code).toContain(
      'static const char * obj1_map[] = {"One", "Two", "Three", "\\n", "Four", "Five", "Six", ""};',
    )
    expect(generated.code).toContain(
      'lv_buttonmatrix_set_selected_button(obj1, 1);',
    )
    expect(generated.code).not.toContain(
      'lv_buttonmatrix_set_one_checked(obj1, true);',
    )
  })

  it('shares one guarded transition for programmatic and touch selection', () => {
    const { code } = generate(matrix())

    expect(code).toContain(
      'if (button_index >= fg_menu_matrix_button_matrix_button_count) button_index = fg_menu_matrix_button_matrix_button_count - 1;',
    )
    expect(code).toContain(
      'if (button_index == fg_menu_matrix_button_matrix_selected_index) return;',
    )
    expect(code).toContain(
      'if (update_widget) {',
    )
    expect(code).toContain(
      'lv_buttonmatrix_set_selected_button(fg_menu_matrix_button_matrix, button_index);',
    )
    expect(code).toContain(
      'fg_menu_matrix_button_matrix_apply_selection(button_index, true);',
    )
    expect(code).toContain(
      'fg_menu_matrix_button_matrix_apply_selection(lv_buttonmatrix_get_selected_button(matrix), false);',
    )
    expect(code).toContain(
      'lv_obj_add_event_cb(obj1, fg_menu_matrix_button_matrix_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
  })

  it('passes stable map text and rejects disabled buttons', () => {
    const { code } = generate(matrix('configured', {
      disabledButtons: [2, 4],
    }))

    expect(code).toContain(
      'lv_buttonmatrix_set_button_ctrl(obj1, 2, LV_BUTTONMATRIX_CTRL_DISABLED);',
    )
    expect(code).toContain(
      'lv_buttonmatrix_set_button_ctrl(obj1, 4, LV_BUTTONMATRIX_CTRL_DISABLED);',
    )
    expect(code).toContain(
      'lv_buttonmatrix_has_button_ctrl(fg_menu_matrix_button_matrix, button_index, LV_BUTTONMATRIX_CTRL_DISABLED)',
    )
    expect(code).toContain(
      'const char * text = lv_buttonmatrix_get_button_text(fg_menu_matrix_button_matrix, button_index);',
    )
    expect(code).toContain(
      'FG_On_Menu_Matrix_Button_Selected(button_index, text);',
    )
  })

  it('honors persisted layout, selection, one-check, and disabled state', () => {
    const { code } = generate(matrix('configured', {
      buttonMap: [['Alpha', 'Beta'], ['Gamma']],
      selectedIndex: 2,
      oneCheck: true,
      disabledButtons: [1],
    }))

    expect(code).toContain(
      'static const char * obj1_map[] = {"Alpha", "Beta", "\\n", "Gamma", ""};',
    )
    expect(code).toContain(
      'lv_buttonmatrix_set_button_ctrl_all(obj1, LV_BUTTONMATRIX_CTRL_CHECKABLE);',
    )
    expect(code).toContain('lv_buttonmatrix_set_one_checked(obj1, true);')
    expect(code).toContain(
      'lv_buttonmatrix_set_button_ctrl(obj1, 2, LV_BUTTONMATRIX_CTRL_CHECKED);',
    )
    expect(code).toContain(
      'lv_buttonmatrix_clear_button_ctrl_all(fg_menu_matrix_button_matrix, LV_BUTTONMATRIX_CTRL_CHECKED);',
    )
  })

  it('does not invoke the hook during creation', () => {
    const { code } = generate(matrix())
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    expect(creation).not.toContain('FG_On_Menu_Matrix_Button_Selected(')
  })

  it('allocates collision-safe APIs, objects, and hooks', () => {
    const generated = generate(matrix('a'), matrix('b'))

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Menu_Matrix_Selected(uint32_t button_index);',
      'void FG_Set_Menu_Matrix_2_Selected(uint32_t button_index);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Menu_Matrix_Button_Selected',
      'FG_On_Menu_Matrix_2_Button_Selected',
    ]))
    expect(generated.code).toContain(
      'fg_menu_matrix_button_matrix = lv_buttonmatrix_create',
    )
    expect(generated.code).toContain(
      'fg_menu_matrix_2_button_matrix = lv_buttonmatrix_create',
    )
  })

  it('can dump the live endpoint validation payload', () => {
    if (!process.env.FORGEUI_DUMP_BUTTON_MATRIX_PAYLOAD) return
    fs.writeFileSync(
      process.env.FORGEUI_DUMP_BUTTON_MATRIX_PAYLOAD,
      JSON.stringify(generate(matrix())),
    )
  })
})
