import React, { ReactNode } from 'react'
import { Switch } from '@chakra-ui/react'
import FormControl from './FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'

type SwitchControlPropsType = {
  name: string
  label: string | ReactNode
  defaultValue?: boolean
}

const SwitchControl: React.FC<SwitchControlPropsType> = ({
  name,
  label,
  defaultValue = false,
}) => {
  const { setValue } = useForm()
  const value = usePropsSelector(name)
  const checked = typeof value === 'boolean' ? value : defaultValue

  return (
    <FormControl label={label} htmlFor={name}>
      <Switch
      name={name}
      id={name}
      size="sm"
      colorScheme="cyan"
      isChecked={checked}
      onChange={() => setValue(name, !checked)}
/>
    </FormControl>
  )
}

export default SwitchControl
