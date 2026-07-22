import React from 'react'
import InteractiveLightPreview from './InteractiveLightPreview'
import type { ForgeUIUploadedAsset } from '~forgeui/ForgeUIUploadedAssetRegistry'
import type { ForgeUIInteractiveToggleSwitchState } from './ForgeUIInteractiveToggleSwitchAsset'

type Props = {
  offAsset?: ForgeUIUploadedAsset
  onAsset?: ForgeUIUploadedAsset
  width: number
  height: number
  state: ForgeUIInteractiveToggleSwitchState
  onStateChange?: (state: ForgeUIInteractiveToggleSwitchState) => void
  showControls?: boolean
  onPreviewClick?: React.MouseEventHandler<HTMLDivElement>
}

const InteractiveToggleSwitchPreview = (props: Props) => (
  <InteractiveLightPreview {...props} />
)

export default InteractiveToggleSwitchPreview
