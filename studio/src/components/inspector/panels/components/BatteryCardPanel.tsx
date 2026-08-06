import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUIBatteryCard } from '~forgeui/ForgeUIBatteryCard'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

export const BatteryCardPanel = () => {
  const { setValue } = useForm()
  const keys = ['title','units','percentage','voltage','current','charging','health','remainingMinutes','temperature','lowThreshold','criticalThreshold','compactMode','showPercentage','showVoltage','showCurrent','showRuntime','showTemperature','showChargingIcon','showHealth','animateCharging','normalColour','lowColour','criticalColour','chargingColour','generateRuntimeApi']
  const model = normalizeForgeUIBatteryCard(Object.fromEntries(keys.map(key => [key, usePropsSelector(key)])))
  const number = (label: string, key: string, value: number) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><NumberInput size="sm" value={value} onChange={(_, n) => setValue(key, n)}><NumberInputField /></NumberInput></FormControl>
  const check = (label: string, key: string, value: boolean) => <Checkbox isChecked={value} onChange={e => setValue(key, e.target.checked)}>{label}</Checkbox>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}>
    <Text fontSize="sm" fontWeight="bold">ForgeUI Native Battery Card</Text><Text fontSize="xs" fontWeight="bold">General</Text>
    <FormControl><FormLabel fontSize="xs">Title</FormLabel><Input size="sm" value={model.title} onChange={e => setValue('title', e.target.value)} /></FormControl>
    <FormControl><FormLabel fontSize="xs">Units</FormLabel><Input size="sm" value={model.units} onChange={e => setValue('units', e.target.value)} /></FormControl>{check('Compact mode','compactMode',model.compactMode)}
    <Text fontSize="xs" fontWeight="bold">Battery</Text>{number('Percentage','percentage',model.percentage)}{number('Voltage','voltage',model.voltage)}{number('Current','current',model.current)}{check('Charging','charging',model.charging)}
    <FormControl><FormLabel fontSize="xs">Health</FormLabel><Select size="sm" value={model.health} onChange={e => setValue('health', e.target.value)}><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option><option value="replace">Replace</option></Select></FormControl>
    {number('Remaining time (minutes)','remainingMinutes',model.remainingMinutes)}{number('Temperature (°C)','temperature',model.temperature)}
    <Text fontSize="xs" fontWeight="bold">Thresholds</Text>{number('Low battery','lowThreshold',model.lowThreshold)}{number('Critical battery','criticalThreshold',model.criticalThreshold)}
    <Text fontSize="xs" fontWeight="bold">Appearance</Text>{['showPercentage','showVoltage','showCurrent','showRuntime','showTemperature','showChargingIcon','showHealth','animateCharging'].map(key => <React.Fragment key={key}>{check(key.replace(/([A-Z])/g,' $1').replace(/^./, c => c.toUpperCase()),key,(model as any)[key])}</React.Fragment>)}
    {['normalColour','lowColour','criticalColour','chargingColour'].map(key => <FormControl key={key}><FormLabel fontSize="xs">{key.replace(/([A-Z])/g,' $1')}</FormLabel><Input size="sm" value={(model as any)[key]} onChange={e => setValue(key,e.target.value)} /></FormControl>)}
    <Text fontSize="xs" fontWeight="bold">Integration</Text>{check('Generate Runtime SDK','generateRuntimeApi',model.generateRuntimeApi)}
  </Stack>
}
