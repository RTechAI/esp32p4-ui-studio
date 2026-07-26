import React from 'react'
import { HStack, Text, VStack } from '@chakra-ui/react'

const UnconfiguredStatusIndicatorPlaceholder = ({
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
      data-testid="unconfigured-status-indicator-placeholder"
      data-layout={compact ? 'compact' : 'full'}
      spacing={compact ? 0 : 2}
      maxWidth="100%"
      overflow="hidden"
      pointerEvents="none"
    >
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 92 48"
        fill="none"
        aria-hidden="true"
        data-testid="unconfigured-status-indicator-icon"
        style={{
          display: 'block',
          width: `${iconWidth}px`,
          height: `${iconHeight}px`,
          minWidth: `${iconWidth}px`,
          minHeight: `${iconHeight}px`,
          maxWidth: 'none',
          maxHeight: 'none',
          flexShrink: 0,
        }}
      >
        <path d="M10 24H31M61 24H82" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="22" cy="24" r="11" stroke="currentColor" strokeWidth="2.8" />
        <circle cx="70" cy="24" r="11" stroke="#67E8F9" strokeWidth="2.8" />
        <circle cx="70" cy="24" r="5.5" fill="#78B98C" />
        <path d="M38 18L45 24L38 30M47 18L54 24L47 30" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.72" />
      </svg>
      {!compact && (
        <HStack spacing={8} color="gray.300" fontSize="xs" whiteSpace="nowrap">
          <Text>OFF</Text>
          <Text color="#78B98C">ON</Text>
        </HStack>
      )}
      {!compact && (
        <Text color="gray.400" fontSize="10px" letterSpacing="wide">
          BINARY OUTPUT
        </Text>
      )}
    </VStack>
  )
}

export default UnconfiguredStatusIndicatorPlaceholder
