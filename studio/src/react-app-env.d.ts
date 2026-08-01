/// <reference types="react-scripts" />;
declare module 'prettier/standalone'
declare module 'coloreact'

type ComponentType =
  | 'Accordion'
  | 'AccordionItem'
  | 'AccordionButton'
  | 'AccordionPanel'
  | 'AccordionIcon'
  | 'Alert'
  | 'AlertIcon'
  | 'AlertTitle'
  | 'AlertDescription'
  | 'Arc'
  | 'AspectRatio'
  | 'AvatarBadge'
  | 'AvatarGroup'
  | 'Avatar'
  | 'Badge'
  | 'Bar'
  | 'Box'
  | 'Breadcrumb'
  | 'BreadcrumbItem'
  | 'BreadcrumbLink'
  | 'Button'
  | 'InteractiveButton'
  | 'InteractiveLight'
  | 'InteractiveStatusIndicator'
  | 'InteractiveToggleSwitch'
  | 'InteractiveThreePositionToggleSwitch'
  | 'Center'
  | 'Checkbox'
  | 'CircularProgress'
  | 'CloseButton'
  | 'Code'
  | 'Container'
  | 'Divider'
  | 'Editable'
  | 'Flex'
  | 'FormControl'
  | 'FormLabel'
  | 'FormHelperText'
  | 'FormErrorMessage'
  | 'Grid'
  | 'Heading'
  | 'Clock'
  | 'WiFi'
  | 'Highlight'
  | 'Icon'
  | 'IconButton'
  | 'Image'
  | 'Input'
  | 'InputGroup'
  | 'InputLeftAddon'
  | 'InputRightAddon'
  | 'InputLeftElement'
  | 'InputRightElement'
  | 'Link'
  | 'List'
  | 'ListItem'
  | 'ListIcon'
  | 'Kbd'
  | 'Led'
  | 'AnimImage'
  | 'ButtonMatrix'
  | 'Calendar'
  | 'Canvas'
  | 'Chart'
  | 'ImageButton'
  | 'Keyboard'
  | 'Line'
  | 'Lottie'
  | 'Msgbox'
  | 'ObjxTempl'
  | 'Roller'
  | 'Scale'
  | 'Table'
  | 'Tabview'
  | 'Tileview'
  | 'Menu'
  | 'NumberInput'
  | 'Progress'
  | 'QRCode'
  | 'Radio'
  | 'RadioGroup'
  | 'Slider'
  | 'Spinbox'
  | 'Select'
  | 'SimpleGrid'
  | 'Spinner'
  | 'Skeleton'
  | 'SkeletonCircle'
  | 'SkeletonText'
  | 'Stack'
  | 'Stat'
  | 'StatLabel'
  | 'StatNumber'
  | 'StatHelpText'
  | 'StatArrow'
  | 'StatGroup'
  | 'Switch'
  | 'Tab'
  | 'Tabs'
  | 'TabList'
  | 'TabPanel'
  | 'TabPanels'
  | 'Tag'
  | 'Text'
  | 'Span'
  | 'Textarea'

type MetaComponentType =
  | 'FormControlMeta'
  | 'AccordionMeta'
  | 'ListMeta'
  | 'AlertMeta'
  | 'InputGroupMeta'
  | 'BreadcrumbMeta'
  | 'TabsMeta'
  | 'StatMeta'

interface IComponent {
  children: string[]
  type: ComponentType
  parent: string
  id: string
  props: any
  rootParentType?: ComponentType
  componentName?: string
}

interface IComponents {
  [name: string]: IComponent
}

interface IPreviewProps {
  component: IComponent
}

interface ComponentItemProps {
  id: string
  label: string
  type: ComponentType
  isMoved?: boolean
  w?: string | number
  h?: string | number
  x?: string | number
  y?: string | number
  isChild?: boolean
  isMeta?: boolean
  soon?: boolean
  rootParentType?: ComponentType
  defaultWidth?: number
  defaultHeight?: number
  insertionProps?: Record<string, unknown>
  onInsert?: () => void
  description?: string
  preview?: React.ReactNode
  onEdit?: () => void
  children?: React.ReactNode
}
