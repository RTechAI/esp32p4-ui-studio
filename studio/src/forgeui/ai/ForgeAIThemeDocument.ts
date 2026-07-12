import { ForgePreviewPalette } from '../preview/forgeThemeMap'

export type ForgeAIThemeDocument = {
  name: string
  description: string
  palette: ForgePreviewPalette

  hero?: {
    prompt: string
    assetId?: string
    browserSrc?: string
  }
}