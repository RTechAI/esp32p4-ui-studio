import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { FORGEUI_POWER_FLOW_MAX_CONNECTIONS, FORGEUI_POWER_FLOW_MAX_NODES, formatForgeUIPower, normalizeForgeUIPowerFlowCard, simulateForgeUIPowerFlow } from './ForgeUIPowerFlowCard'
import { ForgeUIPowerFlowCardPreview } from './preview/ForgeUIPowerFlowCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'

describe('Power Flow Card', () => {
  it('creates fixed semantic nodes and connections', () => {
    const model = normalizeForgeUIPowerFlowCard()
    expect(model.nodes).toHaveLength(FORGEUI_POWER_FLOW_MAX_NODES)
    expect(model.connections).toHaveLength(FORGEUI_POWER_FLOW_MAX_CONNECTIONS)
    expect(model.nodes.find(node => node.type === 'battery')?.power).toBe(-500)
  })
  it('formats signed power without ambiguity', () => {
    expect(formatForgeUIPower(-500)).toBe('-500 W')
    expect(formatForgeUIPower(3200)).toBe('3.20 kW')
  })
  it('simulates deterministically without calculating balance', () => {
    expect(simulateForgeUIPowerFlow(normalizeForgeUIPowerFlowCard({ simulationMode: 'grid-exporting', systemBalance: 123 }))).toMatchObject({ state: 'exporting', gridPower: -1400, systemBalance: 123 })
  })
  it('registers and renders #13', () => {
    expect(getForgeUIWidgetDefinition('PowerFlowCard')).toMatchObject({ displayName: 'Power Flow Card', origin: 'forgeui-native', defaultWidth: 520 })
    render(<ChakraProvider><ForgeUIPowerFlowCardPreview component={{ id: 'main', type: 'PowerFlowCard', parent: 'root', children: [], props: { simulationMode: 'solar-supplying-load' } }} palette={FG_PREVIEW_PALETTES.graphite}/></ChakraProvider>)
    expect(screen.getByTestId('power-flow-nodes')).toBeInTheDocument()
    expect(screen.getAllByText('3.20 kW')).toHaveLength(2)
  })
})
