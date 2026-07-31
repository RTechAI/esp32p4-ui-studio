import { useCallback, useEffect, useState } from 'react'
import { ForgeUIProjectHardware } from './ForgeUIBoardProfile'
import { normalizeProjectHardware } from './ForgeUIBoardRegistry'

export const FORGEUI_PROJECT_HARDWARE_STORAGE_KEY = 'forgeui-project-hardware-v1'
export const FORGEUI_PROJECT_HARDWARE_CHANGED_EVENT =
  'forgeui-project-hardware-changed'

export const loadForgeUIProjectHardware = (): ForgeUIProjectHardware => {
  if (typeof window === 'undefined') return normalizeProjectHardware()
  try {
    const value = window.localStorage.getItem(FORGEUI_PROJECT_HARDWARE_STORAGE_KEY)
    return normalizeProjectHardware(value ? JSON.parse(value) : undefined)
  } catch {
    return normalizeProjectHardware()
  }
}

export const saveForgeUIProjectHardware = (project: ForgeUIProjectHardware) => {
  const normalized = normalizeProjectHardware(project)
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      FORGEUI_PROJECT_HARDWARE_STORAGE_KEY,
      JSON.stringify(normalized),
    )
  }
  return normalized
}

export const useForgeUIProjectHardware = () => {
  // This value must remain identical during SSR and the browser's first
  // hydration render. Persisted state is deliberately applied after mount.
  const [project, setProject] = useState<ForgeUIProjectHardware>(
    normalizeProjectHardware,
  )
  const [hydrated, setHydrated] = useState(false)

  const refresh = useCallback(() => {
    setProject(loadForgeUIProjectHardware())
    setHydrated(true)
  }, [])

  useEffect(() => {
    refresh()
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === FORGEUI_PROJECT_HARDWARE_STORAGE_KEY
      ) {
        refresh()
      }
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener(FORGEUI_PROJECT_HARDWARE_CHANGED_EVENT, refresh)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(FORGEUI_PROJECT_HARDWARE_CHANGED_EVENT, refresh)
    }
  }, [refresh])

  const update = useCallback((next: ForgeUIProjectHardware) => {
    const saved = saveForgeUIProjectHardware(next)
    setProject(saved)
    setHydrated(true)
  }, [])

  return { project, update, refresh, hydrated }
}
