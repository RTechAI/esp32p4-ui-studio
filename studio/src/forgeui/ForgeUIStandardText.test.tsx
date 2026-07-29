import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'

import TextPreview from '~components/editor/previews/TextPreview'
import { getPreviewDefaultProps } from '~utils/defaultProps'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import {
  FORGEUI_STANDARD_TEXT_DEFAULT_VALUE,
  getForgeUIStandardTextValue,
} from './ForgeUIStandardText'

const textComponent = (
  props: Record<string, unknown> = {},
  componentName = 'Renamable Text',
): IComponent => ({
  id: 'text',
  parent: 'root',
  type: 'Text',
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

describe('standard Text value', () => {
  it('serializes the default and preserves legacy project values', () => {
    expect(getPreviewDefaultProps('Text')).toMatchObject({
      textValue: FORGEUI_STANDARD_TEXT_DEFAULT_VALUE,
    })
    expect(getForgeUIStandardTextValue({}))
      .toBe(FORGEUI_STANDARD_TEXT_DEFAULT_VALUE)
    expect(getForgeUIStandardTextValue({ children: 'Legacy text' }))
      .toBe('Legacy text')

    const reloaded = JSON.parse(JSON.stringify(
      textComponent({ textValue: 'Saved text' }),
    )) as IComponent
    expect(reloaded.props.textValue).toBe('Saved text')
    expect(getForgeUIStandardTextValue(reloaded.props)).toBe('Saved text')
  })

  it('keeps displayed text independent from the component name', () => {
    expect(getForgeUIStandardTextValue(textComponent(
      { textValue: 'Visible text' },
      'Different Component Name',
    ).props)).toBe('Visible text')
  })

  it('shows saved and default values in Canvas Preview', () => {
    const { rerender } = render(
      <ChakraProvider>
        <TextPreview component={textComponent({ textValue: 'Canvas text' })} />
      </ChakraProvider>,
    )
    expect(screen.getByText('Canvas text')).toBeInTheDocument()

    rerender(
      <ChakraProvider>
        <TextPreview component={textComponent()} />
      </ChakraProvider>,
    )
    expect(screen.getByText('Text value')).toBeInTheDocument()
  })

  it('shows saved and default values in Browser Preview', () => {
    const { rerender } = render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserPreview component={textComponent({
            textValue: 'Browser text',
          })} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )
    expect(screen.getByText('Browser text')).toBeInTheDocument()

    rerender(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserPreview component={textComponent()} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )
    expect(screen.getByText('Text value')).toBeInTheDocument()
  })

  it('preserves an intentionally empty Text Value', () => {
    expect(getForgeUIStandardTextValue({ textValue: '' })).toBe('')
  })
})
