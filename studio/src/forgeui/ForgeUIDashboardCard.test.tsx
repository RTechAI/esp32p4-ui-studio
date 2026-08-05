import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { normalizeForgeUIDashboardCard } from './ForgeUIDashboardCard'
import { ForgeUIDashboardCardPreview } from './preview/ForgeUIDashboardCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'
import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { getPreviewDefaultProps } from '../utils/defaultProps'

const card = (id: string, componentName: string, props: Record<string, unknown> = {}): IComponent => ({
  id, componentName, type: 'DashboardCard', parent: 'root', children: [],
  props: { x: 20, y: 30, w: 300, h: 190, ...props },
})

describe('ForgeUI Dashboard Card', () => {
  it('uses compact semantic and insertion defaults for newly created cards', () => {
    expect(getPreviewDefaultProps('DashboardCard')).toMatchObject({
      w: 240, h: 145, padding: 12, icon: '', secondaryText: 'Operating level', timestamp: 'Now',
    })
    expect(normalizeForgeUIDashboardCard()).toMatchObject({
      padding: 12, icon: '', secondaryText: 'Operating level', timestamp: 'Now',
    })
    expect(getForgeUIWidgetDefinition('DashboardCard')).toMatchObject({
      defaultWidth: 240, defaultHeight: 145,
    })
  })

  it('preserves explicitly saved dimensions and semantic values', () => {
    const saved = card('legacy', 'Legacy Card', {
      w: 300, h: 190, padding: 16, icon: 'LV_SYMBOL_CHARGE',
      secondaryText: 'Current operating level', timestamp: 'Updated now',
    })
    expect(saved.props).toMatchObject({ w: 300, h: 190 })
    expect(normalizeForgeUIDashboardCard(saved.props)).toMatchObject({
      padding: 16, icon: 'LV_SYMBOL_CHARGE',
      secondaryText: 'Current operating level', timestamp: 'Updated now',
    })
  })

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
    expect(screen.getByTestId('forgeui-dashboard-card')).toHaveStyle({ borderRadius: '8px', padding: '12px' })
  })

  it('renders no placeholder or reserved icon content when the icon is empty', () => {
    render(<ChakraProvider><ForgeUIDashboardCardPreview
      component={card('card', 'Compact Card', { icon: '', w: 240, h: 145 })}
      palette={FG_PREVIEW_PALETTES.graphite}
    /></ChakraProvider>)
    expect(screen.queryByLabelText('Dashboard card icon')).not.toBeInTheDocument()
    expect(screen.getByTestId('forgeui-dashboard-card')).not.toHaveTextContent('CHARGE')
  })

  it('collapses hidden sections without rendering spacer content', () => {
    render(<ChakraProvider><ForgeUIDashboardCardPreview
      component={card('card', 'Minimal Card', {
        showHeader: false, showProgress: false, showFooter: false, secondaryText: '',
      })}
      palette={FG_PREVIEW_PALETTES.graphite}
    /></ChakraProvider>)
    const preview = screen.getByTestId('forgeui-dashboard-card')
    expect(preview.children).toHaveLength(1)
    expect(preview).not.toHaveStyle({ gap: '8px' })
  })

  it('exports readable composite LVGL, semantic APIs and collision-safe click hooks', () => {
    const first = card('card-a', 'Power Card', { enableClick: true, progress: 64 })
    const second = card('card-b', 'Power Card', { enableClick: true, value: '18.2' })
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: [first.id, second.id], props: {} },
      [first.id]: first, [second.id]: second,
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('lv_obj_t * fg_card_a_dashboard_card_value')
    expect(generated.code).toContain('lv_bar_create(fg_card_a_dashboard_card)')
    expect(generated.code).toContain('lv_obj_set_style_radius(fg_card_a_dashboard_card, 8, LV_PART_MAIN)')
    expect(generated.code).toContain('lv_obj_set_style_border_color(fg_card_a_dashboard_card, lv_color_hex(0x2A3138), LV_PART_MAIN)')
    expect(generated.code).toContain('lv_obj_set_size(fg_card_a_dashboard_card_progress, 276, 6)')
    expect(generated.code).not.toMatch(/lv_obj_t \* obj\d+ = fg_card_[ab]_dashboard_card;/)
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Card_A_Title(const char * title);',
      'void FG_Set_Card_A_Value(const char * value);',
      'void FG_Set_Card_A_Units(const char * units);',
      'void FG_Set_Card_A_Description(const char * description);',
      'void FG_Set_Card_A_Status(const char * text, uint32_t rgb);',
      'void FG_Set_Card_A_Progress(int32_t value);',
      'void FG_Set_Card_A_Footer(const char * footer);',
      'void FG_Set_Card_A_Colour(uint32_t rgb);',
      'void FG_Set_Card_B_Value(const char * value);',
    ]))
    generated.publicApiDeclarations.forEach(declaration => {
      expect(generated.code).toContain(declaration.replace(/;$/, ''))
    })
    expect(generated.userEventHooks).toEqual([
      'FG_On_Card_A_Clicked', 'FG_On_Card_B_Clicked',
    ])
  })

  it('exports compact 240 x 145 geometry without an empty icon object', () => {
    const compact = card('compact', 'Compact Card', {
      w: 240, h: 145, icon: '', padding: 12, secondaryText: 'Operating level', timestamp: 'Now',
    })
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: [compact.id], props: {} },
      [compact.id]: compact,
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('lv_obj_set_size(fg_compact_dashboard_card, 240, 145)')
    expect(generated.code).toContain('lv_obj_set_pos(fg_compact_dashboard_card_title, 12, 12)')
    expect(generated.code).toContain('lv_obj_set_size(fg_compact_dashboard_card_status_indicator, 6, 6)')
    expect(generated.code).toContain('lv_obj_set_size(fg_compact_dashboard_card_progress, 216, 6)')
    expect(generated.code).not.toContain('compact_icon')
    expect(generated.code).not.toContain('LV_SYMBOL_BULLET')
  })

  it('retains the compact layout when explicitly sized to 240 x 150', () => {
    const compact = card('compact-150', 'Compact 150 Card', { w: 240, h: 150, icon: '' })
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: [compact.id], props: {} },
      [compact.id]: compact,
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('lv_obj_set_size(fg_compact150_dashboard_card, 240, 150)')
    expect(generated.code).toContain('lv_obj_set_size(fg_compact150_dashboard_card_progress, 216, 6)')
  })

  it('omits declarations and implementations when Runtime API generation is disabled', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['card'], props: {} },
      card: card('card', 'Private Card', { generateRuntimeApi: false }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.publicApiDeclarations.join('\n')).not.toContain('FG_Set_Card_')
    expect(generated.code).not.toContain('void FG_Set_Card_')
  })
})
