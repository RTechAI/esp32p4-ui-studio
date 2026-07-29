import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import StandardSwitchPreview from './preview/StandardSwitchPreview'

describe('Standard Switch preview behavior', () => {
  it('uses serialized initial checked state and toggles locally', () => {
    render(
      <ChakraProvider>
        <StandardSwitchPreview initialChecked />
      </ChakraProvider>,
    )
    const control = screen.getByRole('checkbox')

    expect(control).toBeChecked()
    fireEvent.click(control)
    expect(control).not.toBeChecked()
    fireEvent.click(control)
    expect(control).toBeChecked()
  })

  it('resets from serialized state and ignores component naming', () => {
    const view = render(
      <ChakraProvider>
        <StandardSwitchPreview initialChecked={false} />
      </ChakraProvider>,
    )
    const control = screen.getByRole('checkbox')
    fireEvent.click(control)
    expect(control).toBeChecked()

    view.rerender(
      <ChakraProvider>
        <StandardSwitchPreview initialChecked={false} />
      </ChakraProvider>,
    )
    expect(control).toBeChecked()

    view.rerender(
      <ChakraProvider>
        <StandardSwitchPreview initialChecked />
      </ChakraProvider>,
    )
    expect(control).toBeChecked()
  })

  it('preserves disabled preview behavior', () => {
    render(
      <ChakraProvider>
        <StandardSwitchPreview initialChecked={false} isDisabled />
      </ChakraProvider>,
    )
    const control = screen.getByRole('checkbox')

    expect(control).toBeDisabled()
    expect(control).not.toBeChecked()
  })
})
