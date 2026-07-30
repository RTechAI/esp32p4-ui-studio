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
import { composeForgeAILayout } from './ForgeAILayoutEngine'
import {
  composeForgeUILayoutTemplate,
  ForgeUILayoutTemplateId,
  getForgeUILayoutTemplate,
} from '~forgeui/layout/ForgeUILayoutDesigner'
import {
  flattenForgeAIRegionComposerDocument,
  isForgeAIRegionComposerDocument,
} from './ForgeAIRegionComposer'

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
  componentCatalogue = [],
  availableAssets = [],
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
    componentCatalogue,
    availableAssets,
  })

  const userPrompt =
    buildForgeUILayoutUserPrompt(trimmedPrompt)

  const response = await requestForgeAILayout({
    prompt: userPrompt,
    systemPrompt,
  })

  const templateMarker = trimmedPrompt.match(
    /FORGEUI_LAYOUT_TEMPLATE:\s*([a-z0-9-]+)/i,
  )
  const requestedTemplateId = templateMarker?.[1].toLowerCase()
  const candidateDefinition = requestedTemplateId
    ? getForgeUILayoutTemplate(
        requestedTemplateId as ForgeUILayoutTemplateId,
      )
    : null
  const requestedDefinition =
    candidateDefinition?.id === requestedTemplateId
      ? candidateDefinition
      : null
  const responseDocument =
    isForgeAIRegionComposerDocument(response.document)
      ? flattenForgeAIRegionComposerDocument({
          ...response.document,
          template: requestedDefinition?.id || response.document.template,
        })
      : response.document
  const parsed = parseForgeAIResponse(
    JSON.stringify(responseDocument),
    supportedComponents,
    screenWidth,
    screenHeight,
    availableAssets,
  )
  if (
    requestedDefinition &&
    requestedDefinition.id === requestedTemplateId
  ) {
    return {
      ...parsed,
      layout: composeForgeUILayoutTemplate(
        requestedDefinition,
        parsed.layout as any,
      ),
    }
  }
  return composeForgeAILayout(
    parsed,
    screenWidth,
    screenHeight,
    trimmedPrompt,
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
