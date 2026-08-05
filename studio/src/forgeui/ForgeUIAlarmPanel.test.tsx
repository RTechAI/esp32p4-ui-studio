import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { normalizeForgeUIAlarmPanel } from './ForgeUIAlarmPanel'
import { ForgeUIAlarmPanelPreview } from './preview/ForgeUIAlarmPanelPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'

const component = (props: Record<string, unknown> = {}): IComponent => ({
  id: 'alarm-panel-1', parent: 'root', type: 'AlarmPanel', children: [],
  props: { w: 420, h: 300, ...props },
})

describe('ForgeUI Alarm Panel', () => {
  it('normalizes bounded semantic configuration and records', () => {
    const model = normalizeForgeUIAlarmPanel({ alarmCapacity: 99, maximumVisibleAlarms: 0,
      alarms: [{ id: 'a', message: 'Pressure', state: 'warning', priority: 'critical' }] })
    expect(model.alarmCapacity).toBe(32)
    expect(model.maximumVisible).toBe(1)
    expect(model.alarms[0]).toMatchObject({ id: 'a', message: 'Pressure', state: 'warning', priority: 'critical' })
  })

  it('renders separate alarm rows using the shared semantic palette', () => {
    render(<ChakraProvider><ForgeUIAlarmPanelPreview component={component()} palette={FG_PREVIEW_PALETTES.graphite} /></ChakraProvider>)
    expect(screen.getByTestId('forgeui-alarm-panel')).toHaveTextContent('Active Alarms')
    expect(screen.getAllByTestId('alarm-panel-row')).toHaveLength(3)
    expect(screen.getByText('High discharge pressure')).toBeInTheDocument()
  })

  it('keeps multiple preview instances isolated', () => {
    render(<ChakraProvider><><ForgeUIAlarmPanelPreview component={component({ title: 'A', alarms: [{ id: 'a', message: 'Alpha' }] })} palette={FG_PREVIEW_PALETTES.graphite} /><ForgeUIAlarmPanelPreview component={{ ...component({ title: 'B', alarms: [{ id: 'b', message: 'Beta' }] }), id: 'alarm-panel-2' }} palette={FG_PREVIEW_PALETTES.nordic_ice} /></></ChakraProvider>)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })
})
