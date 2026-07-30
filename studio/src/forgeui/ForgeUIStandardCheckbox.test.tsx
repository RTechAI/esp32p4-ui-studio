import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import StandardCheckboxPreview from './preview/StandardCheckboxPreview'
import { getForgeUIStandardCheckboxText } from './ForgeUIStandardCheckbox'

describe('Standard Checkbox preview behavior', () => {
  it('preserves label and serialized initial checked state', () => {
    render(
      <ChakraProvider>
        <StandardCheckboxPreview
          initialChecked
          label="Enable logging"
        />
      </ChakraProvider>,
    )

    expect(screen.getByText('Enable logging')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('toggles locally without changing its label', () => {
    render(
      <ChakraProvider>
        <StandardCheckboxPreview
          initialChecked={false}
          label="Record diagnostics"
        />
      </ChakraProvider>,
    )
    const control = screen.getByRole('checkbox')

    fireEvent.click(control)
    expect(control).toBeChecked()
    expect(screen.getByText('Record diagnostics')).toBeInTheDocument()
    fireEvent.click(control)
    expect(control).not.toBeChecked()
  })

  it('keeps Canvas pointer-down inside the control', () => {
    const parentPointerDown = jest.fn()
    render(
      <ChakraProvider>
        <div onPointerDown={parentPointerDown}>
          <StandardCheckboxPreview
            mode="canvas"
            initialChecked={false}
            label=""
          />
        </div>
      </ChakraProvider>,
    )

    const interaction = screen.getByTestId(
      'standard-checkbox-canvas-interaction',
    )
    fireEvent.pointerDown(interaction)

    expect(parentPointerDown).not.toHaveBeenCalled()
  })

  it('suppresses only empty and legacy placeholder wording', () => {
    expect(getForgeUIStandardCheckboxText({})).toBe('')
    expect(getForgeUIStandardCheckboxText({
      children: 'Label checkbox',
    })).toBe('')
    expect(getForgeUIStandardCheckboxText({
      text: 'Enable logging',
    })).toBe('Enable logging')
  })

  it('resets when serialized checked state changes', () => {
    const view = render(
      <ChakraProvider>
        <StandardCheckboxPreview
          initialChecked={false}
          label="Option"
        />
      </ChakraProvider>,
    )
    const control = screen.getByRole('checkbox')
    fireEvent.click(control)
    expect(control).toBeChecked()

    view.rerender(
      <ChakraProvider>
        <StandardCheckboxPreview
          initialChecked
          label="Option"
        />
      </ChakraProvider>,
    )
    expect(control).toBeChecked()

    view.rerender(
      <ChakraProvider>
        <StandardCheckboxPreview
          initialChecked={false}
          label="Option"
        />
      </ChakraProvider>,
    )
    expect(control).not.toBeChecked()
  })

  it('keeps disabled controls unchanged', () => {
    render(
      <ChakraProvider>
        <StandardCheckboxPreview
          initialChecked={false}
          isDisabled
          label="Disabled option"
        />
      </ChakraProvider>,
    )

    expect(screen.getByRole('checkbox')).toBeDisabled()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })
})
