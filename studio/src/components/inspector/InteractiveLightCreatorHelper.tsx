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
  findUploadedAssetById,
  fitInteractiveLightArtwork,
  fitTwoStateGeometryToContent,
  getInteractiveLightAsset,
  getInteractiveLightCommonContentBounds,
  saveInteractiveAssets,
  twoStateBoundsNeedFitting,
  updateInteractiveAssetByKind,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
  openLightCreator,
} from '~forgeui/ForgeUINavigation'
import {
  FORGEUI_ACTIVE_DEVICE,
} from '~forgeui/ForgeUIDeviceConfig'
import useDispatch from '~hooks/useDispatch'

const InteractiveLightCreatorHelper = ({
  component,
}: {
  component: IComponent
}) => {
  const [, refresh] = useState(0)
  const [isFitting, setIsFitting] = useState(false)
  const [fitError, setFitError] = useState<string | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const refreshCompleteness = () =>
      refresh(version => version + 1)
    window.addEventListener('forgeui-assets-updated', refreshCompleteness)
    window.addEventListener(
      FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      refreshCompleteness,
    )
    return () => {
      window.removeEventListener('forgeui-assets-updated', refreshCompleteness)
      window.removeEventListener(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
        refreshCompleteness,
      )
    }
  }, [])

  const interactiveAssetId =
    component.props.interactiveAssetId
  const asset = interactiveAssetId
    ? getInteractiveLightAsset(interactiveAssetId)
    : undefined
  const uploadedAssets = forgeUIGetUploadedAssets()
  const uploadedAssetIds = new Set(
    uploadedAssets.map(item => item.id),
  )
  const isComplete = Boolean(
    asset?.offAssetId &&
    asset.onAssetId &&
    uploadedAssetIds.has(asset.offAssetId) &&
    uploadedAssetIds.has(asset.onAssetId),
  )
  const hasMissingLinkedAsset =
    Boolean(interactiveAssetId) && !asset
  const offAsset = findUploadedAssetById(
    uploadedAssets,
    asset?.offAssetId,
  )
  const onAsset = findUploadedAssetById(
    uploadedAssets,
    asset?.onAssetId,
  )
  const commonContentBounds =
    offAsset && onAsset
      ? getInteractiveLightCommonContentBounds(
          offAsset,
          onAsset,
        )
      : undefined
  const needsFitting = Boolean(
    offAsset &&
    commonContentBounds &&
    twoStateBoundsNeedFitting(
      offAsset,
      commonContentBounds,
    ),
  )

  const fitBoundsToVisibleArtwork = async () => {
    if (
      !asset ||
      !offAsset ||
      !onAsset ||
      !commonContentBounds ||
      !needsFitting
    ) {
      return
    }

    setIsFitting(true)
    setFitError(null)
    try {
      const result = await fitInteractiveLightArtwork(
        offAsset,
        onAsset,
      )
      updateInteractiveAssetByKind(
        asset.id,
        'light',
        {
          offAssetId: result.offAsset.id,
          onAssetId: result.onAsset.id,
        },
      )
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
        x: Math.max(
          0,
          Math.min(next.x, FORGEUI_ACTIVE_DEVICE.width - w),
        ),
        y: Math.max(
          0,
          Math.min(next.y, FORGEUI_ACTIVE_DEVICE.height - h),
        ),
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
      setFitError(
        error instanceof Error
          ? error.message
          : 'Unable to fit Light artwork.',
      )
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
      data-testid="light-creator-helper"
    >
      <VStack align="stretch" spacing={2}>
        <Text fontSize="sm" fontWeight="semibold">
          {isComplete
            ? 'Interactive Light'
            : 'Light not configured'}
        </Text>
        {isComplete && asset ? (
          <>
            <Text fontSize="xs" color="gray.200">
              {asset.name}
            </Text>
            <Text fontSize="xs" color="gray.400">
              Initial state: {asset.initialState.toUpperCase()}
              {' · '}OFF/ON artwork linked
            </Text>
          </>
        ) : (
          <Text fontSize="xs" color="gray.400">
            {hasMissingLinkedAsset
              ? 'The linked Light asset is unavailable. Open the Light Creator to create or assign a replacement.'
              : 'This Light requires both OFF and ON visuals.'}
          </Text>
        )}
        <Button
          size="sm"
          colorScheme="cyan"
          variant="outline"
          alignSelf="flex-start"
          onClick={() =>
            openLightCreator(
              component.id,
              asset?.id,
            )
          }
        >
          Open Light Creator
        </Button>
        {isComplete && asset && (
          <Button
            size="sm"
            colorScheme="cyan"
            variant="outline"
            alignSelf="flex-start"
            isLoading={isFitting}
            isDisabled={!commonContentBounds || !needsFitting}
            onClick={fitBoundsToVisibleArtwork}
          >
            Fit Bounds to Visible Artwork
          </Button>
        )}
        {isComplete && asset && !commonContentBounds && (
          <Text fontSize="xs" color="gray.400">
            Open the Light on the canvas once to measure its artwork
            before fitting.
          </Text>
        )}
        {isComplete &&
          asset &&
          commonContentBounds &&
          !needsFitting && (
            <Text fontSize="xs" color="gray.400">
              Bounds already fit visible artwork.
            </Text>
          )}
        {fitError && (
          <Text fontSize="xs" color="red.300">
            {fitError}
          </Text>
        )}
      </VStack>
    </Box>
  )
}

export default InteractiveLightCreatorHelper
