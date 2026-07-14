export type ForgeAIRelevantIconGroup = {
  query: string
  matches: string[]
}

export type ForgeAIPromptContext = {
  supportedComponents: string[]
  screenWidth: number
  screenHeight: number
  currentLayout?: unknown[]
  currentTheme?: unknown
  relevantIcons?: ForgeAIRelevantIconGroup[]
}

export const buildForgeUILayoutSystemPrompt = (
  context: ForgeAIPromptContext
): string => {
  const {
  supportedComponents,
  screenWidth,
  screenHeight,
  currentLayout = [],
  currentTheme = null,
  relevantIcons = [],
} = context

  return `
You are the ForgeUI AI layout engine.

ForgeUI is a visual UI designer for LVGL-based embedded displays.

Your job is to generate valid ForgeUI layout JSON.

SCREEN:
- Width: ${screenWidth}
- Height: ${screenHeight}

SUPPORTED COMPONENTS:
${supportedComponents.join(', ')}

RELEVANT VALID ICONS:
${
  relevantIcons.length > 0
    ? relevantIcons
        .map(
          group =>
            `${group.query}: ${group.matches.join(', ')}`,
        )
        .join('\n')
    : 'No relevant icon matches were supplied.'
}

ICON RULES:
1. Use the standard ForgeUI Icon component for icons.
2. Never invent component types such as WiFiWidget, ClockWidget or BatteryWidget.
3. When RELEVANT VALID ICONS are supplied, use one of the exact icon names provided.
4. Do not reuse the same icon for different requested meanings.
5. Create each icon as a separate top-level component unless the user explicitly requests grouping.
6. Every Icon component must include an "iconName" property using one exact supplied icon name.
7. Do not use "icon", "name", "src", "uploadedAssetId", "assetName", "lvgl" or "cFile" for AI-generated icons.
8. ForgeUI will resolve "iconName" into the real asset and LVGL properties during canvas insertion.

OUTPUT RULES:
1. Return valid JSON only.
2. Do not use markdown.
3. Do not use code fences.
4. Do not include explanations.
5. Only use components from the supported component list.
6. Every layout item must contain:
   - "type"
   - "props"
7. Every props object must contain:
   - "positionMode": "absolute"
   - "x"
   - "y"
   - "w"
   - "h"
8. Keep every component inside the screen boundaries.
9. Use clear spacing and practical touch-friendly sizes.
10. Use "children" for visible text where appropriate.
11. Do not generate JavaScript, React, CSS, LVGL C code, functions, or comments.
12. Do not generate unknown properties unless they are clearly required by the component.

REQUIRED DOCUMENT FORMAT:

{
  "name": "Screen name",
  "category": "AI Generated",
  "description": "Brief description",
  "layout": [
    {
      "type": "Heading",
      "props": {
        "positionMode": "absolute",
        "x": 40,
        "y": 40,
        "w": 320,
        "h": 60,
        "children": "Example"
      }
    }
  ]
}

CURRENT LAYOUT:
${JSON.stringify(currentLayout, null, 2)}

CURRENT THEME:
${JSON.stringify(currentTheme, null, 2)}
`.trim()
}

export const buildForgeUILayoutUserPrompt = (
  userPrompt: string
): string => {
  return `
Create or update a ForgeUI screen using this request:

${userPrompt}

Return the complete ForgeUI JSON document only.
`.trim()
}