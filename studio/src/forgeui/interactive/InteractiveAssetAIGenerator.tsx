import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  HStack,
  Heading,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'

import {
  generateAIImageAsset,
  generateThreePositionToggleMaster,
  registerThreePositionToggleCrops,
} from '~forgeui/ai/ForgeUIAIImagePipeline'
import StateSheetOverlay, {
  ForgeUIStateSheetProject,
} from '~forgeui/ai/StateSheetOverlay'

export type InteractiveAssetEditorKind =
  | 'button'
  | 'light'
  | 'statusIndicator'
  | 'toggleSwitch'
  | 'threePositionToggle'

type InteractiveAssetAIGeneratorProps = {
  selectedAssetKind: InteractiveAssetEditorKind
  width: number
  height: number
  onGenerated: (firstAssetId: string, secondAssetId: string, thirdAssetId?: string) => void
  onGeneratingChange: (isGenerating: boolean) => void
  onUploadedAssetsChanged: () => void
  generateRequestId?: number
  onGenerateAvailabilityChange?: (canGenerate: boolean) => void
}

export type ThreePositionRowState =
  | 'left'
  | 'center'
  | 'right'

export const DEFAULT_THREE_POSITION_ROW_MAPPING:
  ThreePositionRowState[] = ['left', 'center', 'right']

export const updateThreePositionRowMapping = (
  mapping: ThreePositionRowState[],
  rowIndex: number,
  nextState: ThreePositionRowState,
) => {
  const next = [...mapping]
  const duplicateIndex = next.indexOf(nextState)
  const previousState = next[rowIndex]
  next[rowIndex] = nextState
  next[duplicateIndex] = previousState
  return next
}

export const remapThreePositionProject = (
  project: ForgeUIStateSheetProject,
  mapping: ThreePositionRowState[],
): ForgeUIStateSheetProject => ({
  ...project,
  regions: DEFAULT_THREE_POSITION_ROW_MAPPING.map(state => {
    const rowIndex = mapping.indexOf(state)
    return {
      ...project.regions[rowIndex],
      id: state,
      label: state.toUpperCase(),
    }
  }),
})

