import React from 'react'
import { Box, Select } from '@chakra-ui/react'
import { useForgePreviewPalette } from '../theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from './forgeThemeMap'

export type StandardSelectInteractionMode = 'canvas' | 'browser'

type Props = {
  mode: StandardSelectInteractionMode
  options?: unknown
  selectedIndex?: unknown
  legacyValue?: unknown
  isDisabled?: boolean
  icon?: React.ReactElement
  borderRadius?: string | number
}

export const getStandardSelectOptions = (options: unknown): string[] => {
  if (Array.isArray(options)) return options.map(option => String(option))
  if (typeof options === 'string') {
    return options.length > 0 ? options.split('\n') : []
  }
  return ['Option 1', 'Option 2', 'Option 3']
}

const integer = (value: unknown, fallback: number) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? Math.trunc(numeric) : fallback
}

const getInitialIndex = (
  optionCount: number,
  selectedIndex: unknown,
  legacyValue: unknown,
) => {
  const legacyMatch = String(legacyValue ?? '').match(/^option(\d+)$/i)
  const configured = selectedIndex ??
    (legacyMatch ? Number(legacyMatch[1]) - 1 : 0)
  if (optionCount === 0) return 0
  return Math.max(0, Math.min(optionCount - 1, integer(configured, 0)))
}

const StandardSelectPreview = ({
  mode,
  options: configuredOptions,
  selectedIndex,
  legacyValue,
  isDisabled,
  icon,
  borderRadius = '8px',
}: Props) => {
  const theme = resolveForgeSemanticPalette(useForgePreviewPalette())
  const options = React.useMemo(
    () => getStandardSelectOptions(configuredOptions),
    [configuredOptions],
  )
  const optionSignature = JSON.stringify(options)
  const serializedIndex = getInitialIndex(
    options.length,
    selectedIndex,
    legacyValue,
  )
  const [previewIndex, setPreviewIndex] = React.useState(serializedIndex)
  const selectedOptionStyle = {
    background: theme.selectedSurface,
    color: theme.accentText,
  }

  React.useEffect(() => {
    setPreviewIndex(serializedIndex)
  }, [serializedIndex, optionSignature])

  return (
    <Box
      width="100%"
      height="100%"
      overflow="hidden"
      borderRadius={borderRadius}
      _focusWithin={{ borderColor: theme.accent }}
      style={{
        background: isDisabled ? theme.surfaceSecondary : theme.surface,
        border: `1px solid ${theme.surfaceBorder}`,
        borderRadius,
        boxShadow: 'none',
        outline: 'none',
      }}
      data-testid="standard-select-frame"
      data-border-role="surfaceBorder"
      data-focus-border-role="accent"
    >
      <Select
        width="100%"
        height="100%"
        value={options.length > 0 ? String(previewIndex) : ''}
        isDisabled={isDisabled}
        icon={icon}
        border="0"
        borderRadius="0"
        boxShadow="none"
        iconColor={isDisabled ? theme.disabledText : theme.textPrimary}
        _focus={{ border: '0', boxShadow: 'none', outline: 'none' }}
        _focusVisible={{ border: '0', boxShadow: 'none', outline: 'none' }}
        _active={{
          background: theme.selectedSurface,
          color: theme.accentText,
        }}
        sx={{
          background: `${
            isDisabled ? theme.surfaceSecondary : theme.surface
          } !important`,
          color: `${
            isDisabled ? theme.disabledText : theme.textPrimary
          } !important`,
          WebkitTextFillColor: `${
            isDisabled ? theme.disabledText : theme.textPrimary
          } !important`,
          border: '0 !important',
          outline: 'none !important',
          boxShadow: 'none !important',
          opacity: '1 !important',
          '& option': {
            background: theme.surface,
            color: theme.textPrimary,
          },
          '& option:checked': selectedOptionStyle,
        }}
        onChange={event => {
          const nextIndex = integer(event.target.value, 0)
          setPreviewIndex(Math.max(
            0,
            Math.min(options.length - 1, nextIndex),
          ))
        }}
        className={
          mode === 'canvas'
            ? 'forgeui-canvas-control-interactive'
            : undefined
        }
        onDragStart={mode === 'canvas'
          ? event => {
            event.preventDefault()
            event.stopPropagation()
          }
          : undefined}
        data-testid="standard-select-control"
        data-select-index={previewIndex}
        data-shared-select-renderer="true"
        data-field-background-role={isDisabled
          ? 'surfaceSecondary'
          : 'surface'}
        data-text-role={isDisabled ? 'disabledText' : 'textPrimary'}
        data-arrow-role={isDisabled ? 'disabledText' : 'textPrimary'}
        data-pressed-background-role="selectedSurface"
        data-pressed-text-role="accentText"
        data-option-background-role="surface"
        data-option-text-role="textPrimary"
        data-selected-option-background-role="selectedSurface"
        data-selected-option-text-role="accentText"
      >
        {options.map((option, index) => (
          <option key={index} value={index}>
            {option}
          </option>
        ))}
      </Select>
    </Box>
  )
}

export default StandardSelectPreview
