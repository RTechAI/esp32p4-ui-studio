import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, SimpleGrid, Stack, Text, Textarea } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import { useSelectedComponentProps } from '~hooks/useSelectedComponentProps'
import { getForgeUIStandardChartModel } from '~forgeui/ForgeUIStandardChart'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

const labelProps = { fontSize: 'xs', color: INSPECTOR_PROPERTY_TEXT_COLOR, opacity: 1 }
const checkboxProps = { color: INSPECTOR_PROPERTY_TEXT_COLOR,
  sx: { '.chakra-checkbox__label': { color: 'inherit', opacity: 1 } } }

export const TrendChartPanel = () => {
  const { setValue } = useForm()
  const names = ['title','xAxisMode','xAxisLabel','historyWindowSeconds','historyEndTime','yAxisLabel','yMin','yMax','pointCount','initialData',
    'seriesColor','warningColor','alarmColor','showGrid','showAxisLabels','showThresholds',
    'warningThreshold','alarmThreshold','horizontalDivisions','updateRateMs','simulateValues',
    'simulatedMinimum','simulatedMaximum','updateMode','generateRuntimeApi']
  const props = useSelectedComponentProps(names)
  const model = getForgeUIStandardChartModel(props)
  const input = (label: string, name: string, value: string) => <FormControl><FormLabel {...labelProps}>{label}</FormLabel><Input size="sm" value={value} onChange={e => setValue(name, e.target.value)} /></FormControl>
  const number = (label: string, name: string, value: number, min?: number) => <FormControl><FormLabel {...labelProps}>{label}</FormLabel><NumberInput size="sm" min={min} value={value} onChange={(_, n) => Number.isFinite(n) && setValue(name, n)}><NumberInputField /></NumberInput></FormControl>
  const check = (label: string, name: string, value: boolean) => <Checkbox {...checkboxProps} isChecked={value} onChange={e => setValue(name, e.target.checked)}>{label}</Checkbox>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}>
    <Text fontSize="sm" fontWeight="bold">ForgeUI Native Trend Chart</Text>
    {input('Title','title',model.title)}
    <FormControl><FormLabel {...labelProps}>History labels</FormLabel><Select size="sm" value={model.xAxisMode} onChange={e => setValue('xAxisMode', e.target.value)}><option value="relative-time">Relative time</option><option value="clock-time">Clock time</option><option value="hidden">Hidden (compact)</option><option value="samples">Engineering samples</option></Select></FormControl>
    {model.xAxisMode === 'relative-time' && number('History window (seconds)','historyWindowSeconds',model.historyWindowSeconds,1)}
    {model.xAxisMode === 'clock-time' && input('History end time (HH:MM)','historyEndTime',model.historyEndTime)}
    <SimpleGrid columns={2} spacing={2}>{model.xAxisMode === 'samples' && input('X-axis label','xAxisLabel',model.xAxisLabel)}{input('Y-axis label','yAxisLabel',model.yAxisLabel)}</SimpleGrid>
    <SimpleGrid columns={2} spacing={2}>{number('Y minimum','yMin',model.minimum)}{number('Y maximum','yMax',model.maximum)}{number('Point count','pointCount',model.pointCount,2)}{number('Grid divisions','horizontalDivisions',model.horizontalDivisions,0)}</SimpleGrid>
    <FormControl><FormLabel {...labelProps}>Simulated values (comma separated)</FormLabel><Textarea size="sm" value={model.data.filter(v => v !== null).join(', ')} onChange={e => setValue('initialData', e.target.value.split(',').map(v => Number(v.trim())).filter(Number.isFinite))} /></FormControl>
    <SimpleGrid columns={3} spacing={2}>{input('Series colour','seriesColor',props.seriesColor as string || '')}{input('Warning colour','warningColor',model.warningColor)}{input('Alarm colour','alarmColor',model.alarmColor)}</SimpleGrid>
    <SimpleGrid columns={2} spacing={2}>{number('Warning threshold','warningThreshold',model.warningThreshold)}{number('Alarm threshold','alarmThreshold',model.alarmThreshold)}</SimpleGrid>
    <SimpleGrid columns={2} spacing={2}>{number('Update rate (ms)','updateRateMs',model.updateRateMs,100)}<FormControl><FormLabel {...labelProps}>Update layout</FormLabel><Select size="sm" value={String(props.updateMode || 'shift')} onChange={e => setValue('updateMode', e.target.value)}><option value="shift">Shift</option><option value="circular">Circular</option></Select></FormControl></SimpleGrid>
    {check('Show grid','showGrid',model.showGrid)}{check('Show axis labels','showAxisLabels',model.showAxisLabels)}{check('Show thresholds','showThresholds',model.showThresholds)}
    {check('Simulate live values','simulateValues',model.simulateValues)}
    {model.simulateValues && <SimpleGrid columns={2} spacing={2}>{number('Simulation minimum','simulatedMinimum',model.simulatedMinimum)}{number('Simulation maximum','simulatedMaximum',model.simulatedMaximum)}</SimpleGrid>}
    {check('Generate Runtime SDK','generateRuntimeApi',props.generateRuntimeApi !== false)}
  </Stack>
}
