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
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ log: '', running: false }) }) as jest.Mock
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

  it('auto-opens BUILD with launch output and switches placeholder tabs', () => {
    renderConsole()
    fireEvent.click(screen.getByRole('button', { name: 'Build & Flash' }))
    expect(screen.getByTestId('build-console-output')).toHaveTextContent('Starting Build & Flash...')
    fireEvent.click(screen.getByRole('button', { name: 'MONITOR' }))
    expect(screen.getByText('Serial monitor coming next')).toBeInTheDocument()
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
