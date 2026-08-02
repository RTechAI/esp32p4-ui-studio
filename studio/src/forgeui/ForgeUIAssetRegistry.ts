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
    | 'ForgeUI Background Collection V3'
  category: ForgeUIBackgroundCategory
  colorFamily: string
  themeType: 'dark' | 'light'
  tags: string[]
  recommendedUses: string[]
}

export const FORGEUI_BACKGROUND_V2_CATEGORIES = [
  'Dark',
  'Pastel',
  'Coloured Dark',
  'Technical',
  'Swirl',
  'Gradient',
  'Texture',
  'Light',
] as const

export const FORGEUI_BACKGROUND_V3_CATEGORIES = [
  'Cyber Blue',
  'Cyber Purple',
  'Cyber Cyan',
  'Emerald Tech',
  'Amber Energy',
  'Crimson Core',
  'Arctic Light',
  'Pastel Future',
  'Lighter Tech',
] as const

export const FORGEUI_BACKGROUND_CATEGORIES = [
  ...FORGEUI_BACKGROUND_V2_CATEGORIES,
  ...FORGEUI_BACKGROUND_V3_CATEGORIES,
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

type BackgroundV3Definition = [string, string, string, string]

const v3 = (
  category: ForgeUIBackgroundCategory,
  themeType: 'dark' | 'light',
  definitions: BackgroundV3Definition[],
) =>
  definitions
    .map(([id, name, description, colorFamily]) =>
      backgroundV2({
        id,
        name,
        description,
        category,
        colorFamily,
        themeType,
        tags: [
          'premium-tech',
          'cyber-industrial',
          themeType,
          category.toLowerCase().replace(/\s+/g, '-'),
        ],
        recommendedUses: [
          'automotive',
          'aerospace',
          'SCADA',
          'AI-infrastructure',
        ],
      }),
    )
    .map(asset => ({
      ...asset,
      id: asset.id.replace('forgeui-background-v2-', 'forgeui-background-v3-'),
      src: asset.src.replace('/forgeui-v2/', '/forgeui-v3/'),
      collection: 'ForgeUI Background Collection V3' as const,
    }))

export const FORGEUI_BACKGROUND_COLLECTION_V3: ForgeUIBackgroundAsset[] = [
  ...v3('Cyber Blue', 'dark', [
    [
      'cyber-blue-edge-routes',
      'Blue Edge Routes',
      'Ice-cyan routing channels frame deep navy.',
      'blue',
    ],
    [
      'cyber-blue-fibre-diagonal',
      'Blue Fibre Diagonal',
      'Electric-blue fibre ribbons sweep around calm card space.',
      'blue',
    ],
    [
      'cyber-blue-hud-arcs',
      'Blue HUD Arcs',
      'Fine partial HUD arcs emerge from opposing corners.',
      'ice-blue',
    ],
    [
      'cyber-blue-node-network',
      'Blue Node Perimeter',
      'A sparse illuminated node network remains at the perimeter.',
      'cyan-blue',
    ],
    [
      'cyber-blue-layered-geometry',
      'Blue Layered Geometry',
      'Translucent navy planes carry precise cyan edges.',
      'navy',
    ],
    [
      'cyber-blue-signal-horizon',
      'Blue Signal Horizon',
      'A restrained low signal horizon crosses graphite navy.',
      'electric-blue',
    ],
  ]),
  ...v3('Cyber Purple', 'dark', [
    [
      'cyber-purple-indigo-routes',
      'Indigo Routes',
      'Violet routing channels and muted magenta nodes.',
      'indigo',
    ],
    [
      'cyber-purple-fibre-arc',
      'Purple Fibre Arc',
      'A broad translucent violet fibre arc.',
      'violet',
    ],
    [
      'cyber-purple-hud-rings',
      'Purple HUD Rings',
      'Fine indigo ring segments remain in the corners.',
      'purple',
    ],
    [
      'cyber-purple-network-veil',
      'Purple Network Veil',
      'A sparse node lattice fades around the central field.',
      'indigo',
    ],
    [
      'cyber-purple-magenta-horizon',
      'Magenta Horizon',
      'A subdued violet-magenta horizon accents deep blue.',
      'magenta',
    ],
    [
      'cyber-purple-layered-wireframe',
      'Purple Wireframe',
      'Offset translucent planes use lavender edge lines.',
      'lavender',
    ],
  ]),
  ...v3('Cyber Cyan', 'dark', [
    [
      'cyber-cyan-graphite-traces',
      'Cyan Graphite Traces',
      'Fine cyan PCB traces fade into graphite edges.',
      'cyan',
    ],
    [
      'cyber-cyan-digital-highway',
      'Cyan Digital Highway',
      'Layered signal buses flow along the lower third.',
      'cyan',
    ],
    [
      'cyber-cyan-hex-depth',
      'Cyan Hex Depth',
      'A large faint teal hex mesh recedes into one side.',
      'teal',
    ],
    [
      'cyber-cyan-scan-overlay',
      'Cyan Scan Overlay',
      'Fine scan lines cross translucent offset geometry.',
      'cyan-teal',
    ],
    [
      'cyber-cyan-node-stream',
      'Cyan Node Stream',
      'A sparse node stream follows a peripheral curve.',
      'cyan',
    ],
    [
      'cyber-cyan-glass-ribbons',
      'Cyan Glass Ribbons',
      'Broad translucent ribbons frame a quiet centre.',
      'cyan-blue',
    ],
  ]),
  ...v3('Emerald Tech', 'dark', [
    [
      'emerald-tech-routing',
      'Emerald Routing',
      'Elegant emerald paths and mint nodes frame graphite.',
      'emerald',
    ],
    [
      'emerald-tech-energy-flow',
      'Emerald Energy Flow',
      'A broad green energy ribbon follows the lower third.',
      'green',
    ],
    [
      'emerald-tech-radial-arcs',
      'Emerald Radial Arcs',
      'Fine partial mint HUD arcs enter from a corner.',
      'emerald',
    ],
    [
      'emerald-tech-network-grid',
      'Emerald Network Grid',
      'A sparse mint node grid fades around clear card space.',
      'mint',
    ],
    [
      'emerald-tech-hex-channel',
      'Emerald Hex Channel',
      'A faint hex mesh meets one curved signal channel.',
      'emerald',
    ],
    [
      'emerald-tech-layered-glass',
      'Emerald Layered Glass',
      'Low-contrast mint glass planes stay at the corners.',
      'mint-green',
    ],
  ]),
  ...v3('Amber Energy', 'dark', [
    [
      'amber-energy-bronze-routes',
      'Bronze Routes',
      'Refined amber routing channels frame charcoal bronze.',
      'bronze',
    ],
    [
      'amber-energy-gold-ribbon',
      'Gold Energy Ribbon',
      'A broad muted-gold ribbon follows the lower third.',
      'gold',
    ],
    [
      'amber-energy-hud-arcs',
      'Amber HUD Arcs',
      'Fine amber arc segments enter from a corner.',
      'amber',
    ],
    [
      'amber-energy-node-chain',
      'Amber Node Chain',
      'Soft nodes and dotted paths follow a diagonal edge.',
      'amber',
    ],
    [
      'amber-energy-layered-alloy',
      'Layered Alloy',
      'Offset titanium-bronze geometry uses warm edge light.',
      'bronze',
    ],
    [
      'amber-energy-signal-horizon',
      'Amber Signal Horizon',
      'A low amber band branches into fine traces.',
      'amber-gold',
    ],
  ]),
  ...v3('Crimson Core', 'dark', [
    [
      'crimson-core-burgundy-routes',
      'Burgundy Routes',
      'Muted burgundy routes frame very dark charcoal.',
      'burgundy',
    ],
    [
      'crimson-core-signal-ribbon',
      'Crimson Signal Ribbon',
      'A deep-red translucent ribbon stays below card space.',
      'crimson',
    ],
    [
      'crimson-core-hud-segments',
      'Crimson HUD Segments',
      'Fine ring segments occupy opposing corners.',
      'crimson',
    ],
    [
      'crimson-core-node-mesh',
      'Burgundy Node Mesh',
      'A sparse node mesh fades before the centre.',
      'burgundy',
    ],
    [
      'crimson-core-layered-geometry',
      'Crimson Geometry',
      'Deep-wine planes carry restrained red edge lighting.',
      'deep-red',
    ],
    [
      'crimson-core-horizon-traces',
      'Crimson Horizon Traces',
      'A low crimson horizon branches into digital traces.',
      'crimson',
    ],
  ]),
  ...v3('Arctic Light', 'light', [
    [
      'arctic-light-ice-routes',
      'Arctic Ice Routes',
      'Fine ice-blue routes frame pearl grey.',
      'ice-blue',
    ],
    [
      'arctic-light-glass-ribbon',
      'Arctic Glass Ribbon',
      'A faint pale-blue ribbon rests along the bottom edge.',
      'pearl-blue',
    ],
    [
      'arctic-light-hud-arcs',
      'Arctic HUD Arcs',
      'Barely visible HUD arcs enter from light corners.',
      'ice-blue',
    ],
    [
      'arctic-light-node-veil',
      'Arctic Node Veil',
      'A delicate blue node veil surrounds clean card space.',
      'cool-grey',
    ],
    [
      'arctic-light-layered-glass',
      'Arctic Layered Glass',
      'Translucent glass planes use thin blue-grey edges.',
      'pearl',
    ],
    [
      'arctic-light-signal-horizon',
      'Arctic Signal Horizon',
      'A quiet ice-blue horizon crosses pale steel.',
      'steel-blue',
    ],
  ]),
  ...v3('Pastel Future', 'light', [
    [
      'pastel-future-cyan-routes',
      'Pastel Cyan Routes',
      'Fine cool-blue routes frame soft cyan pearl.',
      'soft-cyan',
    ],
    [
      'pastel-future-powder-network',
      'Powder Network',
      'A translucent lavender network crosses powder blue edges.',
      'powder-blue',
    ],
    [
      'pastel-future-lavender-ribbon',
      'Lavender Future Ribbon',
      'A mint-tinted glass ribbon floats over lavender pearl.',
      'lavender',
    ],
    [
      'pastel-future-mint-geometry',
      'Mint Future Geometry',
      'Pearl geometry carries restrained cyan edge lines.',
      'mint',
    ],
    [
      'pastel-future-rose-hud',
      'Rose Future HUD',
      'Lavender HUD arcs rest over soft rose pearl.',
      'rose',
    ],
    [
      'pastel-future-pearl-signals',
      'Pearl Signal Paths',
      'Pastel dotted signal paths trace a luminous perimeter.',
      'pearl',
    ],
  ]),
  ...v3('Lighter Tech', 'light', [
    [
      'cyber-blue-light-glass',
      'Light Cyber Blue Glass',
      'A bright blue-grey glass field with hairline routes.',
      'light-blue',
    ],
    [
      'cyber-cyan-light-network',
      'Light Cyber Cyan Network',
      'A pale cyan pearl surface with sparse teal nodes.',
      'light-cyan',
    ],
    [
      'emerald-tech-light-mint',
      'Light Emerald Mint',
      'Light mint-grey with delicate emerald corner arcs.',
      'light-mint',
    ],
    [
      'cyber-purple-light-indigo',
      'Light Cyber Purple',
      'Lavender-indigo pearl with muted magenta edge lines.',
      'light-purple',
    ],
  ]),
]

export const FORGEUI_BACKGROUND_ASSETS = [
  ...FORGEUI_BACKGROUND_COLLECTION_V1,
  ...FORGEUI_BACKGROUND_COLLECTION_V2,
  ...FORGEUI_BACKGROUND_COLLECTION_V3,
]

FORGEUI_IMAGE_ASSETS.forEach((asset: any) => {
  if (!asset.cFile && asset.lvgl) {
    asset.cFile = `assets/icons/${asset.lvgl}.c`
  }
})
