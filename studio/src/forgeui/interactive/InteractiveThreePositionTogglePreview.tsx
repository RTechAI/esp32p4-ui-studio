import React from 'react'
import { Box, Image, Text } from '@chakra-ui/react'
import type { ForgeUIUploadedAsset } from '~forgeui/ForgeUIUploadedAssetRegistry'
import type { ForgeUIInteractiveThreePositionState } from './ForgeUIInteractiveThreePositionToggleAsset'

type Props = {
  leftAsset?: ForgeUIUploadedAsset
  centerAsset?: ForgeUIUploadedAsset
  rightAsset?: ForgeUIUploadedAsset
  width: number
  height: number
  state: ForgeUIInteractiveThreePositionState
  onStateChange?: (state: ForgeUIInteractiveThreePositionState) => void
  showZoneOverlay?: boolean
}

export const stateFromThreePositionClientX = (clientX: number, left: number, width: number): ForgeUIInteractiveThreePositionState | undefined => {
  if (!Number.isFinite(width) || width <= 0) return undefined
  const localX = clientX - left
  if (localX < 0 || localX >= width) return undefined
  return localX < width / 3 ? 'left' : localX < (width * 2) / 3 ? 'center' : 'right'
}

const InteractiveThreePositionTogglePreview = ({ leftAsset, centerAsset, rightAsset, width, height, state, onStateChange, showZoneOverlay = false }: Props) => {
  const selected = state === 'left' ? leftAsset : state === 'right' ? rightAsset : centerAsset
  return <Box
    data-testid="three-position-preview"
    position="relative"
    width={`${width}px`}
    height={`${height}px`}
    cursor={onStateChange ? 'pointer' : 'default'}
    overflow="hidden"
    onClick={event => {
      const bounds = event.currentTarget.getBoundingClientRect()
      const nextState = stateFromThreePositionClientX(event.clientX, bounds.left, bounds.width)
      if (nextState) onStateChange?.(nextState)
    }}
  >
    {selected?.browserSrc
      ? <Image src={selected.browserSrc} alt={`${state} artwork`} width="100%" height="100%" objectFit="fill" pointerEvents="none" />
      : <Box
          data-testid="three-position-missing-artwork"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.500" fontSize="xs">Missing {state.toUpperCase()} artwork</Text>
        </Box>}
    {showZoneOverlay && <Box
      data-testid="three-position-zone-overlay"
      position="absolute"
      inset={0}
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      pointerEvents="none"
    >
      {(['LEFT', 'CENTER', 'RIGHT'] as const).map((label, index) => <Box
        key={label}
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        pb="2px"
        borderLeft={index ? '1px dashed rgba(255,255,255,0.7)' : undefined}
        bg={state.toUpperCase() === label ? 'whiteAlpha.200' : undefined}
        color="white"
        fontSize="9px"
        fontWeight="bold"
        textShadow="0 1px 2px black"
      >{label}</Box>)}
    </Box>}
  </Box>
}

export default InteractiveThreePositionTogglePreview
