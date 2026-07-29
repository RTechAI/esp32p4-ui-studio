import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import { storeConfig } from '../core/store'
import ComponentPreview from '../components/editor/ComponentPreview'
import {
  getForgeUIStandardScaleModel,
} from './ForgeUIStandardScale'
import StandardScalePreview from './preview/StandardScalePreview'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

jest.mock('../components/editor/PreviewContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const scale = (): IComponent => ({
  id: 'scale',
  parent: 'root',
  type: 'Scale',
  props: { x: 14, y: 22, w: 240, h: 120 },
  children: [],
})

const root = (child: IComponent): IComponent => ({
  id: 'root',
  parent: 'root',
  type: 'Box',
  props: {},
  children: [child.id],
})

const BrowserScale = ({ component }: { component: IComponent }) => {
  const document = root(component)
  return <>{renderForgePreview({
    component: document,
    components: { root: document, scale: component },
  })}</>
}

describe('Standard Scale preview parity', () => {
  it('models the exact fixed settings emitted by the exporter', () => {
    const model = getForgeUIStandardScaleModel()

    expect(model).toMatchObject({
      minimum: 0,
      maximum: 100,
      totalTickCount: 11,
      majorTickEvery: 2,
      mode: 'horizontal-bottom',
    })
    expect(model.ticks.map(tick => tick.value)).toEqual([
      0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
    ])
    expect(model.ticks.filter(tick => tick.major)
      .map(tick => tick.label)).toEqual([
      '0', '20', '40', '60', '80', '100',
    ])
  })

  it('renders native-like major/minor hierarchy and labels near the top', () => {
    render(
      <ChakraProvider>
        <StandardScalePreview component={scale()} />
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-scale-preview')
    expect(preview).toHaveAttribute('data-scale-surface', 'transparent')
    expect(preview.style.background).toBe('')
    expect(preview.style.backgroundColor).toBe('')
    expect(preview.style.border).toBe('')
    expect(preview.style.borderRadius).toBe('')
    expect(preview.style.boxShadow).toBe('')
    expect(preview).toHaveAttribute('data-scale-mode', 'horizontal-bottom')
    expect(preview).toHaveAttribute('data-scale-range', '0:100')
    expect(preview).toHaveAttribute('data-scale-total-ticks', '11')
    expect(screen.getAllByTestId('standard-scale-major-tick')).toHaveLength(6)
    expect(screen.getAllByTestId('standard-scale-minor-tick')).toHaveLength(5)
    expect(screen.getAllByTestId('standard-scale-label')
      .map(label => label.textContent)).toEqual([
      '0', '20', '40', '60', '80', '100',
    ])
    expect(screen.getByTestId('standard-scale-track'))
      .toHaveAttribute('y1', '18')
  })

  it('uses the shared renderer on the Canvas', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Scale',
      rootParentType: 'Scale',
      testId: 'scale',
      props: scale().props,
    })

    render(
      <ChakraProvider>
        <Provider store={store}>
          <ComponentPreview componentName="scale" />
        </Provider>
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-scale-preview')).toBeInTheDocument()
    expect(screen.getAllByTestId('standard-scale-label')).toHaveLength(6)
  })

  it('uses the same shared renderer and serialized geometry in Browser Preview', () => {
    const component = scale()

    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserScale component={component} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-scale-preview')
    expect(preview.parentElement).toHaveStyle({
      left: '14px',
      top: '22px',
      width: '240px',
      height: '120px',
    })
    expect(screen.getAllByTestId('standard-scale-major-tick')).toHaveLength(6)
    expect(screen.getAllByTestId('standard-scale-minor-tick')).toHaveLength(5)
    expect(screen.getAllByTestId('standard-scale-label')).toHaveLength(6)
  })
})
