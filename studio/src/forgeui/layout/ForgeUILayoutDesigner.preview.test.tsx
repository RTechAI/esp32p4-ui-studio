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
  ForgeUILayoutTemplate,
  forgeUILayoutTemplates,
} from './ForgeUILayoutDesigner'

const BrowserLayout = ({
  definition,
}: {
  definition: ForgeUILayoutTemplate
}) => {
  const components: IComponents = {
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: definition.layout
        .map((_, index) => `component-${index}`),
    },
  }
  definition.layout.forEach((item, index) => {
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

describe('Layout Designer Browser Preview', () => {
  it.each(forgeUILayoutTemplates)(
    'renders every $name smart region as a normal themed Box',
    definition => {
    const { container } = render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserLayout definition={definition} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )
    const regions = container.querySelectorAll('[data-layout-region]')
    const expected = definition.layout
      .filter(item => item.type === 'Box')
      .map(item => String(item.props.layoutRegionKey))
    expect(regions).toHaveLength(expected.length)
    expect(Array.from(regions).map(region =>
      region.getAttribute('data-layout-region')
    )).toEqual(expected)
    regions.forEach(region => {
      expect(region).toHaveStyle({
        position: 'absolute',
      })
    })
    },
  )
})
