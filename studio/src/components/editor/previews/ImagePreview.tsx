import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { useForgePreviewPalette } from '~forgeui/theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from '~forgeui/preview/forgeThemeMap'

interface IProps {
  component: IComponent
}

const ImagePreview = ({ component }: IProps) => {
  const theme = resolveForgeSemanticPalette(useForgePreviewPalette())
  const src = component.props.src || ''

  return (
    <Chakra.Box
      width="100%"
      height="100%"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={theme.surface}
      border={`1px solid ${theme.surfaceBorder}`}
    >
      <Chakra.Image
        src={src}
        width="100%"
        height="100%"
        objectFit={component.props.objectFit || 'contain'}
        draggable={false}
        pointerEvents="none"
      />
    </Chakra.Box>
  )
}

export default ImagePreview
