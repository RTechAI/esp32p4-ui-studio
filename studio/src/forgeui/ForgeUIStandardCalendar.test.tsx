import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import { storeConfig } from '../core/store'
import ComponentPreview from '../components/editor/ComponentPreview'
import {
  createForgeUIStandardCalendarModel,
  getForgeUIStandardCalendarModel,
} from './ForgeUIStandardCalendar'
import StandardCalendarPreview from './preview/StandardCalendarPreview'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

jest.mock('../components/editor/PreviewContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const calendar = (): IComponent => ({
  id: 'calendar',
  parent: 'root',
  type: 'Calendar',
  props: { x: 481, y: 53, w: 429, h: 170 },
  children: [],
})

const BrowserCalendar = ({ component }: { component: IComponent }) => {
  const root: IComponent = {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: [component.id],
  }
  return <>{renderForgePreview({
    component: root,
    components: { root, calendar: component },
  })}</>
}

const modelFor = (
  shownYear: number,
  shownMonth: number,
) => createForgeUIStandardCalendarModel({
  shownYear,
  shownMonth,
  today: { year: 2000, month: 1, day: 1 },
})

describe('Standard Calendar preview parity', () => {
  it('models the exact exporter and LVGL configuration defaults', () => {
    const model = getForgeUIStandardCalendarModel()

    expect(model).toMatchObject({
      shownYear: 2026,
      shownMonth: 6,
      today: { year: 2026, month: 6, day: 18 },
      highlightedDates: [],
      weekdayLabels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      naturalWeekCount: 5,
      displayedWeekCount: 6,
      headerType: 'none',
    })
    expect(model.weeks).toHaveLength(6)
    expect(model.weeks.every(week => week.length === 7)).toBe(true)
  })

  it.each([
    [2024, 9, 0],
    [2024, 4, 1],
    [2024, 10, 2],
    [2024, 5, 3],
    [2024, 8, 4],
    [2024, 11, 5],
    [2024, 6, 6],
  ])('places %i-%i on weekday index %i', (year, month, expectedIndex) => {
    const days = modelFor(year, month).weeks.flat()
    expect(days.findIndex(day => day.currentMonth && day.day === 1))
      .toBe(expectedIndex)
  })

  it('keeps LVGL six-row display for natural four, five and six-week months', () => {
    expect(modelFor(2026, 2)).toMatchObject({
      naturalWeekCount: 4,
      displayedWeekCount: 6,
    })
    expect(modelFor(2026, 6)).toMatchObject({
      naturalWeekCount: 5,
      displayedWeekCount: 6,
    })
    expect(modelFor(2026, 8)).toMatchObject({
      naturalWeekCount: 6,
      displayedWeekCount: 6,
    })
  })

  it('handles leap February and previous/next month spill dates', () => {
    const leapDays = modelFor(2024, 2).weeks.flat()
    expect(leapDays.some(day =>
      day.currentMonth && day.day === 29)).toBe(true)

    const juneDays = modelFor(2026, 6).weeks.flat()
    expect(juneDays[0]).toMatchObject({
      year: 2026, month: 5, day: 31, currentMonth: false,
    })
    expect(juneDays[1]).toMatchObject({
      year: 2026, month: 6, day: 1, currentMonth: true,
    })
    expect(juneDays[31]).toMatchObject({
      year: 2026, month: 7, day: 1, currentMonth: false,
    })
    expect(juneDays[41]).toMatchObject({
      year: 2026, month: 7, day: 11, currentMonth: false,
    })
  })

  it('marks deterministic today and highlighted dates independently', () => {
    const model = createForgeUIStandardCalendarModel({
      shownYear: 2026,
      shownMonth: 6,
      today: { year: 2026, month: 6, day: 18 },
      highlightedDates: [{ year: 2026, month: 6, day: 22 }],
    })
    const days = model.weeks.flat()

    expect(days.find(day => day.today)).toMatchObject({
      year: 2026, month: 6, day: 18, highlighted: false,
    })
    expect(days.find(day => day.highlighted)).toMatchObject({
      year: 2026, month: 6, day: 22, today: false,
    })
  })

  it('renders the native weekday/date structure and P4 surface', () => {
    render(
      <ChakraProvider>
        <StandardCalendarPreview component={calendar()} />
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-calendar-preview')
    expect(preview).toHaveStyle({
      background: '#1E2328',
      border: '2px solid #F2A900',
      borderRadius: '12px',
      overflow: 'hidden',
    })
    expect(preview).toHaveAttribute('data-calendar-header', 'none')
    expect(preview).toHaveAttribute('data-calendar-weeks', '6')
    expect(screen.getAllByTestId('standard-calendar-weekday')
      .map(day => day.textContent))
      .toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
    expect(screen.getAllByTestId('standard-calendar-day')).toHaveLength(42)
    const today = screen.getAllByTestId('standard-calendar-day')
      .find(day => day.getAttribute('data-today') === 'true')
    expect(today).toHaveTextContent('18')
    expect(today).toHaveStyle({ border: '2px solid #F2A900' })
  })

  it('preserves serialized geometry through the generic store model', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Calendar',
      rootParentType: 'Calendar',
      testId: 'calendar',
      props: calendar().props,
    })

    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.calendar.props)
      .toMatchObject({ x: 481, y: 53, w: 429, h: 170 })
  })

  it('uses the shared renderer on Canvas', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Calendar',
      rootParentType: 'Calendar',
      testId: 'calendar',
      props: calendar().props,
    })
    render(
      <ChakraProvider>
        <Provider store={store}>
          <ComponentPreview componentName="calendar" />
        </Provider>
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-calendar-preview'))
      .toBeInTheDocument()
    expect(screen.getAllByTestId('standard-calendar-day')).toHaveLength(42)
  })

  it('uses the same shared renderer and geometry in Browser Preview', () => {
    const component = calendar()
    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserCalendar component={component} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-calendar-preview')
    expect(preview.parentElement).toHaveStyle({
      left: '481px',
      top: '53px',
      width: '429px',
      height: '170px',
    })
    expect(screen.getAllByTestId('standard-calendar-weekday')).toHaveLength(7)
    expect(screen.getAllByTestId('standard-calendar-day')).toHaveLength(42)
  })
})
