import React from 'react'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { Input, Select } from '@chakra-ui/react'

import { FORGEUI_IMAGE_ASSETS } from '~forgeui/ForgeUIAssetRegistry'
import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

const ImagePanel = () => {
  const { setValueFromEvent } = useForm()

  const src = usePropsSelector('src')
  const fallbackSrc = usePropsSelector('fallbackSrc')
  const alt = usePropsSelector('alt')
  const htmlHeight = usePropsSelector('htmlHeight')
  const htmlWidth = usePropsSelector('htmlWidth')
  const objectFit = usePropsSelector('objectFit')
  const imageScale = usePropsSelector('imageScale')

  const uploadedAssets = forgeUIGetUploadedAssets()
  const uploadedAssetId = usePropsSelector('uploadedAssetId')

  return (
    <>
      <FormControl label="Source" htmlFor="src">
        <Input
          placeholder="Image URL"
          value={src || ''}
          size="sm"
          name="src"
          onChange={setValueFromEvent}
        />
      </FormControl>

      <FormControl label="Preset image" htmlFor="presetImage">
        <Select
          placeholder="Select preset image"
          size="sm"
          bg="#1a202c"
          color="white"
          borderColor="#2dd4bf"
          value={src || ''}
          onChange={(e) => {
            const value = e.target.value

            setValueFromEvent({
              target: {
                name: 'src',
                value,
              },
            } as any)
          }}
        >
          {FORGEUI_IMAGE_ASSETS.map((asset) => (
            <option
              key={asset.name}
              value={asset.src}
              style={{
                background: '#1a202c',
                color: 'white',
              }}
            >
              {asset.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl
        label="Uploaded asset"
        htmlFor="uploadedAssetId"
      >
        <Select
          placeholder="Select uploaded asset"
          size="sm"
          bg="#1a202c"
          color="white"
          borderColor="#2dd4bf"
          value={uploadedAssetId || ''}
          onChange={(e) => {
            const assetId = e.target.value

            const asset = uploadedAssets.find(
              (a) => a.id === assetId,
            )

            setValueFromEvent({
              target: {
                name: 'uploadedAssetId',
                value: assetId,
              },
            } as any)

            if (asset) {
  setValueFromEvent({
    target: {
      name: 'src',
      value: asset.browserSrc,
    },
  } as any)

  setValueFromEvent({
    target: {
      name: 'alt',
      value: asset.name,
    },
  } as any)
}
          }}
        >
          {uploadedAssets.map((asset) => (
            <option
              key={asset.id}
              value={asset.id}
              style={{
                background: '#1a202c',
                color: 'white',
              }}
            >
              {asset.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl label="Fallback Src" htmlFor="fallbackSrc">
        <Input
          placeholder="Image URL"
          value={fallbackSrc || ''}
          size="sm"
          name="fallbackSrc"
          onChange={setValueFromEvent}
        />
      </FormControl>

      <FormControl label="Alt" htmlFor="alt">
        <Input
          value={alt || ''}
          size="sm"
          name="alt"
          onChange={setValueFromEvent}
        />
      </FormControl>

      <FormControl label="Object fit" htmlFor="objectFit">
        <Select
          value={objectFit || 'contain'}
          size="sm"
          name="objectFit"
          onChange={setValueFromEvent}
        >
          <option value="contain">contain</option>
          <option value="cover">cover</option>
          <option value="fill">fill</option>
        </Select>
      </FormControl>

      <FormControl
        label="LVGL image scale"
        htmlFor="imageScale"
      >
        <Select
          value={imageScale || 256}
          size="sm"
          name="imageScale"
          onChange={setValueFromEvent}
        >
          <option value="128">128 - half size</option>
          <option value="256">256 - normal</option>
          <option value="384">384 - 1.5x</option>
          <option value="512">512 - 2x</option>
          <option value="768">768 - 3x</option>
        </Select>
      </FormControl>

      <FormControl label="Html height" htmlFor="htmlHeight">
        <Input
          value={htmlHeight || ''}
          size="sm"
          name="htmlHeight"
          onChange={setValueFromEvent}
        />
      </FormControl>

      <FormControl label="Html width" htmlFor="htmlWidth">
        <Input
          value={htmlWidth || ''}
          size="sm"
          name="htmlWidth"
          onChange={setValueFromEvent}
        />
      </FormControl>
    </>
  )
}

export default ImagePanel