import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
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
  Select,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'

import { getSelectedComponent } from '~core/selectors/components'
import useDispatch from '~hooks/useDispatch'
import { useForm } from '~hooks/useForm'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  createDefaultInteractiveLightAsset,
  createInteractiveAssetId,
  getInteractiveLightComponentProps,
  registerInteractiveAsset,
  removeInteractiveAsset,
  resolveInteractiveLightVisuals,
  saveInteractiveAssets,
  updateInteractiveAssetByKind,
} from '~forgeui/interactive'
import type {
  ForgeUIInteractiveLightAsset,
  ForgeUIInteractiveLightState,
} from './ForgeUIInteractiveLightAsset'
import InteractiveLightPreview from './InteractiveLightPreview'
import InteractiveAssetAIGenerator, {
  InteractiveAssetEditorKind,
} from './InteractiveAssetAIGenerator'

type InteractiveLightDesignerProps = {
  assets: ForgeUIInteractiveLightAsset[]
  uploadedAssets: ForgeUIUploadedAsset[]
  selectedAssetKind: InteractiveAssetEditorKind
  onAssetsChanged: () => void
  onUploadedAssetsChanged: () => void
  isActive: boolean
  newRequestVersion: number
  onActivate: () => void
  onClose: () => void
  onGeneratingChange: (isGenerating: boolean) => void
}

