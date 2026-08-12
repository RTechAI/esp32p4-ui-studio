import React from 'react'
import { render, screen } from '@testing-library/react'
import SpinnerPanel from './SpinnerPanel'

jest.mock('~components/inspector/controls/NumberControl', () =>
  function MockNumberControl({ name, label }: { name: string; label: string }) { return (
    <label>
      {label}
      <input aria-label={label} name={name} />
    </label>
  ) },
)

jest.mock('~components/inspector/controls/ColorsControl', () =>
  function MockColorsControl({ name, label }: { name: string; label: string }) { return (
    <label>
      {label}
      <input aria-label={label} name={name} />
    </label>
  ) },
)

describe('Native Spinner Inspector', () => {
  it('exposes only supported native animation and style properties', () => {
    render(<SpinnerPanel />)

    expect(screen.getByLabelText('Duration (ms)')).toHaveAttribute(
      'name',
      'duration',
    )
    expect(screen.getByLabelText('Arc Length (degrees)')).toHaveAttribute(
      'name',
      'arcLength',
    )
    expect(screen.getByLabelText('Arc Width')).toHaveAttribute(
      'name',
      'arcWidth',
    )
    expect(screen.getByLabelText('Background Width')).toHaveAttribute(
      'name',
      'backgroundWidth',
    )
    expect(screen.getByLabelText('Opacity (%)')).toHaveAttribute(
      'name',
      'opacity',
    )
    expect(screen.getByLabelText('Accent Colour')).toHaveAttribute(
      'name',
      'accentColor',
    )
    expect(screen.getByLabelText('Background Colour')).toHaveAttribute(
      'name',
      'backgroundColor',
    )
    expect(screen.queryByLabelText('Label')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Speed')).not.toBeInTheDocument()
  })
})
