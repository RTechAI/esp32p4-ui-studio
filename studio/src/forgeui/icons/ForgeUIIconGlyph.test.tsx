import React from 'react'
import { render } from '@testing-library/react'

import { ForgeUIIconGlyph } from './ForgeUIIconGlyph'

describe('canonical Icon Selector preview', () => {
  it('uses the shared automatic fit instead of an independent selector size', () => {
    const { container } = render(
      <ForgeUIIconGlyph iconName="FiAirplay" width={18} height={18} />,
    )
    expect(container.querySelector('svg')).toHaveAttribute('height', '17')
    expect(container.querySelector('svg')).toHaveAttribute('width', '17')
  })
})
