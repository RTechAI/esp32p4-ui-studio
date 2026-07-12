export type ForgeTextureId =
  | 'none'
  | 'dark_noise'
  | 'carbon_fiber'
  | 'brushed_steel'
  | 'hex_mesh'
  | 'blueprint_grid'
  | 'industrial_panel'
  | 'ai_mesh'
  | 'ai_nexus'
  | 'creation'
  | 'nebula_core'
  | 'neon_horizon'
  | 'neural_core'
  | 'quantum_flow'
  | 'quantum_hex'

export type ForgeBorderStyle =
  | 'flat'
  | 'industrial'
  | 'glow'
  | 'soft'
  | 'terminal'

export type ForgePreviewPalette = {
  name: string
  bg: string
  surface: string
  surface2: string
  border: string
  text: string
  accent: string
  texture: ForgeTextureId
  borderStyle: ForgeBorderStyle
}

export const ACTIVE_BACKGROUND_FLAVOUR = 'graphite'

export const FG_PREVIEW_PALETTES = {
  graphite: {
    name: 'Industrial Carbon',
    bg: '#121417',
    surface: '#1E2328',
    surface2: '#2A3138',
    border: '#F2A900',
    text: '#F5F5F5',
    accent: '#F2A900',
    texture: 'carbon_fiber',
    borderStyle: 'industrial',
  },

  industrial_steel: {
    name: 'Brushed Steel',
    bg: '#1F2937',
    surface: '#374151',
    surface2: '#4B5563',
    border: '#9CA3AF',
    text: '#F3F4F6',
    accent: '#9CA3AF',
    texture: 'brushed_steel',
    borderStyle: 'industrial',
  },

  reactor_dark: {
    name: 'Reactor Hex',
    bg: '#08111F',
    surface: '#101B2B',
    surface2: '#162436',
    border: '#42E8FF',
    text: '#FFFFFF',
    accent: '#42E8FF',
    texture: 'hex_mesh',
    borderStyle: 'glow',
  },

  matrix_green: {
    name: 'Terminal Green',
    bg: '#000A00',
    surface: '#001A00',
    surface2: '#003300',
    border: '#00FF66',
    text: '#CCFFDD',
    accent: '#00FF66',
    texture: 'dark_noise',
    borderStyle: 'terminal',
  },

  military_green: {
    name: 'Military Plate',
    bg: '#1B2416',
    surface: '#2D3A25',
    surface2: '#3D4D33',
    border: '#84CC16',
    text: '#F7FEE7',
    accent: '#84CC16',
    texture: 'industrial_panel',
    borderStyle: 'industrial',
  },

  nordic_blue: {
    name: 'Nordic Engineering',
    bg: '#DDE7EF',
    surface: '#F4F8FB',
    surface2: '#D7E5EF',
    border: '#1B6CA8',
    text: '#102030',
    accent: '#1B6CA8',
    texture: 'none',
    borderStyle: 'soft',
  },

  nordic_ice: {
    name: 'Nordic Ice',
    bg: '#EAF4FA',
    surface: '#FFFFFF',
    surface2: '#DCEAF3',
    border: '#7DD3FC',
    text: '#0F172A',
    accent: '#38BDF8',
    texture: 'none',
    borderStyle: 'soft',
  },

  nordic_frost: {
    name: 'Nordic Frost',
    bg: '#F7FBFD',
    surface: '#FFFFFF',
    surface2: '#E6F1F7',
    border: '#94A3B8',
    text: '#0F172A',
    accent: '#06B6D4',
    texture: 'none',
    borderStyle: 'soft',
  },

  nordic_slate: {
    name: 'Nordic Slate',
    bg: '#DCE3E8',
    surface: '#F6F8FA',
    surface2: '#C9D4DC',
    border: '#64748B',
    text: '#1E293B',
    accent: '#0EA5E9',
    texture: 'none',
    borderStyle: 'soft',
  },

  nordic_night: {
    name: 'Nordic Night',
    bg: '#1B2430',
    surface: '#253041',
    surface2: '#344256',
    border: '#60A5FA',
    text: '#F8FAFC',
    accent: '#7DD3FC',
    texture: 'none',
    borderStyle: 'soft',
  },

  control_room: {
    name: 'Control Room',
    bg: '#18222D',
    surface: '#223040',
    surface2: '#2E4156',
    border: '#4FC3F7',
    text: '#EAF6FF',
    accent: '#4FC3F7',
    texture: 'none',
    borderStyle: 'glow',
  },

  cyber_teal: {
    name: 'Cyber Teal Pro',
    bg: '#071A1D',
    surface: '#0F2A30',
    surface2: '#153942',
    border: '#14B8A6',
    text: '#CCFBF1',
    accent: '#14B8A6',
    texture: 'hex_mesh',
    borderStyle: 'glow',
  },

  forge_orange: {
    name: 'Forge Orange',
    bg: '#1A120B',
    surface: '#2B1D14',
    surface2: '#3A281D',
    border: '#F97316',
    text: '#FFF7ED',
    accent: '#F97316',
    texture: 'carbon_fiber',
    borderStyle: 'industrial',
  },

  carbon_red: {
    name: 'Carbon Red',
    bg: '#140809',
    surface: '#2A1012',
    surface2: '#3A181C',
    border: '#EF4444',
    text: '#FEE2E2',
    accent: '#EF4444',
    texture: 'carbon_fiber',
    borderStyle: 'industrial',
  },

  oled_black: {
    name: 'OLED Black Pro',
    bg: '#000000',
    surface: '#0A0A0A',
    surface2: '#1A1A1A',
    border: '#FFFFFF',
    text: '#FFFFFF',
    accent: '#FFFFFF',
    texture: 'dark_noise',
    borderStyle: 'flat',
  },

  test_purple: {
  name: 'Test Purple',
  bg: '#440066',
  surface: '#552288',
  surface2: '#663399',
  border: '#FF00FF',
  text: '#FFFFFF',
  accent: '#FF00FF',
  texture: 'none',
  borderStyle: 'soft',
},

  quantum_hex: {
    name: 'Quantum Hex',
    bg: '#030816',
    surface: '#081225',
    surface2: '#10203A',
    border: '#38BDF8',
    text: '#FFFFFF',
    accent: '#00E5FF',
    texture: 'quantum_hex',
    borderStyle: 'glow',
  },

  ai_mesh: {
    name: 'AI Mesh',
    bg: '#020617',
    surface: '#07152A',
    surface2: '#102A44',
    border: '#38BDF8',
    text: '#E0F2FE',
    accent: '#0EA5E9',
    texture: 'ai_mesh',
    borderStyle: 'glow',
  },

  neural_core: {
    name: 'Neural Core',
    bg: '#05030A',
    surface: '#120824',
    surface2: '#1E1035',
    border: '#D946EF',
    text: '#FFFFFF',
    accent: '#C026D3',
    texture: 'neural_core',
    borderStyle: 'glow',
  },

  quantum_flow: {
    name: 'Quantum Flow',
    bg: '#07031A',
    surface: '#120A2A',
    surface2: '#1E1640',
    border: '#A855F7',
    text: '#F8FAFC',
    accent: '#22D3EE',
    texture: 'quantum_flow',
    borderStyle: 'glow',
  },

  ai_nexus: {
    name: 'AI Nexus',
    bg: '#020817',
    surface: '#071528',
    surface2: '#0F2A44',
    border: '#0EA5E9',
    text: '#E0F2FE',
    accent: '#38BDF8',
    texture: 'ai_nexus',
    borderStyle: 'glow',
  },

  neon_horizon: {
    name: 'Neon Horizon',
    bg: '#0B1020',
    surface: '#131A2E',
    surface2: '#1F2950',
    border: '#FF4FD8',
    text: '#FFFFFF',
    accent: '#7C4DFF',
    texture: 'neon_horizon',
    borderStyle: 'glow',
  },

  nebula_core: {
    name: 'Nebula Core',
    bg: '#070312',
    surface: '#120824',
    surface2: '#1B1036',
    border: '#C026D3',
    text: '#FFFFFF',
    accent: '#E879F9',
    texture: 'nebula_core',
    borderStyle: 'glow',
  },

  singularity: {
    name: 'Singularity',
    bg: '#05020A',
    surface: '#140A1F',
    surface2: '#24113A',
    border: '#FF7A18',
    text: '#FFFFFF',
    accent: '#C026D3',
    texture: 'creation',
    borderStyle: 'glow',
  },

  clean_light: {
    name: 'Clean Light Pro',
    bg: '#F3F4F6',
    surface: '#FFFFFF',
    surface2: '#E5E7EB',
    border: '#2563EB',
    text: '#111827',
    accent: '#2563EB',
    texture: 'none',
    borderStyle: 'soft',
  },
  
} as const

export type ForgeThemeId = keyof typeof FG_PREVIEW_PALETTES

export const getForgePreviewPalette = (
  themeId: ForgeThemeId = ACTIVE_BACKGROUND_FLAVOUR,
) =>
  FG_PREVIEW_PALETTES[themeId] ||
  FG_PREVIEW_PALETTES.reactor_dark