import React from 'react'
import { Checkbox, FormControl, FormLabel, HStack, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUIPwmController } from '~forgeui/ForgeUIPwmController'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

const pwmCheckboxProps = {
  color: INSPECTOR_PROPERTY_TEXT_COLOR,
  sx: {
    '.chakra-checkbox__label': {
      color: 'inherit',
      opacity: 1,
    },
  },
}
const pwmFormLabelProps = { fontSize: 'xs', color: INSPECTOR_PROPERTY_TEXT_COLOR }

export const PwmControllerPanel = () => {
  const { setValue } = useForm()
  const raw = {
    label: usePropsSelector('label'), subtitle: usePropsSelector('subtitle'), value: usePropsSelector('value'),
    minimum: usePropsSelector('minimum'), maximum: usePropsSelector('maximum'), step: usePropsSelector('step'),
    unit: usePropsSelector('unit'), enabled: usePropsSelector('enabled'), showSlider: usePropsSelector('showSlider'),
    showNumericValue: usePropsSelector('showNumericValue'), showEnableControl: usePropsSelector('showEnableControl'),
    orientation: usePropsSelector('orientation'), accentColour: usePropsSelector('accentColour'),
    statusText: usePropsSelector('statusText'), generateRuntimeApi: usePropsSelector('generateRuntimeApi'),
    enableUserEvents: usePropsSelector('enableUserEvents'),
  }
  const model = normalizeForgeUIPwmController(raw)
  const number = (key: 'value'|'minimum'|'maximum'|'step', value: number) => setValue(key, Number.isFinite(value) ? value : model[key])
  return <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}><Text fontSize="sm" fontWeight="bold">ForgeUI Native PWM Controller</Text>
    <FormControl><FormLabel {...pwmFormLabelProps}>Label</FormLabel><Input size="sm" value={model.label} onChange={e => setValue('label', e.target.value)} /></FormControl>
    <FormControl><FormLabel {...pwmFormLabelProps}>Subtitle</FormLabel><Input size="sm" value={model.subtitle} onChange={e => setValue('subtitle', e.target.value)} /></FormControl>
    <HStack>{(['minimum','maximum','step'] as const).map(key => <FormControl key={key}><FormLabel {...pwmFormLabelProps}>{key}</FormLabel><NumberInput size="sm" value={model[key]} min={key === 'step' ? Number.EPSILON : undefined} onChange={(_, v) => number(key, v)}><NumberInputField /></NumberInput></FormControl>)}</HStack>
    <HStack><FormControl><FormLabel {...pwmFormLabelProps}>Value</FormLabel><NumberInput size="sm" min={model.minimum} max={model.maximum} step={model.step} value={model.value} onChange={(_, v) => number('value', v)}><NumberInputField /></NumberInput></FormControl><FormControl><FormLabel {...pwmFormLabelProps}>Unit</FormLabel><Input size="sm" value={model.unit} onChange={e => setValue('unit', e.target.value)} /></FormControl></HStack>
    <Checkbox {...pwmCheckboxProps} isChecked={model.enabled} onChange={e => setValue('enabled', e.target.checked)}>Enabled</Checkbox>
    <Checkbox {...pwmCheckboxProps} isChecked={model.showSlider} onChange={e => setValue('showSlider', e.target.checked)}>Show slider</Checkbox>
    <Checkbox {...pwmCheckboxProps} isChecked={model.showNumericValue} onChange={e => setValue('showNumericValue', e.target.checked)}>Show numeric value</Checkbox>
    <Checkbox {...pwmCheckboxProps} isChecked={model.showEnableControl} onChange={e => setValue('showEnableControl', e.target.checked)}>Show enable control</Checkbox>
    <FormControl><FormLabel {...pwmFormLabelProps}>Orientation</FormLabel><Select size="sm" value={model.orientation} onChange={e => setValue('orientation', e.target.value)}><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></Select></FormControl>
    <FormControl><FormLabel {...pwmFormLabelProps}>Accent colour (blank = theme)</FormLabel><Input size="sm" value={model.accentColour} onChange={e => setValue('accentColour', e.target.value)} /></FormControl>
    <FormControl><FormLabel {...pwmFormLabelProps}>Status text</FormLabel><Input size="sm" value={model.statusText} onChange={e => setValue('statusText', e.target.value)} /></FormControl>
    <Checkbox {...pwmCheckboxProps} isChecked={model.generateRuntimeApi} onChange={e => setValue('generateRuntimeApi', e.target.checked)}>Generate Runtime SDK</Checkbox>
    <Checkbox {...pwmCheckboxProps} isChecked={model.enableUserEvents} onChange={e => setValue('enableUserEvents', e.target.checked)}>Generate UserEvents</Checkbox>
  </Stack>
}
