import React from 'react'
import { Box, Text, HStack } from '@chakra-ui/react'
import { FORGEUI_ACTIVE_DEVICE } from '~forgeui/ForgeUIDeviceConfig'
import { renderForgePreview } from './forgePreviewRenderer'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'

interface DevicePreviewProps {
  components: IComponents
}

const DevicePreview: React.FC<DevicePreviewProps> = ({
  components,
}) => {
  const { palette, heroBackground } = useForgeTheme()
  const root = components.root

  const textureUrlMap: Record<string, string> = {
    carbon_fiber: '/textures/carbon_fiber.png',
    brushed_steel: '/textures/brushed_steel.png',
    hex_mesh: '/textures/hex_mesh.png',
    dark_noise: '/textures/dark_noise.png',
    industrial_panel: '/textures/industrial_panel.png',
    blueprint_grid: '/textures/blueprint_grid.png',

    ai_mesh: '/textures/1024x600 AI Mesh.png',
    ai_nexus: '/textures/1024x600 AI Nexus.png',
    creation: '/textures/1024x600 Creation.png',
    nebula_core: '/textures/1024x600 Nebula Core.png',
    neon_horizon: '/textures/1024x600 Neon Horizon.png',
    neural_core: '/textures/1024x600 Neural Core.png',
    quantum_flow: '/textures/1024x600 Quantum Flow.png',
    quantum_hex: '/textures/1024x600 Quantum_hex.png',
  }

  const textureUrl =
    palette.texture && palette.texture !== 'none'
      ? textureUrlMap[palette.texture]
      : undefined

  const isHeroTexture =
    palette.texture &&
    [
      'ai_mesh',
      'ai_nexus',
      'creation',
      'nebula_core',
      'neon_horizon',
      'neural_core',
      'quantum_flow',
      'quantum_hex',
    ].includes(palette.texture)

  return (
    <Box
  px={3}
  pt={0}
  pb={1}
  height="calc(100vh - 92px)"
  minHeight={0}
>
  <Box
  bg="#05070a"
  border="1px solid rgba(45, 212, 191, 0.5)"
  borderRadius="18px"
  p={6}
  minHeight="calc(100vh - 120px)"
  overflow="auto"
>
    <HStack
      mb={1}
      px={1}
      justify="flex-end"
      align="center"
    >
      <Text
  mt="-30px"
  fontSize="xs"
  color="gray.400"
  textAlign="right"
>
  Browser Preview Only — final LVGL render may differ slightly.
</Text>
    </HStack>

        <Box
  position="relative"
  top="-10px"
  width={`${FORGEUI_ACTIVE_DEVICE.width}px`}
  height={`${FORGEUI_ACTIVE_DEVICE.height}px`}
  minWidth={`${FORGEUI_ACTIVE_DEVICE.width}px`}
  minHeight={`${FORGEUI_ACTIVE_DEVICE.height}px`}
          bg={palette.bg}
          backgroundImage={
            heroBackground
              ? `url("${heroBackground}")`
              : textureUrl
              ? `url("${textureUrl}")`
              : undefined
          }
          backgroundRepeat={
            heroBackground || isHeroTexture
              ? 'no-repeat'
              : 'repeat'
          }
          backgroundSize={
            heroBackground
              ? '1024px 600px'
              : isHeroTexture
              ? '1024px 600px'
              : palette.texture === 'dark_noise'
              ? '256px 256px'
              : palette.texture &&
                palette.texture !== 'none'
              ? '512px 512px'
              : undefined
          }
          backgroundPosition="0 0"
          border={`2px solid ${palette.border}`}
          borderRadius="12px"
          overflow="hidden"
        >
          {root
            ? renderForgePreview({
                component: root,
                components,
              })
            : null}
        </Box>
      </Box>
    </Box>
  )
}

export default DevicePreview