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
  getInteractiveButtonAsset,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
  openButtonCreator,
} from '~forgeui/ForgeUINavigation'

const hasCompleteButton = (
  component: IComponent,
): boolean => {
  if (component.type !== 'InteractiveButton') {
    return true
  }

  const interactiveAssetId =
    component.props.interactiveAssetId
  const asset = interactiveAssetId
    ? getInteractiveButtonAsset(interactiveAssetId)
    : undefined

  if (!asset?.normalAssetId || !asset.pressedAssetId) {
    return false
  }

  const uploadedAssetIds = new Set(
    forgeUIGetUploadedAssets().map(item => item.id),
  )
  return (
    uploadedAssetIds.has(asset.normalAssetId) &&
    uploadedAssetIds.has(asset.pressedAssetId)
  )
}

const InteractiveButtonCreatorHelper = ({
  component,
}: {
  component: IComponent
}) => {
  const [, refresh] = useState(0)

  useEffect(() => {
    const refreshCompleteness = () =>
      refresh(version => version + 1)
    window.addEventListener(
      'forgeui-assets-updated',
      refreshCompleteness,
    )
    window.addEventListener(
      FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      refreshCompleteness,
    )
    return () => {
      window.removeEventListener(
        'forgeui-assets-updated',
        refreshCompleteness,
      )
      window.removeEventListener(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
        refreshCompleteness,
      )
    }
  }, [])

  if (hasCompleteButton(component)) {
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
      data-testid="button-creator-helper"
    >
      <VStack align="stretch" spacing={2}>
        <Text fontSize="sm" fontWeight="semibold">
          Button not configured
        </Text>
        <Text fontSize="xs" color="gray.400">
          This Button does not yet have both Normal and Pressed visuals.
        </Text>
        <Button
          size="sm"
          colorScheme="cyan"
          variant="outline"
          alignSelf="flex-start"
          onClick={() =>
            openButtonCreator(
              component.id,
              component.props.interactiveAssetId,
            )
          }
        >
          Open Button Creator
        </Button>
      </VStack>
    </Box>
  )
}

export default InteractiveButtonCreatorHelper
