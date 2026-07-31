import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'

import ButtonPreview from '~components/editor/previews/ButtonPreview'
import StandardButtonPreview from './preview/StandardButtonPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { getPreviewDefaultProps } from '~utils/defaultProps'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import {
  FORGEUI_STANDARD_BUTTON_DEFAULT_TEXT,
  getForgeUIStandardButtonText,
} from './ForgeUIStandardButton'

const button = (
  props: Record<string, unknown> = {},
  componentName = 'Renamable Button',
): IComponent => ({
  id: 'button',
  parent: 'root',
  type: 'Button',
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

describe('standard Button text', () => {
  it('serializes the new default and resolves legacy missing fields', () => {
    expect(getPreviewDefaultProps('Button')).toMatchObject({
      buttonText: FORGEUI_STANDARD_BUTTON_DEFAULT_TEXT,
    })
    expect(getForgeUIStandardButtonText({}))
      .toBe(FORGEUI_STANDARD_BUTTON_DEFAULT_TEXT)
    expect(getForgeUIStandardButtonText({ children: 'Legacy text' }))
      .toBe('Legacy text')

    const reloaded = JSON.parse(JSON.stringify(
      button({ buttonText: 'Saved text' }),
    )) as IComponent
    expect(reloaded.props.buttonText).toBe('Saved text')
    expect(getForgeUIStandardButtonText(reloaded.props)).toBe('Saved text')
  })

  it('keeps visual text independent from the component name', () => {
    expect(getForgeUIStandardButtonText(
      button({ buttonText: 'Visible text' }, 'Completely Different Name').props,
    )).toBe('Visible text')
  })

  it('shows saved and legacy-default text in Canvas Preview', () => {
    const { rerender } = render(
      <ChakraProvider>
        <ButtonPreview component={button({ buttonText: 'Canvas text' })} />
      </ChakraProvider>,
    )
    expect(screen.getByRole('button')).toHaveTextContent('Canvas text')

    rerender(
      <ChakraProvider>
        <ButtonPreview component={button()} />
      </ChakraProvider>,
    )
    expect(screen.getByRole('button')).toHaveTextContent('Button text')
  })

  it('shows saved and legacy-default text in Browser Preview', () => {
    const { rerender } = render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserPreview component={button({ buttonText: 'Browser text' })} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )
    expect(screen.getByText('Browser text')).toBeInTheDocument()

    rerender(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserPreview component={button()} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )
    expect(screen.getByText('Button text')).toBeInTheDocument()
  })

  it('uses semantic Button colors instead of legacy literal overrides', () => {
    render(
      <ChakraProvider>
        <StandardButtonPreview
          component={button({ buttonText: 'Semantic', color: '#FFFFFF' })}
          palette={FG_PREVIEW_PALETTES.cyber_teal}
        />
      </ChakraProvider>,
    )
    expect(screen.getByTestId('standard-button-preview')).toHaveStyle({
      color: '#CCFBF1',
      background: '#0F2A30',
    })
  })
})
