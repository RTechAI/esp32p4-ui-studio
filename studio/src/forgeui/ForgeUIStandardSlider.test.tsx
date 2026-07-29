import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import StandardSliderPreview from './preview/StandardSliderPreview'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock

describe('Standard Slider preview interaction modes', () => {
  it('keeps Canvas value interaction local and cancels component drag', () => {
    const serialized = { value: 40, min: 10, max: 90, step: 5 }
    render(
      <ChakraProvider>
        <StandardSliderPreview mode="canvas" {...serialized} />
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-slider-control'))
      .toHaveClass('forgeui-canvas-control-interactive')
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '40')
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' })
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '45')
    expect(serialized.value).toBe(40)
    expect(fireEvent.dragStart(screen.getByTestId('standard-slider-control')))
      .toBe(false)
  })

  it('keeps Browser Preview interactive with temporary local state', () => {
    const serialized = { value: 40, min: 10, max: 90, step: 5 }
    render(
      <ChakraProvider>
        <StandardSliderPreview mode="browser" {...serialized} />
      </ChakraProvider>,
    )
    const slider = screen.getByRole('slider')

    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveAttribute('aria-valuenow', '45')
    expect(serialized.value).toBe(40)
  })

  it('resets Browser Preview when serialized value changes', () => {
    const view = render(
      <ChakraProvider>
        <StandardSliderPreview
          mode="browser"
          value={20}
          min={0}
          max={100}
          step={10}
        />
      </ChakraProvider>,
    )
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveAttribute('aria-valuenow', '30')

    view.rerender(
      <ChakraProvider>
        <StandardSliderPreview
          mode="browser"
          value={70}
          min={0}
          max={100}
          step={10}
        />
      </ChakraProvider>,
    )
    expect(slider).toHaveAttribute('aria-valuenow', '70')
  })

  it('resets Canvas Preview when serialized value changes', () => {
    const view = render(
      <ChakraProvider>
        <StandardSliderPreview
          mode="canvas"
          value={20}
          min={0}
          max={100}
          step={10}
        />
      </ChakraProvider>,
    )
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveAttribute('aria-valuenow', '30')

    view.rerender(
      <ChakraProvider>
        <StandardSliderPreview
          mode="canvas"
          value={70}
          min={0}
          max={100}
          step={10}
        />
      </ChakraProvider>,
    )
    expect(slider).toHaveAttribute('aria-valuenow', '70')
  })

  it('preserves configured range, step, orientation, and disabled state', () => {
    render(
      <ChakraProvider>
        <StandardSliderPreview
          mode="browser"
          value={-10}
          min={-50}
          max={50}
          step={2}
          orientation="vertical"
          isDisabled
          trackColor="#111111"
          fillColor="#22d3ee"
          thumbColor="#ffffff"
        />
      </ChakraProvider>,
    )
    const slider = screen.getByRole('slider')

    expect(slider).toHaveAttribute('aria-valuemin', '-50')
    expect(slider).toHaveAttribute('aria-valuemax', '50')
    expect(slider).toHaveAttribute('aria-valuenow', '-10')
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
    expect(slider).toHaveAttribute('aria-disabled', 'true')
  })
})
