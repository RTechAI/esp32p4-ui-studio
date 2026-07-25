import React from 'react'
import {
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'

const UnconfiguredLightPlaceholder = ({
  width,
  height,
}: {
  width: number
  height: number
}) => {
  const compact = width < 120 || height < 72
  const iconWidth = Math.round(width * 0.84)
  const iconHeight = Math.round(height * 0.88)

  return (
    <VStack
      data-testid="unconfigured-light-placeholder"
      data-layout={compact ? 'compact' : 'full'}
      spacing={compact ? 0 : 2}
      maxWidth="100%"
      overflow="hidden"
      pointerEvents="none"
    >
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        data-testid="unconfigured-light-icon"
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
        <circle cx="22" cy="21" r="14" stroke="currentColor" strokeWidth="2.8" />
        <path d="M15 34H29M17 39H27" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="22" cy="21" r="6" fill="#78B98C" />
        <path d="M39 3V11M35 7H43" stroke="#67E8F9" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M43 14V18M41 16H45" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
      </svg>
      {!compact && (
        <HStack spacing={4} color="gray.300" fontSize="xs" whiteSpace="nowrap">
          <Text>OFF</Text>
          <Text color="#78B98C">ON</Text>
        </HStack>
      )}
    </VStack>
  )
}

export default UnconfiguredLightPlaceholder
