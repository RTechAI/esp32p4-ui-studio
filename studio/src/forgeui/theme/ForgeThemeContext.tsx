import React, {
  createContext,
  useContext,
  useEffect,
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
  setCustomPalette: (
    palette: ForgePreviewPalette | null,
  ) => void

  heroBackground: string | null
  setHeroBackground: (src: string | null) => void

  palette: ForgePreviewPalette
  isCustomTheme: boolean
}

type PersistedForgeTheme = {
  themeId: ForgeThemeId
  customPalette: ForgePreviewPalette | null
  heroBackground: string | null
}

const FORGEUI_THEME_STORAGE_KEY =
  'forgeui_active_theme_v1'

const ForgeThemeContext =
  createContext<ForgeThemeContextValue | null>(null)

export const ForgeThemeProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [themeId, setThemeIdState] =
    useState<ForgeThemeId>('neural_core')

  const [customPalette, setCustomPaletteState] =
    useState<ForgePreviewPalette | null>(null)

  const [heroBackground, setHeroBackground] =
    useState<string | null>(null)

  const [themeRestored, setThemeRestored] =
    useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(
        FORGEUI_THEME_STORAGE_KEY,
      )

      if (raw) {
        const saved =
          JSON.parse(raw) as Partial<PersistedForgeTheme>

        if (
          saved.themeId &&
          saved.themeId in FG_PREVIEW_PALETTES
        ) {
          setThemeIdState(saved.themeId)
        }

        if (saved.customPalette) {
          setCustomPaletteState(
            saved.customPalette,
          )
        }

        if (
          typeof saved.heroBackground === 'string'
        ) {
          setHeroBackground(
            saved.heroBackground,
          )
        }
      }
    } catch (err) {
      console.error(
        'Failed to restore ForgeUI theme:',
        err,
      )
    } finally {
      setThemeRestored(true)
    }
  }, [])

  useEffect(() => {
    if (!themeRestored) {
      return
    }

    try {
      const saved: PersistedForgeTheme = {
        themeId,
        customPalette,
        heroBackground,
      }

      window.localStorage.setItem(
        FORGEUI_THEME_STORAGE_KEY,
        JSON.stringify(saved),
      )
    } catch (err) {
      console.error(
        'Failed to persist ForgeUI theme:',
        err,
      )
    }
  }, [
    themeId,
    customPalette,
    heroBackground,
    themeRestored,
  ])

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
    customPalette ??
    FG_PREVIEW_PALETTES[themeId] ??
    FG_PREVIEW_PALETTES.reactor_dark

  return (
    <ForgeThemeContext.Provider
      value={{
        themeId,
        setThemeId,
        customPalette,
        setCustomPalette,
        heroBackground,
        setHeroBackground,
        palette,
        isCustomTheme:
          customPalette !== null,
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