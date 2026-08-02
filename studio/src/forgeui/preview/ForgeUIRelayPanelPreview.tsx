import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, SimpleGrid, Switch, Text } from '@chakra-ui/react'
import { normalizeForgeUIRelayPanel } from '../ForgeUIRelayPanel'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUIRelayPanelPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUIRelayPanel(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const [states, setStates] = useState(model.channels.map(channel => channel.state))
  useEffect(() => setStates(model.channels.map(channel => channel.state)), [component.props.channels, model.channelCount])
  const setChannel = (index: number, next: boolean) => {
    if (!model.channels[index].enabled) return
    setStates(current => current.map((value, position) => position === index ? next : value))
  }
  const setAll = (next: boolean) => {
    setStates(current => current.map((value, index) => model.channels[index].enabled ? next : value))
  }
  const active = model.activeColour
  return <Flex data-testid="forgeui-relay-panel" direction="column" width="100%" height="100%" overflow="hidden"
    border="1px solid" borderColor={theme.surfaceBorder} borderRadius="12px" background={theme.surface}
    color={theme.textPrimary} padding={`${model.padding}px`} gap={`${model.gap}px`} onClick={event => event.stopPropagation()}>
    <Flex align="center" gap="8px"><Text color={active}>{model.icon.replace(/^LV_SYMBOL_/, '')}</Text>
      <Box flex="1" minWidth="0"><Text fontSize="sm" fontWeight="700" noOfLines={1}>{model.title}</Text>
        {model.subtitle && <Text fontSize="xs" color={theme.textSecondary} noOfLines={1}>{model.subtitle}</Text>}</Box>
      {model.showMasterControl && <Button size="xs" variant="outline" onClick={() => setAll(!model.channels.every((channel, index) => !channel.enabled || states[index]))}>All</Button>}
    </Flex>
    <SimpleGrid columns={model.layoutMode === 'compact' ? 2 : 1} spacing={`${model.gap}px`} flex="1" overflowY="auto">
      {model.channels.map((channel, index) => <Flex key={channel.id} align="center" gap="8px" opacity={channel.enabled ? 1 : 0.55}
        background={theme.surfaceSecondary} borderRadius="8px" padding={model.layoutMode === 'compact' ? '5px 7px' : '7px 9px'}>
        <Box width="8px" height="8px" borderRadius="full" background={!channel.enabled ? model.disabledColour : states[index] ? active : model.inactiveColour} />
        <Box flex="1" minWidth="0"><Text fontSize="xs" fontWeight="600" noOfLines={1}>{model.showChannelNumbers ? `${index + 1}. ` : ''}{channel.label}</Text>
          {channel.statusText && <Text fontSize="10px" color={theme.textSecondary} noOfLines={1}>{channel.statusText}</Text>}</Box>
        <Switch size="sm" isChecked={states[index]} isDisabled={!channel.enabled} onChange={event => setChannel(index, event.target.checked)} colorScheme="green" />
      </Flex>)}
    </SimpleGrid>
    {model.showFooter && <Text fontSize="xs" color={theme.disabledText}>{model.footerText}</Text>}
  </Flex>
}
