import React from 'react'
import { Box, Flex, Progress, Text } from '@chakra-ui/react'
import { getForgeUISensorTrendLabel, normalizeForgeUISensorTile } from '../ForgeUISensorTile'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUISensorTilePreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUISensorTile(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const statusColor = model.status === 'critical' ? theme.healthCritical : model.status === 'warning'
    ? theme.healthHigh : model.status === 'offline' ? theme.disabledText : theme.healthNormal
  const accent = model.accentColor || (model.autoColour ? statusColor : theme.accent)
  return <Flex data-testid="forgeui-sensor-tile" direction="column" width="100%" height="100%" overflow="hidden"
    border="1px solid" borderColor={theme.surfaceBorder} borderRadius="12px" background={theme.surface}
    color={theme.textPrimary} padding={`${model.padding}px`} gap="7px">
    <Flex align="center" gap="8px"><Text color={accent}>{model.icon.replace(/^LV_SYMBOL_/, '')}</Text>
      <Text fontSize="sm" fontWeight="600" noOfLines={1} flex="1">{model.title}</Text>
      <Box width="8px" height="8px" borderRadius="full" background={statusColor} />
      <Text fontSize="xs" color={theme.textSecondary}>{model.statusText}</Text></Flex>
    <Flex align="baseline" gap="6px" flex="1"><Text fontSize="3xl" fontWeight="700" lineHeight="1.1">{model.value.toFixed(model.decimals)}</Text>
      <Text color={theme.textSecondary}>{model.units}</Text></Flex>
    {model.showTrend && <Text fontSize="xs" color={accent}>{getForgeUISensorTrendLabel(model.trend)}</Text>}
    {model.showProgress && <Progress value={model.progress} size="sm" borderRadius="full" background={theme.surfaceSecondary} sx={{ '& > div': { background: accent } }} />}
    {model.showTimestamp && <Text fontSize="xs" color={theme.disabledText}>{model.timestamp}</Text>}
  </Flex>
}
