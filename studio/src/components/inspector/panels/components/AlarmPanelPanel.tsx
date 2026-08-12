import React from 'react'
import { Button, Checkbox, FormControl, FormLabel, HStack, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import { useSelectedComponentProps } from '~hooks/useSelectedComponentProps'
import { normalizeForgeUIAlarmPanel } from '~forgeui/ForgeUIAlarmPanel'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

const labelProps = { fontSize: 'xs', color: INSPECTOR_PROPERTY_TEXT_COLOR }
const checkProps = { color: INSPECTOR_PROPERTY_TEXT_COLOR, sx: { '.chakra-checkbox__label': { color: 'inherit' } } }

export const AlarmPanelPanel = () => {
  const { setValue } = useForm()
  const keys = ['title','maximumVisibleAlarms','showTimestamp','showAcknowledgement','showPriority','showHeader','showFooter','footerText','compactMode','alarmCapacity','sortOrder','autoScroll','autoClear','flashActiveAlarms','animateTransitions','rowSpacing','normalColour','warningColour','alarmColour','acknowledgedColour','clearedColour','generateRuntimeApi','enableUserEvents'] as const
  const raw = useSelectedComponentProps([...keys, 'alarms'])
  const model = normalizeForgeUIAlarmPanel(raw)
  const updateAlarm = (index: number, patch: Record<string, unknown>) =>
    setValue('alarms', model.alarms.map((alarm, position) => position === index ? { ...alarm, ...patch } : alarm))
  const addAlarm = () => {
    if (model.alarms.length >= model.alarmCapacity) return
    const used = new Set(model.alarms.map(alarm => alarm.id))
    let suffix = model.alarms.length + 1
    while (used.has(`alarm-${suffix}`)) suffix++
    setValue('alarms', [...model.alarms, {
      id: `alarm-${suffix}`, message: `Alarm ${suffix}`, timestamp: '', state: 'alarm', priority: 'high',
    }])
  }
  const removeAlarm = (index: number) => setValue('alarms', model.alarms.filter((_, position) => position !== index))
  const moveAlarm = (index: number, offset: number) => {
    const target = index + offset
    if (target < 0 || target >= model.alarms.length) return
    const alarms = model.alarms.map(alarm => ({ ...alarm }))
    ;[alarms[index], alarms[target]] = [alarms[target], alarms[index]]
    setValue('alarms', alarms)
  }
  const check = (key: string, label: string, value: boolean) => <Checkbox {...checkProps} isChecked={value} onChange={e => setValue(key, e.target.checked)}>{label}</Checkbox>
  const colour = (key: string, label: string, value: string) => <FormControl><FormLabel {...labelProps}>{label}</FormLabel><Input size="sm" value={value} onChange={e => setValue(key, e.target.value)} /></FormControl>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}><Text fontSize="sm" fontWeight="bold">ForgeUI Native Alarm Panel</Text>
    <Text fontSize="xs" fontWeight="bold">General</Text>
    <FormControl><FormLabel {...labelProps}>Title</FormLabel><Input size="sm" value={model.title} onChange={e => setValue('title', e.target.value)} /></FormControl>
    <FormControl><FormLabel {...labelProps}>Maximum visible alarms</FormLabel><NumberInput size="sm" min={1} max={12} value={model.maximumVisible} onChange={(_, value) => setValue('maximumVisibleAlarms', value)}><NumberInputField /></NumberInput></FormControl>
    <FormControl><FormLabel {...labelProps}>Alarm capacity</FormLabel><NumberInput size="sm" min={1} max={32} value={model.alarmCapacity} onChange={(_, value) => setValue('alarmCapacity', value)}><NumberInputField /></NumberInput></FormControl>
    {check('showTimestamp','Show timestamp',model.showTimestamp)}{check('showAcknowledgement','Show acknowledgement',model.showAcknowledgement)}{check('showPriority','Show priority',model.showPriority)}{check('compactMode','Compact mode',model.compactMode)}
    <HStack><Text fontSize="xs" fontWeight="bold" flex="1">Alarms</Text><Button size="xs" onClick={addAlarm} isDisabled={model.alarms.length >= model.alarmCapacity}>Add alarm</Button></HStack>
    {model.alarms.map((alarm, index) => <Stack key={`${alarm.id}-${index}`} spacing={1} padding="8px" border="1px solid" borderColor="gray.600" borderRadius="md">
      <HStack><Text fontSize="xs" flex="1">{index + 1}. {alarm.id}</Text><Button size="xs" aria-label={`Move alarm ${index + 1} up`} onClick={() => moveAlarm(index, -1)} isDisabled={index === 0}>↑</Button><Button size="xs" aria-label={`Move alarm ${index + 1} down`} onClick={() => moveAlarm(index, 1)} isDisabled={index === model.alarms.length - 1}>↓</Button><Button size="xs" colorScheme="red" variant="outline" aria-label={`Remove alarm ${index + 1}`} onClick={() => removeAlarm(index)}>Remove</Button></HStack>
      <Input size="sm" aria-label={`Alarm ${index + 1} ID`} value={alarm.id} onChange={event => updateAlarm(index, { id: event.target.value })} />
      <Input size="sm" aria-label={`Alarm ${index + 1} message`} value={alarm.message} onChange={event => updateAlarm(index, { message: event.target.value })} />
      <Input size="sm" aria-label={`Alarm ${index + 1} timestamp`} value={alarm.timestamp} onChange={event => updateAlarm(index, { timestamp: event.target.value })} />
      <HStack><Select size="sm" aria-label={`Alarm ${index + 1} state`} value={alarm.state} onChange={event => updateAlarm(index, { state: event.target.value })}><option value="normal">Normal</option><option value="warning">Warning</option><option value="alarm">Alarm</option><option value="acknowledged">Acknowledged</option><option value="cleared">Cleared</option></Select><Select size="sm" aria-label={`Alarm ${index + 1} priority`} value={alarm.priority} onChange={event => updateAlarm(index, { priority: event.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></Select></HStack>
    </Stack>)}
    <Text fontSize="xs" fontWeight="bold">Appearance</Text>
    {check('showHeader','Show header',model.showHeader)}{check('showFooter','Show footer',model.showFooter)}
    <FormControl><FormLabel {...labelProps}>Footer text</FormLabel><Input size="sm" value={model.footerText} onChange={e => setValue('footerText', e.target.value)} /></FormControl>
    <FormControl><FormLabel {...labelProps}>Row spacing</FormLabel><NumberInput size="sm" min={0} max={16} value={model.rowSpacing} onChange={(_, value) => setValue('rowSpacing', value)}><NumberInputField /></NumberInput></FormControl>
    {colour('normalColour','Normal colour',model.normalColour)}{colour('warningColour','Warning colour',model.warningColour)}{colour('alarmColour','Alarm colour',model.alarmColour)}{colour('acknowledgedColour','Acknowledged colour',model.acknowledgedColour)}{colour('clearedColour','Cleared colour',model.clearedColour)}
    <Text fontSize="xs" fontWeight="bold">Behaviour</Text>
    <FormControl><FormLabel {...labelProps}>Sort order</FormLabel><Select size="sm" value={model.sortOrder} onChange={e => setValue('sortOrder', e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="priority">Priority</option></Select></FormControl>
    {check('autoScroll','Auto scroll',model.autoScroll)}{check('autoClear','Auto clear',model.autoClear)}{check('flashActiveAlarms','Flash active alarms',model.flashActiveAlarms)}{check('animateTransitions','Animate transitions',model.animateTransitions)}
    <Text fontSize="xs" fontWeight="bold">Integration</Text>{check('generateRuntimeApi','Generate Runtime SDK',model.generateRuntimeApi)}{check('enableUserEvents','Generate UserEvents',model.enableUserEvents)}
  </Stack>
}
