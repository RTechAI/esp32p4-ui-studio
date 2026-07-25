import React from 'react'
import {
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import type {
  ForgeUIInteractiveThreePositionState,
} from './ForgeUIInteractiveThreePositionToggleAsset'

const UnconfiguredThreePositionTogglePlaceholder = ({
  width,
  height,
  state,
}: {
  width: number
  height: number
  state: ForgeUIInteractiveThreePositionState
}) => {
  const compact = width < 160 || height < 64
  const iconWidth = Math.round(width * 0.86)
  const iconHeight = Math.round(height * 0.88)
  const activeX = state === 'left'
    ? 22
    : state === 'right' ? 78 : 50

  return (
    <VStack
      data-testid="unconfigured-three-position-placeholder"
      data-layout={compact ? 'compact' : 'full'}
      spacing={compact ? 0 : 2}
      maxWidth="100%"
      overflow="hidden"
      pointerEvents="none"
    >
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 100 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        data-testid="unconfigured-three-position-icon"
        style={{
          display: 'block',
          pointerEvents: 'none',
          width: `${iconWidth}px`,
          height: `${iconHeight}px`,
          minWidth: `${iconWidth}px`,
          minHeight: `${iconHeight}px`,
          maxWidth: 'none',
          maxHeight: 'none',
          flexShrink: 0,
        }}
      >
        <rect x="5" y="8" width="86" height="28" rx="9" stroke="currentColor" strokeWidth="2.8" />
        <path d="M35 9V35M63 9V35" stroke="currentColor" strokeWidth="1.8" opacity="0.62" />
        <circle cx={activeX} cy="22" r="7" fill="#78B98C" />
        <circle cx="22" cy="22" r="7" stroke="currentColor" strokeWidth="1.6" opacity={state === 'left' ? 0 : 0.7} />
        <circle cx="50" cy="22" r="7" stroke="currentColor" strokeWidth="1.6" opacity={state === 'center' ? 0 : 0.7} />
        <circle cx="78" cy="22" r="7" stroke="currentColor" strokeWidth="1.6" opacity={state === 'right' ? 0 : 0.7} />
        <path d="M94 2V9M90.5 5.5H97.5" stroke="#67E8F9" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {!compact && (
        <HStack spacing={4} color="gray.300" fontSize="xs" whiteSpace="nowrap">
          <Text>LEFT</Text>
          <Text color={state === 'center' ? '#78B98C' : undefined}>CENTER</Text>
          <Text>RIGHT</Text>
        </HStack>
      )}
    </VStack>
  )
}

export default UnconfiguredThreePositionTogglePlaceholder
