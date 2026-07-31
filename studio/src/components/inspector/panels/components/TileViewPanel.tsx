import React, { memo } from 'react'

import NumberControl from '~components/inspector/controls/NumberControl'

const TileViewPanel = () => (
  <>
    <NumberControl
      name="initialColumn"
      label="Initial column"
      min={0}
      max={1}
      precision={0}
    />
    <NumberControl
      name="initialRow"
      label="Initial row"
      min={0}
      max={1}
      precision={0}
    />
  </>
)

export default memo(TileViewPanel)
