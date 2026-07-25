import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  render,
  screen,
} from '@testing-library/react'

import UnconfiguredLightPlaceholder from './UnconfiguredLightPlaceholder'

describe('Unconfigured Light placeholder', () => {
  it('uses an icon-only compact layout without overflow text', () => {
    render(
      <ChakraProvider>
        <UnconfiguredLightPlaceholder
          width={32}
          height={32}
        />
      </ChakraProvider>,
    )
    const icon = screen.getByTestId('unconfigured-light-icon')
    expect(icon).toHaveAttribute('width', '27')
    expect(icon).toHaveAttribute('height', '28')
    expect(icon).toHaveStyle({
      pointerEvents: 'none',
      flexShrink: '0',
    })
    expect(screen.getByTestId('unconfigured-light-placeholder'))
      .toHaveAttribute('data-layout', 'compact')
    expect(screen.queryByText('OFF')).not.toBeInTheDocument()
  })

  it('shows concise state hints when space permits', () => {
    render(
      <ChakraProvider>
        <UnconfiguredLightPlaceholder
          width={160}
          height={100}
        />
      </ChakraProvider>,
    )
    expect(screen.getByText('OFF')).toBeInTheDocument()
    expect(screen.getByText('ON')).toBeInTheDocument()
  })
})
