import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import {
  ForgePreviewPalette,
  FG_PREVIEW_PALETTES,
  resolveForgeSemanticPalette,
} from '~forgeui/preview/forgeThemeMap'
import {
  getForgeUIStandardMessageBoxModel,
} from '~forgeui/ForgeUIStandardMessageBox'

type StandardMessageBoxPreviewProps = {
  component: IComponent
  palette?: ForgePreviewPalette
}

const StandardMessageBoxPreview: React.FC<
  StandardMessageBoxPreviewProps
> = ({
  component,
  palette = FG_PREVIEW_PALETTES.graphite,
}) => {
  const message = getForgeUIStandardMessageBoxModel(component.props)
  const theme = resolveForgeSemanticPalette(palette)

  return (
    <Box
      width="100%"
      height="100%"
      border={`1px solid ${theme.surfaceBorder}`}
      borderRadius="8px"
      bg={theme.surface}
      color={theme.textPrimary}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="8px"
      overflow="hidden"
      pointerEvents="none"
      data-testid="standard-message-box-preview"
    >
      <Text
        fontWeight="bold"
        data-testid="standard-message-box-title"
      >
        {message.title}
      </Text>

      <Text
        fontSize="sm"
        data-testid="standard-message-box-body"
      >
        {message.bodyText}
      </Text>

      <Box
        display="flex"
        justifyContent="flex-end"
        gap="6px"
        data-testid="standard-message-box-buttons"
      >
        {message.buttons.map((button, index) => (
          <Box
            key={`${index}-${button}`}
            px="8px"
            py="2px"
            border={`1px solid ${theme.surfaceBorder}`}
            data-testid="standard-message-box-button"
          >
            {button}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default StandardMessageBoxPreview
