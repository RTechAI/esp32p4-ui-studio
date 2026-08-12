import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Checkbox, HStack, Text, VStack } from '@chakra-ui/react'
import { ForgeUIAssetSelectionRequest } from './ForgeUIAssetSelection'
import { getAllInteractiveAssets } from '../interactive'
import {
  findUploadedAssetReferences,
  formatAssetReferences,
} from '../ForgeUIReferenceProtection'
import { useForgeTheme } from '../theme/ForgeThemeContext'
import { useDropzone } from 'react-dropzone'
import {
  ForgeUIUploadedAsset,
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
  forgeUIDeleteUploadedAsset,
  forgeUIGetUploadedAssets,
  forgeUIUpdateUploadedAsset,
} from '../ForgeUIUploadedAssetRegistry'
import { forgeUIRuntime, forgeUIServiceUrl } from '../runtime/ForgeUIRuntime'

type ForgeUIAssetManagerProps = {
  onClose: () => void
  selectionRequest?: ForgeUIAssetSelectionRequest | null
  onSelectAssets?: (assetIds: string[]) => void
}

const forgeUIAssetStatusLabel = (
  status: ForgeUIUploadedAsset['exportStatus'],
) => {
  if (status === 'lvgl_ready') return 'LVGL Ready'
  if (status === 'pending_conversion') return 'Pending LVGL Conversion'
  return 'Browser Only'
}

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject

    reader.readAsDataURL(file)
  })

