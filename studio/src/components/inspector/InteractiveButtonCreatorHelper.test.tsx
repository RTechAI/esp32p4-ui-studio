import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveButtonCreatorHelper from './InteractiveButtonCreatorHelper'

const component = (
  id: string,
  interactiveAssetId?: string,
): IComponent => ({
  id,
  parent: 'root',
  type: 'InteractiveButton',
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

describe('Interactive Button Inspector creator helper', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('opens the shared Button creator request while incomplete', () => {
    const listener = jest.fn()
    window.addEventListener(
      'forgeui-open-ai-playground',
      listener,
    )
    render(
      <ChakraProvider>
        <InteractiveButtonCreatorHelper
          component={component('button', 'asset')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByText('Button not configured'))
      .toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Button Creator',
    }))
    expect(
      (listener.mock.calls[0][0] as CustomEvent).detail,
    ).toMatchObject({
      target: 'interactive-button-designer',
      sourceComponentId: 'button',
      interactiveAssetId: 'asset',
    })
    window.removeEventListener(
      'forgeui-open-ai-playground',
      listener,
    )
  })

  it('hides for a complete Button with available artwork', () => {
    forgeUIAddUploadedAssets([image('normal'), image('pressed')])
    registerInteractiveAsset({
      ...createDefaultInteractiveButtonAsset('complete'),
      normalAssetId: 'normal',
      pressedAssetId: 'pressed',
    })
    render(
      <ChakraProvider>
        <InteractiveButtonCreatorHelper
          component={component('button', 'complete')}
        />
      </ChakraProvider>,
    )
    expect(screen.queryByTestId('button-creator-helper'))
      .not.toBeInTheDocument()
  })
})
