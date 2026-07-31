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
}
