import React from 'react'
import {
  Box,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'
import { forgeuiInputStyle } from '~forgeui/ForgeUIControlStyle'

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
      data-testid={`standard-number-input-${mode}`}
      data-number-input-value={previewValue}
    >
      <NumberInput
        width="100%"
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
        {...forgeuiInputStyle}
      >
        <NumberInputField
          {...forgeuiInputStyle}
          color={textColor}
          background={backgroundColor}
          borderColor={borderColor}
        />
        <NumberInputStepper>
          <NumberIncrementStepper aria-label="Increment value" />
          <NumberDecrementStepper aria-label="Decrement value" />
        </NumberInputStepper>
      </NumberInput>
    </Box>
  )
}

export default StandardNumberInputPreview
