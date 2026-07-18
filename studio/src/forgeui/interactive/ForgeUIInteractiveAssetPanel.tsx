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

    const updated = updateInteractiveAsset(
      asset.id,
      {
        label: 'Updated Button',
      },
    )

    console.log(
      'Updated Asset:',
      updated,
    )

    console.log(
      'Retrieved:',
      getInteractiveAsset(asset.id),
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
          Registry validation in progress.
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
      </VStack>
    </Box>
  )
}

export default ForgeUIInteractiveAssetPanel