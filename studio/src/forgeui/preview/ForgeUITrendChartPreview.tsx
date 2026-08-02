import React, { useEffect, useMemo, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import {
  createForgeUITrendSimulation,
  normalizeForgeUITrendChart,
} from '../ForgeUITrendChart'
import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

export const ForgeUITrendChartPreview = ({
  component,
  palette,
}: {
  component: IComponent
  palette: ForgePreviewPalette
}) => {
  const model = useMemo(() => normalizeForgeUITrendChart(component.props), [
    component.props,
  ])
  const theme = resolveForgeSemanticPalette(palette)
  const simulated = useMemo(
    () =>
      model.history.length > 1
        ? model.history
        : createForgeUITrendSimulation(
            model,
            Math.min(model.historyLength, 48),
          ),
    [model],
  )
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setOffset(value => value + 1), 900)
    return () => window.clearInterval(timer)
  }, [])
  const values = simulated.map(
    (_, index) => simulated[(index + offset) % simulated.length],
  )
  const span = Math.max(Number.EPSILON, model.maximum - model.minimum)
  const points = values
    .map((value, index) => {
      const x = 4 + (index / Math.max(1, values.length - 1)) * 92
      const y = 92 - ((value - model.minimum) / span) * 84
      return `${x},${Math.max(4, Math.min(96, y))}`
    })
    .join(' ')
  const latest = values[values.length - 1] ?? model.currentValue
  const line = model.lineColour || theme.accent
  const statusColour =
    latest >= model.alarmThreshold
      ? theme.healthCritical
      : latest >= model.warningThreshold
      ? theme.healthHigh
      : theme.healthNormal

  return (
    <Flex
      data-testid="forgeui-trend-chart"
      direction="column"
      width="100%"
      height="100%"
      overflow="hidden"
      border={model.border ? '1px solid' : 'none'}
      borderColor={theme.surfaceBorder}
      borderRadius={model.rounded ? '12px' : 0}
      background={model.backgroundColour || theme.surface}
      color={theme.textPrimary}
      padding={`${model.padding}px`}
      gap="5px"
    >
      <Flex justify="space-between" align="baseline" gap="8px">
        <Text fontSize="sm" fontWeight="700" noOfLines={1}>
          {model.title}
        </Text>
        {model.showCurrentValue && (
          <Text fontSize="sm" fontWeight="800" color={statusColour}>
            {Number(latest.toFixed(2))}
            {model.units ? ` ${model.units}` : ''}
          </Text>
        )}
      </Flex>
      <Box flex="1" minHeight="40px" position="relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          aria-label={`${model.title} simulated trend`}
        >
          {model.showGrid &&
            [25, 50, 75].map(value => (
              <line
                key={value}
                x1="3"
                x2="97"
                y1={value}
                y2={value}
                stroke={theme.surfaceBorder}
                strokeWidth="0.5"
              />
            ))}
          {model.showAxes && (
            <>
              <line
                x1="3"
                x2="3"
                y1="4"
                y2="96"
                stroke={theme.textSecondary}
                strokeWidth="0.7"
              />
              <line
                x1="3"
                x2="97"
                y1="96"
                y2="96"
                stroke={theme.textSecondary}
                strokeWidth="0.7"
              />
            </>
          )}
          {model.fill && (
            <polygon
              points={`4,96 ${points} 96,96`}
              fill={line}
              opacity="0.14"
            />
          )}
          <polyline
            points={points}
            fill="none"
            stroke={line}
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />
          {model.showLatestMarker &&
            points &&
            (() => {
              const [x, y] = points
                .split(' ')
                .slice(-1)[0]
                .split(',')
              return <circle cx={x} cy={y} r="2.2" fill={statusColour} />
            })()}
        </svg>
      </Box>
      <Flex justify="space-between" fontSize="10px" color={theme.textSecondary}>
        {model.showMinMax ? (
          <>
            <Text>
              {model.minimum} {model.units}
            </Text>
            <Text>
              {model.maximum} {model.units}
            </Text>
          </>
        ) : (
          <Box />
        )}
        {model.showLegend && <Text color={line}>{model.semanticType}</Text>}
      </Flex>
    </Flex>
  )
}
