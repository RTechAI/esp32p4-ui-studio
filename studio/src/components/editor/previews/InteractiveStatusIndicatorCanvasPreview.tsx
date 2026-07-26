import React, { useEffect, useState } from 'react'

import InteractiveStatusIndicatorPreview from '~forgeui/interactive/InteractiveStatusIndicatorPreview'
import UnconfiguredStatusIndicatorPlaceholder from '~forgeui/interactive/UnconfiguredStatusIndicatorPlaceholder'
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
  const savedInitialState =
    getInteractiveStatusIndicatorInitialState(interactiveAsset)
  const [previewState, setPreviewState] =
    useState(savedInitialState)

  useEffect(() => {
    setPreviewState(savedInitialState)
  }, [interactiveAsset?.id, savedInitialState])

  return (
    <InteractiveStatusIndicatorPreview
      offAsset={offAsset}
      onAsset={onAsset}
      width={width}
      height={height}
      state={previewState}
      minimumHeight={Math.min(height, 120)}
      missingVisual={
        <UnconfiguredStatusIndicatorPlaceholder
          width={width}
          height={height}
        />
      }
      onPreviewClick={() => {
        setPreviewState(current =>
          current === 'off' ? 'on' : 'off',
        )
      }}
    />
  )
}

export default InteractiveStatusIndicatorCanvasPreview
