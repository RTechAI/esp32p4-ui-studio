import React from 'react'
import { ChakraProvider, Button } from '@chakra-ui/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import DeviceConsoleDock from './DeviceConsoleDock'
import { DeviceConsoleProvider, useDeviceConsole } from '~contexts/device-console-context'

const Harness = () => {
  const state = useDeviceConsole()
  return <>
    <Button onClick={state.toggle}>Console</Button>
    <Button onClick={() => state.openBuild('Starting Build & Flash...\n')}>Build &amp; Flash</Button>
    <div data-testid="design-canvas" data-width="1024" data-height="600" />
    <DeviceConsoleDock />
  </>
}

const renderConsole = () => render(<ChakraProvider><DeviceConsoleProvider><Harness /></DeviceConsoleProvider></ChakraProvider>)

describe('DeviceConsoleDock', () => {
  let monitorConnected = false
  beforeEach(() => {
    monitorConnected = false
    global.fetch = jest.fn(async (input: RequestInfo) => {
      const url = String(input)
      if (url.endsWith('/serial/ports')) return { ok: true, json: async () => ({ ok: true, ports: [{ path: 'COM5', manufacturer: 'Espressif' }] }) }
      if (url.endsWith('/serial/start')) { monitorConnected = true; return { ok: true, json: async () => ({ ok: true, state: 'connected', connected: true, port: 'COM5', baud: 115200 }) } }
      if (url.endsWith('/serial/stop')) { monitorConnected = false; return { ok: true, json: async () => ({ ok: true, state: 'disconnected', connected: false, port: 'COM5', baud: 115200 }) } }
      if (url.endsWith('/serial/log')) return { ok: true, json: async () => ({ ok: true, state: monitorConnected ? 'connected' : 'disconnected', connected: monitorConnected, port: monitorConnected ? 'COM5' : null, baud: 115200, log: monitorConnected ? 'ESP-ROM\nI (26) boot' : '' }) }
      return { ok: true, json: async () => ({ ok: true, log: '', running: false }) }
    }) as jest.Mock
  })

  it('is hidden by default and the Console control toggles it without changing document dimensions', () => {
    renderConsole()
    const canvas = screen.getByTestId('design-canvas')
    expect(screen.queryByTestId('device-console-dock')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Console' }))
    expect(screen.getByTestId('device-console-dock')).toBeInTheDocument()
    expect(canvas).toHaveAttribute('data-width', '1024')
    expect(canvas).toHaveAttribute('data-height', '600')
    fireEvent.click(screen.getByRole('button', { name: 'Console' }))
    expect(screen.queryByTestId('device-console-dock')).not.toBeInTheDocument()
  })

  it('auto-opens BUILD and renders real MONITOR controls plus the I/O placeholder', async () => {
    renderConsole()
    fireEvent.click(screen.getByRole('button', { name: 'Build & Flash' }))
    expect(screen.getByTestId('build-console-output')).toHaveTextContent('Starting Build & Flash...')
    fireEvent.click(screen.getByRole('button', { name: 'MONITOR' }))
    expect(await screen.findByRole('option', { name: 'COM5 — Espressif' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Baud rate' })).toHaveValue('115200')
    fireEvent.change(screen.getByRole('combobox', { name: 'Serial port' }), { target: { value: 'COM5' } })
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:3030/serial/start', expect.objectContaining({ method: 'POST' })))
    await waitFor(() => expect(screen.getByTestId('monitor-console-output')).toHaveTextContent('ESP-ROM'))
    fireEvent.click(screen.getByRole('button', { name: 'Disconnect' }))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:3030/serial/stop', { method: 'POST' }))
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:3030/serial/clear', { method: 'POST' }))
    fireEvent.click(screen.getByRole('button', { name: 'I/O' }))
    expect(screen.getByText('Live ForgeUI hardware telemetry coming next')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'BUILD' }))
    expect(screen.getByTestId('build-console-output')).toBeInTheDocument()
  })

  it('keeps clear, stop, and collapse as distinct actions', async () => {
    renderConsole()
    fireEvent.click(screen.getByRole('button', { name: 'Build & Flash' }))
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByTestId('build-console-output')).toHaveTextContent('Waiting for flash output...')
    fireEvent.click(screen.getByRole('button', { name: 'Collapse' }))
    expect(screen.queryByTestId('device-console-dock')).not.toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalledWith('http://localhost:3030/flash-stop', expect.anything())
    fireEvent.click(screen.getByRole('button', { name: 'Console' }))
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:3030/flash-stop', { method: 'POST' }))
    expect(screen.getByTestId('device-console-dock')).toBeInTheDocument()
  })
})
