import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type DeviceConsoleTab = 'build' | 'monitor' | 'io'

type DeviceConsoleContextValue = {
  isOpen: boolean; log: string; running: boolean; activeTab: DeviceConsoleTab
  openBuild: (initialLog?: string) => void; toggle: () => void; collapse: () => void
  clear: () => void; stop: () => Promise<void>; setActiveTab: (tab: DeviceConsoleTab) => void
}

const DeviceConsoleContext = createContext<DeviceConsoleContextValue | null>(null)

export const DeviceConsoleProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [log, setLog] = useState('')
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<DeviceConsoleTab>('build')

  useEffect(() => {
    if (!isOpen) return
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3030/flash-log')
        const data = await response.json()
        setLog(data.log || '')
        setRunning(Boolean(data.running))
      } catch (error) { console.error(error) }
    }, 500)
    return () => window.clearInterval(timer)
  }, [isOpen])

  const value = useMemo<DeviceConsoleContextValue>(() => ({
    isOpen, log, running, activeTab,
    openBuild: initialLog => { setActiveTab('build'); if (initialLog !== undefined) setLog(initialLog); setIsOpen(true) },
    toggle: () => setIsOpen(open => !open),
    collapse: () => setIsOpen(false),
    clear: () => setLog(''),
    stop: async () => { await fetch('http://localhost:3030/flash-stop', { method: 'POST' }) },
    setActiveTab,
  }), [activeTab, isOpen, log, running])

  return <DeviceConsoleContext.Provider value={value}>{children}</DeviceConsoleContext.Provider>
}

export const useDeviceConsole = () => {
  const context = useContext(DeviceConsoleContext)
  if (!context) throw new Error('useDeviceConsole must be used within DeviceConsoleProvider')
  return context
}
