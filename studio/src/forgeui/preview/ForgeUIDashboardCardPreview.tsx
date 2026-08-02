import React from 'react'
import { Box, Flex, Progress, Text } from '@chakra-ui/react'
import { normalizeForgeUIDashboardCard } from '../ForgeUIDashboardCard'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUIDashboardCardPreview = ({
  component,
  palette,
}: {
  component: IComponent
  palette: ForgePreviewPalette
}) => {
  const model = normalizeForgeUIDashboardCard(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const accent = model.accentColor || theme.accent
  const statusColor = model.status === 'critical' ? theme.healthCritical
    : model.status === 'warning' ? theme.healthHigh
      : model.status === 'offline' ? theme.disabledText : theme.healthNormal
  return <Flex
    data-testid="forgeui-dashboard-card"
    direction="column"
    width="100%"
    height="100%"
    overflow="hidden"
    border="1px solid"
    borderColor={theme.surfaceBorder}
    borderRadius="12px"
    background={theme.surface}
    color={theme.textPrimary}
    padding={`${model.padding}px`}
    gap="8px"
  >
    {model.showHeader && <Flex align="center" gap="8px" minHeight="22px">
      {model.icon && <Text aria-label="Dashboard card icon" color={accent}>{model.icon.replace(/^LV_SYMBOL_/, '')}</Text>}
      <Text fontSize="sm" fontWeight="600" noOfLines={1} flex="1">{model.title}</Text>
      {model.showStatus && <Flex align="center" gap="5px">
        <Box width="8px" height="8px" borderRadius="full" background={statusColor} />
        <Text fontSize="xs" color={theme.textSecondary}>{model.statusText}</Text>
      </Flex>}
    </Flex>}
    <Flex align="baseline" gap="6px" flex="1" minHeight="42px">
      <Text fontSize="3xl" fontWeight="700" lineHeight="1.1" noOfLines={1}>{model.value}</Text>
      {model.units && <Text fontSize="md" color={theme.textSecondary}>{model.units}</Text>}
    </Flex>
    {model.secondaryText && <Text fontSize="xs" color={theme.textSecondary} noOfLines={1}>{model.secondaryText}</Text>}
    {model.showProgress && <Progress value={model.progress} size="sm" borderRadius="full" colorScheme="teal" background={theme.surfaceSecondary} sx={{ '& > div': { background: accent } }} />}
    {model.showFooter && <Text fontSize="xs" color={theme.disabledText} noOfLines={1}>{model.timestamp}</Text>}
  </Flex>
}
