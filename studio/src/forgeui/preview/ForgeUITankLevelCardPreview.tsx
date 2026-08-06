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
  return <Flex data-testid="forgeui-tank-level-card" pointerEvents="none" direction="column" width="100%" height="100%" overflow="hidden" bg={theme.surface} color={theme.textPrimary} border={`1px solid ${theme.surfaceBorder}`} borderRadius="10px" p={model.compactMode ? '8px' : '12px'} gap={model.compactMode ? '5px' : '8px'}>
    <Flex justify="space-between" align="center"><Text fontWeight="700" fontSize={model.compactMode ? '12px' : '14px'} noOfLines={1}>{model.title}</Text><Text color={colour} fontWeight="700" fontSize="10px">{status}</Text></Flex>
    <Flex flex="1" minHeight="80px" gap={model.compactMode ? '9px' : '14px'} align="stretch">
      <Box aria-label="tank icon" position="relative" width={model.compactMode ? '54px' : '70px'} minHeight="82px" border={`3px solid ${model.tankOutline}`} borderRadius={radius} overflow="hidden" flexShrink={0} bg={theme.surfaceSecondary}>
        <Box position="absolute" left="0" right="0" bottom="0" height={`${fill}%`} bg={colour} transition={model.animateFill ? 'height 350ms ease, background-color 200ms ease' : undefined} />
        {[25, 50, 75].map(mark => <Box key={mark} position="absolute" left="4px" right="4px" bottom={`${mark}%`} borderTop={`1px solid ${theme.surfaceBorder}`} />)}
      </Box>
      <Flex direction="column" justify="center" minWidth="0" flex="1" gap="6px">
        {model.showPercentage && <Text color={colour} fontWeight="800" fontSize={model.compactMode ? '28px' : '36px'} lineHeight="1">{Number(model.level.toFixed(1))}%</Text>}
        {model.showVolume && <Text fontWeight="700" fontSize={model.compactMode ? '12px' : '14px'}>{Number(model.currentVolume.toFixed(1))} / {Number(model.capacity.toFixed(1))} {model.units}</Text>}
        {model.showLabels && <Flex gap="6px" flexWrap="wrap"><Metric label="LOW" value={`${model.lowLevel}%`} theme={theme}/><Metric label="HIGH" value={`${model.highLevel}%`} theme={theme}/><Metric label="CRITICAL" value={`${model.criticalLevel}%`} theme={theme}/></Flex>}
      </Flex>
    </Flex>
  </Flex>
}

const Metric = ({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof resolveForgeSemanticPalette> }) => <Box flex="1" minWidth="50px" bg={theme.surfaceSecondary} borderRadius="5px" px="6px" py="4px"><Text fontSize="7px" color={theme.textSecondary}>{label}</Text><Text fontSize="10px" fontWeight="700">{value}</Text></Box>