const InteractiveAssetAIGenerator = ({
  selectedAssetKind,
  width,
  height,
  onGenerated,
  onGeneratingChange,
  onUploadedAssetsChanged,
  generateRequestId = 0,
  onGenerateAvailabilityChange,
}: InteractiveAssetAIGeneratorProps) => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [threePositionMaster, setThreePositionMaster] =
    useState<string | null>(null)
  const [threePositionProject, setThreePositionProject] =
    useState<ForgeUIStateSheetProject | null>(null)
  const [masterImageElement, setMasterImageElement] =
    useState<HTMLImageElement | null>(null)
  const [threePositionRowMapping, setThreePositionRowMapping] =
    useState<ThreePositionRowState[]>(
      DEFAULT_THREE_POSITION_ROW_MAPPING,
    )
  const handledGenerateRequestId = useRef(generateRequestId)

  const generate = async () => {
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt || isGenerating) return

    setIsGenerating(true)
    onGeneratingChange(true)

    try {
      const timestamp = Date.now()
      const isButton = selectedAssetKind === 'button'
      const isThreePosition = selectedAssetKind === 'threePositionToggle'
      const outputPrefix = selectedAssetKind === 'statusIndicator'
        ? 'ai_status_indicator'
        : selectedAssetKind === 'toggleSwitch'
          ? 'ai_toggle_switch'
          : 'ai_light'
      if (isThreePosition) {
        const masterImage =
          await generateThreePositionToggleMaster({
            prompt: trimmedPrompt,
          })
        setThreePositionProject(null)
        setMasterImageElement(null)
        setThreePositionRowMapping(
          DEFAULT_THREE_POSITION_ROW_MAPPING,
        )
        setThreePositionMaster(masterImage)
        return
      }

      const first = await generateAIImageAsset({
        prompt: trimmedPrompt,
        filePrefix: isButton
          ? `ai_button_normal_${timestamp}`
          : `${outputPrefix}_off_${timestamp}`,
        generationMode: isButton ? 'button-normal' : 'light-off',
        assetMode: 'interactive_button',
        width,
        height,
      })
      const second = await generateAIImageAsset({
        prompt: trimmedPrompt,
        filePrefix: isButton
          ? `ai_button_pressed_${timestamp}`
          : `${outputPrefix}_on_${timestamp}`,
        generationMode: isButton ? 'button-pressed' : 'light-on',
        assetMode: 'interactive_button',
        width,
        height,
      })

      onUploadedAssetsChanged()
      onGenerated(first.id, second.id)
    } catch (error) {
      console.error('Interactive Asset AI generation failed:', error)
      window.alert(
        error instanceof Error
          ? error.message
          : 'Interactive Asset AI generation failed.',
      )
    } finally {
      setIsGenerating(false)
      onGeneratingChange(false)
    }
  }

  useEffect(() => {
    onGenerateAvailabilityChange?.(
      Boolean(prompt.trim()) && !isGenerating,
    )
  }, [
    isGenerating,
    onGenerateAvailabilityChange,
    prompt,
  ])

  useEffect(() => {
    if (
      generateRequestId === handledGenerateRequestId.current
    ) return

    handledGenerateRequestId.current = generateRequestId
    void generate()
    // The request id deliberately owns this effect. Generator inputs are read
    // from the render in which that request arrived.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateRequestId])

  const prepareThreePositionProject = (
    image: HTMLImageElement,
  ) => {
    const cropHeight = Math.floor(image.naturalHeight / 3)
    setMasterImageElement(image)
    setThreePositionProject({
      sourceWidth: image.naturalWidth,
      sourceHeight: image.naturalHeight,
      cropWidth: image.naturalWidth,
      cropHeight,
      regions: [
        { id: 'left', label: 'LEFT', x: 0, y: 0 },
        {
          id: 'center',
          label: 'CENTER',
          x: 0,
          y: cropHeight,
        },
        {
          id: 'right',
          label: 'RIGHT',
          x: 0,
          y: cropHeight * 2,
        },
      ],
    })
  }

  const cancelThreePositionCrop = () => {
    setThreePositionMaster(null)
    setThreePositionProject(null)
    setMasterImageElement(null)
  }

  const confirmThreePositionCrop = async () => {
    if (
      !threePositionMaster ||
      !threePositionProject ||
      isGenerating
    ) return

    setIsGenerating(true)
    onGeneratingChange(true)
    try {
      const result = await registerThreePositionToggleCrops({
        masterImage: threePositionMaster,
        project: remapThreePositionProject(
          threePositionProject,
          threePositionRowMapping,
        ),
        width,
        height,
      })
      onUploadedAssetsChanged()
      onGenerated(
        result.left.id,
        result.center.id,
        result.right.id,
      )
      cancelThreePositionCrop()
    } catch (error) {
      console.error(
        'Interactive Asset AI generation failed:',
        error,
      )
      window.alert(
        error instanceof Error
          ? error.message
          : 'Interactive Asset AI generation failed.',
      )
    } finally {
      setIsGenerating(false)
      onGeneratingChange(false)
    }
  }

  return (
    <Box
      borderWidth="1px"
      borderColor="purple.400"
      borderRadius="md"
      bg="purple.900"
      p={4}
    >
      <Heading size="xs">AI Create Interactive Asset</Heading>
      <Text color="gray.400" fontSize="sm" mt={3} mb={2}>
        {selectedAssetKind === 'button'
          ? 'Generate matching Normal and Pressed images.'
          : selectedAssetKind === 'threePositionToggle'
            ? 'Generate matching LEFT, CENTER, and RIGHT images.'
            : 'Generate matching OFF and ON images.'}
      </Text>
      <Input
        value={prompt}
        onChange={event => setPrompt(event.target.value)}
        placeholder={
          selectedAssetKind === 'button'
            ? 'Blue Start button with soft glow...'
            : selectedAssetKind === 'threePositionToggle'
              ? 'Horizontal industrial selector switch with a rectangular body...'
              : 'Green power indicator...'
        }
        mb={3}
      />
      {selectedAssetKind === 'threePositionToggle' &&
        threePositionMaster && (
          <Box
            borderWidth="1px"
            borderColor="purple.300"
            borderRadius="md"
            bg="blackAlpha.500"
            p={3}
            data-testid="three-position-crop-workspace"
          >
            <Text color="gray.300" fontSize="xs" mb={2}>
              Drag or resize the shared frame, then confirm the
              LEFT, CENTER, and RIGHT crops.
            </Text>
            <Box
              position="relative"
              width="100%"
              height="min(52vh, 520px)"
              overflow="visible"
            >
              <Box
                as="img"
                src={threePositionMaster}
                alt="Three-Position master state sheet"
                width="100%"
                height="100%"
                objectFit="contain"
                display="block"
                onLoad={event =>
                  prepareThreePositionProject(
                    event.currentTarget as
                      unknown as HTMLImageElement,
                  )
                }
              />
              {threePositionProject && (
                <StateSheetOverlay
                  imageElement={masterImageElement}
                  project={threePositionProject}
                  onChange={setThreePositionProject}
                />
              )}
            </Box>
            <HStack align="flex-end" spacing={2} mt={3}>
              {threePositionRowMapping.map(
                (mappedState, rowIndex) => (
                  <Box key={rowIndex} flex={1}>
                    <Text
                      as="label"
                      display="block"
                      color="gray.300"
                      fontSize="xs"
                      mb={1}
                    >
                      Row {rowIndex + 1} maps to
                    </Text>
                    <Select
                      size="sm"
                      aria-label={`Row ${rowIndex + 1} maps to`}
                      value={mappedState}
                      onChange={event => {
                        const nextMapping =
                          updateThreePositionRowMapping(
                            threePositionRowMapping,
                            rowIndex,
                            event.target.value as
                              ThreePositionRowState,
                          )
                        setThreePositionRowMapping(nextMapping)
                        setThreePositionProject(project =>
                          project
                            ? {
                                ...project,
                                regions:
                                  project.regions.map(
                                    (region, index) => ({
                                      ...region,
                                      label:
                                        nextMapping[index]
                                          .toUpperCase(),
                                    }),
                                  ),
                              }
                            : project,
                        )
                      }}
                    >
                      <option value="left">LEFT</option>
                      <option value="center">CENTER</option>
                      <option value="right">RIGHT</option>
                    </Select>
                  </Box>
                ),
              )}
            </HStack>
            <HStack justify="flex-end" mt={3}>
              <Button
                size="sm"
                variant="ghost"
                onClick={cancelThreePositionCrop}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="purple"
                isLoading={isGenerating}
                isDisabled={!threePositionProject}
                onClick={confirmThreePositionCrop}
              >
                Confirm Crops
              </Button>
            </HStack>
          </Box>
        )}
      {selectedAssetKind !== 'threePositionToggle' && (
        <Button
          colorScheme="purple"
          isLoading={isGenerating}
          isDisabled={!prompt.trim()}
          onClick={generate}
        >
          Generate
        </Button>
      )}
    </Box>
  )
}

export default InteractiveAssetAIGenerator
