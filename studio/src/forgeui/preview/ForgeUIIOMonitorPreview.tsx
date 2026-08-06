import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { ForgeUIIORow, normalizeForgeUIIOMonitor } from '../ForgeUIIOMonitor'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

const typeLabel = (row: ForgeUIIORow) => ({
  'digital-input': 'DI', 'digital-output': 'DO', 'analog-input': 'AI', 'analog-output': 'AO',
}[row.ioType])

export const ForgeUIIOMonitorPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUIIOMonitor(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const rows = model.rows.filter(row => row.visible).slice(0, model.maximumRows)
  return <Flex data-testid="forgeui-io-monitor" direction="column" width="100%" height="100%" overflow="hidden"
    bg={theme.surface} color={theme.textPrimary} border={`1px solid ${theme.surfaceBorder}`} borderRadius="10px" pointerEvents="none">
    <Flex px="12px" py={model.compactMode ? '6px' : '9px'} justify="space-between" align="center" borderBottom={`1px solid ${theme.surfaceBorder}`}>
      <Text fontWeight="700" fontSize={model.compactMode ? '12px' : '14px'}>{model.title}</Text>
      <Text fontSize="9px" color={theme.textSecondary}>{rows.length} CHANNELS</Text>
    </Flex>
    <Flex direction="column" flex="1" minHeight="0" overflow="hidden" p={model.compactMode ? '5px' : '8px'} gap={model.compactMode ? '3px' : '5px'}>
      {rows.length === 0 && <Flex flex="1" align="center" justify="center"><Text color={theme.textSecondary} fontSize="sm">No visible I/O rows</Text></Flex>}
      {rows.map(row => <Flex key={row.id} data-testid="io-monitor-row" minHeight={model.compactMode ? '25px' : '32px'} align="center" gap="7px" px="7px"
        bg={theme.surfaceSecondary} borderRadius="5px" borderLeft={`3px solid ${row.colour}`}>
        <Text width="20px" fontSize="8px" fontWeight="700" color={theme.textSecondary}>{typeLabel(row)}</Text>
        <Text width={model.compactMode ? '38px' : '48px'} fontSize={model.compactMode ? '9px' : '10px'} fontWeight="700" noOfLines={1}>{row.channel}</Text>
        <Text flex="1" minWidth="0" fontSize={model.compactMode ? '9px' : '11px'} noOfLines={1}>{row.displayName}</Text>
        {row.showValue && <Text fontSize={model.compactMode ? '9px' : '11px'} fontWeight="700">{Number(row.value.toFixed(3))}{row.units ? ` ${row.units}` : ''}</Text>}
        {row.showState && <Flex align="center" gap="4px"><Box width="7px" height="7px" borderRadius="50%" bg={row.state ? row.colour : theme.surfaceBorder} /><Text width="20px" fontSize="8px" color={theme.textSecondary}>{row.state ? 'ON' : 'OFF'}</Text></Flex>}
      </Flex>)}
    </Flex>
  </Flex>
}
