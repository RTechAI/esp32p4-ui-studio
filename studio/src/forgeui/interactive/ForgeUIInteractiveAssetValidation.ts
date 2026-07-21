import {
  FORGEUI_INTERACTIVE_SCHEMA_VERSION,
  ForgeUIInteractiveAsset,
  ForgeUIInteractiveAssetBase,
  ForgeUIInteractiveVisualState,
} from './ForgeUIInteractiveAsset'
import { ForgeUIInteractiveButtonAsset } from './ForgeUIInteractiveButtonAsset'

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
    default:
      throw new Error(
        `Unsupported Interactive Asset kind: ${String(asset.kind)}`,
      )
  }
}
