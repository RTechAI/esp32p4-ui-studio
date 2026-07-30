import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import StandardNumberInputPreview from './preview/StandardNumberInputPreview'

describe('Standard NumberInput preview interaction modes', () => {
  it.each(['canvas', 'browser'] as const)(
    '%s resolves the same semantic field and stepper roles',
    mode => {
      const { container } = render(
        <ChakraProvider>
          <StandardNumberInputPreview mode={mode} value={50} />
        </ChakraProvider>,
      )

      const field = screen.getByRole('spinbutton')
      const wrapperStyle = getComputedStyle(
        screen.getByTestId(`standard-number-input-${mode}`),
      )
      const fieldStyle = getComputedStyle(field)
      const incrementStyle = getComputedStyle(
        container.querySelector('[aria-label="Increment value"]')!,
      )
      const decrementStyle = getComputedStyle(
        container.querySelector('[aria-label="Decrement value"]')!,
      )
      const verticalDividerStyle = getComputedStyle(
        screen.getByTestId('standard-number-input-vertical-divider'),
      )
      const horizontalDividerStyle = getComputedStyle(
        screen.getByTestId('standard-number-input-horizontal-divider'),
      )

      expect(wrapperStyle.backgroundColor).toBe('rgb(30, 35, 40)')
      expect(wrapperStyle.borderTopWidth).toBe('1px')
      expect(wrapperStyle.borderRightWidth).toBe('1px')
      expect(wrapperStyle.borderBottomWidth).toBe('1px')
      expect(wrapperStyle.borderLeftWidth).toBe('1px')
      expect(wrapperStyle.borderColor).toBe('#f2a900')
      expect(wrapperStyle.borderRadius).toBe('6px')
      expect(wrapperStyle.overflow).toBe('hidden')
      expect(fieldStyle.backgroundColor).toBe('rgb(30, 35, 40)')
      expect(fieldStyle.color).toBe('rgb(245, 245, 245)')
      expect(fieldStyle.borderColor).toBe('#f2a900')
      expect(fieldStyle.borderTopWidth).toBe('0px')
      expect(fieldStyle.borderRightWidth).toBe('0px')
      expect(fieldStyle.borderBottomWidth).toBe('0px')
      expect(fieldStyle.borderLeftWidth).toBe('0px')
      expect(incrementStyle.backgroundColor).toBe('rgb(42, 49, 56)')
      expect(incrementStyle.color).toBe('rgb(245, 245, 245)')
      expect(Number.parseFloat(incrementStyle.borderTopWidth)).toBe(0)
      expect(Number.parseFloat(incrementStyle.borderRightWidth)).toBe(0)
      expect(Number.parseFloat(incrementStyle.borderBottomWidth)).toBe(0)
      expect(Number.parseFloat(incrementStyle.borderLeftWidth)).toBe(0)
      expect(decrementStyle.backgroundColor).toBe('rgb(42, 49, 56)')
      expect(decrementStyle.color).toBe('rgb(245, 245, 245)')
      expect(Number.parseFloat(decrementStyle.borderTopWidth)).toBe(0)
      expect(Number.parseFloat(decrementStyle.borderRightWidth)).toBe(0)
      expect(Number.parseFloat(decrementStyle.borderBottomWidth)).toBe(0)
      expect(Number.parseFloat(decrementStyle.borderLeftWidth)).toBe(0)
      expect(verticalDividerStyle.width).toBe('1px')
      expect(verticalDividerStyle.backgroundColor).toBe('rgb(242, 169, 0)')
      expect(horizontalDividerStyle.height).toBe('1px')
      expect(horizontalDividerStyle.backgroundColor).toBe('rgb(242, 169, 0)')

      fireEvent.focus(field)
      const focusedFieldStyle = getComputedStyle(field)
      expect(focusedFieldStyle.borderTopWidth).toBe('0px')
      expect(focusedFieldStyle.outlineWidth).toBe('')
      expect(['', 'none']).toContain(focusedFieldStyle.boxShadow)
    },
  )

  it('Canvas uses serialized configuration and temporary local state', () => {
    const serialized = {
      value: 20,
      min: -50,
      max: 50,
      step: 5,
      precision: 0,
    }
    render(
      <ChakraProvider>
        <StandardNumberInputPreview mode="canvas" {...serialized} />
      </ChakraProvider>,
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue('20')
    expect(input).toHaveAttribute('aria-valuemin', '-50')
    expect(input).toHaveAttribute('aria-valuemax', '50')

    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveValue('25')
    expect(serialized.value).toBe(20)
  })

  it('Browser supports increment and decrement without mutating serialized data', () => {
    const serialized = { value: 10, min: 0, max: 100, step: 2 }
    render(
      <ChakraProvider>
        <StandardNumberInputPreview mode="browser" {...serialized} />
      </ChakraProvider>,
    )
    const input = screen.getByRole('spinbutton')

    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveValue('12')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input).toHaveValue('10')
    expect(serialized.value).toBe(10)
  })

  it('supports temporary typed changes and configured decimal formatting', () => {
    const serialized = { value: 1.5, min: 0, max: 10, step: 0.25, precision: 2 }
    render(
      <ChakraProvider>
        <StandardNumberInputPreview mode="browser" {...serialized} />
      </ChakraProvider>,
    )
    const input = screen.getByRole('spinbutton')

    expect(input).toHaveValue('1.50')
    fireEvent.change(input, { target: { value: '2.75' } })
    expect(input).toHaveValue('2.75')
    expect(serialized.value).toBe(1.5)
  })

  it('resets Canvas and Browser local state when serialized value changes', () => {
    const view = render(
      <ChakraProvider>
        <StandardNumberInputPreview
          mode="canvas"
          value={10}
          min={0}
          max={100}
          step={5}
        />
      </ChakraProvider>,
    )
    const input = screen.getByRole('spinbutton')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveValue('15')

    view.rerender(
      <ChakraProvider>
        <StandardNumberInputPreview
          mode="browser"
          value={70}
          min={0}
          max={100}
          step={5}
        />
      </ChakraProvider>,
    )
    expect(input).toHaveValue('70')
  })

  it('establishes the Canvas drag boundary without disabling interaction', () => {
    render(
      <ChakraProvider>
        <StandardNumberInputPreview mode="canvas" value={50} />
      </ChakraProvider>,
    )
    const control = screen.getByTestId('standard-number-input-control')

    expect(control).toHaveClass('forgeui-canvas-control-interactive')
    expect(fireEvent.dragStart(control)).toBe(false)
    expect(screen.getByRole('spinbutton')).not.toBeDisabled()
  })

  it('preserves disabled and read-only presentation', () => {
    render(
      <ChakraProvider>
        <StandardNumberInputPreview
          mode="browser"
          value={50}
          isDisabled
          isReadOnly
        />
      </ChakraProvider>,
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('readonly')
  })
})
