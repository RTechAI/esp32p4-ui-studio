import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  render,
  screen,
} from '@testing-library/react'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveThreePositionToggleAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveThreePositionToggleCreatorHelper from './InteractiveThreePositionToggleCreatorHelper'

const component = (
  interactiveAssetId?: string,
): IComponent => ({
  id: 'three-position-component',
  parent: 'root',
  type: 'InteractiveThreePositionToggleSwitch',
  props: { interactiveAssetId },
  children: [],
})
const image = (id: string): ForgeUIUploadedAsset => ({
  id,
  name: id,
  type: 'image/png',
  size: 1,
  createdAt: 1,
  browserSrc: id,
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: `fg_${id}`,
  cFile: `${id}.c`,
})

describe('Three-Position Toggle Inspector helper', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('appears when any required visual is missing', () => {
    forgeUIAddUploadedAssets([image('left'), image('center')])
    registerInteractiveAsset({
      ...createDefaultInteractiveThreePositionToggleAsset(
        'incomplete',
      ),
      leftAssetId: 'left',
      centerAssetId: 'center',
    })
    render(
      <ChakraProvider>
        <InteractiveThreePositionToggleCreatorHelper
          component={component('incomplete')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByTestId(
      'three-position-toggle-creator-helper',
    )).toBeInTheDocument()
  })

  it('hides when LEFT, CENTER, and RIGHT visuals resolve', () => {
    forgeUIAddUploadedAssets([
      image('left'),
      image('center'),
      image('right'),
    ])
    registerInteractiveAsset({
      ...createDefaultInteractiveThreePositionToggleAsset(
        'complete',
      ),
      leftAssetId: 'left',
      centerAssetId: 'center',
      rightAssetId: 'right',
    })
    render(
      <ChakraProvider>
        <InteractiveThreePositionToggleCreatorHelper
          component={component('complete')}
        />
      </ChakraProvider>,
    )
    expect(screen.queryByTestId(
      'three-position-toggle-creator-helper',
    )).not.toBeInTheDocument()
  })
})
