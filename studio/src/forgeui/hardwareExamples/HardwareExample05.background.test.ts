import { generateForgeUILvglCode } from '../ForgeUILvglExport'
import type { ForgeUIUploadedAsset } from '../ForgeUIUploadedAssetRegistry'
import {
  prepareForgeUISelectedBackgroundAsset,
  resolveForgeUISelectedBackgroundAsset,
} from '../theme/ForgeUIBackgroundSelection'
import { HARDWARE_EXAMPLE_05_PROJECT } from './HardwareExample05'

const readyBackground = (id: string, name: string): ForgeUIUploadedAsset => ({
  id,
  name,
  type: 'image/png',
  size: 1,
  createdAt: 1,
  browserSrc: `http://localhost:3030/forgeui-assets/uploads/fg_${id}.png`,
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: `fg_${id}`,
  cFile: `assets/uploads/fg_${id}.c`,
  width: 1024,
  height: 600,
})

describe('Hardware Example 05 selected background identity', () => {
  it('prepares the exact persisted bundled selection before LVGL generation', async () => {
    const prepared = readyBackground(
      'blue_edge_routes',
      'background_forgeui_background_v3_cyber_blue_edge_routes_ready.png',
    )
    const convert = jest.fn().mockResolvedValue(prepared)
    const selected = await prepareForgeUISelectedBackgroundAsset(
      '/assets/backgrounds/forgeui-v3/cyber-blue-edge-routes.png', [], convert,
    )
    expect(convert).toHaveBeenCalledWith(expect.objectContaining({
      browserSrc: '/assets/backgrounds/forgeui-v3/cyber-blue-edge-routes.png',
      filePrefix: 'background_forgeui_background_v3_cyber_blue_edge_routes',
      assetMode: 'hero', width: 1024, height: 600,
    }))
    const generated = generateForgeUILvglCode(
      HARDWARE_EXAMPLE_05_PROJECT, 'graphite', selected,
    )
    expect(generated.code).toContain(
      'lv_image_set_src(bg_texture_0, &fg_blue_edge_routes)',
    )
    expect(generated.assetSources).toContain(prepared.cFile)
    expect(generated.code).not.toContain('fg_upload_carbon_fiber_be774fd2')
  })

  it('exports background A, then background B, without injecting the theme default', () => {
    const backgroundA = readyBackground(
      'background_a',
      'background_forgeui_background_v3_cyber_blue_node_network_1234.png',
    )
    const backgroundB = readyBackground(
      'background_b',
      'background_forgeui_background_v3_cyber_purple_fibre_arc_5678.png',
    )
    const uploaded = [backgroundA, backgroundB]
    const selectedA = resolveForgeUISelectedBackgroundAsset(
      '/assets/backgrounds/forgeui-v3/cyber-blue-node-network.png', uploaded,
    )
    const selectedB = resolveForgeUISelectedBackgroundAsset(
      '/assets/backgrounds/forgeui-v3/cyber-purple-fibre-arc.png', uploaded,
    )

    const exportA = generateForgeUILvglCode(
      HARDWARE_EXAMPLE_05_PROJECT, 'graphite', selectedA,
    )
    expect(exportA.code).toContain('LV_IMAGE_DECLARE(fg_background_a)')
    expect(exportA.code).toContain('lv_image_set_src(bg_texture_0, &fg_background_a)')
    expect(exportA.assetSources).toContain(backgroundA.cFile)
    expect(exportA.assetSources).not.toContain(backgroundB.cFile)
    expect(exportA.assetSources).not.toContain(
      'assets/uploads/fg_upload_carbon_fiber_be774fd2.c',
    )

    const exportB = generateForgeUILvglCode(
      HARDWARE_EXAMPLE_05_PROJECT, 'graphite', selectedB,
    )
    expect(exportB.code).toContain('LV_IMAGE_DECLARE(fg_background_b)')
    expect(exportB.code).toContain('lv_image_set_src(bg_texture_0, &fg_background_b)')
    expect(exportB.assetSources).toEqual(expect.arrayContaining([backgroundB.cFile]))
    expect(exportB.assetSources).not.toContain(backgroundA.cFile)
    expect(exportB.code).not.toContain('fg_background_a')
    expect(exportB.assetSources).not.toContain(
      'assets/uploads/fg_upload_carbon_fiber_be774fd2.c',
    )
  })
})
