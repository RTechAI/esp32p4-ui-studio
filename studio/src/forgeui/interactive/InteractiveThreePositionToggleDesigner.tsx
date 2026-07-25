import React, {
  useEffect,
  useState,
} from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'

import {
  getComponents,
  getSelectedComponent,
} from '~core/selectors/components'
import {
  findInteractiveAssetReferences,
  formatAssetReferences,
} from '~forgeui/ForgeUIReferenceProtection'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
} from '~forgeui/ForgeUINavigation'
import useDispatch from '~hooks/useDispatch'
import { useForm } from '~hooks/useForm'
import {
  createDefaultInteractiveThreePositionToggleAsset,
  createInteractiveAssetId,
  getInteractiveThreePositionComponentProps,
  registerInteractiveAsset,
  removeInteractiveAsset,
  resolveInteractiveThreePositionVisuals,
  saveInteractiveAssets,
  updateInteractiveAssetByKind,
} from './index'
import type {
  ForgeUIInteractiveThreePositionState,
  ForgeUIInteractiveThreePositionToggleAsset,
} from './ForgeUIInteractiveThreePositionToggleAsset'
import InteractiveThreePositionTogglePreview from './InteractiveThreePositionTogglePreview'
import InteractiveAssetAIGenerator from './InteractiveAssetAIGenerator'

type Props = {
  assets: ForgeUIInteractiveThreePositionToggleAsset[]
  uploadedAssets: ForgeUIUploadedAsset[]
  isActive: boolean
  newRequestVersion: number
  requestedEditAssetId?: string
  requestedEditVersion?: number
  onAssetsChanged(): void
  onUploadedAssetsChanged(): void
  onActivate(): void
  onClose(): void
  onGeneratingChange(value: boolean): void
}

