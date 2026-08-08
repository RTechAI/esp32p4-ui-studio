import React, { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
} from '@chakra-ui/react'
import { FiEdit2 } from 'react-icons/fi'

import { useForgeTheme } from './ForgeThemeContext'
import { FG_PREVIEW_PALETTES } from '~forgeui/preview/forgeThemeMap'
import {
  forgeUIGetUploadedAssets,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_BACKGROUND_ASSETS,
  FORGEUI_BACKGROUND_CATEGORIES,
  ForgeUIBackgroundAsset,
  ForgeUIBackgroundCategory,
} from '~forgeui/ForgeUIAssetRegistry'
import { registerAndConvertImage } from '~forgeui/ai/ForgeUIAIImagePipeline'

type UploadedAsset = ReturnType<typeof forgeUIGetUploadedAssets>[number]

type ForgeUIThemeManagerProps = {
  onClose: () => void
  onInsertImageAsset: (asset: UploadedAsset) => void
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

  const uploadedAssets = forgeUIGetUploadedAssets()

  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(
    null,
  )
  const [backgroundCategory, setBackgroundCategory] = useState<
    ForgeUIBackgroundCategory | 'All'
  >('All')
  const [convertingBackgroundId, setConvertingBackgroundId] = useState<
    string | null
  >(null)
  const [backgroundError, setBackgroundError] = useState<string | null>(null)
  const [renamingAssetId, setRenamingAssetId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [, setAssetRevision] = useState(0)

  const saveBackgroundName = (asset: UploadedAsset) => {
    const displayName = renameValue.trim()
    if (!displayName) return
    forgeUIUpdateUploadedAsset(asset.id, { displayName })
    setRenamingAssetId(null)
    setAssetRevision(revision => revision + 1)
  }

  const backgroundPrefix = (asset: ForgeUIBackgroundAsset) =>
    `background_${asset.id}`.replace(/[^a-z0-9]+/gi, '_').toLowerCase()

  const findConvertedBackground = (asset: ForgeUIBackgroundAsset) =>
    forgeUIGetUploadedAssets().find(uploaded =>
      uploaded.name.toLowerCase().startsWith(backgroundPrefix(asset)),
    )

  const selectBundledBackground = async (asset: ForgeUIBackgroundAsset) => {
    setBackgroundError(null)

    const converted = findConvertedBackground(asset)
    if (converted?.exportStatus === 'lvgl_ready') {
      setHeroBackground(converted.browserSrc)
      return
    }

    // Apply the ordinary image immediately in browser preview, then pass the
    // same asset through the existing converter for Live/Standalone export.
    setHeroBackground(asset.src)
    setConvertingBackgroundId(asset.id)
    try {
      const ready = await registerAndConvertImage({
        browserSrc: asset.src,
        filePrefix: backgroundPrefix(asset),
        assetMode: 'hero',
        width: asset.width,
        height: asset.height,
        recordDimensions: true,
      })
      setHeroBackground(ready.browserSrc)
    } catch (error) {
      setBackgroundError(
        error instanceof Error
          ? error.message
          : 'Background conversion failed.',
      )
    } finally {
      setConvertingBackgroundId(null)
    }
  }

  const visibleBackgrounds = FORGEUI_BACKGROUND_ASSETS.filter(
    asset =>
      backgroundCategory === 'All' || asset.category === backgroundCategory,
  )

  const heroAssets = [...uploadedAssets]
    .reverse()
    .filter(
      asset =>
        asset.type.startsWith('image/') &&
        asset.exportStatus === 'lvgl_ready' &&
        asset.name.toLowerCase().startsWith('ai_hero_'),
    )

  const artworkAssets = [...uploadedAssets].reverse().filter(asset => {
    const name = asset.name.toLowerCase()

    return (
      asset.type.startsWith('image/') &&
      asset.exportStatus === 'lvgl_ready' &&
      name.includes('_artwork_')
    )
  })

  const iconAssets = [...uploadedAssets].reverse().filter(asset => {
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
      <Flex justify="space-between" align="center" mb={4}>
        <Box fontWeight="bold" fontSize="lg">
          ForgeUI Theme Manager
        </Box>

        <Button size="xs" colorScheme="red" onClick={onClose}>
          Close
        </Button>
      </Flex>

      <Box color="gray.400" fontSize="sm" mb={4}>
        Select a ForgeUI visual theme. This updates the builder, browser preview
        and LVGL export colour palette.
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={'repeat(auto-fill, minmax(145px, 1fr))'}
        gap={2}
      >
        {Object.entries(FG_PREVIEW_PALETTES).map(([id, palette]) => {
          const isActive = themeId === id

          return (
            <Box
              key={id}
              p={2}
              minWidth={0}
              border="1px solid"
              borderColor={isActive ? 'cyan.300' : 'gray.700'}
              borderRadius="6px"
              bg="#101827"
              cursor="pointer"
              transition="all 0.15s ease"
              onClick={() => setThemeId(id as any)}
              boxShadow={isActive ? '0 0 10px rgba(103,232,249,0.22)' : 'none'}
              _hover={{
                borderColor: 'cyan.500',
                bg: '#131d2c',
              }}
            >
              <Flex justify="space-between" align="center" mb={1.5}>
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
                <Box flex={1} bg={palette.bg} />

                <Box flex={1} bg={palette.surface} />

                <Box flex={1} bg={palette.accent} />
              </Box>

              <Box
                mt={1.5}
                fontSize="10px"
                color={isActive ? 'cyan.200' : 'gray.500'}
              >
                {isActive ? 'Current' : 'Apply'}
              </Box>
            </Box>
          )
        })}
      </Box>

      <Box mt={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Box fontWeight="bold" fontSize="lg">
            Dashboard Foundation Backgrounds
          </Box>
          {heroBackground && (
            <Button
              size="xs"
              variant="outline"
              onClick={() => setHeroBackground(null)}
            >
              Clear Background
            </Button>
          )}
        </Flex>

        <HStack spacing={2} mb={4} flexWrap="wrap">
          {(['All', ...FORGEUI_BACKGROUND_CATEGORIES] as const).map(
            category => (
              <Button
                key={category}
                size="xs"
                variant={backgroundCategory === category ? 'solid' : 'outline'}
                colorScheme={backgroundCategory === category ? 'cyan' : 'gray'}
                onClick={() => setBackgroundCategory(category)}
              >
                {category}
              </Button>
            ),
          )}
        </HStack>

        {backgroundError && (
          <Box mb={3} color="red.300" fontSize="xs">
            Browser preview applied, but export preparation failed:{' '}
            {backgroundError}
          </Box>
        )}

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(190px, 1fr))"
          gap={3}
        >
          {visibleBackgrounds.map(asset => {
            const converted = findConvertedBackground(asset)
            const isActive =
              heroBackground === asset.src ||
              heroBackground === converted?.browserSrc
            const isConverting = convertingBackgroundId === asset.id
            return (
              <Box
                key={asset.id}
                p={2}
                minWidth={0}
                border="2px solid"
                borderColor={isActive ? 'cyan.300' : 'gray.700'}
                borderRadius="lg"
                bg="#101827"
                cursor={isConverting ? 'wait' : 'pointer'}
                onClick={() => {
                  if (!isConverting) void selectBundledBackground(asset)
                }}
                boxShadow={
                  isActive ? '0 0 18px rgba(103,232,249,0.32)' : 'none'
                }
                _hover={{ borderColor: 'cyan.400' }}
              >
                <Image
                  src={asset.src}
                  alt={`${asset.name} dashboard background`}
                  width="100%"
                  height="96px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box mt={2} fontSize="sm" fontWeight="semibold" noOfLines={1}>
                  {asset.name}
                </Box>
                <Box mt={1} color="gray.400" fontSize="10px" noOfLines={2}>
                  {asset.description}
                </Box>
                <HStack mt={2} spacing={1}>
                  <Badge
                    colorScheme={asset.themeType === 'dark' ? 'gray' : 'blue'}
                  >
                    {asset.category}
                  </Badge>
                  <Badge variant="outline">
                    {asset.width}×{asset.height}
                  </Badge>
                </HStack>
                {isConverting && (
                  <Badge mt={2} colorScheme="orange">
                    PREPARING EXPORT
                  </Badge>
                )}
                {isActive && (
                  <Badge mt={2} colorScheme="cyan">
                    ACTIVE
                  </Badge>
                )}
              </Box>
            )
          })}
        </Box>
      </Box>

      <Box mt={8}>
        <Box fontWeight="bold" fontSize="lg" mb={4}>
          AI & Uploaded Backgrounds
        </Box>

        {heroAssets.length === 0 ? (
          <Box color="gray.500" fontSize="sm">
            No uploaded backgrounds available.
          </Box>
        ) : (
          <HStack spacing={4} align="stretch" flexWrap="wrap">
            {heroAssets.map(asset => (
              <Box
                key={asset.id}
                width="220px"
                p={3}
                border="2px solid"
                borderColor={
                  heroBackground === asset.browserSrc ? 'cyan.300' : 'gray.600'
                }
                borderRadius="lg"
                bg="#101827"
                cursor="pointer"
                boxShadow={
                  heroBackground === asset.browserSrc
                    ? '0 0 18px rgba(103,232,249,0.45)'
                    : 'none'
                }
                onClick={() => setHeroBackground(asset.browserSrc)}
                _hover={{
                  borderColor: 'cyan.300',
                  boxShadow: '0 0 18px rgba(103,232,249,0.35)',
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

                <Flex mt={3} align="center" gap={1}>
                  {renamingAssetId === asset.id ? (
                    <Input
                      size="xs"
                      aria-label={`Rename ${asset.displayName || asset.name}`}
                      value={renameValue}
                      autoFocus
                      onClick={event => event.stopPropagation()}
                      onChange={event => setRenameValue(event.target.value)}
                      onKeyDown={event => {
                        if (event.key === 'Enter') saveBackgroundName(asset)
                        if (event.key === 'Escape') setRenamingAssetId(null)
                      }}
                      onBlur={() => saveBackgroundName(asset)}
                    />
                  ) : (
                    <Box
                      flex={1}
                      minWidth={0}
                      fontSize="sm"
                      fontWeight="semibold"
                      noOfLines={1}
                    >
                      {asset.displayName || asset.name}
                    </Box>
                  )}
                  <IconButton
                    aria-label={`Rename ${asset.displayName || asset.name}`}
                    title="Rename background"
                    icon={<FiEdit2 />}
                    size="xs"
                    variant="ghost"
                    onClick={event => {
                      event.stopPropagation()
                      setRenameValue(asset.displayName || asset.name)
                      setRenamingAssetId(asset.id)
                    }}
                  />
                </Flex>

                <Badge mt={2} colorScheme="cyan" variant="subtle">
                  BACKGROUND
                </Badge>
              </Box>
            ))}
          </HStack>
        )}
      </Box>

      {artworkAssets.length > 0 && (
        <Box mt={10}>
          <Box fontWeight="bold" fontSize="lg" mb={4}>
            Uploaded Artwork
          </Box>

          <Flex wrap="wrap" gap={3} mb={8}>
            {artworkAssets.map(asset => {
              const isSelected = selectedArtworkId === asset.id

              return (
                <Box
                  key={asset.id}
                  cursor="pointer"
                  border="2px solid"
                  borderColor={isSelected ? 'cyan.300' : 'gray.700'}
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

                  <Badge mt={2} colorScheme={isSelected ? 'cyan' : 'purple'}>
                    {isSelected ? 'SELECTED' : 'ARTWORK'}
                  </Badge>
                </Box>
              )
            })}
          </Flex>
        </Box>
      )}

      <Box mt={10}>
        <Box fontWeight="bold" fontSize="lg" mb={4}>
          Uploaded Icons
        </Box>

        {iconAssets.length === 0 ? (
          <Box color="gray.500" fontSize="sm">
            No uploaded icons available.
          </Box>
        ) : (
          <Box
            display="grid"
            gridTemplateColumns={'repeat(auto-fill, minmax(110px, 1fr))'}
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

                <Box mt={2} fontSize="11px" textAlign="center" noOfLines={1}>
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
