import React, { useMemo, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Input,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react'

import iconsList, { ICON_COUNT, ICON_NAMES } from '~forgeui/iconsList'

import {
  forgeUICreateUploadedAsset,
  forgeUIAddUploadedAssets,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelect: (iconName: string) => void
  onAssetsAdded?: () => void
}

const iconNameToPngFile = async (iconName: string): Promise<File | null> => {
  const IconComponent = iconsList[iconName as keyof typeof iconsList]

  if (!IconComponent) return null

  const svgMarkup = renderToStaticMarkup(
    <IconComponent size={64} color="white" />
  )

  const svgBlob = new Blob([svgMarkup], {
    type: 'image/svg+xml',
  })

  const svgUrl = URL.createObjectURL(svgBlob)

  try {
    const image = new Image()

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = reject
      image.src = svgUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.clearRect(0, 0, 64, 64)
    ctx.drawImage(image, 0, 0, 64, 64)

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })

    if (!pngBlob) return null

    return new File([pngBlob], `${iconName}.png`, {
      type: 'image/png',
    })
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject

    reader.readAsDataURL(file)
  })

const IconBrowserModal = ({
  isOpen,
  onClose,
  onSelect,
  onAssetsAdded,
}: Props) => {

  const [search, setSearch] = useState('')
  const [selectedIcons, setSelectedIcons] = useState<string[]>([])

  const filteredIcons = useMemo(() => {
    const term = search.toLowerCase().trim()

    if (!term) return ICON_NAMES

    return ICON_NAMES.filter(iconName =>
      iconName.toLowerCase().includes(term)
    )
  }, [search])

  const toggleSelectedIcon = (iconName: string) => {
    setSelectedIcons(current =>
      current.includes(iconName)
        ? current.filter(item => item !== iconName)
        : [...current, iconName]
    )
  }

  const handleUseSelectedIcon = (iconName: string) => {
    onSelect(iconName)
    onClose()
  }

  const handleAddSelectedToAssets = async () => {
  const files = (
    await Promise.all(
      selectedIcons.map(iconNameToPngFile),
    )
  ).filter(Boolean) as File[]

  if (files.length === 0) {
    return
  }

  const assets = await Promise.all(
    files.map(async file => {
      const browserSrc = await fileToBase64(file)

      return forgeUICreateUploadedAsset(
        file,
        browserSrc,
      )
    }),
  )

  forgeUIAddUploadedAssets(assets)

  // Notify the parent editor after the assets have been created.
  onAssetsAdded?.()

  setSelectedIcons([])
  onClose()

  window.dispatchEvent(
    new CustomEvent('forgeui-open-asset-manager'),
  )

  for (const asset of assets) {
    if (asset.exportStatus !== 'pending_conversion') {
      continue
    }

    try {
      const base64 = asset.browserSrc

      const res = await fetch(
        'http://localhost:3030/convert-lvgl-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: asset.name,
            symbolName: asset.lvgl,
            base64,
          }),
        },
      )

      const data = await res.json()

      if (!res.ok || !data.ok) {
        console.error(
          'LVGL icon conversion failed:',
          data,
        )

        continue
      }

      console.log(
        'LVGL icon conversion OK:',
        data,
      )

      forgeUIUpdateUploadedAsset(asset.id, {
        exportStatus: 'lvgl_ready',
        cFile:
          data.assetSource ||
          asset.cFile,
      })
    } catch (err) {
      console.error(
        'LVGL icon conversion error:',
        err,
      )
    }
  }
}

  

   return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
      <ModalOverlay bg="blackAlpha.800" />

      <ModalContent
        bg="#07101f"
        color="white"
        border="1px solid #00e5ff"
        borderRadius="md"
        boxShadow="0 0 30px rgba(0,229,255,0.25)"
        maxW="900px"
      >
        <ModalHeader>ForgeUI Icon Browser</ModalHeader>

        <ModalBody pb={4}>
          <HStack align="start" spacing={4}>
            <VStack align="stretch" spacing={3} flex="1">
              <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search icons: wifi, battery, power, home..."
                bg="#020817"
                borderColor="cyan.500"
                color="white"
              />

              <Text fontSize="xs" color="gray.400">
                Total Icons: {ICON_COUNT}
              </Text>

              <Text fontSize="xs" color="gray.400">
                Showing: {filteredIcons.length}
              </Text>

              <div
                style={{
                  maxHeight: '360px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {filteredIcons.map(iconName => {
                  const IconPreview = iconsList[iconName as keyof typeof iconsList]
                  const isSelected = selectedIcons.includes(iconName)

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => toggleSelectedIcon(iconName)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        textAlign: 'left',
                        background: isSelected
                          ? 'rgba(0,229,255,0.18)'
                          : 'transparent',
                        border: isSelected
                          ? '1px solid #00e5ff'
                          : '1px solid transparent',
                        color: '#9ae6ff',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        fontSize: '14px',
                        borderRadius: '6px',
                      }}
                    >
                      {IconPreview && <IconPreview size={18} />}
                      <span>{iconName}</span>
                    </button>
                  )
                })}
              </div>
            </VStack>

            <VStack
              align="stretch"
              spacing={3}
              w="250px"
              bg="#020817"
              border="1px solid rgba(0,229,255,0.35)"
              borderRadius="md"
              p={3}
            >
              <Text fontSize="sm" color="cyan.200">
                Selected Icons: {selectedIcons.length}
              </Text>

              <div
                style={{
                  maxHeight: '260px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {selectedIcons.map(iconName => {
                  const IconPreview = iconsList[iconName as keyof typeof iconsList]

                  return (
                    <HStack
                      key={iconName}
                      justify="space-between"
                      border="1px solid rgba(255,255,255,0.12)"
                      borderRadius="md"
                      p={2}
                    >
                      <HStack>
                        {IconPreview && <IconPreview size={18} />}
                        <Text fontSize="xs">{iconName}</Text>
                      </HStack>

                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => toggleSelectedIcon(iconName)}
                      >
                        x
                      </Button>
                    </HStack>
                  )
                })}
              </div>

              <Button
                size="sm"
                colorScheme="cyan"
                isDisabled={selectedIcons.length === 0}
                onClick={handleAddSelectedToAssets}
              >
                Add Selected To Assets
              </Button>

              {selectedIcons.length === 1 && (
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="cyan"
                  onClick={() => handleUseSelectedIcon(selectedIcons[0])}
                >
                  Use As Icon Widget
                </Button>
              )}
            </VStack>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default IconBrowserModal