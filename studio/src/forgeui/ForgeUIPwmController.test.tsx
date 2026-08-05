import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { normalizeForgeUIPwmController } from './ForgeUIPwmController'
import { ForgeUIPwmControllerPreview } from './preview/ForgeUIPwmControllerPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'
import { getPreviewDefaultProps } from '../utils/defaultProps'

const pwm = (id: string, props: Record<string, unknown> = {}): IComponent => ({
  id, componentName: 'Visible name may change', type: 'PwmController', parent: 'root', children: [],
  props: { x: 20, y: 30, w: 320, h: 220, ...props },
})

describe('ForgeUI PWM Controller', () => {
  beforeAll(() => {
    window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as any
  })
  it('uses compact defaults while preserving explicitly saved legacy geometry', () => {
    expect(getPreviewDefaultProps('PwmController')).toMatchObject({ w: 240, h: 145 })
    expect(getForgeUIWidgetDefinition('PwmController')).toMatchObject({
      defaultWidth: 240, defaultHeight: 145,
    })
    expect(pwm('legacy', { w: 320, h: 220 }).props).toMatchObject({ w: 320, h: 220 })
    expect(3 * 240).toBeLessThanOrEqual(1024)
    expect(2 * 145).toBeLessThanOrEqual(600)
  })
  it('repairs ranges, clamps and quantizes floating point values', () => {
    expect(normalizeForgeUIPwmController({ minimum: 10, maximum: 5, value: 999, step: -0.25 }))
      .toMatchObject({ minimum: 10, maximum: 110, value: 110, step: 0.25 })
    expect(normalizeForgeUIPwmController({ minimum: 0, maximum: 1, value: 0.63, step: 0.25 }).value).toBe(0.75)
  })

  it('registers as Native Component #4 in the existing registry', () => {
    expect(getForgeUIWidgetDefinition('PwmController')).toMatchObject({
      displayName: 'PWM Controller', category: 'Dashboard', origin: 'forgeui-native',
      capabilities: { supportsRuntimeApi: true, supportsUserEvents: true, childOwnership: 'none' },
    })
  })

  it('interacts without bubbling canvas pointer events and clearly disables the slider', () => {
    const parentDown = jest.fn()
    render(<div onMouseDown={parentDown}><ChakraProvider><ForgeUIPwmControllerPreview component={pwm('preview', { value: 25 })} palette={FG_PREVIEW_PALETTES.graphite} /></ChakraProvider></div>)
    const slider = screen.getByRole('slider')
    expect(screen.getByTestId('forgeui-pwm-controller')).toHaveStyle({
      borderRadius: '8px', padding: '12px', gap: '2px',
    })
    fireEvent.mouseDown(slider)
    expect(parentDown).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('checkbox'))
    expect(slider).toHaveAttribute('aria-disabled', 'true')
  })

  it('exports float APIs, genuine-user hooks, clamping and programmatic suppression', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['comp-pwm-stable'], props: {} },
      'comp-pwm-stable': pwm('comp-pwm-stable', { minimum: 0, maximum: 100, value: 37.5, step: 0.5 }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Comp_Pwm_Stable_Value(float value);', 'float FG_Get_Comp_Pwm_Stable_Value(void);',
      'void FG_Set_Comp_Pwm_Stable_Enabled(bool enabled);', 'bool FG_Get_Comp_Pwm_Stable_Enabled(void);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Comp_Pwm_Stable_Value_Changed', 'FG_On_Comp_Pwm_Stable_Enabled_Changed',
    ]))
    expect(generated.code).toContain('fg_comp_pwm_stable_pwm_programmatic')
    expect(generated.code).toContain('roundf((value - 0.0f) / 0.5f)')
    expect(generated.code).toContain('lv_obj_set_style_radius(fg_comp_pwm_stable_pwm, 8, LV_PART_MAIN);')
    expect(generated.code).toContain('lv_obj_set_style_pad_all(fg_comp_pwm_stable_pwm, 12, LV_PART_MAIN);')
    expect(generated.code).toContain('lv_obj_set_size(fg_comp_pwm_stable_pwm, 320, 220);')
    expect(generated.code).toContain('obj1_range = lv_label_create(fg_comp_pwm_stable_pwm);')
  })

  it('exports the compact default geometry without changing Runtime SDK or UserEvents', () => {
    const compact = pwm('compact', { w: 240, h: 145 })
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['compact'], props: {} },
      compact,
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('lv_obj_set_size(fg_compact_pwm, 240, 145);')
    expect(generated.code).toContain('lv_obj_set_size(fg_compact_pwm_enable, 40, 22);')
    expect(generated.code).toContain('lv_obj_set_size(fg_compact_pwm_slider, 216, 18);')
    expect(generated.code).toContain('lv_obj_set_style_bg_color(fg_compact_pwm_enable, lv_color_hex(0x475569), LV_PART_MAIN);')
    expect(generated.code).toContain('lv_obj_set_style_bg_color(fg_compact_pwm_enable, lv_color_hex(0x22C55E), LV_PART_INDICATOR | LV_STATE_CHECKED);')
    expect(generated.code).toContain('lv_obj_set_style_bg_color(fg_compact_pwm_enable, lv_color_hex(0xF5F5F5), LV_PART_KNOB);')
    expect(generated.code).toContain('lv_obj_set_style_bg_color(fg_compact_pwm_slider, lv_color_hex(0x475569), LV_PART_MAIN);')
    expect(generated.code).toContain('lv_obj_set_style_bg_color(fg_compact_pwm_slider, lv_color_hex(0x22C55E), LV_PART_INDICATOR);')
    expect(generated.code).toContain('lv_obj_set_style_radius(fg_compact_pwm_slider, LV_RADIUS_CIRCLE, LV_PART_KNOB);')
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Compact_Value(float value);', 'float FG_Get_Compact_Value(void);',
      'void FG_Set_Compact_Enabled(bool enabled);', 'bool FG_Get_Compact_Enabled(void);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Compact_Value_Changed', 'FG_On_Compact_Enabled_Changed',
    ]))
  })

  it('uses persisted IDs for independent duplicate identity despite visible renames', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['comp-pwm-a', 'comp-pwm-b'], props: {} },
      'comp-pwm-a': pwm('comp-pwm-a', { label: 'Same label' }),
      'comp-pwm-b': pwm('comp-pwm-b', { label: 'Same label' }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.publicApiDeclarations.join('\n')).toContain('FG_Set_Comp_Pwm_A_Value')
    expect(generated.publicApiDeclarations.join('\n')).toContain('FG_Set_Comp_Pwm_B_Value')
  })

  it.each([
    ['%', '%.6g %%'],
    ['rpm', '%.6g rpm'],
    ['Hz', '%.6g Hz'],
    ['V', '%.6g V'],
    ['%s', '%.6g %%s'],
    ['%d%n%f', '%.6g %%d%%n%%f'],
    ['load %s at %d%%', '%.6g load %%s at %%d%%%%'],
  ])('emits engineering unit %p as literal printf text in every update path', (unit, format) => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['comp-unit'], props: {} },
      'comp-unit': pwm('comp-unit', { unit }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code.split(`"${format}"`)).toHaveLength(4)
  })

  it('emits valid float literals and warning-safe clamp blocks', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['comp-float'], props: {} },
      'comp-float': pwm('comp-float', { minimum: -3, maximum: 100, value: 50, step: 12.5 }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('-3.0f')
    expect(generated.code).toContain('100.0f')
    expect(generated.code).toContain('47.0f')
    expect(generated.code).toContain('12.5f')
    expect(generated.code).not.toMatch(/(?:^|[^.\d])(?:0|47|100)f\b/)
    expect(generated.code).not.toMatch(/if \(value <[^\n]+;\s*if \(value >/)
    expect(generated.code).toContain('if (value < -3.0f)\n    {\n        value = -3.0f;\n    }')
  })

  it('does not emit unused generic object aliases for duplicate PWM cards', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['comp-one', 'comp-two'], props: {} },
      'comp-one': pwm('comp-one', { unit: '%' }),
      'comp-two': pwm('comp-two', { unit: '%s', value: 12.5 }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).not.toMatch(/lv_obj_t \* obj\d+ = fg_comp_(?:one|two)_pwm;/)
    expect(generated.code.match(/"%.6g %%"/g)).toHaveLength(3)
    expect(generated.code.match(/"%.6g %%s"/g)).toHaveLength(3)
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Comp_One_Value(float value);', 'void FG_Set_Comp_Two_Value(float value);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Comp_One_Value_Changed', 'FG_On_Comp_Two_Value_Changed',
    ]))
  })
})
