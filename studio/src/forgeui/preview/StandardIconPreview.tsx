import React from 'react'
import { Box, Image } from '@chakra-ui/react'
import icons from '~iconsList'

import { getForgeUIStandardIconPresentation } from '../ForgeUIStandardIcon'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

const StandardIconPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const model = getForgeUIStandardIconPresentation(
    component.props,
    theme.textPrimary,
  )
  const Icon = icons[model.icon as keyof typeof icons]

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      visibility={model.visible ? 'visible' : 'hidden'}
      opacity={model.opacity}
      data-testid="standard-icon-preview"
    >
      {model.src
        ? <Image src={model.src} alt="" boxSize={`${model.iconSize}px`} objectFit="contain" />
        : Icon
          ? <Icon color={model.color} size={model.iconSize} />
          : null}
    </Box>
  )
}

export default StandardIconPreview
