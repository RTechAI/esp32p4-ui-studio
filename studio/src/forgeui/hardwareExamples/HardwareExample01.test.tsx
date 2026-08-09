import React from 'react'
import fs from 'fs'
import path from 'path'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { generateForgeUILvglCode } from '../ForgeUILvglExport'
import {
  HARDWARE_EXAMPLE_01, HARDWARE_EXAMPLE_01_PROJECT, HARDWARE_EXAMPLES,
} from './HardwareExample01'
import { HardwareExamplesPanel } from './HardwareExamplesPanel'

jest.mock('../icons/ForgeUIIconResolver', () => ({
  resolveForgeUIIconProject: jest.fn(),
}))

const reset = jest.fn()
jest.mock('~hooks/useDispatch', () => () => ({ components: { reset } }))

describe('Hardware Example 01 Studio UI', () => {
  beforeEach(() => reset.mockClear())

  it('loads an ordinary editable project from the left panel', () => {
    render(<ChakraProvider><HardwareExamplesPanel /></ChakraProvider>)
    expect(screen.getByText('Hardware Examples')).toBeInTheDocument()
    expect(screen.getByText('Example 01')).toBeInTheDocument()
    expect(screen.getAllByText('PHYSICALLY PROVEN')).toHaveLength(4)
    fireEvent.click(screen.getAllByRole('button', { name: 'Load Example' })[0])
    expect(reset).toHaveBeenCalledWith(HARDWARE_EXAMPLE_01_PROJECT)
    fireEvent.click(screen.getAllByRole('button', { name: 'Guide' })[0])
    expect(screen.getByText(/GPIO2 → Button 1 → GND/)).toBeInTheDocument()
    expect(screen.getByText(/local slider\/interlock/)).toBeInTheDocument()
  })

  it('registers board-specific GPIO allocation and proof status', () => {
    expect(HARDWARE_EXAMPLES).toEqual([HARDWARE_EXAMPLE_01])
    expect(HARDWARE_EXAMPLE_01.gpio).toEqual({
      button1: 2, led1: 3, button2: 4, led2: 5,
    })
    expect(HARDWARE_EXAMPLE_01.status).toBe('PHYSICALLY PROVEN')
    expect(HARDWARE_EXAMPLE_01.guide).toBe(
      '11.01_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_01__BUTTONS_LEDS.md',
    )
  })

  it('persists the four identities and derives the intended generic contracts', () => {
    expect(HARDWARE_EXAMPLE_01_PROJECT.indicator1).toMatchObject({
      id: 'indicator1', type: 'Led', componentName: 'Indicator1',
    })
    expect(HARDWARE_EXAMPLE_01_PROJECT.indicator2).toMatchObject({
      id: 'indicator2', type: 'Led', componentName: 'Indicator2',
    })
    expect(HARDWARE_EXAMPLE_01_PROJECT['led1-toggle']).toMatchObject({
      type: 'Switch', componentName: 'LED1 Toggle',
    })
    expect(HARDWARE_EXAMPLE_01_PROJECT['led2-toggle']).toMatchObject({
      type: 'Switch', componentName: 'LED2 Toggle',
    })

    const generated = generateForgeUILvglCode(
      HARDWARE_EXAMPLE_01_PROJECT,
      'graphite',
      undefined,
      {
        includeThemeTexture: false,
        firmwareFeatures: {
          wifi: false,
          bluetooth: false,
          audio: false,
          sdCard: false,
          rtc: false,
          usbHost: false,
          camera: false,
          settingsLauncher: false,
          wifiManager: false,
          storageBrowser: false,
          diagnostics: false,
        },
      },
    )
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Indicator1(bool on);',
      'void FG_Set_Indicator2(bool on);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_LED1_Toggle_Changed',
      'FG_On_LED2_Toggle_Changed',
    ]))
    const led1Creation = generated.code.slice(
      generated.code.indexOf('fg_led1_toggle_switch = lv_switch_create'),
      generated.code.indexOf('lv_obj_add_event_cb(fg_led1_toggle_switch'),
    )
    const led2Creation = generated.code.slice(
      generated.code.indexOf('fg_led2_toggle_switch = lv_switch_create'),
      generated.code.indexOf('lv_obj_add_event_cb(fg_led2_toggle_switch'),
    )
    expect(led1Creation).not.toContain(
      'lv_obj_add_state(fg_led1_toggle_switch, LV_STATE_CHECKED);',
    )
    expect(led2Creation).not.toContain(
      'lv_obj_add_state(fg_led2_toggle_switch, LV_STATE_CHECKED);',
    )
    expect(HARDWARE_EXAMPLE_01_PROJECT['led1-toggle'].props.isChecked).toBe(false)
    expect(HARDWARE_EXAMPLE_01_PROJECT['led2-toggle'].props.isChecked).toBe(false)
    if (process.env.FORGEUI_REGENERATE_HARDWARE_EXAMPLE_01 === '1') {
      fs.writeFileSync(path.resolve(process.cwd(), '..', 'firmware',
        'ForgeUI-One', 'main', '90_Studio_Export.c'), generated.code, 'utf8')
    }
    expect(Object.values(HARDWARE_EXAMPLE_01_PROJECT).some(component =>
      String(component.type).includes('Native'))).toBe(false)
  })

  it('keeps GPIO behavior developer-owned, debounced, and channel-independent', () => {
    const firmwareMain = path.resolve(process.cwd(), '..',
      'firmware', 'ForgeUI-One', 'main')
    const hardware = fs.readFileSync(path.join(firmwareMain,
      '96_Hardware_Example_01.c'), 'utf8')
    const events = fs.readFileSync(path.join(firmwareMain,
      '95_UserEvents.c'), 'utf8')

    expect(hardware).toContain('#define FG_EXAMPLE_BUTTON_1 GPIO_NUM_2')
    expect(hardware).toContain('#define FG_EXAMPLE_LED_1    GPIO_NUM_3')
    expect(hardware).toContain('#define FG_EXAMPLE_BUTTON_2 GPIO_NUM_4')
    expect(hardware).toContain('#define FG_EXAMPLE_LED_2    GPIO_NUM_5')
    expect(hardware).toContain('.pull_up_en = GPIO_PULLUP_ENABLE')
    expect(hardware).toContain('#define FG_EXAMPLE_DEBOUNCE_US (25 * 1000)')
    expect(hardware).toContain('FG_Set_Indicator1')
    expect(hardware).toContain('FG_Set_Indicator2')
    expect(events).toMatch(/FG_On_LED1_Toggle_Changed[\s\S]*fg_hardware_example_01_set_led1\(checked\)/)
    expect(events).toMatch(/FG_On_LED2_Toggle_Changed[\s\S]*fg_hardware_example_01_set_led2\(checked\)/)
    expect(events).not.toMatch(/FG_Set_Indicator[12]\(checked\)/)
  })
})
