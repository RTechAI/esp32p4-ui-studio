import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  createInteractiveAssetId,
  getAllInteractiveAssets,
  getInteractiveAsset,
  registerInteractiveAsset,
  validateInteractiveButtonAsset,
} from './index'

describe('ForgeUI Interactive Asset Registry', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
  })

  it(
    'validates, registers and retrieves an Interactive Button asset',
    () => {
      const id = createInteractiveAssetId()

      const asset =
        createDefaultInteractiveButtonAsset(
          id,
          'Test Interactive Button',
        )

      expect(() => {
        validateInteractiveButtonAsset(asset)
      }).not.toThrow()

      registerInteractiveAsset(asset)

      const retrieved =
        getInteractiveAsset(id)

      expect(retrieved).toBeDefined()
      expect(retrieved?.id).toBe(id)
      expect(retrieved?.name).toBe(
        'Test Interactive Button',
      )
      expect(retrieved?.kind).toBe('button')
      expect(retrieved?.interactionMode).toBe(
        'momentary',
      )

      expect(retrieved?.normal).toEqual(
        asset.normal,
      )

      expect(retrieved?.pressed).toEqual(
        asset.pressed,
      )

      const assets =
        getAllInteractiveAssets()

      expect(assets).toHaveLength(1)

      expect(assets[0].id).toBe(id)
      expect(assets[0].name).toBe(
        'Test Interactive Button',
      )
      expect(assets[0].kind).toBe('button')
    },
  )
})