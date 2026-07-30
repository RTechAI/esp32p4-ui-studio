import React from 'react'
import { Switch } from '@chakra-ui/react'
import { useForgePreviewPalette } from '../theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from './forgeThemeMap'

type Props = {
  initialChecked: boolean
  isDisabled?: boolean
  colorScheme?: string
  accent?: string
  surface?: string
  thumb?: string
}

const StandardSwitchPreview = ({
  initialChecked,
  isDisabled,
  colorScheme,
  accent,
  surface,
  thumb,
}: Props) => {
  const theme = resolveForgeSemanticPalette(useForgePreviewPalette())
  const resolvedAccent = accent || theme.accent
  const resolvedSurface = surface || theme.surfaceSecondary
  const resolvedThumb = thumb || theme.accentText
  const [checked, setChecked] = React.useState(initialChecked)

  React.useEffect(() => {
    setChecked(initialChecked)
  }, [initialChecked])

  return (
    <Switch
      isChecked={checked}
      isDisabled={isDisabled}
      colorScheme={colorScheme}
      onChange={event => {
        if (!isDisabled) setChecked(event.target.checked)
      }}
      data-testid="standard-switch-preview"
      sx={{
        '.chakra-switch__track': {
          bg: checked ? resolvedAccent : resolvedSurface,
        },
        '.chakra-switch__thumb': {
          bg: resolvedThumb,
        },
      }}
    />
  )
}

export default StandardSwitchPreview
