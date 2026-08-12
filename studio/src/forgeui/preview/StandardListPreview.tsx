import React from 'react'
import { Box } from '@chakra-ui/react'
import { useForgePreviewPalette } from '../theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from './forgeThemeMap'
import { getForgeUIStandardListModel } from '../ForgeUIStandardList'

const StandardListPreview = ({
  props,
  mode = 'browser',
}: {
  props: Record<string, unknown>
  mode?: 'canvas' | 'browser'
}) => {
  const palette = resolveForgeSemanticPalette(useForgePreviewPalette())
  const model = getForgeUIStandardListModel(props)

  return (
    <Box
      width="100%"
      height="100%"
      overflowY="auto"
      bg={palette.surface}
      border={`1px solid ${palette.surfaceBorder}`}
      borderRadius="8px"
      data-testid="standard-list-preview"
    >
      {model.title && (
        <Box
          px="12px"
          py="8px"
          color={palette.textSecondary}
          fontSize="12px"
          fontWeight="600"
          data-testid="standard-list-title"
        >
          {model.title}
        </Box>
      )}
      {model.items.map((item, index) => {
        const cursor: 'pointer' | 'default' = mode === 'browser' ? 'pointer' : 'default'
        const pointerEvents: 'auto' | 'none' = mode === 'browser' ? 'auto' : 'none'
        const itemProps = {
          minHeight: `${model.itemHeight}px`,
          width: '100%', px: '12px', display: 'flex' as const, alignItems: 'center' as const,
          textAlign: 'left' as const, color: palette.textPrimary,
          bg: palette.surfaceSecondary,
          borderTop: `1px solid ${palette.surfaceBorder}`,
          _active: { bg: palette.selectedSurface, color: palette.accentText },
          _focusVisible: {
            outline: `2px solid ${palette.accent}`,
            outlineOffset: '-2px',
          },
          cursor,
          pointerEvents,
          'data-testid': 'standard-list-item',
        }
        return mode === 'browser'
          ? <Box as="button" type="button" key={`${index}-${item}`} {...itemProps}>{item}</Box>
          : <Box as="div" key={`${index}-${item}`} {...itemProps}>{item}</Box>
      })}
    </Box>
  )
}

export default StandardListPreview
