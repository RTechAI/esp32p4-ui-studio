import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'

import { FORGEUI_TABVIEW_TAB_BAR_HEIGHT } from '../ForgeUIStandardTabTileGeometry'
import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const clampIndex = (value: unknown) => {
  const numeric = Math.trunc(Number(value))
  return Number.isFinite(numeric)
    ? Math.max(0, Math.min(2, numeric))
    : 0
}

const StandardTabViewPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const serializedIndex = clampIndex(component.props.selectedIndex)
  const [selectedIndex, setSelectedIndex] = useState(serializedIndex)

  useEffect(() => {
    setSelectedIndex(serializedIndex)
  }, [serializedIndex])

  return (
    <Box
      width="100%"
      height="100%"
      overflow="hidden"
      bg={theme.surface}
      border={`1px solid ${theme.surfaceBorder}`}
      borderRadius="0"
      data-testid="standard-tabview-preview"
    >
      <Box
        display="flex"
        height={`${FORGEUI_TABVIEW_TAB_BAR_HEIGHT}px`}
        bg={theme.surface}
        data-testid="standard-tabview-tab-bar"
      >
        {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, index) => {
          const selected = index === selectedIndex

          return (
            <Box
              key={tab}
              role="tab"
              tabIndex={0}
              flex="1"
              minWidth="0"
              height="100%"
              p="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={selected ? `${theme.selectedSurface}33` : 'transparent'}
              color={selected ? theme.accent : theme.textPrimary}
              border="0"
              borderBottom={
                selected ? `3px solid ${theme.accent}` : '3px solid transparent'
              }
              fontSize="12px"
              fontWeight="normal"
              onPointerDown={event => event.stopPropagation()}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setSelectedIndex(index)
                }
              }}
              data-selected={selected ? 'true' : 'false'}
              data-testid={`standard-tabview-tab-${index}`}
            >
              {tab}
            </Box>
          )
        })}
      </Box>

      <Box
        height={`calc(100% - ${FORGEUI_TABVIEW_TAB_BAR_HEIGHT}px)`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        p="0"
        bg={theme.surfaceSecondary}
        color={theme.textPrimary}
        fontSize="13px"
        data-testid="standard-tabview-content"
      >
        Tab {selectedIndex + 1} content
      </Box>
    </Box>
  )
}

export default StandardTabViewPreview
