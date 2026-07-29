import React, { memo } from 'react'
import { Select } from '@chakra-ui/react'

import FormControl from '~components/inspector/controls/FormControl'
import SwitchControl from '~components/inspector/controls/SwitchControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'

const ClockPanel = () => {
  const { setValueFromEvent } = useForm()
  const hourFormat = usePropsSelector('hourFormat')

  return (
    <>
      <FormControl htmlFor="hourFormat" label="Hour Format">
        <Select
          id="hourFormat"
          name="hourFormat"
          size="sm"
          value={hourFormat === '12' ? '12' : '24'}
          onChange={setValueFromEvent}
        >
          <option value="24">24 hour</option>
          <option value="12">12 hour</option>
        </Select>
      </FormControl>
      <SwitchControl
        label="Show Seconds"
        name="showSeconds"
        defaultValue={false}
      />
      <SwitchControl
        label="Blink Separator"
        name="blinkSeparator"
        defaultValue
      />
    </>
  )
}

export default memo(ClockPanel)
