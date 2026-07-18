export const FORGEUI_INTERACTIVE_SCHEMA_VERSION = 1 as const

export type ForgeUIInteractiveAssetKind =
  | 'button'

export type ForgeUIInteractiveInteractionMode =
  | 'momentary'

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