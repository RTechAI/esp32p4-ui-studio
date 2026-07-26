import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import InteractiveThreePositionTogglePreview, { stateFromThreePositionClientX } from './InteractiveThreePositionTogglePreview'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type { ForgeUIUploadedAsset } from '~forgeui/ForgeUIUploadedAssetRegistry'

const artwork = (id: string): ForgeUIUploadedAsset => ({
  id, name: `${id}.png`, type: 'image/png', size: 1,
  createdAt: 1, browserSrc: id, kind: 'uploaded',
  exportStatus: 'lvgl_ready', lvgl: id, cFile: `${id}.c`,
})

it('maps screen coordinates to all three local hit zones at any control position',()=>{expect(stateFromThreePositionClientX(10,0,90)).toBe('left');expect(stateFromThreePositionClientX(345,300,90)).toBe('center');expect(stateFromThreePositionClientX(980,900,90)).toBe('right');expect(stateFromThreePositionClientX(899,900,90)).toBeUndefined();expect(stateFromThreePositionClientX(990,900,90)).toBeUndefined()})

it('shows the zone guide only when the designer requests it',()=>{const {rerender}=render(<ChakraProvider><InteractiveThreePositionTogglePreview width={90} height={30} state="center"/></ChakraProvider>);expect(screen.queryByTestId('three-position-zone-overlay')).not.toBeInTheDocument();rerender(<ChakraProvider><InteractiveThreePositionTogglePreview width={90} height={30} state="center" showZoneOverlay/></ChakraProvider>);expect(screen.getByTestId('three-position-zone-overlay')).toHaveTextContent('LEFTCENTERRIGHT')})
it('persists the selected preview state through direct callbacks',()=>{let state:'left'|'center'|'right'='center';const onStateChange=jest.fn(next=>{state=next});render(<ChakraProvider><InteractiveThreePositionTogglePreview width={90} height={30} state={state} onStateChange={onStateChange}/></ChakraProvider>);const preview=screen.getByTestId('three-position-preview');jest.spyOn(preview,'getBoundingClientRect').mockReturnValue({left:0,width:90,right:90,top:0,bottom:30,height:30,x:0,y:0,toJSON:()=>({})});fireEvent.click(preview,{clientX:5});expect(onStateChange).toHaveBeenCalledWith('left');fireEvent.click(preview,{clientX:45});expect(onStateChange).toHaveBeenCalledWith('center');fireEvent.click(preview,{clientX:85});expect(onStateChange).toHaveBeenCalledWith('right')})

it('uses compact icon-only and expanded hinted empty states',()=>{const view=render(<ChakraProvider><InteractiveThreePositionTogglePreview width={96} height={36} state="center"/></ChakraProvider>);expect(screen.getByTestId('unconfigured-three-position-placeholder')).toHaveAttribute('data-layout','compact');expect(screen.queryByText('LEFT')).not.toBeInTheDocument();view.rerender(<ChakraProvider><InteractiveThreePositionTogglePreview width={240} height={100} state="center"/></ChakraProvider>);expect(screen.getByTestId('unconfigured-three-position-placeholder')).toHaveAttribute('data-layout','full');expect(screen.getByText('LEFT')).toBeInTheDocument();expect(screen.getByText('CENTER')).toBeInTheDocument();expect(screen.getByText('RIGHT')).toBeInTheDocument()})

it('fills component bounds and measures all three states automatically',()=>{
  forgeUIClearUploadedAssets()
  const left=artwork('left');const center=artwork('center');const right=artwork('right')
  forgeUIAddUploadedAssets([left,center,right])
  const pixels=new Uint8ClampedArray(16);pixels[3]=255
  jest.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({
    drawImage:jest.fn(),getImageData:jest.fn(()=>({data:pixels})),
  } as unknown as CanvasRenderingContext2D)
  const {container}=render(<ChakraProvider><InteractiveThreePositionTogglePreview
    leftAsset={left} centerAsset={center} rightAsset={right}
    width={300} height={150} state="center" fillContainer
  /></ChakraProvider>)
  expect(screen.getByTestId('three-position-preview')).toHaveStyle({
    width:'100%',height:'100%',
  })
  expect(screen.getByAltText('center artwork')).toHaveStyle({
    width:'100%',height:'100%',objectFit:'contain',display:'block',
  })
  const images=container.querySelectorAll('img');expect(images).toHaveLength(3)
  images.forEach(image=>{Object.defineProperty(image,'naturalWidth',{configurable:true,value:2});Object.defineProperty(image,'naturalHeight',{configurable:true,value:2});fireEvent.load(image)})
  expect(forgeUIGetUploadedAssets().every(asset=>
    asset.width===2&&asset.height===2&&asset.contentWidth===1&&asset.contentHeight===1,
  )).toBe(true)
  jest.restoreAllMocks()
})
