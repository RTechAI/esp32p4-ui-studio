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
    borderColor={theme.surfaceSecondary}
    borderRadius="8px"
    background={theme.surface}
    color={theme.textPrimary}
    padding={`${model.padding}px`}
  >
    {model.showHeader && <Flex align="center" minHeight="20px" marginBottom="6px">
      <Flex align="center" gap="6px" minWidth="0" flex="1">
        {model.icon && <Text aria-label="Dashboard card icon" fontSize="13px" lineHeight="1" color={accent}>{model.icon}</Text>}
        <Text fontSize="13px" fontWeight="600" lineHeight="1.2" noOfLines={1}>{model.title}</Text>
      </Flex>
      {model.showStatus && <Flex align="center" gap="4px" flexShrink={0} marginLeft="6px">
        <Box width="6px" height="6px" borderRadius="full" background={statusColor} />
        <Text fontSize="11px" lineHeight="1.2" color={theme.textSecondary}>{model.statusText}</Text>
      </Flex>}
    </Flex>}
    <Flex align="baseline" gap="5px" minHeight="34px" marginBottom={model.secondaryText ? '4px' : model.showProgress ? '6px' : 0}>
      <Text fontSize="28px" fontWeight="700" lineHeight="1.05" noOfLines={1}>{model.value}</Text>
      {model.units && <Text fontSize="14px" fontWeight="500" color={theme.textSecondary}>{model.units}</Text>}
    </Flex>
    {model.secondaryText && <Text fontSize="11px" lineHeight="1.25" marginBottom={model.showProgress ? '6px' : 0} color={theme.textSecondary} noOfLines={1}>{model.secondaryText}</Text>}
    {model.showProgress && <Progress value={model.progress} height="6px" marginBottom={model.showFooter ? '6px' : 0} borderRadius="full" colorScheme="teal" background={theme.surfaceSecondary} sx={{ '& > div': { background: accent } }} />}
    {model.showFooter && <Text fontSize="11px" lineHeight="1.2" color={theme.disabledText} noOfLines={1}>{model.timestamp}</Text>}
  </Flex>
}
