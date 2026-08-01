import React from 'react'
import { render, screen } from '@testing-library/react'

import IconButtonPanel from './IconButtonPanel'

jest.mock('~hooks/usePropsSelector', () => ({
  __esModule: true,
  default: (name: string) => name === 'size' ? 'md' : 'solid',
}))
jest.mock('~components/inspector/controls/IconControl', () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <div data-control={name} />,
}))
jest.mock('~components/inspector/controls/SwitchControl', () => ({
  __esModule: true,
  default: ({ name, label }: { name: string; label: string }) => (
    <div data-control={name}>{label}</div>
  ),
}))
jest.mock('~components/inspector/controls/SizeControl', () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <div data-control={name} />,
}))
jest.mock('~components/inspector/controls/ColorsControl', () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <div data-control={name} />,
}))
jest.mock('~components/inspector/controls/VariantsControl', () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <div data-control={name} />,
}))

describe('IconButtonPanel', () => {
  it('exposes serialized icon selection and disabled state', () => {
    const { container } = render(<IconButtonPanel />)

    expect(container.querySelector('[data-control="icon"]')).not.toBeNull()
    expect(container.querySelector('[data-control="isDisabled"]')).not.toBeNull()
    expect(screen.getByText('Disabled')).toBeInTheDocument()
  })
})
