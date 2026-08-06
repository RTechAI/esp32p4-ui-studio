import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { normalizeForgeUIKpiCard } from '../ForgeUIKpiCard'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUIKpiCardPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUIKpiCard(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const accent = ({ neutral: model.neutralColour, good: model.goodColour, warning: model.warningColour, critical: model.criticalColour })[model.status]
  const trendLabel = model.trendState === 'up' ? 'UP' : model.trendState === 'down' ? 'DOWN' : 'FLAT'
  return <Flex data-testid="forgeui-kpi-card" pointerEvents="none" direction="column" width="100%" height="100%" overflow="hidden" bg={theme.surface} color={theme.textPrimary} border={`1px solid ${theme.surfaceBorder}`} borderRadius="8px" p="10px" gap="4px">
    <Flex align="center" justify="space-between" gap="6px" minHeight="14px"><Text minWidth="0" flex="1" fontSize="12px" lineHeight="1.15" fontWeight="700" noOfLines={1}>{model.title}</Text><Flex flexShrink={0} align="center" gap="4px" color={accent}><Box width="6px" height="6px" borderRadius="full" bg={accent}/><Text fontSize="9px" lineHeight="1" fontWeight="700">{model.status.toUpperCase()}</Text></Flex></Flex>
    <Flex minWidth="0" align="baseline" gap="5px"><Text data-testid="forgeui-kpi-value" minWidth="0" maxWidth="174px" fontSize="26px" lineHeight="1.05" fontWeight="800" color={accent} noOfLines={1}>{model.value}</Text>{model.unit && <Text flexShrink={0} maxWidth="52px" fontSize="12px" lineHeight="1" fontWeight="700" color={theme.textSecondary} noOfLines={1}>{model.unit}</Text>}</Flex>
    {model.showSecondary && model.secondaryText && <Text fontSize="10px" lineHeight="1.15" color={theme.textSecondary} noOfLines={1}>{model.secondaryText}</Text>}
    <Flex mt="auto" align="center" justify="space-between" minWidth="0" gap="6px">
      {model.showTrend && model.trendText ? <Flex minWidth="0" align="center" gap="4px" color={accent}><Text fontSize="8px" fontWeight="700">{trendLabel}</Text><Text fontSize="10px" lineHeight="1" fontWeight="700" noOfLines={1}>{model.trendText}</Text></Flex> : <Box/>}
      {model.showTarget && model.targetText && <Text minWidth="0" fontSize="9px" lineHeight="1" color={theme.textSecondary} textAlign="right" noOfLines={1}>{model.targetText}</Text>}
    </Flex>
    <Box data-testid="forgeui-kpi-accent" height="4px" flexShrink={0} borderRadius="2px" bg={accent}/>
  </Flex>
}
