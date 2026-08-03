import React, { useMemo } from 'react'
import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { networkSignalQuality, normalizeForgeUINetworkStatusCard, simulateForgeUINetworkStatus } from '../ForgeUINetworkStatusCard'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUINetworkStatusCardPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = useMemo(() => simulateForgeUINetworkStatus(normalizeForgeUINetworkStatusCard(component.props)), [component.props])
  const theme = resolveForgeSemanticPalette(palette)
  const accent = ['fault', 'authentication-failed', 'offline'].includes(model.state) ? theme.healthCritical : model.state === 'degraded' ? theme.healthHigh : theme.healthNormal
  const signal = networkSignalQuality(model.rssi)
  const field = (label: string, value: React.ReactNode) => <Flex key={label} justify="space-between" gap="8px"><Text color={theme.textSecondary}>{label}</Text><Text fontWeight="700">{value}</Text></Flex>
  return <Flex data-testid="forgeui-network-status-card" direction="column" w="100%" h="100%" overflow="hidden" p="13px" gap="9px" color={theme.textPrimary} background={model.glassStyle ? `linear-gradient(155deg,${theme.surface},${theme.surfaceSecondary})` : theme.surface} border="1px solid" borderColor={theme.surfaceBorder} borderRadius={model.rounded ? '12px' : 0} boxShadow={model.shadow ? '0 10px 24px rgba(0,0,0,.24)' : 'none'}>
    <Flex justify="space-between" align="start"><Box><Text fontWeight="700">{model.title}</Text><Text fontSize="xs" color={accent}>{model.state.replace('-', ' ').toUpperCase()}</Text></Box>{model.showSignal && <Flex data-testid="network-signal" align="end" gap="2px" h="24px">{[1,2,3,4].map(bar => <Box key={bar} w="5px" h={`${bar * 5}px`} bg={bar <= signal ? accent : theme.surfaceBorder}/>)}</Flex>}</Flex>
    {model.displayMode === 'compact' ? <Text fontSize="sm">{model.showInterface ? model.interfaceType.toUpperCase() : model.statusText}</Text> : <Grid templateColumns={model.displayMode === 'dashboard' ? 'repeat(2,minmax(0,1fr))' : '1fr'} gap="5px" fontSize="xs" overflowY="auto">
      {model.showInterface && field('Interface', model.interfaceType.toUpperCase())}{model.showIp && field('IP', model.ipAddress)}{model.interfaceType === 'wifi' && field('SSID', model.ssid)}{model.showGateway && field('Gateway', model.gateway)}{model.showSignal && field('RSSI', `${model.rssi} dBm`)}{model.showLatency && field('Latency', `${model.latency} ms`)}{model.showUptime && field('Uptime', `${Math.floor(model.uptime / 3600)} h`)}{model.showCloud && field('Cloud', model.cloudConnected ? 'Online' : 'Offline')}{model.showMqtt && field('MQTT', model.mqttConnected ? 'Online' : 'Offline')}{model.displayMode === 'dashboard' && field('Ethernet', model.interfaceType === 'ethernet' ? 'Online' : 'Standby')}{model.displayMode === 'dashboard' && field('Reconnects', model.reconnectCount)}
    </Grid>}
    {model.showStatus && <Text fontSize="11px" color={theme.textSecondary}>{model.statusText}</Text>}
  </Flex>
}
