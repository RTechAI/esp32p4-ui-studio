import React from 'react'
import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import fs from 'fs'
import path from 'path'
import { ForgeThemeProvider } from '~forgeui/theme/ForgeThemeContext'
import {
  ForgeUISystemProvider,
  ForgeUISystemSurface,
} from '.'
import { STORAGE_PREVIEW_LAYOUT } from './ForgeUIStoragePage'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  window.ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver
})

const renderSurface = () =>
  render(
    <ChakraProvider>
      <ForgeThemeProvider>
        <ForgeUISystemProvider>
          <ForgeUISystemSurface>
            <button onClick={() => undefined}>
              Existing interactive asset
            </button>
          </ForgeUISystemSurface>
        </ForgeUISystemProvider>
      </ForgeThemeProvider>
    </ChakraProvider>,
  )

describe('ForgeUI System interface', () => {
  it('opens the launcher and returns to the application', () => {
    renderSurface()
    fireEvent.click(
      screen.getByRole('button', { name: 'Open System' }),
    )
    expect(screen.getByTestId('system-launcher'))
      .toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Back from System' }),
    )
    expect(screen.getByTestId('forgeui-system-panel'))
      .toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('Existing interactive asset'))
      .toBeInTheDocument()
  })

  it('opens Brightness and goes back to the launcher', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-brightness'))

    expect(screen.getByTestId('system-brightness-page'))
      .toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Back from Brightness',
      }),
    )
    expect(screen.getByTestId('system-launcher'))
      .toBeInTheDocument()
  })

  it('updates and retains brightness for the preview session', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-brightness'))
    fireEvent.keyDown(
      screen.getByRole('slider', {
        name: 'Display brightness',
      }),
      { key: 'Home' },
    )

    expect(screen.getByTestId('brightness-percentage'))
      .toHaveTextContent('10%')
    expect(screen.getByTestId('forgeui-brightness-layer'))
      .toHaveStyle({ filter: 'brightness(10%)' })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Back from Brightness',
      }),
    )
    fireEvent.click(screen.getByTestId('system-card-brightness'))
    expect(screen.getByTestId('brightness-percentage'))
      .toHaveTextContent('10%')
  })

  it('opens Wi-Fi and goes back to the launcher', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-wifi'))

    expect(screen.getByTestId('system-wifi-page'))
      .toBeInTheDocument()
    expect(screen.getByTestId('wifi-preview-badge'))
      .toHaveTextContent('Simulated Preview')
    expect(screen.getByTestId('wifi-state'))
      .toHaveTextContent('connected')
    expect(screen.getByTestId('wifi-ssid'))
      .toHaveTextContent('ForgeUI-Lab')

    fireEvent.click(
      screen.getByRole('button', { name: 'Back from Wi-Fi' }),
    )
    expect(screen.getByTestId('system-launcher'))
      .toBeInTheDocument()
  })

  it('enables Storage and navigates its deterministic file model', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    expect(screen.getByTestId('system-card-storage')).toBeEnabled()
    fireEvent.click(screen.getByTestId('system-card-storage'))
    expect(screen.getByTestId('system-storage-page')).toBeInTheDocument()
    expect(screen.getByTestId('sd-mounted')).toHaveTextContent('Mounted')
    expect(screen.getByTestId('sd-capacity')).toHaveTextContent('29.7 GB')
    expect(screen.getByTestId('sd-free')).toHaveTextContent('21.2 GB')
    fireEvent.click(screen.getByTestId('sd-entry-ForgeUI'))
    fireEvent.click(screen.getByTestId('sd-entry-empty'))
    expect(screen.getByTestId('sd-empty-folder')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Parent folder'))
    expect(screen.getByTestId('sd-current-path')).toHaveTextContent('/sdcard/ForgeUI')
  })

  it('runs the read/write test without host filesystem access', () => {
    jest.useFakeTimers()
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-storage'))
    fireEvent.click(screen.getByRole('button', { name: 'Run R/W Test' }))
    expect(screen.getByTestId('sd-test-state')).toHaveTextContent('running')
    act(() => { jest.advanceTimersByTime(400) })
    expect(screen.getByTestId('sd-test-state')).toHaveTextContent('passed')
    jest.useRealTimers()
  })

  it('keeps recovery Storage free of destructive selection controls', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-storage'))
    expect(screen.queryByRole('button', { name: 'Select All' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear Selection' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete Selected' })).not.toBeInTheDocument()
    expect(screen.getByTestId('sd-entry-readme.txt')).toBeInTheDocument()
  })

  it('uses the physically proven Storage HMI geometry in Canvas and Browser Preview', () => {
    expect(STORAGE_PREVIEW_LAYOUT).toMatchObject({
      page: { width: 1024, height: 600 },
      back: { left: 20, top: 14, width: 128, height: 54 },
      title: { top: 24, fontSize: 32 },
      summary: { left: 28, top: 96, width: 350 },
      refresh: { left: 28, top: 220, width: 165, height: 50 },
      test: { left: 210, top: 220, width: 165, height: 50 },
      select: { left: 28, top: 292, width: 165, height: 52 },
      delete: { left: 210, top: 292, width: 165, height: 52 },
      parent: { left: 410, top: 78, width: 135, height: 48 },
      path: { left: 565, top: 92 },
      list: { left: 400, top: 135, width: 600, height: 390, padding: 6, gap: 5 },
      row: { height: 40 },
      previous: { left: 410, top: 536, width: 170, height: 48 },
      next: { left: 810, top: 536, width: 170, height: 48 },
      dialog: { width: 560, height: 330 },
    })
  })

  it('deletes only a selected empty folder after exact confirmation', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-storage'))
    expect(screen.getByTestId('sd-delete-folder')).toBeDisabled()
    fireEvent.click(screen.getByTestId('sd-entry-ForgeUI'))
    fireEvent.click(screen.getByTestId('sd-select-folder'))
    expect(screen.getByTestId('sd-select-folder')).toHaveTextContent('Cancel Selection')
    fireEvent.click(screen.getByTestId('sd-entry-logs'))
    expect(screen.getByTestId('sd-delete-folder')).toBeDisabled()
    expect(screen.getByTestId('sd-current-path')).toHaveTextContent('/sdcard/ForgeUI')
    fireEvent.click(screen.getByTestId('sd-entry-empty'))
    expect(screen.getByTestId('sd-delete-folder')).toBeEnabled()
    expect(screen.getByTestId('sd-entry-empty')).toHaveAttribute('data-selected', 'true')
    fireEvent.click(screen.getByTestId('sd-delete-folder'))
    expect(screen.getByText('This folder must be empty.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Delete Folder' })[1]).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Delete item confirmation'), { target: { value: 'DELETE' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete Folder' })[1])
    expect(screen.queryByTestId('sd-entry-empty')).not.toBeInTheDocument()
    expect(screen.getByTestId('sd-current-path')).toHaveTextContent('/sdcard/ForgeUI')
  })

  it('cancels explicit folder selection and restores normal navigation', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-storage'))
    fireEvent.click(screen.getByTestId('sd-select-folder'))
    fireEvent.click(screen.getByTestId('sd-entry-ForgeUI'))
    expect(screen.getByTestId('sd-current-path')).toHaveTextContent('/sdcard')
    expect(screen.getByTestId('sd-entry-ForgeUI')).toHaveAttribute('data-selected', 'true')
    fireEvent.click(screen.getByTestId('sd-select-folder'))
    expect(screen.getByTestId('sd-select-folder')).toHaveTextContent('Select Item')
    expect(screen.getByTestId('sd-entry-ForgeUI')).not.toHaveAttribute('data-selected')
    fireEvent.click(screen.getByTestId('sd-entry-ForgeUI'))
    expect(screen.getByTestId('sd-current-path')).toHaveTextContent('/sdcard/ForgeUI')
  })

  it('keeps file deletion unavailable in the recovery build', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-storage'))
    fireEvent.click(screen.getByTestId('sd-select-folder'))
    fireEvent.click(screen.getByTestId('sd-entry-readme.txt'))
    expect(screen.getByTestId('sd-entry-readme.txt')).toHaveAttribute('data-selected', 'true')
    expect(screen.getByTestId('sd-current-path')).toHaveTextContent('/sdcard')
    expect(screen.getByTestId('sd-delete-folder')).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Delete File' })).not.toBeInTheDocument()
  })

  it('refreshes safely after entering and cancelling selection mode', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-storage'))
    fireEvent.click(screen.getByTestId('sd-select-folder'))
    fireEvent.click(screen.getByTestId('sd-select-folder'))
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    expect(screen.getByTestId('sd-current-path')).toHaveTextContent('/sdcard')
    expect(screen.getByTestId('sd-select-folder')).toHaveTextContent('Select Item')
    expect(screen.getByTestId('sd-delete-folder')).toBeDisabled()
  })

  it('uses only ForgeUI palette styling for Wi-Fi network row states and badges', () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, 'ForgeUIWifiPage.tsx'),
      'utf8',
    )
    ;[
      'bg={selected ? palette.accent : palette.surface2}',
      'borderColor={selected ? palette.accent : palette.border}',
      'color={selected ? palette.bg : palette.text}',
      '_hover={{',
      '_active={{',
      '_focusVisible={{',
      '_disabled={{',
      'data-connecting={connecting || undefined}',
      '<Badge bg={palette.surface} color={palette.text}',
      'color={selected ? palette.bg : palette.accent}',
      'color={selected ? palette.bg : palette.border}',
    ].forEach(style => expect(source).toContain(style))
    expect(source).not.toContain('colorScheme="blue"')

    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-wifi'))

    expect(screen.getByText('Saved')).not.toHaveAttribute('data-theme', 'blue')

    fireEvent.click(screen.getByTestId('wifi-network-Workshop-IoT'))
    const connecting = screen.getByTestId('wifi-network-Workshop-IoT')
    expect(connecting).toHaveAttribute('data-selected', 'true')
    expect(connecting).toHaveAttribute('data-connecting', 'true')
  })

  it('simulates scanning and refreshes deterministic networks', () => {
    jest.useFakeTimers()
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-wifi'))

    fireEvent.click(
      screen.getByRole('button', { name: 'Scan Networks' }),
    )
    expect(screen.getByTestId('wifi-state'))
      .toHaveTextContent('Scanning')
    expect(screen.getByRole('button', { name: 'Scanning…' }))
      .toBeDisabled()

    act(() => {
      jest.advanceTimersByTime(600)
    })
    expect(screen.getByText('ESP32-Testbench'))
      .toBeInTheDocument()
    jest.useRealTimers()
  })

  it('disconnects locally and retains the state across navigation', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-wifi'))
    fireEvent.click(
      screen.getByRole('button', { name: 'Disconnect' }),
    )

    expect(screen.getByTestId('wifi-state'))
      .toHaveTextContent('disconnected')
    expect(screen.getByTestId('wifi-ssid')).toHaveTextContent('—')
    expect(screen.getByRole('button', { name: 'Reconnect Saved Network' }))
      .toBeEnabled()

    fireEvent.click(
      screen.getByRole('button', { name: 'Back from Wi-Fi' }),
    )
    fireEvent.click(screen.getByTestId('system-card-wifi'))
    expect(screen.getByTestId('wifi-state'))
      .toHaveTextContent('disconnected')
  })

  it('connects to an open network without a password dialog', () => {
    jest.useFakeTimers()
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-wifi'))
    fireEvent.click(screen.getByTestId('wifi-network-Workshop-IoT'))
    expect(screen.queryByLabelText('Wi-Fi password')).not.toBeInTheDocument()
    expect(screen.getByTestId('wifi-state')).toHaveTextContent('connecting')
    act(() => { jest.advanceTimersByTime(500) })
    expect(screen.getByTestId('wifi-ssid')).toHaveTextContent('Workshop-IoT')
    jest.useRealTimers()
  })

  it('shows a password dialog and authentication failure deterministically', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-wifi'))
    fireEvent.click(screen.getByTestId('wifi-network-Guest-Network'))
    fireEvent.change(screen.getByLabelText('Wi-Fi password'), {
      target: { value: 'wrong-password' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }))
    expect(screen.getByTestId('wifi-error')).toHaveTextContent('Authentication failed')
  })

  it('validates password length and Cancel clears transient password text', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-wifi'))
    fireEvent.click(screen.getByTestId('wifi-network-Guest-Network'))
    const input = screen.getByLabelText('Wi-Fi password')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'short' } })
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }))
    expect(screen.getByText('Password must be 8 to 63 characters'))
      .toBeInTheDocument()
    expect(screen.getByTestId('wifi-state')).toHaveTextContent('connected')
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.click(screen.getByTestId('wifi-network-Guest-Network'))
    expect(screen.getByLabelText('Wi-Fi password')).toHaveValue('')
  })

  it('toggles password visibility without losing entered text', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-wifi'))
    fireEvent.click(screen.getByTestId('wifi-network-Guest-Network'))
    const input = screen.getByLabelText('Wi-Fi password')
    fireEvent.change(input, { target: { value: 'valid-password' } })
    fireEvent.click(screen.getByLabelText('Show password'))
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveValue('valid-password')
    fireEvent.click(screen.getByLabelText('Hide password'))
    expect(input).toHaveAttribute('type', 'password')
  })

  it('does not navigate from future placeholder cards', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-bluetooth'))

    expect(screen.getByTestId('system-launcher'))
      .toBeInTheDocument()
  })

  it('leaves existing application interactions available when closed', () => {
    renderSurface()
    const asset = screen.getByRole('button', {
      name: 'Existing interactive asset',
    })
    expect(asset).toBeEnabled()
    fireEvent.click(asset)
    expect(screen.getByTestId('forgeui-system-panel'))
      .toHaveStyle({ pointerEvents: 'none' })
  })
})
