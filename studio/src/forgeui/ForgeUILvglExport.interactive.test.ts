import {
  generateForgeUILvglCode,
} from './ForgeUILvglExport'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  registerInteractiveAsset,
} from './interactive'

describe('Interactive Button LVGL export compatibility', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
  })

  it('preserves generated callback names and fallback wiring', () => {
    const asset = {
      ...createDefaultInteractiveButtonAsset(
        'fg_interactive_start',
      ),
      label: 'Start',
    }

    registerInteractiveAsset(asset)

    const components: IComponents = {
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: ['button'],
      },
      button: {
        id: 'button',
        parent: 'root',
        type: 'InteractiveButton',
        props: {
          interactiveAssetId: asset.id,
          x: 10,
          y: 20,
          w: 120,
          h: 48,
        },
        children: [],
      },
    }

    const result = generateForgeUILvglCode(components)

    expect(result.userEventHooks).toEqual([
      'FG_On_Start_Clicked',
    ])
    expect(result.code).toContain(
      'lv_label_set_text(obj1_label, "Start\\nMissing Interactive Assets");',
    )
    expect(result.code).toContain(
      '#include "95_UserEvents.h"',
    )
  })
})
