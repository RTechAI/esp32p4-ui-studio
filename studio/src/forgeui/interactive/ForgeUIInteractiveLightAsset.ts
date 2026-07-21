import {
  FORGEUI_INTERACTIVE_SCHEMA_VERSION,
  ForgeUIInteractiveAssetBase,
} from './ForgeUIInteractiveAsset'

export type ForgeUIInteractiveLightState =
  | 'off'
  | 'on'

export type ForgeUIInteractiveLightAsset =
  ForgeUIInteractiveAssetBase & {
    kind: 'light'
    interactionMode: 'state'

    label: string
    width: number
    height: number

    offAssetId?: string
    onAssetId?: string

    initialState: ForgeUIInteractiveLightState
  }

export const createDefaultInteractiveLightAsset = (
  id: string,
  name: string = 'Interactive Light',
): ForgeUIInteractiveLightAsset => {
  const now = new Date().toISOString()

  return {
    schemaVersion: FORGEUI_INTERACTIVE_SCHEMA_VERSION,
    id,
    name,
    kind: 'light',
    interactionMode: 'state',
    label: 'Status Light',
    width: 32,
    height: 32,
    offAssetId: undefined,
    onAssetId: undefined,
    initialState: 'off',
    createdAt: now,
    updatedAt: now,
  }
}
