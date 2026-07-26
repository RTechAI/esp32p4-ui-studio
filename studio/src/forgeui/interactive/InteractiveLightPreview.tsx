import React from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Image,
  Text,
} from '@chakra-ui/react'

import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  forgeUIRecordRenderedImageMetadata,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIInteractiveLightState,
} from './ForgeUIInteractiveLightAsset'

type InteractiveLightPreviewProps = {
  offAsset?: ForgeUIUploadedAsset
  onAsset?: ForgeUIUploadedAsset
  width: number
  height: number
  state: ForgeUIInteractiveLightState
  onStateChange?: (state: ForgeUIInteractiveLightState) => void
  showControls?: boolean
  onPreviewClick?: React.MouseEventHandler<HTMLDivElement>
  missingVisual?: React.ReactNode
  minimumHeight?: number | string
}

const InteractiveLightPreview = ({
  offAsset,
  onAsset,
  width,
  height,
  state,
  onStateChange,
  showControls = false,
  onPreviewClick,
  missingVisual,
  minimumHeight = 120,
}: InteractiveLightPreviewProps) => {
  const previewAsset = state === 'on' ? onAsset : offAsset

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={minimumHeight}
      gap={3}
      data-testid="interactive-light-preview"
      data-state={state}
      onClick={onPreviewClick}
      cursor={onPreviewClick ? 'pointer' : undefined}
    >
      {previewAsset ? (
        <Image
          src={previewAsset.browserSrc}
          alt={previewAsset.name}
          width={`${width}px`}
          height={`${height}px`}
          objectFit="contain"
          draggable={false}
          crossOrigin="anonymous"
          userSelect="none"
          pointerEvents="none"
          onLoad={event => {
            const image = event.currentTarget
            if (
              image.naturalWidth > 0 &&
              image.naturalHeight > 0 &&
              (
                previewAsset.width !== image.naturalWidth ||
                previewAsset.height !== image.naturalHeight ||
                !previewAsset.contentWidth ||
                !previewAsset.contentHeight
              )
            ) {
              forgeUIRecordRenderedImageMetadata(
                previewAsset,
                image,
              )
            }
          }}
        />
      ) : missingVisual ? (
        <Box pointerEvents="none">
          {missingVisual}
        </Box>
      ) : (
        <Text
          color="gray.500"
          fontSize="sm"
          pointerEvents="none"
        >
          Missing {state.toUpperCase()} visual
        </Text>
      )}

      {showControls && onStateChange && (
        <ButtonGroup size="xs" isAttached>
          <Button
            colorScheme={state === 'off' ? 'blue' : 'gray'}
            onClick={() => onStateChange('off')}
          >
            Preview OFF
          </Button>
          <Button
            colorScheme={state === 'on' ? 'green' : 'gray'}
            onClick={() => onStateChange('on')}
          >
            Preview ON
          </Button>
        </ButtonGroup>
      )}
    </Box>
  )
}

export default InteractiveLightPreview
