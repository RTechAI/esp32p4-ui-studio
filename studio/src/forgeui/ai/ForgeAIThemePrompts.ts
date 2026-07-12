import { ForgePreviewPalette } from '../preview/forgeThemeMap'

export type ForgeAIThemePromptContext = {
  currentTheme?: ForgePreviewPalette
}

export const buildForgeAIThemeSystemPrompt = (): string => {
  return `
You are ForgeUI Theme Engine.

Generate exactly one valid JSON theme document for ForgeUI Studio.

Return JSON only.
Do not return markdown.
Do not use code fences.
Do not include explanations.

The exact required structure is:

{
  "name": "Theme document name",
  "description": "Short theme description",
  "palette": {
    "name": "Palette display name",
    "bg": "#RRGGBB",
    "surface": "#RRGGBB",
    "surface2": "#RRGGBB",
    "border": "#RRGGBB",
    "text": "#RRGGBB",
    "accent": "#RRGGBB",
    "texture": "none",
    "borderStyle": "flat"
  }
}

Rules:

- Every colour must be a hexadecimal colour.
- Use readable contrast between text and surfaces.
- bg is the main canvas background.
- surface is the primary component surface.
- surface2 is the secondary or elevated surface.
- border is the structural outline colour.
- text is the primary readable text colour.
- accent is the main interactive highlight colour.
- texture must currently be "none".
- borderStyle must be exactly one of:
  "flat",
  "industrial",
  "glow",
  "soft",
  "terminal".
- Do not add extra properties.
- Do not omit any required properties.
`.trim()
}

export const buildForgeAIThemeUserPrompt = (
  prompt: string,
  context?: ForgeAIThemePromptContext,
): string => {
  const currentThemeText = context?.currentTheme
    ? `
Current ForgeUI palette:

${JSON.stringify(context.currentTheme, null, 2)}

Use it only as design context. Generate a complete replacement palette.
`
    : ''

  return `
Create a ForgeUI theme based on this request:

${prompt.trim()}
${currentThemeText}
Return the complete theme JSON document.
`.trim()
}