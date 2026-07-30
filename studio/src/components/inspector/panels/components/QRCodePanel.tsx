import React, { memo } from 'react'

import ColorsControl from '~components/inspector/controls/ColorsControl'
import SwitchControl from '~components/inspector/controls/SwitchControl'
import TextControl from '~components/inspector/controls/TextControl'

const QRCodePanel = () => (
  <>
    <TextControl name="qrText" label="QR Text" />
    <ColorsControl name="qrForeground" label="Foreground Colour" withFullColor />
    <ColorsControl name="qrBackground" label="Background Colour" withFullColor />
    <SwitchControl
      name="qrQuietZone"
      label="Padding (Quiet Zone)"
      defaultValue
    />
  </>
)

export default memo(QRCodePanel)
