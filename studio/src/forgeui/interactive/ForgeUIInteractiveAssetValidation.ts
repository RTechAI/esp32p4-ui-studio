import {
  FORGEUI_INTERACTIVE_SCHEMA_VERSION,
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

const validateVisualState = (
  state: unknown,
  stateName: string,
): asserts state is ForgeUIInteractiveVisualState => {
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

export const validateInteractiveButtonAsset = (
  asset: unknown,
): asserts asset is ForgeUIInteractiveButtonAsset => {
  if (
    typeof asset !== 'object' ||
    asset === null
  ) {
    throw new Error(
      'Interactive asset must be an object',
    )
  }

  const button =
    asset as Partial<ForgeUIInteractiveButtonAsset>

  if (
    button.schemaVersion !==
    FORGEUI_INTERACTIVE_SCHEMA_VERSION
  ) {
    throw new Error(
      'Interactive asset schemaVersion must be 1',
    )
  }

  if (!isNonEmptyString(button.id)) {
    throw new Error(
      'Interactive asset ID is required',
    )
  }

  if (!isNonEmptyString(button.name)) {
    throw new Error(
      'Interactive asset name is required',
    )
  }

  if (button.kind !== 'button') {
    throw new Error(
      'Interactive asset kind must be button',
    )
  }

  if (
    button.interactionMode !== 'momentary'
  ) {
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

  if (!isNonEmptyString(button.createdAt)) {
    throw new Error(
      'createdAt is required',
    )
  }

  if (!isNonEmptyString(button.updatedAt)) {
    throw new Error(
      'updatedAt is required',
    )
  }

  validateVisualState(
    button.normal,
    'normal',
  )

  validateVisualState(
    button.pressed,
    'pressed',
  )
}