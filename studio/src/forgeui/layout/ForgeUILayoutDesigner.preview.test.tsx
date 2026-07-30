import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render } from '@testing-library/react'
import {
  ForgeThemeProvider,
} from '~forgeui/theme/ForgeThemeContext'
import {
  renderForgePreview,
} from '~forgeui/preview/forgePreviewRenderer'
import {
  forgeUIDashboardTemplate,
} from './ForgeUILayoutDesigner'

const BrowserDashboard = () => {
  const components: IComponents = {
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: forgeUIDashboardTemplate.layout
        .map((_, index) => `component-${index}`),
    },
  }
  forgeUIDashboardTemplate.layout.forEach((item, index) => {
    components[`component-${index}`] = {
      id: `component-${index}`,
      parent: 'root',
      type: item.type,
      props: item.props,
      children: [],
    }
  })
  return <>{renderForgePreview({
    component: components.root,
    components,
  })}</>
}

describe('Dashboard Layout Designer Browser Preview', () => {
  it('renders every smart region as a normal themed Box', () => {
    const { container } = render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserDashboard />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )
    const regions = container.querySelectorAll('[data-layout-region]')
    expect(regions).toHaveLength(5)
    expect(Array.from(regions).map(region =>
      region.getAttribute('data-layout-region')
    )).toEqual([
      'dashboard.header',
      'dashboard.status',
      'dashboard.main',
      'dashboard.controls',
      'dashboard.footer',
    ])
    regions.forEach(region => {
      expect(region).toHaveStyle({
        position: 'absolute',
      })
    })
  })
})
