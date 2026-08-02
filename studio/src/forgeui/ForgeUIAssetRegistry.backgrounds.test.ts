import { FORGEUI_BACKGROUND_COLLECTION_V1 } from './ForgeUIAssetRegistry'

describe('ForgeUI Background Collection V1', () => {
  it('registers twelve unique 1920x1080 ordinary image assets', () => {
    expect(FORGEUI_BACKGROUND_COLLECTION_V1).toHaveLength(12)
    expect(
      new Set(FORGEUI_BACKGROUND_COLLECTION_V1.map(asset => asset.id)).size,
    ).toBe(12)

    FORGEUI_BACKGROUND_COLLECTION_V1.forEach(asset => {
      expect(asset.kind).toBe('background')
      expect(asset.collection).toBe('ForgeUI Background Collection V1')
      expect(asset.src).toMatch(
        /^\/assets\/backgrounds\/forgeui-v1\/[a-z-]+\.png$/,
      )
      expect([asset.width, asset.height]).toEqual([1920, 1080])
    })
  })
})
