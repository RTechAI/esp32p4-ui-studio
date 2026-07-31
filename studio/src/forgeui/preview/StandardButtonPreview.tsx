import React from 'react'
import { Box } from '@chakra-ui/react'

import { getForgeUIStandardButtonText } from '../ForgeUIStandardButton'
import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const StandardButtonPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)

  return (
    <Box
      role="button"
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      px="12px"
      py="0"
      bg={theme.surface}
      color={theme.textPrimary}
      border={`2px solid ${theme.surfaceBorder}`}
      borderRadius="12px"
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize="14px"
      fontWeight="normal"
      lineHeight="1"
      textAlign="center"
      data-testid="standard-button-preview"
    >
      {getForgeUIStandardButtonText(component.props)}
    </Box>
  )
}

export default StandardButtonPreview
