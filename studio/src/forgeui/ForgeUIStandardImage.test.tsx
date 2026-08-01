import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import ImagePreview from '../components/editor/previews/ImagePreview'
import { getForgeUIStandardImagePresentation } from './ForgeUIStandardImage'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

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

const BrowserImage = ({ component }: { component: IComponent }) => {
  const root: IComponent = {
    id: 'root', parent: 'root', type: 'Box', props: {},
    children: [component.id],
  }
  return <>{renderForgePreview({
    component: root,
    components: { root, [component.id]: component },
  })}</>
}

describe('Standard Image preview parity', () => {
  it('Canvas displays the serialized source and presentation mode', () => {
    render(
      <ChakraProvider>
        <ImagePreview component={image({
          src: '/assets/logo.png',
          imageFit: 'cover',
          sourceWidth: 640,
          sourceHeight: 360,
          alt: 'Logo',
        })} />
      </ChakraProvider>,
    )

    const preview = screen.getByRole('img')
    expect(preview).toHaveAttribute('src', '/assets/logo.png')
    expect(screen.getByTestId('standard-image-preview'))
      .toHaveAttribute('data-image-fit', 'cover')
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

  it('centres scale and applies opacity and visibility', () => {
    render(
      <ChakraProvider>
        <ImagePreview component={image({
          src: '/assets/product.png',
          imageFit: 'native',
          sourceWidth: 320,
          sourceHeight: 200,
          opacity: 0.4,
          visible: false,
        })} />
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-image-preview')
    expect(preview.querySelector('img')).toHaveStyle({
      width: '320px',
      height: '200px',
    })
    expect(preview).toHaveStyle({
      opacity: '0.4',
      visibility: 'hidden',
    })
  })

  it.each([
    ['landscape in landscape', 640, 360, 240, 160, 'contain', 96, 240, 135],
    ['landscape in portrait', 640, 360, 120, 240, 'contain', 48, 120, 68],
    ['portrait in landscape', 360, 640, 240, 160, 'contain', 64, 90, 160],
    ['smaller source', 80, 60, 240, 160, 'contain', 683, 213, 160],
    ['cover selected', 640, 360, 240, 160, 'cover', 114, 285, 160],
    ['native selected', 640, 360, 240, 160, 'native', 256, 640, 360],
  ])('normalizes %s target geometry', (
    _, sourceWidth, sourceHeight, w, h, imageFit,
    lvglScale, targetWidth, targetHeight,
  ) => {
    expect(getForgeUIStandardImagePresentation(image({
      sourceWidth, sourceHeight, w, h, imageFit,
    }))).toMatchObject({
      sourceWidth,
      sourceHeight,
      componentWidth: w,
      componentHeight: h,
      fit: imageFit,
      lvglScale,
      targetWidth,
      targetHeight,
    })
  })

  it('round-trips fit and source dimensions through project serialization', () => {
    const saved = JSON.stringify(image({
      imageFit: 'contain',
      sourceWidth: 1024,
      sourceHeight: 600,
      w: 240,
      h: 160,
      opacity: 0.6,
      visible: false,
    }))
    const reloaded = JSON.parse(saved) as IComponent
    expect(getForgeUIStandardImagePresentation(reloaded)).toMatchObject({
      fit: 'contain',
      sourceWidth: 1024,
      sourceHeight: 600,
      lvglScale: 60,
      targetWidth: 240,
      targetHeight: 141,
      opacity: 0.6,
      visible: false,
    })
  })

  it('uses the same quantized target in Browser Preview', () => {
    const component = image({
      w: 240, h: 160,
      sourceWidth: 640, sourceHeight: 360,
      imageFit: 'contain',
    })
    render(
      <ChakraProvider>
        <ForgeThemeProvider><BrowserImage component={component} /></ForgeThemeProvider>
      </ChakraProvider>,
    )
    const preview = screen.getByTestId('standard-image-preview')
    expect(preview).toHaveAttribute('data-image-fit', 'contain')
    expect(preview).toHaveAttribute('data-lvgl-scale', '96')
    expect(preview.querySelector('img')).toHaveStyle({
      width: '240px',
      height: '135px',
    })
    expect(preview.parentElement).toHaveStyle({
      width: '240px',
      height: '160px',
    })
  })
})
