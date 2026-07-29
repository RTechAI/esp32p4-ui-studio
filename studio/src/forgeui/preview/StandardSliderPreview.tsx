import React from 'react'
import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react'

export type StandardSliderInteractionMode = 'canvas' | 'browser'

type Props = {
  mode: StandardSliderInteractionMode
  value?: unknown
  min?: unknown
  max?: unknown
  step?: unknown
  orientation?: 'horizontal' | 'vertical'
  isDisabled?: boolean
  trackColor?: string
  fillColor?: string
  thumbColor?: string
}

const finiteNumber = (value: unknown, fallback: number) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}

const StandardSliderPreview = ({
  mode,
  value,
  min,
  max,
  step,
  orientation = 'horizontal',
  isDisabled,
  trackColor,
  fillColor,
  thumbColor,
}: Props) => {
  const minimum = finiteNumber(min, 0)
  const maximum = Math.max(minimum, finiteNumber(max, 100))
  const increment = Math.max(0.000001, finiteNumber(step, 1))
  const serializedValue = Math.max(
    minimum,
    Math.min(maximum, finiteNumber(value, 50)),
  )
  const [previewValue, setPreviewValue] = React.useState(serializedValue)

  React.useEffect(() => {
    setPreviewValue(serializedValue)
  }, [serializedValue])

  const interactive = !isDisabled

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="0"
      data-testid={`standard-slider-${mode}`}
      data-slider-value={previewValue}
    >
      <Slider
        value={previewValue}
        min={minimum}
        max={maximum}
        step={increment}
        orientation={orientation}
        isDisabled={isDisabled}
        onChange={interactive ? setPreviewValue : undefined}
        width={orientation === 'vertical' ? undefined : '100%'}
        height={orientation === 'vertical' ? '100%' : undefined}
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
        data-testid="standard-slider-control"
      >
        <SliderTrack bg={trackColor}>
          <SliderFilledTrack bg={fillColor} />
        </SliderTrack>
        <SliderThumb bg={thumbColor} />
      </Slider>
    </Box>
  )
}

export default StandardSliderPreview
