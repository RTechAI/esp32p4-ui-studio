import React, {
  useEffect,
  useState,
} from 'react'
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'

import {
  createDefaultInteractiveButtonAsset,
  createInteractiveAssetId,
  getAllInteractiveAssets,
  registerInteractiveAsset,
  reloadInteractiveAssets,
  removeInteractiveAsset,
  saveInteractiveAssets,
  updateInteractiveAsset,
} from '~forgeui/interactive'

import type {
  ForgeUIInteractiveAsset,
} from './ForgeUIInteractiveAsset'

const DEFAULT_WIDTH = 120
const DEFAULT_HEIGHT = 48

const ForgeUIInteractiveAssetPanel = () => {
  const [assets, setAssets] = useState<
    ForgeUIInteractiveAsset[]
  >([])

   const [isCreatingButton, setIsCreatingButton] =
    useState(false)

  const [editingAssetId, setEditingAssetId] =
    useState<
      ForgeUIInteractiveAsset['id'] | null
    >(null)

  const [assetName, setAssetName] =
    useState('New Interactive Button')

  const [buttonLabel, setButtonLabel] =
    useState('Button')

  const [buttonWidth, setButtonWidth] =
    useState(DEFAULT_WIDTH)

  const [buttonHeight, setButtonHeight] =
    useState(DEFAULT_HEIGHT)

  const refreshAssets = () => {
    setAssets(getAllInteractiveAssets())
  }

  useEffect(() => {
    reloadInteractiveAssets()
    refreshAssets()
  }, [])

  const resetDesigner = () => {
    setAssetName('New Interactive Button')
    setButtonLabel('Button')
    setButtonWidth(DEFAULT_WIDTH)
    setButtonHeight(DEFAULT_HEIGHT)
  }

  const openInteractiveButtonDesigner = () => {
    resetDesigner()
    setEditingAssetId(null)
    setIsCreatingButton(true)
  }

  const editInteractiveButton = (
    asset: ForgeUIInteractiveAsset,
  ) => {
    setAssetName(asset.name)
    setButtonLabel(asset.label)
    setButtonWidth(asset.width)
    setButtonHeight(asset.height)
    setEditingAssetId(asset.id)
    setIsCreatingButton(true)
  }

  const closeInteractiveButtonDesigner = () => {
    resetDesigner()
    setEditingAssetId(null)
    setIsCreatingButton(false)
  }

  const saveInteractiveButton = () => {
    const trimmedName = assetName.trim()
    const trimmedLabel = buttonLabel.trim()

    if (!trimmedName || !trimmedLabel) {
      return
    }

    if (editingAssetId) {
      updateInteractiveAsset(editingAssetId, {
        name: trimmedName,
        label: trimmedLabel,
        width: buttonWidth,
        height: buttonHeight,
      })
    } else {
      const asset =
        createDefaultInteractiveButtonAsset(
          createInteractiveAssetId(),
          trimmedName,
        )

      const completedAsset = {
        ...asset,
        label: trimmedLabel,
        width: buttonWidth,
        height: buttonHeight,
      }

      registerInteractiveAsset(completedAsset)
    }

    saveInteractiveAssets()
    refreshAssets()
    closeInteractiveButtonDesigner()
  }

const deleteInteractiveAsset = (
  assetId: ForgeUIInteractiveAsset['id'],
) => {
  removeInteractiveAsset(assetId)
  saveInteractiveAssets()
  refreshAssets()
}

const canSave =
  assetName.trim().length > 0 &&
  buttonLabel.trim().length > 0 &&
  buttonWidth > 0 &&
  buttonHeight > 0

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
        spacing={5}
      >
        <HStack
          justify="space-between"
          align="flex-start"
          spacing={4}
        >
          <Box>
            <Badge
              colorScheme="blue"
              mb={2}
            >
              Phase 3
            </Badge>

            <Heading size="sm">
              Interactive Assets
            </Heading>

            <Text
              color="gray.400"
              fontSize="sm"
              mt={1}
            >
              Reusable interactive controls with
              multiple visual states.
            </Text>
          </Box>

          <Button
            size="sm"
            colorScheme="blue"
            onClick={
              openInteractiveButtonDesigner
            }
          >
            + New Interactive Button
          </Button>
        </HStack>

        {isCreatingButton && (
          <Box
            borderWidth="1px"
            borderColor="blue.400"
            borderRadius="md"
            bg="blackAlpha.300"
            p={5}
          >
            <VStack
              align="stretch"
              spacing={5}
            >
              <Box>
                <Heading size="sm">
                {editingAssetId
                  ? 'Edit Interactive Button'
                  : 'Interactive Button Designer'}
                </Heading>

                <Text
                  color="gray.400"
                  fontSize="sm"
                  mt={1}
                >
                  Create a reusable Interactive Button
                  asset.
                </Text>
              </Box>

              <FormControl isRequired>
                <FormLabel fontSize="sm">
                  Asset Name
                </FormLabel>

                <Input
                  size="sm"
                  value={assetName}
                  onChange={event =>
                    setAssetName(
                      event.target.value,
                    )
                  }
                  placeholder="Start Button"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">
                  Label
                </FormLabel>

                <Input
                  size="sm"
                  value={buttonLabel}
                  onChange={event =>
                    setButtonLabel(
                      event.target.value,
                    )
                  }
                  placeholder="Start"
                />
              </FormControl>

              <SimpleGrid
                columns={{
                  base: 1,
                  md: 2,
                }}
                spacing={4}
              >
                <FormControl isRequired>
                  <FormLabel fontSize="sm">
                    Width
                  </FormLabel>

                  <NumberInput
                    size="sm"
                    min={1}
                    value={buttonWidth}
                    onChange={(
                      _valueString,
                      valueNumber,
                    ) => {
                      if (
                        Number.isFinite(
                          valueNumber,
                        )
                      ) {
                        setButtonWidth(
                          valueNumber,
                        )
                      }
                    }}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm">
                    Height
                  </FormLabel>

                  <NumberInput
                    size="sm"
                    min={1}
                    value={buttonHeight}
                    onChange={(
                      _valueString,
                      valueNumber,
                    ) => {
                      if (
                        Number.isFinite(
                          valueNumber,
                        )
                      ) {
                        setButtonHeight(
                          valueNumber,
                        )
                      }
                    }}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid
                columns={{
                  base: 1,
                  md: 2,
                }}
                spacing={4}
              >
                <Box
                  borderWidth="1px"
                  borderColor="whiteAlpha.200"
                  borderRadius="md"
                  p={4}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    Normal State
                  </Text>

                  <Text
                    color="gray.500"
                    fontSize="xs"
                    mt={1}
                  >
                    Default state is currently used.
                  </Text>

                  <Button
                    size="xs"
                    mt={3}
                    isDisabled
                  >
                    Choose Visual
                  </Button>
                </Box>

                <Box
                  borderWidth="1px"
                  borderColor="whiteAlpha.200"
                  borderRadius="md"
                  p={4}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    Pressed State
                  </Text>

                  <Text
                    color="gray.500"
                    fontSize="xs"
                    mt={1}
                  >
                    Default state is currently used.
                  </Text>

                  <Button
                    size="xs"
                    mt={3}
                    isDisabled
                  >
                    Choose Visual
                  </Button>
                </Box>
              </SimpleGrid>

              <HStack
                justify="flex-end"
                spacing={3}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={
                    closeInteractiveButtonDesigner
                  }
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  colorScheme="blue"
                  isDisabled={!canSave}
                  onClick={
                    saveInteractiveButton
                  }
                >
                  {editingAssetId
                  ? 'Save Changes'
                  : 'Save Interactive Button'}
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}

        <Box
          borderTopWidth="1px"
          borderColor="whiteAlpha.200"
        />

        {assets.length === 0 ? (
          <Box
            borderWidth="1px"
            borderColor="whiteAlpha.200"
            borderRadius="md"
            bg="blackAlpha.200"
            py={10}
            px={5}
            textAlign="center"
          >
            <Heading
              size="xs"
              color="gray.300"
            >
              No Interactive Assets Yet
            </Heading>

            <Text
              color="gray.500"
              fontSize="sm"
              mt={2}
            >
              Create an Interactive Button to begin
              building the reusable asset library.
            </Text>
          </Box>
        ) : (
          <VStack
            align="stretch"
            spacing={3}
          >
            {assets.map(asset => (
              <Box
                key={asset.id}
                borderWidth="1px"
                borderColor="whiteAlpha.200"
                borderRadius="md"
                bg="blackAlpha.200"
                p={4}
              >
                <HStack
                  justify="space-between"
                  align="center"
                  spacing={4}
                >
                  <Box>
                    <Heading size="xs">
                      {asset.name}
                    </Heading>

                    <Text
                      color="gray.400"
                      fontSize="sm"
                      mt={1}
                    >
                      {asset.label}
                    </Text>

                    <Text
                      color="gray.600"
                      fontSize="xs"
                      mt={1}
                    >
                      {asset.width} ×{' '}
                      {asset.height}
                    </Text>
                  </Box>

              <VStack
                 align="flex-end"
                 spacing={2}
                >
                  <Badge colorScheme="blue">
                  Interactive Button
                </Badge>

                 <HStack spacing={2}>
                  <Button
                     size="xs"
                     colorScheme="blue"
                     variant="outline"
                     onClick={() =>
                      editInteractiveButton(asset)
                     }
                  >
                   Edit
                 </Button>

                <Button
                 size="xs"
                 colorScheme="red"
                 variant="outline"
                 onClick={() =>
                deleteInteractiveAsset(asset.id)
                  }
                    >
                   Delete
                 </Button>
                 </HStack>
                </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

export default ForgeUIInteractiveAssetPanel