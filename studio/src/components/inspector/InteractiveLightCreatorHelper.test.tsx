import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveLightAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveLightCreatorHelper from './InteractiveLightCreatorHelper'

const component = (
  id: string,
  interactiveAssetId?: string,
): IComponent => ({
  id,
  parent: 'root',
  type: 'InteractiveLight',
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

describe('Interactive Light Inspector creator helper', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('opens the shared Light creator request while incomplete', () => {
    const listener = jest.fn()
    window.addEventListener('forgeui-open-ai-playground', listener)
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper
          component={component('light', 'light-asset')}
        />
      </ChakraProvider>,
    )
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Light Creator',
    }))
    expect(
      (listener.mock.calls[0][0] as CustomEvent).detail,
    ).toMatchObject({
      target: 'interactive-light-designer',
      sourceComponentId: 'light',
      interactiveAssetId: 'light-asset',
    })
    window.removeEventListener('forgeui-open-ai-playground', listener)
  })

  it('hides for a complete Light with available artwork', () => {
    forgeUIAddUploadedAssets([image('off'), image('on')])
    registerInteractiveAsset({
      ...createDefaultInteractiveLightAsset('complete-light'),
      offAssetId: 'off',
      onAssetId: 'on',
    })
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper
          component={component('light', 'complete-light')}
        />
      </ChakraProvider>,
    )
    expect(screen.queryByTestId('light-creator-helper'))
      .not.toBeInTheDocument()
  })
})
