import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { DashboardCardPanel } from './DashboardCardPanel'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

jest.mock('~hooks/useForm', () => ({ useForm: () => ({ setValue: jest.fn() }) }))
jest.mock('~hooks/usePropsSelector', () => () => undefined)

describe('Dashboard Card Inspector contrast', () => {
  it('uses the standard Inspector property-text token for every field label', () => {
    render(<ChakraProvider><DashboardCardPanel /></ChakraProvider>)

    ;[
      'Title',
      'Icon',
      'Primary value',
      'Units',
      'Description',
      'Status',
      'Status text',
      'Progress (%)',
      'Footer / timestamp',
      'Accent colour (empty uses theme)',
      'Padding',
    ].forEach(label => {
      expect(screen.getByText(label)).toHaveStyle({
        color: INSPECTOR_PROPERTY_TEXT_COLOR,
        opacity: '1',
      })
    })
  })

  it('keeps checkbox labels readable through the panel text token', () => {
    render(<ChakraProvider><DashboardCardPanel /></ChakraProvider>)

    ;['Show header', 'Show footer', 'Show progress', 'Show status', 'Generate click UserEvent']
      .forEach(label => {
        const checkbox = screen.getByRole('checkbox', { name: label })
        expect(checkbox.closest('label')).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
      })
  })
})
