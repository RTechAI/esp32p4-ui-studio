import { makeStore } from '../core/store'
import { generateId } from '../utils/generateId'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

jest.mock('../utils/generateId')

const mockGenerateId = generateId as jest.MockedFunction<typeof generateId>

const visibleProps = {
  title: 'System Output',
  icon: 'LV_SYMBOL_CHARGE',
  value: '25',
  units: '%',
  secondaryText: 'Operating level',
  status: 'normal',
  statusText: 'Normal',
  progress: 25,
  timestamp: 'Updated now',
  generateRuntimeApi: true,
  enableClick: true,
  x: 20,
  y: 30,
  w: 240,
  h: 145,
}

describe('Dashboard Card duplicate property isolation', () => {
  it('copies visible content verbatim while isolating identity, edits, persistence, and generated names', () => {
    mockGenerateId.mockReturnValueOnce('dashboard-card-b')
    const store = makeStore({} as any) as any

    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'DashboardCard',
      testId: 'dashboard-card-a',
      props: visibleProps,
    })
    store.dispatch.components.setComponentName({
      componentId: 'dashboard-card-a',
      name: 'DashboardCard',
    })
    store.dispatch.components.duplicate()

    let present = store.getState().components.present
    const original = present.components['dashboard-card-a']
    const duplicate = present.components['dashboard-card-b']

    expect(duplicate.id).not.toBe(original.id)
    expect(duplicate.componentName).toBe('DashboardCard1')
    expect(duplicate.props).toEqual(original.props)
    expect(duplicate.props).not.toBe(original.props)
    expect(duplicate.props.title).toBe('System Output')
    expect(duplicate.props.secondaryText).toBe('Operating level')

    store.dispatch.components.select('dashboard-card-b')
    store.dispatch.components.updateProps({ id: 'dashboard-card-b', name: 'title', value: 'Battery Output' })
    store.dispatch.components.updateProps({ id: 'dashboard-card-b', name: 'value', value: '50' })
    store.dispatch.components.updateProps({ id: 'dashboard-card-b', name: 'secondaryText', value: 'Charge demand' })
    store.dispatch.components.select('dashboard-card-a')
    store.dispatch.components.updateProps({ id: 'dashboard-card-a', name: 'value', value: '25' })

    present = store.getState().components.present
    expect(present.components['dashboard-card-a'].props).toMatchObject({
      title: 'System Output', value: '25', secondaryText: 'Operating level',
    })
    expect(present.components['dashboard-card-b'].props).toMatchObject({
      title: 'Battery Output', value: '50', secondaryText: 'Charge demand',
    })

    store.dispatch.components.select('dashboard-card-b')
    expect(store.getState().components.present.components[store.getState().components.present.selectedId].props.title)
      .toBe('Battery Output')
    store.dispatch.components.select('dashboard-card-a')
    expect(store.getState().components.present.components[store.getState().components.present.selectedId].props.title)
      .toBe('System Output')

    const restored = JSON.parse(JSON.stringify(present.components)) as IComponents
    expect(restored['dashboard-card-a'].props).not.toBe(restored['dashboard-card-b'].props)
    expect(restored['dashboard-card-a'].props.title).toBe('System Output')
    expect(restored['dashboard-card-b'].props.title).toBe('Battery Output')

    const generated = generateForgeUILvglCode(restored, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Dashboard_Card_A_Title(const char * title);',
      'void FG_Set_Dashboard_Card_B_Title(const char * title);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Dashboard_Card_A_Clicked',
      'FG_On_Dashboard_Card_B_Clicked',
    ]))
    expect(generated.code).toMatch(/lv_label_set_text\([^,]+, "System Output"\)/)
    expect(generated.code).toMatch(/lv_label_set_text\([^,]+, "Battery Output"\)/)
    expect(generated.code).toMatch(/lv_label_set_text\([^,]+, "Operating level"\)/)
    expect(generated.code).toMatch(/lv_label_set_text\([^,]+, "Charge demand"\)/)
  })
})
