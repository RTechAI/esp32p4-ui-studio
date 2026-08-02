import React from 'react'
import { Button, Checkbox, HStack, Input, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { createForgeUIMenuPage, normalizeForgeUIMenuPages, resolveForgeUIMenuRootPageId } from '~forgeui/ForgeUIMenu'

export const MenuPanel = () => {
  const { setValue } = useForm()
  const pages = normalizeForgeUIMenuPages(usePropsSelector('pages'))
  const rootPageId = resolveForgeUIMenuRootPageId(pages, usePropsSelector('rootPageId'))
  const headerMode = usePropsSelector('headerMode') || 'top-fixed'
  const rootBackButton = Boolean(usePropsSelector('rootBackButton'))
  const padding = Number(usePropsSelector('padding') ?? 4)
  const colours = {
    background: usePropsSelector('background') || '#0F172A',
    headerBackground: usePropsSelector('headerBackground') || '#172033',
    selectedBackground: usePropsSelector('selectedBackground') || '#164E63',
    textColor: usePropsSelector('textColor') || '#F8FAFC',
    secondaryTextColor: usePropsSelector('secondaryTextColor') || '#94A3B8',
    borderColor: usePropsSelector('borderColor') || '#334155',
  }
  const setPages = (next: any[]) => setValue('pages', next)
  return <Stack spacing={3}>
    <Text fontSize="sm" fontWeight="bold">Navigation tree</Text>
    <Select size="sm" aria-label="Root page" value={rootPageId} onChange={e => setValue('rootPageId', e.target.value)}>
      {pages.map(page => <option key={page.id} value={page.id}>{page.title || page.id}</option>)}
    </Select>
    <Select size="sm" aria-label="Header mode" value={headerMode} onChange={e => setValue('headerMode', e.target.value)}>
      <option value="top-fixed">Top fixed</option><option value="top-unfixed">Top scrollable</option><option value="bottom-fixed">Bottom fixed</option>
    </Select>
    <Checkbox isChecked={rootBackButton} onChange={e => setValue('rootBackButton', e.target.checked)}>Show back control on root</Checkbox>
    {pages.map((page, pageIndex) => <Stack key={page.id} p={2} border="1px solid #334155" borderRadius="md">
      <HStack><Text fontSize="xs" fontWeight="bold" flex="1">Page {pageIndex + 1}</Text>
        <Button size="xs" isDisabled={pages.length === 1} onClick={() => setPages(pages.filter((_, i) => i !== pageIndex))}>Remove</Button></HStack>
      <Input size="sm" aria-label={`Page ${pageIndex + 1} title`} value={page.title} onChange={e => setPages(pages.map((old, i) => i === pageIndex ? { ...old, title: e.target.value } : old))} />
      {page.sections.map((section, sectionIndex) => <Stack key={section.id} pl={2} borderLeft="2px solid #475569">
        <HStack><Input size="sm" aria-label={`Page ${pageIndex + 1} section ${sectionIndex + 1} title`} placeholder="Optional section title" value={section.title}
          onChange={e => setPages(pages.map((old, i) => i === pageIndex ? { ...old, sections: old.sections.map((s, j) => j === sectionIndex ? { ...s, title: e.target.value } : s) } : old))} />
          <Button size="xs" onClick={() => setPages(pages.map((old, i) => i === pageIndex ? { ...old, sections: old.sections.filter((_, j) => j !== sectionIndex) } : old))}>Remove</Button></HStack>
        {section.items.map((item, itemIndex) => <Stack key={item.id} p={2} bg="blackAlpha.200">
          <Input size="sm" aria-label={`Item ${item.id} label`} value={item.label} onChange={e => setPages(pages.map((old, i) => i === pageIndex ? { ...old, sections: old.sections.map((s, j) => j === sectionIndex ? { ...s, items: s.items.map((entry, k) => k === itemIndex ? { ...entry, label: e.target.value } : entry) } : s) } : old))} />
          <Input size="sm" aria-label={`Item ${item.id} subtitle`} placeholder="Optional subtitle" value={item.subtitle} onChange={e => setPages(pages.map((old, i) => i === pageIndex ? { ...old, sections: old.sections.map((s, j) => j === sectionIndex ? { ...s, items: s.items.map((entry, k) => k === itemIndex ? { ...entry, subtitle: e.target.value } : entry) } : s) } : old))} />
          <HStack><Input size="sm" aria-label={`Item ${item.id} icon`} placeholder="LV_SYMBOL_SETTINGS" value={item.icon} onChange={e => setPages(pages.map((old, i) => i === pageIndex ? { ...old, sections: old.sections.map((s, j) => j === sectionIndex ? { ...s, items: s.items.map((entry, k) => k === itemIndex ? { ...entry, icon: e.target.value } : entry) } : s) } : old))} />
            <Select size="sm" aria-label={`Item ${item.id} target`} value={item.targetPageId} onChange={e => setPages(pages.map((old, i) => i === pageIndex ? { ...old, sections: old.sections.map((s, j) => j === sectionIndex ? { ...s, items: s.items.map((entry, k) => k === itemIndex ? { ...entry, targetPageId: e.target.value } : entry) } : s) } : old))}>
              <option value="">No child page</option>{pages.filter(target => target.id !== page.id).map(target => <option key={target.id} value={target.id}>{target.title}</option>)}
            </Select></HStack>
          <HStack><Checkbox isChecked={item.enabled} onChange={e => setPages(pages.map((old, i) => i === pageIndex ? { ...old, sections: old.sections.map((s, j) => j === sectionIndex ? { ...s, items: s.items.map((entry, k) => k === itemIndex ? { ...entry, enabled: e.target.checked } : entry) } : s) } : old))}>Enabled</Checkbox>
            <Button size="xs" onClick={() => setPages(pages.map((old, i) => i === pageIndex ? { ...old, sections: old.sections.map((s, j) => j === sectionIndex ? { ...s, items: s.items.filter((_, k) => k !== itemIndex) } : s) } : old))}>Remove item</Button></HStack>
        </Stack>)}
        <Button size="xs" onClick={() => setPages(pages.map((old, i) => i === pageIndex ? { ...old, sections: old.sections.map((s, j) => j === sectionIndex ? { ...s, items: [...s.items, { id: `item-${Date.now()}`, label: 'New item', subtitle: '', icon: '', targetPageId: '', enabled: true }] } : s) } : old))}>Add item</Button>
      </Stack>)}
      <Button size="xs" onClick={() => setPages(pages.map((old, i) => i === pageIndex ? { ...old, sections: [...old.sections, { id: `section-${Date.now()}`, title: 'Section', items: [] }] } : old))}>Add section</Button>
    </Stack>)}
    <Button size="sm" colorScheme="teal" onClick={() => setPages([...pages, createForgeUIMenuPage(pages.length + 1)])}>Add page</Button>
    <Text fontSize="sm" fontWeight="bold">Appearance</Text>
    <NumberInput size="sm" min={0} max={48} value={padding} onChange={(_, n) => setValue('padding', n)}><NumberInputField aria-label="Menu padding" /></NumberInput>
    {(Object.keys(colours) as (keyof typeof colours)[]).map(name =>
      <Input key={name} size="sm" type="color" aria-label={name} value={colours[name]} onChange={e => setValue(name, e.target.value)} />)}
  </Stack>
}
