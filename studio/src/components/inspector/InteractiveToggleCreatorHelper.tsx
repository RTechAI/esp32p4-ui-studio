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
  getInteractiveToggleSwitchAsset,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
  openToggleCreator,
} from '~forgeui/ForgeUINavigation'

type InteractiveToggleCreatorHelperProps = {
  component: IComponent
}

const hasCompleteToggleSet = (
  component: IComponent,
): boolean => {
  if (component.type !== 'InteractiveToggleSwitch') {
    return true
  }

  const interactiveAssetId =
    component.props.interactiveAssetId
  const asset = interactiveAssetId
    ? getInteractiveToggleSwitchAsset(interactiveAssetId)
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

const InteractiveToggleCreatorHelper = ({
  component,
}: InteractiveToggleCreatorHelperProps) => {
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

  if (hasCompleteToggleSet(component)) {
    return null
  }

  return (
    <Box
      mx={3}
      mt={3}
      p={3}
      borderWidth="1px"
      borderColor="green.700"
      borderRadius="md"
      bg="green.900"
      color="gray.200"
      data-testid="toggle-creator-helper"
    >
      <VStack align="stretch" spacing={2}>
        <Text fontSize="sm" fontWeight="semibold">
          Toggle not configured
        </Text>
        <Text fontSize="xs" color="gray.400">
          This Toggle does not yet have a complete Toggle Set.
        </Text>
        <Button
          size="sm"
          colorScheme="green"
          variant="outline"
          alignSelf="flex-start"
          onClick={() =>
            openToggleCreator(
              component.id,
              component.props.interactiveAssetId,
            )
          }
        >
          Open Toggle Creator
        </Button>
      </VStack>
    </Box>
  )
}

export default InteractiveToggleCreatorHelper
