import { generateForgeUILvglCode } from './ForgeUILvglExport'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveToggleSwitchAsset,
  registerInteractiveAsset,
} from './interactive'
import { forgeUIAddUploadedAssets, forgeUIClearUploadedAssets } from './ForgeUIUploadedAssetRegistry'
import type { ForgeUIUploadedAsset } from './ForgeUIUploadedAssetRegistry'

const image = (id: string): ForgeUIUploadedAsset => ({
  id, name: `${id}.png`, type: 'image/png', size: 1, createdAt: 1,
  browserSrc: `data:image/png;base64,${id}`, kind: 'uploaded', exportStatus: 'lvgl_ready',
  lvgl: `fg_${id}`, cFile: `assets/uploads/fg_${id}.c`,
})

describe('Interactive Toggle Switch export', () => {
  beforeEach(() => { clearInteractiveAssetRegistry(); forgeUIClearUploadedAssets() })

  it('uses one persistent runtime for multiple instances and generates bool hooks', () => {
    const off = image('toggle_off'); const on = image('toggle_on')
    forgeUIAddUploadedAssets([off, on])
    const first = { ...createDefaultInteractiveToggleSwitchAsset('first'), label: 'Main Power', offAssetId: off.id, onAssetId: on.id }
    const second = { ...createDefaultInteractiveToggleSwitchAsset('second'), label: 'Aux Power', offAssetId: off.id, onAssetId: on.id, initialState: 'on' as const }
    registerInteractiveAsset(first); registerInteractiveAsset(second)
    const components: IComponents = {
      root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: ['a', 'b'] },
      a: { id: 'a', parent: 'root', type: 'InteractiveToggleSwitch', componentName: 'Main_Power', props: { interactiveAssetId: first.id, w: 64, h: 36 }, children: [] },
      b: { id: 'b', parent: 'root', type: 'InteractiveToggleSwitch', componentName: 'Aux_Power', props: { interactiveAssetId: second.id, w: 64, h: 36 }, children: [] },
    }
    const result = generateForgeUILvglCode(components)
    expect(result.code.match(/} fg_toggle_input_t;/g)).toHaveLength(1)
    expect(result.code.match(/static fg_toggle_input_t fg_/g)).toHaveLength(2)
    expect(result.code).toContain('fg_toggle_input_set(toggle, !toggle->enabled, true);')
    expect(result.code).toContain('.enabled = true, .toggled_cb = FG_On_Aux_Power_Toggled')
    expect(result.userEventHooks).toEqual(['FG_On_Main_Power_Toggled', 'FG_On_Aux_Power_Toggled'])
    expect(result.publicApiDeclarations).toEqual([])
    expect(result.assetSources).toEqual(expect.arrayContaining([off.cFile, on.cFile]))
  })
})
