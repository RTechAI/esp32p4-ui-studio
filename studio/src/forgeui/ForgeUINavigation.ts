export const FORGEUI_OPEN_AI_PLAYGROUND_EVENT =
  'forgeui-open-ai-playground'
export const FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT =
  'forgeui-interactive-assets-updated'

export type ForgeUINavigationRequest = {
  target:
    | 'interactive-toggle-switch-designer'
    | 'interactive-button-designer'
    | 'interactive-light-designer'
    | 'interactive-status-indicator-designer'
    | 'interactive-three-position-toggle-designer'
  sourceComponentId: string
  interactiveAssetId?: string
  requestId: number
}

const openInteractiveCreator = (
  target: ForgeUINavigationRequest['target'],
  sourceComponentId: string,
  interactiveAssetId?: string,
): void => {
  const request: ForgeUINavigationRequest = {
    target,
    sourceComponentId,
    ...(interactiveAssetId
      ? { interactiveAssetId }
      : {}),
    requestId: Date.now(),
  }

  window.dispatchEvent(new CustomEvent(
    FORGEUI_OPEN_AI_PLAYGROUND_EVENT,
    { detail: request },
  ))
}

export const openToggleCreator = (
  sourceComponentId: string,
  interactiveAssetId?: string,
): void => {
  openInteractiveCreator(
    'interactive-toggle-switch-designer',
    sourceComponentId,
    interactiveAssetId,
  )
}

export const openButtonCreator = (
  sourceComponentId: string,
  interactiveAssetId?: string,
): void => {
  openInteractiveCreator(
    'interactive-button-designer',
    sourceComponentId,
    interactiveAssetId,
  )
}

export const openLightCreator = (
  sourceComponentId: string,
  interactiveAssetId?: string,
): void => {
  openInteractiveCreator(
    'interactive-light-designer',
    sourceComponentId,
    interactiveAssetId,
  )
}

export const openStatusIndicatorCreator = (
  sourceComponentId: string,
  interactiveAssetId?: string,
): void => {
  openInteractiveCreator(
    'interactive-status-indicator-designer',
    sourceComponentId,
    interactiveAssetId,
  )
}

export const openThreePositionToggleCreator = (
  sourceComponentId: string,
  interactiveAssetId?: string,
): void => {
  openInteractiveCreator(
    'interactive-three-position-toggle-designer',
    sourceComponentId,
    interactiveAssetId,
  )
}
