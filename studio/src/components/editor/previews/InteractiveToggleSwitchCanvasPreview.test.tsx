import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { clearInteractiveAssetRegistry, createDefaultInteractiveToggleSwitchAsset, registerInteractiveAsset } from '~forgeui/interactive'
import { forgeUIAddUploadedAssets, forgeUIClearUploadedAssets } from '~forgeui/ForgeUIUploadedAssetRegistry'
import type { ForgeUIUploadedAsset } from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveToggleSwitchCanvasPreview from './InteractiveToggleSwitchCanvasPreview'

const image = (id: string): ForgeUIUploadedAsset => ({ id, name: id, type: 'image/png', size: 1, createdAt: 1, browserSrc: id, kind: 'uploaded', exportStatus: 'lvgl_ready', lvgl: `fg_${id}`, cFile: `${id}.c` })

it('keeps its toggled Canvas state until clicked again', () => {
  clearInteractiveAssetRegistry(); forgeUIClearUploadedAssets()
  const off = image('off'); const on = image('on'); forgeUIAddUploadedAssets([off, on])
  const asset = { ...createDefaultInteractiveToggleSwitchAsset('toggle'), offAssetId: off.id, onAssetId: on.id }
  registerInteractiveAsset(asset)
  const component: IComponent = { id: 'toggle', parent: 'root', type: 'InteractiveToggleSwitch', props: { interactiveAssetId: asset.id, w: 64, h: 36 }, children: [] }
  render(<ChakraProvider><InteractiveToggleSwitchCanvasPreview component={component} /></ChakraProvider>)
  const preview = screen.getByTestId('interactive-light-preview')
  expect(preview).toHaveAttribute('data-state', 'off')
  fireEvent.click(preview); expect(preview).toHaveAttribute('data-state', 'on')
  fireEvent.click(preview); expect(preview).toHaveAttribute('data-state', 'off')
})
