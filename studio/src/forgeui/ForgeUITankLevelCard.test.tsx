import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { FORGEUI_TANK_LEVEL_CARD_DEFAULT_SIZE, FORGEUI_TANK_LEVEL_CARD_MIN_SIZE, normalizeForgeUITankLevelCard } from './ForgeUITankLevelCard'
import { ForgeUITankLevelCardPreview } from './preview/ForgeUITankLevelCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { renderForgePreview } from './preview/forgePreviewRenderer'

const component = (id: string, props: Record<string, unknown> = {}): IComponent => ({ id, parent: 'root', type: 'TankLevelCard', children: [], props: { w: 240, h: 145, ...props } })

describe('Tank Level Card', () => {
  it('normalizes values, thresholds, shapes, and colours', () => {
    expect(normalizeForgeUITankLevelCard({ level: 140, criticalLevel: 30, lowLevel: 10, highLevel: 5, tankShape: 'bad', fillColour: 'bad', capacity: -1 })).toMatchObject({ level: 120, criticalLevel: 30, lowLevel: 30, highLevel: 30, tankShape: 'cylindrical', fillColour: '#38BDF8', capacity: 0 })
  })

  it('uses stackable default and minimum geometry',()=>{expect(FORGEUI_TANK_LEVEL_CARD_DEFAULT_SIZE).toEqual({width:240,height:145}); expect(FORGEUI_TANK_LEVEL_CARD_MIN_SIZE).toEqual({width:220,height:128})})

  it('renders themed independent normal and overflow instances', () => {
    render(<ChakraProvider><><ForgeUITankLevelCardPreview component={component('a', { title: 'Water Tank', level: 72 })} palette={FG_PREVIEW_PALETTES.graphite} /><ForgeUITankLevelCardPreview component={component('b', { title: 'Fuel Tank', level: 110 })} palette={FG_PREVIEW_PALETTES.nordic_ice} /></></ChakraProvider>)
    expect(screen.getByText('Water Tank')).toBeInTheDocument(); expect(screen.getByText('Fuel Tank')).toBeInTheDocument(); expect(screen.getByText('OVERFLOW')).toBeInTheDocument(); expect(screen.getAllByTestId('forgeui-tank-level-card')).toHaveLength(2)
  })

  it.each([[0,'0%'],[18,'18%'],[50,'50%'],[87,'87%'],[100,'100%']])('renders %i percent without hiding the fill or value',(level,label)=>{
    render(<ChakraProvider><ForgeUITankLevelCardPreview component={component(`tank-${level}`,{level,w:level===100?220:240,h:level===100?128:145})} palette={FG_PREVIEW_PALETTES.graphite}/></ChakraProvider>); expect(screen.getByText(label)).toBeInTheDocument(); expect(screen.getByTestId('forgeui-tank-fill')).toHaveAttribute('data-level',String(level)); expect(screen.getByLabelText('tank icon')).toBeInTheDocument()
  })

  it('routes the same card through the shared Browser/Live preview renderer',()=>{const child=component('tank-live',{title:'Live Tank',level:50}); const components:any={root:{id:'root',parent:'root',type:'Box',children:[child.id],props:{w:1024,h:600}},[child.id]:child}; const Harness=()=> <>{renderForgePreview({component:components.root,components})}</>; render(<ChakraProvider><Harness/></ChakraProvider>); expect(screen.getByText('Live Tank')).toBeInTheDocument(); expect(screen.getByText('50%')).toBeInTheDocument()})
})
