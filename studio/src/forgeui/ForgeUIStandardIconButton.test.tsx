import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import StandardIconButtonPreview from './preview/StandardIconButtonPreview'

const component = (props: Record<string, unknown> = {}): IComponent => ({
  id: 'settings',
  parent: 'root',
  type: 'IconButton',
  componentName: 'Settings Icon Button',
  props: {
    icon: 'FiSettings',
    'aria-label': 'Settings',
    ...props,
  },
  children: [],
})

describe('Standard IconButton preview modes', () => {
  it('leaves Canvas pointer gestures to the selectable editor wrapper', () => {
    render(
      <ChakraProvider>
        <StandardIconButtonPreview
          component={component()}
          mode="canvas"
        />
      </ChakraProvider>,
    )

    const button = screen.getByRole('button', { name: 'Settings' })
    expect(button).toHaveStyle('pointer-events: none')
    expect(button).toHaveAttribute('tabindex', '-1')
    expect(button).toHaveAttribute('data-pressed', 'false')
  })

  it('provides temporary Browser Preview pressed feedback', () => {
    const serialized = component()
    render(
      <ChakraProvider>
        <StandardIconButtonPreview
          component={serialized}
          mode="browser"
          surface="#111111"
          border="#22d3ee"
        />
      </ChakraProvider>,
    )

    const button = screen.getByRole('button', { name: 'Settings' })
    fireEvent.pointerDown(button, { pointerId: 1 })
    expect(button).toHaveAttribute('data-pressed', 'true')
    fireEvent.pointerUp(button, { pointerId: 1 })
    expect(button).toHaveAttribute('data-pressed', 'false')
    expect(serialized.props).toEqual(expect.objectContaining({
      icon: 'FiSettings',
      'aria-label': 'Settings',
    }))
  })

  it('preserves disabled Browser Preview behavior', () => {
    render(
      <ChakraProvider>
        <StandardIconButtonPreview
          component={component({ isDisabled: true })}
          mode="browser"
        />
      </ChakraProvider>,
    )

    const button = screen.getByRole('button', { name: 'Settings' })
    expect(button).toBeDisabled()
    fireEvent.pointerDown(button, { pointerId: 1 })
    expect(button).toHaveAttribute('data-pressed', 'false')
  })
})
