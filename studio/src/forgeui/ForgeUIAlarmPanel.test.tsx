import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { createForgeUIAlarmSimulation, normalizeForgeUIAlarmPanel } from './ForgeUIAlarmPanel'
import { ForgeUIAlarmPanelPreview } from './preview/ForgeUIAlarmPanelPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'

describe('ForgeUI Alarm Panel', () => {
  it('normalizes fixed capacity, filtering and alarm records', () => {
    const model = normalizeForgeUIAlarmPanel({ maximumAlarms: 50, displayMode: 'banner', alarms: [{ id: 'TEMP', title: 'Temperature', severity: 'critical' }] })
    expect(model.maximumAlarms).toBe(64)
    expect(model.alarms[0]).toMatchObject({ id: 'TEMP', severity: 'critical', active: true, acknowledged: false })
  })

  it('provides deterministic preview scenarios', () => {
    expect(createForgeUIAlarmSimulation('multiple').map(item => item.id)).toEqual(['ENGINE_TEMP', 'DC_BUS_LOW', 'NETWORK'])
    expect(createForgeUIAlarmSimulation('alarm-storm')).toHaveLength(12)
  })

  it('registers and renders as Native Component #6', () => {
    expect(getForgeUIWidgetDefinition('AlarmPanel')).toMatchObject({ displayName: 'Alarm Panel', origin: 'forgeui-native', defaultWidth: 440, capabilities: { supportsRuntimeApi: true, supportsUserEvents: true } })
    render(<ChakraProvider><ForgeUIAlarmPanelPreview component={{ id: 'main-alarm', type: 'AlarmPanel', parent: 'root', children: [], props: { simulationMode: 'critical' } }} palette={FG_PREVIEW_PALETTES.graphite} /></ChakraProvider>)
    expect(screen.getByTestId('forgeui-alarm-panel')).toBeInTheDocument()
    expect(screen.getByText('Engine Temperature High')).toBeInTheDocument()
  })
})