const InteractiveThreePositionToggleDesigner = (
  props: Props,
) => {
  const selected = useSelector(getSelectedComponent)
  const components = useSelector(getComponents)
  const dispatch = useDispatch()
  const { setValue } = useForm()
  const [editingId, setEditingId] =
    useState<string | null>(null)
  const [name, setName] = useState(
    'New Interactive Three-Position Toggle Switch',
  )
  const [label, setLabel] =
    useState('Three-Position Toggle')
  const [width, setWidth] = useState(96)
  const [height, setHeight] = useState(36)
  const [leftAssetId, setLeft] = useState<string>()
  const [centerAssetId, setCenter] = useState<string>()
  const [rightAssetId, setRight] = useState<string>()
  const [initialState, setInitial] =
    useState<ForgeUIInteractiveThreePositionState>('center')
  const [previewState, setPreview] =
    useState<ForgeUIInteractiveThreePositionState>('center')
  const [generateRequestId, setGenerateRequestId] = useState(0)
  const [canGenerateSet, setCanGenerateSet] = useState(false)
  const [isGeneratingSet, setIsGeneratingSet] = useState(false)

  const ready = props.uploadedAssets.filter(
    asset =>
      asset.exportStatus === 'lvgl_ready' &&
      Boolean(asset.lvgl),
  )

  const reset = () => {
    setEditingId(null)
    setName('New Interactive Three-Position Toggle Switch')
    setLabel('Three-Position Toggle')
    setWidth(96)
    setHeight(36)
    setLeft(undefined)
    setCenter(undefined)
    setRight(undefined)
    setInitial('center')
    setPreview('center')
  }

  useEffect(() => {
    if (props.newRequestVersion) {
      reset()
    }
    // The version token intentionally owns new-draft resets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.newRequestVersion])

  const edit = (
    asset: ForgeUIInteractiveThreePositionToggleAsset,
  ) => {
    setEditingId(asset.id)
    setName(asset.name)
    setLabel(asset.label)
    setWidth(asset.width)
    setHeight(asset.height)
    setLeft(asset.leftAssetId)
    setCenter(asset.centerAssetId)
    setRight(asset.rightAssetId)
    setInitial(asset.initialState)
    setPreview(asset.initialState)
    props.onActivate()
  }

  useEffect(() => {
    if (
      !props.requestedEditAssetId ||
      !props.requestedEditVersion
    ) {
      return
    }
    const requestedAsset = props.assets.find(
      asset => asset.id === props.requestedEditAssetId,
    )
    if (requestedAsset) {
      edit(requestedAsset)
    }
    // Explicit navigation is identified by its request version.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.assets,
    props.requestedEditAssetId,
    props.requestedEditVersion,
  ])

  const save = () => {
    if (
      !name.trim() ||
      !label.trim() ||
      width <= 0 ||
      height <= 0 ||
      !leftAssetId ||
      !centerAssetId ||
      !rightAssetId
    ) {
      return
    }
    const values = {
      name: name.trim(),
      label: label.trim(),
      width,
      height,
      leftAssetId,
      centerAssetId,
      rightAssetId,
      initialState,
    }
    if (editingId) {
      updateInteractiveAssetByKind(
        editingId,
        'threePositionToggle',
        values,
      )
    } else {
      registerInteractiveAsset({
        ...createDefaultInteractiveThreePositionToggleAsset(
          createInteractiveAssetId(),
          values.name,
        ),
        ...values,
      })
    }
    saveInteractiveAssets()
    window.dispatchEvent(new Event(
      FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
    ))
    props.onAssetsChanged()
    reset()
    props.onClose()
  }

  const assign = (
    asset: ForgeUIInteractiveThreePositionToggleAsset,
  ) => {
    if (
      !selected ||
      selected.type !==
        'InteractiveThreePositionToggleSwitch'
    ) {
      return
    }
    Object.entries(
      getInteractiveThreePositionComponentProps(asset),
    ).forEach(([propertyName, value]) => {
      setValue(propertyName, value)
      dispatch.components.updateProps({
        id: selected.id,
        name: propertyName,
        value,
      })
    })
  }

  const remove = (id: string) => {
    const references =
      findInteractiveAssetReferences(id, components)
    if (references.length) {
      window.alert(formatAssetReferences(references))
      return
    }
    removeInteractiveAsset(id)
    saveInteractiveAssets()
    props.onAssetsChanged()
  }

  const selector = (
    title: 'LEFT' | 'CENTER' | 'RIGHT',
    value: string | undefined,
    setter: (next?: string) => void,
  ) => (
    <FormControl isRequired>
      <FormLabel fontSize="sm">{title} Image</FormLabel>
      <Select
        size="sm"
        value={value || ''}
        onChange={event =>
          setter(event.target.value || undefined)
        }
      >
        <option value="">Select {title} image</option>
        {ready.map(asset => (
          <option key={asset.id} value={asset.id}>
            {asset.name}
          </option>
        ))}
      </Select>
    </FormControl>
  )

  const visuals = resolveInteractiveThreePositionVisuals(
    {
      ...createDefaultInteractiveThreePositionToggleAsset(
        'preview',
      ),
      leftAssetId,
      centerAssetId,
      rightAssetId,
    },
    props.uploadedAssets,
  )

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="sm">
        Interactive Three-Position Toggle Switches
      </Heading>
      <Text color="gray.400" fontSize="sm">
        Persistent LEFT / CENTER / RIGHT inputs with direct
        three-zone selection.
      </Text>
      {props.isActive && (
        <Box
          borderWidth="1px"
          borderColor="green.400"
          borderRadius="md"
          p={5}
        >
          <VStack align="stretch" spacing={4}>
            <Heading size="sm">
              {editingId
                ? 'Edit Interactive Three-Position Toggle Switch'
                : 'Interactive Three-Position Toggle Switch Designer'}
            </Heading>
            <InteractiveAssetAIGenerator
              selectedAssetKind="threePositionToggle"
              width={width}
              height={height}
              generateRequestId={generateRequestId}
              onGenerateAvailabilityChange={setCanGenerateSet}
              onGenerated={(left, center, right) => {
                setLeft(left)
                setCenter(center)
                setRight(right)
              }}
              onGeneratingChange={isGenerating => {
                setIsGeneratingSet(isGenerating)
                props.onGeneratingChange(isGenerating)
              }}
              onUploadedAssetsChanged={
                props.onUploadedAssetsChanged
              }
            />
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              spacing={4}
            >
              <FormControl isRequired>
                <FormLabel>Asset Name</FormLabel>
                <Input
                  value={name}
                  onChange={event =>
                    setName(event.target.value)
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Label</FormLabel>
                <Input
                  value={label}
                  onChange={event =>
                    setLabel(event.target.value)
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Width</FormLabel>
                <NumberInput
                  min={1}
                  value={width}
                  onChange={(_, value) =>
                    Number.isFinite(value) && setWidth(value)
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Height</FormLabel>
                <NumberInput
                  min={1}
                  value={height}
                  onChange={(_, value) =>
                    Number.isFinite(value) && setHeight(value)
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <Button
                gridColumn={{ base: 'auto', md: '1 / -1' }}
                size="sm"
                colorScheme="purple"
                variant="outline"
                onClick={() =>
                  setGenerateRequestId(requestId =>
                    requestId + 1
                  )
                }
                isDisabled={
                  !canGenerateSet || isGeneratingSet
                }
                isLoading={isGeneratingSet}
              >
                Create Three-Position Toggle Set
              </Button>
              {selector('LEFT', leftAssetId, setLeft)}
              {selector('CENTER', centerAssetId, setCenter)}
              {selector('RIGHT', rightAssetId, setRight)}
              <FormControl>
                <FormLabel>Initial State</FormLabel>
                <Select
                  value={initialState}
                  onChange={event => {
                    const state = event.target.value as
                      ForgeUIInteractiveThreePositionState
                    setInitial(state)
                    setPreview(state)
                  }}
                >
                  <option value="left">LEFT</option>
                  <option value="center">CENTER</option>
                  <option value="right">RIGHT</option>
                </Select>
              </FormControl>
            </SimpleGrid>
            <InteractiveThreePositionTogglePreview
              {...visuals}
              width={width}
              height={height}
              state={previewState}
              onStateChange={setPreview}
              showZoneOverlay
            />
            <HStack justify="flex-end">
              <Button onClick={props.onClose}>Cancel</Button>
              <Button
                colorScheme="green"
                onClick={save}
                isDisabled={
                  !leftAssetId ||
                  !centerAssetId ||
                  !rightAssetId
                }
              >
                Save
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}
      {props.assets.map(asset => {
        const assetVisuals =
          resolveInteractiveThreePositionVisuals(
            asset,
            props.uploadedAssets,
          )
        return (
          <Box key={asset.id} borderWidth="1px" p={4}>
            <HStack justify="space-between">
              <InteractiveThreePositionTogglePreview
                {...assetVisuals}
                width={Math.min(asset.width, 96)}
                height={Math.min(asset.height, 48)}
                state={asset.initialState}
              />
              <Box flex="1">
                <Heading size="xs">{asset.name}</Heading>
                <Text fontSize="xs">
                  Initial {asset.initialState.toUpperCase()}
                </Text>
              </Box>
              <Button
                size="xs"
                onClick={() => assign(asset)}
                isDisabled={
                  selected?.type !==
                  'InteractiveThreePositionToggleSwitch'
                }
              >
                Use on Selected
              </Button>
              <Button size="xs" onClick={() => edit(asset)}>
                Edit
              </Button>
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => remove(asset.id)}
              >
                Delete
              </Button>
            </HStack>
          </Box>
        )
      })}
    </VStack>
  )
}

export default InteractiveThreePositionToggleDesigner
