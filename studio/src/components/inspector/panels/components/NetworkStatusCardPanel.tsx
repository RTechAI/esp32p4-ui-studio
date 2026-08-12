import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import { useSelectedComponentProps } from '~hooks/useSelectedComponentProps'
import { normalizeForgeUINetworkStatusCard } from '~forgeui/ForgeUINetworkStatusCard'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

export const NetworkStatusCardPanel = () => {
  const { setValue } = useForm(); const keys = ['title','networkType','connected','networkName','ipAddress','signalStrength','hostname','statusText','accentColour','disconnectedColour','compactMode','generateRuntimeApi']
  const model = normalizeForgeUINetworkStatusCard(useSelectedComponentProps(keys))
  const input = (label:string,key:string,value:string) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><Input size="sm" value={value} onChange={e=>setValue(key,e.target.value)}/></FormControl>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}><Text fontSize="sm" fontWeight="bold">ForgeUI Native Network Status Card</Text><Text fontSize="xs" fontWeight="bold">General</Text>
    {input('Title','title',model.title)}<Checkbox isChecked={model.compactMode} onChange={e=>setValue('compactMode',e.target.checked)}>Compact mode</Checkbox><Text fontSize="xs" fontWeight="bold">Network</Text>
    <FormControl><FormLabel fontSize="xs">Network/interface type</FormLabel><Select size="sm" value={model.networkType} onChange={e=>setValue('networkType',e.target.value)}><option value="wifi">Wi-Fi</option><option value="ethernet">Ethernet</option><option value="cellular">Cellular</option><option value="other">Other</option></Select></FormControl>
    <Checkbox isChecked={model.connected} onChange={e=>setValue('connected',e.target.checked)}>Connected</Checkbox>{input('SSID / network name','networkName',model.networkName)}{input('IP address','ipAddress',model.ipAddress)}
    <FormControl><FormLabel fontSize="xs">Signal strength (%)</FormLabel><NumberInput size="sm" min={0} max={100} value={model.signalStrength} onChange={(_,v)=>setValue('signalStrength',v)}><NumberInputField/></NumberInput></FormControl>{input('Hostname / device','hostname',model.hostname)}{input('Status text','statusText',model.statusText)}
    <Text fontSize="xs" fontWeight="bold">Appearance</Text>{input('Accent / status colour','accentColour',model.accentColour)}{input('Disconnected colour','disconnectedColour',model.disconnectedColour)}<Text fontSize="xs" fontWeight="bold">Integration</Text><Checkbox isChecked={model.generateRuntimeApi} onChange={e=>setValue('generateRuntimeApi',e.target.checked)}>Generate Runtime SDK</Checkbox>
  </Stack>
}
