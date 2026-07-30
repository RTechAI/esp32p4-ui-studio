import {
  forgeAIComponentCatalogue,
} from './ForgeAIComponentCatalogue'
import type {
  ForgeAILayoutDocument,
} from './ForgeAIParser'

// Developer-only deterministic fixture. Multiple documents are used because the
// live AI document format represents one flat 1024x600 screen.
export const buildForgeAIAllAssetsCoverageFixture = (
  columns = 4,
  rows = 3,
): ForgeAILayoutDocument[] => {
  const pageSize = columns * rows

  return Array.from({
    length: Math.ceil(forgeAIComponentCatalogue.length / pageSize),
  }, (_, pageIndex) => ({
    name: `All Assets Coverage ${pageIndex + 1}`,
    category: 'Developer Coverage',
    description: 'Generated from the authoritative AI component catalogue.',
    layout: forgeAIComponentCatalogue
      .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
      .map((entry, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        const cellWidth = Math.floor(1024 / columns)
        const cellHeight = Math.floor(600 / rows)
        return {
          type: entry.type,
          props: {
            ...entry.defaultProps,
            positionMode: 'absolute',
            x: column * cellWidth + 12,
            y: row * cellHeight + 12,
            w: Math.min(entry.defaultSize.w, cellWidth - 24),
            h: Math.min(entry.defaultSize.h, cellHeight - 24),
          },
        }
      }),
  }))
}

export const forgeAIRepresentativeLayouts: ForgeAILayoutDocument[] = [
  {
    name: 'Representative Form',
    category: 'Developer Coverage',
    description: 'Standard form controls and canonical serialized properties.',
    layout: [
      { type: 'Heading', props: { x: 40, y: 30, w: 320, h: 56, children: 'Settings' } },
      { type: 'Input', props: { x: 40, y: 110, w: 260, h: 48 } },
      { type: 'NumberInput', props: { x: 40, y: 180, w: 180, h: 56, min: 0, max: 10, value: 5, step: 1 } },
      { type: 'Select', props: { x: 40, y: 260, w: 220, h: 48, options: ['Auto', 'Manual'], selectedIndex: 0 } },
      { type: 'Switch', props: { x: 40, y: 330, w: 64, h: 36, isChecked: false } },
    ],
  },
  {
    name: 'Representative Dashboard',
    category: 'Developer Coverage',
    description: 'Output widgets and status presentation.',
    layout: [
      { type: 'CircularProgress', props: { x: 40, y: 50, w: 140, h: 140, min: 0, max: 100, value: 60 } },
      { type: 'Progress', props: { x: 220, y: 80, w: 280, h: 24, min: 0, max: 100, value: 70 } },
      { type: 'Chart', props: { x: 540, y: 50, w: 400, h: 260 } },
      { type: 'Table', props: { x: 40, y: 330, w: 900, h: 220 } },
    ],
  },
  {
    name: 'Representative Navigation',
    category: 'Developer Coverage',
    description: 'Native navigation and action widgets.',
    layout: [
      { type: 'Tabview', props: { x: 30, y: 30, w: 600, h: 520 } },
      { type: 'Button', props: { x: 700, y: 80, w: 180, h: 48, children: 'Continue' } },
      { type: 'Divider', props: { x: 680, y: 150, w: 240, h: 2 } },
      { type: 'IconButton', props: { x: 740, y: 190, w: 64, h: 64 } },
    ],
  },
]
