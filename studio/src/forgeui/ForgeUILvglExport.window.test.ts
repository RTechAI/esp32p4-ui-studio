import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'

const root = (windows: IComponent[], extras: IComponent[] = []): IComponents => ({
  root: { id: 'root', type: 'Box', parent: 'root', props: {}, children: windows.map(item => item.id) },
  ...Object.fromEntries([...windows, ...extras].map(item => [item.id, item])),
})

const win = (id: string, children: string[] = [], props: any = {}): IComponent => ({
  id, type: 'Window', parent: 'root', componentName: id, children,
  props: { x: 20, y: 30, w: 420, h: 300, title: 'Control panel', showIcon: true,
    showCloseButton: true, headerHeight: 52, contentPadding: 10, scrollingEnabled: true,
    scrollbarMode: 'auto', ...props },
})

describe('ForgeUI native Window pipeline', () => {
  it('registers Window as a structured native container with serializable defaults', () => {
    const definition = getForgeUIWidgetDefinition('Window')
    expect(definition).toMatchObject({ displayName: 'Window', defaultWidth: 420, defaultHeight: 300,
      capabilities: { supportsChildren: true, childOwnership: 'structured', featureGate: {
        lvglConfigDependencies: ['CONFIG_LV_USE_WIN'],
      } } })
    expect(JSON.parse(JSON.stringify(definition?.defaultProperties))).toEqual(definition?.defaultProperties)
  })

  it('exports native header controls and parents descendants to Window content', () => {
    const child: IComponent = { id: 'inside', type: 'Text', parent: 'panel', componentName: 'inside',
      children: [], props: { x: 7, y: 9, w: 100, h: 30, children: 'Inside' } }
    const generated = generateForgeUILvglCode(root([win('panel', ['inside'])], [child]), 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('lv_obj_t * obj1 = lv_win_create(')
    expect(generated.code).toContain('lv_obj_t * obj1_header = lv_win_get_header(obj1)')
    expect(generated.code).toContain('lv_obj_t * obj1_title = lv_win_add_title(obj1, "Control panel")')
    expect(generated.code).toContain('LV_SYMBOL_CLOSE')
    expect(generated.code).toContain('lv_obj_t * obj1_content = lv_win_get_content(obj1)')
    expect(generated.code).toContain('lv_obj_t * obj2 = lv_label_create(obj1_content)')
  })

  it('keeps multiple instances collision-safe and omits disabled optional controls', () => {
    const generated = generateForgeUILvglCode(root([
      win('first', [], { showIcon: false, showCloseButton: false }),
      win('second', [], { title: 'Second' }),
    ]), 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code.match(/lv_win_create/g)).toHaveLength(2)
    expect(generated.code).not.toContain('obj1_icon')
    expect(generated.code).not.toContain('obj1_close')
    expect(generated.code).toContain('obj2_close')
  })
})
