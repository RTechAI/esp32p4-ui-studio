import React, { memo } from 'react'
import NumberControl from '~components/inspector/controls/NumberControl'

const SliderPanel = () => (
  <>
    <NumberControl name="min" label="Minimum" precision={0} />
    <NumberControl name="max" label="Maximum" precision={0} />
    <NumberControl name="value" label="Initial Value" precision={0} />
    <NumberControl name="step" label="Step" min={1} precision={0} />
  </>
)

export default memo(SliderPanel)
