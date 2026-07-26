import React from 'react'
import {
  Box,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import InteractiveLightPreview from './InteractiveLightPreview'
import UnconfiguredToggleIcon from './UnconfiguredToggleIcon'
import type { ForgeUIUploadedAsset } from '~forgeui/ForgeUIUploadedAssetRegistry'
import type { ForgeUIInteractiveToggleSwitchState } from './ForgeUIInteractiveToggleSwitchAsset'

type Props = {
  offAsset?: ForgeUIUploadedAsset
  onAsset?: ForgeUIUploadedAsset
  width: number
  height: number
  state: ForgeUIInteractiveToggleSwitchState
  onStateChange?: (state: ForgeUIInteractiveToggleSwitchState) => void
  showControls?: boolean
  onPreviewClick?: React.MouseEventHandler<HTMLDivElement>
  fillContainer?: boolean
}

const InteractiveToggleSwitchPreview = (props: Props) => {
  const compact = props.width < 120 || props.height < 72
  const iconSize = Math.max(
      48,
      Math.min(196, props.width * 0.68, props.height * 0.98),
    )
  const compactIconWidth = Math.round(props.width * 0.84)
  const compactIconHeight = Math.round(props.height * 0.9)

  const missingVisual = (
    <VStack
      data-testid="unconfigured-toggle-placeholder"
      data-layout={compact ? 'compact' : 'full'}
      spacing={compact ? 0 : 2}
      color="inherit"
      opacity={1}
      maxWidth="100%"
      overflow="hidden"
      pointerEvents="none"
    >
      <UnconfiguredToggleIcon
        {...(compact
          ? {
            width: compactIconWidth,
            height: compactIconHeight,
          }
          : { size: iconSize })}
      />
      {!compact && (
        <HStack
          spacing={4}
          color="gray.500"
          fontSize="xs"
          whiteSpace="nowrap"
        >
          <Text>L Preview</Text>
          <Box color="#78B98C">R Creator</Box>
        </HStack>
      )}
    </VStack>
  )

  return (
    <InteractiveLightPreview
      {...props}
      minimumHeight={Math.min(props.height, 120)}
      missingVisual={missingVisual}
      preloadInactive
    />
  )
}

export default InteractiveToggleSwitchPreview
