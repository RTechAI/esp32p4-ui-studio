import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type DeviceConsoleTab = 'build' | 'monitor' | 'io'
export type SerialPortInfo = { path: string; manufacturer?: string; vendorId?: string; productId?: string }
export type MonitorState = 'disconnected' | 'connecting' | 'connected' | 'error'

type DeviceConsoleContextValue = {
  isOpen: boolean; log: string; running: boolean; activeTab: DeviceConsoleTab
  monitorLog: string; monitorState: MonitorState; monitorError: string | null
  ports: SerialPortInfo[]; selectedPort: string; baud: number
  openBuild: (initialLog?: string) => void; toggle: () => void; collapse: () => void
  clear: () => void; stop: () => Promise<void>; setActiveTab: (tab: DeviceConsoleTab) => void
  loadPorts: () => Promise<void>; setSelectedPort: (port: string) => void; setBaud: (baud: number) => void
  connectMonitor: () => Promise<void>; disconnectMonitor: () => Promise<void>; clearMonitor: () => Promise<void>
}

const DeviceConsoleContext = createContext<DeviceConsoleContextValue | null>(null)
const backend = 'http://localhost:3030'

export const DeviceConsoleProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [log, setLog] = useState('')
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<DeviceConsoleTab>('build')
  const [monitorLog, setMonitorLog] = useState('')
  const [monitorState, setMonitorState] = useState<MonitorState>('disconnected')
  const [monitorError, setMonitorError] = useState<string | null>(null)
  const [ports, setPorts] = useState<SerialPortInfo[]>([])
  const [selectedPort, setSelectedPort] = useState('')
  const [baud, setBaud] = useState(115200)

  const applyMonitor = useCallback((data: any) => {
    setMonitorState(data.state || (data.connected ? 'connected' : 'disconnected'))
    setMonitorError(data.error || null)
    if (data.log !== undefined) setMonitorLog(data.log || '')
    if (data.port) setSelectedPort(current => current || data.port)
    if (data.baud) setBaud(data.baud)
  }, [])

  const loadPorts = useCallback(async () => {
    try {
      const response = await fetch(`${backend}/serial/ports`)
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to list serial ports')
      setPorts(data.ports || [])
    } catch (error) { setMonitorError(String(error instanceof Error ? error.message : error)) }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const endpoint = activeTab === 'monitor' ? '/serial/log' : '/flash-log'
    const poll = async () => {
      try {
        const response = await fetch(`${backend}${endpoint}`)
        const data = await response.json()
        if (activeTab === 'monitor') applyMonitor(data)
        else { setLog(data.log || ''); setRunning(Boolean(data.running)) }
      } catch (error) { console.error(error) }
    }
    poll()
    const timer = window.setInterval(poll, 500)
    return () => window.clearInterval(timer)
  }, [activeTab, applyMonitor, isOpen])

  useEffect(() => { if (isOpen && activeTab === 'monitor') loadPorts() }, [activeTab, isOpen, loadPorts])

  const value = useMemo<DeviceConsoleContextValue>(() => ({
    isOpen, log, running, activeTab, monitorLog, monitorState, monitorError,
    ports, selectedPort, baud,
    openBuild: initialLog => { setActiveTab('build'); if (initialLog !== undefined) setLog(initialLog); setIsOpen(true) },
    toggle: () => setIsOpen(open => !open), collapse: () => setIsOpen(false),
    clear: () => setLog(''),
    stop: async () => { await fetch(`${backend}/flash-stop`, { method: 'POST' }) },
    setActiveTab, loadPorts, setSelectedPort, setBaud,
    connectMonitor: async () => {
      if (!selectedPort) { setMonitorError('Select a serial port first'); return }
      setMonitorState('connecting'); setMonitorError(null)
      try {
        const response = await fetch(`${backend}/serial/start`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ port: selectedPort, baud }) })
        const data = await response.json()
        applyMonitor(data)
        if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to connect')
      } catch (error) { setMonitorState('error'); setMonitorError(String(error instanceof Error ? error.message : error)) }
    },
    disconnectMonitor: async () => {
      const response = await fetch(`${backend}/serial/stop`, { method: 'POST' })
      const data = await response.json(); applyMonitor(data)
      if (!response.ok || !data.ok) setMonitorError(data.error || 'Unable to disconnect')
    },
    clearMonitor: async () => { await fetch(`${backend}/serial/clear`, { method: 'POST' }); setMonitorLog('') },
  }), [activeTab, applyMonitor, baud, isOpen, loadPorts, log, monitorError, monitorLog, monitorState, ports, running, selectedPort])

  return <DeviceConsoleContext.Provider value={value}>{children}</DeviceConsoleContext.Provider>
}

export const useDeviceConsole = () => {
  const context = useContext(DeviceConsoleContext)
  if (!context) throw new Error('useDeviceConsole must be used within DeviceConsoleProvider')
  return context
}
