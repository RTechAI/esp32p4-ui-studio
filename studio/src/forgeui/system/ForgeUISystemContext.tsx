import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

export type ForgeUISystemPage =
  | 'launcher'
  | 'brightness'
  | 'wifi'
  | 'bluetooth'
  | 'sound'
  | 'storage'
  | 'device'
  | 'diagnostics'

type ForgeUISystemContextValue = {
  isOpen: boolean
  page: ForgeUISystemPage
  brightness: number
  openSystemLauncher: () => void
  openSystemPage: (page: ForgeUISystemPage) => void
  closeSystemInterface: () => void
  goBackInSystemInterface: () => void
  setBrightness: (value: number) => void
}

const ForgeUISystemContext =
  createContext<ForgeUISystemContextValue | null>(null)

export const ForgeUISystemProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] =
    useState<ForgeUISystemPage>('launcher')
  const [brightness, setBrightnessState] = useState(100)

  const value = useMemo<ForgeUISystemContextValue>(
    () => ({
      isOpen,
      page,
      brightness,
      openSystemLauncher: () => {
        setPage('launcher')
        setIsOpen(true)
      },
      openSystemPage: nextPage => {
        if (nextPage !== 'brightness') return
        setPage(nextPage)
        setIsOpen(true)
      },
      closeSystemInterface: () => {
        setIsOpen(false)
        setPage('launcher')
      },
      goBackInSystemInterface: () => {
        if (page === 'launcher') {
          setIsOpen(false)
          return
        }
        setPage('launcher')
      },
      setBrightness: value => {
        setBrightnessState(
          Math.min(100, Math.max(10, Math.round(value))),
        )
      },
    }),
    [brightness, isOpen, page],
  )

  return (
    <ForgeUISystemContext.Provider value={value}>
      {children}
    </ForgeUISystemContext.Provider>
  )
}

export const useForgeUISystem = () => {
  const context = useContext(ForgeUISystemContext)
  if (!context) {
    throw new Error(
      'useForgeUISystem must be used inside ForgeUISystemProvider',
    )
  }
  return context
}
