import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { normalizeForgeUIDashboardCard } from './ForgeUIDashboardCard'
import { ForgeUIDashboardCardPreview } from './preview/ForgeUIDashboardCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const card = (id: string, componentName: string, props: Record<string, unknown> = {}): IComponent => ({
  id, componentName, type: 'DashboardCard', parent: 'root', children: [],
  props: { x: 20, y: 30, w: 300, h: 190, ...props },
})

describe('ForgeUI Dashboard Card', () => {
  it('normalizes versioned semantic properties without internal children', () => {
    const model = normalizeForgeUIDashboardCard({ progress: 140, status: 'bad', padding: -2 })
    expect(model).toMatchObject({ schemaVersion: 1, progress: 100, status: 'normal', padding: 0 })
  })

  it('registers as the first ForgeUI Native Dashboard component', () => {
    expect(getForgeUIWidgetDefinition('DashboardCard')).toMatchObject({
      displayName: 'Dashboard Card', category: 'Dashboard', origin: 'forgeui-native',
      nativeWidgetSchemaVersion: 1,
      platform: { kind: 'native-widget', family: 'dashboard' },
      capabilities: { supportsRuntimeApi: true, supportsUserEvents: true, childOwnership: 'none' },
      documentationId: 'docs/FORGEUI_DASHBOARD_CARD.md',
    })
  })

  it('renders its semantic composition as one preview component', () => {
    render(<ChakraProvider><ForgeUIDashboardCardPreview
      component={card('card', 'Power Card', { title: 'Power', value: '2.4', units: 'kW', statusText: 'Online' })}
      palette={FG_PREVIEW_PALETTES.graphite}
    /></ChakraProvider>)
    expect(screen.getByTestId('forgeui-dashboard-card')).toHaveTextContent('Power')
    expect(screen.getByTestId('forgeui-dashboard-card')).toHaveTextContent('2.4')
    expect(screen.getByTestId('forgeui-dashboard-card')).toHaveTextContent('kW')
    expect(screen.getByTestId('forgeui-dashboard-card')).toHaveTextContent('Online')
  })

  it('exports readable composite LVGL, semantic APIs and collision-safe click hooks', () => {
    const first = card('card-a', 'Power Card', { enableClick: true, progress: 64 })
    const second = card('card-b', 'Power Card', { enableClick: true, value: '18.2' })
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: [first.id, second.id], props: {} },
      [first.id]: first, [second.id]: second,
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('lv_obj_t * fg_power_card_dashboard_card_value')
    expect(generated.code).toContain('lv_bar_create(fg_power_card_dashboard_card)')
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Power_Card_Value(const char * value);',
      'void FG_Set_Power_Card_Status(const char * text, uint32_t rgb);',
      'void FG_Set_Power_Card_Progress(int32_t value);',
      'void FG_Set_Power_Card_2_Value(const char * value);',
    ]))
    expect(generated.userEventHooks).toEqual([
      'FG_On_Power_Card_Clicked', 'FG_On_Power_Card_2_Clicked',
    ])
  })
})
