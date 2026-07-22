import React, { useEffect, useState } from 'react'
import InteractiveThreePositionTogglePreview from '~forgeui/interactive/InteractiveThreePositionTogglePreview'
import { forgeUIGetUploadedAssets } from '~forgeui/ForgeUIUploadedAssetRegistry'
import { getInteractiveThreePositionDimensions, getInteractiveThreePositionInitialState, getInteractiveThreePositionToggleAsset, resolveInteractiveThreePositionVisuals } from '~forgeui/interactive'

const InteractiveThreePositionToggleCanvasPreview = ({ component }: { component: IComponent }) => {
  const asset = component.props.interactiveAssetId ? getInteractiveThreePositionToggleAsset(component.props.interactiveAssetId) : undefined
  const visuals = resolveInteractiveThreePositionVisuals(asset, forgeUIGetUploadedAssets())
  const dimensions = getInteractiveThreePositionDimensions(asset, { width: Number(component.props.w || 96), height: Number(component.props.h || 36) })
  const initialState = getInteractiveThreePositionInitialState(asset)
  const [state, setState] = useState(initialState)
  useEffect(() => setState(initialState), [asset?.id, initialState])
  return <InteractiveThreePositionTogglePreview {...visuals} {...dimensions} state={state} onStateChange={setState} />
}

export default InteractiveThreePositionToggleCanvasPreview
