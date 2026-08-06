import React from 'react'
import { Checkbox, FormControl, FormLabel, Input, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUIDeviceSummaryCard } from '~forgeui/ForgeUIDeviceSummaryCard'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

export const DeviceSummaryCardPanel = () => {
  const { setValue } = useForm(); const keys=['title','deviceName','overallStatus','uptime','firmwareVersion','networkStatus','storageStatus','onlineColour','warningColour','errorColour','offlineColour','generateRuntimeApi']
  const model=normalizeForgeUIDeviceSummaryCard(Object.fromEntries(keys.map(key=>[key,usePropsSelector(key)])))
  const input=(label:string,key:string,value:string)=><FormControl><FormLabel fontSize="xs">{label}</FormLabel><Input size="sm" value={value} onChange={e=>setValue(key,e.target.value)}/></FormControl>
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}><Text fontSize="sm" fontWeight="bold">ForgeUI Native Device Summary Card</Text><Text fontSize="xs" fontWeight="bold">Device</Text>
    {input('Title','title',model.title)}{input('Device name','deviceName',model.deviceName)}<FormControl><FormLabel fontSize="xs">Overall status</FormLabel><Select size="sm" value={model.overallStatus} onChange={e=>setValue('overallStatus',e.target.value)}><option value="offline">Offline</option><option value="online">Online</option><option value="warning">Warning</option><option value="error">Error</option></Select></FormControl>
    <Text fontSize="xs" fontWeight="bold">Summary</Text>{input('Uptime','uptime',model.uptime)}{input('Firmware / version','firmwareVersion',model.firmwareVersion)}{input('Network status','networkStatus',model.networkStatus)}{input('Storage status','storageStatus',model.storageStatus)}
    <Text fontSize="xs" fontWeight="bold">Status colours</Text>{input('Online colour','onlineColour',model.onlineColour)}{input('Warning colour','warningColour',model.warningColour)}{input('Error colour','errorColour',model.errorColour)}{input('Offline colour','offlineColour',model.offlineColour)}
    <Text fontSize="xs" fontWeight="bold">Integration</Text><Checkbox isChecked={model.generateRuntimeApi} onChange={e=>setValue('generateRuntimeApi',e.target.checked)}>Generate Runtime SDK</Checkbox>
  </Stack>
}
