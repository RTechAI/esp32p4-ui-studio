import React from 'react'
import { Text } from '@chakra-ui/react'

import { getForgeUIStandardTextValue } from '../ForgeUIStandardText'
import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const StandardTextPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)

  return (
    <Text
      width="100%"
      height="100%"
      display="block"
      m="0"
      p="0"
      overflow="hidden"
      whiteSpace="pre-wrap"
      overflowWrap="anywhere"
      color={theme.textPrimary}
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize={`${component.props.fontSize || 24}px`}
      fontWeight="normal"
      lineHeight="1.2"
      textAlign={component.props.textAlign || component.props.align || 'left'}
      data-testid="standard-text-preview"
    >
      {getForgeUIStandardTextValue(component.props)}
    </Text>
  )
}

export default StandardTextPreview
