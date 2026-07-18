import React, {
  useEffect,
  useMemo,
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
  Image,
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

import InteractiveButtonPreview from './InteractiveButtonPreview'

import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

import type {
  ForgeUIInteractiveButtonAsset,
} from './ForgeUIInteractiveButtonAsset'

const DEFAULT_WIDTH = 120
const DEFAULT_HEIGHT = 48

type VisualSelectorMode =
  | 'normal'
  | 'pressed'
  | null
 
const ForgeUIInteractiveAssetPanel = () => {
  const [assets, setAssets] = useState<
    ForgeUIInteractiveButtonAsset[]
  >([])

  const [
    uploadedAssets,
    setUploadedAssets,
  ] = useState<ForgeUIUploadedAsset[]>([])

  const [
    isCreatingButton,
    setIsCreatingButton,
  ] = useState(false)

  const [
    editingAssetId,
    setEditingAssetId,
  ] = useState<
    ForgeUIInteractiveButtonAsset['id'] | null
  >(null)

  const [
  visualSelectorMode,
  setVisualSelectorMode,
] = useState<VisualSelectorMode>(null)

  const [assetName, setAssetName] =
    useState('New Interactive Button')

  const [buttonLabel, setButtonLabel] =
    useState('Button')

  const [buttonWidth, setButtonWidth] =
    useState(DEFAULT_WIDTH)

  const [buttonHeight, setButtonHeight] =
    useState(DEFAULT_HEIGHT)

  const [
    normalAssetId,
    setNormalAssetId,
  ] = useState<string | undefined>(undefined)

  const [
    pressedAssetId,
    setPressedAssetId,
  ] = useState<string | undefined>(undefined)

  const refreshAssets = () => {
    setAssets(getAllInteractiveAssets())
  }

  const refreshUploadedAssets = () => {
    setUploadedAssets([
      ...forgeUIGetUploadedAssets(),
    ])
  }

  useEffect(() => {
    reloadInteractiveAssets()
    refreshAssets()
    refreshUploadedAssets()

    const handleAssetsUpdated = () => {
      refreshUploadedAssets()
    }

    window.addEventListener(
      'forgeui-assets-updated',
      handleAssetsUpdated,
    )

    return () => {
      window.removeEventListener(
        'forgeui-assets-updated',
        handleAssetsUpdated,
      )
    }
  }, [])

  const selectableImageAssets = useMemo(
    () =>
      uploadedAssets.filter(
        asset =>
          asset.type.startsWith('image/') &&
          asset.exportStatus === 'lvgl_ready',
      ),
    [uploadedAssets],
  )

  const normalAsset = useMemo(
    () =>
      uploadedAssets.find(
        asset => asset.id === normalAssetId,
      ),
    [uploadedAssets, normalAssetId],
  )

  const pressedAsset = useMemo(
    () =>
      uploadedAssets.find(
        asset => asset.id === pressedAssetId,
      ),
    [uploadedAssets, pressedAssetId],
  )

  
    
  const resetDesigner = () => {
    setAssetName('New Interactive Button')
    setButtonLabel('Button')
    setButtonWidth(DEFAULT_WIDTH)
    setButtonHeight(DEFAULT_HEIGHT)
    setNormalAssetId(undefined)
    setPressedAssetId(undefined)
    setVisualSelectorMode(null)
  }

  const openInteractiveButtonDesigner = () => {
    resetDesigner()
    setEditingAssetId(null)
    setIsCreatingButton(true)
  }

  const editInteractiveButton = (
    asset: ForgeUIInteractiveButtonAsset,
  ) => {
    setAssetName(asset.name)
    setButtonLabel(asset.label)
    setButtonWidth(asset.width)
    setButtonHeight(asset.height)
    setNormalAssetId(asset.normalAssetId)
    setPressedAssetId(asset.pressedAssetId)
    setVisualSelectorMode(null)
    setEditingAssetId(asset.id)
    setIsCreatingButton(true)
  }

  const closeInteractiveButtonDesigner = () => {
    resetDesigner()
    setEditingAssetId(null)
    setIsCreatingButton(false)
  }

  const chooseVisualAsset = (
    assetId: ForgeUIUploadedAsset['id'],
  ) => {
    if (visualSelectorMode === 'normal') {
      setNormalAssetId(assetId)
    }

    if (visualSelectorMode === 'pressed') {
      setPressedAssetId(assetId)
    }

    setVisualSelectorMode(null)
  }

  const saveInteractiveButton = () => {
    const trimmedName = assetName.trim()
    const trimmedLabel = buttonLabel.trim()

    if (
      !trimmedName ||
      !trimmedLabel ||
      !normalAssetId ||
      !pressedAssetId
    ) {
      return
    }

    if (editingAssetId) {
      updateInteractiveAsset(
        editingAssetId,
        {
          name: trimmedName,
          label: trimmedLabel,
          width: buttonWidth,
          height: buttonHeight,
          normalAssetId,
          pressedAssetId,
        },
      )
    } else {
      const asset =
        createDefaultInteractiveButtonAsset(
          createInteractiveAssetId(),
          trimmedName,
        )

      const completedAsset: ForgeUIInteractiveButtonAsset = {
        ...asset,
        label: trimmedLabel,
        width: buttonWidth,
        height: buttonHeight,
        normalAssetId,
        pressedAssetId,
      }

      registerInteractiveAsset(completedAsset)
    }

    saveInteractiveAssets()
    refreshAssets()
    closeInteractiveButtonDesigner()
  }

  const deleteInteractiveAsset = (
    assetId: ForgeUIInteractiveButtonAsset['id'],
  ) => {
    removeInteractiveAsset(assetId)
    saveInteractiveAssets()
    refreshAssets()
  }

  const canSave =
    assetName.trim().length > 0 &&
    buttonLabel.trim().length > 0 &&
    buttonWidth > 0 &&
    buttonHeight > 0 &&
    Boolean(normalAssetId) &&
    Boolean(pressedAssetId)

  const renderSelectedVisual = (
    title: string,
    selectedAsset:
      | ForgeUIUploadedAsset
      | undefined,
    selectorMode: Exclude<
      VisualSelectorMode,
      null
    >,
  ) => (
    <Box
      borderWidth="1px"
      borderColor={
        selectedAsset
          ? 'blue.400'
          : 'whiteAlpha.200'
      }
      borderRadius="md"
      bg="blackAlpha.200"
      p={4}
    >
      <Text
        fontSize="sm"
        fontWeight="semibold"
      >
        {title}
      </Text>

      {selectedAsset ? (
        <VStack
          align="stretch"
          spacing={3}
          mt={3}
        >
          <Box
            height="120px"
            borderWidth="1px"
            borderColor="whiteAlpha.200"
            borderRadius="md"
            bg="blackAlpha.400"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
          >
            <Image
              src={selectedAsset.browserSrc}
              alt={selectedAsset.name}
              maxWidth="100%"
              maxHeight="100%"
              objectFit="contain"
            />
          </Box>

          <Box>
            <Text
              color="gray.300"
              fontSize="xs"
              fontWeight="semibold"
              noOfLines={1}
            >
              {selectedAsset.name}
            </Text>

            <Text
              color="green.300"
              fontSize="xs"
              mt={1}
            >
              LVGL Ready
            </Text>
          </Box>

          <HStack spacing={2}>
            <Button
              size="xs"
              colorScheme="blue"
              variant="outline"
              onClick={() =>
                setVisualSelectorMode(
                  selectorMode,
                )
              }
            >
              Change Visual
            </Button>

            <Button
              size="xs"
              variant="ghost"
              onClick={() => {
                if (
                  selectorMode === 'normal'
                ) {
                  setNormalAssetId(undefined)
                } else {
                  setPressedAssetId(undefined)
                }
              }}
            >
              Clear
            </Button>
          </HStack>
        </VStack>
      ) : (
        <>
          <Text
            color="gray.500"
            fontSize="xs"
            mt={1}
          >
            No image asset selected.
          </Text>

          <Button
            size="xs"
            colorScheme="blue"
            variant="outline"
            mt={3}
            onClick={() =>
              setVisualSelectorMode(
                selectorMode,
              )
            }
          >
            Choose Visual
          </Button>
        </>
      )}
    </Box>
  )

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
              Phase 4
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
              image-based visual states.
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
                  Select reusable image assets for
                  the Normal and Pressed states.
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
  {renderSelectedVisual(
    'Normal State',
    normalAsset,
    'normal',
  )}

  {renderSelectedVisual(
    'Pressed State',
    pressedAsset,
    'pressed',
  )}
</SimpleGrid>

<InteractiveButtonPreview
  normalAsset={normalAsset}
  pressedAsset={pressedAsset}
  width={buttonWidth}
  height={buttonHeight}
/>

{visualSelectorMode && (
                  <Box
                  borderWidth="1px"
                  borderColor="blue.400"
                  borderRadius="md"
                  bg="blackAlpha.400"
                  p={4}
                >
                  <HStack
                    justify="space-between"
                    align="center"
                    mb={4}
                  >
                    <Box>
                      <Heading size="xs">
                        Choose{' '}
                        {visualSelectorMode ===
                        'normal'
                          ? 'Normal'
                          : 'Pressed'}{' '}
                        Visual
                      </Heading>

                      <Text
                        color="gray.500"
                        fontSize="xs"
                        mt={1}
                      >
                        Select an LVGL-ready image
                        asset.
                      </Text>
                    </Box>

                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setVisualSelectorMode(null)
                      }
                    >
                      Close
                    </Button>
                  </HStack>

                  {selectableImageAssets.length ===
                  0 ? (
                    <Box
                      borderWidth="1px"
                      borderColor="whiteAlpha.200"
                      borderRadius="md"
                      py={8}
                      px={4}
                      textAlign="center"
                    >
                      <Text
                        color="gray.400"
                        fontSize="sm"
                      >
                        No LVGL-ready image assets
                        are available.
                      </Text>

                      <Text
                        color="gray.600"
                        fontSize="xs"
                        mt={1}
                      >
                        Add or convert an image in
                        the ForgeUI Asset Library.
                      </Text>
                    </Box>
                  ) : (
                    <SimpleGrid
                      columns={{
                        base: 2,
                        md: 3,
                        xl: 4,
                      }}
                      spacing={3}
                    >
                      {selectableImageAssets.map(
                        asset => {
                          const isSelected =
                            visualSelectorMode ===
                            'normal'
                              ? normalAssetId ===
                                asset.id
                              : pressedAssetId ===
                                asset.id

                          return (
                            <Button
                              key={asset.id}
                              height="auto"
                              minHeight="150px"
                              variant="outline"
                              borderColor={
                                isSelected
                                  ? 'blue.300'
                                  : 'whiteAlpha.200'
                              }
                              bg={
                                isSelected
                                  ? 'blue.900'
                                  : 'blackAlpha.300'
                              }
                              whiteSpace="normal"
                              p={3}
                              onClick={() =>
                                chooseVisualAsset(
                                  asset.id,
                                )
                              }
                            >
                              <VStack
                                width="100%"
                                spacing={2}
                              >
                                <Box
                                  width="100%"
                                  height="90px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  overflow="hidden"
                                >
                                  <Image
                                    src={
                                      asset.browserSrc
                                    }
                                    alt={asset.name}
                                    maxWidth="100%"
                                    maxHeight="100%"
                                    objectFit="contain"
                                  />
                                </Box>

                                <Text
                                  width="100%"
                                  color="gray.300"
                                  fontSize="xs"
                                  textAlign="center"
                                  noOfLines={2}
                                >
                                  {asset.name}
                                </Text>
                              </VStack>
                            </Button>
                          )
                        },
                      )}
                    </SimpleGrid>
                  )}
                </Box>
              )}

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
            {assets.map(asset => {
              const assetNormalVisual =
                uploadedAssets.find(
                  uploadedAsset =>
                    uploadedAsset.id ===
                    asset.normalAssetId,
                )

              const assetPressedVisual =
                uploadedAssets.find(
                  uploadedAsset =>
                    uploadedAsset.id ===
                    asset.pressedAssetId,
                )

              return (
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
                    <Box flex="1">
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

                      <HStack
                        spacing={3}
                        mt={3}
                      >
                        <Box>
                          <Text
                            color="gray.500"
                            fontSize="xs"
                            mb={1}
                          >
                            Normal
                          </Text>

                          <Box
                            width="72px"
                            height="48px"
                            borderWidth="1px"
                            borderColor="whiteAlpha.200"
                            borderRadius="sm"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            overflow="hidden"
                          >
                            {assetNormalVisual ? (
                              <Image
                                src={
                                  assetNormalVisual.browserSrc
                                }
                                alt={
                                  assetNormalVisual.name
                                }
                                maxWidth="100%"
                                maxHeight="100%"
                                objectFit="contain"
                              />
                            ) : (
                              <Text
                                color="gray.600"
                                fontSize="xs"
                              >
                                Missing
                              </Text>
                            )}
                          </Box>
                        </Box>

                        <Box>
                          <Text
                            color="gray.500"
                            fontSize="xs"
                            mb={1}
                          >
                            Pressed
                          </Text>

                          <Box
                            width="72px"
                            height="48px"
                            borderWidth="1px"
                            borderColor="whiteAlpha.200"
                            borderRadius="sm"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            overflow="hidden"
                          >
                            {assetPressedVisual ? (
                              <Image
                                src={
                                  assetPressedVisual.browserSrc
                                }
                                alt={
                                  assetPressedVisual.name
                                }
                                maxWidth="100%"
                                maxHeight="100%"
                                objectFit="contain"
                              />
                            ) : (
                              <Text
                                color="gray.600"
                                fontSize="xs"
                              >
                                Missing
                              </Text>
                            )}
                          </Box>
                        </Box>
                      </HStack>
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
                            editInteractiveButton(
                              asset,
                            )
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="outline"
                          onClick={() =>
                            deleteInteractiveAsset(
                              asset.id,
                            )
                          }
                        >
                          Delete
                        </Button>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              )
            })}
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

export default ForgeUIInteractiveAssetPanel