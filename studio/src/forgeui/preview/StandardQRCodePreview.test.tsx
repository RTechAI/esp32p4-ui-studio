import React from 'react'
import { render, screen } from '@testing-library/react'
import { TextEncoder } from 'util'

import StandardQRCodePreview from './StandardQRCodePreview'
import { FG_PREVIEW_PALETTES } from './forgeThemeMap'

global.TextEncoder = TextEncoder as typeof global.TextEncoder

const component: IComponent = {
  id: 'qr',
  parent: 'root',
  type: 'QRCode',
  props: {
    qrText: 'WIFI:T:WPA;S:ExampleNetwork;P:ExamplePassword;;',
    w: 180,
    h: 200,
  },
  children: [],
}

describe('StandardQRCodePreview', () => {
  it('renders deterministic vector modules with an accessible payload name', () => {
    const { container } = render(
      <StandardQRCodePreview
        component={component}
        palette={FG_PREVIEW_PALETTES.graphite}
      />,
    )

    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'QR Code: WIFI:T:WPA;S:ExampleNetwork;P:ExamplePassword;;',
    )
    expect(container.querySelector('svg path')?.getAttribute('d')).toMatch(/^M/)
    expect(container.querySelector('svg')).toHaveAttribute(
      'shape-rendering',
      'crispEdges',
    )
    expect(container.querySelector('svg')).toHaveAttribute(
      'viewBox',
      '0 0 180 180',
    )
    expect(container.querySelector('svg path')?.getAttribute('d'))
      .toMatch(/h[2-9]\d*v[2-9]\d*h-[2-9]\d*z|h[2-9]v[2-9]h-[2-9]z/)
  })

  it('uses the shared typed-payload resolver', () => {
    render(
      <StandardQRCodePreview
        component={{
          ...component,
          props: {
            ...component.props,
            contentType: 'phone',
            qrPhoneNumber: '+6421555010',
          },
        }}
        palette={FG_PREVIEW_PALETTES.graphite}
      />,
    )

    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'QR Code: tel:+6421555010',
    )
  })
})
