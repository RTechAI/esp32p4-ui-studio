import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import StandardRadioPreview from './preview/StandardRadioPreview'

describe('Standard Radio preview behavior', () => {
  it('renders no default or legacy Radio label', () => {
    render(
      <ChakraProvider>
        <StandardRadioPreview initialSelected={false} label="Radio" />
      </ChakraProvider>,
    )

    expect(screen.queryByText('Radio')).not.toBeInTheDocument()
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('preserves serialized label and initial selection', () => {
    render(
      <ChakraProvider>
        <StandardRadioPreview
          initialSelected
          label="Automatic mode"
        />
      </ChakraProvider>,
    )

    expect(screen.getByText('Automatic mode')).toBeInTheDocument()
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('toggles independently and locally', () => {
    render(
      <ChakraProvider>
        <StandardRadioPreview
          initialSelected={false}
          label="Manual mode"
        />
      </ChakraProvider>,
    )
    const control = screen.getByRole('radio')

    fireEvent.click(control)
    expect(control).toBeChecked()
    fireEvent.click(control)
    expect(control).not.toBeChecked()
  })

  it('resets when serialized selection changes', () => {
    const view = render(
      <ChakraProvider>
        <StandardRadioPreview initialSelected={false} label="Mode" />
      </ChakraProvider>,
    )
    const control = screen.getByRole('radio')
    fireEvent.click(control)
    expect(control).toBeChecked()

    view.rerender(
      <ChakraProvider>
        <StandardRadioPreview initialSelected label="Mode" />
      </ChakraProvider>,
    )
    expect(control).toBeChecked()

    view.rerender(
      <ChakraProvider>
        <StandardRadioPreview initialSelected={false} label="Mode" />
      </ChakraProvider>,
    )
    expect(control).not.toBeChecked()
  })

  it('does not introduce grouping between independent previews', () => {
    render(
      <ChakraProvider>
        <StandardRadioPreview initialSelected={false} label="First" />
        <StandardRadioPreview initialSelected={false} label="Second" />
      </ChakraProvider>,
    )
    const controls = screen.getAllByRole('radio')

    fireEvent.click(controls[0])
    fireEvent.click(controls[1])
    expect(controls[0]).toBeChecked()
    expect(controls[1]).toBeChecked()
  })
})
