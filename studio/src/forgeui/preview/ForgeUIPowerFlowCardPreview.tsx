import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { ForgeUIPowerFlowDirection, normalizeForgeUIPowerFlowCard } from '../ForgeUIPowerFlowCard'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

const arrow = (direction: ForgeUIPowerFlowDirection, vertical = false) => direction === 'none' ? '—' : vertical
  ? direction === 'into-centre' ? '▼' : '▲'
  : direction === 'into-centre' ? '▶' : '◀'

export const ForgeUIPowerFlowCardPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUIPowerFlowCard(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const node = (name: string, value: string, visible: boolean, testId: string) => <Flex data-testid={testId} visibility={visible ? 'visible' : 'hidden'} direction="column" align="center" justify="center" minWidth="54px" maxWidth="68px" height="34px" border={`1px solid ${theme.surfaceBorder}`} borderRadius="5px" bg={theme.surfaceSecondary} px="4px"><Text fontSize="8px" lineHeight="1" fontWeight="700">{name}</Text><Text maxWidth="60px" fontSize="10px" lineHeight="1.2" fontWeight="700" color={theme.textSecondary} noOfLines={1}>{value}</Text></Flex>
  const flow = (value: ForgeUIPowerFlowDirection, vertical: boolean, visible: boolean, id: string) => <Flex data-testid={id} data-flow={value} visibility={visible ? 'visible' : 'hidden'} align="center" justify="center" color={value === 'none' ? model.inactiveColour : model.activeColour} fontSize="12px" fontWeight="800" lineHeight="1">{arrow(value, vertical)}</Flex>
  return <Flex data-testid="forgeui-power-flow-card" pointerEvents="none" direction="column" width="100%" height="100%" overflow="hidden" bg={theme.surface} color={theme.textPrimary} border={`1px solid ${theme.surfaceBorder}`} borderRadius="8px" px="9px" py="7px">
    <Text fontSize="11px" lineHeight="1" fontWeight="700" noOfLines={1}>{model.title}</Text>
    <Box position="relative" flex="1" minHeight="0" mt="3px">
      <Box position="absolute" left="50%" top="0" transform="translateX(-50%)">{node('SOLAR', model.solarValue, model.solarVisible, 'power-node-solar')}</Box>
      <Box position="absolute" left="0" top="50%" transform="translateY(-50%)">{node('GRID', model.gridValue, model.gridVisible, 'power-node-grid')}</Box>
      <Box position="absolute" left="50%" top="50%" transform="translate(-50%,-50%)">{node('LOAD', model.loadValue, model.loadVisible, 'power-node-load')}</Box>
      <Box position="absolute" left="50%" bottom="0" transform="translateX(-50%)">{node('BATTERY', model.batteryValue, model.batteryVisible, 'power-node-battery')}</Box>
      <Box position="absolute" left="31%" top="50%" transform="translate(-50%,-50%)">{flow(model.gridFlow, false, model.gridVisible && model.loadVisible, 'power-flow-grid')}</Box>
      <Box position="absolute" left="50%" top="34%" transform="translate(-50%,-50%)">{flow(model.solarFlow, true, model.solarVisible && model.loadVisible, 'power-flow-solar')}</Box>
      <Box position="absolute" left="50%" top="67%" transform="translate(-50%,-50%)">{flow(model.batteryFlow, true, model.batteryVisible && model.loadVisible, 'power-flow-battery')}</Box>
    </Box>
  </Flex>
}
