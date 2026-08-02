import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

import {
  FORGEUI_BACKGROUND_ASSETS,
  FORGEUI_BACKGROUND_COLLECTION_V3,
  FORGEUI_BACKGROUND_V3_CATEGORIES,
} from './ForgeUIAssetRegistry'

const readPngDimensions = (file: string) => {
  const bytes = readFileSync(file)
  expect(bytes.subarray(1, 4).toString('ascii')).toBe('PNG')
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)]
}

describe('ForgeUI Background Collection V3', () => {
  it('registers fifty-two unique premium technology backgrounds at 1024x600', () => {
    expect(FORGEUI_BACKGROUND_COLLECTION_V3).toHaveLength(52)
    expect(
      new Set(FORGEUI_BACKGROUND_COLLECTION_V3.map(asset => asset.id)).size,
    ).toBe(52)
    expect(
      new Set(FORGEUI_BACKGROUND_COLLECTION_V3.map(asset => asset.src)).size,
    ).toBe(52)

    FORGEUI_BACKGROUND_COLLECTION_V3.forEach(asset => {
      expect(asset.collection).toBe('ForgeUI Background Collection V3')
      expect(asset.kind).toBe('background')
      expect(FORGEUI_BACKGROUND_V3_CATEGORIES).toContain(asset.category)
      expect(asset.tags).toContain('premium-tech')
      expect([asset.width, asset.height]).toEqual([1024, 600])

      const file = join(process.cwd(), 'public', asset.src)
      expect(existsSync(file)).toBe(true)
      expect(readPngDimensions(file)).toEqual([1024, 600])
    })
  })

  it('provides six coordinated assets per core set plus four lighter variants', () => {
    FORGEUI_BACKGROUND_V3_CATEGORIES.filter(
      category => category !== 'Lighter Tech',
    ).forEach(category => {
      expect(
        FORGEUI_BACKGROUND_COLLECTION_V3.filter(
          asset => asset.category === category,
        ),
      ).toHaveLength(6)
    })
    expect(
      FORGEUI_BACKGROUND_COLLECTION_V3.filter(
        asset => asset.category === 'Lighter Tech',
      ),
    ).toHaveLength(4)
    expect(FORGEUI_BACKGROUND_ASSETS).toHaveLength(104)
  })
})
