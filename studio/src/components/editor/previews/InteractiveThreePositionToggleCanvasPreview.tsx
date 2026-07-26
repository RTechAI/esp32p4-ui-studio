import React, { useEffect, useState } from 'react'
import InteractiveThreePositionTogglePreview from '~forgeui/interactive/InteractiveThreePositionTogglePreview'
import {
  getInteractiveThreePositionInitialState,
  getInteractiveThreePositionToggleAsset,
  resolveInteractiveThreePositionVisuals,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
  forgeUIResolveUploadedAssetDimensions,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
} from '~forgeui/ForgeUINavigation'

export const getInteractiveThreePositionCanvasAspectRatio = (
  component: IComponent,
): number | undefined => {
  const asset = component.props.interactiveAssetId
    ? getInteractiveThreePositionToggleAsset(
        component.props.interactiveAssetId,
      )
    : undefined
  const visuals = resolveInteractiveThreePositionVisuals(
    asset,
    forgeUIGetUploadedAssets(),
  )
  const dimensions = [
    visuals.leftAsset,
    visuals.centerAsset,
    visuals.rightAsset,
  ].map(item => item
    ? forgeUIResolveUploadedAssetDimensions(item)
    : undefined,
  ).find(Boolean)
  return dimensions
    ? dimensions.width / dimensions.height
    : undefined
}

const InteractiveThreePositionToggleCanvasPreview = ({
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
    ? getInteractiveThreePositionToggleAsset(
        component.props.interactiveAssetId,
      )
    : undefined
  const visuals = resolveInteractiveThreePositionVisuals(
    asset,
    forgeUIGetUploadedAssets(),
  )
  const initialState = getInteractiveThreePositionInitialState(asset)
  const [state, setState] = useState(initialState)
  useEffect(() => setState(initialState), [asset?.id, initialState])
  return (
    <InteractiveThreePositionTogglePreview
      {...visuals}
      width={Number(component.props.w || 96)}
      height={Number(component.props.h || 36)}
      fillContainer
      state={state}
      onStateChange={setState}
    />
  )
}

export default InteractiveThreePositionToggleCanvasPreview
