import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'

import { generateForgeUILvglCode } from './ForgeUILvglExport'
import {
  fitForgeUIStandardLineEndpoints,
  getForgeUIStandardLineGeometry,
  updateForgeUIStandardLineEndpoint,
} from './ForgeUIStandardLine'
import StandardLinePreview from './preview/StandardLinePreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'

const line = (
  id: string,
  props: Record<string, unknown>,
): IComponent => ({
  id,
  parent: 'root',
  type: 'Line',
  props: { x: 10, y: 20, w: 120, h: 120, lineWidth: 3, ...props },
  children: [],
})

const generate = (component: IComponent) =>
  generateForgeUILvglCode({
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: [component.id],
    },
    [component.id]: component,
  }, 'cyber_teal', undefined, { includeThemeTexture: false }).code

describe('Standard Line endpoint model', () => {
  it('loads legacy width/height projects as the original diagonal', () => {
    expect(getForgeUIStandardLineGeometry({
      x: 10, y: 20, w: 80, h: 40,
    })).toEqual({
      x: 10,
      y: 20,
      w: 80,
      h: 40,
      startX: 0,
      startY: 0,
      endX: 80,
      endY: 40,
    })
  })

  it.each([
    ['horizontal', { startX: 0, startY: 0, endX: 120, endY: 0 }, '{120, 0}'],
    ['vertical', { startX: 0, startY: 0, endX: 0, endY: 120 }, '{0, 120}'],
    ['45 degree', { startX: 0, startY: 0, endX: 120, endY: 120 }, '{120, 120}'],
    ['arbitrary', { startX: 8, startY: 72, endX: 101, endY: 13 }, '{101, 13}'],
  ])('exports a %s native LVGL line', (_, props, expectedEnd) => {
    const code = generate(line('line', props))
    expect(code).toContain(`{${props.startX}, ${props.startY}}`)
    expect(code).toContain(expectedEnd)
    expect(code).toContain('lv_obj_t * obj1 = lv_line_create(fg_application_page);')
    expect(code).toContain('lv_line_set_points(obj1, obj1_pts, 2);')
  })

  it('rebases the bounding box when an endpoint crosses the other endpoint', () => {
    expect(updateForgeUIStandardLineEndpoint({
      x: 40, y: 50, w: 100, h: 80,
      startX: 0, startY: 0, endX: 100, endY: 80,
    }, 'start', { x: 180, y: 160 })).toEqual({
      x: 140,
      y: 130,
      w: 40,
      h: 30,
      startX: 40,
      startY: 30,
      endX: 0,
      endY: 0,
    })
  })

  it('keeps horizontal and vertical bounding boxes usable', () => {
    expect(fitForgeUIStandardLineEndpoints({
      start: { x: 10, y: 20 },
      end: { x: 90, y: 20 },
    })).toMatchObject({ w: 80, h: 1 })
    expect(fitForgeUIStandardLineEndpoints({
      start: { x: 10, y: 20 },
      end: { x: 10, y: 90 },
    })).toMatchObject({ w: 1, h: 70 })
  })

  it('renders serialized endpoints and line width in the shared preview', () => {
    render(
      <ChakraProvider>
        <StandardLinePreview
          component={line('line', {
            w: 140,
            h: 90,
            startX: 12,
            startY: 75,
            endX: 130,
            endY: 8,
            lineWidth: 5,
          })}
          palette={FG_PREVIEW_PALETTES.cyber_teal}
        />
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-line-preview'))
      .toHaveAttribute('viewBox', '0 0 140 90')
    expect(screen.getByTestId('standard-line-stroke'))
      .toHaveAttribute('x1', '12')
    expect(screen.getByTestId('standard-line-stroke'))
      .toHaveAttribute('y1', '75')
    expect(screen.getByTestId('standard-line-stroke'))
      .toHaveAttribute('x2', '130')
    expect(screen.getByTestId('standard-line-stroke'))
      .toHaveAttribute('y2', '8')
    expect(screen.getByTestId('standard-line-stroke'))
      .toHaveAttribute('stroke-width', '5')
  })

  it('keeps colour, opacity, visibility, and multiple instances native', () => {
    const first = line('first', {
      borderColor: '#123456', opacity: 0.5, visible: false,
    })
    const second = line('second', {
      x: 200, y: 100, startX: 5, startY: 8, endX: 90, endY: 20,
    })
    const code = generateForgeUILvglCode({
      root: {
        id: 'root', parent: 'root', type: 'Box', props: {},
        children: ['first', 'second'],
      },
      first,
      second,
    }, 'cyber_teal', undefined, { includeThemeTexture: false }).code

    expect(code.match(/lv_line_create\(fg_application_page\)/g)).toHaveLength(2)
    expect(code).toContain('lv_color_hex(0x123456)')
    expect(code).toContain('lv_obj_set_style_line_opa(obj1, 128, LV_PART_MAIN);')
    expect(code).toContain('lv_obj_add_flag(obj1, LV_OBJ_FLAG_HIDDEN);')
  })

  it('emits deterministic native code for Live and Standalone consumers', () => {
    const component = line('proof-line', {
      startX: 9,
      startY: 81,
      endX: 111,
      endY: 14,
      borderColor: '#22D3EE',
      opacity: 0.75,
    })

    expect(generate(component)).toBe(generate(component))
  })
})
