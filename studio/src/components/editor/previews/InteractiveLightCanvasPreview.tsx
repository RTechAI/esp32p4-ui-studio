import React, { useEffect, useState } from 'react'

import InteractiveLightPreview from '~forgeui/interactive/InteractiveLightPreview'
import UnconfiguredLightPlaceholder from '~forgeui/interactive/UnconfiguredLightPlaceholder'
import {
  getInteractiveLightAsset,
  getInteractiveLightInitialState,
  resolveInteractiveLightVisuals,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
} from '~forgeui/ForgeUINavigation'

const InteractiveLightCanvasPreview = ({
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

  const interactiveAsset = component.props.interactiveAssetId
    ? getInteractiveLightAsset(component.props.interactiveAssetId)
    : undefined

  const { offAsset, onAsset } = resolveInteractiveLightVisuals(
    interactiveAsset,
    forgeUIGetUploadedAssets(),
  )

  const width = Number(component.props.w || 32)
  const height = Number(component.props.h || 32)
  const isConfigured =
    Boolean(interactiveAsset) &&
    Boolean(offAsset) &&
    Boolean(onAsset)

  const savedInitialState =
    getInteractiveLightInitialState(interactiveAsset)
  const [previewState, setPreviewState] =
    useState(savedInitialState)

  useEffect(() => {
    setPreviewState(savedInitialState)
  }, [interactiveAsset?.id, savedInitialState])

  return (
    <InteractiveLightPreview
      key={
        isConfigured
          ? `configured-${interactiveAsset?.id}-${offAsset?.id}-${onAsset?.id}`
          : 'unconfigured'
      }
      offAsset={isConfigured ? offAsset : undefined}
      onAsset={isConfigured ? onAsset : undefined}
      width={width}
      height={height}
      state={previewState}
      minimumHeight={Math.min(height, 120)}
      missingVisual={!isConfigured ? (
        <UnconfiguredLightPlaceholder
          width={width}
          height={height}
        />
      ) : undefined}
      onPreviewClick={() => {
        setPreviewState(current =>
          current === 'off' ? 'on' : 'off',
        )
      }}
    />
  )
}

export default InteractiveLightCanvasPreview
