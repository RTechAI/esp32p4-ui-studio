export const FORGEUI_IMAGE_ASSETS = [
  {
    name: 'Settings',
    src: '/assets/icons/forgeui-settings-fi.svg',
    lvgl: 'fg_icon_settings_fi_48px',
    cFile: 'assets/icons/fg_icon_settings_fi_48px.c',
    width: 48,
    height: 48,
  },
  {
    name: 'About',
    src: '/assets/icons/48x48 ForgeUI Reactor Set/about-48px.svg',

    lvgl: 'fg_icon_about_48px',

    width: 48,
    height: 48,
  },
]

export type ForgeUIBackgroundAsset = {
  id: string
  name: string
  description: string
  src: string
  width: number
  height: number
  kind: 'background'
  collection:
    | 'ForgeUI Background Collection V1'
    | 'ForgeUI Background Library V2'
  category: ForgeUIBackgroundCategory
  colorFamily: string
  themeType: 'dark' | 'light'
  tags: string[]
  recommendedUses: string[]
}

export const FORGEUI_BACKGROUND_CATEGORIES = [
  'Dark',
  'Pastel',
  'Coloured Dark',
  'Technical',
  'Swirl',
  'Gradient',
  'Texture',
  'Light',
] as const

export type ForgeUIBackgroundCategory = typeof FORGEUI_BACKGROUND_CATEGORIES[number]

const backgroundV1 = (
  id: string,
  name: string,
  description: string,
  category: ForgeUIBackgroundCategory = 'Dark',
): ForgeUIBackgroundAsset => ({
  id: `forgeui-background-v1-${id}`,
  name,
  description,
  src: `/assets/backgrounds/forgeui-v1/${id}.png`,
  width: 1920,
  height: 1080,
  kind: 'background',
  collection: 'ForgeUI Background Collection V1',
  category,
  colorFamily: 'graphite',
  themeType: 'dark',
  tags: ['dark', 'industrial', 'minimal', 'premium'],
  recommendedUses: ['industrial', 'SCADA', 'energy', 'automation'],
})

// Bundled bitmap assets. They deliberately remain ordinary registry images so
// consumers can use the existing Image Pipeline without a background subsystem.
export const FORGEUI_BACKGROUND_COLLECTION_V1: ForgeUIBackgroundAsset[] = [
  backgroundV1(
    'industrial-carbon',
    'Industrial Carbon',
    'Soft graphite with a restrained carbon texture.',
  ),
  backgroundV1(
    'graphite-swirl',
    'Graphite Swirl',
    'A broad, low-contrast radial graphite movement.',
  ),
  backgroundV1(
    'engineering-gradient',
    'Engineering Gradient',
    'Dark charcoal fading through muted blue-grey.',
  ),
  backgroundV1(
    'brushed-steel',
    'Brushed Steel',
    'Soft, non-reflective horizontal steel grain.',
  ),
  backgroundV1(
    'blueprint',
    'Blueprint',
    'Dark blue-grey with an extremely faint engineering grid.',
  ),
  backgroundV1(
    'circuit',
    'Circuit',
    'Near-invisible PCB traces on deep graphite.',
  ),
  backgroundV1(
    'hex-mesh',
    'Hex Mesh',
    'Large, soft hex geometry at very low contrast.',
  ),
  backgroundV1(
    'soft-waves',
    'Soft Waves',
    'Gentle, non-repeating blue-grey tonal curves.',
  ),
  backgroundV1(
    'frosted-slate',
    'Frosted Slate',
    'Diffuse cloudy slate with a professional mineral finish.',
  ),
  backgroundV1(
    'dark-concrete',
    'Dark Concrete',
    'Clean architectural charcoal with fine concrete grain.',
  ),
  backgroundV1(
    'glow-horizon',
    'Glow Horizon',
    'A quiet blue-grey horizon glow without a visible source.',
  ),
  backgroundV1(
    'minimal-matte',
    'Minimal Matte',
    'An almost-flat charcoal field with microscopic texture.',
  ),
]

type BackgroundV2Definition = {
  id: string
  name: string
  description: string
  category: ForgeUIBackgroundCategory
  colorFamily: string
  themeType: 'dark' | 'light'
  tags: string[]
  recommendedUses: string[]
}

const backgroundV2 = ({
  id,
  name,
  description,
  category,
  colorFamily,
  themeType,
  tags,
  recommendedUses,
}: BackgroundV2Definition): ForgeUIBackgroundAsset => ({
  id: `forgeui-background-v2-${id}`,
  name,
  description,
  src: `/assets/backgrounds/forgeui-v2/${id}.png`,
  width: 1024,
  height: 600,
  kind: 'background',
  collection: 'ForgeUI Background Library V2',
  category,
  colorFamily,
  themeType,
  tags,
  recommendedUses,
})

