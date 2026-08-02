import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUIAlarmPanel } from '~forgeui/ForgeUIAlarmPanel'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

export const AlarmPanelPanel = () => {
  const { setValue } = useForm()
  const raw = {
    title: usePropsSelector('title'), displayMode: usePropsSelector('displayMode'),
    maximumAlarms: usePropsSelector('maximumAlarms'), ordering: usePropsSelector('ordering'),
    autoScroll: usePropsSelector('autoScroll'), showTimestamps: usePropsSelector('showTimestamps'),
    showSeverityIcons: usePropsSelector('showSeverityIcons'), showDescriptions: usePropsSelector('showDescriptions'),
    showAcknowledgement: usePropsSelector('showAcknowledgement'), rounded: usePropsSelector('rounded'),
    shadow: usePropsSelector('shadow'), glassStyle: usePropsSelector('glassStyle'),
    includeInformation: usePropsSelector('includeInformation'), includeNotice: usePropsSelector('includeNotice'),
    includeWarning: usePropsSelector('includeWarning'), includeAlarm: usePropsSelector('includeAlarm'),
    includeCritical: usePropsSelector('includeCritical'), simulationMode: usePropsSelector('simulationMode'),
    generateRuntimeApi: usePropsSelector('generateRuntimeApi'), enableUserEvents: usePropsSelector('enableUserEvents'),
  }
  const model: any = normalizeForgeUIAlarmPanel(raw)
  const check = (key: string, label: string) => <Checkbox color={INSPECTOR_PROPERTY_TEXT_COLOR} isChecked={model[key]} onChange={e => setValue(key, e.target.checked)}>{label}</Checkbox>
  const select = (key: string, label: string, values: Array<string | number>) => <FormControl><FormLabel fontSize="xs" color={INSPECTOR_PROPERTY_TEXT_COLOR}>{label}</FormLabel><Select size="sm" value={model[key]} onChange={e => setValue(key, typeof values[0] === 'number' ? Number(e.target.value) : e.target.value)}>{values.map(value => <option key={value} value={value}>{value}</option>)}</Select></FormControl>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}>
    <Text fontSize="sm" fontWeight="bold">ForgeUI Native Alarm Panel</Text>
    <Text fontSize="xs" fontWeight="bold">General</Text>
    <FormControl><FormLabel fontSize="xs">Title</FormLabel><Input size="sm" value={model.title} onChange={e => setValue('title', e.target.value)} /></FormControl>
    {select('displayMode', 'Display mode', ['compact','list','banner'])}
    <Text fontSize="xs" fontWeight="bold">Behaviour</Text>
    {select('maximumAlarms', 'Maximum alarms', [16,32,64])}{select('ordering', 'Ordering', ['newest-first','oldest-first','severity-first','timestamp-first'])}
    {check('autoScroll','Auto-scroll')}
    <Text fontSize="xs" fontWeight="bold">Appearance</Text>
    {check('showTimestamps','Show timestamps')}{check('showSeverityIcons','Show severity indicators')}{check('showDescriptions','Show descriptions')}{check('showAcknowledgement','Show acknowledgement')}{check('rounded','Rounded corners')}{check('shadow','Shadow')}{check('glassStyle','Glass style')}
    <Text fontSize="xs" fontWeight="bold">Filtering</Text>
    {check('includeInformation','Information')}{check('includeNotice','Notice')}{check('includeWarning','Warning')}{check('includeAlarm','Alarm')}{check('includeCritical','Critical')}
    {select('simulationMode', 'Browser scenario', ['normal','warning','critical','multiple','alarm-storm','cleared'])}
    {check('generateRuntimeApi','Generate Runtime SDK')}{check('enableUserEvents','Generate UserEvents')}
  </Stack>
}
