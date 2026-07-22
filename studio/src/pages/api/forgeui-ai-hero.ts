import type {
  NextApiRequest,
  NextApiResponse,
} from 'next'

import OpenAI from 'openai'

type GenerationMode =
  | 'hero'
  | 'artwork'
  | 'button-normal'
  | 'button-pressed'
  | 'light-off'
  | 'light-on'
  | 'three-position-left'
  | 'three-position-center'
  | 'three-position-right'

type ApiResponse =
  | {
      ok: true
      image: string
    }
  | {
      ok: false
      error: string
    }

const buildGenerationPrompt = (
  prompt: string,
  mode: GenerationMode,
) => {
  if (mode.startsWith('three-position-')) {
    const position = mode.replace('three-position-', '').toUpperCase()
    return `
Create the ${position} visual state for a horizontal industrial three-position selector or rocker switch.

User request:
${prompt}

Requirements:
- one front-facing embedded HMI UI asset on a transparent background
- a horizontal rectangular switch body spanning nearly the full image width
- LEFT, CENTER and RIGHT positions must all remain clearly visible
- the lever, slider, rocker or illuminated selection is clearly positioned at ${position}
- industrial control-panel style suitable for an ESP32-P4 touchscreen
- no circular status lamp, warning light, isolated indicator, dashboard, hands or unrelated objects
- no text, letters, numbers or logos in the artwork
- consistent fixed body geometry, camera, materials, lighting, scale and dimensions across all three states
- differ from the matching states only by the selected position
- use minimal transparent margins so the visible body communicates the full rectangular touch area
`
  }
  if (mode === 'button-normal') {
    return `
Create the NORMAL visual state for an embedded HMI touchscreen button.

User request:
${prompt}

Requirements:
- create one complete UI button
- front-facing view
- landscape button proportions
- centered composition
- no surrounding dashboard or interface
- no device mockup
- no hands
- no extra objects
- clean professional embedded HMI style
- clear normal/resting state
- transparent or plain neutral background
- leave the button label area visually clean
- no text, letters, numbers or logos
- suitable for resizing to approximately 120 x 48 pixels
`
  }

  if (mode === 'button-pressed') {
    return `
Create the PRESSED visual state for an embedded HMI touchscreen button.

User request:
${prompt}

Requirements:
- create one complete UI button
- front-facing view
- landscape button proportions
- centered composition
- no surrounding dashboard or interface
- no device mockup
- no hands
- no extra objects
- clean professional embedded HMI style
- clearly pressed or activated appearance
- use the same requested design language
- slightly darker, inset, illuminated or depressed state
- transparent or plain neutral background
- leave the button label area visually clean
- no text, letters, numbers or logos
- suitable for resizing to approximately 120 x 48 pixels
`
  }

  if (mode === 'light-off') {
    return `
Create the OFF visual state for an embedded HMI status light or indicator.

User request:
${prompt}

Requirements:
- create one isolated status light, warning lamp or indicator
- clearly inactive, unlit or powered-off appearance
- front-facing view and centered composition
- no surrounding dashboard, device mockup, hands or extra objects
- no text, letters, numbers or logos
- transparent or plain neutral background
- preserve the requested visual design for a matching ON state
- suitable for resizing to the requested indicator dimensions
`
  }

  if (mode === 'light-on') {
    return `
Create the ON visual state for an embedded HMI status light or indicator.

User request:
${prompt}

Requirements:
- create one isolated status light, warning lamp or indicator
- clearly active, illuminated or glowing appearance
- front-facing view and centered composition
- no surrounding dashboard, device mockup, hands or extra objects
- no text, letters, numbers or logos
- transparent or plain neutral background
- preserve the requested visual design for a matching OFF state
- suitable for resizing to the requested indicator dimensions
`
  }

  if (mode === 'artwork') {
    return `
Create professional embedded HMI interface artwork.

User request:
${prompt}

Requirements:
- polished industrial interface artwork
- isolated composition
- suitable for an embedded touchscreen
- no words, labels, numbers or logos
- no surrounding device mockup
- clean visual hierarchy
`
  }

  return `
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
`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
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

  const requestedMode =
    typeof req.body?.mode === 'string'
      ? req.body.mode
      : 'hero'

  const allowedModes: GenerationMode[] = [
    'hero',
    'artwork',
    'button-normal',
    'button-pressed',
    'light-off',
    'light-on',
    'three-position-left',
    'three-position-center',
    'three-position-right',
  ]

  const mode: GenerationMode =
    allowedModes.includes(
      requestedMode as GenerationMode,
    )
      ? (requestedMode as GenerationMode)
      : 'hero'

  if (!prompt) {
    return res.status(400).json({
      ok: false,
      error: 'Prompt is required',
    })
  }

  const apiKey =
    process.env.OPENAI_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error:
        'OPENAI_API_KEY is not configured',
    })
  }

  try {
    const openai = new OpenAI({
      apiKey,
      timeout: 120000,
      maxRetries: 0,
    })

    const result =
      await openai.images.generate({
        model: 'gpt-image-1',
        prompt: buildGenerationPrompt(
          prompt,
          mode,
        ),
        size: '1536x1024',
        quality: 'medium',
      })

    const base64 =
      result.data?.[0]?.b64_json

    if (!base64) {
      return res.status(502).json({
        ok: false,
        error:
          'OpenAI returned no image',
      })
    }

    return res.status(200).json({
      ok: true,
      image:
        `data:image/png;base64,${base64}`,
    })
  } catch (error: unknown) {
    console.error(
      'ForgeUI image generation failed:',
      error,
    )

    return res.status(500).json({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Image generation failed',
    })
  }
}
