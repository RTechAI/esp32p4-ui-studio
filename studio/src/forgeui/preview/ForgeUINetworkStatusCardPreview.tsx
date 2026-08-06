import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { FiWifi, FiServer, FiRadio } from 'react-icons/fi'
import { normalizeForgeUINetworkStatusCard } from '../ForgeUINetworkStatusCard'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUINetworkStatusCardPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUINetworkStatusCard(component.props); const theme = resolveForgeSemanticPalette(palette)
  const colour = model.connected ? model.accentColour : model.disconnectedColour
  const typeLabel = ({ wifi: 'Wi-Fi', ethernet: 'Ethernet', cellular: 'Cellular', other: 'Network' } as const)[model.networkType]
  const Icon = model.networkType === 'wifi' ? FiWifi : model.networkType === 'cellular' ? FiRadio : FiServer
  return <Flex data-testid="forgeui-network-status-card" pointerEvents="none" direction="column" width="100%" height="100%" overflow="hidden" bg={theme.surface} color={theme.textPrimary} border={`1px solid ${theme.surfaceBorder}`} borderRadius="10px" p={model.compactMode ? '8px' : '12px'} gap={model.compactMode ? '7px' : '10px'}>
    <Flex justify="space-between" align="center"><Text fontWeight="700" fontSize={model.compactMode ? '12px' : '14px'} noOfLines={1}>{model.title}</Text><Flex align="center" gap="5px" color={colour}><Box width="7px" height="7px" borderRadius="full" bg={colour}/><Text fontSize="10px" fontWeight="700">{model.connected ? 'CONNECTED' : 'DISCONNECTED'}</Text></Flex></Flex>
    <Flex flex="1" align="center" minHeight="0" gap={model.compactMode ? '10px' : '14px'}>
      <Flex width={model.compactMode ? '58px' : '72px'} height={model.compactMode ? '58px' : '72px'} borderRadius="10px" bg={theme.surfaceSecondary} color={colour} align="center" justify="center" direction="column" flexShrink={0}><Icon aria-label={`${typeLabel} icon`} size={model.compactMode ? 25 : 32}/><Text mt="4px" fontSize="9px" fontWeight="700">{typeLabel}</Text></Flex>
      <Flex direction="column" minWidth="0" flex="1" gap="3px"><Text fontSize={model.compactMode ? '14px' : '17px'} fontWeight="800" noOfLines={1}>{model.networkName}</Text><Text color={theme.textSecondary} fontSize="11px" noOfLines={1}>IP {model.connected ? model.ipAddress : '—'}</Text><Text color={theme.textSecondary} fontSize="10px" noOfLines={1}>{model.hostname}</Text></Flex>
    </Flex>
    <Box><Flex justify="space-between" mb="3px"><Text fontSize="10px" color={colour} fontWeight="700">{model.statusText}</Text><Text fontSize="10px" fontWeight="700">{model.connected ? `${model.signalStrength}%` : '0%'}</Text></Flex><Box height="7px" bg={theme.surfaceSecondary} borderRadius="4px" overflow="hidden"><Box height="100%" width={`${model.connected ? model.signalStrength : 0}%`} bg={colour}/></Box></Box>
  </Flex>
}
