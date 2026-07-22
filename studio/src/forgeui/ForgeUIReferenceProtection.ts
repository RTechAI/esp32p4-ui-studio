import type { ForgeUIInteractiveAsset } from './interactive'

export type ForgeUIAssetReference = {
  type: 'Button' | 'Light' | 'Status Indicator' | 'Toggle Switch' | 'Three-Position Toggle' | 'Theme' | 'Canvas'
  name: string
}

export const findUploadedAssetReferences = (
  assetId: string,
  interactiveAssets: ForgeUIInteractiveAsset[],
  themeAssetId?: string,
): ForgeUIAssetReference[] => {
  const references: ForgeUIAssetReference[] = []
  interactiveAssets.forEach(asset => {
    if (asset.kind === 'button' &&
      (asset.normalAssetId === assetId || asset.pressedAssetId === assetId)) {
      references.push({ type: 'Button', name: asset.name })
    }
    if (asset.kind === 'light' &&
      (asset.offAssetId === assetId || asset.onAssetId === assetId)) {
      references.push({ type: 'Light', name: asset.name })
    }
    if ((asset.kind === 'statusIndicator' || asset.kind === 'toggleSwitch') &&
      (asset.offAssetId === assetId || asset.onAssetId === assetId)) {
      references.push({ type: asset.kind === 'statusIndicator' ? 'Status Indicator' : 'Toggle Switch', name: asset.name })
    }
    if (asset.kind === 'threePositionToggle' &&
      (asset.leftAssetId === assetId || asset.centerAssetId === assetId || asset.rightAssetId === assetId)) {
      references.push({ type: 'Three-Position Toggle', name: asset.name })
    }
  })
  if (themeAssetId === assetId) references.push({ type: 'Theme', name: 'Current theme' })
  return references
}

export const findInteractiveAssetReferences = (
  assetId: string,
  components: IComponents,
): ForgeUIAssetReference[] =>
  Object.values(components)
    .filter(component => component.props.interactiveAssetId === assetId)
    .map(component => ({
      type: 'Canvas' as const,
      name: component.componentName || component.id,
    }))

export const formatAssetReferences = (references: ForgeUIAssetReference[]) =>
  ['This asset is currently used by:', ...references.map(reference =>
    `${reference.type}: ${reference.name}`,
  ), 'Deletion cancelled.'].join('\n')
