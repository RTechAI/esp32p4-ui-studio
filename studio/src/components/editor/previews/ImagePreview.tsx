import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { getForgeUIStandardImagePresentation } from '~forgeui/ForgeUIStandardImage'
import {
  forgeUIRecordRenderedImageMetadata,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import { resolveForgeUIStandardImageAsset } from '~forgeui/ForgeUIStandardImage'

interface IProps {
  component: IComponent
}

const ImagePreview = ({ component }: IProps) => {
  const model = getForgeUIStandardImagePresentation(component)

  return (
    <Chakra.Box
      width="100%"
      height="100%"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      opacity={model.opacity}
      visibility={model.visible ? 'visible' : 'hidden'}
      data-image-fit={model.fit}
      data-lvgl-scale={model.lvglScale}
      data-testid="standard-image-preview"
    >
      <Chakra.Image
        src={model.src}
        alt={component.props.alt || 'Image'}
        width={model.targetWidth ? `${model.targetWidth}px` : '100%'}
        height={model.targetHeight ? `${model.targetHeight}px` : '100%'}
        maxWidth="none"
        objectFit="fill"
        onLoad={event => {
          const asset = resolveForgeUIStandardImageAsset(component)
          if (asset && 'browserSrc' in asset) {
            forgeUIRecordRenderedImageMetadata(
              asset,
              event.currentTarget,
            )
          }
        }}
        draggable={false}
        pointerEvents="none"
      />
    </Chakra.Box>
  )
}

export default ImagePreview
