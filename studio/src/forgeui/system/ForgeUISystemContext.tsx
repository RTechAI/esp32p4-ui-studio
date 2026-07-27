import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type ForgeUISystemPage =
  | 'launcher' | 'brightness' | 'wifi' | 'bluetooth'
  | 'sound' | 'storage' | 'device' | 'diagnostics'

export type ForgeUIPreviewWifiSecurity =
  | 'Open' | 'WPA2' | 'WPA3' | 'WPA2/WPA3'

export type ForgeUIPreviewWifiNetwork = {
  ssid: string
  rssi: number
  security: ForgeUIPreviewWifiSecurity
  connected: boolean
  saved: boolean
}

export type ForgeUIPreviewWifiState = {
  state:
    | 'off' | 'turning-on' | 'ready' | 'connecting'
    | 'connected' | 'disconnecting' | 'disconnected'
    | 'scanning' | 'failed'
  statusText: string
  ssid: string
  ip: string
  gateway: string
  rssi: number | null
  security: ForgeUIPreviewWifiSecurity | 'Unknown'
  stationMac: string
  apBssid: string
  scanInProgress: boolean
  networks: ForgeUIPreviewWifiNetwork[]
  selectedSsid: string | null
  passwordDialogSsid: string | null
  forgetConfirmationOpen: boolean
  error: string
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
  selectPreviewWifi: (ssid: string) => void
  connectPreviewWifi: (password: string, remember: boolean) => void
  cancelPreviewWifiPassword: () => void
  disconnectPreviewWifi: () => void
  reconnectPreviewWifi: () => void
  requestForgetPreviewWifi: () => void
  cancelForgetPreviewWifi: () => void
  confirmForgetPreviewWifi: () => void
}

const INITIAL_NETWORKS: ForgeUIPreviewWifiNetwork[] = [
  { ssid: 'ForgeUI-Lab', rssi: -54, security: 'WPA2', connected: true, saved: true },
  { ssid: 'Workshop-IoT', rssi: -67, security: 'Open', connected: false, saved: false },
  { ssid: 'Guest-Network', rssi: -78, security: 'WPA2/WPA3', connected: false, saved: false },
]

const ForgeUISystemContext = createContext<ForgeUISystemContextValue | null>(null)

