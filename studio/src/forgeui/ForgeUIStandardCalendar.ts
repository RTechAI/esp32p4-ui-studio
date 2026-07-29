export type ForgeUIStandardCalendarDate = {
  year: number
  month: number
  day: number
}

export type ForgeUIStandardCalendarDay = ForgeUIStandardCalendarDate & {
  currentMonth: boolean
  today: boolean
  highlighted: boolean
}

export type ForgeUIStandardCalendarModel = {
  shownYear: number
  shownMonth: number
  today: ForgeUIStandardCalendarDate
  highlightedDates: ForgeUIStandardCalendarDate[]
  weekdayLabels: string[]
  weeks: ForgeUIStandardCalendarDay[][]
  naturalWeekCount: number
  displayedWeekCount: number
  headerType: 'none'
}

export const FORGEUI_STANDARD_CALENDAR_SHOWN_YEAR = 2026
export const FORGEUI_STANDARD_CALENDAR_SHOWN_MONTH = 6
export const FORGEUI_STANDARD_CALENDAR_TODAY = {
  year: 2026,
  month: 6,
  day: 18,
}
export const FORGEUI_STANDARD_CALENDAR_WEEKDAYS = [
  'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa',
]

const daysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate()

const sameDate = (
  left: ForgeUIStandardCalendarDate,
  right: ForgeUIStandardCalendarDate,
) => left.year === right.year &&
  left.month === right.month &&
  left.day === right.day

export const createForgeUIStandardCalendarModel = ({
  shownYear,
  shownMonth,
  today,
  highlightedDates = [],
}: {
  shownYear: number
  shownMonth: number
  today: ForgeUIStandardCalendarDate
  highlightedDates?: ForgeUIStandardCalendarDate[]
}): ForgeUIStandardCalendarModel => {
  const firstWeekday = new Date(
    Date.UTC(shownYear, shownMonth - 1, 1),
  ).getUTCDay()
  const currentMonthLength = daysInMonth(shownYear, shownMonth)
  const previousMonth = shownMonth === 1 ? 12 : shownMonth - 1
  const previousYear = shownMonth === 1 ? shownYear - 1 : shownYear
  const previousMonthLength = daysInMonth(previousYear, previousMonth)

  const days = Array.from({ length: 42 }, (_, index) => {
    const relativeDay = index - firstWeekday + 1
    let year = shownYear
    let month = shownMonth
    let day = relativeDay
    let currentMonth = true

    if (relativeDay <= 0) {
      year = previousYear
      month = previousMonth
      day = previousMonthLength + relativeDay
      currentMonth = false
    } else if (relativeDay > currentMonthLength) {
      month = shownMonth === 12 ? 1 : shownMonth + 1
      year = shownMonth === 12 ? shownYear + 1 : shownYear
      day = relativeDay - currentMonthLength
      currentMonth = false
    }

    const date = { year, month, day }
    return {
      ...date,
      currentMonth,
      today: sameDate(date, today),
      highlighted: highlightedDates.some(highlighted =>
        sameDate(date, highlighted)),
    }
  })

  return {
    shownYear,
    shownMonth,
    today,
    highlightedDates,
    weekdayLabels: [...FORGEUI_STANDARD_CALENDAR_WEEKDAYS],
    weeks: Array.from(
      { length: 6 },
      (_, row) => days.slice(row * 7, row * 7 + 7),
    ),
    naturalWeekCount: Math.ceil(
      (firstWeekday + currentMonthLength) / 7,
    ),
    displayedWeekCount: 6,
    headerType: 'none',
  }
}

export const getForgeUIStandardCalendarModel =
  (): ForgeUIStandardCalendarModel =>
    createForgeUIStandardCalendarModel({
      shownYear: FORGEUI_STANDARD_CALENDAR_SHOWN_YEAR,
      shownMonth: FORGEUI_STANDARD_CALENDAR_SHOWN_MONTH,
      today: FORGEUI_STANDARD_CALENDAR_TODAY,
    })
