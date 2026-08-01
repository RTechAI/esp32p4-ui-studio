import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { StandardWindowPreview } from './StandardWindowPreview'

describe('Standard Window preview', () => {
  it('renders a separate header and child-owned scrollable content region', () => {
    render(<ChakraProvider><StandardWindowPreview component={{ props: {
      title: 'Control panel', showIcon: true, showCloseButton: true,
      headerHeight: 52, contentPadding: 10, scrollingEnabled: true,
    } }}><span>Owned child</span></StandardWindowPreview></ChakraProvider>)
    expect(screen.getByTestId('standard-window')).toBeVisible()
    expect(screen.getByText('Control panel')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Close window' })).toBeVisible()
    expect(screen.getByTestId('standard-window-content')).toContainElement(screen.getByText('Owned child'))
  })

  it('omits optional controls and represents disabled actions', () => {
    render(<ChakraProvider><StandardWindowPreview component={{ props: {
      showIcon: false, showCloseButton: false,
      actionButtons: [{ id: 'refresh', icon: 'LV_SYMBOL_REFRESH', enabled: false }],
    } }} /></ChakraProvider>)
    expect(screen.queryByLabelText('Window icon')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close window' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Window action refresh' })).toBeDisabled()
  })

  it('closes its owner in browser mode', () => {
    render(<ChakraProvider><StandardWindowPreview mode="browser" component={{ props: {
      title: 'Closable', showCloseButton: true,
    } }} /></ChakraProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Close window' }))
    expect(screen.getByTestId('standard-window')).not.toBeVisible()
  })
})
