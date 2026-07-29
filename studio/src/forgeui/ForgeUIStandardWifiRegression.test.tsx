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
  it('keeps Canvas and Browser on the same three-line no-wrap structure', () => {
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
      expect(display.textContent).toBe('WIFI\nWIFI_FAIL\nIP: -')
      expect(display.textContent).not.toContain('DISCONNECTED')
      expect(display.textContent?.split('\n')).toHaveLength(3)
      expect(display).toHaveStyle({
        whiteSpace: 'pre',
        lineHeight: '20px',
        overflow: 'hidden',
      })
    })
  })

  it('emits the proven three-line LVGL label without wrapping', () => {
    const { code } = generateForgeUILvglCode(
      { root, wifi },
      'cyber_teal',
      undefined,
      { includeThemeTexture: false },
    )

    expect(code).toContain(
      'lv_label_set_text(fg_wifi_label, "WIFI\\nWIFI_FAIL\\nIP: -");',
    )
    expect(code).not.toContain(
      'lv_label_set_text(fg_wifi_label, "WIFI\\nDISCONNECTED\\nIP: -");',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_line_space(fg_wifi_label, -2, 0);',
    )
    expect(code).toContain(
      'lv_label_set_long_mode(fg_wifi_label, LV_LABEL_LONG_CLIP);',
    )
    expect(code).not.toContain(
      'lv_label_set_long_mode(fg_wifi_label, LV_LABEL_LONG_WRAP);',
    )
    expect(code).toContain(
      'snprintf(wifi_buf, sizeof(wifi_buf), "WIFI\\n%s\\nIP: %s", fg_wifi_status_text(), fg_wifi_ip_text());',
    )
  })
})
