import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { TrendChartProPanel } from './TrendChartProPanel'

const values: Record<string, unknown> = { units: 'RPM', autoScale: true, showGrid: true,
  showAreaFill: true, showGlow: true, showCurrentMarker: true, showThresholdBands: true,
  compactMode: false, generateRuntimeApi: true, enableUserEvents: true }
jest.mock('~hooks/useForm', () => ({ useForm: () => ({ setValue: jest.fn() }) }))
jest.mock('~hooks/usePropsSelector', () => (name: string) => values[name])

test('Trend Chart Pro Inspector exposes semantic groups and properties', () => {
  render(<ChakraProvider><TrendChartProPanel /></ChakraProvider>)
  ;['ForgeUI Native Trend Chart Pro', 'General', 'Appearance', 'Trend', 'Thresholds',
    'Title', 'Units', 'Live value', 'History length', 'Update rate (ms)', 'Warning',
    'Alarm', 'Generate Runtime SDK', 'Generate threshold UserEvents'].forEach(text =>
    expect(screen.getByText(text)).toBeInTheDocument())
})
