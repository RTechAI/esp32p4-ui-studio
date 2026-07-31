import {
  ForgeUIBoardCapability,
  ForgeUIBoardProfile,
  ForgeUIFirmwareFeatures,
  ForgeUIProjectHardware,
} from './ForgeUIBoardProfile'
import {
  waveshareEsp32P4Wifi6Touch7B,
  WAVESHARE_ESP32P4_WIFI6_TOUCH_7B_ID,
} from './profiles/waveshareEsp32P4Wifi6Touch7B'

const registry: readonly ForgeUIBoardProfile[] = Object.freeze([
  waveshareEsp32P4Wifi6Touch7B,
])

export const createForgeUIBoardRegistry = (
  profiles: readonly ForgeUIBoardProfile[],
) => ({
  getAvailableBoardProfiles: () => [...profiles],
  getBoardProfile: (boardId?: string) =>
    profiles.find(profile => profile.id === boardId),
})

export const DEFAULT_FORGEUI_BOARD_ID = WAVESHARE_ESP32P4_WIFI6_TOUCH_7B_ID

export const getAvailableBoardProfiles = () => [...registry]

export const getBoardProfile = (boardId?: string) =>
  registry.find(profile => profile.id === boardId)

export const getDefaultFeaturesForBoard = (boardId: string) => ({
  ...(getBoardProfile(boardId) || waveshareEsp32P4Wifi6Touch7B).defaultFeatures,
})

export const isBoardCapabilitySupported = (
  boardId: string,
  capability: ForgeUIBoardCapability,
) => Boolean(getBoardProfile(boardId)?.capabilities[capability])

export const normalizeProjectFeatures = (
  boardId: string,
  features?: Partial<ForgeUIFirmwareFeatures>,
): ForgeUIFirmwareFeatures => {
  const profile = getBoardProfile(boardId) || waveshareEsp32P4Wifi6Touch7B
  const resolved = { ...profile.defaultFeatures, ...(features || {}) }
  ;(['wifi', 'bluetooth', 'audio', 'sdCard', 'usbHost', 'camera'] as const)
    .forEach(key => {
      if (!profile.capabilities[key]) resolved[key] = false
    })
  if (!profile.supportedFeatures.settingsLauncher) resolved.settingsLauncher = false
  if (!profile.supportedFeatures.wifiManager || !resolved.wifi) resolved.wifiManager = false
  if (!profile.supportedFeatures.storageBrowser || !resolved.sdCard) resolved.storageBrowser = false
  if (!profile.supportedFeatures.diagnostics) resolved.diagnostics = false
  if (!resolved.settingsLauncher) {
    resolved.wifiManager = false
    resolved.storageBrowser = false
    resolved.diagnostics = false
  }
  return resolved
}

export const getSelectedBoardProfile = (
  project?: Partial<ForgeUIProjectHardware>,
) => getBoardProfile(project?.boardId) || waveshareEsp32P4Wifi6Touch7B

export const normalizeProjectHardware = (
  project?: Partial<ForgeUIProjectHardware>,
): ForgeUIProjectHardware => {
  const profile = getSelectedBoardProfile(project)
  return {
    boardId: profile.id,
    firmwareFeatures: normalizeProjectFeatures(
      profile.id,
      project?.firmwareFeatures,
    ),
  }
}