export function ForgeUIAssetManager({
  onClose,
  selectionRequest,
  onSelectAssets,
}: ForgeUIAssetManagerProps) {
  const { heroBackground } = useForgeTheme()
  const [assets, setAssets] = useState<ForgeUIUploadedAsset[]>(
    forgeUIGetUploadedAssets(),
  )
  const [selectedIds, setSelectedIds] = useState<string[]>(
    selectionRequest?.selectedAssetIds || [],
  )

  useEffect(() => {
    setSelectedIds(selectionRequest?.selectedAssetIds || [])
  }, [selectionRequest])

  useEffect(() => {
    const refreshAssets = () => {
      setAssets([...forgeUIGetUploadedAssets()])
    }

    window.addEventListener(
      'forgeui-assets-updated',
      refreshAssets,
    )

    return () => {
      window.removeEventListener(
        'forgeui-assets-updated',
        refreshAssets,
      )
    }
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
  const uploadedAssets: ForgeUIUploadedAsset[] = await Promise.all(
    acceptedFiles.map(async file => {
      const browserSrc = await fileToBase64(file)

      return forgeUICreateUploadedAsset(file, browserSrc)
    }),
  )

  setAssets(forgeUIAddUploadedAssets(uploadedAssets))

  for (const asset of uploadedAssets) {
    if (asset.exportStatus !== 'pending_conversion') continue

    try {
      const base64 = asset.browserSrc

      const res = await fetch(
        forgeUIServiceUrl(forgeUIRuntime.isHosted ? '/convert-image' : '/convert-lvgl-image'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: asset.name,
            symbolName: asset.lvgl,
            base64,
          }),
        },
      )

      const data = await res.json()

      if (!data.ok) {
        console.error('LVGL conversion failed:', data)

        alert(
          'LVGL conversion failed:\n\n' +
            (data.error || 'Unknown error') +
            '\n\n' +
            (data.log || data.detail || ''),
        )

        continue
      }

      setAssets(
  forgeUIUpdateUploadedAsset(asset.id, {
    exportStatus: 'lvgl_ready',
    lvgl: data.symbolName || asset.lvgl,
    cFile: data.assetSource || asset.cFile,
    browserSrc: data.browserSrc || asset.browserSrc,
    hostedContentBase64: data.contentBase64,
  }, { preserveDimensions: true }),
)
    } catch (err) {
      console.error('LVGL conversion error:', err)
    }
  }
}, [])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
    },
  })

  return (
    <Box
      position="fixed"
      inset="40px"
       bg="#10141c"
      overflowY="auto"
      color="white"
      border="1px solid #2dd4bf"
      borderRadius="12px"
      zIndex={9999}
      p={6}
      boxShadow="0 0 40px rgba(0,0,0,0.55)"
    >
      <HStack justify="space-between" mb={5}>
        <Text fontSize="22px" fontWeight="bold">
          {selectionRequest?.title || 'Asset Manager'}
        </Text>

        <Button size="sm" onClick={onClose}>
          Close
        </Button>
      </HStack>

      <Box
        {...getRootProps()}
        border="2px dashed #2dd4bf"
        borderRadius="12px"
        p={8}
        textAlign="center"
        cursor="pointer"
        bg={isDragActive ? '#123033' : '#0b0f16'}
      >
        <input {...getInputProps()} />

        <Text fontSize="16px" fontWeight="semibold">
          {isDragActive
            ? 'Drop assets here...'
            : 'Drag PNG, JPG, or SVG files here'}
        </Text>

        <Text fontSize="13px" opacity={0.7} mt={2}>
          Click to browse files
        </Text>
      </Box>

      <Box mt={6}>
        <Text fontSize="18px" fontWeight="bold" mb={3}>
          Assets
        </Text>

        {assets.length === 0 ? (
          <Text opacity={0.65}>No assets uploaded yet.</Text>
        ) : (
          <VStack align="stretch" spacing={2}>
            {[...assets].reverse().map((asset) => (
              <Box
                key={asset.id}
                bg="#0b0f16"
                border="1px solid #263241"
                borderRadius="8px"
                px={4}
                py={3}
              >
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    {selectionRequest && <Checkbox
                      aria-label={`Select ${asset.name}`}
                      isChecked={selectedIds.includes(asset.id)}
                      onChange={event => setSelectedIds(current => event.target.checked
                        ? [...current, asset.id]
                        : current.filter(id => id !== asset.id))}
                    />}
                    <Box
                      as="img"
                      src={asset.browserSrc}
                      alt={asset.name}
                      width="48px"
                      height="48px"
                      objectFit="contain"
                      bg="#05070a"
                      border="1px solid #263241"
                      borderRadius="6px"
                      p={1}
                    />

                    <Box>
                      <Text fontWeight="semibold">
                        {asset.name}
                      </Text>

                      <Text fontSize="12px" opacity={0.65}>
                        {asset.type || 'unknown'} • {asset.size} bytes
                      </Text>

                      <Text
                        fontSize="12px"
                        mt={1}
                        color="#2dd4bf"
                      >
                        {forgeUIAssetStatusLabel(asset.exportStatus)}
                      </Text>
                    </Box>
                  </HStack>

                  {!selectionRequest && <Button
                  size="sm"
                  colorScheme="red"
                  onClick={async () => {
                   const themeAsset = forgeUIGetUploadedAssets().find(
                     item => item.browserSrc === heroBackground,
                   )
                   const references = findUploadedAssetReferences(
                     asset.id,
                     getAllInteractiveAssets(),
                     themeAsset?.id,
                   )
                   if (references.length > 0) {
                     window.alert(formatAssetReferences(references))
                     return
                   }
                   const nextAssets =
                   await forgeUIDeleteUploadedAsset(asset.id)

                   setAssets([...nextAssets])
                 }}
                  >
                    Delete
                  </Button>}
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
      {selectionRequest && <HStack position="sticky" bottom={0} mt={5} py={3}
        justify="flex-end" bg="#10141c" borderTop="1px solid #263241">
        <Text mr="auto" fontSize="sm" opacity={0.75}>{selectedIds.length} frame{selectedIds.length === 1 ? '' : 's'} selected</Text>
        <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button size="sm" colorScheme="teal" onClick={() => onSelectAssets?.(selectedIds)}>Use Selected Frames</Button>
      </HStack>}
    </Box>
  )
}
