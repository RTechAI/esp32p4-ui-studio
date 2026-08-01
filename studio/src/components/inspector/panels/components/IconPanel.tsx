import React, { memo, useEffect, useState } from 'react'
import { Button, Divider, Text } from '@chakra-ui/react'
import ColorsControl from '~components/inspector/controls/ColorsControl'
import InputSuggestion from '~components/inspector/inputs/InputSuggestion'
import theme from '@chakra-ui/theme'
import { ComboboxOption } from '@reach/combobox'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import IconBrowserModal from '~forgeui/icons/IconBrowserModal'
import SwitchControl from '~components/inspector/controls/SwitchControl'
import NumberControl from '~components/inspector/controls/NumberControl'

const IconPanel = () => {
  const [iconBrowserOpen, setIconBrowserOpen] = useState(false)
  const { setValue, setValueFromEvent } = useForm()

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
  const enableClick = usePropsSelector('enableClick') === true

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
          setValue('icon', selection.iconName)
          setValue('src', selection.src)
          setValue('uploadedAssetId', selection.uploadedAssetId)
          setValue('assetName', selection.assetName)
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

      <Divider my={3} />
      <Text fontSize="xs" fontWeight="bold" mb={1}>Interaction</Text>
      <SwitchControl name="enableClick" label="Enable tap/click" />
      {enableClick && (
        <>
          <ColorsControl withFullColor label="Pressed color" name="pressedColor" enableHues />
          <NumberControl name="pressedOpacity" label="Pressed opacity (%)" min={0} max={100} precision={0} />
        </>
      )}
      <Text fontSize="xs" fontWeight="bold" mt={3} mb={1}>Runtime Presentation</Text>
      <SwitchControl name="generateRuntimeApi" label="Generate runtime API" defaultValue />
    </>
  )
}

export default memo(IconPanel)
