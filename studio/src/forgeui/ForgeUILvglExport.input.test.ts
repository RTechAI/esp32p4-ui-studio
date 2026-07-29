import { generateForgeUILvglCode } from './ForgeUILvglExport'

const input = (
  id = 'input',
  props: Record<string, unknown> = {},
  componentName = 'Search Input',
): IComponent => ({
  id,
  parent: 'root',
  type: 'Input',
  componentName,
  props: {
    x: 20,
    y: 20,
    w: 240,
    h: 48,
    placeholder: 'Search',
    ...props,
  },
  children: [],
})

const generate = (...children: IComponent[]) =>
  generateForgeUILvglCode({
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: children.map(child => child.id),
    },
    ...Object.fromEntries(children.map(child => [child.id, child])),
  }, 'graphite', undefined, { includeThemeTexture: false })

describe('Input generated developer API', () => {
  it('retains the textarea and exports a collision-safe text setter and hook', () => {
    const generated = generate(input())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Search_Input_Text(const char * text);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Search_Input_Changed',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_search_input_input = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_search_input_input_programmatic_update = false;',
    )
  })

  it('preserves serialized placeholder and initial text separately', () => {
    const { code } = generate(input('configured', {
      placeholder: 'Enter operator name',
      value: 'Scott',
    }))

    expect(code).toContain(
      'lv_textarea_set_placeholder_text(fg_search_input_input, "Enter operator name");',
    )
    expect(code).toContain(
      'lv_textarea_set_text(fg_search_input_input, "Scott");',
    )
  })

  it('updates programmatically without firing the user hook', () => {
    const { code } = generate(input())
    const setter = code.slice(
      code.indexOf('void FG_Set_Search_Input_Text'),
      code.indexOf('void FG_Set_Search_Input_Text') + 650,
    )

    expect(setter).toContain('if (text == NULL) text = "";')
    expect(setter).toContain(
      'if (strcmp(lv_textarea_get_text(fg_search_input_input), text) == 0) return;',
    )
    expect(setter).toContain(
      'fg_search_input_input_programmatic_update = true;',
    )
    expect(setter).toContain(
      'lv_textarea_set_text(fg_search_input_input, text);',
    )
    expect(setter).toContain(
      'fg_search_input_input_programmatic_update = false;',
    )
    expect(setter).not.toContain('FG_On_Search_Input_Changed(')
  })

  it('fires the hook only from the guarded LVGL user event callback', () => {
    const { code } = generate(input())

    expect(code).toContain(
      'lv_obj_add_event_cb(fg_search_input_input, fg_search_input_input_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
    expect(code).toContain(
      'if (input != fg_search_input_input || fg_search_input_input_programmatic_update) return;',
    )
    expect(code).toContain(
      'FG_On_Search_Input_Changed(lv_textarea_get_text(input));',
    )
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    expect(creation).not.toContain('FG_On_Search_Input_Changed(')
  })

  it('allocates separate APIs, objects, guards, and hooks for duplicate names', () => {
    const generated = generate(input('first'), input('second'))

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Search_Input_Text(const char * text);',
      'void FG_Set_Search_Input_2_Text(const char * text);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Search_Input_Changed',
      'FG_On_Search_Input_2_Changed',
    ]))
    expect(generated.code).toContain(
      'static lv_obj_t * fg_search_input_input = NULL;',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_search_input_2_input = NULL;',
    )
  })
})
