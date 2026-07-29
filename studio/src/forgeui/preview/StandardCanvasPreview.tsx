import React from 'react'
import { Box, Image } from '@chakra-ui/react'

import { FORGEUI_IMAGE_ASSETS } from '../ForgeUIAssetRegistry'
import { forgeUIGetUploadedAssets } from '../ForgeUIUploadedAssetRegistry'
import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const StandardCanvasPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const configuredSource =
    component.props.src ||
    component.props.browserSrc ||
    ''
  const asset: any = FORGEUI_IMAGE_ASSETS.find(item =>
    item.src === configuredSource,
  ) || forgeUIGetUploadedAssets().find(item =>
    item.id === component.props.uploadedAssetId ||
    item.browserSrc === configuredSource ||
    item.name === component.props.assetName ||
    item.name === component.props.alt,
  )
  const imageSource = asset?.browserSrc || asset?.src || configuredSource
  const hasImage = Boolean(imageSource)

  return (
    <Box
      width="100%"
      height="100%"
      overflow="hidden"
      bg={hasImage ? 'transparent' : theme.surface}
      border={hasImage ? '0' : `2px solid ${theme.surfaceBorder}`}
      borderRadius="8px"
      data-testid="standard-canvas-preview"
    >
      {hasImage && (
        <Image
          src={imageSource}
          alt={component.props.alt || asset?.name || 'Canvas artwork'}
          width="100%"
          height="100%"
          objectFit={component.props.objectFit || 'contain'}
          objectPosition={component.props.objectPosition || 'center'}
          draggable={false}
          pointerEvents="none"
          data-testid="standard-canvas-artwork"
        />
      )}
    </Box>
  )
}

export default StandardCanvasPreview
