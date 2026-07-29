import React from 'react'
import { Checkbox } from '@chakra-ui/react'

type Props = {
  initialChecked: boolean
  label: React.ReactNode
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
  isDisabled,
  colorScheme,
  textColor,
  accent,
  surface,
  border,
}: Props) => {
  const [checked, setChecked] = React.useState(initialChecked)

  React.useEffect(() => {
    setChecked(initialChecked)
  }, [initialChecked])

  return (
    <Checkbox
      isChecked={checked}
      isDisabled={isDisabled}
      colorScheme={colorScheme}
      color={textColor}
      onChange={event => {
        if (!isDisabled) setChecked(event.target.checked)
      }}
      data-testid="standard-checkbox-preview"
      sx={accent || surface || border ? {
        '.chakra-checkbox__control': {
          bg: surface,
          borderColor: border,
        },
        '.chakra-checkbox__control[data-checked]': {
          bg: accent,
          borderColor: accent,
        },
      } : undefined}
    >
      {label}
    </Checkbox>
  )
}

export default StandardCheckboxPreview
