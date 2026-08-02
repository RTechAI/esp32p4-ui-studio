import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUISensorTile } from '~forgeui/ForgeUISensorTile'

export const SensorTilePanel = () => {
  const { setValue } = useForm()
  const props = {
    sensorType: usePropsSelector('sensorType'), title: usePropsSelector('title'), icon: usePropsSelector('icon'),
    value: usePropsSelector('value'), decimals: usePropsSelector('decimals'), units: usePropsSelector('units'),
    status: usePropsSelector('status'), statusText: usePropsSelector('statusText'), trend: usePropsSelector('trend'),
    timestamp: usePropsSelector('timestamp'), accentColor: usePropsSelector('accentColor'), showTrend: usePropsSelector('showTrend'),
    showProgress: usePropsSelector('showProgress'), showTimestamp: usePropsSelector('showTimestamp'), padding: usePropsSelector('padding'),
    rangeMin: usePropsSelector('rangeMin'), rangeMax: usePropsSelector('rangeMax'), warningLow: usePropsSelector('warningLow'),
    warningHigh: usePropsSelector('warningHigh'), criticalLow: usePropsSelector('criticalLow'), criticalHigh: usePropsSelector('criticalHigh'),
    autoColour: usePropsSelector('autoColour'), enableClick: usePropsSelector('enableClick'),
  }
  const model = normalizeForgeUISensorTile(props)
  const input = (label: string, name: string, value: string) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><Input size="sm" value={value} onChange={e => setValue(name, e.target.value)} /></FormControl>
  const number = (label: string, name: string, value: number) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><NumberInput size="sm" value={value} onChange={(_, n) => setValue(name, Number.isFinite(n) ? n : 0)}><NumberInputField /></NumberInput></FormControl>
  return <Stack spacing={3}><Text fontSize="sm" fontWeight="bold">ForgeUI Native Sensor Tile</Text>
    <FormControl><FormLabel fontSize="xs">Sensor type</FormLabel><Select size="sm" value={model.sensorType} onChange={e => setValue('sensorType', e.target.value)}>{['temperature','pressure','humidity','voltage','current','power','energy','rpm','frequency','generic'].map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase()+type.slice(1)}</option>)}</Select></FormControl>
    {input('Title','title',model.title)}{input('Icon','icon',model.icon)}
    <SimpleGrid columns={2} spacing={2}>{number('Current value','value',model.value)}{number('Decimals','decimals',model.decimals)}</SimpleGrid>
    {input('Units','units',model.units)}
    <FormControl><FormLabel fontSize="xs">Status</FormLabel><Select size="sm" value={model.status} onChange={e => setValue('status', e.target.value)}>{['normal','warning','critical','offline'].map(v => <option key={v}>{v}</option>)}</Select></FormControl>
    {input('Status text','statusText',model.statusText)}
    <FormControl><FormLabel fontSize="xs">Trend</FormLabel><Select size="sm" value={model.trend} onChange={e => setValue('trend', e.target.value)}>{['rising','falling','stable'].map(v => <option key={v}>{v}</option>)}</Select></FormControl>
    {input('Timestamp','timestamp',model.timestamp)}
    <FormControl><FormLabel fontSize="xs">Accent colour</FormLabel><Input size="sm" type="color" value={model.accentColor || '#14B8A6'} onChange={e => setValue('accentColor', e.target.value)} /></FormControl>
    {number('Padding','padding',model.padding)}
    <Text fontSize="xs" fontWeight="bold">Engineering ranges</Text>
    <SimpleGrid columns={2} spacing={2}>{number('Range minimum','rangeMin',model.rangeMin)}{number('Range maximum','rangeMax',model.rangeMax)}{number('Warning low','warningLow',model.warningLow)}{number('Warning high','warningHigh',model.warningHigh)}{number('Critical low','criticalLow',model.criticalLow)}{number('Critical high','criticalHigh',model.criticalHigh)}</SimpleGrid>
    <Checkbox isChecked={model.autoColour} onChange={e => setValue('autoColour', e.target.checked)}>Auto colour from ranges</Checkbox>
    <Checkbox isChecked={model.showTrend} onChange={e => setValue('showTrend', e.target.checked)}>Show trend</Checkbox>
    <Checkbox isChecked={model.showProgress} onChange={e => setValue('showProgress', e.target.checked)}>Show progress</Checkbox>
    <Checkbox isChecked={model.showTimestamp} onChange={e => setValue('showTimestamp', e.target.checked)}>Show timestamp</Checkbox>
    <Checkbox isChecked={model.enableClick} onChange={e => setValue('enableClick', e.target.checked)}>Generate click UserEvent</Checkbox>
  </Stack>
}
