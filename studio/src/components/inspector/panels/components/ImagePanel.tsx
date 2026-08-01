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
import SwitchControl from '~components/inspector/controls/SwitchControl'

const ImagePanel = () => {
  const { setValueFromEvent } = useForm()

  const selectedImageFit = usePropsSelector('imageFit')
  const legacyObjectFit = usePropsSelector('objectFit')
  const imageFit = selectedImageFit || legacyObjectFit

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

            if (asset.width && asset.height) {
              setValueFromEvent({
                target: { name: 'sourceWidth', value: asset.width },
              } as any)
              setValueFromEvent({
                target: { name: 'sourceHeight', value: asset.height },
              } as any)
            }

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
        label="Image fit"
        htmlFor="imageFit"
      >
        <Select
          value={imageFit || 'contain'}
          size="sm"
          name="imageFit"
          onChange={setValueFromEvent}
        >
          <option value="contain">
            contain
          </option>

          <option value="cover">
            cover
          </option>

          <option value="native">
            native
          </option>
        </Select>
      </FormControl>

      <SwitchControl name="visible" label="Visible" defaultValue />
    </>
  )
}

export default ImagePanel
