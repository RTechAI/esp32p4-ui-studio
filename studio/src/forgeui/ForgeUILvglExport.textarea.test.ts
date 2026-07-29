import { generateForgeUILvglCode } from './ForgeUILvglExport'

const textarea = (
  id = 'textarea',
  props: Record<string, unknown> = {},
  componentName = 'Notes Textarea',
): IComponent => ({
  id,
  parent: 'root',
  type: 'Textarea',
  componentName,
  props: {
    x: 20,
    y: 20,
    w: 300,
    h: 140,
    placeholder: 'Enter notes',
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

describe('Textarea generated developer API', () => {
  it('retains the textarea and generates its setter, guard, and user hook', () => {
    const generated = generate(textarea())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Notes_Textarea_Text(const char * text);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Notes_Textarea_Changed',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_notes_textarea_textarea = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_notes_textarea_textarea_programmatic_update = false;',
    )
  })

  it('keeps serialized multiline value and placeholder separate', () => {
    const { code } = generate(textarea('configured', {
      placeholder: 'Maintenance notes',
      value: 'Line one\\nLine two',
    }))

    expect(code).toContain(
      'lv_textarea_set_placeholder_text(fg_notes_textarea_textarea, "Maintenance notes");',
    )
    expect(code).toContain(
      'lv_textarea_set_text(fg_notes_textarea_textarea, "Line one\\\\nLine two");',
    )
    expect(code).not.toContain(
      'lv_textarea_set_one_line(fg_notes_textarea_textarea, true);',
    )
  })

  it('silently handles null, unchanged, and programmatic values', () => {
    const { code } = generate(textarea())
    const setterStart = code.indexOf(
      'void FG_Set_Notes_Textarea_Text(const char * text)',
    )
    const setter = code.slice(setterStart, setterStart + 700)

    expect(setter).toContain(
      'if (fg_notes_textarea_textarea == NULL) return;',
    )
    expect(setter).toContain('if (text == NULL) text = "";')
    expect(setter).toContain(
      'if (strcmp(lv_textarea_get_text(fg_notes_textarea_textarea), text) == 0) return;',
    )
    expect(setter).toContain(
      'fg_notes_textarea_textarea_programmatic_update = true;',
    )
    expect(setter).toContain(
      'lv_textarea_set_text(fg_notes_textarea_textarea, text);',
    )
    expect(setter).toContain(
      'fg_notes_textarea_textarea_programmatic_update = false;',
    )
    expect(setter).not.toContain('FG_On_Notes_Textarea_Changed(')
  })

  it('calls the hook only from genuine LVGL value-change events', () => {
    const { code } = generate(textarea())

    expect(code).toContain(
      'lv_obj_add_event_cb(fg_notes_textarea_textarea, fg_notes_textarea_textarea_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
    expect(code).toContain(
      'if (input != fg_notes_textarea_textarea || fg_notes_textarea_textarea_programmatic_update) return;',
    )
    expect(code).toContain(
      'FG_On_Notes_Textarea_Changed(lv_textarea_get_text(input));',
    )
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    expect(creation).not.toContain('FG_On_Notes_Textarea_Changed(')
  })

  it('allocates stable collision-safe Textarea APIs and storage', () => {
    const generated = generate(textarea('a'), textarea('b'))

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Notes_Textarea_Text(const char * text);',
      'void FG_Set_Notes_Textarea_2_Text(const char * text);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Notes_Textarea_Changed',
      'FG_On_Notes_Textarea_2_Changed',
    ]))
    expect(generated.code).toContain(
      'static lv_obj_t * fg_notes_textarea_textarea = NULL;',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_notes_textarea_2_textarea = NULL;',
    )
  })
})
