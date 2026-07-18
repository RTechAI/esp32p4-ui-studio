import React from 'react'
import {
  Badge,
  Box,
  Button,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'

import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  createInteractiveAssetId,
  getAllInteractiveAssets,
  getInteractiveAsset,
  registerInteractiveAsset,
  removeInteractiveAsset,
  reloadInteractiveAssets,
  saveInteractiveAssets,
  updateInteractiveAsset,
} from '~forgeui/interactive'

const ForgeUIInteractiveAssetPanel = () => {
  const runRegistryTest = () => {
    console.clear()

    clearInteractiveAssetRegistry()

    const asset =
      createDefaultInteractiveButtonAsset(
        createInteractiveAssetId(),
        'Registry Test Button',
      )

    registerInteractiveAsset(asset)

    saveInteractiveAssets()

    console.log(
      'Registry after register:',
      getAllInteractiveAssets(),
    )
  }

  const runUpdateTest = () => {
    const assets = getAllInteractiveAssets()

    if (assets.length === 0) {
      console.warn(
        'No Interactive Assets registered.',
      )
      return
    }

    const asset = assets[0]

    const updated =
      updateInteractiveAsset(asset.id, {
        label: 'Updated Button',
      })

    saveInteractiveAssets()

    console.log(
      'Updated Asset:',
      updated,
    )

    console.log(
      'Retrieved:',
      getInteractiveAsset(asset.id),
    )
  }

  const runRemoveTest = () => {
    const assets = getAllInteractiveAssets()

    if (assets.length === 0) {
      console.warn(
        'No Interactive Assets registered.',
      )
      return
    }

    const asset = assets[0]

    const removed =
      removeInteractiveAsset(asset.id)

    saveInteractiveAssets()

    console.log(
      'Removed:',
      removed,
    )

    console.log(
      'Registry after remove:',
      getAllInteractiveAssets(),
    )
  }

  const runReloadTest = () => {
    clearInteractiveAssetRegistry()

    reloadInteractiveAssets()

    console.log(
      'Reloaded Assets:',
      getAllInteractiveAssets(),
    )
  }

  return (
    <Box
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      borderRadius="lg"
      bg="whiteAlpha.50"
      p={5}
    >
      <VStack
        align="stretch"
        spacing={3}
      >
        <Badge
          alignSelf="flex-start"
          colorScheme="blue"
        >
          Phase 2
        </Badge>

        <Heading size="sm">
          Interactive Assets
        </Heading>

        <Text
          color="gray.400"
          fontSize="sm"
        >
          Interactive Asset Registry validation.
        </Text>

        <Text
          color="gray.500"
          fontSize="xs"
        >
          Temporary registry test tools.
          These will be removed after Phase 2 is proven.
        </Text>

        <Button
          size="sm"
          colorScheme="blue"
          onClick={runRegistryTest}
        >
          Test Registry
        </Button>

        <Button
          size="sm"
          colorScheme="green"
          onClick={runUpdateTest}
        >
          Test Update
        </Button>

        <Button
          size="sm"
          colorScheme="red"
          onClick={runRemoveTest}
        >
          Test Remove
        </Button>

        <Button
          size="sm"
          colorScheme="purple"
          onClick={runReloadTest}
        >
          Test Reload
        </Button>
      </VStack>
    </Box>
  )
}

export default ForgeUIInteractiveAssetPanel