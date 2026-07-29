import React from 'react'
import {
  Badge, Box, Button, Checkbox, Flex, Grid, HStack, Input,
  Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,
  ModalOverlay, Text, VStack,
} from '@chakra-ui/react'
import {
  FiArrowLeft, FiEye, FiEyeOff, FiLock, FiRefreshCw, FiWifi,
} from 'react-icons/fi'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import { useForgeUISystem } from './ForgeUISystemContext'

const WifiPage = () => {
  const system = useForgeUISystem()
  const { palette } = useForgeTheme()
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [remember, setRemember] = React.useState(true)
  const [validation, setValidation] = React.useState('')
  const wifi = system.previewWifi
  const stateLabel = wifi.scanInProgress
    ? 'Scanning'
    : wifi.state.replace('-', ' ')
  const signal = (rssi: number) =>
    rssi >= -55 ? 'Excellent' : rssi >= -67 ? 'Good'
      : rssi >= -75 ? 'Fair' : 'Weak'
  const cancelPassword = () => {
    setPassword('')
    setShowPassword(false)
    setValidation('')
    system.cancelPreviewWifiPassword()
  }
  const connectPassword = () => {
    if (password.length < 8 || password.length > 63) {
      setValidation('Password must be 8 to 63 characters')
      return
    }
    setValidation('')
    system.connectPreviewWifi(password, remember)
  }

  return (
    <Box height="100%" data-testid="system-wifi-page">
      <Box
        height="82px"
        display="flex"
        alignItems="center"
        borderBottom="1px solid rgba(148, 163, 184, 0.25)"
        px="28px"
        position="relative"
      >
        <Button
          aria-label="Back from Wi-Fi"
          onClick={system.goBackInSystemInterface}
          leftIcon={<FiArrowLeft />}
          size="lg"
          variant="ghost"
          color="inherit"
          position="absolute"
          left="22px"
        >
          Back
        </Button>
        <Text width="100%" textAlign="center" fontSize="30px" fontWeight="bold">
          Wi-Fi
        </Text>
        <Badge position="absolute" right="28px" colorScheme="orange" data-testid="wifi-preview-badge">
          Simulated Preview
        </Badge>
      </Box>
      <Flex height="calc(100% - 82px)" px="28px" py="14px" gap="22px">
        <VStack width="440px" flexShrink={0} align="stretch" spacing="12px">
          <Box
            border={`1px solid ${palette.border}`}
            bg={palette.surface}
            borderRadius="12px"
            px="18px"
            py="14px"
            minHeight="248px"
          >
            <Text
              fontSize="11px"
              fontWeight="semibold"
              letterSpacing="0.12em"
              opacity={0.65}
            >
              CONNECTION STATUS
            </Text>
            <Text
              data-testid="wifi-state"
              fontSize="28px"
              fontWeight="bold"
              textTransform="capitalize"
              color={palette.accent}
              lineHeight="1.2"
              mt="2px"
            >
              {stateLabel}
            </Text>
            <Grid templateColumns="125px 1fr" rowGap="6px" mt="12px" fontSize="14px">
              <Text opacity={0.65}>Current network</Text>
              <Text data-testid="wifi-ssid">{wifi.ssid || '—'}</Text>
              <Text opacity={0.65}>IP address</Text>
              <Text data-testid="wifi-ip">{wifi.ip || '—'}</Text>
              <Text opacity={0.65}>Gateway</Text>
              <Text>{wifi.gateway || '—'}</Text>
              <Text opacity={0.65}>Signal</Text>
              <Text data-testid="wifi-rssi">
                {wifi.rssi == null ? 'Unavailable' : `${wifi.rssi} dBm · ${signal(wifi.rssi)}`}
              </Text>
              <Text opacity={0.65}>Security</Text>
              <Text>{wifi.security}</Text>
              <Text opacity={0.65}>Status</Text>
              <Text>{wifi.statusText}</Text>
            </Grid>
            {wifi.error && <Text mt="6px" color="red.300" data-testid="wifi-error">{wifi.error}</Text>}
          </Box>
          <HStack spacing="8px">
            <Button
              flex="1"
              minHeight="44px"
              onClick={system.scanPreviewWifi}
              disabled={wifi.scanInProgress}
              leftIcon={<FiWifi />}
            >
              {wifi.scanInProgress ? 'Scanning…' : 'Scan Networks'}
            </Button>
            <Button minHeight="44px" aria-label="Refresh Wi-Fi status" leftIcon={<FiRefreshCw />}>
              Refresh
            </Button>
          </HStack>
          {wifi.state === 'connected' ? (
            <Box
              border={`1px solid ${palette.border}`}
              bg={palette.surface}
              borderRadius="12px"
              px="16px"
              py="12px"
              data-testid="wifi-connected-details"
            >
              <Text fontSize="16px" fontWeight="bold">Connected Network</Text>
              <Grid templateColumns="100px 1fr" fontSize="12px" rowGap="4px" mt="7px">
                <Text opacity={0.65}>Station MAC</Text><Text>{wifi.stationMac}</Text>
                <Text opacity={0.65}>AP BSSID</Text><Text>{wifi.apBssid || '—'}</Text>
              </Grid>
              <HStack mt="10px" spacing="7px">
                <Button flex="1" size="sm" onClick={system.disconnectPreviewWifi}>Disconnect</Button>
                <Button flex="1" size="sm" onClick={system.requestForgetPreviewWifi}>Forget</Button>
                <Button flex="1" size="sm" onClick={system.reconnectPreviewWifi}>Reconnect</Button>
              </HStack>
            </Box>
          ) : (
            <Button onClick={system.reconnectPreviewWifi}>Reconnect Saved Network</Button>
          )}
        </VStack>
        <Box
          flex="1"
          minWidth={0}
          border={`1px solid ${palette.border}`}
          bg={palette.surface}
          borderRadius="12px"
          px="14px"
          py="14px"
        >
          <Text fontSize="20px" fontWeight="bold" lineHeight="1.2">Available Networks</Text>
          <Text fontSize="11px" opacity={0.6} mt="2px" mb="11px">
            Select a network to connect
          </Text>
          <VStack align="stretch" spacing="8px" maxHeight="404px" overflowY="auto" data-testid="wifi-network-list">
            {wifi.scanInProgress && <Text py="18px">Scanning for nearby networks…</Text>}
            {!wifi.scanInProgress && wifi.networks.map(network => {
              const selected = wifi.selectedSsid === network.ssid
              const connecting = selected && wifi.state === 'connecting'
              return (
                <Button
                  key={network.ssid}
                  onClick={() => system.selectPreviewWifi(network.ssid)}
                  justifyContent="space-between"
                  minHeight="50px"
                  px="12px"
                  border="1px solid"
                  borderColor={selected ? palette.accent : palette.border}
                  bg={selected ? palette.accent : palette.surface2}
                  color={selected ? palette.bg : palette.text}
                  opacity={connecting ? 0.82 : 1}
                  borderRadius="9px"
                  _hover={{
                    bg: selected ? palette.accent : palette.surface,
                    borderColor: palette.accent,
                    color: selected ? palette.bg : palette.text,
                  }}
                  _active={{
                    bg: palette.accent,
                    borderColor: palette.accent,
                    color: palette.bg,
                    opacity: 0.88,
                  }}
                  _focusVisible={{
                    bg: selected ? palette.accent : palette.surface,
                    borderColor: palette.accent,
                    color: selected ? palette.bg : palette.text,
                    boxShadow: `0 0 0 2px ${palette.accent}`,
                  }}
                  _disabled={{
                    bg: palette.surface2,
                    borderColor: palette.border,
                    color: palette.text,
                    opacity: 0.45,
                  }}
                  data-selected={selected || undefined}
                  data-connecting={connecting || undefined}
                  data-testid={`wifi-network-${network.ssid}`}
                >
                  <HStack minWidth={0} flex="1" overflow="hidden" spacing="8px">
                    <Box as={FiWifi} color={selected ? palette.bg : palette.accent} />
                    {network.security !== 'Open' && (
                      <Box as={FiLock} color={selected ? palette.bg : palette.border} />
                    )}
                    <Text noOfLines={1} fontWeight="semibold" textAlign="left">{network.ssid}</Text>
                  </HStack>
                  <HStack flexShrink={0} spacing="6px" ml="8px">
                    {network.connected && (
                      <Badge bg={palette.accent} color={palette.bg}>Connected</Badge>
                    )}
                    {network.saved && (
                      <Badge bg={palette.surface} color={palette.text} border="1px solid" borderColor={palette.border}>
                        Saved
                      </Badge>
                    )}
                    <Text fontSize="12px" color={selected ? palette.bg : palette.accent}>
                      {network.rssi} dBm
                    </Text>
                  </HStack>
                </Button>
              )
            })}
            {!wifi.scanInProgress && wifi.networks.length === 0 && (
              <Text py="18px">No networks found. Tap Scan Networks.</Text>
            )}
          </VStack>
        </Box>
      </Flex>
      <Modal isOpen={wifi.passwordDialogSsid != null} onClose={cancelPassword} isCentered>
        <ModalOverlay />
        <ModalContent bg={palette.surface} color={palette.text}>
          <ModalHeader>Connect to {wifi.passwordDialogSsid}</ModalHeader>
          <ModalBody>
            <HStack>
              <Input
                aria-label="Wi-Fi password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={event => setPassword(event.target.value)}
                maxLength={63}
              />
              <Button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(value => !value)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </Button>
            </HStack>
            <Checkbox mt="12px" isChecked={remember} onChange={event => setRemember(event.target.checked)}>
              Remember password
            </Checkbox>
            {validation && <Text color="red.300" mt="8px">{validation}</Text>}
            {wifi.error && <Text color="red.300" mt="8px">{wifi.error}</Text>}
          </ModalBody>
          <ModalFooter gap="8px">
            <Button onClick={cancelPassword}>Cancel</Button>
            <Button colorScheme="orange" onClick={connectPassword}>
              Connect
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={wifi.forgetConfirmationOpen} onClose={system.cancelForgetPreviewWifi} isCentered>
        <ModalOverlay />
        <ModalContent bg={palette.surface} color={palette.text}>
          <ModalHeader>Forget {wifi.ssid}?</ModalHeader>
          <ModalBody>The saved password will be erased. A password will be required to reconnect.</ModalBody>
          <ModalFooter gap="8px">
            <Button onClick={system.cancelForgetPreviewWifi}>Cancel</Button>
            <Button colorScheme="red" onClick={system.confirmForgetPreviewWifi}>Forget Network</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default WifiPage
