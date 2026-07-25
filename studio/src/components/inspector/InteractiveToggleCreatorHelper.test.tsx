import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveToggleSwitchAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveToggleCreatorHelper from './InteractiveToggleCreatorHelper'

const toggleComponent = (
  id: string,
  interactiveAssetId?: string,
): IComponent => ({
  id,
  parent: 'root',
  type: 'InteractiveToggleSwitch',
  props: { interactiveAssetId },
  children: [],
})

const image = (id: string): ForgeUIUploadedAsset => ({
  id,
  name: `${id}.png`,
  type: 'image/png',
  size: 1,
  createdAt: 1,
  browserSrc: `data:image/png;base64,${id}`,
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: `fg_${id}`,
  cFile: `${id}.c`,
})

describe('Interactive Toggle Inspector creator helper', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('guides a blank Toggle through the shared navigation request', () => {
    const listener = jest.fn()
    window.addEventListener(
      'forgeui-open-ai-playground',
      listener,
    )
    render(
      <ChakraProvider>
        <InteractiveToggleCreatorHelper
          component={toggleComponent('blank-toggle')}
        />
      </ChakraProvider>,
    )

    expect(screen.getByText('Toggle not configured'))
      .toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Toggle Creator',
    }))
    expect(
      (listener.mock.calls[0][0] as CustomEvent).detail,
    ).toMatchObject({
      target: 'interactive-toggle-switch-designer',
      sourceComponentId: 'blank-toggle',
    })
    expect(
      (listener.mock.calls[0][0] as CustomEvent).detail,
    ).not.toHaveProperty('interactiveAssetId')
    window.removeEventListener(
      'forgeui-open-ai-playground',
      listener,
    )
  })

  it('passes each incomplete Toggle own linked asset', () => {
    const listener = jest.fn()
    window.addEventListener(
      'forgeui-open-ai-playground',
      listener,
    )
    const view = render(
      <ChakraProvider>
        <InteractiveToggleCreatorHelper
          component={toggleComponent('first', 'first-asset')}
        />
      </ChakraProvider>,
    )
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Toggle Creator',
    }))

    view.rerender(
      <ChakraProvider>
        <InteractiveToggleCreatorHelper
          component={toggleComponent('second', 'second-asset')}
        />
      </ChakraProvider>,
    )
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Toggle Creator',
    }))

    expect(listener.mock.calls.map(call => (
      call[0] as CustomEvent
    ).detail)).toEqual([
      expect.objectContaining({
        sourceComponentId: 'first',
        interactiveAssetId: 'first-asset',
      }),
      expect.objectContaining({
        sourceComponentId: 'second',
        interactiveAssetId: 'second-asset',
      }),
    ])
    window.removeEventListener(
      'forgeui-open-ai-playground',
      listener,
    )
  })

  it('hides when the linked Toggle has both artwork assets', () => {
    forgeUIAddUploadedAssets([
      image('off-image'),
      image('on-image'),
    ])
    registerInteractiveAsset({
      ...createDefaultInteractiveToggleSwitchAsset(
        'complete-toggle',
      ),
      offAssetId: 'off-image',
      onAssetId: 'on-image',
    })

    render(
      <ChakraProvider>
        <InteractiveToggleCreatorHelper
          component={toggleComponent(
            'configured',
            'complete-toggle',
          )}
        />
      </ChakraProvider>,
    )

    expect(screen.queryByTestId('toggle-creator-helper'))
      .not.toBeInTheDocument()
  })

  it('hides automatically when an incomplete linked set becomes complete', () => {
    render(
      <ChakraProvider>
        <InteractiveToggleCreatorHelper
          component={toggleComponent(
            'pending',
            'completed-later',
          )}
        />
      </ChakraProvider>,
    )
    expect(screen.getByTestId('toggle-creator-helper'))
      .toBeInTheDocument()

    act(() => {
      registerInteractiveAsset({
        ...createDefaultInteractiveToggleSwitchAsset(
          'completed-later',
        ),
        offAssetId: 'later-off',
        onAssetId: 'later-on',
      })
      forgeUIAddUploadedAssets([
        image('later-off'),
        image('later-on'),
      ])
    })

    expect(screen.queryByTestId('toggle-creator-helper'))
      .not.toBeInTheDocument()
  })
})
