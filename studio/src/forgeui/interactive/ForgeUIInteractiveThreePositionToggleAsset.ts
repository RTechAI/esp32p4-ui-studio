import { FORGEUI_INTERACTIVE_SCHEMA_VERSION, ForgeUIInteractiveAssetBase } from './ForgeUIInteractiveAsset'

export type ForgeUIInteractiveThreePositionState = 'left' | 'center' | 'right'

export type ForgeUIInteractiveThreePositionToggleAsset = ForgeUIInteractiveAssetBase & {
  kind: 'threePositionToggle'
  interactionMode: 'state'
  label: string
  width: number
  height: number
  leftAssetId?: string
  centerAssetId?: string
  rightAssetId?: string
  initialState: ForgeUIInteractiveThreePositionState
}

export const createDefaultInteractiveThreePositionToggleAsset = (
  id: string,
  name = 'Interactive Three-Position Toggle Switch',
): ForgeUIInteractiveThreePositionToggleAsset => {
  const now = new Date().toISOString()
  return {
    schemaVersion: FORGEUI_INTERACTIVE_SCHEMA_VERSION,
    id,
    name,
    kind: 'threePositionToggle',
    interactionMode: 'state',
    label: 'Three-Position Toggle',
    width: 96,
    height: 36,
    initialState: 'center',
    createdAt: now,
    updatedAt: now,
  }
}
