import React from 'react'
import fs from 'fs'
import path from 'path'
import http from 'http'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { generateForgeUILvglCode } from '../ForgeUILvglExport'
import { HARDWARE_EXAMPLE_05, HARDWARE_EXAMPLE_05_PROJECT } from './HardwareExample05'
import { HardwareExamplesPanel } from './HardwareExamplesPanel'

const { TextDecoder, TextEncoder } = require('util')
Object.assign(global, { TextDecoder, TextEncoder })

const reset = jest.fn()
jest.mock('~hooks/useDispatch', () => () => ({ components: { reset } }))
jest.mock('../icons/ForgeUIIconResolver', () => ({ resolveForgeUIIconProject: jest.fn() }))

const {
  appendHardwareExample05Source,
  generateHardwareExampleHeader,
  selectedHardwareExample,
  shouldCopyFirmwareSource,
} = require('../../../export-server')

describe('Hardware Example 05 Studio and export integration', () => {
  beforeEach(() => reset.mockClear())

  it('appears after Example 04 as physically proven and loads its editable project', () => {
    render(<ChakraProvider><HardwareExamplesPanel /></ChakraProvider>)
    const cards = screen.getAllByTestId(/hardware-example-card-/)
    expect(cards).toHaveLength(5)
    expect(within(cards[3]).getByText('Example 04')).toBeInTheDocument()
    expect(within(cards[4]).getByText('Example 05')).toBeInTheDocument()
    expect(within(cards[4]).getByText('UART GPS / GNSS')).toBeInTheDocument()
    expect(within(cards[4]).getByText('PHYSICALLY PROVEN')).toBeInTheDocument()
    fireEvent.click(within(cards[4]).getByRole('button', { name: 'Load Example' }))
    expect(reset).toHaveBeenCalledWith(HARDWARE_EXAMPLE_05_PROJECT)
    expect(HARDWARE_EXAMPLE_05.status).toBe('PHYSICALLY PROVEN')
  })

  it('opens the GPS guide with wiring, format, power and indoor-proof guidance', () => {
    render(<ChakraProvider><HardwareExamplesPanel /></ChakraProvider>)
    fireEvent.click(within(screen.getByTestId('hardware-example-card-5'))
      .getByRole('button', { name: 'Guide' }))
    expect(screen.getByText('Example 05 — GPS / GNSS')).toBeInTheDocument()
    expect(screen.getByText(/NEO TX → IO3 \/ GPIO3 → P4 UART1 RX/))
      .toBeInTheDocument()
    expect(screen.getByText(/NEO RX ← IO4 \/ GPIO4 ← P4 UART1 TX/))
      .toBeInTheDocument()
    expect(screen.getByText(/GPIO38.*unisolated CH343P USB-UART TX net/)).toBeInTheDocument()
    expect(screen.getByText(/read-only UBX-MON-VER poll/)).toBeInTheDocument()
    expect(screen.getByText(/9600 baud, 8N1/)).toBeInTheDocument()
    expect(screen.getByText(/NEO VCC.*Core_5V/)).toBeInTheDocument()
    expect(screen.getByText(/12 satellites/)).toBeInTheDocument()
  })

  it('generates all GPS layout components and selects the GPS runtime contract', () => {
    const generated = generateForgeUILvglCode(
      HARDWARE_EXAMPLE_05_PROJECT, 'graphite', undefined,
      { includeThemeTexture: false },
    )
    const names = ['UART', 'NMEA', 'Fix', 'Satellites', 'Latitude', 'Longitude',
      'Altitude', 'Speed', 'UTC', 'HDOP']
    names.forEach(name => expect(generated.publicApiDeclarations).toContain(
      `void FG_Set_GPS_${name}_Text(const char * text);`,
    ))
    expect(selectedHardwareExample(generated.publicApiDeclarations,
      generated.userEventHooks)).toBe(5)
    expect(generateHardwareExampleHeader(generated.publicApiDeclarations,
      generated.userEventHooks)).toContain('#define FG_HARDWARE_EXAMPLE_05_ENABLED 1')
    expect(generated.code).toContain('Hardware Example 05 — GPS / GNSS')
    expect(generated.code).toContain('GPS Receiver')
    for (const text of ['Receiver', 'UART RX', 'GPIO3', 'UART TX', 'GPIO4']) {
      expect(generated.code).toContain(text)
    }
  })

  it('carries the developer GPS source/header, CMake selection and main integration', () => {
    const firmwareMain = path.resolve(process.cwd(), '..', 'firmware', 'ForgeUI-One', 'main')
    const generated = generateForgeUILvglCode(
      HARDWARE_EXAMPLE_05_PROJECT, 'graphite', undefined,
      { includeThemeTexture: false },
    )
    const sources: string[] = []
    appendHardwareExample05Source(sources, firmwareMain, generated.publicApiDeclarations)
    expect(sources).toEqual(['"99_Hardware_Example_05_GPS.c"'])
    for (const file of ['99_Hardware_Example_05_GPS.c', '99_Hardware_Example_05_GPS.h']) {
      const source = path.join(firmwareMain, file)
      expect(fs.existsSync(source)).toBe(true)
      expect(shouldCopyFirmwareSource(source)).toBe(true)
    }
    const main = fs.readFileSync(path.join(firmwareMain, 'main.c'), 'utf8')
    const gps = fs.readFileSync(path.join(firmwareMain, '99_Hardware_Example_05_GPS.c'), 'utf8')
    const selection = generateHardwareExampleHeader(generated.publicApiDeclarations,
      generated.userEventHooks)
    expect(main).toContain('#include "99_Hardware_Example_05_GPS.h"')
    expect(main).toContain('fg_hardware_example_05_init();')
    expect(main).toContain('fg_hardware_example_05_ui_binding_init();')
    expect(main).not.toContain('FG_HARDWARE_EXAMPLE_05_STARTUP_ENABLED')
    expect(selection).toContain('#define FG_HARDWARE_EXAMPLE_SELECTED 5')
    expect(selection).not.toContain('STARTUP_ENABLED')
    expect(gps).not.toContain('lv_obj_clean(')
    expect(gps).not.toContain('lv_label_create(')
    expect(gps).toContain('ESP_LOGI(TAG, "startup begin")')
    expect(gps).toContain('ESP_LOGI(TAG, "UART initialized (RX GPIO3 TX GPIO4, 9600 8N1)")')
    expect(gps).toContain('ESP_LOGI(TAG, "parser task started")')
    expect(gps).toContain('ESP_LOGI(TAG, "startup complete")')
    expect(gps).toContain('#define FG_GPS_RX_GPIO GPIO_NUM_3')
    expect(gps).toContain('#define FG_GPS_TX_GPIO GPIO_NUM_4')
    expect(gps).toContain('configuring UART1 RX GPIO3 TX GPIO4')
    expect(gps).toContain('UART initialized (RX GPIO3 TX GPIO4, 9600 8N1)')
    expect(gps).toContain('uart_set_pin(FG_GPS_UART, FG_GPS_TX_GPIO, FG_GPS_RX_GPIO')
    expect(gps).toContain('0xB5, 0x62, 0x0A, 0x04, 0x00, 0x00, 0x0E, 0x34')
    expect(gps).toContain('sending UBX MON-VER poll via GPIO4')
    expect(gps).toContain('MON-VER response valid')
    expect(gps).toContain('if (!poll_sent)')
    expect(gps).not.toMatch(/UBX[_-]CFG|CFG-SAVE|uart_write_bytes[^;]*(save|reset)/i)
    expect(gps).not.toContain('pre-UART HIGH=')
    expect(gps).not.toContain('uart_read_bytes calls=')
    expect(gps).not.toContain('first RX HEX=')
    expect(gps).not.toContain('first RX ASCII=')
    expect(gps).not.toContain('gpio_dump_io_configuration')
    expect(gps).not.toContain('GPIO38')
    expect(gps).toContain('!strcmp(type, "GSA")')
    expect(gps).toContain('"3D FIX"')
    expect(gps).toContain('FG_Set_GPS_UART_Text')
    expect(gps).toContain('FG_GPS_UI", "binding initialized"')
  })

  const standaloneExportTest = process.env.FORGEUI_EXPORT_GPS_EXAMPLE_05 === '1'
    ? it : it.skip
  standaloneExportTest('exports a complete standalone GPS project through the server', async () => {
    const firmwareFeatures = {
      wifi: false, bluetooth: false, audio: false, sdCard: false, rtc: false,
      usbHost: false, camera: false, settingsLauncher: true,
      wifiManager: false, storageBrowser: false, diagnostics: false,
    }
    const blueEdgeSymbol =
      'fg_upload_background_forgeui_background_v3_cyber_blue_edge_routes_proof'
    const blueEdgeSource = `assets/uploads/${blueEdgeSymbol}.c`
    const blueEdgePng = fs.readFileSync(path.resolve(
      process.cwd(), 'public/assets/backgrounds/forgeui-v3/cyber-blue-edge-routes.png',
    ))
    const postJson = (requestPath: string, body: unknown) => new Promise<any>((resolve, reject) => {
      const payload = JSON.stringify(body)
      const request = http.request({
        hostname: '127.0.0.1', port: 3030, path: requestPath, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      }, result => {
        let responseBody = ''
        result.setEncoding('utf8')
        result.on('data', chunk => { responseBody += chunk })
        result.on('end', () => result.statusCode === 200
          ? resolve(JSON.parse(responseBody)) : reject(new Error(responseBody)))
      })
      request.on('error', reject)
      request.end(payload)
    })
    const converted = await postJson('/convert-lvgl-image', {
      fileName: 'cyber-blue-edge-routes.png',
      symbolName: blueEdgeSymbol,
      base64: `data:image/png;base64,${blueEdgePng.toString('base64')}`,
      assetMode: 'hero', width: 1024, height: 600,
    })
    expect(converted.assetSource).toBe(blueEdgeSource)
    const selectedBackground = {
      exportStatus: 'lvgl_ready', lvgl: blueEdgeSymbol, cFile: blueEdgeSource,
    }
    const generated = generateForgeUILvglCode(
      HARDWARE_EXAMPLE_05_PROJECT, 'graphite', selectedBackground,
      { includeThemeTexture: true, firmwareFeatures },
    )
    expect(generated.assetSources).toContain(blueEdgeSource)
    expect(generated.assetSources).not.toContain(
      'assets/uploads/fg_upload_carbon_fiber_be774fd2.c',
    )
    const payload = JSON.stringify({
      ...generated,
      projectName: 'ForgeUI_Export_GPS05_Physically_Proven',
      projectHardware: { firmwareFeatures },
    })
    const response = await new Promise<any>((resolve, reject) => {
      const request = http.request({
        hostname: '127.0.0.1', port: 3030, path: '/export-idf-project', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      }, result => {
        let body = ''
        result.setEncoding('utf8')
        result.on('data', chunk => { body += chunk })
        result.on('end', () => result.statusCode === 200
          ? resolve(JSON.parse(body)) : reject(new Error(body)))
      })
      request.on('error', reject)
      request.end(payload)
    })
    const exportedMain = path.join(response.exportDir, 'main')
    const selection = fs.readFileSync(path.join(exportedMain,
      '00_ForgeUI_Hardware_Example.h'), 'utf8')
    const cmake = fs.readFileSync(path.join(exportedMain, 'CMakeLists.txt'), 'utf8')
    const main = fs.readFileSync(path.join(exportedMain, 'main.c'), 'utf8')
    const gps = fs.readFileSync(path.join(exportedMain,
      '99_Hardware_Example_05_GPS.c'), 'utf8')
    const blueEdge = fs.readFileSync(path.join(exportedMain, blueEdgeSource), 'utf8')
    expect(fs.existsSync(path.join(exportedMain, '99_Hardware_Example_05_GPS.h'))).toBe(true)
    expect(selection).toContain('#define FG_HARDWARE_EXAMPLE_SELECTED 5')
    expect(selection).toContain('#define FG_HARDWARE_EXAMPLE_05_ENABLED 1')
    expect(selection).not.toContain('STARTUP_ENABLED')
    expect(cmake).toContain('"99_Hardware_Example_05_GPS.c"')
    expect(cmake).toContain(`"${blueEdgeSource}"`)
    expect(cmake).not.toContain('fg_upload_carbon_fiber_be774fd2.c')
    expect(blueEdge).toContain(`const lv_image_dsc_t ${blueEdgeSymbol}`)
    expect(fs.readFileSync(path.join(exportedMain, '90_Studio_Export.c'), 'utf8'))
      .toContain(`LV_IMAGE_DECLARE(${blueEdgeSymbol})`)
    expect(fs.readFileSync(path.join(exportedMain, '90_Studio_Export.c'), 'utf8'))
      .toContain(`lv_image_set_src(bg_texture_0, &${blueEdgeSymbol})`)
    expect(main).toContain('fg_hardware_example_05_init();')
    expect(main).toContain('fg_hardware_example_05_ui_binding_init();')
    expect(gps).toContain('ESP_LOGI(TAG, "startup begin")')
    expect(gps).toContain('#define FG_GPS_RX_GPIO GPIO_NUM_3')
    expect(gps).toContain('#define FG_GPS_TX_GPIO GPIO_NUM_4')
    expect(gps).toContain('configuring UART1 RX GPIO3 TX GPIO4')
    expect(gps).toContain('UART initialized (RX GPIO3 TX GPIO4, 9600 8N1)')
    expect(gps).toContain('0xB5, 0x62, 0x0A, 0x04, 0x00, 0x00, 0x0E, 0x34')
    expect(gps).toContain('if (!poll_sent)')
    expect(gps).not.toMatch(/UBX[_-]CFG|CFG-SAVE/i)
    expect(gps).not.toContain('pre-UART HIGH=')
    expect(gps).not.toContain('uart_read_bytes calls=')
    expect(gps).not.toContain('first RX HEX=')
    expect(gps).not.toContain('first RX ASCII=')
    expect(gps).not.toContain('gpio_dump_io_configuration')
    expect(gps).not.toContain('GPIO38')
    expect(gps).not.toContain('lv_obj_clean(')
    expect(gps).not.toContain('lv_label_create(')
    expect(gps).toContain('FG_Set_GPS_UART_Text')
    expect(gps).toContain('FG_GPS_UI", "binding initialized"')
    process.stdout.write(`GPS_EXAMPLE_05_EXPORT=${response.exportDir}\n`)
  }, 30000)
})
