import React from 'react'
import fs from 'fs'
import path from 'path'
import http from 'http'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { generateForgeUILvglCode } from '../ForgeUILvglExport'
import { forgeUIWeatherDashboardTemplate } from '../layout/ForgeUILayoutDesigner'
import { HARDWARE_EXAMPLE_01_PROJECT } from './HardwareExample01'
import { HARDWARE_EXAMPLE_02_PROJECT } from './HardwareExample02'
import { HARDWARE_EXAMPLE_03_PROJECT } from './HardwareExample03'
import {
  HARDWARE_EXAMPLE_04,
  HARDWARE_EXAMPLE_04_PROJECT,
} from './HardwareExample04'
import {
  HardwareExamplesPanel,
  loadHardwareExample04Project,
} from './HardwareExamplesPanel'
import { getPreviewDefaultProps } from '../../utils/defaultProps'
import { forgeUIGetUploadedAssets } from '../ForgeUIUploadedAssetRegistry'
import { validateForgeUIExport } from '../ForgeUIExportValidation'
import {
  FORGEUI_WEATHER_BACKGROUND_PACK,
} from '../ForgeUIAssetRegistry'
import {
  FORGEUI_WEATHER_RUNTIME_BACKGROUND_KEYS,
  resolveForgeUIWeatherBackgroundKey,
} from '../weather/ForgeUIWeatherBackgrounds'

