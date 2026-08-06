import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { normalizeForgeUIIOMonitor } from './ForgeUIIOMonitor'
import { ForgeUIIOMonitorPreview } from './preview/ForgeUIIOMonitorPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'

const component = (id: string, props: Record<string, unknown> = {}): IComponent => ({
  id, parent: 'root', type: 'IOMonitor', children: [], props: { w: 420, h: 300, ...props },
})

describe('ForgeUI IO Monitor', () => {
  it('normalizes bounded semantic rows and safe properties', () => {
    const model = normalizeForgeUIIOMonitor({ maximumRows: 99, rows: [{ id: 'x', ioType: 'analog-input', channel: 'AI7', displayName: 'Pressure', value: 4.62, units: 'bar', colour: 'bad' }] })
    expect(model.maximumRows).toBe(32)
    expect(model.rows[0]).toMatchObject({ id: 'x', ioType: 'analog-input', channel: 'AI7', displayName: 'Pressure', value: 4.62, units: 'bar', colour: '#38BDF8' })
  })

  it('renders visible digital and analogue rows with semantic values', () => {
    render(<ChakraProvider><ForgeUIIOMonitorPreview component={component('io-a')} palette={FG_PREVIEW_PALETTES.graphite} /></ChakraProvider>)
    expect(screen.getByTestId('forgeui-io-monitor')).toHaveTextContent('IO Monitor')
    expect(screen.getAllByTestId('io-monitor-row')).toHaveLength(4)
    expect(screen.getByText('4.62 bar')).toBeInTheDocument()
  })

  it('keeps duplicate preview instances independent', () => {
    render(<ChakraProvider><><ForgeUIIOMonitorPreview component={component('io-a', { title: 'Plant A', rows: [{ id: 'a', channel: 'DI1', displayName: 'Door A' }] })} palette={FG_PREVIEW_PALETTES.graphite} /><ForgeUIIOMonitorPreview component={component('io-b', { title: 'Plant B', rows: [{ id: 'b', channel: 'DI2', displayName: 'Door B' }] })} palette={FG_PREVIEW_PALETTES.nordic_ice} /></></ChakraProvider>)
    expect(screen.getByText('Door A')).toBeInTheDocument()
    expect(screen.getByText('Door B')).toBeInTheDocument()
  })
})
