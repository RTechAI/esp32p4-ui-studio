import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'

import ComponentPreview from '../components/editor/ComponentPreview'
import { storeConfig } from '../core/store'
import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

jest.mock('../components/editor/PreviewContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const wifi: IComponent = {
  id: 'wifi',
  parent: 'root',
  type: 'WiFi',
  componentName: 'wifi',
  props: { x: 726, y: 87, w: 120, h: 60 },
  children: [],
}

const root: IComponent = {
  id: 'root',
  parent: 'root',
  type: 'Box',
  props: {},
  children: [wifi.id],
}

const BrowserWifi = () => (
  <>
    {renderForgePreview({
      component: root,
      components: { root, wifi },
    })}
  </>
)

describe('Standard Wi-Fi display regression', () => {
  it('keeps Canvas and Browser on the same presentation-only status', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: wifi.type,
      rootParentType: wifi.type,
      testId: wifi.id,
      props: wifi.props,
    })

    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <Provider store={store}>
            <ComponentPreview componentName={wifi.id} />
            <BrowserWifi />
          </Provider>
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    const displays = screen.getAllByTestId('standard-wifi-preview')
    expect(displays).toHaveLength(2)
    displays.forEach(display => {
      expect(display.textContent).toBe('Failed')
      expect(display.querySelector('svg')).toBeInTheDocument()
      expect(display.textContent?.split('\n')).toHaveLength(1)
      expect(display).toHaveStyle({
        whiteSpace: 'nowrap',
        lineHeight: '1',
        overflow: 'hidden',
      })
    })
  })

  it('emits a runtime-backed LVGL status without wrapping', () => {
    const { code } = generateForgeUILvglCode(
      { root, wifi },
      'cyber_teal',
      undefined,
      { includeThemeTexture: false },
    )

    expect(code).toContain(
      'lv_label_set_text(fg_wifi_label, "Failed");',
    )
    expect(code).toContain(
      'lv_label_set_long_mode(fg_wifi_label, LV_LABEL_LONG_CLIP);',
    )
    expect(code).not.toContain(
      'lv_label_set_long_mode(fg_wifi_label, LV_LABEL_LONG_WRAP);',
    )
    expect(code).toContain(
      'fg_wifi_get_snapshot(&widget_snapshot)',
    )
    expect(code).toContain('LV_SYMBOL_WIFI " %s", widget_status')
    expect(code).not.toContain('FG_On_')
  })

  it('keeps multiple Wi-Fi Status instances independent', () => {
    const second = {
      ...wifi,
      id: 'wifi-second',
      componentName: 'wifi',
      props: { ...wifi.props, displayMode: 'text-only', showSignalStrength: true },
    }
    const { code } = generateForgeUILvglCode(
      {
        root: { ...root, children: [wifi.id, second.id] },
        wifi,
        [second.id]: second,
      },
      'cyber_teal',
      undefined,
      { includeThemeTexture: false },
    )
    expect(code).toContain('static lv_obj_t * fg_wifi_label = NULL;')
    expect(code).toContain('static lv_obj_t * fg_wifi_2_label = NULL;')
    expect(code).toContain('lv_label_set_text(fg_wifi_label, widget_buf);')
    expect(code).toContain('lv_label_set_text(fg_wifi_2_label, widget_buf);')
    expect(code).toContain('"  %d dBm", widget_snapshot.rssi')
  })
})
