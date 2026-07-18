import React from 'react'

import InteractiveButtonPreview from '~forgeui/interactive/InteractiveButtonPreview'

import {
  getInteractiveAsset,
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
      ? getInteractiveAsset(interactiveAssetId)
      : undefined

  const uploadedAssets =
    forgeUIGetUploadedAssets()

  const normalAsset =
    interactiveAsset?.normalAssetId
      ? uploadedAssets.find(
          asset =>
            asset.id ===
            interactiveAsset.normalAssetId,
        )
      : undefined

  const pressedAsset =
    interactiveAsset?.pressedAssetId
      ? uploadedAssets.find(
          asset =>
            asset.id ===
            interactiveAsset.pressedAssetId,
        )
      : undefined

  const width =
    interactiveAsset?.width ||
    component.props.w ||
    120

  const height =
    interactiveAsset?.height ||
    component.props.h ||
    48

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