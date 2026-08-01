import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'

import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

const component = (
  id: string,
  type: ComponentType,
  props: Record<string, unknown>,
  parent = 'root',
  children: string[] = [],
): IComponent => ({ id, type, parent, props, children })

describe('Heading, Icon, Box and Divider Browser proof models', () => {
  it('round-trips serialized state and nests Box children in Browser Preview', () => {
    const box = component('box', 'Box', {
      x: 40, y: 120, w: 360, h: 220,
      backgroundColor: '#123456', borderColor: '#22D3EE',
      borderWidth: 5, borderRadius: 18, opacity: 90,
    }, 'root', ['divider'])
    const divider = component('divider', 'Divider', {
      x: 20, y: 30, w: 280, h: 6,
      borderColor: '#F2A900', opacity: 75,
    }, 'box')
    const icon = component('icon', 'Icon', {
      x: 460, y: 150, w: 96, h: 96,
      icon: 'FiSettings', boxSize: 64, color: '#22D3EE',
    })
    const root = component('root', 'Box', {}, 'root', ['box', 'icon'])
    const components = JSON.parse(JSON.stringify({ root, box, divider, icon })) as IComponents

    const BrowserProof = () => <>{renderForgePreview({
      component: components.root,
      components,
    })}</>

    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserProof />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    const boxPreview = screen.getByTestId('standard-box-preview')
    expect(boxPreview).toContainElement(screen.getByTestId('standard-divider-preview'))
    expect(boxPreview).toHaveStyle({ borderRadius: '18px' })
    expect(screen.getByTestId('standard-icon-preview')).toBeVisible()
    expect(components.box.props.backgroundColor).toBe('#123456')
    expect(components.divider.props.h).toBe(6)
  })
})
