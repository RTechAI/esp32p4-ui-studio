import React, { useEffect, useState } from 'react'

import InteractiveStatusIndicatorPreview from '~forgeui/interactive/InteractiveStatusIndicatorPreview'
import UnconfiguredStatusIndicatorPlaceholder from '~forgeui/interactive/UnconfiguredStatusIndicatorPlaceholder'
import {
  getInteractiveStatusIndicatorAsset,
  getInteractiveStatusIndicatorInitialState,
  resolveInteractiveStatusIndicatorVisuals,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
  forgeUIResolveUploadedAssetDimensions,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
} from '~forgeui/ForgeUINavigation'

export const getInteractiveStatusIndicatorCanvasAspectRatio = (
  component: IComponent,
): number | undefined => {
  const asset = component.props.interactiveAssetId
    ? getInteractiveStatusIndicatorAsset(
        component.props.interactiveAssetId,
      )
    : undefined
  const { offAsset, onAsset } =
    resolveInteractiveStatusIndicatorVisuals(
      asset,
      forgeUIGetUploadedAssets(),
    )
  const dimensions =
    (offAsset
      ? forgeUIResolveUploadedAssetDimensions(offAsset)
      : undefined) ||
    (onAsset
      ? forgeUIResolveUploadedAssetDimensions(onAsset)
      : undefined)

  return dimensions
    ? dimensions.width / dimensions.height
    : undefined
}

const InteractiveStatusIndicatorCanvasPreview = ({ component }: { component: IComponent }) => {
  const [, refreshResolution] = useState(0)

  useEffect(() => {
    const refresh = () =>
      refreshResolution(version => version + 1)
    window.addEventListener('forgeui-assets-updated', refresh)
    window.addEventListener(
      FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      refresh,
    )
    return () => {
      window.removeEventListener('forgeui-assets-updated', refresh)
      window.removeEventListener(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
        refresh,
      )
    }
  }, [])

  const interactiveAsset = component.props.interactiveAssetId
    ? getInteractiveStatusIndicatorAsset(component.props.interactiveAssetId)
    : undefined
  const { offAsset, onAsset } = resolveInteractiveStatusIndicatorVisuals(
    interactiveAsset,
    forgeUIGetUploadedAssets(),
  )
  const width = Number(component.props.w || 32)
  const height = Number(component.props.h || 32)
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
      fillContainer
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
