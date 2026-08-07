import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUIPowerFlowCard } from '~forgeui/ForgeUIPowerFlowCard'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

export const PowerFlowCardPanel = () => {
  const { setValue } = useForm()
  const keys = ['title','gridVisible','gridValue','gridFlow','solarVisible','solarValue','solarFlow','batteryVisible','batteryValue','batteryFlow','loadVisible','loadValue','activeColour','inactiveColour','generateRuntimeApi']
  const model = normalizeForgeUIPowerFlowCard(Object.fromEntries(keys.map(key => [key, usePropsSelector(key)])))
  const input = (label:string,key:string,value:string) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><Input size="sm" value={value} onChange={event=>setValue(key,event.target.value)}/></FormControl>
  const toggle = (label:string,key:string,value:boolean) => <Checkbox isChecked={value} onChange={event=>setValue(key,event.target.checked)}>{label}</Checkbox>
  const flow = (label:string,key:string,value:string) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><Select size="sm" value={value} onChange={event=>setValue(key,event.target.value)}><option value="none">None / idle</option><option value="into-centre">Into centre / load</option><option value="out-from-centre">Out from centre / load</option></Select></FormControl>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}><Text fontSize="sm" fontWeight="bold">ForgeUI Native Power Flow Card</Text>
    <Text fontSize="xs" fontWeight="bold">General</Text>{input('Title','title',model.title)}
    <Text fontSize="xs" fontWeight="bold">Grid</Text>{toggle('Grid visible','gridVisible',model.gridVisible)}{input('Grid value','gridValue',model.gridValue)}{flow('Grid flow','gridFlow',model.gridFlow)}
    <Text fontSize="xs" fontWeight="bold">Solar</Text>{toggle('Solar visible','solarVisible',model.solarVisible)}{input('Solar value','solarValue',model.solarValue)}{flow('Solar flow','solarFlow',model.solarFlow)}
    <Text fontSize="xs" fontWeight="bold">Battery</Text>{toggle('Battery visible','batteryVisible',model.batteryVisible)}{input('Battery value','batteryValue',model.batteryValue)}{flow('Battery flow','batteryFlow',model.batteryFlow)}
    <Text fontSize="xs" fontWeight="bold">Load</Text>{toggle('Load visible','loadVisible',model.loadVisible)}{input('Load value','loadValue',model.loadValue)}
    <Text fontSize="xs" fontWeight="bold">Appearance</Text>{input('Active / accent colour','activeColour',model.activeColour)}{input('Inactive colour','inactiveColour',model.inactiveColour)}
    <Text fontSize="xs" fontWeight="bold">Runtime</Text>{toggle('Generate Runtime SDK','generateRuntimeApi',model.generateRuntimeApi)}
  </Stack>
}
