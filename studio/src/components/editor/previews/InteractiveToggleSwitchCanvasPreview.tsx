import React, { useEffect, useState } from 'react'
import InteractiveToggleSwitchPreview from '~forgeui/interactive/InteractiveToggleSwitchPreview'
import {
  getInteractiveToggleSwitchAsset,
  getInteractiveToggleSwitchDimensions,
  getInteractiveToggleSwitchInitialState,
  resolveInteractiveToggleSwitchVisuals,
} from '~forgeui/interactive'
import { forgeUIGetUploadedAssets } from '~forgeui/ForgeUIUploadedAssetRegistry'

const InteractiveToggleSwitchCanvasPreview = ({ component }: { component: IComponent }) => {
  const asset = component.props.interactiveAssetId
    ? getInteractiveToggleSwitchAsset(component.props.interactiveAssetId)
    : undefined
  const { offAsset, onAsset } = resolveInteractiveToggleSwitchVisuals(asset, forgeUIGetUploadedAssets())
  const { width, height } = getInteractiveToggleSwitchDimensions(asset, {
    width: Number(component.props.w || 64),
    height: Number(component.props.h || 36),
  })
  const initialState = getInteractiveToggleSwitchInitialState(asset)
  const [state, setState] = useState(initialState)
  useEffect(() => setState(initialState), [asset?.id, initialState])

  return <InteractiveToggleSwitchPreview
    offAsset={offAsset}
    onAsset={onAsset}
    width={width}
    height={height}
    state={state}
    onPreviewClick={() => setState(current => current === 'off' ? 'on' : 'off')}
  />
}

export default InteractiveToggleSwitchCanvasPreview
