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
  getInteractiveButtonAsset,
  registerInteractiveAsset,
  updateInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveButtonCreatorHelper from './InteractiveButtonCreatorHelper'

const mockUpdateProps = jest.fn()
jest.mock('~hooks/useDispatch', () => () => ({
  components: {
    updateProps: mockUpdateProps,
  },
}))

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
    mockUpdateProps.mockClear()
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

  it('shows the generated callback for a complete Button', () => {
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
    expect(screen.getByTestId('button-hook-preview'))
      .toHaveTextContent('FG_On_Button_Clicked(void)')
    expect(screen.queryByText('Button not configured'))
      .not.toBeInTheDocument()
  })

  it('shows a duplicate warning and clears it after a unique Label change', () => {
    forgeUIAddUploadedAssets([image('normal'), image('pressed')])
    registerInteractiveAsset({
      ...createDefaultInteractiveButtonAsset('blue', 'Blue Start Button'),
      label: 'Start Button',
      normalAssetId: 'normal',
      pressedAssetId: 'pressed',
    })
    registerInteractiveAsset({
      ...createDefaultInteractiveButtonAsset('silver', 'Silver Start Button'),
      label: 'Start-Button',
      normalAssetId: 'normal',
      pressedAssetId: 'pressed',
    })
    const selected = component('comp-blue', 'blue')
    const other = component('comp-silver', 'silver')
    render(
      <ChakraProvider>
        <InteractiveButtonCreatorHelper
          component={selected}
          components={{
            'comp-blue': selected,
            'comp-silver': other,
          }}
        />
      </ChakraProvider>,
    )

    expect(screen.getByTestId('button-hook-preview'))
      .toHaveTextContent('FG_On_StartButton_Clicked(void)')
    expect(screen.getByTestId('button-hook-conflict-warning'))
      .toHaveTextContent('Rename this Button’s Label')
    expect(screen.getByTestId('button-hook-conflict-warning'))
      .toHaveTextContent('comp-silver')

    updateInteractiveAsset('blue', {
      label: 'Launch Button',
    })
    fireEvent(
      window,
      new Event('forgeui-interactive-assets-updated'),
    )

    expect(screen.getByTestId('button-hook-preview'))
      .toHaveTextContent('FG_On_LaunchButton_Clicked(void)')
    expect(screen.queryByTestId('button-hook-conflict-warning'))
      .not.toBeInTheDocument()
    expect(getInteractiveButtonAsset('silver')?.label)
      .toBe('Start-Button')
  })
})
