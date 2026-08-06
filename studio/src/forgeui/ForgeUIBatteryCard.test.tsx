import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { normalizeForgeUIBatteryCard } from './ForgeUIBatteryCard'
import { ForgeUIBatteryCardPreview } from './preview/ForgeUIBatteryCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'

const component = (id: string, props: Record<string, unknown> = {}): IComponent => ({ id, parent: 'root', type: 'BatteryCard', children: [], props: { w: 300, h: 220, ...props } })
describe('Battery Card', () => {
  it('normalizes ranges, thresholds, health, and colours', () => {
    expect(normalizeForgeUIBatteryCard({ percentage: 140, criticalThreshold: 30, lowThreshold: 10, health: 'bad', normalColour: 'bad' })).toMatchObject({ percentage: 100, criticalThreshold: 30, lowThreshold: 30, health: 'good', normalColour: '#22C55E' })
  })
  it('renders telemetry and isolates duplicate instances across themes', () => {
    render(<ChakraProvider><><ForgeUIBatteryCardPreview component={component('a', { title: 'UPS A', percentage: 81 })} palette={FG_PREVIEW_PALETTES.graphite} /><ForgeUIBatteryCardPreview component={component('b', { title: 'UPS B', percentage: 19 })} palette={FG_PREVIEW_PALETTES.nordic_ice} /></></ChakraProvider>)
    expect(screen.getByText('UPS A')).toBeInTheDocument(); expect(screen.getByText('UPS B')).toBeInTheDocument(); expect(screen.getByText('81')).toBeInTheDocument(); expect(screen.getByText('19')).toBeInTheDocument()
  })
})
