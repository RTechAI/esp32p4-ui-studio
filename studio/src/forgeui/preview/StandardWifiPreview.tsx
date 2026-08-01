import React from 'react'
import { HStack, Text } from '@chakra-ui/react'
import { FiWifi } from 'react-icons/fi'
import {
  getForgeUIStandardWifiStatusPresentation,
  getForgeUIWifiStatusText,
} from '../ForgeUIStandardWifiStatus'

import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const StandardWifiPreview: React.FC<{
  palette: ForgePreviewPalette
  component: IComponent
}> = ({ palette, component }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const presentation = getForgeUIStandardWifiStatusPresentation(component.props)

  return (
    <HStack
      width="100%"
      height="100%"
      m="0"
      p="0"
      overflow="hidden"
      whiteSpace="nowrap"
      color={theme.accent}
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize="20px"
      fontWeight="normal"
      lineHeight="1"
      textAlign="left"
      data-testid="standard-wifi-preview"
      spacing="6px"
    >
      {presentation.displayMode !== 'text-only' && <FiWifi aria-label="Wi-Fi" />}
      {presentation.displayMode !== 'icon-only' && (
        <Text as="span">{getForgeUIWifiStatusText(presentation.previewState)}</Text>
      )}
      {presentation.showSignalStrength &&
        presentation.previewState !== 'disabled' &&
        presentation.previewState !== 'failed' && <Text as="span">-62 dBm</Text>}
    </HStack>
  )
}

export default StandardWifiPreview
