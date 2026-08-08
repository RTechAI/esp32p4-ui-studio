import { generateForgeUILvglCode } from '../ForgeUILvglExport'
import fs from 'fs'
import path from 'path'
import { HARDWARE_EXAMPLE_02, HARDWARE_EXAMPLE_02_PROJECT } from './HardwareExample02'

describe('Hardware Example 02 FRAM contracts', () => {
  it('is an exclusive project with semantic FRAM UI contracts', () => {
    expect(HARDWARE_EXAMPLE_02.status).toBe('PHYSICALLY PROVEN')
    expect(HARDWARE_EXAMPLE_02.i2c).toEqual({
      sda: 7, scl: 8, address: 0x50, device: 'MB85RC256V',
    })
    expect(HARDWARE_EXAMPLE_02_PROJECT.indicator1).toBeUndefined()
    expect(HARDWARE_EXAMPLE_02_PROJECT['led2-toggle']).toBeUndefined()
    const generated = generateForgeUILvglCode(HARDWARE_EXAMPLE_02_PROJECT,
      'graphite', undefined, {
        includeThemeTexture: false,
        firmwareFeatures: {
          wifi: false, bluetooth: false, audio: false, sdCard: false,
          rtc: false, usbHost: false, camera: false, settingsLauncher: false,
          wifiManager: false, storageBrowser: false, diagnostics: false,
        },
      })
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_FRAM_Status_Text(const char * text);',
      'void FG_Set_FRAM_Address_Text(const char * text);',
      'void FG_Set_FRAM_Value_Text(const char * text);',
      'void FG_Set_FRAM_Verify_Text(const char * text);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_WRITE_TEST_Clicked', 'FG_On_READ_TEST_Clicked',
    ]))
    expect(generated.publicApiDeclarations).not.toContain('void FG_Set_Indicator1(bool on);')
    expect(generated.userEventHooks).not.toContain('FG_On_LED1_Toggle_Changed')
    if (process.env.FORGEUI_REGENERATE_HARDWARE_EXAMPLE_02 === '1') {
      fs.writeFileSync(path.resolve(process.cwd(), '..', 'firmware',
        'ForgeUI-One', 'main', '90_Studio_Export.c'), generated.code, 'utf8')
    }
  })

  it('does not link or initialize Example 01 in the selected live firmware', () => {
    const mainDir = path.resolve(process.cwd(), '..', 'firmware', 'ForgeUI-One', 'main')
    const selection = fs.readFileSync(path.join(mainDir,
      '00_ForgeUI_Hardware_Example.h'), 'utf8')
    const cmake = fs.readFileSync(path.join(mainDir, 'CMakeLists.txt'), 'utf8')
    const generated = fs.readFileSync(path.join(mainDir, '90_Studio_Export.c'), 'utf8')
    expect(selection).toContain('#define FG_HARDWARE_EXAMPLE_01_ENABLED 0')
    expect(selection).toContain('#define FG_HARDWARE_EXAMPLE_02_ENABLED 1')
    expect(cmake).not.toContain('"96_Hardware_Example_01.c"')
    expect(cmake).toContain('"97_Hardware_Example_02_Discovery.c"')
    expect(generated).not.toContain('fg_indicator1_led')
    expect(generated).not.toContain('FG_On_LED1_Toggle_Changed')
  })
})
