import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'

describe('LED generated developer API', () => {
  it('exports a deterministic setter and fires a bool hook only on change', () => {
    const components: IComponents = {
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: ['status-led'],
      },
      'status-led': {
        id: 'status-led',
        parent: 'root',
        type: 'Led',
        props: {
          positionMode: 'absolute',
          x: 585,
          y: 167,
          w: 32,
          h: 32,
        },
        children: [],
      },
    }

    const generated = generateForgeUILvglCode(
      components,
      'graphite',
      undefined,
      { includeThemeTexture: false },
    )
    if (process.env.FORGEUI_DUMP_LED_PAYLOAD) {
      fs.writeFileSync(
        process.env.FORGEUI_DUMP_LED_PAYLOAD,
        JSON.stringify(generated),
      )
    }

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Status_LED(bool on);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Status_LED_Changed',
    )
    expect(generated.code).toContain(
      'if (fg_status_led_led == NULL || fg_status_led_led_on == on) return;',
    )
    expect(generated.code).toContain(
      'if (on) lv_led_on(fg_status_led_led); else lv_led_off(fg_status_led_led);',
    )
    expect(generated.code).toContain(
      'FG_On_Status_LED_Changed(on);',
    )
  })
})
