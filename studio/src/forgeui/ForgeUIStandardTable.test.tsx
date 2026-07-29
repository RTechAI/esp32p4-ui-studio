import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ComponentPreview from '../components/editor/ComponentPreview'
import { storeConfig } from '../core/store'
import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

const DndProviderWithChildren = DndProvider as React.ComponentType<
  React.PropsWithChildren<React.ComponentProps<typeof DndProvider>>
>

const table = (): IComponent => ({
  id: 'table',
  parent: 'root',
  type: 'Table',
  props: { positionMode: 'absolute', x: 12, y: 34, w: 240, h: 120 },
  children: [],
})

describe('Standard Table visual parity', () => {
  afterEach(() => {
    cleanup()
    window.localStorage.clear()
  })

  it('uses matching dark, opaque, framed cells on Canvas and Browser', async () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Table',
      rootParentType: 'Table',
      testId: 'table',
      props: table().props,
    })

    render(
      <ChakraProvider>
        <DndProviderWithChildren backend={HTML5Backend}>
          <Provider store={store}>
            <ComponentPreview componentName="table" />
          </Provider>
        </DndProviderWithChildren>
      </ChakraProvider>,
    )

    const canvas = screen.getByTestId('standard-table-canvas')
    expect(canvas).toHaveStyle({
      background: '#1e2328',
      border: '1px solid #f2a900',
      borderRadius: '8px',
      overflow: 'hidden',
      color: '#f5f5f5',
    })
    Array.from(canvas.children).forEach(cell => {
      expect(cell).toHaveStyle({
        background: '#2a3138',
        border: '1px solid #f2a900',
        padding: '8px',
      })
    })

    cleanup()
    window.localStorage.setItem('forgeui_active_theme_v1', JSON.stringify({
      themeId: 'graphite',
      customPalette: null,
      heroBackground: null,
    }))
    const component = table()
    const root: IComponent = {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: [component.id],
    }
    const BrowserTable = () => (
      <>{renderForgePreview({
        component: root,
        components: { root, table: component },
      })}</>
    )

    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserTable />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('standard-table-browser')).toHaveStyle({
        background: '#1e2328',
        border: '1px solid #f2a900',
        borderRadius: '8px',
        overflow: 'hidden',
        color: '#f5f5f5',
      })
    })
    Array.from(screen.getByTestId('standard-table-browser').children)
      .forEach(cell => {
        expect(cell).toHaveStyle({
          background: '#2a3138',
          border: '1px solid #f2a900',
          padding: '8px',
        })
      })
  })

  it('exports the same explicit frame without changing data or geometry', () => {
    const component = table()
    const components: IComponents = {
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: [component.id],
      },
      table: component,
    }

    const { code } = generateForgeUILvglCode(
      components,
      'graphite',
      undefined,
      { includeThemeTexture: false },
    )

    expect(code).toContain('lv_obj_t * obj1 = lv_table_create(fg_application_page);')
    expect(code).toContain('lv_obj_set_pos(obj1, 12, 34);')
    expect(code).toContain('lv_obj_set_size(obj1, 240, 120);')
    expect(code).toContain('lv_table_set_cell_value(obj1, 0, 0, "A1");')
    expect(code).toContain('lv_table_set_cell_value(obj1, 0, 1, "B1");')
    expect(code).toContain('lv_table_set_cell_value(obj1, 1, 0, "A2");')
    expect(code).toContain('lv_table_set_cell_value(obj1, 1, 1, "B2");')
    expect(code).toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0x1E2328), LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_opa(obj1, LV_OPA_COVER, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_color(obj1, lv_color_hex(0xF2A900), LV_PART_MAIN);',
    )
    expect(code).toContain('lv_obj_set_style_radius(obj1, 8, LV_PART_MAIN);')
    expect(code).toContain(
      'lv_obj_set_style_clip_corner(obj1, true, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0x2A3138), LV_PART_ITEMS);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_color(obj1, lv_color_hex(0xF5F5F5), LV_PART_ITEMS);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_color(obj1, lv_color_hex(0xF2A900), LV_PART_ITEMS);',
    )
    expect(code).toContain(
      'lv_obj_set_style_pad_all(obj1, 8, LV_PART_ITEMS);',
    )
    expect(code).not.toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0xFFFFFF)',
    )
  })
})
