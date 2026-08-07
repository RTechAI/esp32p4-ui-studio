import React, { memo, useState } from 'react'
import {
  Badge, Box, Button, Divider, HStack, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover, PopoverArrow,
  PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, SimpleGrid,
  Stack, Switch, Text,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  getAvailableBoardProfiles,
  getSelectedBoardProfile,
  normalizeProjectHardware,
} from './ForgeUIBoardRegistry'
import { ForgeUIFirmwareFeatures, ForgeUIProjectHardware } from './ForgeUIBoardProfile'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from '~forgeui/preview/forgeThemeMap'

type Props = {
  project: ForgeUIProjectHardware
  onChange: (project: ForgeUIProjectHardware) => void
}

const labels: Record<keyof ForgeUIFirmwareFeatures, string> = {
  wifi: 'Wi-Fi', bluetooth: 'Bluetooth', audio: 'Audio', sdCard: 'SD Card',
  rtc: 'External RTC', usbHost: 'USB Host', camera: 'Camera', settingsLauncher: 'Settings Launcher',
  wifiManager: 'Wi-Fi Manager', storageBrowser: 'Storage Browser',
  diagnostics: 'Diagnostics',
}

const ForgeUIBoardSelector: React.FC<Props> = ({ project, onChange }) => {
  const { palette } = useForgeTheme()
  const semantic = resolveForgeSemanticPalette(palette)
  const [dialog, setDialog] = useState<'boards' | 'hardware' | null>(null)
  const profile = getSelectedBoardProfile(project)
  const enabled = Object.entries(project.firmwareFeatures)
    .filter(([, value]) => value)
    .map(([key]) => labels[key as keyof ForgeUIFirmwareFeatures])

  const setFeature = (key: keyof ForgeUIFirmwareFeatures, value: boolean) => {
    onChange(normalizeProjectHardware({
      ...project,
      firmwareFeatures: { ...project.firmwareFeatures, [key]: value },
    }))
  }

  const featureSupported = (key: keyof ForgeUIFirmwareFeatures) => {
    if (key in profile.capabilities) {
      return profile.capabilities[key as keyof typeof profile.capabilities]
    }
    return profile.supportedFeatures[key as keyof typeof profile.supportedFeatures] !== false
  }

  const renderFeature = (key: keyof ForgeUIFirmwareFeatures) => {
    const supported = featureSupported(key)
    const dependencyMet = key === 'wifiManager'
      ? project.firmwareFeatures.wifi
      : key === 'storageBrowser'
        ? project.firmwareFeatures.sdCard
        : true
    const explanation = !supported
      ? 'Not available on this board.'
      : key === 'rtc'
        ? 'Use an external DS3231 real-time clock at I2C address 0x68.'
      : key === 'wifiManager'
        ? 'Requires Wi-Fi to be enabled.'
        : key === 'storageBrowser'
          ? 'Requires SD Card support to be enabled.'
          : ''

    return (
      <HStack
        key={key}
        justify="space-between"
        py={2}
        borderBottomWidth="1px"
        borderColor={semantic.surfaceBorder}
      >
        <Box>
          <Text
            fontSize="sm"
            fontWeight="600"
            color={supported ? semantic.textPrimary : semantic.disabledText}
          >
            {labels[key]}
          </Text>
          {explanation && (
            <Text fontSize="xs" color={semantic.textSecondary}>
              {explanation}
            </Text>
          )}
        </Box>
        <Switch
          aria-label={labels[key]}
          colorScheme="teal"
          isChecked={project.firmwareFeatures[key]}
          isDisabled={!supported || !dependencyMet}
          onChange={event => setFeature(key, event.target.checked)}
        />
      </HStack>
    )
  }

  const section = (
    title: string,
    description: string,
    keys: Array<keyof ForgeUIFirmwareFeatures>,
  ) => (
    <Box>
      <Text fontSize="md" fontWeight="700" color={semantic.textPrimary}>
        {title}
      </Text>
      <Text mb={1} fontSize="xs" color={semantic.textSecondary}>
        {description}
      </Text>
      {keys.map(renderFeature)}
    </Box>
  )

  return (
    <>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <Button
            data-testid="board-selector"
            size="xs"
            rightIcon={<ChevronDownIcon />}
            bg={semantic.surfaceSecondary}
            borderWidth="1px"
            borderColor={semantic.surfaceBorder}
            color={semantic.textPrimary}
          >
            Board: {profile.shortName}
          </Button>
        </PopoverTrigger>
        <PopoverContent bg={semantic.surface} borderColor={semantic.surfaceBorder} width="350px">
          <PopoverArrow bg={semantic.surface} />
          <PopoverHeader color={semantic.textPrimary} fontWeight="bold">
            Selected Board
          </PopoverHeader>
          <PopoverBody>
            <Text color={semantic.textPrimary} fontSize="sm" fontWeight="600">
              {profile.displayName}
            </Text>
            <SimpleGrid columns={2} mt={3} spacing={1} fontSize="xs">
              <Text color={semantic.textSecondary}>Target MCU</Text>
              <Text color={semantic.textPrimary}>{profile.target.toUpperCase()}</Text>
              <Text color={semantic.textSecondary}>Display Resolution</Text>
              <Text color={semantic.textPrimary}>
                {profile.display.width} × {profile.display.height} · {profile.display.colorDepth}-bit
              </Text>
              <Text color={semantic.textSecondary}>Enabled Features</Text>
              <Text color={semantic.textPrimary}>{enabled.join(', ') || 'Core hardware only'}</Text>
            </SimpleGrid>
            <HStack mt={4}>
              <Button size="xs" onClick={() => setDialog('boards')}>Select Board</Button>
              <Button size="xs" colorScheme="teal" onClick={() => setDialog('hardware')}>
                Configure Hardware
              </Button>
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <Modal isOpen={dialog !== null} onClose={() => setDialog(null)} size="xl">
        <ModalOverlay />
        <ModalContent bg={semantic.surface} color={semantic.textPrimary}>
          <ModalHeader color={semantic.textPrimary}>
            {dialog === 'boards' ? 'Select Board' : 'Hardware Configuration'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {dialog === 'boards' ? (
              <Stack>
                {getAvailableBoardProfiles().map(board => (
                  <Box key={board.id} borderWidth="1px" borderColor={semantic.surfaceBorder} borderRadius="md" p={3}>
                    <HStack justify="space-between">
                      <Box>
                        <Text color={semantic.textPrimary} fontWeight="bold">{board.displayName}</Text>
                        <Text fontSize="xs" color={semantic.textSecondary}>
                          {board.target} · {board.display.width} × {board.display.height}
                        </Text>
                      </Box>
                      <Badge colorScheme={board.status === 'supported' ? 'green' : 'orange'}>
                        {board.status}
                      </Badge>
                    </HStack>
                    <Button
                      mt={2}
                      size="xs"
                      isDisabled={board.status !== 'supported' || board.id === project.boardId}
                      onClick={() => onChange(normalizeProjectHardware({ boardId: board.id }))}
                    >
                      {board.id === project.boardId ? 'Selected' : 'Select'}
                    </Button>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Stack spacing={6}>
                <Box>
                  <Text fontSize="md" fontWeight="700" color={semantic.textPrimary}>
                    Core Hardware
                  </Text>
                  <Text mb={2} fontSize="xs" color={semantic.textSecondary}>
                    Required for this board.
                  </Text>
                  <Text fontSize="xs" color={semantic.textSecondary}>
                    These core hardware features are required for the selected board and cannot be disabled.
                  </Text>
                  {['Display', 'Touch', 'Backlight'].map(item => (
                    <HStack key={item} justify="space-between" py={2}>
                      <Text fontSize="sm" fontWeight="600" color={semantic.textPrimary}>
                        {item}
                      </Text>
                      <Badge colorScheme="green">Required</Badge>
                    </HStack>
                  ))}
                </Box>
                <Divider borderColor={semantic.surfaceBorder} />
                {section(
                  'Optional Hardware',
                  'Included in firmware only when enabled.',
                  ['wifi', 'bluetooth', 'audio', 'sdCard', 'rtc', 'usbHost', 'camera'],
                )}
                <Divider borderColor={semantic.surfaceBorder} />
                {section(
                  'Developer Tools',
                  'Utilities included with the generated firmware.',
                  ['settingsLauncher', 'wifiManager', 'storageBrowser', 'diagnostics'],
                )}
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={() => setDialog(null)}>Done</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default memo(ForgeUIBoardSelector)
