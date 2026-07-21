import React, { useEffect, useState } from 'react'

import InteractiveLightPreview from '~forgeui/interactive/InteractiveLightPreview'
import {
  getInteractiveLightAsset,
  getInteractiveLightDimensions,
  getInteractiveLightInitialState,
  resolveInteractiveLightVisuals,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

const InteractiveLightCanvasPreview = ({
  component,
}: {
  component: IComponent
}) => {
  const interactiveAsset = component.props.interactiveAssetId
    ? getInteractiveLightAsset(component.props.interactiveAssetId)
    : undefined

  const { offAsset, onAsset } = resolveInteractiveLightVisuals(
    interactiveAsset,
    forgeUIGetUploadedAssets(),
  )

  const { width, height } = getInteractiveLightDimensions(
    interactiveAsset,
    {
      width: Number(component.props.w || 32),
      height: Number(component.props.h || 32),
    },
  )

  const savedInitialState =
    getInteractiveLightInitialState(interactiveAsset)
  const [previewState, setPreviewState] =
    useState(savedInitialState)

  useEffect(() => {
    setPreviewState(savedInitialState)
  }, [interactiveAsset?.id, savedInitialState])

  return (
    <InteractiveLightPreview
      offAsset={offAsset}
      onAsset={onAsset}
      width={width}
      height={height}
      state={previewState}
      onPreviewClick={() => {
        setPreviewState(current =>
          current === 'off' ? 'on' : 'off',
        )
      }}
    />
  )
}

export default InteractiveLightCanvasPreview
