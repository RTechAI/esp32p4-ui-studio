import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { normalizeForgeUIDeviceSummaryCard } from '../ForgeUIDeviceSummaryCard'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUIDeviceSummaryCardPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUIDeviceSummaryCard(component.props); const theme = resolveForgeSemanticPalette(palette)
  const colour = ({online:model.onlineColour,warning:model.warningColour,error:model.errorColour,offline:model.offlineColour})[model.overallStatus]
  const rows = [['Uptime',model.uptime],['Firmware',model.firmwareVersion],['Network',model.networkStatus],['Storage',model.storageStatus]]
  return <Flex data-testid="forgeui-device-summary-card" pointerEvents="none" direction="column" width="100%" height="100%" overflow="hidden" bg={theme.surface} color={theme.textPrimary} border={`1px solid ${theme.surfaceBorder}`} borderRadius="8px" p="10px" gap="5px">
    <Flex justify="space-between" align="center" minHeight="14px" gap="6px"><Text minWidth="0" flex="1" fontWeight="700" fontSize="12px" lineHeight="1.15" noOfLines={1}>{model.title}</Text><Flex align="center" gap="4px" color={colour} flexShrink={0}><Box width="6px" height="6px" borderRadius="full" bg={colour}/><Text fontSize="9px" lineHeight="1.1" fontWeight="700">{model.overallStatus.toUpperCase()}</Text></Flex></Flex>
    <Text fontSize="14px" lineHeight="1.15" fontWeight="800" noOfLines={1}>{model.deviceName}</Text>
    <Flex direction="column" minHeight="0" gap="1px">{rows.map(([label,value])=><Flex key={label} minWidth="0" justify="space-between" gap="8px"><Text flexShrink={0} color={theme.textSecondary} fontSize="9px" lineHeight="1.2">{label}</Text><Text minWidth="0" fontSize="9px" lineHeight="1.2" fontWeight="600" textAlign="right" noOfLines={1}>{value}</Text></Flex>)}</Flex>
  </Flex>
}
