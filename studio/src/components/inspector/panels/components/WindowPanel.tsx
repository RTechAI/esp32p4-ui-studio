import React from 'react'
import { Button, Checkbox, HStack, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeWindowActions } from '~forgeui/ForgeUIWindow'

export const WindowPanel = () => {
  const { setValue } = useForm()
  const value = (name: string, fallback?: any) => usePropsSelector(name) ?? fallback
  const actions = normalizeWindowActions(usePropsSelector('actionButtons'))
  return <Stack spacing={3}>
    <Text fontSize="sm" fontWeight="bold">Header</Text>
    <Input size="sm" aria-label="Window title" value={value('title', 'Window')} onChange={e => setValue('title', e.target.value)} />
    <Select size="sm" aria-label="Title alignment" value={value('titleAlign', 'left')} onChange={e => setValue('titleAlign', e.target.value)}>
      <option value="left">Left</option><option value="center">Centre</option><option value="right">Right</option>
    </Select>
    <Checkbox isChecked={value('showIcon', true)} onChange={e => setValue('showIcon', e.target.checked)}>Show title icon</Checkbox>
    <Input size="sm" aria-label="Title icon" value={value('titleIcon', 'FiLayout')} onChange={e => setValue('titleIcon', e.target.value)} />
    <NumberInput size="sm" min={28} max={120} value={value('headerHeight', 48)} onChange={(_, n) => setValue('headerHeight', n)}><NumberInputField aria-label="Header height" /></NumberInput>
    <Input size="sm" type="color" aria-label="Header background" value={value('headerBackground', '#172033')} onChange={e => setValue('headerBackground', e.target.value)} />
    <Input size="sm" type="color" aria-label="Header text colour" value={value('headerTextColor', '#F8FAFC')} onChange={e => setValue('headerTextColor', e.target.value)} />
    <Checkbox isChecked={value('showCloseButton', true)} onChange={e => setValue('showCloseButton', e.target.checked)}>Show close button</Checkbox>
    <Text fontSize="xs" fontWeight="bold">Action buttons</Text>
    {actions.map((action, index) => <HStack key={action.id}>
      <Input size="sm" aria-label={`Action ${index + 1} symbol`} value={action.icon}
        onChange={e => setValue('actionButtons', actions.map((item, i) => i === index ? { ...item, icon: e.target.value } : item))} />
      <Checkbox aria-label={`Action ${index + 1} enabled`} isChecked={action.enabled}
        onChange={e => setValue('actionButtons', actions.map((item, i) => i === index ? { ...item, enabled: e.target.checked } : item))}>Enabled</Checkbox>
      <Button size="xs" onClick={() => setValue('actionButtons', actions.filter((_, i) => i !== index))}>Remove</Button>
    </HStack>)}
    <Button size="xs" isDisabled={actions.length >= 4} onClick={() => setValue('actionButtons', [...actions, {
      id: `action-${Date.now()}`, icon: 'LV_SYMBOL_SETTINGS', enabled: true,
    }])}>Add action</Button>
    <Text fontSize="sm" fontWeight="bold">Content</Text>
    <Input size="sm" type="color" aria-label="Content background" value={value('contentBackground', '#0F172A')} onChange={e => setValue('contentBackground', e.target.value)} />
    <NumberInput size="sm" min={0} max={64} value={value('contentPadding', 8)} onChange={(_, n) => setValue('contentPadding', n)}><NumberInputField aria-label="Content padding" /></NumberInput>
    <Checkbox isChecked={value('scrollingEnabled', true)} onChange={e => setValue('scrollingEnabled', e.target.checked)}>Scrollable content</Checkbox>
    <Select size="sm" aria-label="Scrollbar mode" value={value('scrollbarMode', 'auto')} onChange={e => setValue('scrollbarMode', e.target.value)}>
      <option value="auto">Auto</option><option value="active">While scrolling</option><option value="on">Always</option><option value="off">Off</option>
    </Select>
    <Checkbox isChecked={value('childClipping', true)} onChange={e => setValue('childClipping', e.target.checked)}>Clip children to content</Checkbox>
    <Text fontSize="sm" fontWeight="bold">Frame</Text>
    <NumberInput size="sm" min={0} max={16} value={value('borderWidth', 1)} onChange={(_, n) => setValue('borderWidth', n)}><NumberInputField aria-label="Border width" /></NumberInput>
    <Input size="sm" type="color" aria-label="Border colour" value={value('borderColor', '#334155')} onChange={e => setValue('borderColor', e.target.value)} />
    <NumberInput size="sm" min={0} max={48} value={value('cornerRadius', 10)} onChange={(_, n) => setValue('cornerRadius', n)}><NumberInputField aria-label="Corner radius" /></NumberInput>
  </Stack>
}
