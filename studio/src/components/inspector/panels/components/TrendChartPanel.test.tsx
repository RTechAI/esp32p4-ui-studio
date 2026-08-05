import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { TrendChartPanel } from './TrendChartPanel'

const setValue = jest.fn()
const values: Record<string, unknown> = {
  title: 'Pressure', xAxisMode: 'relative-time', xAxisLabel: '', historyWindowSeconds: 60,
  yAxisLabel: 'bar', yMin: 0, yMax: 10,
  pointCount: 12, initialData: [1, 2, 3], showGrid: true, showAxisLabels: true,
  showThresholds: true, warningThreshold: 7, alarmThreshold: 9,
  updateRateMs: 500, simulateValues: false, generateRuntimeApi: true,
}
jest.mock('~hooks/useForm', () => ({ useForm: () => ({ setValue }) }))
jest.mock('~hooks/usePropsSelector', () => (name: string) => values[name])

describe('Trend Chart Inspector', () => {
  it('exposes the complete semantic authoring contract', () => {
    render(<ChakraProvider><TrendChartPanel /></ChakraProvider>)
    expect(screen.getByText('ForgeUI Native Trend Chart')).toBeInTheDocument()
    ;['Title', 'History labels', 'History window (seconds)', 'Y-axis label', 'Y minimum', 'Y maximum',
      'Point count', 'Grid divisions', 'Simulated values (comma separated)',
      'Warning threshold', 'Alarm threshold', 'Update rate (ms)'].forEach(label =>
      expect(screen.getByText(label)).toBeInTheDocument())
    fireEvent.click(screen.getByRole('checkbox', { name: 'Show grid' }))
    expect(setValue).toHaveBeenCalledWith('showGrid', false)
  })
})
