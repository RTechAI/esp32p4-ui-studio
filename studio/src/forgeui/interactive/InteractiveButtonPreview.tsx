import React, { useState } from 'react'
import {
  Box,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react'

import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import UnconfiguredButtonIcon from './UnconfiguredButtonIcon'

type InteractiveButtonPreviewProps = {
  normalAsset?: ForgeUIUploadedAsset
  pressedAsset?: ForgeUIUploadedAsset
  width: number
  height: number
}

const InteractiveButtonPreview = ({
  normalAsset,
  pressedAsset,
  width,
  height,
}: InteractiveButtonPreviewProps) => {
  const [
    isPreviewPressed,
    setIsPreviewPressed,
  ] = useState(false)

  const previewAsset =
    isPreviewPressed && pressedAsset
      ? pressedAsset
      : normalAsset

  const hasBothVisuals =
    Boolean(normalAsset) &&
    Boolean(pressedAsset)
  const compact = width < 160 || height < 64
  const iconWidth = Math.round(width * 0.84)
  const iconHeight = Math.round(height * 0.86)

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={Math.min(height, 180)}
      color="inherit"
    >
      {hasBothVisuals && previewAsset ? (
        <Image
          src={previewAsset.browserSrc}
          alt={previewAsset.name}
          width={`${width}px`}
          height={`${height}px`}
          objectFit="contain"
          cursor="pointer"
          draggable={false}
          userSelect="none"
          onMouseDown={() =>
            setIsPreviewPressed(true)
          }
          onMouseUp={() =>
            setIsPreviewPressed(false)
          }
          onMouseLeave={() =>
            setIsPreviewPressed(false)
          }
        />
      ) : (
        <VStack
          data-testid="unconfigured-button-placeholder"
          data-layout={compact ? 'compact' : 'full'}
          spacing={compact ? 0 : 2}
          maxWidth="100%"
          overflow="hidden"
          pointerEvents="none"
        >
          <UnconfiguredButtonIcon
            width={iconWidth}
            height={iconHeight}
          />
          {!compact && (
            <HStack
              spacing={4}
              color="gray.300"
              fontSize="xs"
              whiteSpace="nowrap"
            >
              <Text>Normal</Text>
              <Text color="#67E8F9">Pressed</Text>
            </HStack>
          )}
        </VStack>
      )}
    </Box>
  )
}

export default InteractiveButtonPreview
