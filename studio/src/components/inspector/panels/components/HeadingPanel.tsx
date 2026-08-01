import React, { memo } from 'react'
import { Select, Textarea } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import FormControl from '~components/inspector/controls/FormControl'
import usePropsSelector from '~hooks/usePropsSelector'
import { getForgeUIStandardHeadingText } from '~forgeui/ForgeUIStandardHeading'

const HeadingPanel = () => {
  const { setValueFromEvent } = useForm()

  const headingText = usePropsSelector('headingText')
  const legacyChildren = usePropsSelector('children')
  const legacyText = usePropsSelector('text')
  const legacyValue = usePropsSelector('value')
  const size = usePropsSelector('size')
  const as = usePropsSelector('as')

  return (
    <>
      <FormControl htmlFor="headingText" label="Heading Text">
        <Textarea
          id="headingText"
          name="headingText"
          size="sm"
          rows={3}
          value={getForgeUIStandardHeadingText({
            headingText,
            children: legacyChildren,
            text: legacyText,
            value: legacyValue,
          })}
          onChange={setValueFromEvent}
        />
      </FormControl>
      <FormControl label="Size" htmlFor="size">
        <Select
          name="size"
          id="size"
          size="sm"
          value={size}
          onChange={setValueFromEvent}
        >
          <option>xs</option>
          <option>sm</option>
          <option>md</option>
          <option>lg</option>
          <option>xl</option>
          <option>2xl</option>
        </Select>
      </FormControl>
      <FormControl label="As">
        <Select
          size="sm"
          value={as || ''}
          onChange={setValueFromEvent}
          name="as"
        >
          <option>h1</option>
          <option>h2</option>
          <option>h3</option>
          <option>h4</option>
          <option>h5</option>
          <option>h6</option>
        </Select>
      </FormControl>
    </>
  )
}

export default memo(HeadingPanel)
