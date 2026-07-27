import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'

import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveLightAsset,
  createDefaultInteractiveStatusIndicatorAsset,
  createDefaultInteractiveThreePositionToggleAsset,
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
import {
  ForgeThemeProvider,
} from '~forgeui/theme/ForgeThemeContext'
import { renderForgePreview } from './forgePreviewRenderer'

const image = (
  id: string,
  width = 200,
  height = 100,
): ForgeUIUploadedAsset => ({
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
  width,
  height,
})

const Preview = ({
  component,
}: {
  component: IComponent
}) => {
  const root: IComponent = {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: [component.id],
  }
  return <>{renderForgePreview({
    component: root,
    components: {
      root,
      [component.id]: component,
    },
  })}</>
}

const renderPreview = (component: IComponent) =>
  render(
    <ChakraProvider>
      <ForgeThemeProvider>
        <Preview component={component} />
      </ForgeThemeProvider>
    </ChakraProvider>,
  )

const expectBounds = (
  testId: string,
  bounds: {
    x: number
    y: number
    width: number
    height: number
  },
) => {
  const wrapper = screen.getByTestId(testId).parentElement
  expect(wrapper).toHaveStyle({
    position: 'absolute',
    left: `${bounds.x}px`,
    top: `${bounds.y}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
  })
  return wrapper
}

beforeEach(() => {
  clearInteractiveAssetRegistry()
  forgeUIClearUploadedAssets()
})

it('uses saved Status Indicator geometry as the Browser Preview contain-fit bounds', () => {
  const off = image('status-off')
  const on = image('status-on')
  forgeUIAddUploadedAssets([off, on])
  registerInteractiveAsset({
    ...createDefaultInteractiveStatusIndicatorAsset('status-asset'),
    offAssetId: off.id,
    onAssetId: on.id,
    initialState: 'on',
  })
  const component: IComponent = {
    id: 'status',
    parent: 'root',
    type: 'InteractiveStatusIndicator',
    props: {
      interactiveAssetId: 'status-asset',
      x: 17,
      y: 29,
      w: 240,
      h: 90,
    },
    children: [],
  }
  const view = renderPreview(component)

  expectBounds('interactive-status-indicator-preview', {
    x: 17,
    y: 29,
    width: 240,
    height: 90,
  })
  expect(screen.getByTestId(
    'interactive-status-indicator-preview',
  )).toHaveStyle({ width: '100%', height: '100%' })
  expect(screen.getByTestId(
    'status-indicator-image-bounds',
  )).toHaveStyle({
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  })
  const displayedImage = screen.getByAltText(on.name)
  expect(displayedImage).toHaveStyle({
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  })
  expect(displayedImage).toHaveAttribute('src', on.browserSrc)

  fireEvent.click(screen.getByTestId(
    'interactive-status-indicator-preview',
  ))
  expect(screen.getByAltText(off.name)).toHaveAttribute(
    'src',
    off.browserSrc,
  )

  view.rerender(
    <ChakraProvider>
      <ForgeThemeProvider>
        <Preview component={{
          ...component,
          props: { ...component.props, w: 110, h: 180 },
        }} />
      </ForgeThemeProvider>
    </ChakraProvider>,
  )
  expectBounds('interactive-status-indicator-preview', {
    x: 17,
    y: 29,
    width: 110,
    height: 180,
  })
  expect(screen.getByRole('img')).toHaveStyle({
    objectFit: 'contain',
  })
})

it.each([
  ['InteractiveToggleSwitch', 'interactive-light-preview', 154, 68],
  [
    'InteractiveThreePositionToggleSwitch',
    'three-position-preview',
    210,
    74,
  ],
] as const)(
  'gives %s a definite positioned Browser Preview containing block',
  (type, testId, width, height) => {
    const assets = [
      image(`${type}-one`),
      image(`${type}-two`),
      image(`${type}-three`),
    ]
    forgeUIAddUploadedAssets(assets)
    const asset = type === 'InteractiveToggleSwitch'
      ? {
          ...createDefaultInteractiveToggleSwitchAsset('asset'),
          offAssetId: assets[0].id,
          onAssetId: assets[1].id,
        }
      : {
          ...createDefaultInteractiveThreePositionToggleAsset('asset'),
          leftAssetId: assets[0].id,
          centerAssetId: assets[1].id,
          rightAssetId: assets[2].id,
        }
    registerInteractiveAsset(asset)

    renderPreview({
      id: 'control',
      parent: 'root',
      type,
      props: {
        interactiveAssetId: asset.id,
        x: 31,
        y: 47,
        w: width,
        h: height,
      },
      children: [],
    })

    expectBounds(testId, {
      x: 31,
      y: 47,
      width,
      height,
    })
    expect(screen.getByTestId(testId)).toHaveStyle({
      width: '100%',
      height: '100%',
    })
  },
)

it('aligns the Light Browser Preview wrapper without changing explicit image sizing', () => {
  const off = image('light-off')
  const on = image('light-on')
  forgeUIAddUploadedAssets([off, on])
  registerInteractiveAsset({
    ...createDefaultInteractiveLightAsset('light-asset'),
    offAssetId: off.id,
    onAssetId: on.id,
  })

  renderPreview({
    id: 'light',
    parent: 'root',
    type: 'InteractiveLight',
    props: {
      interactiveAssetId: 'light-asset',
      x: 13,
      y: 23,
      w: 96,
      h: 58,
    },
    children: [],
  })

  expectBounds('interactive-light-preview', {
    x: 13,
    y: 23,
    width: 96,
    height: 58,
  })
  expect(screen.getByAltText(off.name)).toHaveStyle({
    width: '96px',
    height: '58px',
    objectFit: 'contain',
  })
})
