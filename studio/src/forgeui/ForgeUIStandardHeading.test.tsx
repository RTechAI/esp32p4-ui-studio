import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'

import HeadingPreview from '~components/editor/previews/HeadingPreview'
import { getPreviewDefaultProps } from '~utils/defaultProps'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import {
  FORGEUI_STANDARD_HEADING_DEFAULT_TEXT,
  getForgeUIStandardHeadingText,
} from './ForgeUIStandardHeading'

const heading = (
  props: Record<string, unknown> = {},
  componentName = 'Renamable Heading',
): IComponent => ({
  id: 'heading',
  parent: 'root',
  type: 'Heading',
  componentName,
  props,
  children: [],
})

const BrowserPreview = ({ component }: { component: IComponent }) => {
  const root: IComponent = {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: [component.id],
  }

  return <>{renderForgePreview({
    component: root,
    components: { root, [component.id]: component },
  })}</>
}

describe('standard Heading text', () => {
  it('serializes the current default and preserves legacy projects', () => {
    expect(getPreviewDefaultProps('Heading')).toMatchObject({
      headingText: FORGEUI_STANDARD_HEADING_DEFAULT_TEXT,
    })
    expect(getForgeUIStandardHeadingText({}))
      .toBe(FORGEUI_STANDARD_HEADING_DEFAULT_TEXT)
    expect(getForgeUIStandardHeadingText({ children: 'Legacy heading' }))
      .toBe('Legacy heading')

    const reloaded = JSON.parse(JSON.stringify(
      heading({ headingText: 'Saved heading' }),
    )) as IComponent
    expect(reloaded.props.headingText).toBe('Saved heading')
    expect(getForgeUIStandardHeadingText(reloaded.props)).toBe('Saved heading')
  })

  it('keeps displayed heading independent from component naming', () => {
    expect(getForgeUIStandardHeadingText(heading(
      { headingText: 'Visible heading' },
      'Different Component Name',
    ).props)).toBe('Visible heading')
  })

  it('shows saved and default headings in Canvas Preview', () => {
    const { rerender } = render(
      <ChakraProvider>
        <HeadingPreview component={heading({
          headingText: 'Canvas heading',
          color: 'tomato',
          textAlign: 'right',
        })} />
      </ChakraProvider>,
    )
    expect(screen.getByText('Canvas heading')).toBeInTheDocument()

    rerender(
      <ChakraProvider>
        <HeadingPreview component={heading()} />
      </ChakraProvider>,
    )
    expect(screen.getByText('Heading title')).toBeInTheDocument()
  })

  it('shows saved and default headings in Browser Preview', () => {
    const { rerender } = render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserPreview component={heading({
            headingText: 'Browser heading',
          })} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )
    expect(screen.getByText('Browser heading')).toBeInTheDocument()

    rerender(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserPreview component={heading()} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )
    expect(screen.getByText('Heading title')).toBeInTheDocument()
  })
})
