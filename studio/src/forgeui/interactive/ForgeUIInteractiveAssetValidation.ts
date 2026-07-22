import {
  FORGEUI_INTERACTIVE_SCHEMA_VERSION,
  ForgeUIInteractiveAsset,
  ForgeUIInteractiveAssetBase,
  ForgeUIInteractiveVisualState,
} from './ForgeUIInteractiveAsset'
import { ForgeUIInteractiveButtonAsset } from './ForgeUIInteractiveButtonAsset'
import { ForgeUIInteractiveLightAsset } from './ForgeUIInteractiveLightAsset'
import { ForgeUIInteractiveStatusIndicatorAsset } from './ForgeUIInteractiveStatusIndicatorAsset'
import { ForgeUIInteractiveToggleSwitchAsset } from './ForgeUIInteractiveToggleSwitchAsset'

const isNonEmptyString = (
  value: unknown,
): value is string =>
  typeof value === 'string' &&
  value.trim().length > 0

const isFiniteNumber = (
  value: unknown,
): value is number =>
  typeof value === 'number' &&
  Number.isFinite(value)

export const validateInteractiveVisualState: (
  state: unknown,
  stateName: string,
) => asserts state is ForgeUIInteractiveVisualState = (
  state: unknown,
  stateName: string,
) => {
  if (
    typeof state !== 'object' ||
    state === null
  ) {
    throw new Error(
      `${stateName} visual state is missing`,
    )
  }

  const visual =
    state as Partial<ForgeUIInteractiveVisualState>

  if (!isNonEmptyString(visual.backgroundColor)) {
    throw new Error(
      `${stateName}.backgroundColor is required`,
    )
  }

  if (!isNonEmptyString(visual.borderColor)) {
    throw new Error(
      `${stateName}.borderColor is required`,
    )
  }

  if (!isNonEmptyString(visual.textColor)) {
    throw new Error(
      `${stateName}.textColor is required`,
    )
  }

  if (
    !isFiniteNumber(visual.borderWidth) ||
    visual.borderWidth < 0
  ) {
    throw new Error(
      `${stateName}.borderWidth must be zero or greater`,
    )
  }

  if (
    !isFiniteNumber(visual.borderRadius) ||
    visual.borderRadius < 0
  ) {
    throw new Error(
      `${stateName}.borderRadius must be zero or greater`,
    )
  }
}

export const validateInteractiveAssetBase: (
  asset: unknown,
) => asserts asset is ForgeUIInteractiveAssetBase = (
  asset: unknown,
) => {
  if (
    typeof asset !== 'object' ||
    asset === null
  ) {
    throw new Error(
      'Interactive asset must be an object',
    )
  }

  const interactiveAsset =
    asset as Partial<ForgeUIInteractiveAssetBase>

  if (
    interactiveAsset.schemaVersion !==
    FORGEUI_INTERACTIVE_SCHEMA_VERSION
  ) {
    throw new Error(
      'Interactive asset schemaVersion must be 1',
    )
  }

  if (!isNonEmptyString(interactiveAsset.id)) {
    throw new Error(
      'Interactive asset ID is required',
    )
  }

  if (!isNonEmptyString(interactiveAsset.name)) {
    throw new Error(
      'Interactive asset name is required',
    )
  }

  if (!isNonEmptyString(interactiveAsset.kind)) {
    throw new Error(
      'Interactive asset kind is required',
    )
  }

  if (!isNonEmptyString(interactiveAsset.interactionMode)) {
    throw new Error(
      'Interactive asset interactionMode is required',
    )
  }

  if (!isNonEmptyString(interactiveAsset.createdAt)) {
    throw new Error(
      'createdAt is required',
    )
  }

  if (!isNonEmptyString(interactiveAsset.updatedAt)) {
    throw new Error(
      'updatedAt is required',
    )
  }
}

export const validateInteractiveButtonAsset: (
  asset: unknown,
) => asserts asset is ForgeUIInteractiveButtonAsset = (
  asset: unknown,
) => {
  validateInteractiveAssetBase(asset)

  const button = asset as ForgeUIInteractiveButtonAsset

  if (button.kind !== 'button') {
    throw new Error(
      'Interactive asset kind must be button',
    )
  }

  if (button.interactionMode !== 'momentary') {
    throw new Error(
      'Button interaction mode must be momentary',
    )
  }

  if (!isNonEmptyString(button.label)) {
    throw new Error(
      'Button label is required',
    )
  }

  if (
    !isFiniteNumber(button.width) ||
    button.width <= 0
  ) {
    throw new Error(
      'Button width must be greater than zero',
    )
  }

  if (
    !isFiniteNumber(button.height) ||
    button.height <= 0
  ) {
    throw new Error(
      'Button height must be greater than zero',
    )
  }

  validateInteractiveVisualState(
    button.normal,
    'normal',
  )

  validateInteractiveVisualState(
    button.pressed,
    'pressed',
  )
}

