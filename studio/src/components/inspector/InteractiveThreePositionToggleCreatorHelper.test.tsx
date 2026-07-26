import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  fireEvent,
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

jest.mock('~hooks/useDispatch', () => () => ({
  components: { updateProps: jest.fn() },
}))

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

  it('keeps the configured helper when all visuals resolve', () => {
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
    const listener = jest.fn()
    window.addEventListener('forgeui-open-ai-playground', listener)
    render(
      <ChakraProvider>
        <InteractiveThreePositionToggleCreatorHelper
          component={component('complete')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByTestId(
      'three-position-toggle-creator-helper',
    )).toBeInTheDocument()
    expect(screen.getByText('Interactive Three-Position Toggle'))
      .toBeInTheDocument()
    expect(screen.getByRole('button', {
      name: 'Fit Bounds to Visible Artwork',
    })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Three-Position Toggle Creator',
    }))
    expect((listener.mock.calls[0][0] as CustomEvent).detail)
      .toMatchObject({
        sourceComponentId: 'three-position-component',
        interactiveAssetId: 'complete',
      })
    window.removeEventListener('forgeui-open-ai-playground', listener)
  })
})
