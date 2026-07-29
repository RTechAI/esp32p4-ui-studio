import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'

import ComponentPreview from '../components/editor/ComponentPreview'
import { storeConfig } from '../core/store'
import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import type { ForgePreviewPalette } from './preview/forgeThemeMap'
import {
  ForgeThemeProvider,
  useForgeTheme,
} from './theme/ForgeThemeContext'

jest.mock('../components/editor/PreviewContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const customPalette: ForgePreviewPalette = {
  name: 'Theme Contract',
  bg: '#010203',
  surface: '#111213',
  surface2: '#212223',
  border: '#A14B2A',
  text: '#35A7D8',
  accent: '#734FD1',
  texture: 'none',
  borderStyle: 'flat',
}

const components: IComponent[] = [
  {
    id: 'text', parent: 'root', type: 'Text',
    props: { x: 10, y: 20, w: 160, h: 48, color: '#FFFFFF' },
    children: [],
  },
  {
    id: 'heading', parent: 'root', type: 'Heading',
    props: { x: 10, y: 80, w: 240, h: 48, color: '#FFFFFF' },
    children: [],
  },
  {
    id: 'line', parent: 'root', type: 'Line',
    props: { x: 10, y: 140, w: 120, h: 120, color: '#00D4FF', lineWidth: 3 },
    children: [],
  },
]

const root: IComponent = {
  id: 'root',
  parent: 'root',
  type: 'Box',
  props: {},
  children: components.map(component => component.id),
}

const BrowserComponents = () => (
  <>
    {renderForgePreview({
      component: root,
      components: {
        root,
        ...Object.fromEntries(components.map(component => [
          component.id,
          component,
        ])),
      },
    })}
  </>
)

const UseCustomTheme = () => {
  const { setCustomPalette } = useForgeTheme()
  return (
    <button onClick={() => setCustomPalette(customPalette)}>
      Use custom
    </button>
  )
}

describe('Standard Text, Heading, and Line semantic theme parity', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('uses identical custom semantic roles on Canvas and Browser', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    components.forEach(component => {
      store.dispatch.components.addComponent({
        parentName: 'root',
        type: component.type,
        rootParentType: component.type,
        testId: component.id,
        props: component.props,
      })
    })

    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <Provider store={store}>
            <UseCustomTheme />
            {components.map(component => (
              <ComponentPreview
                key={component.id}
                componentName={component.id}
              />
            ))}
            <BrowserComponents />
          </Provider>
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Use custom' }))

    screen.getAllByTestId('standard-text-preview').forEach(node => {
      expect(node).toHaveStyle({ color: '#35A7D8' })
      expect(node).not.toHaveStyle({ color: '#FFFFFF' })
    })
    screen.getAllByTestId('standard-heading-preview').forEach(node => {
      expect(node).toHaveStyle({ color: '#35A7D8' })
      expect(node).not.toHaveStyle({ color: '#FFFFFF' })
    })
    screen.getAllByTestId('standard-line-stroke').forEach(node => {
      expect(node).toHaveAttribute('stroke', '#A14B2A')
      expect(node).not.toHaveAttribute('stroke', '#00D4FF')
    })
  })

  it('emits textPrimary and surfaceBorder into LVGL', () => {
    const { code } = generateForgeUILvglCode(
      {
        root,
        ...Object.fromEntries(components.map(component => [
          component.id,
          component,
        ])),
      },
      'graphite',
      undefined,
      { includeThemeTexture: false, palette: customPalette },
    )

    expect(code).toContain(
      'lv_obj_set_style_text_color(obj1, lv_color_hex(0x35A7D8), 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_color(obj2, lv_color_hex(0x35A7D8), 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_line_color(obj3, lv_color_hex(0xA14B2A), LV_PART_MAIN);',
    )
    expect(code).not.toContain('lv_color_hex(0xFFFFFF)')
    expect(code).not.toContain('lv_color_hex(0x00D4FF)')
  })
})
