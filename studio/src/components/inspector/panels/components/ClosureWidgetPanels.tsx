import React from 'react'
import { Button, Checkbox, HStack, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { forgeUIGetUploadedAssets } from '~forgeui/ForgeUIUploadedAssetRegistry'
import { addForgeUISpan, moveForgeUISpan, normalizeForgeUISpans, normalizeFrameAssetIds, removeForgeUISpan, updateForgeUISpan } from '~forgeui/ForgeUIClosureWidgets'
import { openForgeUIAnimationFramePicker } from '~forgeui/assets/ForgeUIAssetSelection'

const AssetSelect = ({ value, onChange }: { value?: string, onChange: (id: string) => void }) =>
  <Select size="sm" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Select uploaded asset">
    {forgeUIGetUploadedAssets().map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}
  </Select>

export const SpanPanel = () => {
  const { setValue } = useForm(); const spans = normalizeForgeUISpans(usePropsSelector('spans'))
  const textAlign = usePropsSelector('textAlign') || 'left'
  const overflow = usePropsSelector('overflow') || 'ellipsis'
  const update = (id: string, patch: any) => setValue('spans', updateForgeUISpan(spans, id, patch))
  return <Stack spacing={3}><Text fontSize="sm" fontWeight="bold">Ordered rich-text spans</Text>
    {spans.length === 0 && <Text fontSize="xs" color="gray.400">No spans yet. Add the first span below.</Text>}
    {spans.map((span, index) => <Stack key={span.id} p={2} border="1px solid #334155" borderRadius="md">
      <Text fontSize="xs" fontWeight="bold">Span {index + 1}</Text>
      <Text fontSize="xs">Text</Text><Input aria-label={`Span ${index + 1} text`} size="sm" value={span.text} onChange={e => update(span.id, { text: e.target.value })} placeholder="Text" />
      <Text fontSize="xs">Semantic colour</Text><Select aria-label={`Span ${index + 1} semantic colour`} size="sm" value={span.semanticColor || 'textPrimary'} onChange={e => update(span.id, { semanticColor: e.target.value })}>
        {['textPrimary','textSecondary','accent','accentText','disabledText','healthNormal','healthHigh','healthCritical'].map(role => <option key={role}>{role}</option>)}
      </Select>
      <Checkbox isChecked={Boolean(span.color)} onChange={e => update(span.id, { color: e.target.checked ? '#FFFFFF' : '' })}>Use explicit colour override</Checkbox>
      {span.color && <Input aria-label={`Span ${index + 1} explicit colour`} size="sm" type="color" value={span.color} onChange={e => update(span.id, { color: e.target.value })} />}
      <Text fontSize="xs">Font size</Text><NumberInput size="sm" min={8} max={48} value={span.fontSize || 16} onChange={(_, value) => update(span.id, { fontSize: value })}><NumberInputField aria-label={`Span ${index + 1} font size`} /></NumberInput>
      <Checkbox isChecked={span.underline} onChange={e => update(span.id, { underline: e.target.checked })}>Underline</Checkbox>
      <HStack><Button size="xs" isDisabled={index === 0} onClick={() => setValue('spans', moveForgeUISpan(spans, span.id, -1))}>Move up</Button>
        <Button size="xs" isDisabled={index === spans.length - 1} onClick={() => setValue('spans', moveForgeUISpan(spans, span.id, 1))}>Move down</Button>
        <Button size="xs" onClick={() => setValue('spans', removeForgeUISpan(spans, span.id))}>Remove</Button></HStack>
    </Stack>)}
    <Button size="sm" colorScheme="teal" onClick={() => setValue('spans', addForgeUISpan(spans))}>Add span</Button>
    <Text fontSize="xs">Overall alignment</Text><Select size="sm" value={textAlign} onChange={e => setValue('textAlign', e.target.value)}><option value="left">Left</option><option value="center">Centre</option><option value="right">Right</option></Select>
    <Text fontSize="xs">Overflow mode</Text><Select size="sm" value={overflow === 'visible' ? 'clip' : overflow} onChange={e => setValue('overflow', e.target.value)}><option value="ellipsis">Ellipsis</option><option value="clip">Clip</option></Select>
  </Stack>
}

export const AnimImagePanel = () => {
  const { componentId, setValue } = useForm(); const ids = normalizeFrameAssetIds(usePropsSelector('frameAssetIds'))
  return <Stack spacing={3}><Text fontSize="sm" fontWeight="bold">Ordered frames</Text>
    {ids.map((id, index) => <Stack key={`${id}-${index}`} p={2} border="1px solid #334155" borderRadius="md">
      <AssetSelect value={id} onChange={value => setValue('frameAssetIds', ids.map((old, i) => i === index ? value : old))}/>
      <HStack><Button size="xs" isDisabled={index === 0} onClick={() => {
        const next = [...ids]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; setValue('frameAssetIds', next)
      }}>Up</Button><Button size="xs" isDisabled={index === ids.length - 1} onClick={() => {
        const next = [...ids]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; setValue('frameAssetIds', next)
      }}>Down</Button><Button size="xs" onClick={() => setValue('frameAssetIds', ids.filter((_, i) => i !== index))}>Remove</Button></HStack>
    </Stack>)}
    <Button size="sm" colorScheme="teal" onClick={() => openForgeUIAnimationFramePicker(componentId, ids)}>Choose frames from Asset Manager</Button>
    <Button size="sm" onClick={() => setValue('frameAssetIds', [...ids, ''])}>Add empty frame slot</Button>
    <NumberInput size="sm" min={40} value={Number(usePropsSelector('frameDuration')) || 250} onChange={(_, value) => setValue('frameDuration', value)}><NumberInputField placeholder="Frame duration (ms)"/></NumberInput>
    <Checkbox isChecked={usePropsSelector('loop') !== false} onChange={e => setValue('loop', e.target.checked)}>Loop</Checkbox>
    <Checkbox isChecked={usePropsSelector('autoStart') !== false} onChange={e => setValue('autoStart', e.target.checked)}>Start automatically</Checkbox>
    <Checkbox isChecked={usePropsSelector('generateRuntimeApi') !== false} onChange={e => setValue('generateRuntimeApi', e.target.checked)}>Generate runtime API</Checkbox>
  </Stack>
}

export const ImageButtonPanel = () => {
  const { setValue } = useForm()
  const releasedAssetId = usePropsSelector('releasedAssetId')
  const pressedAssetId = usePropsSelector('pressedAssetId')
  const disabledAssetId = usePropsSelector('disabledAssetId')
  const rows = [['Released','releasedAssetId',releasedAssetId],['Pressed','pressedAssetId',pressedAssetId],['Disabled','disabledAssetId',disabledAssetId]]
  return <Stack spacing={3}>{rows.map(([label, key, selected]) =>
    <Stack key={key}><Text fontSize="xs">{label} image</Text><AssetSelect value={selected} onChange={value => setValue(key, value)}/></Stack>)}
    <Checkbox isChecked={Boolean(usePropsSelector('isDisabled'))} onChange={e => setValue('isDisabled', e.target.checked)}>Disabled</Checkbox>
    <Checkbox isChecked={usePropsSelector('generateRuntimeApi') !== false} onChange={e => setValue('generateRuntimeApi', e.target.checked)}>Generate enabled API</Checkbox>
    <Checkbox isChecked={usePropsSelector('enableClick') !== false} onChange={e => setValue('enableClick', e.target.checked)}>Generate click hook</Checkbox>
  </Stack>
}
