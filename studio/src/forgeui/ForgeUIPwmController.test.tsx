import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { normalizeForgeUIPwmController } from './ForgeUIPwmController'
import { ForgeUIPwmControllerPreview } from './preview/ForgeUIPwmControllerPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'

const pwm = (id: string, props: Record<string, unknown> = {}): IComponent => ({
  id, componentName: 'Visible name may change', type: 'PwmController', parent: 'root', children: [],
  props: { x: 20, y: 30, w: 320, h: 220, ...props },
})

describe('ForgeUI PWM Controller', () => {
  beforeAll(() => {
    window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as any
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
