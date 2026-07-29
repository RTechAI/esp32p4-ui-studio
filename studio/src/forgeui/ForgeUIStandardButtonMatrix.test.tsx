import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import { storeConfig } from '../core/store'
import ComponentPreview from '../components/editor/ComponentPreview'
import {
  getForgeUIStandardButtonMatrixModel,
} from './ForgeUIStandardButtonMatrix'
import StandardButtonMatrixPreview from './preview/StandardButtonMatrixPreview'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

jest.mock('../components/editor/PreviewContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const matrix = (
  props: Record<string, unknown> = {},
): IComponent => ({
  id: 'matrix',
  parent: 'root',
  type: 'ButtonMatrix',
  props: { x: 14, y: 22, w: 240, h: 120, ...props },
  children: [],
})

const BrowserMatrix = ({ component }: { component: IComponent }) => {
  const root: IComponent = {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: [component.id],
  }
  return <>{renderForgePreview({
    component: root,
    components: { root, matrix: component },
  })}</>
}

describe('Standard ButtonMatrix preview parity', () => {
  it('normalizes the exact exporter defaults', () => {
    const model = getForgeUIStandardButtonMatrixModel({})

    expect(model.mapTokens).toEqual([
      'One', 'Two', 'Three', '\n', 'Four', 'Five', 'Six',
    ])
    expect(model.buttonLabels).toEqual([
      'One', 'Two', 'Three', 'Four', 'Five', 'Six',
    ])
    expect(model.rows.map(row => row.map(button => button.label)))
      .toEqual([
        ['One', 'Two', 'Three'],
        ['Four', 'Five', 'Six'],
      ])
    expect(model.selectedIndex).toBe(1)
    expect(model.oneCheck).toBe(false)
    expect(model.disabledButtons).toEqual([])
  })

  it('normalizes nested rows, legacy selection, checking and disabled state', () => {
    const model = getForgeUIStandardButtonMatrixModel({
      buttonMap: [['Alpha', 'Beta'], ['Gamma']],
      checkedButton: 9,
      oneCheck: true,
      disabledButtons: [2, 1, 2, -1, 99],
    })

    expect(model.mapTokens).toEqual([
      'Alpha', 'Beta', '\n', 'Gamma',
    ])
    expect(model.rows.map(row => row.map(button => button.label)))
      .toEqual([['Alpha', 'Beta'], ['Gamma']])
    expect(model.selectedIndex).toBe(2)
    expect(model.disabledButtons).toEqual([1, 2])
    expect(model.rows[1][0]).toMatchObject({
      selected: true,
      checked: true,
      disabled: true,
    })
  })

  it('renders the P4-proven container, rows and startup state', () => {
    render(
      <ChakraProvider>
        <StandardButtonMatrixPreview component={matrix()} />
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-button-matrix-preview')
    expect(preview).toHaveStyle({
      background: '#1E2328',
      border: '2px solid #F2A900',
      borderRadius: '8px',
      padding: '8px',
      gap: '6px',
      overflow: 'hidden',
    })
    expect(preview).toHaveAttribute('data-selected-index', '1')
    expect(preview).toHaveAttribute('data-one-check', 'false')
    expect(screen.getAllByTestId('standard-button-matrix-row'))
      .toHaveLength(2)
    expect(screen.getAllByTestId('standard-button-matrix-button'))
      .toHaveLength(6)

    const selected = screen.getAllByTestId(
      'standard-button-matrix-button',
    )[1]
    expect(selected).toHaveTextContent('Two')
    expect(selected).toHaveAttribute('data-selected', 'true')
    expect(selected).toHaveAttribute('data-checked', 'false')
    expect(selected).toHaveStyle({
      background: '#F2A900',
      color: '#121417',
    })
  })

  it('renders unequal rows and disabled controls from serialized props', () => {
    render(
      <ChakraProvider>
        <StandardButtonMatrixPreview component={matrix({
          map: [['Alpha', 'Beta'], ['Gamma']],
          selectedIndex: 2,
          oneCheck: true,
          disabledButtons: [1],
        })} />
      </ChakraProvider>,
    )

    const rows = screen.getAllByTestId('standard-button-matrix-row')
    expect(rows[0].children).toHaveLength(2)
    expect(rows[1].children).toHaveLength(1)
    const buttons = screen.getAllByTestId('standard-button-matrix-button')
    expect(buttons.map(button => button.textContent))
      .toEqual(['Alpha', 'Beta', 'Gamma'])
    expect(buttons[1]).toHaveAttribute('data-disabled', 'true')
    expect(buttons[2]).toHaveAttribute('data-checked', 'true')
  })

  it('preserves ButtonMatrix properties through the generic store model', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'ButtonMatrix',
      rootParentType: 'ButtonMatrix',
      testId: 'matrix',
      props: {
        map: [['Alpha'], ['Beta']],
        selectedIndex: 1,
        oneCheck: true,
        disabledButtons: [0],
      },
    })

    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.matrix.props)
      .toMatchObject({
        map: [['Alpha'], ['Beta']],
        selectedIndex: 1,
        oneCheck: true,
        disabledButtons: [0],
      })
  })

  it('uses the shared serialized renderer on Canvas', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'ButtonMatrix',
      rootParentType: 'ButtonMatrix',
      testId: 'matrix',
      props: matrix({
        buttonMap: [['Alpha', 'Beta'], ['Gamma']],
        selectedIndex: 2,
      }).props,
    })
    render(
      <ChakraProvider>
        <Provider store={store}>
          <ComponentPreview componentName="matrix" />
        </Provider>
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-button-matrix-preview'))
      .toBeInTheDocument()
    expect(screen.getAllByTestId('standard-button-matrix-button')
      .map(button => button.textContent))
      .toEqual(['Alpha', 'Beta', 'Gamma'])
  })

  it('uses the same shared renderer and geometry in Browser Preview', () => {
    const component = matrix({
      buttonMap: [['Alpha', 'Beta'], ['Gamma']],
      selectedIndex: 2,
    })
    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserMatrix component={component} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-button-matrix-preview')
    expect(preview.parentElement).toHaveStyle({
      left: '14px',
      top: '22px',
      width: '240px',
      height: '120px',
    })
    expect(screen.getAllByTestId('standard-button-matrix-row'))
      .toHaveLength(2)
    expect(screen.getAllByTestId('standard-button-matrix-button')
      .map(button => button.textContent))
      .toEqual(['Alpha', 'Beta', 'Gamma'])
  })
})
