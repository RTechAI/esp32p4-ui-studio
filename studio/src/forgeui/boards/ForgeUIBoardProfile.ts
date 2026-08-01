export type ForgeUIBoardStatus = 'supported' | 'experimental' | 'planned'

export type ForgeUIFirmwareFeatures = {
  wifi: boolean
  bluetooth: boolean
  audio: boolean
  sdCard: boolean
  usbHost: boolean
  camera: boolean
  settingsLauncher: boolean
  wifiManager: boolean
  storageBrowser: boolean
  diagnostics: boolean
}

export type ForgeUIBoardCapability =
  | 'display' | 'touch' | 'backlight' | 'wifi' | 'bluetooth'
  | 'audio' | 'sdCard' | 'usbHost' | 'camera'

export interface ForgeUIBoardProfile {
  id: string
  manufacturer: string
  model: string
  displayName: string
  shortName: string
  status: ForgeUIBoardStatus
  target: string
  display: { width: number; height: number; colorDepth: number }
  memory: { flashBytes?: number; psramBytes?: number }
  capabilities: Record<ForgeUIBoardCapability, boolean>
  supportedFeatures: {
    settingsLauncher: boolean
    wifiManager: boolean
    storageBrowser: boolean
    diagnostics: boolean
  }
  defaultFeatures: ForgeUIFirmwareFeatures
  defaultWifiHosted: ForgeUIProjectHardware['wifiHosted']
  defaultSd: ForgeUIProjectHardware['sd']
  firmware: {
    bspComponent: string
    sdkconfigDefaults: string | string[]
    partitionTable: string
    requiredSources?: string[]
    requiredComponents?: string[]
  }
}

export interface ForgeUIProjectHardware {
  boardId: string
  firmwareFeatures: ForgeUIFirmwareFeatures
  wifiHosted: {
    transport: 'sdio' | 'spi'
    slot?: 0 | 1
    width?: 1 | 4
    frequencyKHz: number
    clk: number
    cmd?: number
    d0?: number
    d1?: number
    d2?: number
    d3?: number
    mode?: 0 | 1 | 2 | 3
    controller?: number
    mosi?: number
    miso?: number
    cs?: number
    handshake?: number
    dataReady?: number
    reset: number
    resetDelayMs: number
    txQueueSize: number
    rxQueueSize: number
  }
  sd: {
    host: 'sdmmc'
    slot: 0 | 1
    width: 1 | 4
    frequencyKHz: number
    clk: number
    cmd: number
    d0: number
    d1: number
    d2: number
    d3: number
    ldoChannel: number
    ldoVoltageMv: number
  }
}
