import {
  buildForgeUILayoutSystemPrompt,
  buildForgeUILayoutUserPrompt,
  ForgeAIPromptContext,
} from './ForgeAIPrompts'

import {
  ForgeAILayoutDocument,
  parseForgeAIResponse,
} from './ForgeAIParser'

import {
  buildForgeAIThemeSystemPrompt,
  buildForgeAIThemeUserPrompt,
  ForgeAIThemePromptContext,
} from './ForgeAIThemePrompts'

import { ForgeAIThemeDocument } from './ForgeAIThemeDocument'
import { parseForgeAIThemeResponse } from './ForgeAIThemeParser'

import { requestForgeAILayout } from './ForgeAIClient'

export type GenerateForgeAILayoutOptions =
  ForgeAIPromptContext & {
    prompt: string
  }

export type GenerateForgeAIThemeOptions =
  ForgeAIThemePromptContext & {
    prompt: string
  }

export const generateForgeAILayout = async ({
  prompt,
  supportedComponents,
  screenWidth,
  screenHeight,
  currentLayout = [],
  currentTheme = null,
  relevantIcons = [],
}: GenerateForgeAILayoutOptions): Promise<ForgeAILayoutDocument> => {
   const trimmedPrompt = prompt.trim()

  if (!trimmedPrompt) {
    throw new Error('Enter an AI layout prompt')
  }

  if (
    !Array.isArray(supportedComponents) ||
    supportedComponents.length === 0
  ) {
    throw new Error(
      'No supported ForgeUI components are available',
    )
  }

  if (
    !Number.isFinite(screenWidth) ||
    screenWidth <= 0
  ) {
    throw new Error('Invalid ForgeUI screen width')
  }

  if (
    !Number.isFinite(screenHeight) ||
    screenHeight <= 0
  ) {
    throw new Error('Invalid ForgeUI screen height')
  }

  const systemPrompt =
  buildForgeUILayoutSystemPrompt({
    supportedComponents,
    screenWidth,
    screenHeight,
    currentLayout,
    currentTheme,
    relevantIcons,
  })

  const userPrompt =
    buildForgeUILayoutUserPrompt(trimmedPrompt)

  const response = await requestForgeAILayout({
    prompt: userPrompt,
    systemPrompt,
  })

  return parseForgeAIResponse(
    JSON.stringify(response.document),
    supportedComponents,
  )
}

export const generateForgeAITheme = async ({
  prompt,
  currentTheme,
}: GenerateForgeAIThemeOptions): Promise<ForgeAIThemeDocument> => {
  const trimmedPrompt = prompt.trim()

  if (!trimmedPrompt) {
    throw new Error('Enter an AI theme prompt')
  }

  const systemPrompt =
    buildForgeAIThemeSystemPrompt()

  const userPrompt =
    buildForgeAIThemeUserPrompt(
      trimmedPrompt,
      {
        currentTheme,
      },
    )

  const response = await requestForgeAILayout({
    prompt: userPrompt,
    systemPrompt,
  })

  return parseForgeAIThemeResponse(
    JSON.stringify(response.document),
  )
}