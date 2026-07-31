import React, { memo } from 'react'
import ColorsControl from '~components/inspector/controls/ColorsControl'
import NumberControl from '~components/inspector/controls/NumberControl'

const SpinnerPanel = () => (
  <>
    <NumberControl name="duration" label="Duration (ms)" min={1} precision={0} />
    <NumberControl name="arcLength" label="Arc Length (degrees)" min={1} max={359} precision={0} />
    <NumberControl name="arcWidth" label="Arc Width" min={1} precision={0} />
    <NumberControl name="backgroundWidth" label="Background Width" min={0} precision={0} />
    <NumberControl name="opacity" label="Opacity (%)" min={0} max={100} precision={0} />
    <ColorsControl label="Accent Colour" name="accentColor" enableHues />
    <ColorsControl label="Background Colour" name="backgroundColor" enableHues />
  </>
)

export default memo(SpinnerPanel)
