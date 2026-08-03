import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { networkSignalQuality, normalizeForgeUINetworkStatusCard, simulateForgeUINetworkStatus } from './ForgeUINetworkStatusCard'
import { ForgeUINetworkStatusCardPreview } from './preview/ForgeUINetworkStatusCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'

describe('Network Status Card', () => {
  it('normalizes bounded semantic data', () => {
    expect(normalizeForgeUINetworkStatusCard({ state: 'bad', rssi: -500, latency: -2, packetLoss: 120 })).toMatchObject({ state: 'online', rssi: -127, latency: 0, packetLoss: 100 })
    expect(networkSignalQuality(-58)).toBe(3)
  })
  it('provides deterministic scenarios', () => expect(simulateForgeUINetworkStatus(normalizeForgeUINetworkStatusCard({ simulationMode: 'authentication-failed' }))).toMatchObject({ state: 'authentication-failed', internetAvailable: false }))
  it('registers and renders Native Component #10', () => {
    expect(getForgeUIWidgetDefinition('NetworkStatusCard')).toMatchObject({ displayName: 'Network Status Card', origin: 'forgeui-native', defaultWidth: 380 })
    render(<ChakraProvider><ForgeUINetworkStatusCardPreview component={{ id: 'main', type: 'NetworkStatusCard', parent: 'root', children: [], props: { simulationMode: 'wifi-connected' } }} palette={FG_PREVIEW_PALETTES.graphite}/></ChakraProvider>)
    expect(screen.getByTestId('network-signal')).toBeInTheDocument()
    expect(screen.getByText('Workshop WiFi')).toBeInTheDocument()
  })
})
