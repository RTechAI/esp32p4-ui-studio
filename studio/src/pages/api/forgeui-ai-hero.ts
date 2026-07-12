import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

type ApiResponse =
  | {
      ok: true
      image: string
    }
  | {
      ok: false
      error: string
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
    typeof req.body?.prompt === 'string'
      ? req.body.prompt.trim()
      : ''

  if (!prompt) {
    return res.status(400).json({
      ok: false,
      error: 'Prompt is required',
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
      timeout: 120000,
      maxRetries: 0,
    })

    const result = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: `
Create a wide embedded HMI hero background.

User request:
${prompt}

Requirements:
- cinematic professional embedded dashboard background
- no words, labels, numbers or logos
- leave usable darker areas for UI controls
- landscape composition
- suitable for cropping to 1024 x 600
- polished industrial interface artwork
`,
      size: '1536x1024',
      quality: 'medium',
    })

    const base64 = result.data?.[0]?.b64_json

    if (!base64) {
      return res.status(502).json({
        ok: false,
        error: 'OpenAI returned no image',
      })
    }

    return res.status(200).json({
      ok: true,
      image: `data:image/png;base64,${base64}`,
    })
  } catch (error: unknown) {
    console.error('ForgeUI hero generation failed:', error)

    return res.status(500).json({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Hero generation failed',
    })
  }
}