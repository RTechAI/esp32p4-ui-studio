import React, { useMemo } from 'react'
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { useDeviceConsole } from '~contexts/device-console-context'
import { hasForgeUIIOData, parseForgeUIIOLog } from './ForgeUIIOLogParser'

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => <Flex gap={2} fontSize="xs"><Text color="gray.500" minW="70px">{label}</Text><Text color="gray.100">{value}</Text></Flex>
const Card = ({ title, children }: React.PropsWithChildren<{ title: string }>) => <Box border="1px solid #1e293b" bg="#0b1018" borderRadius="md" p={2}><Text fontSize="10px" fontWeight="bold" color="cyan.300" mb={1}>{title}</Text>{children}</Box>
const bytes = (count: number) => count >= 1024 ? `${(count / 1024).toFixed(1)} KiB` : `${count} B`

const DeviceIOView = () => {
  const state = useDeviceConsole()
  const snapshot = useMemo(() => parseForgeUIIOLog(state.monitorLog), [state.monitorLog])
  const connected = state.monitorState === 'connected'
  return <Flex height="100%" direction="column" overflow="hidden" color="gray.200">
    <Flex px={3} py={2} bg="#0b1018" borderBottom="1px solid #1e293b" align="center">
      <Text fontSize="xs" color={connected ? 'green.300' : 'gray.400'}>
        {connected ? `CONNECTED — ${state.selectedPort || 'SERIAL'} — ${state.baud}` : `${state.monitorState.toUpperCase()} — Connect MONITOR to receive live I/O data`}
      </Text>
      <Text ml="auto" fontSize="10px" color="gray.500">READ-ONLY</Text>
    </Flex>
    <Box flex="1 1 auto" minH={0} overflowY="auto" p={3}>
      {!hasForgeUIIOData(snapshot) ? <Flex height="100%" align="center" justify="center" direction="column" color="gray.400" textAlign="center"><Text>No structured I/O telemetry detected yet.</Text><Text fontSize="xs">Raw device output is available in MONITOR.</Text></Flex> :
      <SimpleGrid minChildWidth="180px" spacing={2}>
        {snapshot.system && <Card title="SYSTEM">{snapshot.system.runtime && <Field label="Runtime" value={snapshot.system.runtime} />}{snapshot.system.resetReason && <Field label="Reset" value={snapshot.system.resetReason} />}{snapshot.system.freeHeapBytes !== undefined && <Field label="Free heap" value={bytes(snapshot.system.freeHeapBytes)} />}{snapshot.system.minimumHeapBytes !== undefined && <Field label="Minimum" value={bytes(snapshot.system.minimumHeapBytes)} />}</Card>}
        {snapshot.network && <Card title="NETWORK">{snapshot.network.wifi && <Field label="Wi-Fi" value={snapshot.network.wifi} />}{snapshot.network.ip && <Field label="IPv4" value={snapshot.network.ip === '-' ? 'Unavailable' : snapshot.network.ip} />}{snapshot.network.rssiDbm !== undefined && <Field label="RSSI" value={`${snapshot.network.rssiDbm} dBm`} />}</Card>}
        {snapshot.storage && <Card title="STORAGE"><Field label="SD" value={snapshot.storage.sd} /></Card>}
        {snapshot.gpio.length > 0 && <Card title="GPIO">{snapshot.gpio.map(pin => <Field key={pin.gpio} label={`GPIO ${pin.gpio}`} value={pin.state} />)}</Card>}
        {snapshot.gps && <Card title="GPS">{snapshot.gps.fix && <Field label="Fix" value={snapshot.gps.fix} />}{snapshot.gps.satellites !== undefined && <Field label="Satellites" value={snapshot.gps.satellites} />}{snapshot.gps.latitude !== undefined && <Field label="Latitude" value={snapshot.gps.latitude} />}{snapshot.gps.longitude !== undefined && <Field label="Longitude" value={snapshot.gps.longitude} />}</Card>}
        {snapshot.i2c.length > 0 && <Card title="I2C">{snapshot.i2c.map(item => <Field key={item.address} label={item.address} value={item.device || 'Detected'} />)}</Card>}
        {snapshot.uart && <Card title="UART">{snapshot.uart.rx && <Field label="RX" value={snapshot.uart.rx} />}{snapshot.uart.tx && <Field label="TX" value={snapshot.uart.tx} />}</Card>}
        {snapshot.can && <Card title="CAN">{snapshot.can.state && <Field label="State" value={snapshot.can.state} />}{snapshot.can.rxCount !== undefined && <Field label="RX frames" value={snapshot.can.rxCount} />}{snapshot.can.txCount !== undefined && <Field label="TX frames" value={snapshot.can.txCount} />}{snapshot.can.latestId && <Field label="Latest ID" value={snapshot.can.latestId} />}{snapshot.can.latestData && <Field label="Data" value={snapshot.can.latestData} />}</Card>}
      </SimpleGrid>}
    </Box>
  </Flex>
}

export default DeviceIOView
