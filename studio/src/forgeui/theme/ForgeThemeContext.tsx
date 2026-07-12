import React, {
  createContext,
  useContext,
  useState,
} from 'react'

import {
  FG_PREVIEW_PALETTES,
  ForgePreviewPalette,
  ForgeThemeId,
} from '~forgeui/preview/forgeThemeMap'

type ForgeThemeContextValue = {
  themeId: ForgeThemeId
  setThemeId: (id: ForgeThemeId) => void

  customPalette: ForgePreviewPalette | null
  setCustomPalette: (palette: ForgePreviewPalette | null) => void

  palette: ForgePreviewPalette
  isCustomTheme: boolean
}

const ForgeThemeContext =
  createContext<ForgeThemeContextValue | null>(null)

export const ForgeThemeProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [themeId, setThemeIdState] =
    useState<ForgeThemeId>('neural_core')

  const [customPalette, setCustomPaletteState] =
    useState<ForgePreviewPalette | null>(null)

  const setThemeId = (id: ForgeThemeId) => {
    setThemeIdState(id)
    setCustomPaletteState(null)
  }

  const setCustomPalette = (
    palette: ForgePreviewPalette | null,
  ) => {
    setCustomPaletteState(palette)
  }

  const palette =
    customPalette ?? FG_PREVIEW_PALETTES[themeId]

  return (
    <ForgeThemeContext.Provider
      value={{
        themeId,
        setThemeId,
        customPalette,
        setCustomPalette,
        palette,
        isCustomTheme: customPalette !== null,
      }}
    >
      {children}
    </ForgeThemeContext.Provider>
  )
}

export const useForgeTheme = () => {
  const ctx = useContext(ForgeThemeContext)

  if (!ctx) {
    throw new Error(
      'useForgeTheme must be used inside ForgeThemeProvider',
    )
  }

  return ctx
}