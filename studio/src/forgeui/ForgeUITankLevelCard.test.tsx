import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { normalizeForgeUITankLevelCard } from './ForgeUITankLevelCard'
import { ForgeUITankLevelCardPreview } from './preview/ForgeUITankLevelCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'

const component = (id: string, props: Record<string, unknown> = {}): IComponent => ({ id, parent: 'root', type: 'TankLevelCard', children: [], props: { w: 320, h: 230, ...props } })

describe('Tank Level Card', () => {
  it('normalizes values, thresholds, shapes, and colours', () => {
    expect(normalizeForgeUITankLevelCard({ level: 140, criticalLevel: 30, lowLevel: 10, highLevel: 5, tankShape: 'bad', fillColour: 'bad', capacity: -1 })).toMatchObject({ level: 120, criticalLevel: 30, lowLevel: 30, highLevel: 30, tankShape: 'cylindrical', fillColour: '#38BDF8', capacity: 0 })
  })

  it('renders themed independent normal and overflow instances', () => {
    render(<ChakraProvider><><ForgeUITankLevelCardPreview component={component('a', { title: 'Water Tank', level: 72 })} palette={FG_PREVIEW_PALETTES.graphite} /><ForgeUITankLevelCardPreview component={component('b', { title: 'Fuel Tank', level: 110 })} palette={FG_PREVIEW_PALETTES.nordic_ice} /></></ChakraProvider>)
    expect(screen.getByText('Water Tank')).toBeInTheDocument(); expect(screen.getByText('Fuel Tank')).toBeInTheDocument(); expect(screen.getByText('OVERFLOW')).toBeInTheDocument(); expect(screen.getAllByTestId('forgeui-tank-level-card')).toHaveLength(2)
  })
})