export const ForgeUISystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState<ForgeUISystemPage>('launcher')
  const [brightness, setBrightnessState] = useState(100)
  const [rssiStep, setRssiStep] = useState(0)
  const [previewWifi, setPreviewWifi] = useState<ForgeUIPreviewWifiState>({
    state: 'connected',
    statusText: 'Connected — simulated preview',
    ssid: 'ForgeUI-Lab',
    ip: '192.168.4.42',
    gateway: '192.168.4.1',
    rssi: -54,
    security: 'WPA2',
    stationMac: '02:46:4F:52:47:45',
    apBssid: '24:6F:28:10:20:30',
    scanInProgress: false,
    networks: INITIAL_NETWORKS,
    selectedSsid: null,
    passwordDialogSsid: null,
    forgetConfirmationOpen: false,
    error: '',
  })

  useEffect(() => {
    if (!isOpen || page !== 'wifi') return undefined
    const sequence = [-54, -56, -53, -55]
    const timer = window.setInterval(() => {
      setRssiStep(step => {
        const next = (step + 1) % sequence.length
        setPreviewWifi(current => {
          if (current.state !== 'connected') return current
          const rssi = sequence[next]
          return {
            ...current,
            rssi,
            networks: current.networks.map(network =>
              network.connected ? { ...network, rssi } : network),
          }
        })
        return next
      })
    }, 3000)
    return () => window.clearInterval(timer)
  }, [isOpen, page])

  const value = useMemo<ForgeUISystemContextValue>(() => ({
    isOpen,
    page,
    brightness,
    previewWifi,
    openSystemLauncher: () => { setPage('launcher'); setIsOpen(true) },
    openSystemPage: nextPage => {
      if (nextPage !== 'brightness' && nextPage !== 'wifi' && nextPage !== 'storage') return
      setPage(nextPage)
      setIsOpen(true)
    },
    closeSystemInterface: () => { setIsOpen(false); setPage('launcher') },
    goBackInSystemInterface: () => {
      if (page === 'launcher') setIsOpen(false)
      else setPage('launcher')
    },
    setBrightness: value => setBrightnessState(
      Math.min(100, Math.max(10, Math.round(value))),
    ),
    scanPreviewWifi: () => {
      setPreviewWifi(current => {
        if (current.scanInProgress) return current
        return {
          ...current,
          state: 'scanning',
          statusText: 'Scanning — simulated preview',
          scanInProgress: true,
          networks: [],
          error: '',
        }
      })
      window.setTimeout(() => setPreviewWifi(current => ({
        ...current,
        state: current.ssid ? 'connected' : 'disconnected',
        statusText: current.ssid
          ? 'Connected — simulated preview'
          : 'Scan complete — simulated preview',
        scanInProgress: false,
        networks: [
          ...INITIAL_NETWORKS.map(network => ({
            ...network,
            connected: network.ssid === current.ssid,
          })),
          { ssid: 'ESP32-Testbench', rssi: -82, security: 'WPA3' as const, connected: false, saved: false },
        ].sort((a, b) => Number(b.connected) - Number(a.connected) || b.rssi - a.rssi),
      })), 600)
    },
    selectPreviewWifi: ssid => setPreviewWifi(current => {
      const network = current.networks.find(item => item.ssid === ssid)
      if (!network) return current
      if (network.connected) return { ...current, selectedSsid: ssid }
      if (network.security !== 'Open') {
        return { ...current, selectedSsid: ssid, passwordDialogSsid: ssid, error: '' }
      }
      window.setTimeout(() => setPreviewWifi(latest => ({
        ...latest,
        state: 'connected',
        statusText: 'Connected — simulated preview',
        ssid,
        ip: '192.168.4.77',
        gateway: '192.168.4.1',
        rssi: network.rssi,
        security: network.security,
        apBssid: '24:6F:28:40:50:60',
        networks: latest.networks.map(item => ({
          ...item,
          connected: item.ssid === ssid,
        })),
      })), 500)
      return {
        ...current,
        selectedSsid: ssid,
        state: 'connecting',
        statusText: 'Connecting…',
        error: '',
      }
    }),
    connectPreviewWifi: (password, remember) => setPreviewWifi(current => {
      const ssid = current.passwordDialogSsid
      const network = current.networks.find(item => item.ssid === ssid)
      if (!ssid || !network) return current
      if (password === 'wrong-password') {
        return {
          ...current,
          passwordDialogSsid: null,
          state: 'failed',
          statusText: 'Authentication failed',
          error: 'Authentication failed',
        }
      }
      if (password.length < 8 || password.length > 63) {
        return { ...current, error: 'Password must be 8 to 63 characters' }
      }
      window.setTimeout(() => setPreviewWifi(latest => ({
        ...latest,
        state: 'connected',
        statusText: 'Connected — simulated preview',
        ssid,
        ip: '192.168.4.88',
        gateway: '192.168.4.1',
        rssi: network.rssi,
        security: network.security,
        apBssid: '24:6F:28:70:80:90',
        error: '',
        networks: latest.networks.map(item => ({
          ...item,
          connected: item.ssid === ssid,
          saved: item.ssid === ssid ? remember : item.saved,
        })),
      })), 700)
      return {
        ...current,
        passwordDialogSsid: null,
        state: 'connecting',
        statusText: 'Connecting…',
        error: '',
      }
    }),
    cancelPreviewWifiPassword: () => setPreviewWifi(current => ({
      ...current, passwordDialogSsid: null, error: '',
    })),
    disconnectPreviewWifi: () => setPreviewWifi(current => ({
      ...current,
      state: 'disconnected',
      statusText: 'Disconnected — simulated preview',
      ssid: '',
      ip: '',
      gateway: '',
      rssi: null,
      security: 'Unknown',
      apBssid: '',
      selectedSsid: null,
      networks: current.networks.map(network => ({ ...network, connected: false })),
    })),
    reconnectPreviewWifi: () => setPreviewWifi(current => {
      const saved = current.networks.find(network => network.saved)
      if (!saved) return { ...current, state: 'failed', statusText: 'No saved network', error: 'No saved network' }
      window.setTimeout(() => setPreviewWifi(latest => ({
        ...latest,
        state: 'connected',
        statusText: 'Connected — simulated preview',
        ssid: saved.ssid,
        ip: '192.168.4.42',
        gateway: '192.168.4.1',
        rssi: saved.rssi,
        security: saved.security,
        apBssid: '24:6F:28:10:20:30',
        networks: latest.networks.map(network => ({
          ...network, connected: network.ssid === saved.ssid,
        })),
      })), 600)
      return { ...current, state: 'connecting', statusText: 'Connecting…', error: '' }
    }),
    requestForgetPreviewWifi: () => setPreviewWifi(current => ({
      ...current, forgetConfirmationOpen: true,
    })),
    cancelForgetPreviewWifi: () => setPreviewWifi(current => ({
      ...current, forgetConfirmationOpen: false,
    })),
    confirmForgetPreviewWifi: () => setPreviewWifi(current => ({
      ...current,
      forgetConfirmationOpen: false,
      state: 'disconnected',
      statusText: 'Network forgotten — simulated preview',
      ssid: '',
      ip: '',
      gateway: '',
      rssi: null,
      security: 'Unknown',
      apBssid: '',
      selectedSsid: null,
      networks: current.networks.map(network => ({
        ...network, connected: false, saved: false,
      })),
    })),
  }), [brightness, isOpen, page, previewWifi, rssiStep])

  return <ForgeUISystemContext.Provider value={value}>{children}</ForgeUISystemContext.Provider>
}

export const useForgeUISystem = () => {
  const context = useContext(ForgeUISystemContext)
  if (!context) throw new Error('useForgeUISystem must be used inside ForgeUISystemProvider')
  return context
}
