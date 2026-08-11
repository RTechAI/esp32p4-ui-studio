import React, {
  ChangeEvent,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Box,
  DarkMode,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  SearchIcon,
} from '@chakra-ui/icons'

import DragItem from './DragItem'
import useDispatch from '~hooks/useDispatch'
import {
  FORGEUI_WIDGET_CATEGORIES,
  ForgeUIWidgetCategory,
  ForgeUIWidgetDefinition,
  getForgeUIWidgetDefinition,
  searchForgeUIWidgets,
} from '~forgeui/widgets/ForgeUIWidgetRegistry'
import {
  ForgeUIUploadedAsset,
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  ForgeUIInteractiveAsset,
  getAllInteractiveAssets,
} from '~forgeui/interactive'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
  openButtonCreator,
  openLightCreator,
  openStatusIndicatorCreator,
  openThreePositionToggleCreator,
  openToggleCreator,
} from '~forgeui/ForgeUINavigation'
import { FORGEUI_ACTIVE_DEVICE } from '~forgeui/ForgeUIDeviceConfig'
import { HardwareExamplesPanel } from '~forgeui/hardwareExamples/HardwareExamplesPanel'

type TrayEntry = {
  id: string
  type: ComponentType
  displayName: string
  category: ForgeUIWidgetCategory
  description: string
  keywords: string[]
  defaultWidth: number
  defaultHeight: number
  insertionProps?: Record<string, unknown>
  definition?: ForgeUIWidgetDefinition
  onEdit?: () => void
  status: 'available' | 'experimental' | 'disabled'
}

const FORGEUI_WIDGET_TRAY_COLLAPSE_KEY =
  'forgeui_widget_tray_collapsed_v1'

const interactiveComponentType = (
  asset: ForgeUIInteractiveAsset,
): ComponentType => ({
  button: 'InteractiveButton',
  light: 'InteractiveLight',
  statusIndicator: 'InteractiveStatusIndicator',
  toggleSwitch: 'InteractiveToggleSwitch',
  threePositionToggle: 'InteractiveThreePositionToggleSwitch',
}[asset.kind] as ComponentType)

const editInteractiveAsset = (
  asset: ForgeUIInteractiveAsset,
) => {
  const source = `widget-tray-${asset.id}`
  if (asset.kind === 'button') openButtonCreator(source, asset.id)
  if (asset.kind === 'light') openLightCreator(source, asset.id)
  if (asset.kind === 'statusIndicator') {
    openStatusIndicatorCreator(source, asset.id)
  }
  if (asset.kind === 'toggleSwitch') openToggleCreator(source, asset.id)
  if (asset.kind === 'threePositionToggle') {
    openThreePositionToggleCreator(source, asset.id)
  }
}

const WidgetPreview = ({
  category,
  interactive,
}: {
  category: ForgeUIWidgetCategory
  interactive?: boolean
}) => (
  <Box
    width="100%"
    height="100%"
    border="1px solid"
    borderColor={interactive ? 'purple.300' : 'cyan.600'}
    borderRadius={category === 'Display' ? '50%' : '4px'}
    bg={interactive ? 'purple.900' : 'rgba(8,145,178,0.16)'}
    position="relative"
  >
    <Box
      position="absolute"
      left="5px"
      right="5px"
      top="9px"
      height="2px"
      bg={interactive ? 'purple.200' : 'cyan.300'}
    />
  </Box>
)

