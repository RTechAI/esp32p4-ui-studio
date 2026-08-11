import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Flex, HStack, Select, Switch, Text } from '@chakra-ui/react'
import { DeviceConsoleTab, useDeviceConsole } from '~contexts/device-console-context'

const tabs: Array<{ id: DeviceConsoleTab; label: string }> = [
  { id: 'build', label: 'BUILD' }, { id: 'monitor', label: 'MONITOR' }, { id: 'io', label: 'I/O' },
]

const DeviceConsoleDock = () => {
  const state = useDeviceConsole()
  const [height, setHeight] = useState(240)
  const [monitorAutoScroll, setMonitorAutoScroll] = useState(true)
  const logRef = useRef<HTMLDivElement & HTMLPreElement>(null)
  const monitorLogRef = useRef<HTMLDivElement & HTMLPreElement>(null)
  useEffect(() => {
    if (state.activeTab === 'build' && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [state.activeTab, state.log])
  useEffect(() => {
    if (state.activeTab === 'monitor' && monitorAutoScroll && monitorLogRef.current) monitorLogRef.current.scrollTop = monitorLogRef.current.scrollHeight
  }, [monitorAutoScroll, state.activeTab, state.monitorLog])
  if (!state.isOpen) return null

  const startResize = (event: React.PointerEvent<HTMLDivElement>) => {
    const startY = event.clientY
    const startHeight = height
    const move = (next: PointerEvent) => setHeight(Math.min(Math.max(140, window.innerHeight * 0.65), Math.max(140, startHeight + startY - next.clientY)))
    const finish = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish) }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', finish)
  }

  return <Box data-testid="device-console-dock" as="section" flex="0 0 auto" height={`${height}px`} minHeight="140px" bg="#05070a" color="green.100" borderTop="1px solid #2dd4bf" overflow="hidden">
    <Box aria-label="Resize device console" role="separator" aria-orientation="horizontal" height="5px" cursor="ns-resize" bg="#172033" _hover={{ bg: '#2dd4bf' }} onPointerDown={startResize} />
    <Flex height="37px" px={3} justify="space-between" align="center" borderBottom="1px solid #1e293b">
      <HStack spacing={1}>
        <Box fontWeight="bold" fontSize="sm" mr={3}>ForgeUI Device Console</Box>
        {tabs.map(tab => <Button key={tab.id} size="xs" variant="ghost" color={state.activeTab === tab.id ? 'cyan.200' : 'gray.400'} borderBottom={state.activeTab === tab.id ? '2px solid #2dd4bf' : '2px solid transparent'} borderRadius={0} onClick={() => state.setActiveTab(tab.id)}>{tab.label}</Button>)}
      </HStack>
      <HStack spacing={2}>
        {state.activeTab === 'build' && <><Box fontSize="11px" color={state.running ? 'orange.300' : 'green.300'}>{state.running ? 'RUNNING' : 'IDLE'}</Box><Button size="xs" variant="outline" onClick={state.clear}>Clear</Button><Button size="xs" colorScheme="red" onClick={state.stop}>Stop</Button></>}
        <Button size="xs" variant="ghost" onClick={state.collapse}>Collapse</Button>
      </HStack>
    </Flex>
    <Box height="calc(100% - 42px)" overflow="hidden">
      {state.activeTab === 'build' && <Box ref={logRef} as="pre" data-testid="build-console-output" whiteSpace="pre-wrap" overflowY="auto" height="100%" fontSize="11px" fontFamily="Consolas, 'Courier New', monospace" bg="#020304" color="green.100" p={2} cursor="text" userSelect="text">{state.log || 'Waiting for flash output...'}</Box>}
      {state.activeTab === 'monitor' && <Flex height="100%" direction="column" overflow="hidden">
        <HStack px={3} py={2} spacing={2} bg="#0b1018" color="gray.200">
          <Text fontSize="xs">Port:</Text>
          <Select aria-label="Serial port" size="xs" width="180px" value={state.selectedPort} onChange={event => state.setSelectedPort(event.target.value)} isDisabled={state.monitorState === 'connected' || state.monitorState === 'connecting'}>
            <option value="">Select port</option>
            {state.ports.map(port => <option key={port.path} value={port.path}>{port.path}{port.manufacturer ? ` — ${port.manufacturer}` : ''}</option>)}
          </Select>
          <Button size="xs" variant="outline" onClick={state.loadPorts}>Refresh</Button>
          <Text fontSize="xs">Baud:</Text>
          <Select aria-label="Baud rate" size="xs" width="105px" value={state.baud} onChange={event => state.setBaud(Number(event.target.value))} isDisabled={state.monitorState === 'connected' || state.monitorState === 'connecting'}>
            {[9600, 57600, 115200, 230400, 460800, 921600].map(value => <option key={value} value={value}>{value}</option>)}
          </Select>
          {state.monitorState === 'connected' ? <Button size="xs" colorScheme="red" onClick={state.disconnectMonitor}>Disconnect</Button> : <Button size="xs" colorScheme="teal" isLoading={state.monitorState === 'connecting'} onClick={state.connectMonitor}>Connect</Button>}
          <Button size="xs" variant="outline" onClick={state.clearMonitor}>Clear</Button>
          <HStack spacing={1}><Switch size="sm" isChecked={monitorAutoScroll} onChange={event => setMonitorAutoScroll(event.target.checked)} aria-label="Auto-scroll serial output" /><Text fontSize="xs">Auto-scroll</Text></HStack>
          <Text ml="auto" fontSize="xs" color={state.monitorState === 'error' ? 'red.300' : state.monitorState === 'connected' ? 'green.300' : 'gray.400'}>{state.monitorState.toUpperCase()}</Text>
        </HStack>
        {state.monitorError && <Box px={3} py={1} fontSize="xs" bg="red.900" color="red.100">{state.monitorError}</Box>}
        <Box ref={monitorLogRef} as="pre" data-testid="monitor-console-output" whiteSpace="pre-wrap" overflowY="auto" flex="1 1 auto" minH={0} fontSize="11px" fontFamily="Consolas, 'Courier New', monospace" bg="#020304" color="green.100" p={2} cursor="text" userSelect="text">{state.monitorLog || 'Waiting for serial output...'}</Box>
      </Flex>}
      {state.activeTab === 'io' && <Flex height="100%" align="center" justify="center" color="gray.400">Live ForgeUI hardware telemetry coming next</Flex>}
    </Box>
  </Box>
}

export default DeviceConsoleDock