jest.mock('../icons/ForgeUIIconAssetRenderer', () => ({
  forgeUIIconNameToPngFile: jest.fn(async (
    iconName: string,
    width: number,
    height: number,
  ) => new File([`${iconName}:${width}x${height}`], `${iconName}_${width}x${height}.png`, {
    type: 'image/png',
  })),
}))

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
  let loadedWeatherProject: IComponents

  beforeAll(async () => {
    global.fetch = jest.fn(async (_url, init) => {
      const request = JSON.parse(String(init?.body || '{}'))
      const match = String(request.fileName).match(/^(FiSun|FiCloudRain)_(40|136)x\2\.png$/)
      if (!match) return { ok: false, json: async () => ({ error: 'Unexpected icon request' }) } as any
      const [, iconName, size] = match
      const canonical = iconName === 'FiCloudRain'
        ? 'fg_upload_ficloudrain_40x40_771045b9'
        : size === '136'
          ? 'fg_upload_fisun_136x136_5e2bccdd'
          : 'fg_upload_fisun_40x40_3a46c017'
      return {
        ok: true,
        json: async () => ({
          ok: true,
          symbolName: canonical,
          assetSource: `assets/uploads/${canonical}.c`,
        }),
      } as any
    }) as any
    loadedWeatherProject = await loadHardwareExample04Project()
  })

  beforeEach(() => reset.mockClear())

  it('is visible with physically proven status and loads the resolved Weather project', async () => {
    render(<ChakraProvider><HardwareExamplesPanel /></ChakraProvider>)
    expect(screen.getByText('Example 04')).toBeInTheDocument()
    expect(screen.getByText('Online Weather')).toBeInTheDocument()
    expect(screen.getAllByText('PHYSICALLY PROVEN')).toHaveLength(4)
    fireEvent.click(screen.getByRole('button', { name: 'Load Weather Example' }))
    await waitFor(() => expect(reset).toHaveBeenCalledTimes(1))
    expect(reset).toHaveBeenCalledWith(loadedWeatherProject)
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
      loadedWeatherProject,
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
    const { generateStudioExportHeader } = require('../../../export-server')
    expect(generateStudioExportHeader(generated.publicApiDeclarations)).toContain(
      'void FG_Set_Weather_Background_Key(const char * key);',
    )
  })

  it('keeps Weather icons intentional and excludes implicit Settings icons', () => {
    const icons = Object.values(loadedWeatherProject)
      .filter(component => component.type === 'Icon')
    expect(icons).toHaveLength(6)
    expect(icons.map(component => component.props.icon)).toEqual([
      'FiSun', 'FiSun', 'FiSun', 'FiCloudRain', 'FiSun', 'FiSun',
    ])
    expect(icons.every(component => component.props.icon !== 'FiSettings')).toBe(true)

    const generated = generateForgeUILvglCode(
      loadedWeatherProject,
      'graphite',
      undefined,
      {
        includeThemeTexture: false,
        firmwareFeatures: { settingsLauncher: false },
      },
    )
    expect(generated.code).not.toContain('fg_icon_settings_fi_48px')
    expect(generated.assetSources).toEqual(expect.arrayContaining([
      'assets/uploads/fg_upload_fisun_136x136_5e2bccdd.c',
      'assets/uploads/fg_upload_fisun_40x40_3a46c017.c',
      'assets/uploads/fg_upload_ficloudrain_40x40_771045b9.c',
    ]))
    const assets = forgeUIGetUploadedAssets()
    expect(icons.every(component => assets.some(asset =>
      asset.id === component.props.uploadedAssetId &&
      asset.exportStatus === 'lvgl_ready' &&
      asset.lvgl === component.props.lvgl &&
      asset.cFile === component.props.cFile,
    ))).toBe(true)
    expect(validateForgeUIExport(loadedWeatherProject, [], assets, generated).ok)
      .toBe(true)
  })

  it('loads and exports the reusable dynamic Weather background pack', () => {
    expect(FORGEUI_WEATHER_BACKGROUND_PACK).toHaveLength(17)
    expect(new Set(FORGEUI_WEATHER_BACKGROUND_PACK.map(asset => asset.semanticKey)).size)
      .toBe(17)
    expect(resolveForgeUIWeatherBackgroundKey(0, true)).toBe('weather.clear.day')
    expect(resolveForgeUIWeatherBackgroundKey(0, false)).toBe('weather.clear.night')
    expect(resolveForgeUIWeatherBackgroundKey(61, false)).toBe('weather.rain.night')
    expect(resolveForgeUIWeatherBackgroundKey(95, true)).toBe('weather.thunderstorm')

    const generated = generateForgeUILvglCode(
      loadedWeatherProject,
      'graphite',
      undefined,
      { includeThemeTexture: false },
    )
    const runtimeAssets = FORGEUI_WEATHER_BACKGROUND_PACK.filter(asset =>
      FORGEUI_WEATHER_RUNTIME_BACKGROUND_KEYS.includes(asset.semanticKey as any),
    )
    expect(runtimeAssets).toHaveLength(10)
    expect(generated.assetSources).toEqual(expect.arrayContaining(
      runtimeAssets.map(asset => asset.cFile),
    ))
    expect(generated.assetSources.filter(source =>
      source.includes('fg_upload_ai_hero_178617') && source.endsWith('.c'),
    )).toHaveLength(10)
    expect(generated.assetSources).not.toContain(
      'assets/uploads/fg_upload_ai_hero_1786177133674_eb2ae86e.c',
    )
    runtimeAssets.forEach(asset => {
      expect(generated.code).toContain(`LV_IMAGE_DECLARE(${asset.lvgl});`)
      expect(generated.code).toContain(`strcmp(key, "${asset.semanticKey}")`)
    })
    expect(generated.code).toContain('static lv_obj_t * fg_weather_background_image = NULL;')
    expect(generated.code).toContain('strcmp(fg_weather_background_key, key) == 0')
    expect(generated.code).toContain('lv_image_set_src(fg_weather_background_image, source);')
    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Weather_Background_Key(const char * key);',
    )
    expect(validateForgeUIExport(
      loadedWeatherProject,
      [],
      forgeUIGetUploadedAssets(),
      generated,
    ).ok).toBe(true)
  })

  it('still refuses an unresolved icon from the raw static project', () => {
    expect(() => generateForgeUILvglCode(
      HARDWARE_EXAMPLE_04_PROJECT,
      'graphite',
      undefined,
      { includeThemeTexture: false },
    )).toThrow('Icon FiSun requires a converted LVGL asset')
  })

  it('does not assign an implicit Settings icon to general containers', () => {
    expect(getPreviewDefaultProps('Box' as ComponentType)?.icon).toBeUndefined()
    expect(getPreviewDefaultProps('DashboardCard' as ComponentType)?.icon).toBe('')
    expect(getPreviewDefaultProps('SensorTile' as ComponentType)?.icon)
      .toBe('LV_SYMBOL_CHARGE')
  })

  it('keeps named label setters and Wi-Fi function boundaries valid with Diagnostics disabled', () => {
    const generated = generateForgeUILvglCode(
      loadedWeatherProject,
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
      loadedWeatherProject,
      'graphite',
      undefined,
      { includeThemeTexture: false, firmwareFeatures },
    )
    if (process.env.FORGEUI_EXPORT_WEATHER_EXAMPLE_04_LIVE === '1') {
      const cleanResponse = await new Promise<any>((resolve, reject) => {
        const request = http.request({
          hostname: '127.0.0.1', port: 3030, path: '/clean-firmware-sweep', method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': 2 },
        }, result => {
          let body = ''
          result.setEncoding('utf8')
          result.on('data', chunk => { body += chunk })
          result.on('end', () => result.statusCode === 200
            ? resolve(JSON.parse(body))
            : reject(new Error(body)))
        })
        request.on('error', reject)
        request.end('{}')
      })
      expect(cleanResponse.ok).toBe(true)
      expect(cleanResponse.foldersCleaned.uploads).toBe(0)
      const firmwareMain = path.resolve(process.cwd(), '..', 'firmware', 'ForgeUI-One', 'main')
      generated.assetSources.filter(source => source.includes('_rgb565.c')).forEach(source => {
        expect(fs.existsSync(path.join(firmwareMain, source))).toBe(true)
      })

      const livePayload = JSON.stringify({
        ...generated,
        projectHardware: { firmwareFeatures },
      })
      const liveResponse = await new Promise<any>((resolve, reject) => {
        const request = http.request({
          hostname: '127.0.0.1', port: 3030, path: '/export', method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(livePayload) },
        }, result => {
          let body = ''
          result.setEncoding('utf8')
          result.on('data', chunk => { body += chunk })
          result.on('end', () => result.statusCode === 200
            ? resolve(JSON.parse(body))
            : reject(new Error(body)))
        })
        request.on('error', reject)
        request.end(livePayload)
      })
      expect(liveResponse.ok).toBe(true)
    }
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
    const exportedWeatherAssets = generated.assetSources
      .filter(source => source.includes('_rgb565.c'))
    expect(exportedWeatherAssets).toHaveLength(10)
    exportedWeatherAssets.forEach(source => {
      expect(fs.existsSync(path.join(response.exportDir, 'main', source))).toBe(true)
    })

    const missingSource = 'assets/uploads/fg_missing_weather_regression.c'
    const invalidPayload = JSON.stringify({
      ...generated,
      code: `${generated.code}\n/* fg_missing_weather_regression */`,
      assetSources: [...generated.assetSources, missingSource],
      projectName: 'ForgeUI_Export_Weather04_Missing_Asset_Must_Fail',
      projectHardware: { firmwareFeatures },
    })
    const invalidStatus = await new Promise<number>((resolve, reject) => {
      const request = http.request({
        hostname: '127.0.0.1', port: 3030, path: '/export-idf-project', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(invalidPayload) },
      }, result => {
        result.resume()
        result.on('end', () => resolve(result.statusCode || 0))
      })
      request.on('error', reject)
      request.end(invalidPayload)
    })
    expect(invalidStatus).toBe(500)
    process.stdout.write(`WEATHER_EXAMPLE_04_EXPORT=${response.exportDir}\n`)
  }, 30000)
})
