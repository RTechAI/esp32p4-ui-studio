import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

import {
  FORGEUI_BACKGROUND_ASSETS,
  FORGEUI_BACKGROUND_CATEGORIES,
  FORGEUI_BACKGROUND_COLLECTION_V2,
  FORGEUI_BACKGROUND_V2_CATEGORIES,
} from './ForgeUIAssetRegistry'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const pngDimensions = (path: string) => {
  const bytes = readFileSync(path)
  expect(bytes.subarray(1, 4).toString('ascii')).toBe('PNG')
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
}

describe('ForgeUI Background Library V2', () => {
  it('registers forty unique, ordinary 1024x600 image assets', () => {
    expect(FORGEUI_BACKGROUND_COLLECTION_V2).toHaveLength(40)
    expect(
      new Set(FORGEUI_BACKGROUND_COLLECTION_V2.map(asset => asset.id)).size,
    ).toBe(40)
    expect(
      new Set(FORGEUI_BACKGROUND_COLLECTION_V2.map(asset => asset.src)).size,
    ).toBe(40)

    FORGEUI_BACKGROUND_COLLECTION_V2.forEach(asset => {
      expect(asset.kind).toBe('background')
      expect(asset.collection).toBe('ForgeUI Background Library V2')
      expect(FORGEUI_BACKGROUND_CATEGORIES).toContain(asset.category)
      expect(asset.tags.length).toBeGreaterThan(1)
      expect(asset.recommendedUses.length).toBeGreaterThan(1)
      expect([asset.width, asset.height]).toEqual([1024, 600])

      const file = join(process.cwd(), 'public', asset.src)
      expect(existsSync(file)).toBe(true)
      expect(pngDimensions(file)).toEqual({ width: 1024, height: 600 })
    })
  })

  it('keeps five backgrounds in every category and exposes one combined registry', () => {
    FORGEUI_BACKGROUND_V2_CATEGORIES.forEach(category => {
      expect(
        FORGEUI_BACKGROUND_COLLECTION_V2.filter(
          asset => asset.category === category,
        ),
      ).toHaveLength(5)
    })
    expect(FORGEUI_BACKGROUND_ASSETS).toEqual(
      expect.arrayContaining(FORGEUI_BACKGROUND_COLLECTION_V2),
    )
  })

  it('includes only the selected converted background in the shared export payload', () => {
    const selected = {
      exportStatus: 'lvgl_ready',
      lvgl: 'fg_background_v2_selected',
      cFile: 'assets/uploads/fg_background_v2_selected.c',
    }
    const generated = generateForgeUILvglCode(
      {
        root: {
          id: 'root',
          parent: 'root',
          type: 'Box',
          props: {},
          children: [],
        },
      },
      'graphite',
      selected,
      { includeThemeTexture: false },
    )

    expect(generated.assetSources).toContain(selected.cFile)
    expect(
      generated.assetSources.filter(source => source.includes('background_v2')),
    ).toEqual([selected.cFile])
    expect(generated.code).toContain(
      'LV_IMAGE_DECLARE(fg_background_v2_selected)',
    )
  })
})
