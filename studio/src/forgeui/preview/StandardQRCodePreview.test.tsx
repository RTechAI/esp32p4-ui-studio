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
    qrQuietZone: true,
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
  })
})
