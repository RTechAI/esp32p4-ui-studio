import React from 'react'
import { Box, Flex, Progress, Text } from '@chakra-ui/react'
import { normalizeForgeUIBatteryCard } from '../ForgeUIBatteryCard'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUIBatteryCardPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUIBatteryCard(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const colour = model.charging ? model.chargingColour : model.percentage <= model.criticalThreshold ? model.criticalColour : model.percentage <= model.lowThreshold ? model.lowColour : model.normalColour
  const runtime = `${Math.floor(model.remainingMinutes / 60)}h ${model.remainingMinutes % 60}m`
  return <Flex data-testid="forgeui-battery-card" pointerEvents="none" direction="column" width="100%" height="100%" overflow="hidden" bg={theme.surface} color={theme.textPrimary} border={`1px solid ${theme.surfaceBorder}`} borderRadius="8px" p={model.compactMode ? '8px' : '10px'} gap="4px">
    <Flex justify="space-between" align="center" minHeight="14px" gap="6px">
      <Text minWidth="0" flex="1" fontWeight="700" fontSize="12px" lineHeight="1.15" noOfLines={1}>{model.title}</Text>
      <Flex align="center" gap="4px" flexShrink={0}>
        <BatteryIcon value={model.percentage} colour={colour} theme={theme} />
        <Text color={colour} fontWeight="700" fontSize="9px" lineHeight="1.1">{model.showChargingIcon && model.charging ? '⚡ CHARGING' : model.health.toUpperCase()}</Text>
      </Flex>
    </Flex>
    <Flex align="baseline" minHeight="23px" gap="4px">{model.showPercentage && <><Text fontSize={model.compactMode ? '22px' : '25px'} lineHeight="1" fontWeight="800">{Number(model.percentage.toFixed(1))}</Text><Text fontSize="10px" color={theme.textSecondary}>{model.units}</Text></>}</Flex>
    <Progress data-testid="forgeui-battery-progress" value={model.percentage} height="6px" colorScheme={model.percentage <= model.criticalThreshold ? 'red' : model.percentage <= model.lowThreshold ? 'yellow' : 'green'} borderRadius="3px" bg={theme.surfaceSecondary} />
    <Flex flexWrap="wrap" gap="3px">
      {model.showVoltage && <Metric label="VOLTAGE" value={`${model.voltage.toFixed(2)} V`} theme={theme} />}
      {model.showCurrent && <Metric label="CURRENT" value={`${model.current.toFixed(2)} A`} theme={theme} />}
      {model.showRuntime && <Metric label="RUNTIME" value={runtime} theme={theme} />}
      {model.showTemperature && <Metric label="TEMP" value={`${model.temperature.toFixed(1)} °C`} theme={theme} />}
      {model.showHealth && <Metric label="HEALTH" value={model.health.toUpperCase()} theme={theme} />}
    </Flex>
  </Flex>
}

const Metric = ({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof resolveForgeSemanticPalette> }) => <Box flex="1 0 calc(33.333% - 3px)" minWidth="58px" bg={theme.surfaceSecondary} borderRadius="4px" px="4px" py="2px"><Text fontSize="7px" lineHeight="1" color={theme.textSecondary}>{label}</Text><Text mt="1px" fontSize="9px" lineHeight="1" fontWeight="700" noOfLines={1}>{value}</Text></Box>

const BatteryIcon = ({ value, colour, theme }: { value: number; colour: string; theme: ReturnType<typeof resolveForgeSemanticPalette> }) => (
  <Box position="relative" width="24px" height="12px" border={`1px solid ${theme.textSecondary}`} borderRadius="3px" flexShrink={0}>
    <Box data-testid="forgeui-battery-icon-fill" data-level={Math.max(0, Math.min(100, value))} position="absolute" left="2px" top="2px" height="6px" width={`${Math.max(0, Math.min(100, value)) * 0.18}px`} bg={colour} borderRadius="2px" />
    <Box position="absolute" right="-4px" top="3px" width="3px" height="6px" bg={theme.textSecondary} borderRightRadius="2px" />
  </Box>
)