export const validateInteractiveLightAsset: (
  asset: unknown,
) => asserts asset is ForgeUIInteractiveLightAsset = (
  asset: unknown,
) => {
  validateInteractiveAssetBase(asset)

  const light = asset as ForgeUIInteractiveLightAsset

  if (light.kind !== 'light') {
    throw new Error('Interactive asset kind must be light')
  }

  if (light.interactionMode !== 'state') {
    throw new Error('Light interaction mode must be state')
  }

  if (!isNonEmptyString(light.label)) {
    throw new Error('Light label is required')
  }

  if (!isFiniteNumber(light.width) || light.width <= 0) {
    throw new Error('Light width must be greater than zero')
  }

  if (!isFiniteNumber(light.height) || light.height <= 0) {
    throw new Error('Light height must be greater than zero')
  }

  if (
    light.offAssetId !== undefined &&
    !isNonEmptyString(light.offAssetId)
  ) {
    throw new Error('Light offAssetId must be a non-empty string')
  }

  if (
    light.onAssetId !== undefined &&
    !isNonEmptyString(light.onAssetId)
  ) {
    throw new Error('Light onAssetId must be a non-empty string')
  }

  if (
    light.initialState !== 'off' &&
    light.initialState !== 'on'
  ) {
    throw new Error('Light initialState must be off or on')
  }
}

export const validateInteractiveStatusIndicatorAsset: (
  asset: unknown,
) => asserts asset is ForgeUIInteractiveStatusIndicatorAsset = asset => {
  validateInteractiveAssetBase(asset)
  const indicator = asset as ForgeUIInteractiveStatusIndicatorAsset

  if (indicator.kind !== 'statusIndicator') {
    throw new Error('Interactive asset kind must be statusIndicator')
  }
  if (indicator.interactionMode !== 'state') {
    throw new Error('Status Indicator interaction mode must be state')
  }
  if (!isNonEmptyString(indicator.label)) {
    throw new Error('Status Indicator label is required')
  }
  if (!isFiniteNumber(indicator.width) || indicator.width <= 0) {
    throw new Error('Status Indicator width must be greater than zero')
  }
  if (!isFiniteNumber(indicator.height) || indicator.height <= 0) {
    throw new Error('Status Indicator height must be greater than zero')
  }
  if (indicator.offAssetId !== undefined && !isNonEmptyString(indicator.offAssetId)) {
    throw new Error('Status Indicator offAssetId must be a non-empty string')
  }
  if (indicator.onAssetId !== undefined && !isNonEmptyString(indicator.onAssetId)) {
    throw new Error('Status Indicator onAssetId must be a non-empty string')
  }
  if (indicator.initialState !== 'off' && indicator.initialState !== 'on') {
    throw new Error('Status Indicator initialState must be off or on')
  }
}

export const validateInteractiveToggleSwitchAsset: (
  asset: unknown,
) => asserts asset is ForgeUIInteractiveToggleSwitchAsset = asset => {
  validateInteractiveAssetBase(asset)
  const toggle = asset as ForgeUIInteractiveToggleSwitchAsset
  if (toggle.kind !== 'toggleSwitch') throw new Error('Interactive asset kind must be toggleSwitch')
  if (toggle.interactionMode !== 'state') throw new Error('Toggle Switch interaction mode must be state')
  if (!isNonEmptyString(toggle.label)) throw new Error('Toggle Switch label is required')
  if (!isFiniteNumber(toggle.width) || toggle.width <= 0) throw new Error('Toggle Switch width must be greater than zero')
  if (!isFiniteNumber(toggle.height) || toggle.height <= 0) throw new Error('Toggle Switch height must be greater than zero')
  if (toggle.offAssetId !== undefined && !isNonEmptyString(toggle.offAssetId)) throw new Error('Toggle Switch offAssetId must be a non-empty string')
  if (toggle.onAssetId !== undefined && !isNonEmptyString(toggle.onAssetId)) throw new Error('Toggle Switch onAssetId must be a non-empty string')
  if (toggle.initialState !== 'off' && toggle.initialState !== 'on') throw new Error('Toggle Switch initialState must be off or on')
}

export const validateInteractiveAsset: (
  asset: unknown,
) => asserts asset is ForgeUIInteractiveAsset = (
  asset: unknown,
) => {
  validateInteractiveAssetBase(asset)

  switch (asset.kind) {
    case 'button':
      validateInteractiveButtonAsset(asset)
      return
    case 'light':
      validateInteractiveLightAsset(asset)
      return
    case 'statusIndicator':
      validateInteractiveStatusIndicatorAsset(asset)
      return
    case 'toggleSwitch':
      validateInteractiveToggleSwitchAsset(asset)
      return
    default:
      throw new Error(
        `Unsupported Interactive Asset kind: ${String(asset.kind)}`,
      )
  }
}
