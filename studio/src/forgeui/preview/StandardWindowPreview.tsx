import React, { useEffect, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { normalizeWindowActions } from '../ForgeUIWindow'

export const StandardWindowPreview = ({ component, children, mode = 'canvas' }: any) => {
  const p = component.props || {}
  const [open, setOpen] = useState(p.visible !== false)
  useEffect(() => setOpen(p.visible !== false), [p.visible])
  const headerHeight = Math.max(28, Number(p.headerHeight) || 48)
  const actions = normalizeWindowActions(p.actionButtons)
  return <Box width="100%" height="100%" overflow="hidden"
    display={open ? 'block' : 'none'} opacity={p.opacity ?? 1}
    bg={p.contentBackground || '#0F172A'} border={`${Math.max(0, Number(p.borderWidth) || 0)}px solid`}
    borderColor={p.borderColor || '#334155'} borderRadius={`${Math.max(0, Number(p.cornerRadius) || 0)}px`}
    data-testid="standard-window">
    <Flex height={`${headerHeight}px`} px={`${Math.max(0, Number(p.headerPadding) || 0)}px`}
      align="center" gap={`${Math.max(0, Number(p.buttonSpacing) || 0)}px`}
      bg={p.headerBackground || '#172033'} color={p.headerTextColor || '#F8FAFC'}>
      {p.showIcon !== false && <Text aria-label="Window icon" flex="0 0 auto">▣</Text>}
      <Text flex="1" minW={0} noOfLines={1} textAlign={p.titleAlign || 'left'} fontWeight="semibold">{p.title || 'Window'}</Text>
      {actions.map(action => <Box key={action.id} as="button" disabled={!action.enabled}
        width={`${Number(p.buttonSize) || 32}px`} height={`${Number(p.buttonSize) || 32}px`}
        opacity={action.enabled ? 1 : 0.4} aria-label={`Window action ${action.id}`}>●</Box>)}
      {p.showCloseButton !== false && <Box as="button" width={`${Number(p.buttonSize) || 32}px`}
        height={`${Number(p.buttonSize) || 32}px`} aria-label="Close window"
        onClick={() => { if (mode === 'browser') setOpen(false) }}>×</Box>}
    </Flex>
    <Box position="relative" height={`calc(100% - ${headerHeight}px)`}
      p={`${Math.max(0, Number(p.contentPadding) || 0)}px`}
      overflow={p.scrollingEnabled === false ? (p.childClipping === false ? 'visible' : 'hidden') : 'auto'}
      bg={p.contentBackground || '#0F172A'} data-testid="standard-window-content">
      {children}
    </Box>
  </Box>
}
