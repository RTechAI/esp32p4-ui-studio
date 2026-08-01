import React, { memo } from 'react'
import { Select } from '@chakra-ui/react'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import ColorsControl from '~components/inspector/controls/ColorsControl'
import usePropsSelector from '~hooks/usePropsSelector'

export const getVerticalDividerDropGeometry = (width: number, height: number) =>
  width === 180 && height === 2 ? { w: 2, h: 180 } : null

const DividerPanel = () => {
  const { setValue } = useForm()
  const orientation = usePropsSelector('orientation')
  const width = Number(usePropsSelector('w'))
  const height = Number(usePropsSelector('h'))

  const setOrientation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextOrientation = event.target.value
    setValue('orientation', nextOrientation)
    const verticalGeometry = nextOrientation === 'vertical'
      ? getVerticalDividerDropGeometry(width, height)
      : null
    if (verticalGeometry) {
      setValue('w', verticalGeometry.w)
      setValue('h', verticalGeometry.h)
    }
  }

  return (
    <>
      <FormControl label="Orientation" htmlFor="orientation">
        <Select
          name="orientation"
          id="orientation"
          size="sm"
          value={orientation || 'horizontal'}
          onChange={setOrientation}
        >
          <option>horizontal</option>
          <option>vertical</option>
        </Select>
      </FormControl>
      <ColorsControl
        withFullColor
        label="Border color"
        name="borderColor"
        enableHues
      />
    </>
  )
}

export default memo(DividerPanel)
