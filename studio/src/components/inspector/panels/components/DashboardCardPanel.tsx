import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUIDashboardCard } from '~forgeui/ForgeUIDashboardCard'

export const DashboardCardPanel = () => {
  const { setValue } = useForm()
  const model = normalizeForgeUIDashboardCard({
    title: usePropsSelector('title'), icon: usePropsSelector('icon'), value: usePropsSelector('value'),
    units: usePropsSelector('units'), secondaryText: usePropsSelector('secondaryText'), status: usePropsSelector('status'),
    statusText: usePropsSelector('statusText'), progress: usePropsSelector('progress'), timestamp: usePropsSelector('timestamp'),
    accentColor: usePropsSelector('accentColor'), padding: usePropsSelector('padding'), showHeader: usePropsSelector('showHeader'),
    showFooter: usePropsSelector('showFooter'), showProgress: usePropsSelector('showProgress'), showStatus: usePropsSelector('showStatus'),
    enableClick: usePropsSelector('enableClick'),
  })
  const textField = (label: string, name: string, value: string, placeholder?: string) =>
    <FormControl><FormLabel fontSize="xs">{label}</FormLabel><Input size="sm" value={value} placeholder={placeholder} onChange={e => setValue(name, e.target.value)} /></FormControl>
  return <Stack spacing={3}>
    <Text fontSize="sm" fontWeight="bold">ForgeUI Native Dashboard Card</Text>
    {textField('Title', 'title', model.title)}
    {textField('Icon', 'icon', model.icon, 'LV_SYMBOL_CHARGE')}
    {textField('Value', 'value', model.value)}
    {textField('Units', 'units', model.units)}
    {textField('Secondary text', 'secondaryText', model.secondaryText)}
    <FormControl><FormLabel fontSize="xs">Status</FormLabel><Select size="sm" value={model.status} onChange={e => setValue('status', e.target.value)}>
      <option value="normal">Normal</option><option value="warning">Warning</option><option value="critical">Critical</option><option value="offline">Offline</option>
    </Select></FormControl>
    {textField('Status text', 'statusText', model.statusText)}
    <FormControl><FormLabel fontSize="xs">Progress</FormLabel><NumberInput size="sm" min={0} max={100} value={model.progress} onChange={(_, value) => setValue('progress', Number.isFinite(value) ? value : 0)}><NumberInputField /></NumberInput></FormControl>
    {textField('Timestamp', 'timestamp', model.timestamp)}
    <FormControl><FormLabel fontSize="xs">Accent colour (empty uses theme)</FormLabel><Input size="sm" type="color" value={model.accentColor || '#14B8A6'} onChange={e => setValue('accentColor', e.target.value)} /></FormControl>
    <FormControl><FormLabel fontSize="xs">Padding</FormLabel><NumberInput size="sm" min={0} max={48} value={model.padding} onChange={(_, value) => setValue('padding', Number.isFinite(value) ? value : 0)}><NumberInputField /></NumberInput></FormControl>
    <Checkbox isChecked={model.showHeader} onChange={e => setValue('showHeader', e.target.checked)}>Show header</Checkbox>
    <Checkbox isChecked={model.showFooter} onChange={e => setValue('showFooter', e.target.checked)}>Show footer</Checkbox>
    <Checkbox isChecked={model.showProgress} onChange={e => setValue('showProgress', e.target.checked)}>Show progress</Checkbox>
    <Checkbox isChecked={model.showStatus} onChange={e => setValue('showStatus', e.target.checked)}>Show status</Checkbox>
    <Checkbox isChecked={model.enableClick} onChange={e => setValue('enableClick', e.target.checked)}>Generate click UserEvent</Checkbox>
  </Stack>
}
