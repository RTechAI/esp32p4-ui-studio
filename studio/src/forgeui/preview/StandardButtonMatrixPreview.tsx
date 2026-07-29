import React from 'react'
import { Box } from '@chakra-ui/react'
import {
  ForgePreviewPalette,
  FG_PREVIEW_PALETTES,
  resolveForgeSemanticPalette,
} from '~forgeui/preview/forgeThemeMap'
import {
  getForgeUIStandardButtonMatrixModel,
} from '~forgeui/ForgeUIStandardButtonMatrix'

type StandardButtonMatrixPreviewProps = {
  component: IComponent
  palette?: ForgePreviewPalette
}

const StandardButtonMatrixPreview: React.FC<
  StandardButtonMatrixPreviewProps
> = ({
  component,
  palette = FG_PREVIEW_PALETTES.graphite,
}) => {
  const matrix = getForgeUIStandardButtonMatrixModel(component.props)
  const theme = resolveForgeSemanticPalette(palette)

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      gap="6px"
      p="8px"
      bg={theme.surface}
      border={`2px solid ${theme.surfaceBorder}`}
      borderRadius="8px"
      overflow="hidden"
      pointerEvents="none"
      data-testid="standard-button-matrix-preview"
      data-selected-index={matrix.selectedIndex}
      data-one-check={matrix.oneCheck}
    >
      {matrix.rows.map((row, rowIndex) => (
        <Box
          key={rowIndex}
          minHeight="0"
          flex="1 1 0"
          display="flex"
          gap="6px"
          data-testid="standard-button-matrix-row"
        >
          {row.map(button => (
            <Box
              key={button.index}
              minWidth="0"
              flex="1 1 0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              border={`1px solid ${theme.surfaceBorder}`}
              borderRadius="6px"
              bg={
                button.selected
                  ? theme.selectedSurface
                  : theme.surfaceSecondary
              }
              color={
                button.selected
                  ? theme.accentText
                  : button.disabled
                    ? theme.disabledText
                    : theme.textPrimary
              }
              opacity={button.disabled ? 0.45 : 1}
              fontSize="13px"
              fontWeight="bold"
              textAlign="center"
              data-testid="standard-button-matrix-button"
              data-button-index={button.index}
              data-selected={button.selected}
              data-checked={button.checked}
              data-disabled={button.disabled}
            >
              {button.label}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default StandardButtonMatrixPreview
