import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import StandardListPreview from './StandardListPreview'

describe('Standard List preview', () => {
  it('renders serialized items using the shared list model', () => {
    render(
      <ChakraProvider>
        <StandardListPreview props={{
          title: 'System',
          items: 'Network\nDisplay\nAbout',
          itemHeight: 52,
        }} />
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-list-title')).toHaveTextContent('System')
    expect(screen.getAllByTestId('standard-list-item')).toHaveLength(3)
    expect(screen.getByText('Display')).toBeInTheDocument()
  })
})
