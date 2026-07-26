import React, {
  useEffect,
  useState,
} from 'react'

import InteractiveButtonPreview from '~forgeui/interactive/InteractiveButtonPreview'

import {
  getInteractiveButtonAsset,
  resolveInteractiveButtonVisuals,
} from '~forgeui/interactive'

import {
  forgeUIGetUploadedAssets,
  forgeUIResolveUploadedAssetDimensions,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
} from '~forgeui/ForgeUINavigation'

export const getInteractiveButtonCanvasAspectRatio = (
  component: IComponent,
): number | undefined => {
  const interactiveAsset =
    component.props.interactiveAssetId
      ? getInteractiveButtonAsset(
          component.props.interactiveAssetId,
        )
      : undefined
  const { normalAsset, pressedAsset } =
    resolveInteractiveButtonVisuals(
      interactiveAsset,
      forgeUIGetUploadedAssets(),
    )
  const dimensions =
    (normalAsset
      ? forgeUIResolveUploadedAssetDimensions(
          normalAsset,
        )
      : undefined) ||
    (pressedAsset
      ? forgeUIResolveUploadedAssetDimensions(
          pressedAsset,
        )
      : undefined)

  return dimensions
    ? dimensions.width / dimensions.height
    : undefined
}

const InteractiveButtonCanvasPreview = ({
  component,
}: {
  component: IComponent
}) => {
  const [, refreshResolution] = useState(0)

  useEffect(() => {
    const refresh = () =>
      refreshResolution(version => version + 1)
    window.addEventListener(
      'forgeui-assets-updated',
      refresh,
    )
    window.addEventListener(
      FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      refresh,
    )
    return () => {
      window.removeEventListener(
        'forgeui-assets-updated',
        refresh,
      )
      window.removeEventListener(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
        refresh,
      )
    }
  }, [])

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

  const width = Number(component.props.w || 120)
  const height = Number(component.props.h || 48)
  const isConfigured =
    Boolean(interactiveAsset) &&
    Boolean(normalAsset) &&
    Boolean(pressedAsset)

  return isConfigured ? (
    <InteractiveButtonPreview
      key={`configured-${interactiveAssetId}-${normalAsset?.id}-${pressedAsset?.id}`}
      normalAsset={normalAsset}
      pressedAsset={pressedAsset}
      width={width}
      height={height}
    />
  ) : (
    <InteractiveButtonPreview
      key="unconfigured"
      width={width}
      height={height}
    />
  )
}

export default InteractiveButtonCanvasPreview
