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
      {model.items.map((item, index) => (
        <Box
          as={mode === 'browser' ? 'button' : 'div'}
          key={`${index}-${item}`}
          type={mode === 'browser' ? 'button' : undefined}
          minHeight={`${model.itemHeight}px`}
          width="100%"
          px="12px"
          display="flex"
          alignItems="center"
          textAlign="left"
          color={palette.textPrimary}
          bg={palette.surfaceSecondary}
          borderTop={`1px solid ${palette.surfaceBorder}`}
          _active={{ bg: palette.selectedSurface, color: palette.accentText }}
          _focusVisible={{
            outline: `2px solid ${palette.accent}`,
            outlineOffset: '-2px',
          }}
          cursor={mode === 'browser' ? 'pointer' : 'default'}
          pointerEvents={mode === 'browser' ? 'auto' : 'none'}
          data-testid="standard-list-item"
        >
          {item}
        </Box>
      ))}
    </Box>
  )
}

export default StandardListPreview
