import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUINetworkStatusCard } from '~forgeui/ForgeUINetworkStatusCard'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

const fields = ['title','interfaceType','state','displayMode','ssid','ipAddress','subnet','gateway','macAddress','rssi','latency','packetLoss','uptime','reconnectCount','cloudConnected','mqttConnected','internetAvailable','localApiAvailable','statusText','showSignal','showIp','showGateway','showLatency','showUptime','showCloud','showMqtt','showInterface','showStatus','iconStyle','signalStyle','rounded','shadow','glassStyle','simulationMode','generateRuntimeApi','enableUserEvents'] as const

export const NetworkStatusCardPanel = () => {
  const { setValue } = useForm()
  const selected = Object.fromEntries(fields.map(field => [field, usePropsSelector(field)]))
  const model: any = normalizeForgeUINetworkStatusCard(selected)
  const check = (key: string, label: string) => <Checkbox color={INSPECTOR_PROPERTY_TEXT_COLOR} isChecked={model[key]} onChange={event => setValue(key, event.target.checked)}>{label}</Checkbox>
  const input = (key: string, label: string) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><Input size="sm" value={model[key]} onChange={event => setValue(key, event.target.value)}/></FormControl>
  const number = (key: string, label: string) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><NumberInput size="sm" value={model[key]} onChange={(_, value) => setValue(key, value)}><NumberInputField/></NumberInput></FormControl>
  const select = (key: string, label: string, values: string[]) => <FormControl><FormLabel fontSize="xs">{label}</FormLabel><Select size="sm" value={model[key]} onChange={event => setValue(key, event.target.value)}>{values.map(value => <option key={value}>{value}</option>)}</Select></FormControl>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}><Text fontSize="sm" fontWeight="bold">ForgeUI Native Network Status Card</Text>
    {input('title','Title')}{select('displayMode','Display mode',['compact','detailed','dashboard'])}{select('interfaceType','Interface',['wifi','ethernet','mqtt','cloud','local-api','internet','vpn','cellular'])}{select('state','State',['unknown','offline','connecting','online','degraded','reconnecting','authentication-failed','fault'])}
    {input('ssid','SSID')}{input('ipAddress','IP address')}{input('subnet','Subnet')}{input('gateway','Gateway')}{input('macAddress','MAC address')}{number('rssi','RSSI (dBm)')}{number('latency','Latency (ms)')}{number('uptime','Uptime (seconds)')}{number('reconnectCount','Reconnect count')}{input('statusText','Status')}
    <Text fontSize="xs" fontWeight="bold">Connectivity</Text>{check('cloudConnected','Cloud connected')}{check('mqttConnected','MQTT connected')}{check('internetAvailable','Internet available')}{check('localApiAvailable','Local API available')}
    <Text fontSize="xs" fontWeight="bold">Visibility</Text>{[['showSignal','Signal'],['showIp','IP'],['showGateway','Gateway'],['showCloud','Cloud'],['showMqtt','MQTT'],['showLatency','Latency'],['showUptime','Uptime'],['showInterface','Interface'],['showStatus','Status']].map(([key,label]) => <React.Fragment key={key}>{check(key,label)}</React.Fragment>)}
    <Text fontSize="xs" fontWeight="bold">Appearance</Text>{select('iconStyle','Icon style',['interface','status'])}{select('signalStyle','Signal style',['bars','text'])}{check('rounded','Rounded')}{check('shadow','Shadow')}{check('glassStyle','Glass (future ready)')}
    {select('simulationMode','Browser scenario',['wifi-connected','ethernet-connected','weak-signal','offline','reconnecting','cloud-offline','mqtt-offline','authentication-failed'])}{check('generateRuntimeApi','Generate Runtime SDK')}{check('enableUserEvents','Generate UserEvents')}
  </Stack>
}
