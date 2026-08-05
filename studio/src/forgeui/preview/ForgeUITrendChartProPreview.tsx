import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { normalizeForgeUITrendChartPro } from '../ForgeUITrendChartPro'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUITrendChartProPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUITrendChartPro(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const trace = model.traceColour || theme.accent
  const width = Math.max(220, Number(component.props.w) || 360)
  const height = Math.max(140, Number(component.props.h) || 220)
  const header = model.compactMode ? 42 : 58
  const left = 14, right = width - 14, top = header, bottom = height - 14
  const range = Math.max(1, model.maximum - model.minimum)
  const points = model.data.map((value, index) => ({
    x: left + (right - left) * index / Math.max(1, model.data.length - 1),
    y: bottom - (value - model.minimum) / range * (bottom - top),
  }))
  const line = points.map(point => `${point.x},${point.y}`).join(' ')
  const area = points.length ? `${left},${bottom} ${line} ${right},${bottom}` : ''
  const latest = points[points.length - 1]
  const thresholdY = (value: number) => bottom - (value - model.minimum) / range * (bottom - top)
  const id = component.id.replace(/[^a-zA-Z0-9_-]/g, '_')
  return <Flex data-testid="forgeui-trend-chart-pro" direction="column" width="100%" height="100%" overflow="hidden"
    pointerEvents="none" bg={theme.surface} border={`1px solid ${theme.surfaceBorder}`} borderRadius="10px" position="relative">
    <Flex position="absolute" left="14px" right="14px" top={model.compactMode ? '7px' : '10px'} align="baseline" justify="space-between">
      <Text color={theme.textSecondary} fontSize={model.compactMode ? '10px' : '12px'} fontWeight="600" noOfLines={1}>{model.title}</Text>
      <Flex align="baseline" gap="5px"><Text data-testid="trend-chart-pro-value" color={theme.textPrimary} fontSize={model.compactMode ? '20px' : '28px'} lineHeight="1" fontWeight="700">{model.formattedValue}</Text><Text color={theme.textSecondary} fontSize="11px" fontWeight="600">{model.units}</Text></Flex>
    </Flex>
    <Box as="svg" width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id={`fg-pro-fill-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={trace} stopOpacity="0.30"/><stop offset="1" stopColor={trace} stopOpacity="0.02"/></linearGradient><filter id={`fg-pro-glow-${id}`}><feGaussianBlur stdDeviation="3" result="blur"/></filter></defs>
      {model.showGrid && <g stroke={theme.surfaceBorder} strokeWidth="1" opacity="0.65" data-testid="trend-chart-pro-grid">{[0, .5, 1].map(f => <line key={`h${f}`} x1={left} x2={right} y1={top + (bottom-top)*f} y2={top + (bottom-top)*f}/>)}{[0, .5, 1].map(f => <line key={`v${f}`} y1={top} y2={bottom} x1={left + (right-left)*f} x2={left + (right-left)*f}/>)}</g>}
      {model.showThresholdBands && <g opacity="0.12"><rect x={left} width={right-left} y={top} height={Math.max(0, thresholdY(model.alarm)-top)} fill={model.alarmColour}/><rect x={left} width={right-left} y={thresholdY(model.alarm)} height={Math.max(0, thresholdY(model.warning)-thresholdY(model.alarm))} fill={model.warningColour}/></g>}
      {model.showAreaFill && <polygon points={area} fill={`url(#fg-pro-fill-${id})`}/>} 
      {model.showGlow && <polyline points={line} fill="none" stroke={trace} strokeWidth="7" opacity="0.24" filter={`url(#fg-pro-glow-${id})`}/>} 
      <polyline data-testid="trend-chart-pro-trace" points={line} fill="none" stroke={trace} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {model.showCurrentMarker && latest && <g data-testid="trend-chart-pro-marker"><circle cx={latest.x} cy={latest.y} r="5" fill={theme.surface} stroke={trace} strokeWidth="2"/><circle cx={latest.x} cy={latest.y} r="2" fill={trace}/></g>}
    </Box>
  </Flex>
}
