import React from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Image,
  Text,
} from '@chakra-ui/react'

import type { ForgeUIUploadedAsset } from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  forgeUIRecordRenderedImageMetadata,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type { ForgeUIInteractiveStatusIndicatorState } from './ForgeUIInteractiveStatusIndicatorAsset'

type Props = {
  offAsset?: ForgeUIUploadedAsset
  onAsset?: ForgeUIUploadedAsset
  width: number
  height: number
  state: ForgeUIInteractiveStatusIndicatorState
  onStateChange?: (state: ForgeUIInteractiveStatusIndicatorState) => void
  showControls?: boolean
  missingVisual?: React.ReactNode
  minimumHeight?: number | string
  onPreviewClick?: React.MouseEventHandler<HTMLDivElement>
  fillContainer?: boolean
}

const InteractiveStatusIndicatorPreview = ({
  offAsset,
  onAsset,
  width,
  height,
  state,
  onStateChange,
  showControls = false,
  missingVisual,
  minimumHeight = 120,
  onPreviewClick,
  fillContainer = false,
}: Props) => {
  const previewAsset = state === 'on' ? onAsset : offAsset
  const inactiveAsset = state === 'on' ? offAsset : onAsset
  const recordMeasurement = (
    asset: ForgeUIUploadedAsset,
    image: HTMLImageElement,
  ) => {
    if (
      image.naturalWidth > 0 &&
      image.naturalHeight > 0 &&
      (
        asset.width !== image.naturalWidth ||
        asset.height !== image.naturalHeight ||
        !asset.contentWidth ||
        !asset.contentHeight
      )
    ) {
      forgeUIRecordRenderedImageMetadata(asset, image)
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width={fillContainer ? '100%' : undefined}
      height={fillContainer ? '100%' : undefined}
      minHeight={fillContainer ? 0 : minimumHeight}
      gap={fillContainer ? 0 : 3}
      data-testid="interactive-status-indicator-preview"
      data-state={state}
      data-minimum-height={minimumHeight}
      onClick={onPreviewClick}
      cursor={onPreviewClick ? 'pointer' : undefined}
    >
      {previewAsset ? (
        <Box
          width={fillContainer ? '100%' : `${width}px`}
          height={fillContainer ? '100%' : `${height}px`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          data-testid="status-indicator-image-bounds"
        >
          <Image
            src={previewAsset.browserSrc}
            alt={previewAsset.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
            draggable={false}
            userSelect="none"
            pointerEvents="none"
            crossOrigin="anonymous"
            onLoad={event =>
              recordMeasurement(
                previewAsset,
                event.currentTarget,
              )
            }
          />
          {inactiveAsset && inactiveAsset.id !== previewAsset.id && (
            <Image
              display="none"
              src={inactiveAsset.browserSrc}
              alt=""
              aria-hidden="true"
              crossOrigin="anonymous"
              onLoad={event =>
                recordMeasurement(
                  inactiveAsset,
                  event.currentTarget,
                )
              }
            />
          )}
        </Box>
      ) : missingVisual ? (
        missingVisual
      ) : (
        <Text color="gray.500" fontSize="sm">
          Missing {state.toUpperCase()} visual
        </Text>
      )}
      {showControls && onStateChange && (
        <ButtonGroup size="xs" isAttached>
          <Button colorScheme={state === 'off' ? 'blue' : 'gray'} onClick={() => onStateChange('off')}>
            Preview OFF
          </Button>
          <Button colorScheme={state === 'on' ? 'green' : 'gray'} onClick={() => onStateChange('on')}>
            Preview ON
          </Button>
        </ButtonGroup>
      )}
    </Box>
  )
}

export default InteractiveStatusIndicatorPreview
