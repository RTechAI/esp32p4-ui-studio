import React from 'react'
import { Text } from '@chakra-ui/react'

import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const StandardWifiPreview: React.FC<{
  palette: ForgePreviewPalette
}> = ({ palette }) => {
  const theme = resolveForgeSemanticPalette(palette)

  return (
    <Text
      width="100%"
      height="100%"
      m="0"
      p="0"
      overflow="hidden"
      whiteSpace="pre"
      color={theme.accent}
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize="20px"
      fontWeight="normal"
      lineHeight="20px"
      textAlign="left"
      data-testid="standard-wifi-preview"
    >
      {'WIFI\nWIFI_FAIL\nIP: -'}
    </Text>
  )
}

export default StandardWifiPreview
