import React from 'react'
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { ForgeThemeProvider } from '~forgeui/theme/ForgeThemeContext'
import {
  ForgeUISystemProvider,
  ForgeUISystemSurface,
} from '.'

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

  it('does not navigate from placeholder cards', () => {
    renderSurface()
    fireEvent.click(screen.getByLabelText('Open System'))
    fireEvent.click(screen.getByTestId('system-card-wifi'))

    expect(screen.getByTestId('system-launcher'))
      .toBeInTheDocument()
    expect(screen.queryByTestId('system-brightness-page'))
      .not.toBeInTheDocument()
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
