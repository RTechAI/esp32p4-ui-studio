import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUIAlarmPanel } from '~forgeui/ForgeUIAlarmPanel'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

const labelProps = { fontSize: 'xs', color: INSPECTOR_PROPERTY_TEXT_COLOR }
const checkProps = { color: INSPECTOR_PROPERTY_TEXT_COLOR, sx: { '.chakra-checkbox__label': { color: 'inherit' } } }

export const AlarmPanelPanel = () => {
  const { setValue } = useForm()
  const keys = ['title','maximumVisibleAlarms','showTimestamp','showAcknowledgement','showPriority','showHeader','showFooter','footerText','compactMode','alarmCapacity','sortOrder','autoScroll','autoClear','flashActiveAlarms','animateTransitions','rowSpacing','normalColour','warningColour','alarmColour','acknowledgedColour','clearedColour','generateRuntimeApi','enableUserEvents'] as const
  const raw = Object.fromEntries(keys.map(key => [key, usePropsSelector(key)]))
  const model = normalizeForgeUIAlarmPanel({ ...raw, alarms: usePropsSelector('alarms') })
  const check = (key: string, label: string, value: boolean) => <Checkbox {...checkProps} isChecked={value} onChange={e => setValue(key, e.target.checked)}>{label}</Checkbox>
  const colour = (key: string, label: string, value: string) => <FormControl><FormLabel {...labelProps}>{label}</FormLabel><Input size="sm" value={value} onChange={e => setValue(key, e.target.value)} /></FormControl>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}><Text fontSize="sm" fontWeight="bold">ForgeUI Native Alarm Panel</Text>
    <Text fontSize="xs" fontWeight="bold">General</Text>
    <FormControl><FormLabel {...labelProps}>Title</FormLabel><Input size="sm" value={model.title} onChange={e => setValue('title', e.target.value)} /></FormControl>
    <FormControl><FormLabel {...labelProps}>Maximum visible alarms</FormLabel><NumberInput size="sm" min={1} max={12} value={model.maximumVisible} onChange={(_, value) => setValue('maximumVisibleAlarms', value)}><NumberInputField /></NumberInput></FormControl>
    <FormControl><FormLabel {...labelProps}>Alarm capacity</FormLabel><NumberInput size="sm" min={1} max={32} value={model.alarmCapacity} onChange={(_, value) => setValue('alarmCapacity', value)}><NumberInputField /></NumberInput></FormControl>
    {check('showTimestamp','Show timestamp',model.showTimestamp)}{check('showAcknowledgement','Show acknowledgement',model.showAcknowledgement)}{check('showPriority','Show priority',model.showPriority)}{check('compactMode','Compact mode',model.compactMode)}
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
