import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { FORGEUI_BATTERY_CARD_DEFAULT_SIZE, FORGEUI_BATTERY_CARD_MIN_SIZE, normalizeForgeUIBatteryCard } from './ForgeUIBatteryCard'
import { ForgeUIBatteryCardPreview } from './preview/ForgeUIBatteryCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { renderForgePreview } from './preview/forgePreviewRenderer'

const component = (id: string, props: Record<string, unknown> = {}): IComponent => ({ id, parent: 'root', type: 'BatteryCard', children: [], props: { w: 240, h: 145, ...props } })
describe('Battery Card', () => {
  it('normalizes ranges, thresholds, health, and colours', () => {
    expect(normalizeForgeUIBatteryCard({ percentage: 140, criticalThreshold: 30, lowThreshold: 10, health: 'bad', normalColour: 'bad' })).toMatchObject({ percentage: 100, criticalThreshold: 30, lowThreshold: 30, health: 'good', normalColour: '#22C55E' })
  })
  it('uses stackable default and minimum geometry', () => {
    expect(FORGEUI_BATTERY_CARD_DEFAULT_SIZE).toEqual({ width: 240, height: 145 })
    expect(FORGEUI_BATTERY_CARD_MIN_SIZE).toEqual({ width: 220, height: 128 })
  })
  it('renders telemetry and isolates duplicate instances across themes', () => {
    render(<ChakraProvider><><ForgeUIBatteryCardPreview component={component('a', { title: 'UPS A', percentage: 81 })} palette={FG_PREVIEW_PALETTES.graphite} /><ForgeUIBatteryCardPreview component={component('b', { title: 'UPS B', percentage: 19 })} palette={FG_PREVIEW_PALETTES.nordic_ice} /></></ChakraProvider>)
    expect(screen.getByText('UPS A')).toBeInTheDocument(); expect(screen.getByText('UPS B')).toBeInTheDocument(); expect(screen.getByText('81')).toBeInTheDocument(); expect(screen.getByText('19')).toBeInTheDocument()
  })
  it.each([[5, false], [50, false], [88, true], [100, false]])('renders %i percent telemetry cleanly', (percentage, charging) => {
    render(<ChakraProvider><ForgeUIBatteryCardPreview component={component(`battery-${percentage}`, { percentage, charging, w: percentage === 100 ? 220 : 240, h: percentage === 100 ? 128 : 145 })} palette={FG_PREVIEW_PALETTES.graphite} /></ChakraProvider>)
    expect(screen.getByText(String(percentage))).toBeInTheDocument()
    expect(screen.getByTestId('forgeui-battery-icon-fill')).toHaveAttribute('data-level', String(percentage))
    expect(screen.getByTestId('forgeui-battery-progress')).toBeInTheDocument()
    expect(screen.getByText('31.5 °C')).toBeInTheDocument()
    if (charging) expect(screen.getByText('⚡ CHARGING')).toBeInTheDocument()
  })
  it('routes the same compact card through the shared Browser/Live renderer', () => {
    const child = component('battery-live', { title: 'Live Battery', percentage: 50 })
    const components: any = { root: { id: 'root', parent: 'root', type: 'Box', children: [child.id], props: { w: 1024, h: 600 } }, [child.id]: child }
    const Harness = () => <>{renderForgePreview({ component: components.root, components })}</>
    render(<ChakraProvider><Harness /></ChakraProvider>)
    expect(screen.getByText('Live Battery')).toBeInTheDocument(); expect(screen.getByText('50')).toBeInTheDocument()
  })
})
