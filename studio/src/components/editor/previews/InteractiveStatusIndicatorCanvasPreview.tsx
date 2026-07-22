import React from 'react'

import InteractiveStatusIndicatorPreview from '~forgeui/interactive/InteractiveStatusIndicatorPreview'
import {
  getInteractiveStatusIndicatorAsset,
  getInteractiveStatusIndicatorDimensions,
  getInteractiveStatusIndicatorInitialState,
  resolveInteractiveStatusIndicatorVisuals,
} from '~forgeui/interactive'
import { forgeUIGetUploadedAssets } from '~forgeui/ForgeUIUploadedAssetRegistry'

const InteractiveStatusIndicatorCanvasPreview = ({ component }: { component: IComponent }) => {
  const interactiveAsset = component.props.interactiveAssetId
    ? getInteractiveStatusIndicatorAsset(component.props.interactiveAssetId)
    : undefined
  const { offAsset, onAsset } = resolveInteractiveStatusIndicatorVisuals(
    interactiveAsset,
    forgeUIGetUploadedAssets(),
  )
  const { width, height } = getInteractiveStatusIndicatorDimensions(
    interactiveAsset,
    {
      width: Number(component.props.w || 32),
      height: Number(component.props.h || 32),
    },
  )

  return (
    <InteractiveStatusIndicatorPreview
      offAsset={offAsset}
      onAsset={onAsset}
      width={width}
      height={height}
      state={getInteractiveStatusIndicatorInitialState(interactiveAsset)}
    />
  )
}

export default InteractiveStatusIndicatorCanvasPreview
