import React from 'react'
import { Button, Checkbox, FormControl, FormLabel, HStack, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUIRelayPanel } from '~forgeui/ForgeUIRelayPanel'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

const relayPanelFormLabelProps = {
  fontSize: 'xs',
  color: INSPECTOR_PROPERTY_TEXT_COLOR,
  opacity: 1,
}
const relayPanelCheckboxProps = {
  color: INSPECTOR_PROPERTY_TEXT_COLOR,
  opacity: 1,
  sx: { '.chakra-checkbox__label': { opacity: 1 } },
}

export const RelayPanelPanel = () => {
  const { setValue } = useForm()
  const raw = {
    title: usePropsSelector('title'), subtitle: usePropsSelector('subtitle'), icon: usePropsSelector('icon'),
    channelCount: usePropsSelector('channelCount'), channels: usePropsSelector('channels'),
    showMasterControl: usePropsSelector('showMasterControl'), masterState: usePropsSelector('masterState'),
    confirmationMode: usePropsSelector('confirmationMode'), showChannelNumbers: usePropsSelector('showChannelNumbers'),
    layoutMode: usePropsSelector('layoutMode'), activeColour: usePropsSelector('activeColour'),
    inactiveColour: usePropsSelector('inactiveColour'), disabledColour: usePropsSelector('disabledColour'),
    showFooter: usePropsSelector('showFooter'), footerText: usePropsSelector('footerText'),
    padding: usePropsSelector('padding'), gap: usePropsSelector('gap'), generateRuntimeApi: usePropsSelector('generateRuntimeApi'),
    enableUserEvents: usePropsSelector('enableUserEvents'),
  }
  const model = normalizeForgeUIRelayPanel(raw)
  const updateChannel = (index: number, patch: Record<string, unknown>) =>
    setValue('channels', model.channels.map((channel, position) => position === index ? { ...channel, ...patch } : channel))
  const move = (index: number, offset: number) => {
    const target = index + offset
    if (target < 0 || target >= model.channels.length) return
    const channels = model.channels.map(channel => ({ ...channel }))
    ;[channels[index], channels[target]] = [channels[target], channels[index]]
    setValue('channels', channels)
  }
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}>
    <Text fontSize="sm" fontWeight="bold">ForgeUI Native Relay Panel</Text>
    <FormControl><FormLabel {...relayPanelFormLabelProps}>Title</FormLabel><Input size="sm" value={model.title} onChange={event => setValue('title', event.target.value)} /></FormControl>
    <FormControl><FormLabel {...relayPanelFormLabelProps}>Subtitle</FormLabel><Input size="sm" value={model.subtitle} onChange={event => setValue('subtitle', event.target.value)} /></FormControl>
    <FormControl><FormLabel {...relayPanelFormLabelProps}>Icon</FormLabel><Input size="sm" value={model.icon} onChange={event => setValue('icon', event.target.value)} /></FormControl>
    <FormControl><FormLabel {...relayPanelFormLabelProps}>Channel count</FormLabel><NumberInput size="sm" min={1} max={8} value={model.channelCount} onChange={(_, value) => setValue('channelCount', Number.isFinite(value) ? value : 1)}><NumberInputField /></NumberInput></FormControl>
    <Text fontSize="xs" fontWeight="bold" color={INSPECTOR_PROPERTY_TEXT_COLOR} opacity={1}>Channels</Text>
    {model.channels.map((channel, index) => <Stack key={channel.id} spacing={1} padding="8px" border="1px solid" borderColor="gray.600" borderRadius="md">
      <HStack><Text fontSize="xs" flex="1">{index + 1}. {channel.id}</Text><Button size="xs" onClick={() => move(index, -1)} isDisabled={index === 0}>↑</Button><Button size="xs" onClick={() => move(index, 1)} isDisabled={index === model.channels.length - 1}>↓</Button></HStack>
      <Input size="sm" value={channel.label} onChange={event => updateChannel(index, { label: event.target.value })} aria-label={`Channel ${index + 1} label`} />
      <Input size="sm" value={channel.statusText} placeholder="Optional status" onChange={event => updateChannel(index, { statusText: event.target.value })} />
      <HStack><Checkbox {...relayPanelCheckboxProps} isChecked={channel.state} onChange={event => updateChannel(index, { state: event.target.checked })}>Default ON</Checkbox><Checkbox {...relayPanelCheckboxProps} isChecked={channel.enabled} onChange={event => updateChannel(index, { enabled: event.target.checked })}>Enabled</Checkbox></HStack>
    </Stack>)}
    <Checkbox {...relayPanelCheckboxProps} isChecked={model.showMasterControl} onChange={event => setValue('showMasterControl', event.target.checked)}>Show master control</Checkbox>
    <Checkbox {...relayPanelCheckboxProps} isChecked={model.masterState} onChange={event => setValue('masterState', event.target.checked)}>Default master ON</Checkbox>
    <Checkbox {...relayPanelCheckboxProps} isChecked={model.showChannelNumbers} onChange={event => setValue('showChannelNumbers', event.target.checked)}>Show channel numbers</Checkbox>
    <FormControl><FormLabel {...relayPanelFormLabelProps}>Confirmation</FormLabel><Select size="sm" value="disabled" isDisabled><option value="disabled">Disabled in V1</option></Select><Text fontSize="xs" color={INSPECTOR_PROPERTY_TEXT_COLOR} opacity={1}>Deferred until one confirmation path can serve Browser and LVGL export.</Text></FormControl>
    <FormControl><FormLabel {...relayPanelFormLabelProps}>Layout</FormLabel><Select size="sm" value={model.layoutMode} onChange={event => setValue('layoutMode', event.target.value)}><option value="standard">Standard</option><option value="compact">Compact</option></Select></FormControl>
    {(['activeColour','inactiveColour','disabledColour'] as const).map(key => <FormControl key={key}><FormLabel {...relayPanelFormLabelProps}>{key.replace('Colour',' colour')}</FormLabel><Input size="sm" type="color" value={model[key]} onChange={event => setValue(key, event.target.value)} /></FormControl>)}
    <HStack><FormControl><FormLabel {...relayPanelFormLabelProps}>Padding</FormLabel><NumberInput size="sm" value={model.padding} onChange={(_, value) => setValue('padding', Number.isFinite(value) ? value : 0)}><NumberInputField /></NumberInput></FormControl><FormControl><FormLabel {...relayPanelFormLabelProps}>Gap</FormLabel><NumberInput size="sm" value={model.gap} onChange={(_, value) => setValue('gap', Number.isFinite(value) ? value : 0)}><NumberInputField /></NumberInput></FormControl></HStack>
    <Checkbox {...relayPanelCheckboxProps} isChecked={model.showFooter} onChange={event => setValue('showFooter', event.target.checked)}>Show footer</Checkbox>
    <Input size="sm" value={model.footerText} onChange={event => setValue('footerText', event.target.value)} placeholder="Footer text" />
    <Checkbox {...relayPanelCheckboxProps} isChecked={model.generateRuntimeApi} onChange={event => setValue('generateRuntimeApi', event.target.checked)}>Generate Runtime SDK</Checkbox>
    <Checkbox {...relayPanelCheckboxProps} isChecked={model.enableUserEvents} onChange={event => setValue('enableUserEvents', event.target.checked)}>Generate UserEvents</Checkbox>
  </Stack>
}
