import fs from 'fs'
import path from 'path'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const dashboardCard = (id: string, title: string, x: number): IComponent => ({
  id,
  componentName: title,
  type: 'DashboardCard',
  parent: 'root',
  children: [],
  props: {
    nativeWidgetSchemaVersion: 1,
    title,
    icon: '',
    value: id === 'dashboard-card-a' ? '72' : '48',
    units: '%',
    secondaryText: 'Operating level',
    status: 'normal',
    statusText: 'Normal',
    progress: id === 'dashboard-card-a' ? 72 : 48,
    timestamp: 'Ready for touch',
    accentColor: id === 'dashboard-card-a' ? '#14B8A6' : '#F2A900',
    padding: 12,
    showHeader: true,
    showFooter: true,
    showProgress: true,
    showStatus: true,
    generateRuntimeApi: true,
    enableClick: true,
    positionMode: 'absolute',
    x,
    y: 180,
    w: 240,
    h: 145,
  },
})

it('writes the temporary two-card physical proof export payload', () => {
  const first = dashboardCard('dashboard-card-a', 'Dashboard Card A', 220)
  const second = dashboardCard('dashboard-card-b', 'Dashboard Card B', 564)
  const result = generateForgeUILvglCode({
    root: { id: 'root', type: 'Box', parent: 'root', children: [first.id, second.id], props: {} },
    [first.id]: first,
    [second.id]: second,
  }, 'graphite', undefined, { includeThemeTexture: false })

  expect(result.userEventHooks).toEqual([
    'FG_On_Dashboard_Card_A_Clicked',
    'FG_On_Dashboard_Card_B_Clicked',
  ])
  expect(result.code).not.toMatch(/lv_obj_t \* obj\d+ = fg_dashboard_card_[ab]_dashboard_card;/)
  fs.writeFileSync(path.resolve(__dirname, '../../../dashboard-card-physical-proof-payload.json'), JSON.stringify({
    code: result.code,
    assetSources: result.assetSources,
    userEventHooks: result.userEventHooks,
    publicApiDeclarations: result.publicApiDeclarations,
  }))
})
