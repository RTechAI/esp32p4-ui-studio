import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import SpinboxPanel from './SpinboxPanel'

jest.mock('~hooks/useForm', () => ({
  useForm: () => ({ setValueFromEvent: jest.fn() }),
}))
jest.mock('~hooks/usePropsSelector', () => () => 'right')
jest.mock('~components/inspector/controls/NumberControl', () =>
  ({ name, label }: { name: string; label: string }) => (
    <label>{label}<input aria-label={label} name={name} /></label>
  ),
)
jest.mock('~components/inspector/controls/SwitchControl', () =>
  ({ name, label }: { name: string; label: string }) => (
    <label>{label}<input aria-label={label} name={name} type="checkbox" /></label>
  ),
)
jest.mock('~components/inspector/controls/ColorsControl', () =>
  ({ name, label }: { name: string; label: string }) => (
    <label>{label}<input aria-label={label} name={name} /></label>
  ),
)

describe('Native Spinbox Inspector', () => {
  it('exposes normalized native value, format and appearance properties', () => {
    render(<ChakraProvider><SpinboxPanel /></ChakraProvider>)
    ;[
      ['Minimum', 'min'],
      ['Maximum', 'max'],
      ['Value', 'value'],
      ['Step (power of 10)', 'step'],
      ['Digit count', 'digitCount'],
      ['Decimal places', 'decimalPlaces'],
      ['Padding', 'padding'],
      ['Opacity (%)', 'opacity'],
      ['Background override', 'backgroundColor'],
      ['Selected digit override', 'selectedColor'],
    ].forEach(([label, name]) => {
      expect(screen.getByLabelText(label)).toHaveAttribute('name', name)
    })
    expect(screen.getByLabelText('Rollover')).toHaveAttribute(
      'name',
      'rollover',
    )
    expect(screen.getByLabelText('Visible')).toHaveAttribute('name', 'visible')
    expect(screen.queryByLabelText('Prefix')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Suffix')).not.toBeInTheDocument()
  })
})
