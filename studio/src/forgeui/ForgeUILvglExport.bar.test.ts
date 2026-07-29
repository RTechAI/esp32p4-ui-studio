import fs from 'fs'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const rootWith = (...children: IComponent[]): IComponents => ({
  root: {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: children.map(child => child.id),
  },
  ...Object.fromEntries(children.map(child => [child.id, child])),
})

const bar = (
  id: string,
  props: Record<string, unknown> = {},
  componentName?: string,
): IComponent => ({
  id,
  parent: 'root',
  type: 'Bar',
  componentName,
  props: { x: 23, y: 117, w: 240, h: 43, ...props },
  children: [],
})

const generate = (components: IComponents) =>
  generateForgeUILvglCode(
    components,
    'graphite',
    undefined,
    { includeThemeTexture: false },
  )

describe('Bar generated developer API', () => {
  it('retains a default 0-100 Bar and guards repeated effective values', () => {
    const generated = generate(rootWith(bar('progress')))

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Progress_Bar(int32_t value);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Progress_Bar_Changed',
    )
    expect(generated.code).toContain(
      'static const int32_t fg_progress_bar_bar_minimum = 0;',
    )
    expect(generated.code).toContain(
      'static const int32_t fg_progress_bar_bar_maximum = 100;',
    )
    expect(generated.code).toContain(
      'static int32_t fg_progress_bar_bar_value = 70;',
    )
    expect(generated.code).toContain(
      'if (fg_progress_bar_bar == NULL || fg_progress_bar_bar_value == value) return;',
    )
    expect(generated.code.indexOf('fg_progress_bar_bar_value = value;'))
      .toBeLessThan(generated.code.indexOf('FG_On_Progress_Bar_Changed(value);'))
    expect(generated.code.match(/FG_On_Progress_Bar_Changed\(value\);/g))
      .toHaveLength(1)
  })

  it('uses and clamps a configured negative-to-positive range', () => {
    const generated = generate(rootWith(
      bar('signed', { min: -50, max: 50, value: -10 }, 'SignedProgress'),
    ))

    expect(generated.code).toContain(
      'lv_bar_set_range(fg_signed_progress_bar, -50, 50);',
    )
    expect(generated.code).toContain(
      'lv_bar_set_value(fg_signed_progress_bar, -10, LV_ANIM_OFF);',
    )
    expect(generated.code).toContain(
      'if (value < fg_signed_progress_bar_minimum) value = fg_signed_progress_bar_minimum;',
    )
    expect(generated.code).toContain(
      'if (value > fg_signed_progress_bar_maximum) value = fg_signed_progress_bar_maximum;',
    )
  })

  it('clamps configured initial values below and above the range', () => {
    const below = generate(rootWith(
      bar('below', { min: -50, max: 50, value: -80 }, 'Below'),
    ))
    const above = generate(rootWith(
      bar('above', { min: -50, max: 50, value: 90 }, 'Above'),
    ))

    expect(below.code).toContain(
      'static int32_t fg_below_bar_value = -50;',
    )
    expect(above.code).toContain(
      'static int32_t fg_above_bar_value = 50;',
    )
  })

  it('allocates separate deterministic runtimes, setters, and hooks', () => {
    const generated = generate(rootWith(
      bar('a', {}, 'ProgressBar'),
      bar('b', { value: 20 }, 'ProgressBar'),
    ))

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Progress_Bar(int32_t value);',
      'void FG_Set_Progress_Bar_2(int32_t value);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Progress_Bar_Changed',
      'FG_On_Progress_Bar_2_Changed',
    ]))
    expect(generated.code).toContain('fg_progress_bar_bar = lv_bar_create')
    expect(generated.code).toContain('fg_progress_bar_2_bar = lv_bar_create')
  })

  it('can dump the exact persisted live Bar payload for endpoint validation', () => {
    if (!process.env.FORGEUI_DUMP_BAR_PAYLOAD) return
    const generated = generate(rootWith(
      {
        id: 'comp-MS54VF7PP1FCD',
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
      bar('comp-MS55EHNT4YJCW', {
        positionMode: 'absolute',
        x: '23',
        y: '117',
        w: '240',
        h: '43',
      }),
    ))
    fs.writeFileSync(
      process.env.FORGEUI_DUMP_BAR_PAYLOAD,
      JSON.stringify(generated),
    )
  })
})
