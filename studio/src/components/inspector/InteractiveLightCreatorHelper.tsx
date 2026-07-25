import React, {
  useEffect,
  useState,
} from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react'

import {
  getInteractiveLightAsset,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
  openLightCreator,
} from '~forgeui/ForgeUINavigation'

const hasCompleteLight = (
  component: IComponent,
): boolean => {
  if (component.type !== 'InteractiveLight') {
    return true
  }

  const interactiveAssetId = component.props.interactiveAssetId
  const asset = interactiveAssetId
    ? getInteractiveLightAsset(interactiveAssetId)
    : undefined
  if (!asset?.offAssetId || !asset.onAssetId) {
    return false
  }

  const uploadedAssetIds = new Set(
    forgeUIGetUploadedAssets().map(item => item.id),
  )
  return (
    uploadedAssetIds.has(asset.offAssetId) &&
    uploadedAssetIds.has(asset.onAssetId)
  )
}

const InteractiveLightCreatorHelper = ({
  component,
}: {
  component: IComponent
}) => {
  const [, refresh] = useState(0)

  useEffect(() => {
    const refreshCompleteness = () =>
      refresh(version => version + 1)
    window.addEventListener('forgeui-assets-updated', refreshCompleteness)
    window.addEventListener(
      FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      refreshCompleteness,
    )
    return () => {
      window.removeEventListener('forgeui-assets-updated', refreshCompleteness)
      window.removeEventListener(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
        refreshCompleteness,
      )
    }
  }, [])

  if (hasCompleteLight(component)) {
    return null
  }

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
      data-testid="light-creator-helper"
    >
      <VStack align="stretch" spacing={2}>
        <Text fontSize="sm" fontWeight="semibold">
          Light not configured
        </Text>
        <Text fontSize="xs" color="gray.400">
          This Light does not yet have both OFF and ON visuals.
        </Text>
        <Button
          size="sm"
          colorScheme="cyan"
          variant="outline"
          alignSelf="flex-start"
          onClick={() =>
            openLightCreator(
              component.id,
              component.props.interactiveAssetId,
            )
          }
        >
          Open Light Creator
        </Button>
      </VStack>
    </Box>
  )
}

export default InteractiveLightCreatorHelper
