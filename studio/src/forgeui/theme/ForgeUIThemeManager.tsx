import React, { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Image,
} from '@chakra-ui/react'

import { useForgeTheme } from './ForgeThemeContext'
import { FG_PREVIEW_PALETTES } from '~forgeui/preview/forgeThemeMap'
import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

type UploadedAsset = ReturnType<
  typeof forgeUIGetUploadedAssets
>[number]

type ForgeUIThemeManagerProps = {
  onClose: () => void
  onInsertImageAsset: (
    asset: UploadedAsset,
  ) => void
}

const ForgeUIThemeManager = ({
  onClose,
  onInsertImageAsset,
}: ForgeUIThemeManagerProps) => {
  const {
    themeId,
    heroBackground,
    setThemeId,
    setHeroBackground,
  } = useForgeTheme()

  const uploadedAssets =
    forgeUIGetUploadedAssets()

const [
  selectedArtworkId,
  setSelectedArtworkId,
] = useState<string | null>(null)


  const heroAssets = [...uploadedAssets]
    .reverse()
    .filter(
      asset =>
        asset.type.startsWith('image/') &&
        asset.exportStatus === 'lvgl_ready' &&
        asset.name
          .toLowerCase()
          .startsWith('ai_hero_'),
    )

  const artworkAssets = [...uploadedAssets]
  .reverse()
  .filter(asset => {
    const name = asset.name.toLowerCase()

    return (
      asset.type.startsWith('image/') &&
      asset.exportStatus === 'lvgl_ready' &&
      name.includes('_artwork_')
    )
  })

const iconAssets = [...uploadedAssets]
  .reverse()
  .filter(asset => {
    const name = asset.name.toLowerCase()

    return (
      asset.type.startsWith('image/') &&
      asset.exportStatus === 'lvgl_ready' &&
      !name.startsWith('ai_hero_') &&
      !name.includes('_artwork_')
    )
  })

  return (
    <Box
      position="fixed"
      left="20px"
      top="70px"
      right="20px"
      bottom="10px"
      bg="#070b12"
      color="white"
      border="1px solid #805ad5"
      borderRadius="md"
      zIndex={9999}
      overflow="auto"
      boxShadow="0 0 24px rgba(0,0,0,0.65)"
      p={4}
    >
      <Flex
        justify="space-between"
        align="center"
        mb={4}
      >
        <Box
          fontWeight="bold"
          fontSize="lg"
        >
          ForgeUI Theme Manager
        </Box>

        <Button
          size="xs"
          colorScheme="red"
          onClick={onClose}
        >
          Close
        </Button>
      </Flex>

      <Box
        color="gray.400"
        fontSize="sm"
        mb={4}
      >
        Select a ForgeUI visual theme. This updates the
        builder, browser preview and LVGL export colour
        palette.
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={
          'repeat(auto-fill, minmax(145px, 1fr))'
        }
        gap={2}
      >
        {Object.entries(
          FG_PREVIEW_PALETTES,
        ).map(([id, palette]) => {
          const isActive =
            themeId === id

          return (
            <Box
              key={id}
              p={2}
              minWidth={0}
              border="1px solid"
              borderColor={
                isActive
                  ? 'cyan.300'
                  : 'gray.700'
              }
              borderRadius="6px"
              bg="#101827"
              cursor="pointer"
              transition="all 0.15s ease"
              onClick={() =>
                setThemeId(id as any)
              }
              boxShadow={
                isActive
                  ? '0 0 10px rgba(103,232,249,0.22)'
                  : 'none'
              }
              _hover={{
                borderColor: 'cyan.500',
                bg: '#131d2c',
              }}
            >
              <Flex
                justify="space-between"
                align="center"
                mb={1.5}
              >
                <Box
                  fontWeight="600"
                  fontSize="12px"
                  color="white"
                  noOfLines={1}
                >
                  {palette.name}
                </Box>

                {isActive && (
                  <Badge
                    colorScheme="cyan"
                    fontSize="8px"
                    lineHeight="14px"
                    height="14px"
                    borderRadius="3px"
                    px={1}
                  >
                    ACTIVE
                  </Badge>
                )}
              </Flex>

              <Box
                display="flex"
                height="28px"
                borderRadius="4px"
                overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                <Box
                  flex={1}
                  bg={palette.bg}
                />

                <Box
                  flex={1}
                  bg={palette.surface}
                />

                <Box
                  flex={1}
                  bg={palette.accent}
                />
              </Box>

              <Box
                mt={1.5}
                fontSize="10px"
                color={
                  isActive
                    ? 'cyan.200'
                    : 'gray.500'
                }
              >
                {isActive
                  ? 'Current'
                  : 'Apply'}
              </Box>
            </Box>
          )
        })}
      </Box>

      <Box mt={8}>
        <Box
          fontWeight="bold"
          fontSize="lg"
          mb={4}
        >
          AI & Uploaded Backgrounds
        </Box>

        {heroAssets.length === 0 ? (
          <Box
            color="gray.500"
            fontSize="sm"
          >
            No uploaded backgrounds available.
          </Box>
        ) : (
          <HStack
            spacing={4}
            align="stretch"
            flexWrap="wrap"
          >
            {heroAssets.map(asset => (
              <Box
                key={asset.id}
                width="220px"
                p={3}
                border="2px solid"
                borderColor={
                  heroBackground ===
                  asset.browserSrc
                    ? 'cyan.300'
                    : 'gray.600'
                }
                borderRadius="lg"
                bg="#101827"
                cursor="pointer"
                boxShadow={
                  heroBackground ===
                  asset.browserSrc
                    ? '0 0 18px rgba(103,232,249,0.45)'
                    : 'none'
                }
                onClick={() =>
                  setHeroBackground(
                    asset.browserSrc,
                  )
                }
                _hover={{
                  borderColor: 'cyan.300',
                  boxShadow:
                    '0 0 18px rgba(103,232,249,0.35)',
                }}
              >
                <Box
                  as="img"
                  src={asset.browserSrc}
                  alt={asset.name}
                  width="100%"
                  height="120px"
                  objectFit="cover"
                  borderRadius="md"
                  bg="#05070a"
                />

                <Box
                  mt={3}
                  fontSize="sm"
                  fontWeight="semibold"
                  noOfLines={1}
                >
                  {asset.name}
                </Box>

                <Badge
                  mt={2}
                  colorScheme="cyan"
                  variant="subtle"
                >
                  BACKGROUND
                </Badge>
              </Box>
            ))}
          </HStack>
        )}
      </Box>

      {artworkAssets.length > 0 && (
  <Box mt={10}>
    <Box
      fontWeight="bold"
      fontSize="lg"
      mb={4}
    >
      Uploaded Artwork
    </Box>

    <Flex wrap="wrap" gap={3} mb={8}>
      {artworkAssets.map(asset => {
        const isSelected =
          selectedArtworkId === asset.id

        return (
          <Box
            key={asset.id}
            cursor="pointer"
            border="2px solid"
            borderColor={
              isSelected
                ? 'cyan.300'
                : 'gray.700'
            }
            borderRadius="md"
            p={2}
            _hover={{
              borderColor: 'cyan.400',
            }}
            onClick={() => {
              setSelectedArtworkId(asset.id)
              onInsertImageAsset(asset)
            }}
          >
            <Image
              src={asset.browserSrc}
              alt=""
              boxSize="120px"
              objectFit="contain"
            />

            <Badge
              mt={2}
              colorScheme={
                isSelected
                  ? 'cyan'
                  : 'purple'
              }
            >
              {isSelected
                ? 'SELECTED'
                : 'ARTWORK'}
            </Badge>
          </Box>
        )
      })}
    </Flex>
  </Box>
)}

<Box mt={10}>
  <Box
    fontWeight="bold"
    fontSize="lg"
    mb={4}
  >
    Uploaded Icons
  </Box>

        {iconAssets.length === 0 ? (
          <Box
            color="gray.500"
            fontSize="sm"
          >
            No uploaded icons available.
          </Box>
        ) : (
          <Box
            display="grid"
            gridTemplateColumns={
              'repeat(auto-fill, minmax(110px, 1fr))'
            }
            gap={3}
          >
            {iconAssets.map(asset => (
              <Box
                key={asset.id}
                p={3}
                minWidth={0}
                border="1px solid"
                borderColor="gray.700"
                borderRadius="lg"
                bg="#101827"
              >
                <Flex
                  height="72px"
                  justify="center"
                  align="center"
                  bg="#05070a"
                  borderRadius="md"
                >
                  <Box
                    as="img"
                    src={asset.browserSrc}
                    alt={asset.name}
                    maxWidth="40px"
                    maxHeight="40px"
                    objectFit="contain"
                  />
                </Flex>

                <Box
                  mt={2}
                  fontSize="11px"
                  textAlign="center"
                  noOfLines={1}
                >
                  {asset.name}
                </Box>

                <Badge
                  mt={2}
                  width="100%"
                  textAlign="center"
                  colorScheme="teal"
                  variant="subtle"
                >
                  ICON
                </Badge>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ForgeUIThemeManager
