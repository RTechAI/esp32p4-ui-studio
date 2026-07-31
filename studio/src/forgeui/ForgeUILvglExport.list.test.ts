import { generateForgeUILvglCode } from './ForgeUILvglExport'

const list = (
  id: string,
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'List',
  componentName: `List ${id}`,
  props: { x: 20, y: 30, w: 260, h: 220, ...props },
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

describe('Native LVGL List export', () => {
  it('emits a native themed list, title, buttons, and configured geometry', () => {
    const generated = generate(list('menu', {
      title: 'System',
      items: 'Network\nDisplay\nAbout',
      itemHeight: 52,
    }))

    expect(generated.code).toContain(
      'lv_obj_t * obj1 = lv_list_create(fg_application_page);',
    )
    expect(generated.code).toContain('#include "95_UserEvents.h"')
    expect(generated.code).toContain(
      'lv_list_add_text(obj1, "System");',
    )
    expect(generated.code).toContain(
      'lv_list_add_button(obj1, NULL, "Network");',
    )
    expect(generated.code).toContain(
      'lv_list_add_button(obj1, NULL, "About");',
    )
    expect(generated.code).toContain(
      'lv_obj_set_height(obj1_item_0, 52);',
    )
    expect(generated.code).toContain('LV_STATE_PRESSED')
    expect(generated.publicApiDeclarations).toEqual(
      expect.not.arrayContaining([expect.stringContaining('List')]),
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_List_Menu_Item_Clicked',
    )
    expect(generated.code).toContain(
      'lv_obj_add_event_cb(obj1_item_0, fg_list_item_clicked_cb, LV_EVENT_CLICKED, (void *)&fg_list_menu_list_item_0_data);',
    )
    expect(generated.code).toContain(
      'static const fg_list_item_event_data_t fg_list_menu_list_item_0_data = { 0, "Network", FG_On_List_Menu_Item_Clicked };',
    )
    expect(generated.code).toContain(
      'data->hook(data->index, data->text);',
    )
    expect(generated.code).not.toContain(
      'FG_On_List_Menu_Item_Clicked(0',
    )
  })

  it('escapes content, clamps height, and supports multiple instances', () => {
    const generated = generate(
      list('one', { items: 'A "quoted" item', itemHeight: 1 }),
      list('two', { x: 300, title: '', items: ['Alpha', 'Beta'] }),
    )

    expect(generated.code).toContain(
      'lv_list_add_button(obj1, NULL, "A \\"quoted\\" item");',
    )
    expect(generated.code).toContain(
      'lv_obj_set_height(obj1_item_0, 24);',
    )
    expect(generated.code).toContain(
      'lv_obj_t * obj2 = lv_list_create(fg_application_page);',
    )
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_List_One_Item_Clicked',
      'FG_On_List_Two_Item_Clicked',
    ]))
    expect(generated.code).toContain(
      '{ 1, "Beta", FG_On_List_Two_Item_Clicked };',
    )
  })

  it('allocates collision-safe hooks for duplicate widget names', () => {
    const generated = generate(
      { ...list('a'), componentName: 'System Menu' },
      { ...list('b'), componentName: 'System Menu' },
      { ...list('c'), componentName: 'Wifi List' },
    )

    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_System_Menu_Item_Clicked',
      'FG_On_System_Menu_2_Item_Clicked',
      'FG_On_Wifi_List_Item_Clicked',
    ]))
    expect(generated.code.match(/fg_list_item_clicked_cb/g)?.length)
      .toBeGreaterThan(3)
    expect(generated.code.match(
      /static void fg_list_item_clicked_cb\(lv_event_t \* event\)/g,
    )).toHaveLength(1)
  })

  it('emits no list feature code when unused', () => {
    const generated = generate()
    expect(generated.code).not.toContain('lv_list_')
    expect(generated.code).not.toContain('fg_list_item_clicked_cb')
    expect(generated.userEventHooks).toEqual([])
  })
})
