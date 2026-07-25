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
  getInteractiveThreePositionToggleAsset,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
  openThreePositionToggleCreator,
} from '~forgeui/ForgeUINavigation'

const hasCompleteThreePositionToggle = (
  component: IComponent,
): boolean => {
  if (
    component.type !==
    'InteractiveThreePositionToggleSwitch'
  ) {
    return true
  }

  const interactiveAssetId = component.props.interactiveAssetId
  const asset = interactiveAssetId
    ? getInteractiveThreePositionToggleAsset(interactiveAssetId)
    : undefined
  if (
    !asset?.leftAssetId ||
    !asset.centerAssetId ||
    !asset.rightAssetId
  ) {
    return false
  }

  const uploadedAssetIds = new Set(
    forgeUIGetUploadedAssets().map(item => item.id),
  )
  return (
    uploadedAssetIds.has(asset.leftAssetId) &&
    uploadedAssetIds.has(asset.centerAssetId) &&
    uploadedAssetIds.has(asset.rightAssetId)
  )
}

const InteractiveThreePositionToggleCreatorHelper = ({
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

  if (hasCompleteThreePositionToggle(component)) {
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
      data-testid="three-position-toggle-creator-helper"
    >
      <VStack align="stretch" spacing={2}>
        <Text fontSize="sm" fontWeight="semibold">
          Three-Position Toggle not configured
        </Text>
        <Text fontSize="xs" color="gray.400">
          This Toggle needs LEFT, CENTER, and RIGHT visuals.
        </Text>
        <Button
          size="sm"
          colorScheme="cyan"
          variant="outline"
          alignSelf="flex-start"
          onClick={() =>
            openThreePositionToggleCreator(
              component.id,
              component.props.interactiveAssetId,
            )
          }
        >
          Open Three-Position Toggle Creator
        </Button>
      </VStack>
    </Box>
  )
}

export default InteractiveThreePositionToggleCreatorHelper
