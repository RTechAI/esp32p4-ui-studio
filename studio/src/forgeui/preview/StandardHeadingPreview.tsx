import React from 'react'
import { Text } from '@chakra-ui/react'

import { getForgeUIStandardHeadingPresentation } from '../ForgeUIStandardHeading'
import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const StandardHeadingPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const model = getForgeUIStandardHeadingPresentation(component.props)

  return (
    <Text
      width="100%"
      height="100%"
      m="0"
      p="0"
      overflow="hidden"
      whiteSpace="pre-wrap"
      overflowWrap="anywhere"
      color={theme.textPrimary}
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize={`${model.fontSize}px`}
      fontWeight={model.fontWeight}
      lineHeight="1.2"
      textAlign={model.textAlign}
      data-testid="standard-heading-preview"
    >
      {model.text}
    </Text>
  )
}

export default StandardHeadingPreview
