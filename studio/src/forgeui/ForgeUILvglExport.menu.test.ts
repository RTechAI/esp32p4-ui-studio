import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'

const menu = (id: string, props: any = {}): IComponent => ({ id, type: 'Menu', parent: 'root', componentName: id, children: [], props: {
  x: 20, y: 30, w: 420, h: 420, rootPageId: 'root', headerMode: 'top-fixed', pages: [
    { id: 'root', title: 'Settings', sections: [{ id: 'general', title: 'General', items: [
      { id: 'display', label: 'Display', subtitle: 'Brightness', icon: 'LV_SYMBOL_EYE_OPEN', targetPageId: 'display-page', enabled: true },
      { id: 'locked', label: 'Locked', subtitle: '', icon: '', targetPageId: '', enabled: false },
    ] }] },
    { id: 'display-page', title: 'Display', sections: [{ id: 'options', title: '', items: [] }] },
  ], ...props,
} })

const generate = (...items: IComponent[]) => generateForgeUILvglCode({
  root: { id: 'root', type: 'Box', parent: 'root', props: {}, children: items.map(item => item.id) },
  ...Object.fromEntries(items.map(item => [item.id, item])),
}, 'graphite', undefined, { includeThemeTexture: false })

describe('native LVGL Menu export', () => {
  it('registers Menu as a structured native navigation widget', () => {
    expect(getForgeUIWidgetDefinition('Menu')).toMatchObject({ displayName: 'Menu', category: 'Navigation',
      capabilities: { childOwnership: 'structured', featureGate: { lvglConfigDependencies: ['CONFIG_LV_USE_MENU', 'CONFIG_LV_USE_FLEX'] } } })
  })

  it('emits native pages, sections, item containers, links, disabled state and initial page', () => {
    const code = generate(menu('settings')).code
    expect(code).toContain('lv_obj_t * obj1 = lv_menu_create(')
    expect(code).toContain('obj1_page_0 = lv_menu_page_create(obj1, "Settings")')
    expect(code).toContain('lv_menu_section_create(obj1_page_0)')
    expect(code).toContain('lv_menu_cont_create(obj1_page_0_section_0)')
    expect(code).toContain('lv_menu_set_load_page_event(obj1, obj1_page_0_section_0_item_0, obj1_page_1)')
    expect(code).toContain('lv_obj_add_state(obj1_page_0_section_0_item_1, LV_STATE_DISABLED)')
    expect(code).toContain('lv_menu_set_page(obj1, obj1_page_0)')
  })

  it('keeps multiple instances and header modes collision-safe', () => {
    const code = generate(menu('first'), menu('second', { headerMode: 'bottom-fixed', rootBackButton: true })).code
    expect(code.match(/lv_menu_create/g)).toHaveLength(2)
    expect(code).toContain('lv_menu_set_mode_header(obj2, LV_MENU_HEADER_BOTTOM_FIXED)')
    expect(code).toContain('lv_menu_set_mode_root_back_button(obj2, LV_MENU_ROOT_BACK_BUTTON_ENABLED)')
    expect(code).toContain('obj2_page_0')
  })
})
