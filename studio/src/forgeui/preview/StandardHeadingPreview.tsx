import React from 'react'
import { Text } from '@chakra-ui/react'

import { getForgeUIStandardHeadingText } from '../ForgeUIStandardHeading'
import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const StandardHeadingPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)

  return (
    <Text
      width="100%"
      height="100%"
      m="0"
      p="0"
      overflow="hidden"
      color={theme.textPrimary}
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize={`${component.props.fontSize || 32}px`}
      fontWeight={component.props.fontWeight || 'normal'}
      lineHeight="1.2"
      textAlign={component.props.textAlign || component.props.align || 'left'}
      data-testid="standard-heading-preview"
    >
      {getForgeUIStandardHeadingText(component.props)}
    </Text>
  )
}

export default StandardHeadingPreview
