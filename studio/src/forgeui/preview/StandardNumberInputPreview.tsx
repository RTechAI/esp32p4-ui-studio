import React from 'react'
import {
  Box,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'
import { useForgePreviewPalette } from '../theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from './forgeThemeMap'

export type StandardNumberInputInteractionMode = 'canvas' | 'browser'

type Props = {
  mode: StandardNumberInputInteractionMode
  value?: unknown
  min?: unknown
  max?: unknown
  step?: unknown
  precision?: unknown
  isDisabled?: boolean
  isReadOnly?: boolean
  textColor?: string
  backgroundColor?: string
  borderColor?: string
}

const finiteNumber = (value: unknown, fallback: number) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}

const StandardNumberInputPreview = ({
  mode,
  value,
  min,
  max,
  step,
  precision,
  isDisabled,
  isReadOnly,
  textColor,
  backgroundColor,
  borderColor,
}: Props) => {
  const theme = resolveForgeSemanticPalette(useForgePreviewPalette())
  const resolvedText = isDisabled
    ? theme.disabledText
    : textColor || theme.textPrimary
  const resolvedBackground = backgroundColor || theme.surface
  const resolvedBorder = borderColor || theme.surfaceBorder
  const firstRangeValue = finiteNumber(min, 0)
  const secondRangeValue = finiteNumber(max, 100)
  const minimum = Math.min(firstRangeValue, secondRangeValue)
  const maximum = Math.max(firstRangeValue, secondRangeValue)
  const increment = Math.max(
    Number.EPSILON,
    Math.abs(finiteNumber(step, 1)),
  )
  const decimalPlaces = Math.max(
    0,
    Math.min(20, Math.trunc(finiteNumber(precision, 0))),
  )
  const serializedValue = Math.max(
    minimum,
    Math.min(maximum, finiteNumber(value, 50)),
  )
  const serializedText = decimalPlaces > 0
    ? serializedValue.toFixed(decimalPlaces)
    : String(serializedValue)
  const [previewValue, setPreviewValue] = React.useState(serializedText)

  React.useEffect(() => {
    setPreviewValue(serializedText)
  }, [serializedText])

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="0"
      boxSizing="border-box"
      background={theme.surface}
      border="1px solid"
      borderColor={theme.surfaceBorder}
      borderRadius="6px"
      overflow="hidden"
      style={{
        background: theme.surface,
        border: `1px solid ${theme.surfaceBorder}`,
        borderRadius: '6px',
        overflow: 'hidden',
      }}
      data-testid={`standard-number-input-${mode}`}
      data-number-input-value={previewValue}
    >
      <NumberInput
        width="100%"
        height="100%"
        value={previewValue}
        min={minimum}
        max={maximum}
        step={increment}
        precision={decimalPlaces}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        onChange={(nextText, nextValue) => {
          if (Number.isFinite(nextValue)) {
            const clamped = Math.max(
              minimum,
              Math.min(maximum, nextValue),
            )
            setPreviewValue(clamped === nextValue
              ? nextText
              : decimalPlaces > 0
                ? clamped.toFixed(decimalPlaces)
                : String(clamped))
          }
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
        data-testid="standard-number-input-control"
      >
        <NumberInputField
          color={resolvedText}
          background={resolvedBackground}
          borderColor={resolvedBorder}
          borderWidth="0"
          borderRadius="0"
          height="100%"
          opacity={1}
          _placeholder={{ color: theme.textSecondary, opacity: 1 }}
          _disabled={{ color: theme.disabledText, opacity: 1 }}
          _focus={{
            borderColor: theme.accent,
            borderWidth: 0,
            boxShadow: 'none',
          }}
          _focusVisible={{
            borderWidth: 0,
            boxShadow: 'none',
          }}
        />
        <NumberInputStepper
          borderWidth="0"
          color={isDisabled ? theme.disabledText : theme.textPrimary}
          data-testid="standard-number-input-stepper"
        >
          <NumberIncrementStepper
            aria-label="Increment value"
            background={theme.surfaceSecondary}
            borderWidth="0"
            borderRadius="0"
            style={{ borderWidth: 0 }}
            color={isDisabled ? theme.disabledText : theme.textPrimary}
            _hover={{ background: theme.selectedSurface }}
            _active={{
              background: theme.accent,
              color: theme.accentText,
            }}
            _disabled={{
              background: theme.surfaceSecondary,
              color: theme.disabledText,
              opacity: 1,
            }}
          />
          <NumberDecrementStepper
            aria-label="Decrement value"
            background={theme.surfaceSecondary}
            borderWidth="0"
            borderRadius="0"
            style={{ borderWidth: 0 }}
            color={isDisabled ? theme.disabledText : theme.textPrimary}
            _hover={{ background: theme.selectedSurface }}
            _active={{
              background: theme.accent,
              color: theme.accentText,
            }}
            _disabled={{
              background: theme.surfaceSecondary,
              color: theme.disabledText,
              opacity: 1,
            }}
          />
          <Box
            position="absolute"
            left="0"
            top="0"
            bottom="0"
            width="1px"
            background={theme.surfaceBorder}
            pointerEvents="none"
            zIndex={1}
            data-testid="standard-number-input-vertical-divider"
          />
          <Box
            position="absolute"
            left="0"
            right="0"
            top="50%"
            height="1px"
            background={theme.surfaceBorder}
            pointerEvents="none"
            zIndex={1}
            data-testid="standard-number-input-horizontal-divider"
          />
        </NumberInputStepper>
      </NumberInput>
    </Box>
  )
}

export default StandardNumberInputPreview
