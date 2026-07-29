import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import ImagePreview from '../components/editor/previews/ImagePreview'

const image = (props: Record<string, unknown>): IComponent => ({
  id: 'image',
  parent: 'root',
  type: 'Image',
  componentName: 'Logo Image',
  props: {
    x: 20,
    y: 30,
    w: 160,
    h: 120,
    ...props,
  },
  children: [],
})

describe('Standard Image preview parity', () => {
  it('Canvas displays the serialized source and presentation mode', () => {
    render(
      <ChakraProvider>
        <ImagePreview component={image({
          src: '/assets/logo.png',
          objectFit: 'cover',
          alt: 'Logo',
        })} />
      </ChakraProvider>,
    )

    const preview = screen.getByRole('img')
    expect(preview).toHaveAttribute('src', '/assets/logo.png')
    expect(preview).toHaveStyle({ objectFit: 'cover' })
    expect(preview).toHaveAttribute('draggable', 'false')
  })

  it('remains non-interactive and independent from component naming', () => {
    const component = image({ src: '/assets/product.png' })
    component.componentName = 'Renamed Image'
    render(
      <ChakraProvider>
        <ImagePreview component={component} />
      </ChakraProvider>,
    )

    const preview = screen.getByRole('img')
    expect(preview).toHaveAttribute('src', '/assets/product.png')
    expect(preview).toHaveStyle({ pointerEvents: 'none' })
  })
})
