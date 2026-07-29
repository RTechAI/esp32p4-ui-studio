import React, { memo } from 'react'
import ColorsControl from '~components/inspector/controls/ColorsControl'
import SizeControl from '~components/inspector/controls/SizeControl'
import { Input, Select } from '@chakra-ui/react'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import IconControl from '~components/inspector/controls/IconControl'
import { getForgeUIStandardButtonText } from '~forgeui/ForgeUIStandardButton'

const ButtonPanel = () => {
  const { setValueFromEvent } = useForm()

  const buttonText = usePropsSelector('buttonText')
  const legacyChildren = usePropsSelector('children')
  const size = usePropsSelector('size')
  const variant = usePropsSelector('variant')

  return (
    <>
      <FormControl htmlFor="buttonText" label="Button Text">
        <Input
          id="buttonText"
          name="buttonText"
          size="sm"
          type="text"
          value={getForgeUIStandardButtonText({
            buttonText,
            children: legacyChildren,
          })}
          onChange={setValueFromEvent}
        />
      </FormControl>

      <SizeControl name="size" label="Size" value={size} />

      <FormControl htmlFor="variant" label="Variant">
        <Select
          id="variant"
          onChange={setValueFromEvent}
          name="variant"
          size="sm"
          value={variant || ''}
        >
          <option>outline</option>
          <option>ghost</option>
          <option>unstyled</option>
          <option>link</option>
          <option>solid</option>
        </Select>
      </FormControl>

      <ColorsControl label="Color Scheme" name="colorScheme" />
      <IconControl label="Left icon" name="leftIcon" />
      <IconControl label="Right icon" name="rightIcon" />
    </>
  )
}

export default memo(ButtonPanel)
