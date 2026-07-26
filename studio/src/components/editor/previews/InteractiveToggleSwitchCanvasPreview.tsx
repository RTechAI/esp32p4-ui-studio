import React, { useEffect, useState } from 'react'
import InteractiveToggleSwitchPreview from '~forgeui/interactive/InteractiveToggleSwitchPreview'
import {
  getInteractiveToggleSwitchAsset,
  getInteractiveToggleSwitchInitialState,
  resolveInteractiveToggleSwitchVisuals,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
  forgeUIResolveUploadedAssetDimensions,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
} from '~forgeui/ForgeUINavigation'

export const getInteractiveToggleCanvasAspectRatio = (
  component: IComponent,
): number | undefined => {
  const asset = component.props.interactiveAssetId
    ? getInteractiveToggleSwitchAsset(component.props.interactiveAssetId)
    : undefined
  const { offAsset, onAsset } = resolveInteractiveToggleSwitchVisuals(
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

const InteractiveToggleSwitchCanvasPreview = ({
  component,
}: {
  component: IComponent
}) => {
  const [, refresh] = useState(0)
  useEffect(() => {
    const update = () => refresh(value => value + 1)
    window.addEventListener('forgeui-assets-updated', update)
    window.addEventListener(FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT, update)
    return () => {
      window.removeEventListener('forgeui-assets-updated', update)
      window.removeEventListener(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
        update,
      )
    }
  }, [])

  const asset = component.props.interactiveAssetId
    ? getInteractiveToggleSwitchAsset(component.props.interactiveAssetId)
    : undefined
  const { offAsset, onAsset } = resolveInteractiveToggleSwitchVisuals(
    asset,
    forgeUIGetUploadedAssets(),
  )
  const width = Number(component.props.w || 64)
  const height = Number(component.props.h || 36)
  const initialState = getInteractiveToggleSwitchInitialState(asset)
  const [state, setState] = useState(initialState)
  useEffect(() => setState(initialState), [asset?.id, initialState])

  return (
    <InteractiveToggleSwitchPreview
      offAsset={offAsset}
      onAsset={onAsset}
      width={width}
      height={height}
      fillContainer
      state={state}
      onPreviewClick={() =>
        setState(current => current === 'off' ? 'on' : 'off')
      }
    />
  )
}

export default InteractiveToggleSwitchCanvasPreview
