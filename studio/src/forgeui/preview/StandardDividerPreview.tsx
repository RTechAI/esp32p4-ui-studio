import React from 'react'
import { Box } from '@chakra-ui/react'

import { getForgeUIStandardDividerPresentation } from '../ForgeUIStandardDivider'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

const StandardDividerPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const model = getForgeUIStandardDividerPresentation(
    component.props,
    theme.surfaceBorder,
  )

  return (
    <Box
      width="100%"
      height="100%"
      backgroundColor={model.color}
      opacity={model.opacity}
      data-orientation={model.orientation}
      data-testid="standard-divider-preview"
    />
  )
}

export default StandardDividerPreview
