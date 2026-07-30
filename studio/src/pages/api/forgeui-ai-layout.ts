import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

type ForgeUILayoutItem = {
  type: string
  props: Record<string, unknown>
}

type ForgeUILayoutDocument = {
  name: string
  category: string
  description: string
  layout: ForgeUILayoutItem[]
}

type ApiResponse =
  | {
      ok: true
      document: ForgeUILayoutDocument
    }
  | {
      ok: false
      error: string
    }

function stripCodeFence(value: string): string {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')

    return res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
  }

  const prompt =
    typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : ''
  const systemPrompt =
    typeof req.body?.systemPrompt === 'string'
      ? req.body.systemPrompt.trim()
      : ''

  if (!prompt || !systemPrompt) {
    return res.status(400).json({
      ok: false,
      error: 'Prompt and systemPrompt are required',
    })
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: 'OPENAI_API_KEY is not configured',
    })
  }

  try {
  const openai = new OpenAI({
  apiKey,
  timeout: 90000,
  maxRetries: 0,
})

  const controller = new AbortController()

const abortTimer = setTimeout(() => {
  controller.abort()
}, 90_000)

let response

try {
  response = await openai.responses.create(
    {
      model: 'gpt-5.4-mini',
      instructions: systemPrompt,
      input: prompt,
    },
    {
      signal: controller.signal,
    }
  )
} finally {
  clearTimeout(abortTimer)
}



    const outputText = stripCodeFence(response.output_text || '')

    if (!outputText) {
      return res.status(502).json({
        ok: false,
        error: 'OpenAI returned an empty response',
      })
    }

    let document: ForgeUILayoutDocument & {
      template?: string
      regions?: Record<string, unknown>
    }

    try {
      document = JSON.parse(outputText) as ForgeUILayoutDocument
    } catch {
      console.error('Invalid OpenAI JSON:', outputText)

      return res.status(502).json({
        ok: false,
        error: 'OpenAI returned invalid JSON',
      })
    }

    if (
      !document ||
      typeof document !== 'object' ||
      !Array.isArray(document.layout) &&
      !(
        typeof document.template === 'string' &&
        document.regions &&
        typeof document.regions === 'object'
      )
    ) {
      return res.status(502).json({
        ok: false,
        error: 'OpenAI returned an invalid ForgeUI document',
      })
    }

    return res.status(200).json({
      ok: true,
      document,
    })
  } catch (error: unknown) {
  console.error('=== ForgeUI AI generation failed ===')
  console.error(error)

  if (error instanceof OpenAI.APIError) {
    console.error('Status:', error.status)
    console.error('Code:', error.code)
    console.error('Type:', error.type)
    console.error(
      'Request ID:',
      (error as { request_id?: string }).request_id,
    )
  }

  const message =
    error instanceof Error ? error.message : 'Unknown OpenAI error'

  return res.status(500).json({
    ok: false,
    error: message,
  })
}
}
