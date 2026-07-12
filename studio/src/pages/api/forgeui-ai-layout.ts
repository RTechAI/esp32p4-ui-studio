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

const SUPPORTED_COMPONENTS = [
  'Button',
  'Text',
  'Heading',
  'Input',
  'Textarea',
  'Switch',
  'Checkbox',
  'Radio',
  'Slider',
  'Progress',
  'CircularProgress',
  'NumberInput',
  'Select',
  'Image',
  'Box',
  'Icon',
  'IconButton',
  'Divider',
  'Led',
  'Bar',
  'Arc',
  'Chart',
  'Table',
  'Calendar',
  'Scale',
  'Roller',
  'Msgbox',
  'ButtonMatrix',
  'Canvas',
  'Line',
  'Tabview',
  'Tileview',
  'Keyboard',
  'AnimImage',
]

const FORGEUI_SYSTEM_PROMPT = `
You are the ForgeUI AI layout generator.

Convert the user's screen description into one valid ForgeUI layout document
for a 1024 x 600 embedded display.

Return valid JSON only.

Do not return Markdown.
Do not use code fences.
Do not return explanations.
Do not return React, JSX, HTML, CSS, TypeScript or JavaScript.

Use this exact document shape:

{
  "name": "Screen Name",
  "category": "AI Generated",
  "description": "Brief description",
  "layout": [
    {
      "type": "Heading",
      "props": {
        "positionMode": "absolute",
        "x": 40,
        "y": 30,
        "w": 300,
        "h": 50,
        "children": "Example"
      }
    }
  ]
}

Allowed component types:

${SUPPORTED_COMPONENTS.join(', ')}

Rules:

- The display is 1024 pixels wide and 600 pixels high.
- Every layout item must contain "type" and "props".
- Every props object must include:
  - "positionMode": "absolute"
  - numeric "x"
  - numeric "y"
  - numeric "w"
  - numeric "h"
- Keep every item fully inside the display.
- x and y must be zero or greater.
- Width and height must be greater than zero.
- Avoid unnecessary overlap.
- Use sensible alignment and spacing.
- Use "children" for visible text on Heading, Text and Button.
- Do not invent component types.
- Do not include functions, event handlers or executable code.
- Create one complete screen.
`

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
  console.log('HANDLER ENTERED:', req.method)
  console.log('BODY:', req.body)

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')

    return res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
  }

  const prompt =
    typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : ''

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
  console.log('=== ForgeUI AI Request ===')
  console.log('Prompt:', prompt)
  console.log('Creating OpenAI client...')

  const openai = new OpenAI({
  apiKey,
  timeout: 90000,
  maxRetries: 0,
})

  console.log('Client created')
  console.log('Calling Responses API...')

  const controller = new AbortController()

const abortTimer = setTimeout(() => {
  controller.abort()
}, 90_000)

let response

try {
  response = await openai.responses.create(
    {
      model: 'gpt-5.4-mini',
      instructions: FORGEUI_SYSTEM_PROMPT,
      input: prompt,
    },
    {
      signal: controller.signal,
    }
  )
} finally {
  clearTimeout(abortTimer)
}



  console.log('Responses API returned')
  console.log(response)

    const outputText = stripCodeFence(response.output_text || '')

    if (!outputText) {
      return res.status(502).json({
        ok: false,
        error: 'OpenAI returned an empty response',
      })
    }

    let document: ForgeUILayoutDocument

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
      !Array.isArray(document.layout)
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
    console.error('Request ID:', error.request_id)
  }

  const message =
    error instanceof Error ? error.message : 'Unknown OpenAI error'

  return res.status(500).json({
    ok: false,
    error: message,
  })
}
}