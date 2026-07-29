import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import { storeConfig } from '../core/store'
import ComponentPreview from '../components/editor/ComponentPreview'
import {
  getForgeUIStandardRollerModel,
} from './ForgeUIStandardRoller'
import StandardRollerPreview from './preview/StandardRollerPreview'
import {
  FG_PREVIEW_PALETTES,
  resolveForgeSemanticPalette,
} from './preview/forgeThemeMap'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

jest.mock('../components/editor/PreviewContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const roller = (
  props: Record<string, unknown> = {},
): IComponent => ({
  id: 'roller',
  parent: 'root',
  type: 'Roller',
  props: { x: 14, y: 22, w: 120, h: 72, ...props },
  children: [],
})

const BrowserRoller = ({ component }: { component: IComponent }) => {
  const root: IComponent = {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: [component.id],
  }
  return <>{renderForgePreview({
    component: root,
    components: { root, roller: component },
  })}</>
}

describe('Standard Roller preview parity', () => {
  it('normalizes the same default and configured model as the exporter', () => {
    expect(getForgeUIStandardRollerModel({})).toEqual({
      options: ['One', 'Two', 'Three', 'Four'],
      selectedIndex: 0,
      visibleRowCount: 3,
      mode: 'normal',
    })
    expect(getForgeUIStandardRollerModel({
      options: 'Alpha\n\nBeta\nGamma',
      selectedIndex: 9,
      visibleRowCount: 5.9,
      mode: 'LV_ROLLER_MODE_INFINITE',
    })).toEqual({
      options: ['Alpha', 'Beta', 'Gamma'],
      selectedIndex: 2,
      visibleRowCount: 5,
      mode: 'infinite',
    })
  })

  it('renders the preferred Browser styling and honest startup selection', () => {
    render(
      <ChakraProvider>
        <StandardRollerPreview component={roller()} />
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-roller-preview')
    expect(preview).toHaveStyle({
      background: '#1E2328',
      border: '1px solid #F2A900',
      borderRadius: '8px',
      overflow: 'hidden',
    })
    expect(preview).toHaveAttribute('data-roller-mode', 'normal')
    expect(preview).toHaveAttribute('data-roller-selected-index', '0')
    expect(preview).toHaveAttribute('data-roller-visible-rows', '3')

    const selected = screen.getByTestId('standard-roller-selected-row')
    expect(selected).toHaveTextContent('One')
    expect(selected).toHaveStyle({
      color: '#F2A900',
      background: 'transparent',
      fontSize: '16px',
      fontWeight: '700',
      textAlign: 'center',
    })
    expect(screen.getAllByTestId('standard-roller-normal-row'))
      .toHaveLength(2)
    expect(screen.getAllByTestId('standard-roller-normal-row')[1])
      .toHaveTextContent('Two')
    expect(screen.getAllByTestId('standard-roller-normal-row')[1])
      .toHaveStyle({
        color: resolveForgeSemanticPalette(
          FG_PREVIEW_PALETTES.graphite,
        ).textSecondary,
      })
  })

  it('renders configured normal and infinite rows around the selection', () => {
    const { rerender } = render(
      <ChakraProvider>
        <StandardRollerPreview component={roller({
          options: ['Alpha', 'Beta', 'Gamma'],
          selectedIndex: 1,
          visibleRowCount: 3,
        })} />
      </ChakraProvider>,
    )
    expect(screen.getAllByText(/Alpha|Beta|Gamma/)
      .map(row => row.textContent)).toEqual(['Alpha', 'Beta', 'Gamma'])

    rerender(
      <ChakraProvider>
        <StandardRollerPreview component={roller({
          options: ['Alpha', 'Beta', 'Gamma'],
          selectedIndex: 0,
          visibleRowCount: 3,
          mode: 'infinite',
        })} />
      </ChakraProvider>,
    )
    expect(screen.getAllByText(/Alpha|Beta|Gamma/)
      .map(row => row.textContent)).toEqual(['Gamma', 'Alpha', 'Beta'])
  })

  it('preserves Roller properties through the generic store model', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Roller',
      rootParentType: 'Roller',
      testId: 'roller',
      props: {
        options: ['Alpha', 'Beta'],
        selectedIndex: 1,
        visibleRowCount: 5,
        mode: 'infinite',
      },
    })

    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.roller.props)
      .toMatchObject({
        options: ['Alpha', 'Beta'],
        selectedIndex: 1,
        visibleRowCount: 5,
        mode: 'infinite',
      })
  })

  it('uses the shared renderer on Canvas', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Roller',
      rootParentType: 'Roller',
      testId: 'roller',
      props: roller({ selectedIndex: 2 }).props,
    })
    render(
      <ChakraProvider>
        <Provider store={store}>
          <ComponentPreview componentName="roller" />
        </Provider>
      </ChakraProvider>,
    )
    expect(screen.getByTestId('standard-roller-preview')).toBeInTheDocument()
    expect(screen.getByTestId('standard-roller-selected-row'))
      .toHaveTextContent('Three')
  })

  it('uses the same renderer and geometry in Browser Preview', () => {
    const component = roller({ selectedIndex: 2 })
    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserRoller component={component} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-roller-preview')
    expect(preview.parentElement).toHaveStyle({
      left: '14px',
      top: '22px',
      width: '120px',
      height: '72px',
    })
    expect(screen.getByTestId('standard-roller-selected-row'))
      .toHaveTextContent('Three')
  })
})
