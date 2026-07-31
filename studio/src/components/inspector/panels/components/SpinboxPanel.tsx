import React, { memo } from 'react'
import { Heading, Select } from '@chakra-ui/react'
import NumberControl from '~components/inspector/controls/NumberControl'
import SwitchControl from '~components/inspector/controls/SwitchControl'
import ColorsControl from '~components/inspector/controls/ColorsControl'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'

const Section = ({ children }: React.PropsWithChildren<{}>) => (
  <Heading size="xs" mt={3} mb={1} color="gray.400">{children}</Heading>
)

const SpinboxPanel = () => {
  const { setValueFromEvent } = useForm()
  const textAlign = usePropsSelector('textAlign') || 'right'
  return (
    <>
      <Section>Value</Section>
      <NumberControl name="min" label="Minimum" precision={0} />
      <NumberControl name="max" label="Maximum" precision={0} />
      <NumberControl name="value" label="Value" precision={0} />
      <NumberControl name="step" label="Step (power of 10)" min={1} precision={0} />
      <SwitchControl name="rollover" label="Rollover" />

      <Section>Format</Section>
      <NumberControl name="digitCount" label="Digit count" min={1} max={10} precision={0} />
      <NumberControl name="decimalPlaces" label="Decimal places" min={0} max={9} precision={0} />
      <FormControl label="Text alignment" htmlFor="textAlign">
        <Select
          id="textAlign"
          name="textAlign"
          size="sm"
          value={textAlign}
          onChange={setValueFromEvent}
        >
          <option value="left">Left</option>
          <option value="center">Centre</option>
          <option value="right">Right</option>
        </Select>
      </FormControl>

      <Section>Appearance</Section>
      <NumberControl name="padding" label="Padding" min={0} max={48} precision={0} />
      <NumberControl name="opacity" label="Opacity (%)" min={0} max={100} precision={0} />
      <SwitchControl name="visible" label="Visible" defaultValue />
      <ColorsControl label="Background override" name="backgroundColor" enableHues />
      <ColorsControl label="Border override" name="borderColor" enableHues />
      <ColorsControl label="Text override" name="textColor" enableHues />
      <ColorsControl label="Selected digit override" name="selectedColor" enableHues />
    </>
  )
}

export default memo(SpinboxPanel)
