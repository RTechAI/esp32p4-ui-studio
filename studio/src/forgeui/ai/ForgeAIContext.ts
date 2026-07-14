import { aiSupportedComponents } from '~componentsList'
import { FORGEUI_ACTIVE_DEVICE } from '~forgeui/ForgeUIDeviceConfig'
import { searchForgeUIIcons } from '~forgeui/icons/ForgeUIIconSearch'

export type ForgeAIRelevantIconGroup = {
  query: string
  matches: string[]
}

export type ForgeAIProjectContext = {
  supportedComponents: string[]
  screenWidth: number
  screenHeight: number
  currentLayout: unknown[]
  currentTheme: unknown
  relevantIcons: ForgeAIRelevantIconGroup[]
}

export type CreateForgeAIContextOptions = {
  currentLayout?: unknown[]
  currentTheme?: unknown
  userPrompt?: string
}

const ICON_SEARCH_TERMS = [
  'wifi',
  'battery',
  'clock',
  'settings',
  'power',
  'home',
  'warning',
  'alert',
  'temperature',
  'bluetooth',
  'signal',
  'volume',
  'play',
  'pause',
  'stop',
  'menu',
  'search',
  'user',
]

const findRelevantIcons = (
  userPrompt: string,
): ForgeAIRelevantIconGroup[] => {
  const normalizedPrompt = userPrompt.toLowerCase()

  return ICON_SEARCH_TERMS
    .filter(term => {
  const pattern = new RegExp(
    `\\b${term}\\b`,
    'i',
  )

  return pattern.test(normalizedPrompt)
})
    .map(term => ({
      query: term,
      matches: searchForgeUIIcons(term, 5),
    }))
    .filter(group => group.matches.length > 0)
}

export const createForgeAIContext = ({
  currentLayout = [],
  currentTheme = null,
  userPrompt = '',
}: CreateForgeAIContextOptions = {}): ForgeAIProjectContext => {
  return {
    supportedComponents: [
      ...aiSupportedComponents,
    ],
    screenWidth:
      FORGEUI_ACTIVE_DEVICE.width,
    screenHeight:
      FORGEUI_ACTIVE_DEVICE.height,
    currentLayout:
      Array.isArray(currentLayout)
        ? currentLayout
        : [],
    currentTheme,
    relevantIcons:
      findRelevantIcons(userPrompt),
  }
}