import React from 'react'
import { Select } from '@chakra-ui/react'

import FormControl from
  '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from
  '~hooks/usePropsSelector'

import {
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

const ImagePanel = () => {
  const { setValueFromEvent } = useForm()

  const objectFit =
    usePropsSelector('objectFit')

  const imageScale =
    usePropsSelector('imageScale')

  const uploadedAssetId =
    usePropsSelector('uploadedAssetId')

  const uploadedAssets =
    forgeUIGetUploadedAssets()

  return (
    <>
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
              item => item.id === assetId,
            )

            setValueFromEvent({
              target: {
                name: 'uploadedAssetId',
                value: assetId,
              },
            } as any)

            if (!asset) return

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
          }}
        >
          {uploadedAssets.map(asset => (
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

      <FormControl
        label="Object fit"
        htmlFor="objectFit"
      >
        <Select
          value={objectFit || 'contain'}
          size="sm"
          name="objectFit"
          onChange={setValueFromEvent}
        >
          <option value="contain">
            contain
          </option>

          <option value="cover">
            cover
          </option>

          <option value="fill">
            fill
          </option>
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
          <option value="128">
            128 - half size
          </option>

          <option value="256">
            256 - normal
          </option>

          <option value="384">
            384 - 1.5x
          </option>

          <option value="512">
            512 - 2x
          </option>

          <option value="768">
            768 - 3x
          </option>
        </Select>
      </FormControl>
    </>
  )
}

export default ImagePanel