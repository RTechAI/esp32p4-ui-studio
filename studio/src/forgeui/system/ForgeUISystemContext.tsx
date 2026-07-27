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

export type ForgeUIPreviewWifiNetwork = {
  ssid: string
  rssi?: number
}

export type ForgeUIPreviewWifiState = {
  state:
    | 'off'
    | 'ready'
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'scanning'
    | 'error'
  statusText: string
  ssid: string
  ip: string
  rssi: number | null
  scanInProgress: boolean
  networks: ForgeUIPreviewWifiNetwork[]
}

type ForgeUISystemContextValue = {
  isOpen: boolean
  page: ForgeUISystemPage
  brightness: number
  previewWifi: ForgeUIPreviewWifiState
  openSystemLauncher: () => void
  openSystemPage: (page: ForgeUISystemPage) => void
  closeSystemInterface: () => void
  goBackInSystemInterface: () => void
  setBrightness: (value: number) => void
  scanPreviewWifi: () => void
  disconnectPreviewWifi: () => void
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
  const [previewWifi, setPreviewWifi] =
    useState<ForgeUIPreviewWifiState>({
      state: 'connected',
      statusText: 'CONNECTED — SIMULATED PREVIEW',
      ssid: 'ForgeUI-Lab',
      ip: '192.168.4.42',
      rssi: -54,
      scanInProgress: false,
      networks: [
        { ssid: 'ForgeUI-Lab', rssi: -54 },
        { ssid: 'Workshop-IoT', rssi: -67 },
        { ssid: 'Guest-Network', rssi: -78 },
      ],
    })

  const value = useMemo<ForgeUISystemContextValue>(
    () => ({
      isOpen,
      page,
      brightness,
      previewWifi,
      openSystemLauncher: () => {
        setPage('launcher')
        setIsOpen(true)
      },
      openSystemPage: nextPage => {
        if (nextPage !== 'brightness' && nextPage !== 'wifi') return
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
      scanPreviewWifi: () => {
        setPreviewWifi(current => {
          if (current.scanInProgress) return current
          return {
            ...current,
            state: current.state === 'connected'
              ? 'connected'
              : 'scanning',
            statusText: 'SCANNING — SIMULATED PREVIEW',
            scanInProgress: true,
          }
        })
        window.setTimeout(() => {
          setPreviewWifi(current => ({
            ...current,
            state: current.ssid ? 'connected' : 'disconnected',
            statusText: current.ssid
              ? 'CONNECTED — SIMULATED PREVIEW'
              : 'SCAN DONE — SIMULATED PREVIEW',
            scanInProgress: false,
            networks: [
              { ssid: 'ForgeUI-Lab', rssi: -54 },
              { ssid: 'Workshop-IoT', rssi: -67 },
              { ssid: 'Guest-Network', rssi: -78 },
              { ssid: 'ESP32-Testbench', rssi: -82 },
            ],
          }))
        }, 600)
      },
      disconnectPreviewWifi: () => {
        setPreviewWifi(current => ({
          ...current,
          state: 'disconnected',
          statusText: 'DISCONNECTED — SIMULATED PREVIEW',
          ssid: '',
          ip: '',
          rssi: null,
          scanInProgress: false,
        }))
      },
    }),
    [brightness, isOpen, page, previewWifi],
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
