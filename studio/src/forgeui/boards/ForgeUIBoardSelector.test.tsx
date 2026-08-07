import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import ForgeUIBoardSelector from './ForgeUIBoardSelector'
import { normalizeProjectHardware } from './ForgeUIBoardRegistry'
import { ForgeThemeProvider } from '~forgeui/theme/ForgeThemeContext'

describe('ForgeUIBoardSelector', () => {
  it('renders registry metadata and hardware configuration from the profile', () => {
    const onChange = jest.fn()
    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <ForgeUIBoardSelector
            project={normalizeProjectHardware()}
            onChange={onChange}
          />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    expect(screen.getByTestId('board-selector'))
      .toHaveTextContent('Board: ESP32-P4 7B')
    fireEvent.click(screen.getByTestId('board-selector'))
    expect(screen.getByText('Waveshare ESP32-P4 WiFi6 Touch LCD 7B'))
      .toBeInTheDocument()
    expect(screen.getByText('1024 × 600 · 16-bit')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Configure Hardware'))
    expect(screen.getByText('Hardware Configuration')).toBeInTheDocument()
    expect(screen.getByText('Core Hardware')).toBeInTheDocument()
    expect(screen.getByText('Optional Hardware')).toBeInTheDocument()
    expect(screen.getByText('Developer Tools')).toBeInTheDocument()
    expect(screen.getByLabelText('Wi-Fi')).toBeChecked()
    expect(screen.getByLabelText('External RTC')).toBeChecked()
    expect(screen.getByText('Use an external DS3231 real-time clock at I2C address 0x68.'))
      .toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('External RTC'))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      firmwareFeatures: expect.objectContaining({ rtc: false }),
    }))
    expect(screen.getByLabelText('Bluetooth')).toBeDisabled()
    expect(screen.getByText('Not available on this board.'))
      .toBeInTheDocument()
  })
})
