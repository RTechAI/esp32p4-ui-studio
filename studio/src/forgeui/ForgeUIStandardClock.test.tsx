import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { act, render, screen } from '@testing-library/react'

import ClockPreview from '~components/editor/previews/ClockPreview'
import { getPreviewDefaultProps } from '~utils/defaultProps'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import {
  FORGEUI_STANDARD_CLOCK_DEFAULT_PRESENTATION,
  formatForgeUIStandardClockTime,
  getForgeUIStandardClockPresentation,
} from './ForgeUIStandardClock'

const clock = (props: Record<string, unknown> = {}): IComponent => ({
  id: 'clock',
  parent: 'root',
  type: 'Clock',
  componentName: 'Clock',
  props,
  children: [],
})

const BrowserPreview = ({ component }: { component: IComponent }) => {
  const root: IComponent = {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: [component.id],
  }
  return <>{renderForgePreview({
    component: root,
    components: { root, [component.id]: component },
  })}</>
}

describe('standard Clock presentation', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('serializes presentation defaults without serializing displayed time', () => {
    expect(getPreviewDefaultProps('Clock')).toMatchObject(
      FORGEUI_STANDARD_CLOCK_DEFAULT_PRESENTATION,
    )
    expect(getForgeUIStandardClockPresentation({})).toEqual(
      FORGEUI_STANDARD_CLOCK_DEFAULT_PRESENTATION,
    )

    const reloaded = JSON.parse(JSON.stringify(clock({
      hourFormat: '12',
      showSeconds: true,
      blinkSeparator: false,
    }))) as IComponent
    expect(getForgeUIStandardClockPresentation(reloaded.props)).toEqual({
      hourFormat: '12',
      showSeconds: true,
      blinkSeparator: false,
    })
    expect(reloaded.props).not.toHaveProperty('displayedTime')
  })

  it('formats 24-hour and 12-hour presentations', () => {
    const morning = new Date(2026, 6, 29, 0, 5, 9)
    const afternoon = new Date(2026, 6, 29, 13, 7, 8)

    expect(formatForgeUIStandardClockTime(
      morning,
      { hourFormat: '24', showSeconds: false, blinkSeparator: true },
    )).toBe('00:05')
    expect(formatForgeUIStandardClockTime(
      morning,
      { hourFormat: '12', showSeconds: true, blinkSeparator: false },
    )).toBe('12:05:09 AM')
    expect(formatForgeUIStandardClockTime(
      afternoon,
      { hourFormat: '12', showSeconds: false, blinkSeparator: true },
      false,
    )).toBe('01 07 PM')
  })

  it('updates Canvas Preview and honors separator blinking', () => {
    jest.useFakeTimers()
    ;(jest as any).setSystemTime(new Date(2026, 6, 29, 13, 7, 8))
    render(
      <ChakraProvider>
        <ClockPreview component={clock({
          hourFormat: '24',
          showSeconds: true,
          blinkSeparator: true,
        })} />
      </ChakraProvider>,
    )

    expect(screen.getByText('13:07:08')).toBeInTheDocument()
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText('13 07 09')).toBeInTheDocument()
  })

  it('uses the same live presentation in Browser Preview', () => {
    jest.useFakeTimers()
    ;(jest as any).setSystemTime(new Date(2026, 6, 29, 13, 7, 8))
    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserPreview component={clock({
            hourFormat: '12',
            showSeconds: true,
            blinkSeparator: false,
          })} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    expect(screen.getByText('01:07:08 PM')).toBeInTheDocument()
  })
})
