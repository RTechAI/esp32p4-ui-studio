import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import ComponentPreview from '../components/editor/ComponentPreview'
import { storeConfig } from '../core/store'
import {
  ForgeThemeProvider,
  useForgeTheme,
} from './theme/ForgeThemeContext'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import {
  FG_PREVIEW_PALETTES,
  ForgeThemeId,
  resolveForgeSemanticPalette,
} from './preview/forgeThemeMap'

jest.mock('../components/editor/PreviewContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const component = (
  id: string,
  type: ComponentType,
): IComponent => ({
  id,
  parent: 'root',
  type,
  props: { x: 10, y: 10, w: 240, h: 120 },
  children: [],
})

const components = [
  component('led', 'Led'),
  component('bar', 'Bar'),
  component('arc', 'Arc'),
  component('chart', 'Chart'),
  component('table', 'Table'),
  component('keyboard', 'Keyboard'),
]

const BrowserStandards = () => {
  const root: IComponent = {
    id: 'browser-root',
    parent: 'browser-root',
    type: 'Box',
    props: {},
    children: components.map(item => item.id),
  }
  return <>{renderForgePreview({
    component: root,
    components: {
      [root.id]: root,
      ...Object.fromEntries(components.map(item => [item.id, item])),
    },
  })}</>
}

const ThemeControls = () => {
  const { setThemeId } = useForgeTheme()
  return (
    <>
      {(['graphite', 'cyber_teal', 'nordic_ice'] as ForgeThemeId[])
        .map(themeId => (
          <button key={themeId} onClick={() => setThemeId(themeId)}>
            {themeId}
          </button>
        ))}
    </>
  )
}

const createStore = () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  components.forEach(item => {
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: item.type,
      rootParentType: item.type,
      testId: item.id,
      props: item.props,
    })
  })
  return store
}

describe('previously proven Standard selected-theme parity', () => {
  beforeEach(() => window.localStorage.clear())

  it.each([
    'graphite',
    'cyber_teal',
    'nordic_ice',
  ] as ForgeThemeId[])(
    'keeps Canvas and Browser aligned for %s',
    themeId => {
      const palette = FG_PREVIEW_PALETTES[themeId]
      const theme = resolveForgeSemanticPalette(palette)
      const store = createStore()

      render(
        <ChakraProvider>
          <ForgeThemeProvider>
            <Provider store={store}>
              <ThemeControls />
              {components.map(item => (
                <ComponentPreview
                  key={item.id}
                  componentName={item.id}
                />
              ))}
              <BrowserStandards />
            </Provider>
          </ForgeThemeProvider>
        </ChakraProvider>,
      )
      fireEvent.click(screen.getByRole('button', { name: themeId }))

      screen.getAllByTestId('standard-led-preview').forEach(led => {
        expect(led).toHaveStyle({ background: 'var(--chakra-colors-green-400)' })
      })

      screen.getAllByTestId('standard-bar-preview').forEach(bar => {
        expect(bar).toHaveStyle({
          background: theme.surfaceSecondary,
          border: `1px solid ${theme.surfaceBorder}`,
        })
      })

      screen.getAllByTestId('standard-arc-preview').forEach(arc => {
        const circles = arc.querySelectorAll('circle')
        expect(circles[0]).toHaveAttribute('stroke', theme.surfaceSecondary)
        expect(circles[1]).toHaveAttribute('stroke', theme.accent)
      })

      screen.getAllByTestId('standard-chart-preview').forEach(chart => {
        expect(chart).toHaveStyle({
          background: theme.surface,
          border: `2px solid ${theme.surfaceBorder}`,
        })
      })
      screen.getAllByTestId('standard-chart-grid').forEach(grid => {
        expect(grid).toHaveAttribute('stroke', theme.textSecondary)
      })

      const canvasTable = screen.getByTestId('standard-table-canvas')
      const browserTable = screen.getByTestId('standard-table-browser')
      ;[canvasTable, browserTable].forEach(table => {
        expect(table).toHaveStyle({
          background: theme.surface,
          border: `1px solid ${theme.surfaceBorder}`,
          color: theme.textPrimary,
        })
        Array.from(table.children).forEach(cell => {
          expect(cell).toHaveStyle({
            background: theme.surfaceSecondary,
            border: `1px solid ${theme.surfaceBorder}`,
          })
        })
      })

      const canvasKeyboard = screen.getByTestId('standard-keyboard-canvas')
      const browserKeyboard = screen.getByTestId('standard-keyboard-browser')
      ;[canvasKeyboard, browserKeyboard].forEach(keyboard => {
        expect(keyboard).toHaveStyle({
          background: `${theme.surface}B3`,
          border: `1px solid ${theme.surfaceBorder}`,
        })
      })
      screen.getAllByTestId('standard-keyboard-key').forEach(key => {
        expect(key).toHaveStyle({
          background: theme.surfaceSecondary,
          border: `1px solid ${theme.surfaceBorder}`,
          color: theme.textPrimary,
        })
      })
    },
  )
})
