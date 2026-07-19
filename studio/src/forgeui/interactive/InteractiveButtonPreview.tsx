import React, { useState } from 'react'
import {
  Box,
  Image,
  Text,
} from '@chakra-ui/react'

import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

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

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="180px"
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
        <Text
          color="gray.500"
          fontSize="sm"
        >
          Select both Normal and Pressed visuals
          to preview the button.
        </Text>
      )}
    </Box>
  )
}

export default InteractiveButtonPreview