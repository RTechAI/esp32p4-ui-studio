import React from 'react'
import fs from 'fs'
import path from 'path'
import http from 'http'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { generateForgeUILvglCode } from '../ForgeUILvglExport'
import { forgeUIWeatherDashboardTemplate } from '../layout/ForgeUILayoutDesigner'
import { HARDWARE_EXAMPLE_01_PROJECT } from './HardwareExample01'
import { HARDWARE_EXAMPLE_02_PROJECT } from './HardwareExample02'
import { HARDWARE_EXAMPLE_03_PROJECT } from './HardwareExample03'
import {
  HARDWARE_EXAMPLE_04,
  HARDWARE_EXAMPLE_04_PROJECT,
} from './HardwareExample04'
import { HardwareExamplesPanel } from './HardwareExamplesPanel'

const { TextDecoder, TextEncoder } = require('util')
Object.assign(global, { TextDecoder, TextEncoder })
const {
  appendHardwareExample04Source,
  applyHardwareExampleBuildRequirements,
  generateHardwareExampleHeader,
  selectedHardwareExample,
  shouldCopyFirmwareSource,
} = require('../../../export-server')

const reset = jest.fn()
jest.mock('~hooks/useDispatch', () => () => ({ components: { reset } }))

describe('Hardware Example 04 Studio integration', () => {
  beforeEach(() => reset.mockClear())

  it('is visible with physically proven status and loads the Weather project', () => {
    render(<ChakraProvider><HardwareExamplesPanel /></ChakraProvider>)
    expect(screen.getByText('Example 04')).toBeInTheDocument()
    expect(screen.getByText('Online Weather')).toBeInTheDocument()
    expect(screen.getAllByText('PHYSICALLY PROVEN')).toHaveLength(4)
    fireEvent.click(screen.getByRole('button', { name: 'Load Weather Example' }))
    expect(reset).toHaveBeenCalledTimes(1)
    expect(reset).toHaveBeenCalledWith(HARDWARE_EXAMPLE_04_PROJECT)
    expect(HARDWARE_EXAMPLE_04.status).toBe('PHYSICALLY PROVEN')
  })

  it('preserves all existing example actions and project identities', () => {
    render(<ChakraProvider><HardwareExamplesPanel /></ChakraProvider>)
    expect(screen.getByRole('button', { name: 'Load Example' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Load FRAM Example' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Load NFC Example' })).toBeInTheDocument()
    expect(HARDWARE_EXAMPLE_01_PROJECT.indicator1.componentName).toBe('Indicator1')
    expect(HARDWARE_EXAMPLE_02_PROJECT['fram-status'].componentName).toBe('FRAM_Status')
    expect(HARDWARE_EXAMPLE_03_PROJECT.device.componentName).toBe('NFC_Device')
  })

  it('reuses canonical Weather geometry and generates the real temperature API', () => {
    const regions = Object.values(HARDWARE_EXAMPLE_04_PROJECT).filter(component =>
      typeof component.props.layoutRegionKey === 'string')
    expect(regions.map(component => component.props.layoutRegionKey)).toEqual(
      forgeUIWeatherDashboardTemplate.layout.map(item => item.props.layoutRegionKey),
    )
    const generated = generateForgeUILvglCode(
      HARDWARE_EXAMPLE_04_PROJECT,
      'graphite',
      undefined,
      { includeThemeTexture: false },
    )
    const setter = 'void FG_Set_Weather_Temperature_Text(const char * text);'
    expect(generated.publicApiDeclarations).toContain(setter)
    expect(generated.code).toContain('lv_label_set_text(fg_weather_temperature_label, text);')
    expect(selectedHardwareExample(generated.publicApiDeclarations, generated.userEventHooks)).toBe(4)
    expect(generateHardwareExampleHeader(
      generated.publicApiDeclarations,
      generated.userEventHooks,
    )).toContain('#define FG_HARDWARE_EXAMPLE_04_ENABLED 1')
  })

  it('keeps named label setters and Wi-Fi function boundaries valid with Diagnostics disabled', () => {
    const generated = generateForgeUILvglCode(
      HARDWARE_EXAMPLE_04_PROJECT,
      'graphite',
      undefined,
      {
        includeThemeTexture: false,
        firmwareFeatures: {
          wifi: true,
          bluetooth: false,
          audio: false,
          sdCard: false,
          rtc: false,
          usbHost: false,
          camera: false,
          settingsLauncher: true,
          wifiManager: true,
          storageBrowser: false,
          diagnostics: false,
        },
      },
    )
    expect(generated.code).toMatch(
      /void FG_Set_Weather_Temperature_Text\(const char \* text\)\n\{\n[\s\S]*?lv_label_set_text\(fg_weather_temperature_label, text\);\n\}/,
    )
    expect(generated.code).toContain(
      'static bool fg_system_wifi_create_page(void)\n{',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_system_create_button(lv_obj_t * parent, const char * text, int32_t x, int32_t y, int32_t width, int32_t height)\n{',
    )
    expect(generated.code).not.toContain(
      'static void fg_system_open_diagnostics_cb(lv_event_t * event)',
    )
    expect(generated.code).not.toMatch(
      /\)\nstatic (?:void|bool|lv_obj_t \*) [A-Za-z_][A-Za-z0-9_]*\([^;]*\)\n\{/,
    )
  })

  it('propagates the weather source, header and HTTPS dependencies', () => {
    const firmwareMain = path.resolve(process.cwd(), '..', 'firmware', 'ForgeUI-One', 'main')
    const setter = 'void FG_Set_Weather_Temperature_Text(const char * text);'
    const sources: string[] = []
    appendHardwareExample04Source(sources, firmwareMain, [setter])
    expect(sources).toEqual(['"99_Hardware_Example_04_Weather.c"'])
    expect(fs.existsSync(path.join(firmwareMain, '99_Hardware_Example_04_Weather.h'))).toBe(true)
    expect(shouldCopyFirmwareSource(
      path.join(firmwareMain, '99_Hardware_Example_04_Weather.c'),
    )).toBe(true)
    expect(shouldCopyFirmwareSource(
      path.join(firmwareMain, '99_Hardware_Example_04_Weather.h'),
    )).toBe(true)
    const build = applyHardwareExampleBuildRequirements({ components: ['driver'] }, 4)
    expect(build.components).toEqual(expect.arrayContaining([
      'esp_http_client', 'json', 'mbedtls',
    ]))
    expect(applyHardwareExampleBuildRequirements({ components: ['driver'] }, 3).components)
      .toEqual(['driver'])
  })

  const standaloneExportTest =
    process.env.FORGEUI_EXPORT_WEATHER_EXAMPLE_04 === '1' ? it : it.skip
  standaloneExportTest('exports the real standalone Weather project through the server', async () => {
    const firmwareFeatures = {
      wifi: true, bluetooth: false, audio: false, sdCard: false, rtc: false,
      usbHost: false, camera: false, settingsLauncher: true,
      wifiManager: true, storageBrowser: false, diagnostics: false,
    }
    const generated = generateForgeUILvglCode(
      HARDWARE_EXAMPLE_04_PROJECT,
      'graphite',
      undefined,
      { includeThemeTexture: false, firmwareFeatures },
    )
    const payload = JSON.stringify({
      ...generated,
      projectName: 'ForgeUI_Export_Weather04_Studio_Final_015',
      projectHardware: { firmwareFeatures },
    })
    const response = await new Promise<any>((resolve, reject) => {
      const request = http.request({
        hostname: '127.0.0.1', port: 3030, path: '/export-idf-project',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      }, result => {
        let body = ''
        result.setEncoding('utf8')
        result.on('data', chunk => { body += chunk })
        result.on('end', () => result.statusCode === 200
          ? resolve(JSON.parse(body))
          : reject(new Error(body)))
      })
      request.on('error', reject)
      request.end(payload)
    })
    expect(response.ok).toBe(true)
    expect(fs.readFileSync(path.join(response.exportDir, 'main', '90_Studio_Export.c'), 'utf8'))
      .toBe(generated.code)
    const exportedDefaults = fs.readFileSync(path.join(response.exportDir, 'sdkconfig.defaults'), 'utf8')
    const exportedManifest = fs.readFileSync(path.join(response.exportDir, 'main', 'idf_component.yml'), 'utf8')
    expect(exportedManifest).toContain('version: "0.14.*"')
    expect(exportedManifest).toContain('version: "1.4.*"')
    expect(exportedDefaults).toContain('# CONFIG_ESP_HOSTED_SDIO_OPTIMIZATION_RX_MAX_SIZE is not set')
    expect(exportedDefaults).toContain('CONFIG_ESP_HOSTED_SDIO_OPTIMIZATION_RX_STREAMING_MODE=y')
    expect(exportedDefaults).toContain('# CONFIG_MBEDTLS_HARDWARE_AES is not set')
    expect(exportedDefaults).toContain('CONFIG_MBEDTLS_DEFAULT_MEM_ALLOC=y')
    expect(exportedDefaults).toContain('CONFIG_SPIRAM_MALLOC_RESERVE_INTERNAL=32768')
    process.stdout.write(`WEATHER_EXAMPLE_04_EXPORT=${response.exportDir}\n`)
  }, 30000)
})
