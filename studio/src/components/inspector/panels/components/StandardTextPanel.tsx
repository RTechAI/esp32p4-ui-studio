import React, { memo } from 'react'
import { Textarea } from '@chakra-ui/react'

import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { getForgeUIStandardTextValue } from '~forgeui/ForgeUIStandardText'

const StandardTextPanel = () => {
  const { setValueFromEvent } = useForm()
  const textValue = usePropsSelector('textValue')
  const legacyChildren = usePropsSelector('children')
  const legacyText = usePropsSelector('text')
  const legacyValue = usePropsSelector('value')

  return (
    <FormControl htmlFor="textValue" label="Text Value">
      <Textarea
        id="textValue"
        name="textValue"
        size="sm"
        rows={4}
        value={getForgeUIStandardTextValue({
          textValue,
          children: legacyChildren,
          text: legacyText,
          value: legacyValue,
        })}
        onChange={setValueFromEvent}
      />
    </FormControl>
  )
}

export default memo(StandardTextPanel)
