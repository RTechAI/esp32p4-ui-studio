import React, { memo, useState } from 'react'
import { Button } from '@chakra-ui/react'
import ColorsControl from '~components/inspector/controls/ColorsControl'
import InputSuggestion from '~components/inspector/inputs/InputSuggestion'
import theme from '@chakra-ui/theme'
import { ComboboxOption } from '@reach/combobox'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import IconControl from '~components/inspector/controls/IconControl'
import { FORGEUI_ICON_ASSETS } from '~forgeui/ForgeUIIconRegistry'
import IconBrowserModal from '~forgeui/icons/IconBrowserModal'
import { useSelector } from 'react-redux'
import useDispatch from '~hooks/useDispatch'
import { getSelectedComponent } from '~core/selectors/components'

const IconPanel = () => {
  const [iconBrowserOpen, setIconBrowserOpen] = useState(false)
  const { setValueFromEvent } = useForm()

  const dispatch = useDispatch()
  const component = useSelector(getSelectedComponent)

  const boxSize = usePropsSelector('boxSize')
  const icon = usePropsSelector('icon')

  return (
    <>
      <FormControl label="Preset icon" htmlFor="presetIcon">
        <InputSuggestion
          value={icon || ''}
          handleChange={setValueFromEvent}
          name="icon"
        >
          {FORGEUI_ICON_ASSETS.map((asset, index) => (
            <ComboboxOption key={index} value={asset.icon} />
          ))}
        </InputSuggestion>
      </FormControl>

      <Button
        size="sm"
        width="100%"
        mb={3}
        onClick={() => setIconBrowserOpen(true)}
      >
        Browse Icons
      </Button>

      <IconBrowserModal
        isOpen={iconBrowserOpen}
        onClose={() => setIconBrowserOpen(false)}
        onSelect={iconName => {
          setValueFromEvent({
            target: {
              name: 'icon',
              value: iconName,
            },
          })
        }}
        onAssetsAdded={() => {
          dispatch.components.deleteComponent(component.id)
        }}
      />

      <IconControl label="Icon" name="icon" />

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