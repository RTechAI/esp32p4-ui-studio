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
  component('roller', 'Roller'),
  component('message', 'Msgbox'),
  component('calendar', 'Calendar'),
  component('scale', 'Scale'),
  component('matrix', 'ButtonMatrix'),
  component('canvas', 'Canvas'),
  component('tabs', 'Tabview'),
  component('tiles', 'Tileview'),
  component('button', 'Button'),
  component('text', 'Text'),
  component('heading', 'Heading'),
  component('clock', 'Clock'),
  component('wifi', 'WiFi'),
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
      <button onClick={() => setThemeId('cyber_teal')}>
        Use teal
      </button>
      <button onClick={() => setThemeId('graphite')}>
        Use graphite
      </button>
      <button onClick={() => setThemeId('nordic_ice')}>
        Use light
      </button>
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

describe('Standard Canvas selected-theme parity', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('updates Canvas and Browser to the same selected teal palette', () => {
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

    fireEvent.click(screen.getByRole('button', { name: 'Use teal' }))

    screen.getAllByTestId('standard-roller-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        background: '#0F2A30',
        border: '1px solid #14B8A6',
      })
    })
    screen.getAllByTestId('standard-roller-selected-row').forEach(row => {
      expect(row).toHaveStyle({ color: '#14B8A6' })
    })

    screen.getAllByTestId('standard-message-box-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        background: '#0F2A30',
        color: '#CCFBF1',
        border: '1px solid #14B8A6',
      })
    })
    screen.getAllByTestId('standard-message-box-button').forEach(button => {
      expect(button).toHaveStyle({ border: '1px solid #14B8A6' })
    })

    screen.getAllByTestId('standard-calendar-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        background: '#0F2A30',
        color: '#CCFBF1',
        border: '2px solid #14B8A6',
      })
    })
    screen.getAllByTestId('standard-calendar-day')
      .filter(day => day.getAttribute('data-today') === 'true')
      .forEach(today => {
        expect(today).toHaveStyle({ border: '2px solid #14B8A6' })
      })

    screen.getAllByTestId('standard-scale-track').forEach(track => {
      expect(track).toHaveAttribute('stroke', '#14B8A6')
    })
    screen.getAllByTestId('standard-scale-label').forEach(label => {
      expect(label).toHaveAttribute('fill', '#CCFBF1')
    })

    screen.getAllByTestId('standard-button-matrix-preview')
      .forEach(preview => {
        expect(preview).toHaveStyle({
          background: '#0F2A30',
          border: '2px solid #14B8A6',
        })
      })
    screen.getAllByTestId('standard-button-matrix-button')
      .filter(button => button.getAttribute('data-selected') === 'true')
      .forEach(selected => {
        expect(selected).toHaveStyle({
          background: '#14B8A6',
          color: '#071A1D',
        })
      })

    screen.getAllByTestId('standard-canvas-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        background: '#0F2A30',
        border: '2px solid #14B8A6',
      })
    })
    screen.getAllByTestId('standard-tabview-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        background: '#0F2A30',
        border: '1px solid #14B8A6',
      })
    })
    screen.getAllByTestId('standard-tileview-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        background: '#0F2A30',
        border: '1px solid #14B8A6',
      })
    })
    screen.getAllByTestId('standard-button-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        background: '#0F2A30',
        color: '#CCFBF1',
        border: '2px solid #14B8A6',
        borderRadius: '12px',
      })
    })
    screen.getAllByTestId('standard-text-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        color: '#CCFBF1',
        textAlign: 'left',
      })
    })
    screen.getAllByTestId('standard-heading-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        color: '#CCFBF1',
        fontSize: '32px',
        textAlign: 'left',
      })
    })
    screen.getAllByTestId('standard-clock-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        color: '#14B8A6',
      })
    })
    screen.getAllByTestId('standard-wifi-preview').forEach(preview => {
      expect(preview).toHaveStyle({
        color: '#14B8A6',
        fontSize: '20px',
        padding: '0',
        textAlign: 'left',
      })
      expect(preview).toHaveTextContent('WIFI WIFI_FAIL IP: -')
    })
  })

  it('keeps graphite as the standalone fallback without a provider', () => {
    const store = createStore()
    render(
      <ChakraProvider>
        <Provider store={store}>
          <ComponentPreview componentName="roller" />
        </Provider>
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-roller-preview')).toHaveStyle({
      background: '#1E2328',
      border: '1px solid #F2A900',
    })
  })

  it.each([
    ['Use graphite', '#1E2328', '#F2A900', '#F5F5F5', '#F2A900'],
    ['Use teal', '#0F2A30', '#14B8A6', '#CCFBF1', '#14B8A6'],
    ['Use light', '#FFFFFF', '#7DD3FC', '#0F172A', '#38BDF8'],
  ])(
    'keeps all five Canvas and Browser renderers aligned for %s',
    (buttonName, surface, border, text, accent) => {
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

      fireEvent.click(screen.getByRole('button', {
        name: buttonName,
      }))

      screen.getAllByTestId('standard-roller-preview')
        .forEach(node => expect(node).toHaveStyle({
          background: surface,
          border: `1px solid ${border}`,
        }))
      screen.getAllByTestId('standard-message-box-preview')
        .forEach(node => expect(node).toHaveStyle({
          background: surface,
          border: `1px solid ${border}`,
          color: text,
        }))
      screen.getAllByTestId('standard-calendar-preview')
        .forEach(node => expect(node).toHaveStyle({
          background: surface,
          border: `2px solid ${border}`,
          color: text,
        }))
      screen.getAllByTestId('standard-scale-track')
        .forEach(node => expect(node).toHaveAttribute('stroke', accent))
      screen.getAllByTestId('standard-scale-label')
        .forEach(node => expect(node).toHaveAttribute('fill', text))
      screen.getAllByTestId('standard-button-matrix-preview')
        .forEach(node => expect(node).toHaveStyle({
          background: surface,
          border: `2px solid ${border}`,
        }))
      screen.getAllByTestId('standard-canvas-preview')
        .forEach(node => expect(node).toHaveStyle({
          background: surface,
          border: `2px solid ${border}`,
        }))
      screen.getAllByTestId('standard-tabview-preview')
        .forEach(node => expect(node).toHaveStyle({
          background: surface,
          border: `1px solid ${border}`,
        }))
      screen.getAllByTestId('standard-tileview-preview')
        .forEach(node => expect(node).toHaveStyle({
          background: surface,
          border: `1px solid ${border}`,
        }))
      screen.getAllByTestId('standard-button-preview')
        .forEach(node => expect(node).toHaveStyle({
          background: surface,
          color: text,
          border: `2px solid ${border}`,
        }))
      screen.getAllByTestId('standard-text-preview')
        .forEach(node => expect(node).toHaveStyle({ color: text }))
      screen.getAllByTestId('standard-heading-preview')
        .forEach(node => expect(node).toHaveStyle({ color: text }))
      screen.getAllByTestId('standard-clock-preview')
        .forEach(node => expect(node).toHaveStyle({ color: accent }))
      screen.getAllByTestId('standard-wifi-preview')
        .forEach(node => expect(node).toHaveStyle({ color: accent }))
    },
  )
})
