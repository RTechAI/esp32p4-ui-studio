import React from 'react'
import { Box } from '@chakra-ui/react'

import { getForgeUIStandardBoxPresentation } from '../ForgeUIStandardBox'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

const StandardBoxPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
  children?: React.ReactNode
}> = ({ component, palette, children }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const model = getForgeUIStandardBoxPresentation(component.props, theme)
  const withOpacity = (color: string, opacity: number) =>
    `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`

  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
      overflow="hidden"
      visibility={model.visible ? 'visible' : 'hidden'}
      backgroundColor={withOpacity(model.backgroundColor, model.backgroundOpacity)}
      border={`${model.borderWidth}px solid ${withOpacity(model.borderColor, model.borderOpacity)}`}
      borderRadius={`${model.borderRadius}px`}
      data-testid="standard-box-preview"
      data-layout-region={component.props.layoutRegionKey}
    >
      {children}
    </Box>
  )
}

export default StandardBoxPreview
