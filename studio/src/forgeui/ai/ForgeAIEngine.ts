import {
  buildForgeUILayoutSystemPrompt,
  buildForgeUILayoutUserPrompt,
  ForgeAIPromptContext,
} from './ForgeAIPrompts'

import {
  ForgeAILayoutDocument,
  parseForgeAIResponse,
} from './ForgeAIParser'

import { requestForgeAILayout } from './ForgeAIClient'

export type GenerateForgeAILayoutOptions = ForgeAIPromptContext & {
  prompt: string
}

export const generateForgeAILayout = async ({
  prompt,
  supportedComponents,
  screenWidth,
  screenHeight,
  currentLayout = [],
  currentTheme = null,
}: GenerateForgeAILayoutOptions): Promise<ForgeAILayoutDocument> => {
  const trimmedPrompt = prompt.trim()

  if (!trimmedPrompt) {
    throw new Error('Enter an AI layout prompt')
  }

  if (!Array.isArray(supportedComponents) || supportedComponents.length === 0) {
    throw new Error('No supported ForgeUI components are available')
  }

  if (!Number.isFinite(screenWidth) || screenWidth <= 0) {
    throw new Error('Invalid ForgeUI screen width')
  }

  if (!Number.isFinite(screenHeight) || screenHeight <= 0) {
    throw new Error('Invalid ForgeUI screen height')
  }

  const systemPrompt = buildForgeUILayoutSystemPrompt({
    supportedComponents,
    screenWidth,
    screenHeight,
    currentLayout,
    currentTheme,
  })

  const userPrompt = buildForgeUILayoutUserPrompt(trimmedPrompt)

    const response = await requestForgeAILayout({
    prompt: userPrompt,
    systemPrompt,
  })

  return parseForgeAIResponse(
    JSON.stringify(response.document),
    supportedComponents
  )
}