import React from 'react'
import { Switch } from '@chakra-ui/react'

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
      sx={accent || surface || thumb ? {
        '.chakra-switch__track': {
          bg: checked ? accent : surface,
        },
        '.chakra-switch__thumb': {
          bg: thumb,
        },
      } : undefined}
    />
  )
}

export default StandardSwitchPreview
