import React from 'react'
import { Box } from '@chakra-ui/react'
import {
  ForgePreviewPalette,
  FG_PREVIEW_PALETTES,
  resolveForgeSemanticPalette,
} from '~forgeui/preview/forgeThemeMap'
import {
  getForgeUIStandardCalendarModel,
} from '~forgeui/ForgeUIStandardCalendar'

type StandardCalendarPreviewProps = {
  component: IComponent
  palette?: ForgePreviewPalette
}

const StandardCalendarPreview: React.FC<
  StandardCalendarPreviewProps
> = ({
  component,
  palette = FG_PREVIEW_PALETTES.graphite,
}) => {
  const calendar = getForgeUIStandardCalendarModel()
  const theme = resolveForgeSemanticPalette(palette)
  const dates = calendar.weeks.flat()

  return (
    <Box
      width="100%"
      height="100%"
      bg={theme.surface}
      color={theme.textPrimary}
      border={`2px solid ${theme.surfaceBorder}`}
      borderRadius="12px"
      overflow="hidden"
      pointerEvents="none"
      data-testid="standard-calendar-preview"
      data-calendar-year={calendar.shownYear}
      data-calendar-month={calendar.shownMonth}
      data-calendar-header={calendar.headerType}
      data-calendar-weeks={calendar.displayedWeekCount}
    >
      <Box
        width="100%"
        height="100%"
        p="14px"
        display="grid"
        gridTemplateColumns="repeat(7, minmax(0, 1fr))"
        gridTemplateRows="repeat(7, minmax(0, 1fr))"
        gap="7px"
        fontSize="14px"
        textAlign="center"
        data-testid="standard-calendar-grid"
      >
        {calendar.weekdayLabels.map(label => (
          <Box
            key={label}
            minWidth="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            opacity={0.75}
            data-testid="standard-calendar-weekday"
          >
            {label}
          </Box>
        ))}
        {dates.map((date, index) => (
          <Box
            key={`${date.year}-${date.month}-${date.day}-${index}`}
            minWidth="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            bg={
              date.highlighted
                ? `${theme.selectedSurface}66`
                : date.currentMonth
                  ? 'rgba(255,255,255,0.08)'
                  : 'transparent'
            }
            color={
              date.currentMonth
                ? theme.textPrimary
                : theme.textSecondary
            }
            border={
              date.today
                ? `2px solid ${theme.accent}`
                : date.currentMonth
                  ? '1px solid rgba(255,255,255,0.28)'
                  : '1px solid transparent'
            }
            opacity={date.currentMonth ? 1 : 0.4}
            data-testid="standard-calendar-day"
            data-date={`${date.year}-${date.month}-${date.day}`}
            data-current-month={date.currentMonth}
            data-today={date.today}
            data-highlighted={date.highlighted}
          >
            {date.day}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default StandardCalendarPreview
