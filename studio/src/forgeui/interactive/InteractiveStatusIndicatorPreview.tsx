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
}

const InteractiveStatusIndicatorPreview = ({
  offAsset,
  onAsset,
  width,
  height,
  state,
  onStateChange,
  showControls = false,
}: Props) => {
  const previewAsset = state === 'on' ? onAsset : offAsset

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="120px"
      gap={3}
      data-testid="interactive-status-indicator-preview"
      data-state={state}
    >
      {previewAsset ? (
        <Image
          src={previewAsset.browserSrc}
          alt={previewAsset.name}
          width={`${width}px`}
          height={`${height}px`}
          objectFit="contain"
          draggable={false}
          userSelect="none"
          pointerEvents="none"
        />
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
