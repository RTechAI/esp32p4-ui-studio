import { aiSupportedComponents } from '~componentsList'
import { FORGEUI_ACTIVE_DEVICE } from '~forgeui/ForgeUIDeviceConfig'

export type ForgeAIProjectContext = {
  supportedComponents: string[]
  screenWidth: number
  screenHeight: number
  currentLayout: unknown[]
  currentTheme: unknown
}

export type CreateForgeAIContextOptions = {
  currentLayout?: unknown[]
  currentTheme?: unknown
}

export const createForgeAIContext = ({
  currentLayout = [],
  currentTheme = null,
}: CreateForgeAIContextOptions = {}): ForgeAIProjectContext => {
  return {
    supportedComponents: [...aiSupportedComponents],
    screenWidth: FORGEUI_ACTIVE_DEVICE.width,
    screenHeight: FORGEUI_ACTIVE_DEVICE.height,
    currentLayout: Array.isArray(currentLayout) ? currentLayout : [],
    currentTheme,
  }
}