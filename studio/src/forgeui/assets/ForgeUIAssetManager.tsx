import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import {
  ForgeUIUploadedAsset,
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
  forgeUIDeleteUploadedAsset,
  forgeUIGetUploadedAssets,
  forgeUIUpdateUploadedAsset,
} from '../ForgeUIUploadedAssetRegistry'

type ForgeUIAssetManagerProps = {
  onClose: () => void
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
}: ForgeUIAssetManagerProps) {
  const [assets, setAssets] = useState<ForgeUIUploadedAsset[]>(
    forgeUIGetUploadedAssets(),
  )

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
        'http://localhost:3030/convert-lvgl-image',
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
  }),
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
          Asset Manager
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

                  <Button
                  size="sm"
                  colorScheme="red"
                  onClick={async () => {
                   const nextAssets =
                   await forgeUIDeleteUploadedAsset(asset.id)

                   setAssets([...nextAssets])
                 }}
                  >
                    Delete
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  )
}