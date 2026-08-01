import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import StandardIconPreview from './StandardIconPreview'
import { FG_PREVIEW_PALETTES } from './forgeThemeMap'

const component = (props: Record<string, unknown>): IComponent => ({
  id: 'icon-1',
  parent: 'root',
  type: 'Icon',
  componentName: 'Living Room AirPlay',
  props: { icon: 'FiAirplay', w: 96, h: 80, ...props },
  children: [],
})

describe('Standard Icon interaction preview', () => {
  it('keeps legacy icons display-only', () => {
    render(<StandardIconPreview component={component({})} palette={FG_PREVIEW_PALETTES.graphite} />)
    expect(screen.getByTestId('standard-icon-preview')).toHaveAttribute('data-click-enabled', 'false')
  })

  it('suppresses the editor gesture, shows pressed opacity and emits one preview event', () => {
    const listener = jest.fn()
    const parentPointerDown = jest.fn()
    window.addEventListener('forgeui-preview-user-event', listener)
    render(<div onMouseDown={parentPointerDown}><StandardIconPreview
      component={component({ enableClick: true, pressedOpacity: 60 })}
      palette={FG_PREVIEW_PALETTES.graphite}
    /></div>)
    const preview = screen.getByTestId('standard-icon-preview')
    fireEvent.mouseDown(preview)
    expect(parentPointerDown).not.toHaveBeenCalled()
    expect(preview).toHaveAttribute('data-pressed', 'true')
    fireEvent.pointerUp(preview)
    fireEvent.click(preview)
    expect(listener).toHaveBeenCalledTimes(1)
    window.removeEventListener('forgeui-preview-user-event', listener)
  })
})
