import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import ProgressPreview from '../components/editor/previews/ProgressPreview'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

const component = (props: Record<string, unknown>): IComponent => ({
  id: 'progress',
  parent: 'root',
  type: 'Progress',
  componentName: 'Download Progress',
  props: {
    x: 10,
    y: 20,
    w: 240,
    h: 24,
    ...props,
  },
  children: [],
})

const BrowserProgress = ({
  root,
  progress,
}: {
  root: IComponent
  progress: IComponent
}) => (
  <>{renderForgePreview({
    component: root,
    components: { root, progress },
  })}</>
)

describe('Standard Progress preview parity', () => {
  it('Canvas Preview displays the serialized value and range without interaction', () => {
    render(
      <ChakraProvider>
        <ProgressPreview component={component({
          value: 35,
          min: -50,
          max: 50,
        })} />
      </ChakraProvider>,
    )

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '35')
    expect(progressbar).toHaveAttribute('aria-valuemin', '-50')
    expect(progressbar).toHaveAttribute('aria-valuemax', '50')
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
  })

  it('Browser Preview displays the same serialized value without interaction', () => {
    const progress = component({ value: 72, min: 0, max: 120 })
    const root: IComponent = {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: [progress.id],
    }

    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserProgress root={root} progress={progress} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '72')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '120')
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
  })

  it('keeps the legacy serialized default aligned on both preview paths', () => {
    const progress = component({})
    const root: IComponent = {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: [progress.id],
    }

    const { rerender } = render(
      <ChakraProvider>
        <ProgressPreview component={progress} />
      </ChakraProvider>,
    )
    expect(screen.getByRole('progressbar'))
      .toHaveAttribute('aria-valuenow', '60')

    rerender(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserProgress root={root} progress={progress} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )
    expect(screen.getByRole('progressbar'))
      .toHaveAttribute('aria-valuenow', '60')
  })
})