const Menu = () => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadedAssets, setUploadedAssets] =
    useState<ForgeUIUploadedAsset[]>([])
  const [interactiveAssets, setInteractiveAssets] =
    useState<ForgeUIInteractiveAsset[]>([])
  const [collapsed, setCollapsed] = useState<
    Partial<Record<ForgeUIWidgetCategory, boolean>>
  >({})

  useEffect(() => {
    const refresh = () => {
      setUploadedAssets([...forgeUIGetUploadedAssets()])
      setInteractiveAssets([...getAllInteractiveAssets()])
    }
    refresh()
    try {
      const saved = window.localStorage.getItem(
        FORGEUI_WIDGET_TRAY_COLLAPSE_KEY,
      )
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          setCollapsed(Object.fromEntries(
            FORGEUI_WIDGET_CATEGORIES.map(category => [
              category,
              parsed[category] === true,
            ]),
          ))
        }
      }
    } catch {
      // Invalid local UI preferences retain the deterministic default.
    }
    window.addEventListener('forgeui-assets-updated', refresh)
    window.addEventListener(
      FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      refresh,
    )
    return () => {
      window.removeEventListener('forgeui-assets-updated', refresh)
      window.removeEventListener(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
        refresh,
      )
    }
  }, [])

  const entries = useMemo<TrayEntry[]>(() => {
    const standard = searchForgeUIWidgets('').map(definition => ({
      id: `widget:${definition.type}`,
      type: definition.type,
      displayName: definition.displayName,
      category: definition.category,
      description: definition.description,
      keywords: definition.keywords,
      defaultWidth: definition.defaultWidth,
      defaultHeight: definition.defaultHeight,
      definition,
      status: definition.status,
    } as TrayEntry))
    const artwork = uploadedAssets.map(asset => ({
      id: `artwork:${asset.id}`,
      type: 'Image' as ComponentType,
      displayName: asset.name,
      category: 'Assets' as const,
      description: 'Imported artwork asset.',
      keywords: ['asset', 'artwork', 'image', asset.name],
      defaultWidth: asset.width || 240,
      defaultHeight: asset.height || 160,
      insertionProps: {
        src: asset.browserSrc,
        uploadedAssetId: asset.id,
        lvgl: asset.lvgl,
        cFile: asset.cFile,
      },
      status: 'available' as const,
    }))
    const interactive = interactiveAssets.map(asset => {
      const type = interactiveComponentType(asset)
      const definition = getForgeUIWidgetDefinition(type)
      return {
        id: `interactive:${asset.id}`,
        type,
        displayName: asset.name,
        category: 'Assets' as const,
        description: `${asset.kind} state-sheet asset.`,
        keywords: [
          'asset', 'interactive', 'state sheet', asset.kind, asset.name,
        ],
        defaultWidth: definition?.defaultWidth || 120,
        defaultHeight: definition?.defaultHeight || 72,
        insertionProps: { interactiveAssetId: asset.id },
        onEdit: () => editInteractiveAsset(asset),
        status: 'available' as const,
      }
    })
    return [...standard, ...artwork, ...interactive]
  }, [uploadedAssets, interactiveAssets])

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return entries
    return entries.filter(entry =>
      [
        entry.displayName,
        entry.category,
        entry.description,
        ...entry.keywords,
      ].some(value => value.toLowerCase().includes(query)),
    )
  }, [entries, searchTerm])

  const insert = (entry: TrayEntry) => {
    const x = (FORGEUI_ACTIVE_DEVICE.width - entry.defaultWidth) / 2
    const y = (FORGEUI_ACTIVE_DEVICE.height - entry.defaultHeight) / 2
    dispatch.components.addComponent({
      parentName: 'root',
      type: entry.type,
      rootParentType: entry.type,
      props: {
        ...(entry.definition?.insertionFactory(x, y) || {
          positionMode: 'absolute',
          x, y,
          w: entry.defaultWidth,
          h: entry.defaultHeight,
        }),
        ...(entry.insertionProps || {}),
      },
    })
    if (entry.type === 'Icon') {
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('forgeui-open-icon-browser'))
      }, 0)
    }
  }

  const toggleCategory = (category: ForgeUIWidgetCategory) => {
    setCollapsed(current => {
      const next = {
        ...current,
        [category]: !current[category],
      }
      try {
        window.localStorage.setItem(
          FORGEUI_WIDGET_TRAY_COLLAPSE_KEY,
          JSON.stringify(next),
        )
      } catch {
        // The tray remains usable when preference storage is unavailable.
      }
      return next
    })
  }

  const hasResults = filtered.length > 0

  return (
    <DarkMode>
      <Box
        height="100%"
        maxH="100%"
        minHeight={0}
        overflow="hidden"
        boxShadow="xl"
        flex="0 0 15rem"
        as="aside"
        aria-label="Widget Tray"
        backgroundColor="#2e3748"
        width="15rem"
        maxWidth="100%"
        minWidth={0}
        boxSizing="border-box"
        display="flex"
        flexDirection="column"
        data-testid="widget-tray"
      >
        <Box
          p={4}
          pb={3}
          position="relative"
          w="100%"
          maxWidth="100%"
          minWidth={0}
          boxSizing="border-box"
          bgColor="#2e3748"
          zIndex={2}
          flex="0 0 auto"
          data-testid="widget-tray-header"
        >
          <Text
            color="cyan.200"
            fontWeight="bold"
            fontSize="md"
            mb={3}
          >
            Widgets
          </Text>
          <InputGroup size="sm">
            <Input
              value={searchTerm}
              color="gray.200"
              aria-label="Search widgets"
              placeholder="Search widgets…"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(event.target.value)
              }
              borderColor="whiteAlpha.200"
              bg="whiteAlpha.100"
            />
            <InputRightElement>
              {searchTerm ? (
                <IconButton
                  color="gray.300"
                  aria-label="Clear widget search"
                  icon={<CloseIcon path="" />}
                  size="xs"
                  onClick={() => setSearchTerm('')}
                />
              ) : (
                <SearchIcon path="" color="gray.300" />
              )}
            </InputRightElement>
          </InputGroup>
        </Box>

        <Box
          px={3}
          pb={4}
          minWidth={0}
          maxWidth="100%"
          boxSizing="border-box"
          overflowX="hidden"
          overflowY="auto"
          flex="1 1 auto"
          data-testid="widget-tray-scroll-region"
          sx={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#64748b #1e293b',
            '&::-webkit-scrollbar': { width: '9px' },
            '&::-webkit-scrollbar-track': {
              background: '#1e293b',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#64748b',
              borderRadius: '8px',
              border: '2px solid #1e293b',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#94a3b8',
            },
          }}
        >
          {!searchTerm && <HardwareExamplesPanel />}
          {!hasResults && (
            <Box
              color="gray.400"
              fontSize="sm"
              textAlign="center"
              py={8}
              data-testid="widget-tray-empty-search"
            >
              No widgets match “{searchTerm}”.
            </Box>
          )}
          {FORGEUI_WIDGET_CATEGORIES.map(category => {
            const categoryEntries = filtered.filter(
              entry => entry.category === category,
            )
            if (searchTerm && categoryEntries.length === 0) return null
            const isCollapsed = Boolean(collapsed[category])
            return (
              <Box
                key={category}
                mb={1}
                minWidth={0}
                maxWidth="100%"
                boxSizing="border-box"
              >
                <HStack
                  as="button"
                  type="button"
                  width="100%"
                  py={1.5}
                  minHeight="32px"
                  minWidth={0}
                  maxWidth="100%"
                  color="gray.200"
                  onClick={() => toggleCategory(category)}
                  aria-expanded={!isCollapsed}
                  aria-controls={`widget-category-${category}`}
                  _focusVisible={{
                    outline: '2px solid',
                    outlineColor: 'cyan.300',
                  }}
                >
                  {isCollapsed
                    ? <ChevronRightIcon path="" />
                    : <ChevronDownIcon path="" />}
                  <Text fontWeight="semibold" fontSize="xs">
                    {category}
                  </Text>
                  <Text ml="auto" color="gray.500" fontSize="xs">
                    {categoryEntries.length}
                  </Text>
                </HStack>
                {!isCollapsed && (
                  <Box
                    id={`widget-category-${category}`}
                    minWidth={0}
                    maxWidth="100%"
                    overflow="hidden"
                  >
                    {categoryEntries.length === 0 ? (
                      <Text
                        color="gray.500"
                        fontSize="xs"
                        px={2}
                        py={1}
                        noOfLines={1}
                        title="No dashboard widgets registered yet."
                        data-testid="widget-dashboard-empty"
                      >
                        No dashboard widgets registered yet.
                      </Text>
                    ) : categoryEntries.map(entry => (
                      <DragItem
                        key={entry.id}
                        id={entry.id as any}
                        label={entry.displayName}
                        type={entry.type}
                        rootParentType={entry.type}
                        defaultWidth={entry.defaultWidth}
                        defaultHeight={entry.defaultHeight}
                        insertionProps={entry.insertionProps}
                        description={entry.description}
                        soon={entry.status !== 'available'}
                        onInsert={() => insert(entry)}
                        onEdit={entry.onEdit}
                        preview={(
                          <WidgetPreview
                            category={entry.category}
                            interactive={
                              entry.category === 'Assets' ||
                              entry.definition?.capabilities.isInteractiveAsset ||
                              entry.id.startsWith('interactive:')
                            }
                          />
                        )}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
      </Box>
    </DarkMode>
  )
}

export default memo(Menu)
