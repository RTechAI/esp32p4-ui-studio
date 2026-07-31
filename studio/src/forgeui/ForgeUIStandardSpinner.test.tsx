import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import StandardSpinnerPreview from './preview/StandardSpinnerPreview'

describe('Standard Spinner shared preview', () => {
  it('renders native-like theme-aware geometry without interaction', () => {
    render(
      <ChakraProvider>
        <StandardSpinnerPreview
          duration={1800}
          arcLength={120}
          arcWidth={10}
          backgroundWidth={4}
          accentColor="#22d3ee"
          backgroundColor="#112233"
          opacity={75}
        />
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-spinner-preview')
    expect(preview).toHaveAttribute('data-duration', '1800')
    expect(preview).toHaveAttribute('data-arc-length', '120')
    expect(preview).toHaveStyle({ pointerEvents: 'none' })
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('clamps invalid native animation properties deterministically', () => {
    render(
      <ChakraProvider>
        <StandardSpinnerPreview duration={0} arcLength={999} opacity={200} />
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-spinner-preview')
    expect(preview).toHaveAttribute('data-duration', '1')
    expect(preview).toHaveAttribute('data-arc-length', '359')
  })
})
