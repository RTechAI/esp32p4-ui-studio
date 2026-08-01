export const FORGEUI_OPEN_ASSET_MANAGER_EVENT = 'forgeui-open-asset-manager'

export type ForgeUIAssetSelectionRequest = {
  componentId: string
  propertyName: 'frameAssetIds'
  multiple: true
  selectedAssetIds: string[]
  title: string
}

export const openForgeUIAnimationFramePicker = (
  componentId: string,
  selectedAssetIds: string[],
) => {
  window.dispatchEvent(new CustomEvent<ForgeUIAssetSelectionRequest>(
    FORGEUI_OPEN_ASSET_MANAGER_EVENT,
    { detail: {
      componentId,
      propertyName: 'frameAssetIds',
      multiple: true,
      selectedAssetIds,
      title: 'Select Animation Frames',
    } },
  ))
}
