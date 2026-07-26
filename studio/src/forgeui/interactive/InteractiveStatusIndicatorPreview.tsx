import React from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Image,
  Text,
} from '@chakra-ui/react'

import type { ForgeUIUploadedAsset } from '~forgeui/ForgeUIUploadedAssetRegistry'
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
}: Props) => {
  const previewAsset = state === 'on' ? onAsset : offAsset

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={minimumHeight}
      gap={3}
      data-testid="interactive-status-indicator-preview"
      data-state={state}
      data-minimum-height={minimumHeight}
      onClick={onPreviewClick}
      cursor={onPreviewClick ? 'pointer' : undefined}
    >
      {previewAsset ? (
        <Box
          width={`${width}px`}
          height={`${height}px`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          data-testid="status-indicator-image-bounds"
        >
          <Image
            src={previewAsset.browserSrc}
            alt={previewAsset.name}
            width="auto"
            height="auto"
            maxWidth="100%"
            maxHeight="100%"
            objectFit="contain"
            draggable={false}
            userSelect="none"
            pointerEvents="none"
          />
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
