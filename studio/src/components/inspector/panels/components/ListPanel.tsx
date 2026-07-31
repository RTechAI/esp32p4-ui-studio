import React, { memo } from 'react'
import FormControl from '~components/inspector/controls/FormControl'
import { Textarea } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import TextControl from '~components/inspector/controls/TextControl'
import NumberControl from '~components/inspector/controls/NumberControl'
import { forgeuiInputStyle } from '~forgeui/ForgeUIControlStyle'

const ListPanel = () => {
  const { setValue } = useForm()
  const items = usePropsSelector('items')

  return (
    <>
      <TextControl name="title" label="Title" placeholder="Optional section title" />
      <FormControl label="Items (one per line)" htmlFor="items">
        <Textarea
          {...forgeuiInputStyle}
          name="items"
          id="items"
          size="sm"
          rows={7}
          resize="vertical"
          value={items || ''}
          onChange={event => setValue('items', event.target.value)}
        />
      </FormControl>
      <NumberControl name="itemHeight" label="Item height" min={24} max={120} precision={0} />
    </>
  )
}

export default memo(ListPanel)
