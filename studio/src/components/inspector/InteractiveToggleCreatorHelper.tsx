import React, { useEffect, useState } from 'react'
import { Box, Button, Text, VStack } from '@chakra-ui/react'
import {
  findUploadedAssetById,
  fitInteractiveLightArtwork,
  fitTwoStateGeometryToContent,
  getInteractiveLightCommonContentBounds,
  getInteractiveToggleSwitchAsset,
  saveInteractiveAssets,
  twoStateBoundsNeedFitting,
  updateInteractiveAssetByKind,
} from '~forgeui/interactive'
import { forgeUIGetUploadedAssets } from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
  openToggleCreator,
} from '~forgeui/ForgeUINavigation'
import { FORGEUI_ACTIVE_DEVICE } from '~forgeui/ForgeUIDeviceConfig'
import useDispatch from '~hooks/useDispatch'

const InteractiveToggleCreatorHelper = ({
  component,
}: {
  component: IComponent
}) => {
  const [, refresh] = useState(0)
  const [isFitting, setIsFitting] = useState(false)
  const [fitError, setFitError] = useState<string | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const update = () => refresh(value => value + 1)
    window.addEventListener('forgeui-assets-updated', update)
    window.addEventListener(FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT, update)
    return () => {
      window.removeEventListener('forgeui-assets-updated', update)
      window.removeEventListener(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
        update,
      )
    }
  }, [])

  const linkedId = component.props.interactiveAssetId
  const asset = linkedId
    ? getInteractiveToggleSwitchAsset(linkedId)
    : undefined
  const uploadedAssets = forgeUIGetUploadedAssets()
  const uploadedIds = new Set(uploadedAssets.map(item => item.id))
  const isComplete = Boolean(
    asset?.offAssetId &&
    asset.onAssetId &&
    uploadedIds.has(asset.offAssetId) &&
    uploadedIds.has(asset.onAssetId),
  )
  const missingLinkedAsset = Boolean(linkedId) && !asset
  const offAsset = findUploadedAssetById(uploadedAssets, asset?.offAssetId)
  const onAsset = findUploadedAssetById(uploadedAssets, asset?.onAssetId)
  const commonBounds = offAsset && onAsset
    ? getInteractiveLightCommonContentBounds(offAsset, onAsset)
    : undefined
  const needsFitting = Boolean(
    offAsset &&
    commonBounds &&
    twoStateBoundsNeedFitting(offAsset, commonBounds),
  )

  const fitBounds = async () => {
    if (
      !asset ||
      !offAsset ||
      !onAsset ||
      !commonBounds ||
      !needsFitting
    ) return

    setIsFitting(true)
    setFitError(null)
    try {
      const result = await fitInteractiveLightArtwork(offAsset, onAsset)
      updateInteractiveAssetByKind(asset.id, 'toggleSwitch', {
        offAssetId: result.offAsset.id,
        onAssetId: result.onAsset.id,
      })
      saveInteractiveAssets()
      const next = fitTwoStateGeometryToContent({
        componentX: Number(component.props.x),
        componentY: Number(component.props.y),
        componentWidth: Number(component.props.w),
        componentHeight: Number(component.props.h),
        sourceWidth: Number(offAsset.width),
        sourceHeight: Number(offAsset.height),
        bounds: result.bounds,
      })
      const w = Math.min(next.w, FORGEUI_ACTIVE_DEVICE.width)
      const h = Math.min(next.h, FORGEUI_ACTIVE_DEVICE.height)
      const geometry = {
        x: Math.max(0, Math.min(next.x, FORGEUI_ACTIVE_DEVICE.width - w)),
        y: Math.max(0, Math.min(next.y, FORGEUI_ACTIVE_DEVICE.height - h)),
        w,
        h,
      }
      Object.entries(geometry).forEach(([name, value]) =>
        dispatch.components.updateProps({
          id: component.id,
          name,
          value: String(value),
        }),
      )
      window.dispatchEvent(new Event(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      ))
    } catch (error) {
      setFitError(error instanceof Error
        ? error.message
        : 'Unable to fit Toggle artwork.')
    } finally {
      setIsFitting(false)
    }
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
          {isComplete
            ? 'Interactive Toggle Switch'
            : 'Toggle not configured'}
        </Text>
        {isComplete && asset ? (
          <>
            <Text fontSize="xs" color="gray.200">{asset.name}</Text>
            <Text fontSize="xs" color="gray.400">
              Initial state: {asset.initialState.toUpperCase()}
              {' · '}OFF/ON artwork linked
            </Text>
          </>
        ) : (
          <Text fontSize="xs" color="gray.400">
            {missingLinkedAsset
              ? 'The linked Toggle asset is unavailable. Open the Toggle Creator to create or assign a replacement.'
              : 'This Toggle requires a complete OFF/ON Toggle Set.'}
          </Text>
        )}
        <Button
          size="sm"
          colorScheme="green"
          variant="outline"
          alignSelf="flex-start"
          onClick={() => openToggleCreator(component.id, asset?.id)}
        >
          Open Toggle Creator
        </Button>
        {isComplete && asset && (
          <Button
            size="sm"
            colorScheme="green"
            variant="outline"
            alignSelf="flex-start"
            isLoading={isFitting}
            isDisabled={!commonBounds || !needsFitting}
            onClick={fitBounds}
          >
            Fit Bounds to Visible Artwork
          </Button>
        )}
        {isComplete && asset && !commonBounds && (
          <Text fontSize="xs" color="gray.400">
            Open the Toggle on the canvas once to measure its artwork
            before fitting.
          </Text>
        )}
        {isComplete && asset && commonBounds && !needsFitting && (
          <Text fontSize="xs" color="gray.400">
            Bounds already fit visible artwork.
          </Text>
        )}
        {fitError && (
          <Text fontSize="xs" color="red.300">{fitError}</Text>
        )}
      </VStack>
    </Box>
  )
}

export default InteractiveToggleCreatorHelper
