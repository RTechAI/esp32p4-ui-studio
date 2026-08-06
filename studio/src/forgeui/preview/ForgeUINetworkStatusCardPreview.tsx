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
  return <Flex data-testid="forgeui-network-status-card" pointerEvents="none" direction="column" width="100%" height="100%" overflow="hidden" bg={theme.surface} color={theme.textPrimary} border={`1px solid ${theme.surfaceBorder}`} borderRadius="8px" p={model.compactMode ? '8px' : '10px'} gap={model.compactMode ? '4px' : '6px'}>
    <Flex justify="space-between" align="center" minHeight="14px" gap="6px"><Text minWidth="0" flex="1" fontWeight="700" fontSize="12px" lineHeight="1.15" noOfLines={1}>{model.title}</Text><Flex align="center" gap="4px" color={colour} flexShrink={0}><Box width="6px" height="6px" borderRadius="full" bg={colour}/><Text fontSize="9px" lineHeight="1.1" fontWeight="700">{model.connected ? 'CONNECTED' : 'DISCONNECTED'}</Text></Flex></Flex>
    <Flex flex="1" align="center" minHeight="0" gap={model.compactMode ? '8px' : '10px'}>
      <Flex width={model.compactMode ? '40px' : '46px'} height={model.compactMode ? '40px' : '46px'} borderRadius="8px" bg={theme.surfaceSecondary} color={colour} align="center" justify="center" direction="column" flexShrink={0}><Icon aria-label={`${typeLabel} icon`} size={model.compactMode ? 18 : 21}/><Text mt="2px" fontSize="8px" lineHeight="1" fontWeight="700">{typeLabel}</Text></Flex>
      <Flex direction="column" minWidth="0" flex="1" gap="1px"><Text fontSize={model.compactMode ? '13px' : '14px'} lineHeight="1.15" fontWeight="800" noOfLines={1}>{model.networkName}</Text><Text color={theme.textSecondary} fontSize="10px" lineHeight="1.15" noOfLines={1}>IP {model.connected ? model.ipAddress : '—'}</Text><Text color={theme.textSecondary} fontSize="9px" lineHeight="1.15" noOfLines={1}>{model.hostname}</Text></Flex>
    </Flex>
    <Box><Flex justify="space-between" mb="2px" gap="8px"><Text minWidth="0" fontSize="9px" lineHeight="1.1" color={colour} fontWeight="700" noOfLines={1}>{model.statusText}</Text><Text fontSize="9px" lineHeight="1.1" fontWeight="700" flexShrink={0}>{model.connected ? `${model.signalStrength}%` : '0%'}</Text></Flex><Box height="5px" bg={theme.surfaceSecondary} borderRadius="3px" overflow="hidden"><Box height="100%" width={`${model.connected ? model.signalStrength : 0}%`} bg={colour}/></Box></Box>
  </Flex>
}
