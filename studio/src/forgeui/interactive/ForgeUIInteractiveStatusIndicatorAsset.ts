import {
  FORGEUI_INTERACTIVE_SCHEMA_VERSION,
  ForgeUIInteractiveAssetBase,
} from './ForgeUIInteractiveAsset'

export type ForgeUIInteractiveStatusIndicatorState = 'off' | 'on'

export type ForgeUIInteractiveStatusIndicatorAsset =
  ForgeUIInteractiveAssetBase & {
    kind: 'statusIndicator'
    interactionMode: 'state'
    label: string
    width: number
    height: number
    offAssetId?: string
    onAssetId?: string
    initialState: ForgeUIInteractiveStatusIndicatorState
  }

export const createDefaultInteractiveStatusIndicatorAsset = (
  id: string,
  name: string = 'Interactive Status Indicator',
): ForgeUIInteractiveStatusIndicatorAsset => {
  const now = new Date().toISOString()

  return {
    schemaVersion: FORGEUI_INTERACTIVE_SCHEMA_VERSION,
    id,
    name,
    kind: 'statusIndicator',
    interactionMode: 'state',
    label: 'Status Indicator',
    width: 32,
    height: 32,
    offAssetId: undefined,
    onAssetId: undefined,
    initialState: 'off',
    createdAt: now,
    updatedAt: now,
  }
}
