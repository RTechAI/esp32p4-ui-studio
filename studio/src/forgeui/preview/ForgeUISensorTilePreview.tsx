import React from 'react'
import { Box, Flex, Progress, Text } from '@chakra-ui/react'
import { getForgeUISensorTrendLabel, normalizeForgeUISensorTile } from '../ForgeUISensorTile'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

const SENSOR_ICON_GLYPHS: Record<string, string> = {
  LV_SYMBOL_CHARGE: '⚡', LV_SYMBOL_UPLOAD: '↑', LV_SYMBOL_TINT: '●',
  LV_SYMBOL_BATTERY_FULL: '▰', LV_SYMBOL_REFRESH: '↻', LV_SYMBOL_AUDIO: '♪',
  LV_SYMBOL_BULLET: '•',
}

const previewIcon = (icon: string) => /^LV_SYMBOL_[A-Z0-9_]+$/.test(icon)
  ? SENSOR_ICON_GLYPHS[icon] || '•'
  : icon

export const ForgeUISensorTilePreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUISensorTile(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const statusColor = model.status === 'critical' ? theme.healthCritical : model.status === 'warning'
    ? theme.healthHigh : model.status === 'offline' ? theme.disabledText : theme.healthNormal
  const accent = model.accentColor || (model.autoColour ? statusColor : theme.accent)
  const icon = previewIcon(model.icon)
  return <Flex data-testid="forgeui-sensor-tile" direction="column" width="100%" height="100%" overflow="hidden"
    border="1px solid" borderColor={theme.surfaceBorder} borderRadius="8px" background={theme.surface}
    color={theme.textPrimary} padding={`${model.padding}px`}>
    <Flex align="center" minHeight="16px" marginBottom="6px">
      <Flex align="center" gap="6px" minWidth="0" flex="1">
        {icon && <Text aria-label="Sensor tile icon" fontSize="13px" lineHeight="1" color={accent}>{icon}</Text>}
        <Text fontSize="13px" fontWeight="600" lineHeight="1.2" noOfLines={1}>{model.title}</Text>
      </Flex>
      <Flex align="center" gap="4px" flexShrink={0} marginLeft="6px">
        <Box width="6px" height="6px" borderRadius="full" background={statusColor} />
        <Text fontSize="11px" lineHeight="1.2" color={theme.textSecondary}>{model.statusText}</Text>
      </Flex>
    </Flex>
    <Flex align="baseline" gap="5px" minHeight="30px" marginBottom={model.showTrend ? '4px' : model.showProgress ? '6px' : model.showTimestamp ? '5px' : 0}>
      <Text fontSize="28px" fontWeight="700" lineHeight="1.05" noOfLines={1}>{model.value.toFixed(model.decimals)}</Text>
      {model.units && <Text fontSize="14px" fontWeight="500" lineHeight="1.2" color={theme.textSecondary}>{model.units}</Text>}
    </Flex>
    {model.showTrend && <Text fontSize="12px" lineHeight="1.2" marginBottom={model.showProgress ? '6px' : model.showTimestamp ? '5px' : 0} color={accent} noOfLines={1}>{getForgeUISensorTrendLabel(model.trend)}</Text>}
    {model.showProgress && <Progress value={model.progress} height="6px" marginBottom={model.showTimestamp ? '6px' : 0} borderRadius="full" background={theme.surfaceSecondary} sx={{ '& > div': { background: accent } }} />}
    {model.showTimestamp && <Text fontSize="11px" lineHeight="1.2" color={theme.disabledText} noOfLines={1}>{model.timestamp}</Text>}
  </Flex>
}
