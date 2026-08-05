import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUITrendChartPro } from '~forgeui/ForgeUITrendChartPro'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

const labelProps = { fontSize: 'xs', color: INSPECTOR_PROPERTY_TEXT_COLOR, opacity: 1 }
const checkboxProps = { color: INSPECTOR_PROPERTY_TEXT_COLOR, sx: { '.chakra-checkbox__label': { color: 'inherit', opacity: 1 } } }

export const TrendChartProPanel = () => {
  const { setValue } = useForm()
  const names = ['title','value','units','customUnits','decimalPlaces','historyLength','updateRateMs','autoScale','fixedMin','fixedMax','warning','alarm','traceColour','warningColour','alarmColour','showGrid','showAreaFill','showGlow','showCurrentMarker','showThresholdBands','compactMode','generateRuntimeApi','enableUserEvents']
  const raw = Object.fromEntries(names.map(name => [name, usePropsSelector(name)]))
  const model = normalizeForgeUITrendChartPro(raw)
  const input = (label: string, name: string, value: string, type = 'text') => <FormControl><FormLabel {...labelProps}>{label}</FormLabel><Input size="sm" type={type} value={value} onChange={e => setValue(name, e.target.value)} /></FormControl>
  const number = (label: string, name: string, value: number, min?: number) => <FormControl><FormLabel {...labelProps}>{label}</FormLabel><NumberInput size="sm" min={min} value={value} onChange={(_, n) => Number.isFinite(n) && setValue(name, n)}><NumberInputField /></NumberInput></FormControl>
  const check = (label: string, name: string, value: boolean) => <Checkbox {...checkboxProps} isChecked={value} onChange={e => setValue(name, e.target.checked)}>{label}</Checkbox>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}>
    <Text fontSize="sm" fontWeight="bold">ForgeUI Native Trend Chart Pro</Text>
    <Text fontSize="xs" fontWeight="bold">General</Text>{input('Title','title',model.title)}
    <SimpleGrid columns={2} spacing={2}>{number('Live value','value',model.value)}{number('Decimal places','decimalPlaces',model.decimalPlaces,0)}</SimpleGrid>
    <FormControl><FormLabel {...labelProps}>Units</FormLabel><Select size="sm" value={model.unitChoice} onChange={e => setValue('units', e.target.value)}>{['RPM','°C','%','kPa','PSI','L/min','V','A','W','Hz','Custom'].map(unit => <option key={unit}>{unit}</option>)}</Select></FormControl>
    {model.unitChoice === 'Custom' && input('Custom units','customUnits',model.customUnits)}
    <Text fontSize="xs" fontWeight="bold">Appearance</Text>
    {check('Show grid','showGrid',model.showGrid)}{check('Show area fill','showAreaFill',model.showAreaFill)}{check('Show glow','showGlow',model.showGlow)}{check('Show current marker','showCurrentMarker',model.showCurrentMarker)}{check('Show threshold bands','showThresholdBands',model.showThresholdBands)}{check('Compact mode','compactMode',model.compactMode)}
    <SimpleGrid columns={3} spacing={2}>{input('Trace colour','traceColour',model.traceColour || '#14B8A6','color')}{input('Warning colour','warningColour',model.warningColour,'color')}{input('Alarm colour','alarmColour',model.alarmColour,'color')}</SimpleGrid>
    <Text fontSize="xs" fontWeight="bold">Trend</Text><SimpleGrid columns={2} spacing={2}>{number('History length','historyLength',model.historyLength,5)}{number('Update rate (ms)','updateRateMs',model.updateRateMs,100)}</SimpleGrid>
    {check('Auto scale','autoScale',model.autoScale)}{!model.autoScale && <SimpleGrid columns={2} spacing={2}>{number('Fixed minimum','fixedMin',model.fixedMin)}{number('Fixed maximum','fixedMax',model.fixedMax)}</SimpleGrid>}
    <Text fontSize="xs" fontWeight="bold">Thresholds</Text><SimpleGrid columns={2} spacing={2}>{number('Warning','warning',model.warning)}{number('Alarm','alarm',model.alarm)}</SimpleGrid>
    {check('Generate Runtime SDK','generateRuntimeApi',model.generateRuntimeApi)}{check('Generate threshold UserEvents','enableUserEvents',model.enableUserEvents)}
  </Stack>
}
