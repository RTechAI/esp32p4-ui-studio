import React from 'react'
import { Checkbox } from '@chakra-ui/react'
import { useForgePreviewPalette } from '../theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from './forgeThemeMap'

type Props = {
  initialChecked: boolean
  label: React.ReactNode
  mode?: 'canvas' | 'browser'
  isDisabled?: boolean
  colorScheme?: string
  textColor?: string
  accent?: string
  surface?: string
  border?: string
}

const StandardCheckboxPreview = ({
  initialChecked,
  label,
  mode = 'browser',
  isDisabled,
  colorScheme,
  textColor,
  accent,
  surface,
  border,
}: Props) => {
  const theme = resolveForgeSemanticPalette(useForgePreviewPalette())
  const resolvedText = isDisabled
    ? theme.disabledText
    : textColor || theme.textPrimary
  const resolvedAccent = accent || theme.accent
  const resolvedSurface = surface || theme.surface
  const resolvedBorder = border || theme.surfaceBorder
  const [checked, setChecked] = React.useState(initialChecked)

  React.useEffect(() => {
    setChecked(initialChecked)
  }, [initialChecked])

  const checkbox = (
    <Checkbox
      isChecked={checked}
      isDisabled={isDisabled}
      colorScheme={colorScheme}
      color={resolvedText}
      pointerEvents={mode === 'canvas' ? 'none' : undefined}
      onChange={event => {
        if (!isDisabled) {
          setChecked(event.target.checked)
        }
      }}
      data-testid="standard-checkbox-preview"
      sx={{
        '.chakra-checkbox__control': {
          bg: resolvedSurface,
          borderColor: resolvedBorder,
        },
        '.chakra-checkbox__control[data-checked]': {
          bg: resolvedAccent,
          borderColor: resolvedAccent,
          color: theme.accentText,
        },
      }}
    >
      {label === '' || label === null || label === undefined ? null : label}
    </Checkbox>
  )

  if (mode === 'browser') return checkbox

  return (
    <span
      data-testid="standard-checkbox-canvas-interaction"
      style={{ display: 'inline-flex' }}
      onPointerDown={event => event.stopPropagation()}
      onMouseDown={event => event.stopPropagation()}
      onDragStart={event => {
        event.preventDefault()
        event.stopPropagation()
      }}
      onClick={event => {
        event.preventDefault()
        event.stopPropagation()
        if (!isDisabled) setChecked(current => !current)
      }}
    >
      {checkbox}
    </span>
  )
}

export default StandardCheckboxPreview
