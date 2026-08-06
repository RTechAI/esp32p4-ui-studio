import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUIKpiCard } from '~forgeui/ForgeUIKpiCard'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

export const KpiCardPanel = () => {
  const { setValue } = useForm()
  const keys = ['title','value','unit','secondaryText','trendText','trendState','status','targetText','showSecondary','showTrend','showTarget','neutralColour','goodColour','warningColour','criticalColour','generateRuntimeApi']
  const model = normalizeForgeUIKpiCard(Object.fromEntries(keys.map(key => [key, usePropsSelector(key)])))
  const input = (label: string, key: string, value: string) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><Input size="sm" value={value} onChange={event => setValue(key, event.target.value)}/></FormControl>
  const toggle = (label: string, key: string, value: boolean) => <Checkbox isChecked={value} onChange={event => setValue(key, event.target.checked)}>{label}</Checkbox>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}><Text fontSize="sm" fontWeight="bold">ForgeUI Native KPI Card</Text>
    <Text fontSize="xs" fontWeight="bold">KPI</Text>{input('Title','title',model.title)}{input('Primary value','value',model.value)}{input('Unit / suffix','unit',model.unit)}{input('Secondary text','secondaryText',model.secondaryText)}{input('Target / reference','targetText',model.targetText)}
    <Text fontSize="xs" fontWeight="bold">Trend and status</Text>{input('Trend / delta text','trendText',model.trendText)}<FormControl><FormLabel fontSize="xs">Trend state</FormLabel><Select size="sm" value={model.trendState} onChange={event=>setValue('trendState',event.target.value)}><option value="flat">Flat / neutral</option><option value="up">Up</option><option value="down">Down</option></Select></FormControl><FormControl><FormLabel fontSize="xs">Semantic status</FormLabel><Select size="sm" value={model.status} onChange={event=>setValue('status',event.target.value)}><option value="neutral">Neutral</option><option value="good">Good</option><option value="warning">Warning</option><option value="critical">Critical</option></Select></FormControl>
    <Text fontSize="xs" fontWeight="bold">Visibility</Text>{toggle('Show secondary text','showSecondary',model.showSecondary)}{toggle('Show trend','showTrend',model.showTrend)}{toggle('Show target','showTarget',model.showTarget)}
    <Text fontSize="xs" fontWeight="bold">Semantic colours</Text>{input('Neutral colour','neutralColour',model.neutralColour)}{input('Good colour','goodColour',model.goodColour)}{input('Warning colour','warningColour',model.warningColour)}{input('Critical colour','criticalColour',model.criticalColour)}
    <Text fontSize="xs" fontWeight="bold">Integration</Text>{toggle('Generate Runtime SDK','generateRuntimeApi',model.generateRuntimeApi)}
  </Stack>
}
