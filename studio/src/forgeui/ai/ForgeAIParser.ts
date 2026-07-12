export type ForgeAILayoutItem = {
  type: string
  props: Record<string, unknown>
}

export type ForgeAILayoutDocument = {
  name: string
  category: string
  description: string
  layout: ForgeAILayoutItem[]
}

const extractJsonText = (value: string): string => {
  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error('AI returned an empty response')
  }

  const withoutCodeFence = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const firstBrace = withoutCodeFence.indexOf('{')
  const lastBrace = withoutCodeFence.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error('AI response does not contain a JSON object')
  }

  return withoutCodeFence.slice(firstBrace, lastBrace + 1)
}

const validateLayoutItem = (
  item: unknown,
  index: number,
  supportedComponents: Set<string>
): ForgeAILayoutItem => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new Error(`layout[${index}] must be an object`)
  }

  const candidate = item as Record<string, unknown>

  if (typeof candidate.type !== 'string' || !candidate.type.trim()) {
    throw new Error(`layout[${index}].type must be a non-empty string`)
  }

  if (!supportedComponents.has(candidate.type)) {
    throw new Error(`Unsupported component: ${candidate.type}`)
  }

  if (
    !candidate.props ||
    typeof candidate.props !== 'object' ||
    Array.isArray(candidate.props)
  ) {
    throw new Error(`layout[${index}].props must be an object`)
  }

  return {
    type: candidate.type,
    props: candidate.props as Record<string, unknown>,
  }
}

export const parseForgeAIResponse = (
  rawResponse: string,
  supportedComponentNames: string[]
): ForgeAILayoutDocument => {
  const jsonText = extractJsonText(rawResponse)

  let parsed: unknown

  try {
    parsed = JSON.parse(jsonText)
  } catch {
    throw new Error('AI returned invalid JSON')
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('AI response must be a JSON document')
  }

  const document = parsed as Record<string, unknown>

  if (!Array.isArray(document.layout)) {
    throw new Error('AI response must contain a layout array')
  }

  const supportedComponents = new Set(supportedComponentNames)

  const layout = document.layout.map((item, index) =>
    validateLayoutItem(item, index, supportedComponents)
  )

  return {
    name:
      typeof document.name === 'string' && document.name.trim()
        ? document.name
        : 'AI Generated Screen',

    category:
      typeof document.category === 'string' && document.category.trim()
        ? document.category
        : 'AI Generated',

    description:
      typeof document.description === 'string'
        ? document.description
        : '',

    layout,
  }
}