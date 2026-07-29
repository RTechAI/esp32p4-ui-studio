import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'

import { generateForgeUILvglCode } from './ForgeUILvglExport'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
  type ForgeUIUploadedAsset,
} from './ForgeUIUploadedAssetRegistry'
import StandardCanvasPreview from './preview/StandardCanvasPreview'
import StandardHeadingPreview from './preview/StandardHeadingPreview'
import StandardTextPreview from './preview/StandardTextPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import {
  ForgeThemeProvider,
  useForgeTheme,
} from './theme/ForgeThemeContext'

const artwork: ForgeUIUploadedAsset = {
  id: 'canvas-art',
  name: 'canvas-art.png',
  type: 'image/png',
  size: 128,
  createdAt: 1,
  browserSrc: 'data:image/png;base64,Y2FudmFz',
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: 'fg_canvas_art',
  cFile: 'assets/uploads/fg_canvas_art.c',
}

const canvas: IComponent = {
  id: 'canvas',
  parent: 'root',
  type: 'Canvas',
  props: {
    x: 20,
    y: 30,
    w: 240,
    h: 120,
    uploadedAssetId: artwork.id,
    src: artwork.browserSrc,
    objectFit: 'contain',
    imageScale: 192,
  },
  children: [],
}

const text: IComponent = {
  id: 'text',
  parent: 'root',
  type: 'Text',
  props: {
    x: 10, y: 160, w: 160, h: 48,
    textValue: 'Theme text',
    color: '#FFFFFF',
  },
  children: [],
}

const heading: IComponent = {
  id: 'heading',
  parent: 'root',
  type: 'Heading',
  props: {
    x: 10, y: 220, w: 240, h: 48,
    headingText: 'Theme heading',
    color: '#FFFFFF',
  },
  children: [],
}

const root: IComponent = {
  id: 'root',
  parent: 'root',
  type: 'Box',
  props: {},
  children: [canvas.id, text.id, heading.id],
}

const BrowserRegressionSurface = () => (
  <>
    {renderForgePreview({
      component: root,
      components: { root, canvas, text, heading },
    })}
  </>
)

const UseTealTheme = () => {
  const { setThemeId } = useForgeTheme()
  return <button onClick={() => setThemeId('cyber_teal')}>Use teal</button>
}

describe('Standard Canvas artwork and semantic label regressions', () => {
  beforeEach(() => {
    forgeUIClearUploadedAssets()
    forgeUIAddUploadedAssets([artwork])
  })

  afterEach(() => {
    forgeUIClearUploadedAssets()
  })

  it('keeps configured artwork and semantic labels identical in shared previews', () => {
    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <UseTealTheme />
          <StandardCanvasPreview
            component={canvas}
            palette={FG_PREVIEW_PALETTES.cyber_teal}
          />
          <StandardTextPreview
            component={text}
            palette={FG_PREVIEW_PALETTES.cyber_teal}
          />
          <StandardHeadingPreview
            component={heading}
            palette={FG_PREVIEW_PALETTES.cyber_teal}
          />
          <BrowserRegressionSurface />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Use teal' }))

    const images = screen.getAllByTestId('standard-canvas-artwork')
    expect(images).toHaveLength(2)
    images.forEach(image => {
      expect(image).toHaveAttribute('src', artwork.browserSrc)
      expect(image).toHaveStyle({ objectFit: 'contain' })
    })

    screen.getAllByTestId('standard-text-preview').forEach(label => {
      expect(label).toHaveStyle({ color: '#CCFBF1' })
      expect(label).not.toHaveStyle({ color: '#FFFFFF' })
    })
    screen.getAllByTestId('standard-heading-preview').forEach(label => {
      expect(label).toHaveStyle({ color: '#CCFBF1' })
      expect(label).not.toHaveStyle({ color: '#FFFFFF' })
    })
  })

  it('exports the configured artwork and textPrimary role', () => {
    const { code, assetSources } = generateForgeUILvglCode(
      { root, canvas, text, heading },
      'cyber_teal',
      undefined,
      { includeThemeTexture: false },
    )

    expect(code).toContain('lv_obj_t * obj1_image = lv_image_create(obj1);')
    expect(code).toContain('lv_image_set_src(obj1_image, &fg_canvas_art);')
    expect(code).toContain('lv_image_set_scale(obj1_image, 192);')
    expect(code).toContain('lv_obj_center(obj1_image);')
    expect(assetSources).toContain(artwork.cFile)
    expect(code).toContain(
      'lv_obj_set_style_text_color(obj2, lv_color_hex(0xCCFBF1), 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_color(obj3, lv_color_hex(0xCCFBF1), 0);',
    )
    expect(code).not.toContain('lv_color_hex(0xFFFFFF)')
  })
})
