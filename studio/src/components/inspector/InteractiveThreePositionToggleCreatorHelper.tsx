import React, { useEffect, useState } from 'react'
import { Box, Button, Text, VStack } from '@chakra-ui/react'
import {
  cropThreeStateArtwork,
  findUploadedAssetById,
  fitTwoStateGeometryToContent,
  getCommonContentBounds,
  getInteractiveThreePositionToggleAsset,
  saveInteractiveAssets,
  twoStateBoundsNeedFitting,
  updateInteractiveAssetByKind,
} from '~forgeui/interactive'
import { forgeUIGetUploadedAssets } from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
  openThreePositionToggleCreator,
} from '~forgeui/ForgeUINavigation'
import { FORGEUI_ACTIVE_DEVICE } from '~forgeui/ForgeUIDeviceConfig'
import useDispatch from '~hooks/useDispatch'

const InteractiveThreePositionToggleCreatorHelper = ({
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
    ? getInteractiveThreePositionToggleAsset(linkedId)
    : undefined
  const uploaded = forgeUIGetUploadedAssets()
  const uploadedIds = new Set(uploaded.map(item => item.id))
  const isComplete = Boolean(
    asset?.leftAssetId &&
    asset.centerAssetId &&
    asset.rightAssetId &&
    uploadedIds.has(asset.leftAssetId) &&
    uploadedIds.has(asset.centerAssetId) &&
    uploadedIds.has(asset.rightAssetId),
  )
  const missingLinkedAsset = Boolean(linkedId) && !asset
  const leftAsset = findUploadedAssetById(uploaded, asset?.leftAssetId)
  const centerAsset = findUploadedAssetById(uploaded, asset?.centerAssetId)
  const rightAsset = findUploadedAssetById(uploaded, asset?.rightAssetId)
  const commonBounds = leftAsset && centerAsset && rightAsset
    ? getCommonContentBounds([leftAsset, centerAsset, rightAsset])
    : undefined
  const needsFitting = Boolean(
    leftAsset &&
    commonBounds &&
    twoStateBoundsNeedFitting(leftAsset, commonBounds),
  )

  const fitBounds = async () => {
    if (
      !asset ||
      !leftAsset ||
      !centerAsset ||
      !rightAsset ||
      !commonBounds ||
      !needsFitting
    ) return
    setIsFitting(true)
    setFitError(null)
    try {
      const result = await cropThreeStateArtwork({
        left: leftAsset,
        center: centerAsset,
        right: rightAsset,
      })
      updateInteractiveAssetByKind(asset.id, 'threePositionToggle', {
        leftAssetId: result.leftAsset.id,
        centerAssetId: result.centerAsset.id,
        rightAssetId: result.rightAsset.id,
      })
      saveInteractiveAssets()
      const next = fitTwoStateGeometryToContent({
        componentX: Number(component.props.x),
        componentY: Number(component.props.y),
        componentWidth: Number(component.props.w),
        componentHeight: Number(component.props.h),
        sourceWidth: Number(leftAsset.width),
        sourceHeight: Number(leftAsset.height),
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
        : 'Unable to fit Three-Position Toggle artwork.')
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
      borderColor="cyan.700"
      borderRadius="md"
      bg="cyan.900"
      color="gray.200"
      data-testid="three-position-toggle-creator-helper"
    >
      <VStack align="stretch" spacing={2}>
        <Text fontSize="sm" fontWeight="semibold">
          {isComplete
            ? 'Interactive Three-Position Toggle'
            : 'Three-Position Toggle not configured'}
        </Text>
        {isComplete && asset ? (
          <>
            <Text fontSize="xs" color="gray.200">{asset.name}</Text>
            <Text fontSize="xs" color="gray.400">
              Initial state: {asset.initialState.toUpperCase()}
              {' · '}LEFT/CENTER/RIGHT artwork linked
            </Text>
          </>
        ) : (
          <Text fontSize="xs" color="gray.400">
            {missingLinkedAsset
              ? 'The linked Three-Position Toggle asset is unavailable. Open the Creator to create or assign a replacement.'
              : 'This Toggle needs LEFT, CENTER, and RIGHT visuals.'}
          </Text>
        )}
        <Button
          size="sm"
          colorScheme="cyan"
          variant="outline"
          alignSelf="flex-start"
          onClick={() =>
            openThreePositionToggleCreator(component.id, asset?.id)
          }
        >
          Open Three-Position Toggle Creator
        </Button>
        {isComplete && asset && (
          <Button
            size="sm"
            colorScheme="cyan"
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
            Open the control on the canvas once to measure all three
            artwork states before fitting.
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

export default InteractiveThreePositionToggleCreatorHelper
