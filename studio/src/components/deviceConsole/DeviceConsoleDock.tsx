import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Flex, HStack } from '@chakra-ui/react'
import { DeviceConsoleTab, useDeviceConsole } from '~contexts/device-console-context'

const tabs: Array<{ id: DeviceConsoleTab; label: string }> = [
  { id: 'build', label: 'BUILD' }, { id: 'monitor', label: 'MONITOR' }, { id: 'io', label: 'I/O' },
]

const DeviceConsoleDock = () => {
  const state = useDeviceConsole()
  const [height, setHeight] = useState(240)
  const logRef = useRef<HTMLDivElement & HTMLPreElement>(null)
  useEffect(() => {
    if (state.activeTab === 'build' && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [state.activeTab, state.log])
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
        <Box fontSize="11px" color={state.running ? 'orange.300' : 'green.300'}>{state.running ? 'RUNNING' : 'IDLE'}</Box>
        <Button size="xs" variant="outline" onClick={state.clear}>Clear</Button>
        <Button size="xs" colorScheme="red" onClick={state.stop}>Stop</Button>
        <Button size="xs" variant="ghost" onClick={state.collapse}>Collapse</Button>
      </HStack>
    </Flex>
    <Box height="calc(100% - 42px)" overflow="hidden">
      {state.activeTab === 'build' && <Box ref={logRef} as="pre" data-testid="build-console-output" whiteSpace="pre-wrap" overflowY="auto" height="100%" fontSize="11px" fontFamily="Consolas, 'Courier New', monospace" bg="#020304" color="green.100" p={2} cursor="text" userSelect="text">{state.log || 'Waiting for flash output...'}</Box>}
      {state.activeTab === 'monitor' && <Flex height="100%" align="center" justify="center" color="gray.400">Serial monitor coming next</Flex>}
      {state.activeTab === 'io' && <Flex height="100%" align="center" justify="center" color="gray.400">Live ForgeUI hardware telemetry coming next</Flex>}
    </Box>
  </Box>
}

export default DeviceConsoleDock
