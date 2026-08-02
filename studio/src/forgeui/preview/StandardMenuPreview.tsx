import React, { useEffect, useMemo, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { normalizeForgeUIMenuPages, resolveForgeUIMenuRootPageId } from '../ForgeUIMenu'

export const StandardMenuPreview = ({ component, mode = 'canvas' }: any) => {
  const p = component.props || {}
  const pages = useMemo(() => normalizeForgeUIMenuPages(p.pages), [p.pages])
  const rootId = resolveForgeUIMenuRootPageId(pages, p.rootPageId)
  const [history, setHistory] = useState<string[]>([rootId])
  useEffect(() => setHistory([rootId]), [rootId, p.pages])
  const page = pages.find(item => item.id === history[history.length - 1]) || pages[0]
  const open = (target: string) => {
    if (mode !== 'browser' || !pages.some(item => item.id === target)) return
    setHistory(old => [...old, target])
  }
  return <Box width="100%" height="100%" overflow="hidden" bg={p.background || '#0F172A'}
    border={`${Math.max(0, Number(p.borderWidth) || 0)}px solid`} borderColor={p.borderColor || '#334155'}
    borderRadius={`${Math.max(0, Number(p.cornerRadius) || 0)}px`} color={p.textColor || '#F8FAFC'}
    data-testid="standard-menu">
    <Flex height="46px" align="center" gap="8px" px="12px" bg={p.headerBackground || '#172033'}>
      {(history.length > 1 || p.rootBackButton) && <Box as="button" aria-label="Menu back"
        pointerEvents={mode === 'browser' ? 'auto' : 'none'} onClick={() => setHistory(old => old.length > 1 ? old.slice(0, -1) : old)}>‹</Box>}
      <Text fontWeight="semibold" noOfLines={1}>{page?.title || 'Menu'}</Text>
    </Flex>
    <Box height="calc(100% - 46px)" overflowY="auto" p={`${Math.max(0, Number(p.padding) || 0)}px`}>
      {page?.sections.map(section => <Box key={section.id} mb="8px" data-testid="menu-section">
        {section.title && <Text px="10px" py="5px" fontSize="xs" color={p.secondaryTextColor || '#94A3B8'}>{section.title}</Text>}
        {section.items.map(item => <Flex key={item.id} as="button" type="button" width="100%" minH="48px" px="10px" py="6px"
          align="center" gap="10px" textAlign="left" opacity={item.enabled ? 1 : 0.4} disabled={!item.enabled}
          bg={history[history.length - 1] === item.targetPageId ? (p.selectedBackground || '#164E63') : 'transparent'}
          pointerEvents={mode === 'browser' ? 'auto' : 'none'} onClick={() => open(item.targetPageId)}>
          {item.icon && <Text flex="0 0 auto">◆</Text>}
          <Box flex="1"><Text>{item.label}</Text>{item.subtitle && <Text fontSize="xs" color={p.secondaryTextColor || '#94A3B8'}>{item.subtitle}</Text>}</Box>
          {item.targetPageId && <Text>›</Text>}
        </Flex>)}
      </Box>)}
    </Box>
  </Box>
}
