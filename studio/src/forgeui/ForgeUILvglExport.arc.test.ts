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

const arc = (
  id: string,
  props: Record<string, unknown> = {},
  componentName?: string,
): IComponent => ({
  id,
  parent: 'root',
  type: 'Arc',
  componentName,
  props: { x: 92, y: 79, w: 120, h: 120, ...props },
  children: [],
})

const generate = (components: IComponents) =>
  generateForgeUILvglCode(
    components,
    'graphite',
    undefined,
    { includeThemeTexture: false },
  )

describe('Arc generated developer API', () => {
  it('retains the existing default range/value without firing during creation', () => {
    const generated = generate(rootWith(arc('value-arc')))

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Value_Arc(int32_t value);',
    )
    expect(generated.userEventHooks).toContain('FG_On_Value_Arc_Changed')
    expect(generated.code).toContain(
      'static const int32_t fg_value_arc_arc_minimum = 0;',
    )
    expect(generated.code).toContain(
      'static const int32_t fg_value_arc_arc_maximum = 100;',
    )
    expect(generated.code).toContain(
      'static int32_t fg_value_arc_arc_value = 65;',
    )
    const creation = generated.code.slice(
      generated.code.indexOf('fg_value_arc_arc = lv_arc_create'),
    )
    expect(creation).toContain('lv_arc_set_value(fg_value_arc_arc, 65);')
    expect(creation.split('static void fg_system_create_ui')[0])
      .not.toContain('FG_On_Value_Arc_Changed')
  })

  it('uses a configured 0-100 range and visual Arc properties', () => {
    const generated = generate(rootWith(arc('configured', {
      min: 0,
      max: 100,
      value: 40,
      rotation: 90,
      bgStartAngle: 120,
      bgEndAngle: 60,
      mode: 'reverse',
    }, 'ConfiguredArc')))

    expect(generated.code).toContain(
      'lv_arc_set_range(fg_configured_arc_arc, 0, 100);',
    )
    expect(generated.code).toContain(
      'lv_arc_set_rotation(fg_configured_arc_arc, 90);',
    )
    expect(generated.code).toContain(
      'lv_arc_set_bg_angles(fg_configured_arc_arc, 120, 60);',
    )
    expect(generated.code).toContain(
      'lv_arc_set_mode(fg_configured_arc_arc, LV_ARC_MODE_REVERSE);',
    )
  })

  it('supports negative ranges and clamps before transition comparison', () => {
    const generated = generate(rootWith(
      arc('signed', { min: -100, max: 100, value: -20 }, 'SignedArc'),
    ))

    expect(generated.code).toContain(
      'lv_arc_set_range(fg_signed_arc_arc, -100, 100);',
    )
    const clampLow =
      'if (value < fg_signed_arc_arc_minimum) value = fg_signed_arc_arc_minimum;'
    const clampHigh =
      'if (value > fg_signed_arc_arc_maximum) value = fg_signed_arc_arc_maximum;'
    const unchanged =
      'if (fg_signed_arc_arc == NULL || fg_signed_arc_arc_value == value) return;'
    expect(generated.code.indexOf(clampLow))
      .toBeLessThan(generated.code.indexOf(unchanged))
    expect(generated.code.indexOf(clampHigh))
      .toBeLessThan(generated.code.indexOf(unchanged))
    expect(generated.code.indexOf('fg_signed_arc_arc_value = value;'))
      .toBeLessThan(generated.code.indexOf('FG_On_Signed_Arc_Changed(value);'))
  })

  it('clamps configured initial values below and above range', () => {
    const below = generate(rootWith(
      arc('below', { min: -100, max: 100, value: -140 }, 'Below'),
    ))
    const above = generate(rootWith(
      arc('above', { min: -100, max: 100, value: 140 }, 'Above'),
    ))
    expect(below.code).toContain('static int32_t fg_below_arc_value = -100;')
    expect(above.code).toContain('static int32_t fg_above_arc_value = 100;')
  })

  it('allocates separate collision-safe Arc runtimes and hooks', () => {
    const generated = generate(rootWith(
      arc('a', {}, 'ValueArc'),
      arc('b', { value: 20 }, 'ValueArc'),
    ))

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Value_Arc(int32_t value);',
      'void FG_Set_Value_Arc_2(int32_t value);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Value_Arc_Changed',
      'FG_On_Value_Arc_2_Changed',
    ]))
    expect(generated.code).toContain('fg_value_arc_arc = lv_arc_create')
    expect(generated.code).toContain('fg_value_arc_2_arc = lv_arc_create')
  })

  it('can dump the exact persisted project for endpoint validation', () => {
    if (!process.env.FORGEUI_DUMP_ARC_PAYLOAD) return
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
      {
        id: 'comp-MS55EHNT4YJCW',
        parent: 'root',
        type: 'Bar',
        props: {
          positionMode: 'absolute',
          x: '486',
          y: '117',
          w: '240',
          h: '43',
        },
        children: [],
      },
      arc('comp-MS55RH11ZZV74', {
        positionMode: 'absolute',
        x: '92',
        y: '79',
        w: 120,
        h: 120,
      }),
    ))
    fs.writeFileSync(
      process.env.FORGEUI_DUMP_ARC_PAYLOAD,
      JSON.stringify(generated),
    )
  })
})
