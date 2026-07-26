import React, { useEffect, useState } from 'react'
import { Box, Button, Text, VStack } from '@chakra-ui/react'
import { getInteractiveStatusIndicatorAsset } from '~forgeui/interactive'
import { forgeUIGetUploadedAssets } from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
  openStatusIndicatorCreator,
} from '~forgeui/ForgeUINavigation'

export const hasCompleteStatusIndicator = (
  component: IComponent,
): boolean => {
  if (component.type !== 'InteractiveStatusIndicator') return true
  const asset = component.props.interactiveAssetId
    ? getInteractiveStatusIndicatorAsset(component.props.interactiveAssetId)
    : undefined
  if (!asset?.offAssetId || !asset.onAssetId) return false
  const uploadedIds = new Set(
    forgeUIGetUploadedAssets().map(item => item.id),
  )
  return uploadedIds.has(asset.offAssetId) &&
    uploadedIds.has(asset.onAssetId)
}

const InteractiveStatusIndicatorCreatorHelper = ({
  component,
}: {
  component: IComponent
}) => {
  const [, refresh] = useState(0)
  useEffect(() => {
    const update = () => refresh(value => value + 1)
    window.addEventListener('forgeui-assets-updated', update)
    window.addEventListener(
      FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      update,
    )
    return () => {
      window.removeEventListener('forgeui-assets-updated', update)
      window.removeEventListener(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
        update,
      )
    }
  }, [])

  if (hasCompleteStatusIndicator(component)) return null
  return (
    <Box
      mx={3}
      mt={3}
      p={3}
      borderWidth="1px"
      borderColor="cyan.700"
      borderRadius="md"
      bg="cyan.900"
      color="gray.200"
      data-testid="status-indicator-creator-helper"
    >
      <VStack align="stretch" spacing={2}>
        <Text fontSize="sm" fontWeight="semibold">
          Status Indicator not configured
        </Text>
        <Text fontSize="xs" color="gray.400">
          This Status Indicator does not yet have both OFF and ON visuals.
        </Text>
        <Button
          size="sm"
          colorScheme="cyan"
          variant="outline"
          alignSelf="flex-start"
          onClick={() => openStatusIndicatorCreator(
            component.id,
            component.props.interactiveAssetId,
          )}
        >
          Open Status Indicator Creator
        </Button>
      </VStack>
    </Box>
  )
}

export default InteractiveStatusIndicatorCreatorHelper
