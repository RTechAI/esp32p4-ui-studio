import {
  FORGEUI_INTERACTIVE_SCHEMA_VERSION,
  ForgeUIInteractiveAssetBase,
} from './ForgeUIInteractiveAsset'

export type ForgeUIInteractiveToggleSwitchState = 'off' | 'on'

export type ForgeUIInteractiveToggleSwitchAsset = ForgeUIInteractiveAssetBase & {
  kind: 'toggleSwitch'
  interactionMode: 'state'
  label: string
  width: number
  height: number
  offAssetId?: string
  onAssetId?: string
  initialState: ForgeUIInteractiveToggleSwitchState
}

export const createDefaultInteractiveToggleSwitchAsset = (
  id: string,
  name: string = 'Interactive Toggle Switch',
): ForgeUIInteractiveToggleSwitchAsset => {
  const now = new Date().toISOString()
  return {
    schemaVersion: FORGEUI_INTERACTIVE_SCHEMA_VERSION,
    id,
    name,
    kind: 'toggleSwitch',
    interactionMode: 'state',
    label: 'Toggle Switch',
    width: 64,
    height: 36,
    offAssetId: undefined,
    onAssetId: undefined,
    initialState: 'off',
    createdAt: now,
    updatedAt: now,
  }
}
