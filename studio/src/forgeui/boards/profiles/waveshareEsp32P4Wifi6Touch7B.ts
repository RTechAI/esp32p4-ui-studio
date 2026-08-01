import { ForgeUIBoardProfile } from '../ForgeUIBoardProfile'

export const WAVESHARE_ESP32P4_WIFI6_TOUCH_7B_ID =
  'waveshare-esp32p4-wifi6-touch-lcd-7b'

export const waveshareEsp32P4Wifi6Touch7B: ForgeUIBoardProfile = {
  id: WAVESHARE_ESP32P4_WIFI6_TOUCH_7B_ID,
  manufacturer: 'Waveshare',
  model: 'ESP32-P4-WIFI6-Touch-LCD-7B',
  displayName: 'Waveshare ESP32-P4 WiFi6 Touch LCD 7B',
  shortName: 'ESP32-P4 7B',
  status: 'supported',
  target: 'esp32p4',
  display: { width: 1024, height: 600, colorDepth: 16 },
  memory: { flashBytes: 32 * 1024 * 1024, psramBytes: 32 * 1024 * 1024 },
  capabilities: {
    display: true, touch: true, backlight: true, wifi: true,
    bluetooth: false, audio: true, sdCard: true, usbHost: true, camera: true,
  },
  supportedFeatures: {
    settingsLauncher: true, wifiManager: true,
    storageBrowser: true, diagnostics: true,
  },
  defaultFeatures: {
    wifi: true, bluetooth: false, audio: false, sdCard: true,
    usbHost: false, camera: false, settingsLauncher: true,
    wifiManager: true, storageBrowser: true, diagnostics: true,
  },
  defaultWifiHosted: {
    transport: 'sdio', slot: 1, width: 4, frequencyKHz: 40000,
    clk: 18, cmd: 19, d0: 14, d1: 15, d2: 16, d3: 17,
    reset: 54, resetDelayMs: 1500, txQueueSize: 20, rxQueueSize: 20,
  },
  defaultSd: {
    host: 'sdmmc', slot: 0, width: 4, frequencyKHz: 40000,
    clk: 43, cmd: 44, d0: 39, d1: 40, d2: 41, d3: 42,
    ldoChannel: 4, ldoVoltageMv: 2500,
  },
  firmware: {
    bspComponent: 'waveshare__esp32_p4_wifi6_touch_lcd_7b',
    sdkconfigDefaults: 'sdkconfig.defaults',
    partitionTable: 'partitions.csv',
    requiredSources: ['main.c', '01_FG_Runtime.c', '20_RTC.c'],
    requiredComponents: ['nvs_flash', 'driver', 'esp_event', 'bsp_extra'],
  },
}
