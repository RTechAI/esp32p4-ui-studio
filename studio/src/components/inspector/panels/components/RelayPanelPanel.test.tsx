import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { RelayPanelPanel } from './RelayPanelPanel'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

jest.mock('~hooks/useForm', () => ({
  __esModule: true,
  default: () => ({ setValue: jest.fn() }),
  useForm: () => ({ setValue: jest.fn() }),
}))
jest.mock('~hooks/usePropsSelector', () => ({ __esModule: true, default: () => undefined }))

describe('RelayPanelPanel dark Inspector labels', () => {
  it('uses the shared full-opacity property text colour for every label type', () => {
    render(<ChakraProvider><RelayPanelPanel /></ChakraProvider>)

    ;['Title', 'Subtitle', 'Icon', 'Channel count', 'Confirmation', 'Layout',
      'active colour', 'inactive colour', 'disabled colour', 'Padding', 'Gap'].forEach(label => {
      expect(screen.getByText(label)).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
      expect(screen.getByText(label)).toHaveStyle('opacity: 1')
    })

    ;['Default ON', 'Enabled'].forEach(label => {
      screen.getAllByText(label).forEach(text => {
        expect(text.closest('label')).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
        expect(text.closest('label')).toHaveStyle('opacity: 1')
      })
    })

    ;['Show master control', 'Default master ON', 'Show channel numbers', 'Show footer',
      'Generate Runtime SDK', 'Generate UserEvents'].forEach(label => {
      expect(screen.getByText(label).closest('label')).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
      expect(screen.getByText(label).closest('label')).toHaveStyle('opacity: 1')
    })

    expect(screen.getByText('Channels')).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
    expect(screen.getByText(/Deferred until one confirmation path/)).toHaveStyle(
      `color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`,
    )
    expect(screen.getByRole('combobox', { name: 'Confirmation' })).toBeDisabled()
  })
})
