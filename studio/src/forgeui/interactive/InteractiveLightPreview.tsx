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
  fillContainer?: boolean
  preloadInactive?: boolean
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
  fillContainer = false,
  preloadInactive = false,
}: InteractiveLightPreviewProps) => {
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
      data-testid="interactive-light-preview"
      data-state={state}
      onClick={onPreviewClick}
      cursor={onPreviewClick ? 'pointer' : undefined}
    >
      {previewAsset ? (
        <>
          <Image
            src={previewAsset.browserSrc}
            alt={previewAsset.name}
            width={fillContainer ? undefined : `${width}px`}
            height={fillContainer ? undefined : `${height}px`}
            objectFit="contain"
            display="block"
            style={fillContainer ? {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            } : undefined}
            draggable={false}
            crossOrigin="anonymous"
            userSelect="none"
            pointerEvents="none"
            onLoad={event =>
              recordMeasurement(previewAsset, event.currentTarget)
            }
          />
          {preloadInactive &&
            inactiveAsset &&
            inactiveAsset.id !== previewAsset.id && (
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
        </>
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
