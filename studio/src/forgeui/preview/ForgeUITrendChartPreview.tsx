import React, { useEffect, useMemo, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import {
  createForgeUITrendSimulation,
  normalizeForgeUITrendChart,
} from '../ForgeUITrendChart'
import { normalizeForgeUITrendChartPro } from '../ForgeUITrendChartPro'
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
  const pro = component.type === 'TrendChartPro'
  const model: any = useMemo(
    () =>
      pro
        ? normalizeForgeUITrendChartPro(component.props)
        : normalizeForgeUITrendChart(component.props),
    [component.props, pro],
  )
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
  const values = (simulated as number[]).map(
    (_: number, index: number) => simulated[(index + offset) % simulated.length],
  )
  const span = Math.max(Number.EPSILON, model.maximum - model.minimum)
  const points = values
    .map((value: number, index: number) => {
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
      background={
        pro && model.glassSurfaceEnabled
          ? `linear-gradient(155deg, ${model.backgroundColour || theme.surface}, ${theme.surfaceSecondary})`
          : model.backgroundColour || theme.surface
      }
      boxShadow={pro && model.shadowEnabled ? '0 12px 28px rgba(0, 0, 0, 0.28)' : 'none'}
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
                opacity={pro ? model.gridOpacity / 100 : 1}
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
          {(model.fill || (pro && model.gradientFillEnabled)) && (
            <polygon
              points={`4,96 ${points} 96,96`}
              fill={line}
              opacity={pro ? model.gradientOpacity / 100 : 0.14}
            />
          )}
          {pro && model.thresholdBandsEnabled && (
            <>
              <rect x="3" y="4" width="94" height="12" fill={theme.healthCritical} opacity="0.055" />
              <rect x="3" y="16" width="94" height="14" fill={theme.healthHigh} opacity="0.045" />
            </>
          )}
          {pro && model.glowEnabled && (
            <polyline
              points={points}
              fill="none"
              stroke={line}
              strokeWidth={model.glowWidth}
              opacity={model.glowOpacity / 100}
              vectorEffect="non-scaling-stroke"
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
              return (
                <g data-testid="forgeui-trend-chart-latest-marker">
                  {pro && model.premiumMarkerEnabled && (
                    <circle cx={x} cy={y} r="4.4" fill="none" stroke={statusColour} strokeWidth="0.8" opacity="0.7" />
                  )}
                  <circle cx={x} cy={y} r="2.2" fill={statusColour} />
                </g>
              )
            })()}
        </svg>
      </Box>
      <Flex justify="space-between" fontSize="10px" color={theme.textSecondary}>
        {(pro ? model.footerMode.includes('range') : model.showMinMax) ? (
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
        {pro && model.footerMode.includes('history') && (
          <Text>{model.historyLength} samples</Text>
        )}
      </Flex>
    </Flex>
  )
}
