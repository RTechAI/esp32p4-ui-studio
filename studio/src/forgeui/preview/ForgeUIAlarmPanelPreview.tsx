import React from 'react'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { ForgeUIAlarmRecord, normalizeForgeUIAlarmPanel } from '../ForgeUIAlarmPanel'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUIAlarmPanelPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUIAlarmPanel(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const colour = (alarm: ForgeUIAlarmRecord) => alarm.state === 'warning' ? model.warningColour
    : alarm.state === 'acknowledged' ? model.acknowledgedColour
      : alarm.state === 'cleared' ? model.clearedColour
        : alarm.state === 'normal' ? model.normalColour : model.alarmColour
  const rank = { critical: 4, high: 3, medium: 2, low: 1 }
  const alarms = [...model.alarms]
  if (model.sortOrder === 'oldest') alarms.reverse()
  if (model.sortOrder === 'priority') alarms.sort((a, b) => rank[b.priority] - rank[a.priority])
  const visible = alarms.slice(0, model.maximumVisible)
  return <Flex data-testid="forgeui-alarm-panel" direction="column" width="100%" height="100%" overflow="hidden"
    bg={theme.surface} color={theme.textPrimary} border={`1px solid ${theme.surfaceBorder}`} borderRadius="10px" pointerEvents="none">
    {model.showHeader && <Flex px="12px" py={model.compactMode ? '6px' : '9px'} justify="space-between" align="center" borderBottom={`1px solid ${theme.surfaceBorder}`}>
      <Text fontWeight="700" fontSize={model.compactMode ? '12px' : '14px'}>{model.title}</Text><Badge colorScheme="red">{model.alarms.length}</Badge>
    </Flex>}
    <Flex direction="column" flex="1" minHeight="0" overflow="hidden" padding={model.compactMode ? '5px' : '8px'} gap={`${model.rowSpacing}px`}>
      {visible.length === 0 && <Flex flex="1" align="center" justify="center"><Text color={theme.textSecondary} fontSize="sm">No active alarms</Text></Flex>}
      {visible.map(alarm => <Flex key={alarm.id} data-testid="alarm-panel-row" minHeight={model.compactMode ? '30px' : '39px'} align="center" gap="8px" px="8px" py="4px"
        bg={theme.surfaceSecondary} borderLeft={`4px solid ${colour(alarm)}`} borderRadius="5px">
        <Box flex="1" minWidth="0"><Text fontSize={model.compactMode ? '10px' : '12px'} lineHeight="14px" fontWeight="600" noOfLines={1}>{alarm.message}</Text>
          <Flex gap="8px"><Text fontSize="9px" color={theme.textSecondary}>{alarm.state.toUpperCase()}</Text>{model.showTimestamp && <Text fontSize="9px" color={theme.textSecondary}>{alarm.timestamp}</Text>}</Flex></Box>
        {model.showPriority && <Text fontSize="9px" fontWeight="700" color={colour(alarm)}>{alarm.priority.toUpperCase()}</Text>}
        {model.showAcknowledgement && alarm.state !== 'acknowledged' && alarm.state !== 'cleared' && <Box border={`1px solid ${theme.surfaceBorder}`} borderRadius="4px" px="5px" fontSize="9px">ACK</Box>}
      </Flex>)}
    </Flex>
    {model.showFooter && <Text px="12px" py="6px" borderTop={`1px solid ${theme.surfaceBorder}`} color={theme.textSecondary} fontSize="9px" noOfLines={1}>{model.footerText}</Text>}
  </Flex>
}
