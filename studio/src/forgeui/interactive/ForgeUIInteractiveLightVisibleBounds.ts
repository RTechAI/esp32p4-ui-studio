import {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  cropTwoStateArtwork,
  getTwoStateCommonContentBounds,
} from './ForgeUITwoStateVisibleBounds'

export const getInteractiveLightCommonContentBounds =
  getTwoStateCommonContentBounds

export const fitInteractiveLightArtwork = async (
  off: ForgeUIUploadedAsset,
  on: ForgeUIUploadedAsset,
) => {
  const result = await cropTwoStateArtwork({
    first: off,
    second: on,
    firstPrefix: 'fitted_light_off',
    secondPrefix: 'fitted_light_on',
    familyName: 'Light',
    missingBoundsMessage:
      'OFF and ON artwork must have measured matching source dimensions before fitting.',
    recordFullBounds: true,
  })

  return {
    bounds: result.bounds,
    offAsset: result.firstAsset,
    onAsset: result.secondAsset,
  }
}
