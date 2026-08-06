import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUITankLevelCard } from '~forgeui/ForgeUITankLevelCard'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

export const TankLevelCardPanel = () => {
  const { setValue } = useForm()
  const keys = ['title','units','compactMode','level','capacity','currentVolume','showPercentage','showVolume','tankShape','lowLevel','highLevel','criticalLevel','fillColour','tankOutline','lowColour','highColour','criticalColour','overflowColour','animateFill','showLabels','generateRuntimeApi']
  const model = normalizeForgeUITankLevelCard(Object.fromEntries(keys.map(key => [key, usePropsSelector(key)])))
  const number = (label: string, key: string, value: number) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><NumberInput size="sm" value={value} onChange={(_, next) => setValue(key, next)}><NumberInputField /></NumberInput></FormControl>
  const check = (label: string, key: string, value: boolean) => <Checkbox isChecked={value} onChange={event => setValue(key, event.target.checked)}>{label}</Checkbox>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}>
    <Text fontSize="sm" fontWeight="bold">ForgeUI Native Tank Level Card</Text><Text fontSize="xs" fontWeight="bold">General</Text>
    <FormControl><FormLabel fontSize="xs">Title</FormLabel><Input size="sm" value={model.title} onChange={event => setValue('title', event.target.value)} /></FormControl>
    <FormControl><FormLabel fontSize="xs">Units</FormLabel><Input size="sm" value={model.units} onChange={event => setValue('units', event.target.value)} /></FormControl>{check('Compact mode','compactMode',model.compactMode)}
    <Text fontSize="xs" fontWeight="bold">Tank</Text>{number('Level (%)','level',model.level)}{number('Capacity','capacity',model.capacity)}{number('Current volume','currentVolume',model.currentVolume)}{check('Show percentage','showPercentage',model.showPercentage)}{check('Show volume','showVolume',model.showVolume)}
    <FormControl><FormLabel fontSize="xs">Tank shape</FormLabel><Select size="sm" value={model.tankShape} onChange={event => setValue('tankShape', event.target.value)}><option value="cylindrical">Cylindrical</option><option value="rectangular">Rectangular</option><option value="silo">Silo</option></Select></FormControl>
    <Text fontSize="xs" fontWeight="bold">Thresholds</Text>{number('Low level','lowLevel',model.lowLevel)}{number('High level','highLevel',model.highLevel)}{number('Critical level','criticalLevel',model.criticalLevel)}
    <Text fontSize="xs" fontWeight="bold">Appearance</Text>
    {['fillColour','tankOutline','lowColour','highColour','criticalColour','overflowColour'].map(key => <FormControl key={key}><FormLabel fontSize="xs">{key.replace(/([A-Z])/g,' $1')}</FormLabel><Input size="sm" value={(model as any)[key]} onChange={event => setValue(key,event.target.value)} /></FormControl>)}
    {check('Animate fill','animateFill',model.animateFill)}{check('Show labels','showLabels',model.showLabels)}
    <Text fontSize="xs" fontWeight="bold">Integration</Text>{check('Generate Runtime SDK','generateRuntimeApi',model.generateRuntimeApi)}
  </Stack>
}
