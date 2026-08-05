import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { PwmControllerPanel } from './PwmControllerPanel'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

const setValue = jest.fn()
const values: Record<string, unknown> = {
  enabled: true,
  showSlider: false,
  showNumericValue: true,
  showEnableControl: false,
  generateRuntimeApi: true,
  enableUserEvents: false,
}

jest.mock('~hooks/useForm', () => ({ useForm: () => ({ setValue }) }))
jest.mock('~hooks/usePropsSelector', () => (name: string) => values[name])

describe('PWM Controller Inspector contrast', () => {
  it('uses the shared property-label colour for checked and unchecked checkbox labels', () => {
    render(<ChakraProvider><PwmControllerPanel /></ChakraProvider>)
    const names = [
      'Enabled', 'Show slider', 'Show numeric value', 'Show enable control',
      'Generate Runtime SDK', 'Generate UserEvents',
    ]
    names.forEach(name => {
      const control = screen.getByRole('checkbox', { name })
      const label = control.closest('label')
      expect(label).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
      expect(screen.getByText(name)).toHaveStyle('color: inherit')
      expect(screen.getByText(name)).toHaveStyle('opacity: 1')
    })

    const checked = screen.getByRole('checkbox', { name: 'Enabled' })
    const unchecked = screen.getByRole('checkbox', { name: 'Show slider' })
    expect(checked).toBeChecked()
    expect(unchecked).not.toBeChecked()
    fireEvent.click(checked)
    fireEvent.click(unchecked)
    expect(checked.closest('label')).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
    expect(unchecked.closest('label')).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
  })

  it('keeps every PWM property label on the same readable inspector token', () => {
    render(<ChakraProvider><PwmControllerPanel /></ChakraProvider>)
    ;['Label', 'Subtitle', 'minimum', 'maximum', 'step', 'Value', 'Unit',
      'Orientation', 'Accent colour (blank = theme)', 'Status text'].forEach(name =>
      {
        expect(screen.getByText(name)).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
        expect(screen.getByText(name)).toHaveStyle('opacity: 1')
      },
    )
  })
})
