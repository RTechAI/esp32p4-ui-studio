import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'

import StandardCanvasPreview from './preview/StandardCanvasPreview'
import StandardTabViewPreview from './preview/StandardTabViewPreview'
import StandardTileViewPreview from './preview/StandardTileViewPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'

const component = (
  type: ComponentType,
  props: Record<string, unknown> = {},
): IComponent => ({
  id: type.toLowerCase(),
  parent: 'root',
  type,
  props: { x: 20, y: 30, w: 240, h: 120, ...props },
  children: [],
})

describe('Standard Canvas, TabView, and TileView parity previews', () => {
  const palette = FG_PREVIEW_PALETTES.cyber_teal

  it('renders Canvas as the same empty semantic LVGL surface', () => {
    const { container } = render(
      <ChakraProvider>
        <StandardCanvasPreview
          component={component('Canvas')}
          palette={palette}
        />
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-canvas-preview')).toHaveStyle({
      background: '#0F2A30',
      border: '2px solid #14B8A6',
      borderRadius: '8px',
      overflow: 'hidden',
    })
    expect(container.querySelector('svg')).toBeNull()
  })

  it('uses serialized TabView selection and native-style tab switching', () => {
    render(
      <ChakraProvider>
        <StandardTabViewPreview
          component={component('Tabview', { selectedIndex: 1 })}
          palette={palette}
        />
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-tabview-preview')).toHaveStyle({
      background: '#0F2A30',
      border: '1px solid #14B8A6',
      borderRadius: '0px',
    })
    expect(screen.getByTestId('standard-tabview-tab-bar'))
      .toHaveStyle({ height: '34px' })
    expect(screen.getByTestId('standard-tabview-tab-1'))
      .toHaveAttribute('data-selected', 'true')
    expect(screen.getByTestId('standard-tabview-content'))
      .toHaveTextContent('Tab 2 content')

    fireEvent.click(screen.getByTestId('standard-tabview-tab-2'))

    expect(screen.getByTestId('standard-tabview-tab-2'))
      .toHaveAttribute('data-selected', 'true')
    expect(screen.getByTestId('standard-tabview-content'))
      .toHaveTextContent('Tab 3 content')
  })

  it('uses serialized TileView selection and switches the visible state', () => {
    render(
      <ChakraProvider>
        <StandardTileViewPreview
          component={component('Tileview', {
            initialColumn: 1,
            initialRow: 0,
          })}
          palette={palette}
        />
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-tileview-preview')).toHaveStyle({
      background: '#0F2A30',
      border: '1px solid #14B8A6',
      borderRadius: '10px',
      padding: '8px',
      gap: '6px',
    })
    expect(screen.getByTestId('standard-tileview-tile-1'))
      .toHaveAttribute('data-selected', 'true')

    fireEvent.click(screen.getByTestId('standard-tileview-tile-2'))

    expect(screen.getByTestId('standard-tileview-tile-1'))
      .toHaveAttribute('data-selected', 'false')
    expect(screen.getByTestId('standard-tileview-tile-2'))
      .toHaveAttribute('data-selected', 'true')
  })
})
