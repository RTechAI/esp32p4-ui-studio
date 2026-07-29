import { generateForgeUILvglCode } from './ForgeUILvglExport'

const tabView = (
  id = 'tabs',
  props: Record<string, unknown> = {},
  componentName = 'Main Tabs',
): IComponent => ({
  id,
  parent: 'root',
  type: 'Tabview',
  componentName,
  props: { x: 20, y: 30, w: 420, h: 240, ...props },
  children: [],
})

const generate = (...children: IComponent[]) =>
  generateForgeUILvglCode({
    root: {
      id: 'root', parent: 'root', type: 'Box', props: {},
      children: children.map(child => child.id),
    },
    ...Object.fromEntries(children.map(child => [child.id, child])),
  }, 'graphite', undefined, { includeThemeTexture: false })

describe('TabView generated developer API', () => {
  it('retains the existing three-tab appearance and initial selection', () => {
    const generated = generate(tabView())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Main_Tabs_Selected(uint32_t tab_index);',
    )
    expect(generated.userEventHooks).toContain('FG_On_Main_Tabs_Changed')
    expect(generated.code).toContain(
      'static lv_obj_t * fg_main_tabs_tabview = NULL;',
    )
    expect(generated.code).toContain(
      'static uint32_t fg_main_tabs_tabview_selected_index = 0;',
    )
    expect(generated.code).toContain(
      'static const uint32_t fg_main_tabs_tabview_tab_count = 3;',
    )
    expect(generated.code).toContain(
      'lv_obj_t * obj1_tab1 = lv_tabview_add_tab(obj1, "Tab 1");',
    )
    expect(generated.code).toContain(
      'lv_obj_t * obj1_tab3 = lv_tabview_add_tab(obj1, "Tab 3");',
    )
  })

  it('shares a guarded transition for programmatic and touch changes', () => {
    const { code } = generate(tabView())

    expect(code).toContain(
      'if (tab_index >= fg_main_tabs_tabview_tab_count) tab_index = fg_main_tabs_tabview_tab_count - 1;',
    )
    expect(code).toContain(
      'if (tab_index == fg_main_tabs_tabview_selected_index) return;',
    )
    expect(code).toContain(
      'lv_tabview_set_active(fg_main_tabs_tabview, tab_index, LV_ANIM_OFF);',
    )
    expect(code).toContain(
      'fg_main_tabs_tabview_apply_selection(lv_tabview_get_tab_active(tabview), false);',
    )
    expect(code).toContain(
      'lv_obj_add_event_cb(obj1, fg_main_tabs_tabview_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
    expect(code).toContain('FG_On_Main_Tabs_Changed(tab_index);')
  })

  it('does not invoke the hook during creation', () => {
    const { code } = generate(tabView())
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    expect(creation).not.toContain('FG_On_Main_Tabs_Changed(')
  })

  it('honors a persisted initial selection without notifying', () => {
    const { code } = generate(tabView('configured', { selectedIndex: 2 }))

    expect(code).toContain('lv_tabview_set_active(obj1, 2, LV_ANIM_OFF);')
    expect(code).toContain('fg_main_tabs_tabview_selected_index = 2;')
  })

  it('allocates collision-safe APIs, objects, and hooks', () => {
    const generated = generate(tabView('a'), tabView('b'))

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Main_Tabs_Selected(uint32_t tab_index);',
      'void FG_Set_Main_Tabs_2_Selected(uint32_t tab_index);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Main_Tabs_Changed',
      'FG_On_Main_Tabs_2_Changed',
    ]))
    expect(generated.code).toContain(
      'fg_main_tabs_tabview = lv_tabview_create',
    )
    expect(generated.code).toContain(
      'fg_main_tabs_2_tabview = lv_tabview_create',
    )
  })
})
