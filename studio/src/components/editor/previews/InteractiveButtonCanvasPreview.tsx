import React from 'react'

import InteractiveButtonPreview from '~forgeui/interactive/InteractiveButtonPreview'

import {
  getInteractiveButtonAsset,
  getInteractiveButtonDimensions,
  resolveInteractiveButtonVisuals,
} from '~forgeui/interactive'

import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

const InteractiveButtonCanvasPreview = ({
  component,
}: {
  component: IComponent
}) => {
  const interactiveAssetId =
    component.props.interactiveAssetId

  const interactiveAsset =
    interactiveAssetId
      ? getInteractiveButtonAsset(interactiveAssetId)
      : undefined

  const uploadedAssets =
    forgeUIGetUploadedAssets()

  const {
    normalAsset,
    pressedAsset,
  } = resolveInteractiveButtonVisuals(
    interactiveAsset,
    uploadedAssets,
  )

  const { width, height } =
    getInteractiveButtonDimensions(
      interactiveAsset,
      {
        width: Number(component.props.w || 120),
        height: Number(component.props.h || 48),
      },
    )

  return (
    <InteractiveButtonPreview
      normalAsset={normalAsset}
      pressedAsset={pressedAsset}
      width={width}
      height={height}
    />
  )
}

export default InteractiveButtonCanvasPreview
