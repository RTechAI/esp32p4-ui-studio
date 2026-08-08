import { generateForgeUILvglCode } from '../ForgeUILvglExport'
import fs from 'fs'
import path from 'path'
import { HARDWARE_EXAMPLE_03, HARDWARE_EXAMPLE_03_PROJECT } from './HardwareExample03'

describe('Hardware Example 03 PN532 contracts', () => {
  it('generates only the semantic NFC status API', () => {
    expect(HARDWARE_EXAMPLE_03.status).toBe('PHYSICALLY PROVEN')
    const generated = generateForgeUILvglCode(HARDWARE_EXAMPLE_03_PROJECT,
      'graphite', undefined, { includeThemeTexture: false,
        firmwareFeatures: { wifi: false, bluetooth: false, audio: false,
          sdCard: false, rtc: false, usbHost: false, camera: false,
          settingsLauncher: false, wifiManager: false, storageBrowser: false,
          diagnostics: false } })
    for (const name of ['Device', 'Interface', 'Card', 'UID', 'Read_Count']) {
      expect(generated.publicApiDeclarations).toContain(
        `void FG_Set_NFC_${name}_Text(const char * text);`)
    }
    expect(generated.publicApiDeclarations.join('\n')).not.toContain('FRAM')
    expect(generated.publicApiDeclarations.join('\n')).not.toContain('Indicator1')
    if (process.env.FORGEUI_REGENERATE_HARDWARE_EXAMPLE_03 === '1') {
      fs.writeFileSync(path.resolve(process.cwd(), '..', 'firmware',
        'ForgeUI-One', 'main', '90_Studio_Export.c'), generated.code, 'utf8')
    }
  })
})