const v2 = (
  category: ForgeUIBackgroundCategory,
  themeType: 'dark' | 'light',
  recommendedUses: string[],
  definitions: Array<[string, string, string, string, string[]]>,
) =>
  definitions.map(([id, name, description, colorFamily, tags]) =>
    backgroundV2({
      id,
      name,
      description,
      category,
      colorFamily,
      themeType,
      tags: [category.toLowerCase().replace(' ', '-'), 'premium', ...tags],
      recommendedUses,
    }),
  )

export const FORGEUI_BACKGROUND_COLLECTION_V2: ForgeUIBackgroundAsset[] = [
  ...v2(
    'Dark',
    'dark',
    ['industrial', 'SCADA', 'marine', 'energy'],
    [
      [
        'dark-graphite-black-radial',
        'Graphite Black',
        'Near-black graphite with restrained radial depth.',
        'graphite',
        ['dark', 'minimal'],
      ],
      [
        'dark-deep-charcoal-matte',
        'Deep Charcoal',
        'Deep charcoal with a quiet premium matte finish.',
        'charcoal',
        ['dark', 'minimal'],
      ],
      [
        'dark-slate-night-horizon',
        'Slate Night',
        'Night slate with a soft low horizon lift.',
        'slate',
        ['dark', 'marine'],
      ],
      [
        'dark-steel-blue-brushed',
        'Steel Blue',
        'Muted steel-blue with subtle brushed grain.',
        'steel-blue',
        ['dark', 'industrial'],
      ],
      [
        'dark-smoked-titanium-flow',
        'Smoked Titanium',
        'Smoked titanium with broad tonal movement.',
        'titanium',
        ['dark', 'industrial'],
      ],
    ],
  ),
  ...v2(
    'Pastel',
    'light',
    ['smart-home', 'wellness', 'environmental', 'modern'],
    [
      [
        'pastel-powder-blue-matte',
        'Powder Blue Matte',
        'Muted powder-blue matte surface.',
        'blue',
        ['pastel', 'soft'],
      ],
      [
        'pastel-mist-cyan-frosted',
        'Mist Cyan Frosted',
        'Desaturated cyan with diffuse frosted texture.',
        'cyan',
        ['pastel', 'soft'],
      ],
      [
        'pastel-soft-lavender-flow',
        'Soft Lavender Flow',
        'Dusty lavender-grey with a broad soft flow.',
        'lavender',
        ['pastel', 'soft'],
      ],
      [
        'pastel-sage-green-gradient',
        'Sage Green Gradient',
        'Pale sage-grey with continuous tonal depth.',
        'sage',
        ['pastel', 'soft'],
      ],
      [
        'pastel-warm-cream-paper',
        'Warm Cream Paper',
        'Warm cream with extremely fine paper grain.',
        'cream',
        ['pastel', 'soft'],
      ],
    ],
  ),
  ...v2(
    'Coloured Dark',
    'dark',
    ['industrial', 'automation', 'marine', 'energy'],
    [
      [
        'coloured-dark-midnight-cyan',
        'Midnight Cyan',
        'Blue-charcoal with a muted cyan edge identity.',
        'cyan',
        ['dark', 'modern'],
      ],
      [
        'coloured-dark-teal-horizon',
        'Teal Horizon',
        'Graphite-teal with a restrained horizon glow.',
        'teal',
        ['dark', 'marine'],
      ],
      [
        'coloured-dark-amber-corner',
        'Amber Industrial',
        'Charcoal with subdued amber-grey warmth.',
        'amber',
        ['dark', 'industrial'],
      ],
      [
        'coloured-dark-oxide-red',
        'Oxide Red',
        'Smoked graphite with a muted oxide-red undertone.',
        'red',
        ['dark', 'industrial'],
      ],
      [
        'coloured-dark-plum-steel',
        'Plum Steel',
        'Steel-grey with desaturated plum depth.',
        'purple',
        ['dark', 'modern'],
      ],
    ],
  ),
  ...v2(
    'Technical',
    'dark',
    ['engineering', 'SCADA', 'automation', 'energy'],
    [
      [
        'technical-slate-fine-circuit-lines',
        'Fine Circuit Lines',
        'Sparse fine circuit routes on dark slate.',
        'slate',
        ['technical', 'engineering'],
      ],
      [
        'technical-navy-wide-traces',
        'Wide Circuit Traces',
        'Broad subdued circuit paths on deep navy.',
        'navy',
        ['technical', 'engineering'],
      ],
      [
        'technical-blue-grey-coordinate-grid',
        'Coordinate Grid',
        'A faint major and minor blue-grey grid.',
        'blue-grey',
        ['technical', 'engineering'],
      ],
      [
        'technical-graphite-crosshair-field',
        'Engineering Crosshair',
        'Sparse registration marks on graphite.',
        'graphite',
        ['technical', 'engineering'],
      ],
      [
        'technical-steel-data-flow-lines',
        'Data Flow Lines',
        'Faint curving signal routes on steel charcoal.',
        'steel',
        ['technical', 'engineering'],
      ],
    ],
  ),
  ...v2(
    'Swirl',
    'dark',
    ['modern', 'marine', 'smart-home', 'energy'],
    [
      [
        'swirl-graphite-slow-flow',
        'Graphite Slow Flow',
        'An enormous quiet graphite tonal curve.',
        'graphite',
        ['soft', 'minimal'],
      ],
      [
        'swirl-blue-grey-broad',
        'Blue-Grey Swirl',
        'Broad diffuse blue-grey movement.',
        'blue-grey',
        ['soft', 'marine'],
      ],
      [
        'swirl-soft-teal-flow',
        'Soft Teal Flow',
        'Two large muted teal-grey flowing layers.',
        'teal',
        ['soft', 'modern'],
      ],
      [
        'swirl-lavender-slate-flow',
        'Lavender Slate Flow',
        'Desaturated lavender and slate curves.',
        'lavender',
        ['soft', 'modern'],
      ],
      [
        'swirl-warm-sand-flow',
        'Warm Sand Flow',
        'A gentle expansive warm sand-grey band.',
        'sand',
        ['soft', 'modern'],
      ],
    ],
  ),
  ...v2(
    'Gradient',
    'light',
    ['modern', 'smart-home', 'environmental', 'energy'],
    [
      [
        'gradient-graphite-slate-diagonal',
        'Graphite to Slate',
        'A restrained dark diagonal transition.',
        'graphite',
        ['minimal', 'dark'],
      ],
      [
        'gradient-navy-blue-grey-horizon',
        'Navy to Blue-Grey',
        'A calm deep navy horizon transition.',
        'navy',
        ['marine', 'dark'],
      ],
      [
        'gradient-teal-steel-radial',
        'Teal to Steel',
        'Muted teal-grey with soft steel depth.',
        'teal',
        ['modern', 'soft'],
      ],
      [
        'gradient-rose-grey-cream',
        'Rose-Grey to Cream',
        'Muted rose-grey blending into warm cream.',
        'rose',
        ['soft', 'light'],
      ],
      [
        'gradient-sage-mist-corner',
        'Sage to Mist',
        'Desaturated sage fading into mist-grey.',
        'sage',
        ['soft', 'light'],
      ],
    ],
  ),
  ...v2(
    'Texture',
    'dark',
    ['industrial', 'SCADA', 'automation', 'modern'],
    [
      [
        'texture-soft-carbon-graphite',
        'Soft Carbon',
        'Near-flat graphite with a fine carbon texture.',
        'graphite',
        ['industrial', 'dark'],
      ],
      [
        'texture-fine-concrete-grey',
        'Fine Concrete',
        'Clean charcoal-grey with restrained concrete grain.',
        'grey',
        ['industrial', 'dark'],
      ],
      [
        'texture-powder-coated-steel',
        'Powder-Coated Steel',
        'Steel-blue with microscopic powder-coated texture.',
        'steel',
        ['industrial', 'dark'],
      ],
      [
        'texture-matte-ceramic-slate',
        'Matte Ceramic',
        'Slate with diffuse ceramic-like smoothness.',
        'slate',
        ['minimal', 'dark'],
      ],
      [
        'texture-smoked-glass-blue',
        'Smoked Glass',
        'Deep blue-grey with a low-reflection glass impression.',
        'blue',
        ['modern', 'dark'],
      ],
    ],
  ),
  ...v2(
    'Light',
    'light',
    ['smart-home', 'wellness', 'environmental', 'modern'],
    [
      [
        'light-soft-white-matte',
        'Soft White Matte',
        'Warm off-white with subtle cool-grey depth.',
        'white',
        ['light', 'minimal'],
      ],
      [
        'light-pearl-grey-frosted',
        'Pearl Grey Frosted',
        'Pearl-grey with restrained frosted texture.',
        'grey',
        ['light', 'soft'],
      ],
      [
        'light-steel-blue-gradient',
        'Light Steel Blue',
        'Pale steel-blue with a gentle gradient.',
        'steel-blue',
        ['light', 'modern'],
      ],
      [
        'light-cloud-blue-haze',
        'Cloud Blue Haze',
        'Continuous desaturated blue with diffuse depth.',
        'blue',
        ['light', 'soft'],
      ],
      [
        'light-soft-sand-paper',
        'Soft Sand Paper',
        'Warm sand-grey with microscopic paper grain.',
        'sand',
        ['light', 'soft'],
      ],
    ],
  ),
]

export const FORGEUI_BACKGROUND_ASSETS = [
  ...FORGEUI_BACKGROUND_COLLECTION_V1,
  ...FORGEUI_BACKGROUND_COLLECTION_V2,
]

FORGEUI_IMAGE_ASSETS.forEach((asset: any) => {
  if (!asset.cFile && asset.lvgl) {
    asset.cFile = `assets/icons/${asset.lvgl}.c`
  }
})
