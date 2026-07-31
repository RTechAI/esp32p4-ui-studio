import React from 'react'
import { Box, Button } from '@chakra-ui/react'
import { useForgePreviewPalette } from '../theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from './forgeThemeMap'
import {
  formatForgeUIStandardSpinboxValue,
  getForgeUIStandardSpinboxModel,
  stepForgeUIStandardSpinboxValue,
} from '../ForgeUIStandardSpinbox'

const StandardSpinboxPreview = ({
  mode,
  props,
  onValueChange,
}: {
  mode: 'canvas' | 'browser'
  props: Record<string, unknown>
  onValueChange?: (value: number) => void
}) => {
  const palette = resolveForgeSemanticPalette(useForgePreviewPalette())
  const model = getForgeUIStandardSpinboxModel(props)
  const [value, setValue] = React.useState(model.value)
  const suppressCanvasClick = React.useRef(false)

  React.useEffect(() => setValue(model.value), [model.value])

  const change = (direction: 1 | -1) => {
    const currentValue = mode === 'canvas' ? model.value : value
    const next = stepForgeUIStandardSpinboxValue(
      model,
      Math.max(model.minimum, Math.min(model.maximum, currentValue)),
      direction,
    )
    if (mode === 'canvas') {
      onValueChange?.(next)
      return
    }
    setValue(next)
  }
  const renderedValue = mode === 'canvas' ? model.value : value
  const formatted = formatForgeUIStandardSpinboxValue(model, renderedValue)
  const activate = (
    direction: 1 | -1,
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (mode !== 'canvas') return
    event.preventDefault()
    event.stopPropagation()
    suppressCanvasClick.current = true
    change(direction)
    window.setTimeout(() => {
      suppressCanvasClick.current = false
    }, 0)
  }
  const click = (direction: 1 | -1) => {
    if (mode === 'canvas' && suppressCanvasClick.current) {
      suppressCanvasClick.current = false
      return
    }
    change(direction)
  }
  const digitIndexes = Array.from(formatted)
    .map((character, index) => /\d/.test(character) ? index : -1)
    .filter(index => index >= 0)
  const selectedIndex =
    digitIndexes[digitIndexes.length - 1 - model.cursorPosition]

  return (
    <Box
      width="100%"
      height="100%"
      display={model.visible ? 'flex' : 'none'}
      alignItems="stretch"
      border={`1px solid ${model.borderColor || palette.surfaceBorder}`}
      borderRadius="6px"
      overflow="hidden"
      bg={model.backgroundColor || palette.surface}
      opacity={model.opacity / 100}
      tabIndex={0}
      role="spinbutton"
      aria-valuemin={model.minimum}
      aria-valuemax={model.maximum}
      aria-valuenow={renderedValue}
      aria-valuetext={formatted}
      onKeyDown={event => {
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          change(1)
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          change(-1)
        }
      }}
      data-testid={`standard-spinbox-${mode}`}
      data-spinbox-value={renderedValue}
    >
      <Box
        flex="1"
        minWidth="0"
        px={`${model.padding}px`}
        display="flex"
        alignItems="center"
        justifyContent={model.textAlign === 'left'
          ? 'flex-start'
          : model.textAlign === 'center' ? 'center' : 'flex-end'}
        color={model.textColor || palette.textPrimary}
        fontFamily="monospace"
        whiteSpace="pre"
        className={mode === 'canvas'
          ? 'forgeui-canvas-control-interactive'
          : undefined}
        cursor="text"
        onPointerDown={event => event.stopPropagation()}
        onMouseDown={event => event.stopPropagation()}
        onDragStart={event => event.preventDefault()}
        onClick={event => event.currentTarget.parentElement?.focus()}
        data-testid="standard-spinbox-value"
      >
        {Array.from(formatted).map((character, index) => (
          <Box
            as="span"
            key={`${index}-${character}`}
            bg={index === selectedIndex
              ? model.selectedColor || palette.selectedSurface
              : 'transparent'}
            color={index === selectedIndex
              ? palette.accentText
              : 'inherit'}
            data-selected={index === selectedIndex || undefined}
          >
            {character}
          </Box>
        ))}
      </Box>
      <Box width="34px" display="flex" flexDirection="column">
        <Button
          flex="1"
          minHeight="0"
          p="0"
          borderRadius="0"
          borderWidth="0 0 1px 1px"
          borderColor={model.borderColor || palette.surfaceBorder}
          bg={palette.surfaceSecondary}
          color={palette.textPrimary}
          className={mode === 'canvas'
            ? 'forgeui-canvas-control-interactive'
            : undefined}
          onPointerDown={event => event.stopPropagation()}
          onPointerUp={event => activate(1, event)}
          onMouseDown={event => event.stopPropagation()}
          onDragStart={event => event.preventDefault()}
          onClick={() => click(1)}
          aria-label="Increment Spinbox"
          data-testid="standard-spinbox-increment"
        >
          ▲
        </Button>
        <Button
          flex="1"
          minHeight="0"
          p="0"
          borderRadius="0"
          borderWidth="0 0 0 1px"
          borderColor={model.borderColor || palette.surfaceBorder}
          bg={palette.surfaceSecondary}
          color={palette.textPrimary}
          className={mode === 'canvas'
            ? 'forgeui-canvas-control-interactive'
            : undefined}
          onPointerDown={event => event.stopPropagation()}
          onPointerUp={event => activate(-1, event)}
          onMouseDown={event => event.stopPropagation()}
          onDragStart={event => event.preventDefault()}
          onClick={() => click(-1)}
          aria-label="Decrement Spinbox"
          data-testid="standard-spinbox-decrement"
        >
          ▼
        </Button>
      </Box>
    </Box>
  )
}

export default StandardSpinboxPreview
