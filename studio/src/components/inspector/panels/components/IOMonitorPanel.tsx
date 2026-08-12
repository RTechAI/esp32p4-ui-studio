import React from 'react'
import { Button, Checkbox, FormControl, FormLabel, HStack, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import { useSelectedComponentProps } from '~hooks/useSelectedComponentProps'
import { normalizeForgeUIIOMonitor } from '~forgeui/ForgeUIIOMonitor'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

const labelProps = { fontSize: 'xs', color: INSPECTOR_PROPERTY_TEXT_COLOR }
const checkProps = { color: INSPECTOR_PROPERTY_TEXT_COLOR, sx: { '.chakra-checkbox__label': { color: 'inherit' } } }

export const IOMonitorPanel = () => {
  const { setValue } = useForm()
  const raw = useSelectedComponentProps(['title','maximumRows','compactMode','generateRuntimeApi','enableUserEvents','rows'])
  const model = normalizeForgeUIIOMonitor(raw)
  const updateRow = (index: number, patch: Record<string, unknown>) => setValue('rows', model.rows.map((row, position) => position === index ? { ...row, ...patch } : row))
  const addRow = () => {
    if (model.rows.length >= model.maximumRows) return
    const suffix = model.rows.length + 1
    setValue('rows', [...model.rows, { id: `io-${suffix}`, ioType: 'digital-input', channel: `DI${suffix}`, displayName: `Input ${suffix}`, value: 0, state: false, units: '', colour: '#38BDF8', showValue: false, showState: true, visible: true }])
  }
  const moveRow = (index: number, offset: number) => {
    const target = index + offset
    if (target < 0 || target >= model.rows.length) return
    const rows = model.rows.map(row => ({ ...row }))
    ;[rows[index], rows[target]] = [rows[target], rows[index]]
    setValue('rows', rows)
  }
  const check = (label: string, checked: boolean, change: (value: boolean) => void) => <Checkbox {...checkProps} isChecked={checked} onChange={event => change(event.target.checked)}>{label}</Checkbox>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}>
    <Text fontSize="sm" fontWeight="bold">ForgeUI Native IO Monitor</Text>
    <Text fontSize="xs" fontWeight="bold">General</Text>
    <FormControl><FormLabel {...labelProps}>Title</FormLabel><Input size="sm" value={model.title} onChange={event => setValue('title', event.target.value)} /></FormControl>
    <FormControl><FormLabel {...labelProps}>Maximum rows</FormLabel><NumberInput size="sm" min={1} max={32} value={model.maximumRows} onChange={(_, value) => setValue('maximumRows', value)}><NumberInputField /></NumberInput></FormControl>
    {check('Compact mode', model.compactMode, value => setValue('compactMode', value))}
    <HStack><Text fontSize="xs" fontWeight="bold" flex="1">Rows</Text><Button size="xs" onClick={addRow} isDisabled={model.rows.length >= model.maximumRows}>Add row</Button></HStack>
    {model.rows.map((row, index) => <Stack key={`${row.id}-${index}`} spacing={1} p="8px" border="1px solid" borderColor="gray.600" borderRadius="md">
      <HStack><Text fontSize="xs" flex="1">{index + 1}. {row.channel}</Text><Button size="xs" aria-label={`Move row ${index + 1} up`} onClick={() => moveRow(index, -1)} isDisabled={index === 0}>↑</Button><Button size="xs" aria-label={`Move row ${index + 1} down`} onClick={() => moveRow(index, 1)} isDisabled={index === model.rows.length - 1}>↓</Button><Button size="xs" colorScheme="red" variant="outline" aria-label={`Remove row ${index + 1}`} onClick={() => setValue('rows', model.rows.filter((_, position) => position !== index))}>Remove</Button></HStack>
      <HStack><Select size="sm" aria-label={`Row ${index + 1} IO type`} value={row.ioType} onChange={event => updateRow(index, { ioType: event.target.value })}><option value="digital-input">Digital Input</option><option value="digital-output">Digital Output</option><option value="analog-input">Analog Input</option><option value="analog-output">Analog Output</option></Select><Input size="sm" aria-label={`Row ${index + 1} channel`} value={row.channel} onChange={event => updateRow(index, { channel: event.target.value })} /></HStack>
      <Input size="sm" aria-label={`Row ${index + 1} display name`} value={row.displayName} onChange={event => updateRow(index, { displayName: event.target.value })} />
      <HStack><Input size="sm" aria-label={`Row ${index + 1} units`} value={row.units} onChange={event => updateRow(index, { units: event.target.value })} /><Input size="sm" aria-label={`Row ${index + 1} colour`} value={row.colour} onChange={event => updateRow(index, { colour: event.target.value })} /></HStack>
      <HStack>{check('Show value', row.showValue, value => updateRow(index, { showValue: value }))}{check('Show state', row.showState, value => updateRow(index, { showState: value }))}{check('Visible', row.visible, value => updateRow(index, { visible: value }))}</HStack>
    </Stack>)}
    <Text fontSize="xs" fontWeight="bold">Integration</Text>
    {check('Generate Runtime SDK', model.generateRuntimeApi, value => setValue('generateRuntimeApi', value))}
    {check('Generate UserEvents', model.enableUserEvents, value => setValue('enableUserEvents', value))}
  </Stack>
}
