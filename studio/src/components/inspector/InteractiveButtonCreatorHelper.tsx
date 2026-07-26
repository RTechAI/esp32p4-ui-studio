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
  fitInteractiveButtonGeometryToContent,
  getInteractiveButtonHookName,
  getInteractiveButtonHookPreview,
  getInteractiveButtonAsset,
  getInteractiveButtonCommonContentBounds,
  saveInteractiveAssets,
  trimInteractiveButtonArtwork,
  updateInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
  openButtonCreator,
} from '~forgeui/ForgeUINavigation'
import useDispatch from '~hooks/useDispatch'

const hasCompleteButton = (
  component: IComponent,
): boolean => {
  if (component.type !== 'InteractiveButton') {
    return true
  }

  const interactiveAssetId =
    component.props.interactiveAssetId
  const asset = interactiveAssetId
    ? getInteractiveButtonAsset(interactiveAssetId)
    : undefined

  if (!asset?.normalAssetId || !asset.pressedAssetId) {
    return false
  }

  const uploadedAssetIds = new Set(
    forgeUIGetUploadedAssets().map(item => item.id),
  )
  return (
    uploadedAssetIds.has(asset.normalAssetId) &&
    uploadedAssetIds.has(asset.pressedAssetId)
  )
}

const InteractiveButtonCreatorHelper = ({
  component,
  components = {
    [component.id]: component,
  },
}: {
  component: IComponent
  components?: IComponents
}) => {
  const [, refresh] = useState(0)
  const [isTrimming, setIsTrimming] = useState(false)
  const [trimError, setTrimError] =
    useState<string | null>(null)
  const dispatch = useDispatch()

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

  const interactiveAssetId =
    component.props.interactiveAssetId
  const asset = interactiveAssetId
    ? getInteractiveButtonAsset(interactiveAssetId)
    : undefined
  const hookPreview = asset
    ? getInteractiveButtonHookPreview(asset.label)
    : undefined
  const conflictingComponents = asset
    ? Object.values(components).filter(candidate => {
        if (
          candidate.id === component.id ||
          candidate.type !== 'InteractiveButton'
        ) {
          return false
        }
        const candidateAsset =
          getInteractiveButtonAsset(
            candidate.props.interactiveAssetId,
          )
        return Boolean(
          candidateAsset &&
          getInteractiveButtonHookName(
            candidateAsset.label,
          ) === getInteractiveButtonHookName(asset.label),
        )
      })
    : []
  const isComplete = hasCompleteButton(component)
  const uploadedAssets = forgeUIGetUploadedAssets()
  const normalAsset = findUploadedAssetById(
    uploadedAssets,
    asset?.normalAssetId,
  )
  const pressedAsset = findUploadedAssetById(
    uploadedAssets,
    asset?.pressedAssetId,
  )
  const commonContentBounds =
    normalAsset && pressedAsset
      ? getInteractiveButtonCommonContentBounds(
          normalAsset,
          pressedAsset,
        )
      : undefined

  const trimTransparentPadding = async () => {
    if (
      !asset ||
      !normalAsset ||
      !pressedAsset ||
      !commonContentBounds
    ) {
      return
    }

    setIsTrimming(true)
    setTrimError(null)
    try {
      const result =
        await trimInteractiveButtonArtwork(
          normalAsset,
          pressedAsset,
        )
      updateInteractiveAsset(asset.id, {
        normalAssetId: result.normalAsset.id,
        pressedAssetId: result.pressedAsset.id,
      })
      saveInteractiveAssets()

      const sourceWidth = Number(normalAsset.width)
      const sourceHeight = Number(normalAsset.height)
      const componentWidth = Number(component.props.w)
      const componentHeight = Number(component.props.h)
      const nextGeometry =
        fitInteractiveButtonGeometryToContent({
          componentX: Number(component.props.x),
          componentY: Number(component.props.y),
          componentWidth,
          componentHeight,
          sourceWidth,
          sourceHeight,
          bounds: result.bounds,
        })

      Object.entries(nextGeometry).forEach(
        ([name, value]) =>
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
      setTrimError(
        error instanceof Error
          ? error.message
          : 'Unable to trim Button artwork.',
      )
    } finally {
      setIsTrimming(false)
    }
  }

  return (
    <Box
      mx={3}
      mt={3}
      p={3}
      borderWidth="1px"
      borderColor={
        conflictingComponents.length > 0
          ? 'orange.500'
          : 'cyan.700'
      }
      borderRadius="md"
      bg="cyan.900"
      color="gray.200"
      data-testid="button-creator-helper"
    >
      <VStack align="stretch" spacing={2}>
        {!isComplete && (
          <>
            <Text fontSize="sm" fontWeight="semibold">
              Button not configured
            </Text>
            <Text fontSize="xs" color="gray.400">
              This Button does not yet have both Normal and Pressed visuals.
            </Text>
          </>
        )}
        {hookPreview && (
          <>
            <Text fontSize="xs" color="gray.400">
              Public callback
            </Text>
            <Text
              data-testid="button-hook-preview"
              fontFamily="mono"
              fontSize="xs"
              color="cyan.200"
            >
              {hookPreview}
            </Text>
          </>
        )}
        {conflictingComponents.length > 0 && (
          <Box
            data-testid="button-hook-conflict-warning"
            color="orange.200"
          >
            <Text fontSize="sm" fontWeight="semibold">
              Duplicate public callback
            </Text>
            <Text fontSize="xs">
              Another Interactive Button generates this callback.
              Rename this Button’s Label in the Button Creator so every
              Button has a unique callback.
            </Text>
            <Text fontSize="xs" mt={1} color="gray.400">
              Conflicting component ID:{' '}
              {conflictingComponents
                .map(candidate => candidate.id)
                .join(', ')}
            </Text>
          </Box>
        )}
        <Button
          size="sm"
          colorScheme="cyan"
          variant="outline"
          alignSelf="flex-start"
          onClick={() =>
            openButtonCreator(
              component.id,
              component.props.interactiveAssetId,
            )
          }
        >
          Open Button Creator
        </Button>
        {asset && (
          <Button
            size="sm"
            colorScheme="cyan"
            variant="outline"
            alignSelf="flex-start"
            isLoading={isTrimming}
            isDisabled={!commonContentBounds}
            onClick={trimTransparentPadding}
          >
            Trim Transparent Padding
          </Button>
        )}
        {asset && !commonContentBounds && (
          <Text fontSize="xs" color="gray.400">
            Open the Button on the canvas once to measure its artwork
            before trimming.
          </Text>
        )}
        {trimError && (
          <Text fontSize="xs" color="red.300">
            {trimError}
          </Text>
        )}
      </VStack>
    </Box>
  )
}

export default InteractiveButtonCreatorHelper
