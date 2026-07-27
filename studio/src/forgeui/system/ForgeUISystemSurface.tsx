import React from 'react'
import {
  Box,
  Button,
  Grid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react'
import {
  FiArrowLeft,
  FiBluetooth,
  FiHardDrive,
  FiInfo,
  FiSettings,
  FiSpeaker,
  FiSun,
  FiTool,
  FiWifi,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import {
  ForgeUISystemPage,
  useForgeUISystem,
} from './ForgeUISystemContext'

type SystemCard = {
  page: ForgeUISystemPage
  label: string
  icon: IconType
  enabled: boolean
}

export const FORGEUI_SYSTEM_PAGES: readonly SystemCard[] = [
  { page: 'brightness', label: 'Display', icon: FiSun, enabled: true },
  { page: 'wifi', label: 'Wi-Fi', icon: FiWifi, enabled: false },
  { page: 'bluetooth', label: 'Bluetooth', icon: FiBluetooth, enabled: false },
  { page: 'sound', label: 'Sound', icon: FiSpeaker, enabled: false },
  { page: 'storage', label: 'Storage', icon: FiHardDrive, enabled: false },
  { page: 'device', label: 'Device', icon: FiInfo, enabled: false },
  { page: 'diagnostics', label: 'Diagnostics', icon: FiTool, enabled: false },
]

const Header: React.FC<{
  title: string
  onBack: () => void
}> = ({ title, onBack }) => (
  <Box
    height="82px"
    display="flex"
    alignItems="center"
    borderBottom="1px solid rgba(148, 163, 184, 0.25)"
    px="28px"
    position="relative"
  >
    <Button
      aria-label={`Back from ${title}`}
      onClick={onBack}
      leftIcon={<FiArrowLeft />}
      size="lg"
      variant="ghost"
      color="inherit"
      position="absolute"
      left="22px"
    >
      Back
    </Button>
    <Text
      width="100%"
      textAlign="center"
      fontSize="30px"
      fontWeight="bold"
    >
      {title}
    </Text>
  </Box>
)

const SystemLauncher = () => {
  const { openSystemPage, goBackInSystemInterface } =
    useForgeUISystem()
  const { palette } = useForgeTheme()

  return (
    <Box height="100%" data-testid="system-launcher">
      <Header
        title="System"
        onBack={goBackInSystemInterface}
      />
      <Grid
        templateColumns="repeat(4, 1fr)"
        gap="18px"
        px="34px"
        py="28px"
      >
        {FORGEUI_SYSTEM_PAGES.map(card => {
          const Icon = card.icon
          return (
            <Button
              key={card.page}
              data-testid={`system-card-${card.page}`}
              aria-disabled={!card.enabled}
              disabled={!card.enabled}
              onClick={() =>
                card.enabled && openSystemPage(card.page)
              }
              height="178px"
              whiteSpace="normal"
              display="flex"
              flexDirection="column"
              gap="10px"
              border={`1px solid ${palette.border}`}
              bg={palette.surface}
              color={palette.text}
              opacity={card.enabled ? 1 : 0.48}
              _hover={
                card.enabled
                  ? { bg: palette.surface2, transform: 'translateY(-2px)' }
                  : undefined
              }
            >
              <Icon size={48} color={palette.accent} />
              <Text fontSize="20px" fontWeight="bold">
                {card.label}
              </Text>
              {!card.enabled && (
                <Text fontSize="12px" textTransform="uppercase">
                  Coming Later
                </Text>
              )}
            </Button>
          )
        })}
      </Grid>
    </Box>
  )
}

const BrightnessPage = () => {
  const {
    brightness,
    setBrightness,
    goBackInSystemInterface,
  } = useForgeUISystem()
  const { palette } = useForgeTheme()

  return (
    <Box height="100%" data-testid="system-brightness-page">
      <Header
        title="Brightness"
        onBack={goBackInSystemInterface}
      />
      <Box
        height="calc(100% - 82px)"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px="110px"
        pb="42px"
      >
        <FiSun size={104} color={palette.accent} />
        <Text
          data-testid="brightness-percentage"
          fontSize="64px"
          lineHeight="1"
          fontWeight="bold"
          mt="22px"
          mb="38px"
        >
          {brightness}%
        </Text>
        <Slider
          aria-label="Display brightness"
          min={10}
          max={100}
          value={brightness}
          onChange={setBrightness}
          height="54px"
        >
          <SliderTrack height="14px" bg={palette.surface2}>
            <SliderFilledTrack bg={palette.accent} />
          </SliderTrack>
          <SliderThumb
            width="38px"
            height="38px"
            bg={palette.text}
            border={`4px solid ${palette.accent}`}
          />
        </Slider>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          mt="8px"
          opacity={0.7}
        >
          <Text>10%</Text>
          <Text>100%</Text>
        </Box>
      </Box>
    </Box>
  )
}

const ForgeUISystemSurface: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const {
    isOpen,
    page,
    brightness,
    openSystemLauncher,
  } = useForgeUISystem()
  const { palette } = useForgeTheme()

  return (
    <Box
      position="absolute"
      inset={0}
      overflow="hidden"
      data-testid="forgeui-system-surface"
    >
      <Box
        position="absolute"
        inset={0}
        transition="filter 120ms ease"
        filter={`brightness(${brightness}%)`}
        data-testid="forgeui-brightness-layer"
      >
        <Box
          position="absolute"
          inset={0}
          transition="transform 220ms ease"
          transform={
            isOpen ? 'translateX(-12%)' : 'translateX(0)'
          }
          aria-hidden={isOpen}
        >
          {children}
          <Button
            aria-label="Open System"
            title="Open System"
            onClick={event => {
              event.preventDefault()
              event.stopPropagation()
              openSystemLauncher()
            }}
            position="absolute"
            top="18px"
            right="18px"
            width="58px"
            height="58px"
            minWidth="58px"
            borderRadius="full"
            border={`2px solid ${palette.border}`}
            bg={palette.surface}
            color={palette.accent}
            zIndex={20}
            boxShadow="0 8px 24px rgba(0,0,0,0.35)"
          >
            <FiSettings size={28} />
          </Button>
        </Box>

        <Box
          position="absolute"
          inset={0}
          zIndex={30}
          bg={palette.bg}
          color={palette.text}
          transition="transform 220ms ease"
          transform={
            isOpen ? 'translateX(0)' : 'translateX(100%)'
          }
          pointerEvents={isOpen ? 'auto' : 'none'}
          aria-hidden={!isOpen}
          data-testid="forgeui-system-panel"
        >
          {page === 'brightness'
            ? <BrightnessPage />
            : <SystemLauncher />}
        </Box>
      </Box>
    </Box>
  )
}

export default ForgeUISystemSurface
