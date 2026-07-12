import type { ForgeAILayoutDocument } from './ForgeAIParser'

export type ForgeAIRequest = {
  prompt: string
  systemPrompt: string
}

export type ForgeAIResponse = {
  document: ForgeAILayoutDocument
}

const FORGE_AI_ENDPOINT = '/api/forgeui-ai-layout'

export const requestForgeAILayout = async ({
  prompt,
  systemPrompt,
}: ForgeAIRequest): Promise<ForgeAIResponse> => {
  const response = await fetch(FORGE_AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      systemPrompt,
    }),
  })

  let payload: any

  try {
    payload = await response.json()
  } catch {
    throw new Error(
      `ForgeUI AI returned an unreadable response (${response.status})`
    )
  }

  if (!response.ok || payload?.ok !== true) {
    const message =
      typeof payload?.error === 'string'
        ? payload.error
        : `ForgeUI AI request failed (${response.status})`

    throw new Error(message)
  }

  if (
    !payload.document ||
    typeof payload.document !== 'object' ||
    !Array.isArray(payload.document.layout)
  ) {
    throw new Error('ForgeUI AI returned an invalid layout document')
  }

  return {
    document: payload.document as ForgeAILayoutDocument,
  }
}