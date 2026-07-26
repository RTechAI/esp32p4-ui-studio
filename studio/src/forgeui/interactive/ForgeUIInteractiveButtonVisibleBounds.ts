import {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  cropTwoStateArtwork,
  fitTwoStateGeometryToContent,
  getTwoStateCommonContentBounds,
} from './ForgeUITwoStateVisibleBounds'

export const getInteractiveButtonCommonContentBounds =
  getTwoStateCommonContentBounds

export const fitInteractiveButtonGeometryToContent =
  fitTwoStateGeometryToContent

export const trimInteractiveButtonArtwork = async (
  normal: ForgeUIUploadedAsset,
  pressed: ForgeUIUploadedAsset,
) => {
  const result = await cropTwoStateArtwork({
    first: normal,
    second: pressed,
    firstPrefix: 'trimmed_button_normal',
    secondPrefix: 'trimmed_button_pressed',
    familyName: 'Button',
    missingBoundsMessage:
      'Normal and Pressed artwork must have measured matching source dimensions before trimming.',
  })

  return {
    bounds: result.bounds,
    normalAsset: result.firstAsset,
    pressedAsset: result.secondAsset,
  }
}
