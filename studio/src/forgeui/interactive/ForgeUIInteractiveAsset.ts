import type { ForgeUIInteractiveButtonAsset } from './ForgeUIInteractiveButtonAsset'
import type { ForgeUIInteractiveLightAsset } from './ForgeUIInteractiveLightAsset'
import type { ForgeUIInteractiveStatusIndicatorAsset } from './ForgeUIInteractiveStatusIndicatorAsset'

export const FORGEUI_INTERACTIVE_SCHEMA_VERSION = 1 as const

export type ForgeUIInteractiveAssetKind =
  | 'button'
  | 'light'
  | 'statusIndicator'

export type ForgeUIInteractiveInteractionMode =
  | 'momentary'
  | 'state'

export type ForgeUIInteractiveVisualState = {
  backgroundColor: string
  borderColor: string
  textColor: string
  borderWidth: number
  borderRadius: number
}

export type ForgeUIInteractiveAssetBase = {
  schemaVersion: typeof FORGEUI_INTERACTIVE_SCHEMA_VERSION
  id: string
  name: string
  kind: ForgeUIInteractiveAssetKind
  interactionMode: ForgeUIInteractiveInteractionMode
  createdAt: string
  updatedAt: string
}

// Extend this union when a new persisted Interactive Asset kind is added.
export type ForgeUIInteractiveAsset =
  | ForgeUIInteractiveButtonAsset
  | ForgeUIInteractiveLightAsset
  | ForgeUIInteractiveStatusIndicatorAsset

export type ForgeUIInteractiveAssetOfKind<
  Kind extends ForgeUIInteractiveAssetKind,
> = Extract<ForgeUIInteractiveAsset, { kind: Kind }>
