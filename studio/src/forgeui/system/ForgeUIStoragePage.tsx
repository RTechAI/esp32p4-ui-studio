import React, { useMemo, useState } from 'react'
import { Box, Button, Flex, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { FiArrowLeft, FiFile, FiFolder } from 'react-icons/fi'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import { useForgeUISystem } from './ForgeUISystemContext'

type Entry = { name: string; size: number; directory: boolean; children?: Entry[] }
const INITIAL: Entry[] = [
  { name: 'ForgeUI', size: 0, directory: true, children: [
    { name: 'empty', size: 0, directory: true, children: [] },
    { name: 'logs', size: 0, directory: true, children: [{ name: 'boot.log', size: 1842, directory: false }] },
  ] },
  { name: 'readme.txt', size: 1240, directory: false },
  { name: 'splash.png', size: 284672, directory: false },
]
const sorted = (entries: Entry[]) => [...entries].sort((a, b) =>
  Number(b.directory) - Number(a.directory) || a.name.localeCompare(b.name))

export const STORAGE_PREVIEW_LAYOUT = {
  page: { width: 1024, height: 600 },
  back: { left: 20, top: 14, width: 128, height: 54 },
  title: { top: 24, fontSize: 32 },
  summary: { left: 28, top: 96, width: 350 },
  refresh: { left: 28, top: 220, width: 165, height: 50 },
  test: { left: 210, top: 220, width: 165, height: 50 },
  select: { left: 28, top: 292, width: 165, height: 52 },
  delete: { left: 210, top: 292, width: 165, height: 52 },
  parent: { left: 410, top: 78, width: 135, height: 48 },
  path: { left: 565, top: 92, width: 420 },
  list: { left: 400, top: 135, width: 600, height: 390, padding: 6, gap: 5 },
  row: { height: 40 },
  previous: { left: 410, top: 536, width: 170, height: 48 },
  next: { left: 810, top: 536, width: 170, height: 48 },
  dialog: { width: 560, height: 330 },
} as const

const StoragePage = () => {
  const { goBackInSystemInterface } = useForgeUISystem()
  const { palette } = useForgeTheme()
  const [root, setRoot] = useState<Entry[]>(INITIAL)
  const [path, setPath] = useState<string[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectMode, setSelectMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteWord, setDeleteWord] = useState('')
  const [error, setError] = useState('')
  const [testState, setTestState] = useState<'idle' | 'running' | 'passed'>('idle')
  const current = useMemo(() => {
    let entries = root
    path.forEach(part => { entries = entries.find(e => e.directory && e.name === part)?.children || [] })
    return entries
  }, [path, root])
  const selectedEntry = current.find(entry => entry.name === selectedFolder)
  const selectedEmptyFolder = !!selectedEntry?.directory && (selectedEntry.children?.length || 0) === 0
  const deleteEmptyFolder = () => {
    if (!selectedEmptyFolder || !selectedFolder) return
    const mutate = (items: Entry[], depth: number): Entry[] => depth === path.length
      ? items.filter(item => item.name !== selectedFolder)
      : items.map(item => item.name === path[depth] ? { ...item, children: mutate(item.children || [], depth + 1) } : item)
    setRoot(items => mutate(items, 0)); setSelectedFolder(null); setSelectMode(false); setError('Folder deleted')
  }
  const actionStyle = { bg: palette.surface2, color: palette.text, border: `1px solid ${palette.border}`,
    borderRadius: '8px', fontSize: '15px', fontWeight: 600,
    _hover: { bg: palette.accent, color: palette.bg }, _active: { bg: palette.accent, color: palette.bg },
    _focusVisible: { boxShadow: `0 0 0 3px ${palette.accent}` }, _disabled: { opacity: 0.4 } }
  const place = (layout: { left: number; top: number; width: number; height?: number }) => ({
    position: 'absolute' as const, left: `${layout.left}px`, top: `${layout.top}px`,
    width: `${layout.width}px`, ...(layout.height ? { height: `${layout.height}px` } : {}),
  })
  const status = testState === 'running' ? 'Read / Write Test running...'
    : testState === 'passed' ? 'Read / Write Test passed' : error || 'Ready'
  return <Box position="relative" width="100%" height="100%" overflow="hidden" data-testid="system-storage-page">
    <Button aria-label="Back from SD Card" onClick={goBackInSystemInterface} leftIcon={<FiArrowLeft />}
      {...place(STORAGE_PREVIEW_LAYOUT.back)} {...actionStyle}>Back</Button>
    <Text position="absolute" top={`${STORAGE_PREVIEW_LAYOUT.title.top}px`} left="0" width="100%"
      textAlign="center" fontSize={`${STORAGE_PREVIEW_LAYOUT.title.fontSize}px`} lineHeight="1.2" fontWeight="bold">SD Card</Text>
    <Text {...place(STORAGE_PREVIEW_LAYOUT.summary)} whiteSpace="pre-line" fontSize="14px" lineHeight="1.45"
      data-testid="sd-mounted">{`Mounted | SDHC/SDXC | FAT32\nTotal 29700 MB  Used 8500 MB  Free 21200 MB\n${status}`}</Text>
    <Text position="absolute" left="-9999px" data-testid="sd-capacity">29.7 GB</Text>
    <Text position="absolute" left="-9999px" data-testid="sd-free">21.2 GB</Text>
    <Text position="absolute" left="-9999px" data-testid="sd-test-state">Test: {testState}</Text>
    <Button aria-label="Refresh" onClick={() => { setError(''); setSelectedFolder(null); setSelectMode(false) }}
      {...place(STORAGE_PREVIEW_LAYOUT.refresh)} {...actionStyle}>↻ Refresh</Button>
    <Button onClick={() => { setTestState('running'); window.setTimeout(() => setTestState('passed'), 400) }}
      {...place(STORAGE_PREVIEW_LAYOUT.test)} {...actionStyle}>Run R/W Test</Button>
    <Button data-testid="sd-select-folder" onClick={() => {
      if (selectMode) { setSelectMode(false); setSelectedFolder(null) }
      else { setSelectMode(true); setSelectedFolder(null) }
    }} {...place(STORAGE_PREVIEW_LAYOUT.select)} {...actionStyle}>{selectMode ? 'Cancel Selection' : 'Select Item'}</Button>
    <Button data-testid="sd-delete-folder" disabled={!selectedEmptyFolder}
      onClick={() => { setDeleteWord(''); setDeleteOpen(true); setError('') }}
      {...place(STORAGE_PREVIEW_LAYOUT.delete)} {...actionStyle}>Delete Folder</Button>
    <Button aria-label="Parent folder" disabled={!path.length}
      onClick={() => { setPath(p => p.slice(0, -1)); setSelectedFolder(null); setSelectMode(false); setError('') }}
      {...place(STORAGE_PREVIEW_LAYOUT.parent)} {...actionStyle}>↑ Parent</Button>
    <Text {...place(STORAGE_PREVIEW_LAYOUT.path)} color={palette.accent} fontSize="16px"
      data-testid="sd-current-path">/sdcard{path.length ? `/${path.join('/')}` : ''}</Text>
    <VStack position="absolute" left={`${STORAGE_PREVIEW_LAYOUT.list.left}px`} top={`${STORAGE_PREVIEW_LAYOUT.list.top}px`}
      width={`${STORAGE_PREVIEW_LAYOUT.list.width}px`} height={`${STORAGE_PREVIEW_LAYOUT.list.height}px`}
      align="stretch" spacing={`${STORAGE_PREVIEW_LAYOUT.list.gap}px`} padding={`${STORAGE_PREVIEW_LAYOUT.list.padding}px`}
      overflow="hidden" border={`1px solid ${palette.border}`} borderRadius="8px" bg={palette.surface}
      data-testid="sd-file-list">
          {sorted(current).map(entry => <Button key={entry.name} height={`${STORAGE_PREVIEW_LAYOUT.row.height}px`}
            minHeight={`${STORAGE_PREVIEW_LAYOUT.row.height}px`} flexShrink={0} justifyContent="space-between"
            data-testid={`sd-entry-${entry.name}`} data-selected={selectedFolder === entry.name || undefined}
            onClick={() => {
              if (selectMode) { setSelectedFolder(entry.name); return }
              if (!entry.directory) return
              setPath(p => [...p, entry.name]); setSelectedFolder(null); setSelectMode(false); setError('')
            }}
            {...actionStyle}
            bg={selectedFolder === entry.name ? palette.accent : palette.surface2}
            color={selectedFolder === entry.name ? palette.bg : palette.text}>
            <HStack>{entry.directory ? <FiFolder /> : <FiFile />}<Text>{entry.name}</Text></HStack>
            <Text>{entry.directory ? 'Folder' : `${entry.size.toLocaleString()} B`}</Text>
          </Button>)}
          {current.length === 0 && <Flex flex="1" align="center" justify="center">
            <Text data-testid="sd-empty-folder">This folder is empty</Text>
          </Flex>}
    </VStack>
    <Button disabled {...place(STORAGE_PREVIEW_LAYOUT.previous)} {...actionStyle}>← Previous</Button>
    <Button disabled {...place(STORAGE_PREVIEW_LAYOUT.next)} {...actionStyle}>Next →</Button>
    {deleteOpen && selectedFolder && <Flex position="absolute" inset={0} bg="rgba(0,0,0,.72)" align="center" justify="center">
      <VStack width={`${STORAGE_PREVIEW_LAYOUT.dialog.width}px`} height={`${STORAGE_PREVIEW_LAYOUT.dialog.height}px`}
        p="24px" justify="space-between" bg={palette.surface} border={`1px solid ${palette.border}`} borderRadius="8px">
        <Text fontSize="22px" fontWeight="bold">DELETE EMPTY FOLDER</Text>
        <Box textAlign="center"><Text>Delete folder:</Text><Text>{selectedFolder}</Text>
          <Text mt="12px">This folder must be empty.</Text></Box>
        <Input aria-label="Delete item confirmation" value={deleteWord} onChange={event => setDeleteWord(event.target.value)} />
        <HStack width="100%" spacing="20px"><Button flex="1" height="56px" onClick={() => { setDeleteOpen(false); setDeleteWord('') }} {...actionStyle}>Cancel</Button>
          <Button disabled={deleteWord !== 'DELETE'} onClick={() => {
            if (deleteWord !== 'DELETE') return
            deleteEmptyFolder(); setDeleteOpen(false); setDeleteWord('')
          }} flex="1" height="56px" {...actionStyle}>Delete Folder</Button></HStack>
      </VStack>
    </Flex>}
  </Box>
}
export default StoragePage
