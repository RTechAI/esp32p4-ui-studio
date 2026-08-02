import React, { useMemo } from 'react'
import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import { createForgeUIAlarmSimulation, normalizeForgeUIAlarmPanel, ForgeUIAlarmSeverity } from '../ForgeUIAlarmPanel'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUIAlarmPanelPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUIAlarmPanel(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const alarms = useMemo(() => model.alarms.length ? model.alarms : createForgeUIAlarmSimulation(model.simulationMode), [model.alarms, model.simulationMode])
  const colours: Record<ForgeUIAlarmSeverity, string> = { information: model.informationColour, notice: model.noticeColour, warning: model.warningColour, alarm: model.alarmColour, critical: model.criticalColour }
  const filtered = alarms.filter(item => model[`include${item.severity[0].toUpperCase()}${item.severity.slice(1)}` as keyof typeof model] !== false)
  const severityRank = { information: 0, notice: 1, warning: 2, alarm: 3, critical: 4 }
  const ordered = [...filtered].sort((a, b) => model.ordering === 'oldest-first' ? a.timestamp.localeCompare(b.timestamp) : model.ordering === 'severity-first' ? severityRank[b.severity] - severityRank[a.severity] : b.timestamp.localeCompare(a.timestamp))
  const active = ordered.filter(item => item.active)
  const visible = model.displayMode === 'banner' ? active.slice().sort((a, b) => severityRank[b.severity] - severityRank[a.severity]).slice(0, 1) : ordered
  return <Flex data-testid="forgeui-alarm-panel" direction="column" width="100%" height="100%" overflow="hidden" border="1px solid" borderColor={theme.surfaceBorder} borderRadius={model.rounded ? '12px' : 0} background={model.glassStyle ? `linear-gradient(155deg, ${theme.surface}, ${theme.surfaceSecondary})` : theme.surface} boxShadow={model.shadow ? '0 10px 24px rgba(0,0,0,.24)' : 'none'} color={theme.textPrimary} p="12px" gap="8px">
    <Flex justify="space-between"><Text fontWeight="700">{model.title}</Text><Text color={active.length ? model.warningColour : theme.healthNormal}>{active.length} Active</Text></Flex>
    {model.displayMode === 'compact' ? <Stack spacing="3px"><Text>{active.filter(a => a.severity === 'critical').length} Critical</Text><Text>{active.filter(a => a.severity === 'warning').length} Warning</Text><Text>{active.filter(a => a.acknowledged).length} Acknowledged</Text></Stack> :
      <Stack spacing="5px" overflowY="auto">{visible.length ? visible.map(alarm => <Flex data-testid={`alarm-${alarm.id}`} key={alarm.id} borderLeft="4px solid" borderColor={colours[alarm.severity]} background={alarm.acknowledged ? theme.surfaceSecondary : 'transparent'} px="8px" py="5px" gap="8px"><Box flex="1" minW="0"><Flex justify="space-between"><Text fontSize="sm" fontWeight="700" noOfLines={1}>{alarm.title}</Text>{model.showTimestamps && <Text fontSize="10px" color={theme.textSecondary}>{alarm.timestamp}</Text>}</Flex>{model.showDescriptions && <Text fontSize="11px" color={theme.textSecondary} noOfLines={1}>{alarm.description}</Text>}</Box>{model.showAcknowledgement && alarm.acknowledged && <Text fontSize="10px">ACK</Text>}</Flex>) : <Text color={theme.healthNormal}>No active alarms</Text>}</Stack>}
  </Flex>
}
