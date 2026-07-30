import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import CircularProgressPreview from '../components/editor/previews/CircularProgressPreview'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

const BrowserPreview = ({
  root,
  components,
}: {
  root: IComponent
  components: Record<string, IComponent>
}) => renderForgePreview({ component: root, components })

const circularProgress = (): IComponent => ({
  id: 'circular',
  parent: 'root',
  type: 'CircularProgress',
  componentName: 'Battery Level',
  props: { x: 10, y: 20, w: 120, h: 120, value: 35, min: -50, max: 50 },
  children: [],
})

describe('Standard Circular Progress preview parity', () => {
  it('Canvas displays serialized output state without a slider or hard-coded label', () => {
    render(
      <ChakraProvider>
        <CircularProgressPreview component={circularProgress()} />
      </ChakraProvider>,
    )

    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '35')
    expect(progress).toHaveAttribute('aria-valuemin', '-50')
    expect(progress).toHaveAttribute('aria-valuemax', '50')
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    expect(screen.queryByText(/Circular/)).not.toBeInTheDocument()
  })

  it('Browser Preview uses the same serialized output component', () => {
    const child = circularProgress()
    const root: IComponent = {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: [child.id],
    }

    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserPreview
            root={root}
            components={{ root, [child.id]: child }}
          />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    expect(screen.getByRole('progressbar'))
      .toHaveAttribute('aria-valuenow', '35')
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    expect(screen.queryByText(/Circular/)).not.toBeInTheDocument()
  })
})
