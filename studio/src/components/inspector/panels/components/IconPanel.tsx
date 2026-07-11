import React, { memo, useEffect, useState } from 'react'
import { Button } from '@chakra-ui/react'
import ColorsControl from '~components/inspector/controls/ColorsControl'
import InputSuggestion from '~components/inspector/inputs/InputSuggestion'
import theme from '@chakra-ui/theme'
import { ComboboxOption } from '@reach/combobox'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import IconBrowserModal from '~forgeui/icons/IconBrowserModal'

const IconPanel = () => {
  const [iconBrowserOpen, setIconBrowserOpen] = useState(false)
    const { setValueFromEvent } = useForm()

  useEffect(() => {
    const openIconBrowser = () => {
      setIconBrowserOpen(true)
    }

    window.addEventListener(
      'forgeui-open-icon-browser',
      openIconBrowser,
    )

    return () => {
      window.removeEventListener(
        'forgeui-open-icon-browser',
        openIconBrowser,
      )
    }
  }, [])

  const boxSize = usePropsSelector('boxSize')
  const icon = usePropsSelector('icon')

  return (
    <>
      <FormControl label="Icon" htmlFor="iconBrowser">
        <Button
          id="iconBrowser"
          size="sm"
          width="100%"
          justifyContent="flex-start"
          onClick={() => setIconBrowserOpen(true)}
        >
          {icon || 'Choose icon'}
        </Button>
      </FormControl>

      <IconBrowserModal
        isOpen={iconBrowserOpen}
        onClose={() => setIconBrowserOpen(false)}
        onSelect={selection => {
          setValueFromEvent({
            target: {
              name: 'icon',
              value: selection.iconName,
            },
          })

          setValueFromEvent({
            target: {
              name: 'src',
              value: selection.src,
            },
          })

          setValueFromEvent({
            target: {
              name: 'uploadedAssetId',
              value: selection.uploadedAssetId,
            },
          })

          setValueFromEvent({
            target: {
              name: 'assetName',
              value: selection.assetName,
            },
          })
        }}
      />

      <FormControl label="Size" htmlFor="boxSize">
        <InputSuggestion
          value={boxSize}
          handleChange={setValueFromEvent}
          name="boxSize"
        >
          {Object.keys(theme.sizes).map((option, index) => (
            <ComboboxOption key={index} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>

      <ColorsControl withFullColor label="Color" name="color" enableHues />
    </>
  )
}

export default memo(IconPanel)