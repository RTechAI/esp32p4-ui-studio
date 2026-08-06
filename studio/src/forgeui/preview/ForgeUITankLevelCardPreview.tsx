import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { normalizeForgeUITankLevelCard } from '../ForgeUITankLevelCard'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUITankLevelCardPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUITankLevelCard(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const overflow = model.level > 100 || (model.capacity > 0 && model.currentVolume > model.capacity)
  const empty = model.level <= model.criticalLevel
  const colour = overflow ? model.overflowColour : empty ? model.criticalColour : model.level <= model.lowLevel ? model.lowColour : model.level >= model.highLevel ? model.highColour : model.fillColour
  const status = overflow ? 'OVERFLOW' : empty ? 'EMPTY' : model.level <= model.lowLevel ? 'LOW' : model.level >= model.highLevel ? 'HIGH' : 'NORMAL'
  const fill = Math.max(0, Math.min(100, model.level))
  const radius = model.tankShape === 'rectangular' ? '4px' : model.tankShape === 'silo' ? '18px 18px 5px 5px' : '28px / 14px'
  return <Flex data-testid="forgeui-tank-level-card" pointerEvents="none" direction="column" width="100%" height="100%" overflow="hidden" bg={theme.surface} color={theme.textPrimary} border={`1px solid ${theme.surfaceBorder}`} borderRadius="8px" p={model.compactMode ? '8px' : '10px'} gap="5px">
    <Flex justify="space-between" align="center" minHeight="14px" gap="6px"><Text minWidth="0" flex="1" fontWeight="700" fontSize="12px" lineHeight="1.15" noOfLines={1}>{model.title}</Text><Text flexShrink={0} color={colour} fontWeight="700" fontSize="9px" lineHeight="1.1">{status}</Text></Flex>
    <Flex flex="1" minHeight="0" gap={model.compactMode ? '8px' : '10px'} align="stretch">
      <Box aria-label="tank icon" position="relative" width={model.compactMode ? '42px' : '48px'} minHeight="0" border={`2px solid ${model.tankOutline}`} borderRadius={radius} overflow="hidden" flexShrink={0} bg={theme.surfaceSecondary}>
        <Box data-testid="forgeui-tank-fill" data-level={fill} position="absolute" left="0" right="0" bottom="0" height={`${fill}%`} bg={colour} transition={model.animateFill ? 'height 350ms ease, background-color 200ms ease' : undefined} />
        {[25, 50, 75].map(mark => <Box key={mark} position="absolute" left="4px" right="4px" bottom={`${mark}%`} borderTop={`1px solid ${theme.surfaceBorder}`} />)}
      </Box>
      <Flex direction="column" justify="space-between" minWidth="0" flex="1" gap="2px">
        <Box minWidth="0">{model.showPercentage && <Text color={colour} fontWeight="800" fontSize={model.compactMode ? '22px' : '25px'} lineHeight="1">{Number(model.level.toFixed(1))}%</Text>}{model.showVolume && <Text mt="3px" fontWeight="700" fontSize="10px" lineHeight="1.15" noOfLines={1}>{Number(model.currentVolume.toFixed(1))} / {Number(model.capacity.toFixed(1))} {model.units}</Text>}</Box>
        {model.showLabels && <Flex gap="3px"><Metric label="LOW" value={`${model.lowLevel}%`} theme={theme}/><Metric label="HIGH" value={`${model.highLevel}%`} theme={theme}/><Metric label="CRIT" value={`${model.criticalLevel}%`} theme={theme}/></Flex>}
      </Flex>
    </Flex>
  </Flex>
}

const Metric = ({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof resolveForgeSemanticPalette> }) => <Box flex="1" minWidth="0" bg={theme.surfaceSecondary} borderRadius="4px" px="4px" py="2px"><Text fontSize="7px" lineHeight="1" color={theme.textSecondary} noOfLines={1}>{label}</Text><Text mt="1px" fontSize="9px" lineHeight="1" fontWeight="700" noOfLines={1}>{value}</Text></Box>
