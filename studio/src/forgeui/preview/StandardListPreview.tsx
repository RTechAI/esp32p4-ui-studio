import React from 'react'
import { Box } from '@chakra-ui/react'
import { useForgePreviewPalette } from '../theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from './forgeThemeMap'
import { getForgeUIStandardListModel } from '../ForgeUIStandardList'

const StandardListPreview = ({
  props,
}: {
  props: Record<string, unknown>
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
          key={`${index}-${item}`}
          minHeight={`${model.itemHeight}px`}
          px="12px"
          display="flex"
          alignItems="center"
          color={palette.textPrimary}
          bg={palette.surfaceSecondary}
          borderTop={`1px solid ${palette.surfaceBorder}`}
          _active={{ bg: palette.selectedSurface, color: palette.accentText }}
          data-testid="standard-list-item"
        >
          {item}
        </Box>
      ))}
    </Box>
  )
}

export default StandardListPreview
