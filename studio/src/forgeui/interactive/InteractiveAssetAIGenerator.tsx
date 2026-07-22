import React, { useState } from 'react'
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react'

import {
  generateAIImageAsset,
} from '~forgeui/ai/ForgeUIAIImagePipeline'

export type InteractiveAssetEditorKind =
  | 'button'
  | 'light'
  | 'statusIndicator'
  | 'toggleSwitch'

type InteractiveAssetAIGeneratorProps = {
  selectedAssetKind: InteractiveAssetEditorKind
  width: number
  height: number
  onGenerated: (firstAssetId: string, secondAssetId: string) => void
  onGeneratingChange: (isGenerating: boolean) => void
  onUploadedAssetsChanged: () => void
}

const InteractiveAssetAIGenerator = ({
  selectedAssetKind,
  width,
  height,
  onGenerated,
  onGeneratingChange,
  onUploadedAssetsChanged,
}: InteractiveAssetAIGeneratorProps) => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generate = async () => {
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt || isGenerating) return

    setIsGenerating(true)
    onGeneratingChange(true)

    try {
      const timestamp = Date.now()
      const isButton = selectedAssetKind === 'button'
      const outputPrefix = selectedAssetKind === 'statusIndicator'
        ? 'ai_status_indicator'
        : selectedAssetKind === 'toggleSwitch'
          ? 'ai_toggle_switch'
          : 'ai_light'
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
          : 'Generate matching OFF and ON images.'}
      </Text>
      <Input
        value={prompt}
        onChange={event => setPrompt(event.target.value)}
        placeholder={
          selectedAssetKind === 'button'
            ? 'Blue Start button with soft glow...'
            : 'Green power indicator...'
        }
        mb={3}
      />
      <Button
        colorScheme="purple"
        isLoading={isGenerating}
        isDisabled={!prompt.trim()}
        onClick={generate}
      >
        Generate
      </Button>
    </Box>
  )
}

export default InteractiveAssetAIGenerator
