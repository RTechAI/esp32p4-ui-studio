import React from 'react'
import { Select } from '@chakra-ui/react'

export type StandardSelectInteractionMode = 'canvas' | 'browser'

type Props = {
  mode: StandardSelectInteractionMode
  options?: unknown
  selectedIndex?: unknown
  legacyValue?: unknown
  isDisabled?: boolean
  icon?: React.ReactElement
  textColor?: string
  backgroundColor?: string
  borderColor?: string
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
  textColor,
  backgroundColor,
  borderColor,
  borderRadius = '8px',
}: Props) => {
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

  React.useEffect(() => {
    setPreviewIndex(serializedIndex)
  }, [serializedIndex, optionSignature])

  return (
    <Select
      width="100%"
      height="100%"
      value={options.length > 0 ? String(previewIndex) : ''}
      isDisabled={isDisabled}
      icon={icon}
      color={textColor}
      background={backgroundColor}
      borderColor={borderColor}
      borderRadius={borderRadius}
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
    >
      {options.map((option, index) => (
        <option key={index} value={index}>
          {option}
        </option>
      ))}
    </Select>
  )
}

export default StandardSelectPreview
