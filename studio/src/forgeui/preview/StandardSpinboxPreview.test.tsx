import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import StandardSpinboxPreview from './StandardSpinboxPreview'

const renderPreview = (
  props: Record<string, unknown>,
  mode: 'canvas' | 'browser' = 'browser',
  onValueChange?: (value: number) => void,
) =>
  render(
    <ChakraProvider>
      <StandardSpinboxPreview
        mode={mode}
        props={props}
        onValueChange={onValueChange}
      />
    </ChakraProvider>,
  )

describe('Standard Spinbox preview', () => {
  it('formats signed decimals and marks the selected digit', () => {
    renderPreview({
      min: -9999,
      max: 9999,
      value: -1234,
      digitCount: 4,
      decimalPlaces: 2,
      cursorPosition: 1,
    })
    expect(screen.getByTestId('standard-spinbox-value')).toHaveTextContent('-12.34')
    expect(document.querySelectorAll('[data-selected="true"]')).toHaveLength(1)
  })

  it('supports browser buttons, rollover and keyboard without page scrolling', () => {
    renderPreview({ min: 0, max: 9, value: 9, rollover: true })
    const preview = screen.getByTestId('standard-spinbox-browser')
    fireEvent.click(screen.getByTestId('standard-spinbox-increment'))
    expect(preview).toHaveAttribute('data-spinbox-value', '0')
    const prevented = !fireEvent.keyDown(preview, { key: 'ArrowDown' })
    expect(prevented).toBe(true)
    expect(preview).toHaveAttribute('data-spinbox-value', '9')
  })

  it('routes Canvas controls through the persisted-value callback', () => {
    const onValueChange = jest.fn()
    renderPreview({ value: 5, step: 10, min: -100, max: 100 }, 'canvas', onValueChange)
    fireEvent.click(screen.getByTestId('standard-spinbox-increment'))
    expect(onValueChange).toHaveBeenCalledWith(15)
    fireEvent.click(screen.getByTestId('standard-spinbox-decrement'))
    expect(onValueChange).toHaveBeenLastCalledWith(-5)
    expect(screen.getByTestId('standard-spinbox-increment'))
      .toHaveClass('forgeui-canvas-control-interactive')
    expect(fireEvent.dragStart(screen.getByTestId('standard-spinbox-increment')))
      .toBe(false)
  })

  it.each([
    ['rolls over the maximum', { min: 0, max: 9, value: 9, rollover: true }, 0],
    ['clamps at the maximum', { min: 0, max: 9, value: 9 }, 9],
    ['increments decimal backing values', {
      min: 0, max: 99999, value: 1234, step: 10, decimalPlaces: 2,
    }, 1244],
    ['crosses signed zero symmetrically', {
      min: -100, max: 100, value: -3, step: 10,
    }, 3],
  ])('%s', (_, props, expected) => {
    renderPreview(props)
    fireEvent.click(screen.getByTestId('standard-spinbox-increment'))
    expect(screen.getByTestId('standard-spinbox-browser'))
      .toHaveAttribute('data-spinbox-value', String(expected))
  })

  it('focuses from the value field and supports keyboard stepping', () => {
    renderPreview({ min: 0, max: 10, value: 5 })
    const preview = screen.getByRole('spinbutton')
    fireEvent.click(screen.getByTestId('standard-spinbox-value'))
    expect(preview).toHaveFocus()
    fireEvent.keyDown(preview, { key: 'ArrowUp' })
    expect(preview).toHaveAttribute('data-spinbox-value', '6')
  })
})