const InteractiveLightDesigner = ({
  assets,
  uploadedAssets,
  selectedAssetKind,
  onAssetsChanged,
  onUploadedAssetsChanged,
  isActive,
  newRequestVersion,
  onActivate,
  onClose,
  onGeneratingChange,
}: InteractiveLightDesignerProps) => {
  const selectedComponent = useSelector(getSelectedComponent)
  const selectedIsInteractiveLight =
    selectedComponent?.type === 'InteractiveLight'
  const { setValue } = useForm()
  const dispatch = useDispatch()

  const [editingAssetId, setEditingAssetId] = useState<string | null>(null)
  const [name, setName] = useState('New Interactive Light')
  const [label, setLabel] = useState('Status Light')
  const [width, setWidth] = useState(32)
  const [height, setHeight] = useState(32)
  const [offAssetId, setOffAssetId] = useState<string | undefined>()
  const [onAssetId, setOnAssetId] = useState<string | undefined>()
  const [initialState, setInitialState] =
    useState<ForgeUIInteractiveLightState>('off')
  const [previewState, setPreviewState] =
    useState<ForgeUIInteractiveLightState>('off')

  const offAsset = useMemo(
    () => uploadedAssets.find(asset => asset.id === offAssetId),
    [offAssetId, uploadedAssets],
  )
  const onAsset = useMemo(
    () => uploadedAssets.find(asset => asset.id === onAssetId),
    [onAssetId, uploadedAssets],
  )
  const selectableAssets = uploadedAssets.filter(
    asset => asset.exportStatus === 'lvgl_ready' && Boolean(asset.lvgl),
  )

  const reset = () => {
    setEditingAssetId(null)
    setName('New Interactive Light')
    setLabel('Status Light')
    setWidth(32)
    setHeight(32)
    setOffAssetId(undefined)
    setOnAssetId(undefined)
    setInitialState('off')
    setPreviewState('off')
  }

  const resetForNew = () => {
    reset()
  }

  useEffect(() => {
    if (newRequestVersion > 0) resetForNew()
    // The version token intentionally owns new-draft resets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRequestVersion])

  const edit = (asset: ForgeUIInteractiveLightAsset) => {
    setEditingAssetId(asset.id)
    setName(asset.name)
    setLabel(asset.label)
    setWidth(asset.width)
    setHeight(asset.height)
    setOffAssetId(asset.offAssetId)
    setOnAssetId(asset.onAssetId)
    setInitialState(asset.initialState)
    setPreviewState(asset.initialState)
    onActivate()
  }

  const close = () => {
    reset()
    onClose()
  }

  const save = () => {
    const trimmedName = name.trim()
    const trimmedLabel = label.trim()

    if (
      !trimmedName || !trimmedLabel ||
      width <= 0 || height <= 0 ||
      !offAssetId || !onAssetId
    ) {
      return
    }

    if (editingAssetId) {
      updateInteractiveAssetByKind(editingAssetId, 'light', {
        name: trimmedName,
        label: trimmedLabel,
        width,
        height,
        offAssetId,
        onAssetId,
        initialState,
      })
    } else {
      registerInteractiveAsset({
        ...createDefaultInteractiveLightAsset(
          createInteractiveAssetId(),
          trimmedName,
        ),
        label: trimmedLabel,
        width,
        height,
        offAssetId,
        onAssetId,
        initialState,
      })
    }

    saveInteractiveAssets()
    onAssetsChanged()
    close()
  }

  const assign = (asset: ForgeUIInteractiveLightAsset) => {
    if (!selectedIsInteractiveLight || !selectedComponent) return

    Object.entries(getInteractiveLightComponentProps(asset)).forEach(
      ([propertyName, value]) => {
        setValue(propertyName, value)
        dispatch.components.updateProps({
          id: selectedComponent.id,
          name: propertyName,
          value,
        })
      },
    )
  }

  const remove = (assetId: string) => {
    removeInteractiveAsset(assetId)
    saveInteractiveAssets()
    onAssetsChanged()
  }

  const canSave = Boolean(
    name.trim() && label.trim() &&
    width > 0 && height > 0 &&
    offAssetId && onAssetId,
  )

  return (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        <Box>
          <Heading size="sm">Interactive Lights</Heading>
          <Text color="gray.400" fontSize="sm" mt={1}>
            Reusable OFF/ON output indicators controlled by generated C APIs.
          </Text>
        </Box>
      </HStack>

      {isActive && (
        <Box borderWidth="1px" borderColor="green.400" borderRadius="md" p={5}>
          <VStack align="stretch" spacing={4}>
            <Heading size="sm">
              {editingAssetId ? 'Edit Interactive Light' : 'Interactive Light Designer'}
            </Heading>
            <InteractiveAssetAIGenerator
              selectedAssetKind={selectedAssetKind}
              width={width}
              height={height}
              onGenerated={(offId, onId) => {
                setOffAssetId(offId)
                setOnAssetId(onId)
              }}
              onGeneratingChange={onGeneratingChange}
              onUploadedAssetsChanged={onUploadedAssetsChanged}
            />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Asset Name</FormLabel>
                <Input size="sm" value={name} onChange={event => setName(event.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Label</FormLabel>
                <Input size="sm" value={label} onChange={event => setLabel(event.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Width</FormLabel>
                <NumberInput size="sm" min={1} value={width} onChange={(_, value) => Number.isFinite(value) && setWidth(value)}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Height</FormLabel>
                <NumberInput size="sm" min={1} value={height} onChange={(_, value) => Number.isFinite(value) && setHeight(value)}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">OFF Image</FormLabel>
                <Select size="sm" value={offAssetId || ''} onChange={event => setOffAssetId(event.target.value || undefined)}>
                  <option value="">Select OFF image</option>
                  {selectableAssets.map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">ON Image</FormLabel>
                <Select size="sm" value={onAssetId || ''} onChange={event => setOnAssetId(event.target.value || undefined)}>
                  <option value="">Select ON image</option>
                  {selectableAssets.map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Initial State</FormLabel>
                <Select size="sm" value={initialState} onChange={event => {
                  const state = event.target.value as ForgeUIInteractiveLightState
                  setInitialState(state)
                  setPreviewState(state)
                }}>
                  <option value="off">OFF</option>
                  <option value="on">ON</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <InteractiveLightPreview
              offAsset={offAsset}
              onAsset={onAsset}
              width={width}
              height={height}
              state={previewState}
              onStateChange={setPreviewState}
              showControls
            />

            <HStack justify="flex-end">
              <Button size="sm" variant="ghost" onClick={close}>Cancel</Button>
              <Button size="sm" colorScheme="green" isDisabled={!canSave} onClick={save}>Save Light</Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {assets.map(asset => {
        const visuals = resolveInteractiveLightVisuals(asset, uploadedAssets)
        return (
          <Box key={asset.id} borderWidth="1px" borderColor="whiteAlpha.200" borderRadius="md" p={4}>
            <HStack justify="space-between" align="center">
              <HStack spacing={4}>
                <InteractiveLightPreview
                  offAsset={visuals.offAsset}
                  onAsset={visuals.onAsset}
                  width={Math.min(asset.width, 64)}
                  height={Math.min(asset.height, 64)}
                  state={asset.initialState}
                />
                <Box>
                  <Heading size="xs">{asset.name}</Heading>
                  <Text color="gray.400" fontSize="sm">{asset.label}</Text>
                  <Text color="gray.600" fontSize="xs">{asset.width} × {asset.height} · Initial {asset.initialState.toUpperCase()}</Text>
                  <Badge mt={2} colorScheme="green">Interactive Light</Badge>
                </Box>
              </HStack>
              <HStack spacing={2}>
                <Button size="xs" colorScheme="green" variant="outline" isDisabled={!selectedIsInteractiveLight} onClick={() => assign(asset)}>Use on Selected</Button>
                <Button size="xs" colorScheme="blue" variant="outline" onClick={() => edit(asset)}>Edit</Button>
                <Button size="xs" colorScheme="red" variant="outline" onClick={() => remove(asset.id)}>Delete</Button>
              </HStack>
            </HStack>
          </Box>
        )
      })}
    </VStack>
  )
}

export default InteractiveLightDesigner
