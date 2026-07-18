import {
  FORGEUI_INTERACTIVE_SCHEMA_VERSION,
  ForgeUIInteractiveAssetBase,
  ForgeUIInteractiveVisualState,
} from './ForgeUIInteractiveAsset'

export type ForgeUIInteractiveButtonAsset = ForgeUIInteractiveAssetBase & {
  kind: 'button'
  interactionMode: 'momentary'

  label: string

  width: number
  height: number

  normal: ForgeUIInteractiveVisualState
  pressed: ForgeUIInteractiveVisualState
}

export const createDefaultInteractiveButtonAsset = (
  id: string,
  name: string = 'Interactive Button',
): ForgeUIInteractiveButtonAsset => {
  const now = new Date().toISOString()

  return {
    schemaVersion:
      FORGEUI_INTERACTIVE_SCHEMA_VERSION,

    id,
    name,

    kind: 'button',
    interactionMode: 'momentary',

    label: 'Button',

    width: 160,
    height: 56,

    normal: {
      backgroundColor: '#2563eb',
      borderColor: '#1d4ed8',
      textColor: '#ffffff',
      borderWidth: 1,
      borderRadius: 10,
    },

    pressed: {
      backgroundColor: '#1d4ed8',
      borderColor: '#1e40af',
      textColor: '#ffffff',
      borderWidth: 1,
      borderRadius: 10,
    },

    createdAt: now,
    updatedAt: now,
  }
}