import { forgeuiInputStyle } from '~forgeui/ForgeUIControlStyle'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import ClockPreview from './previews/ClockPreview'
import AlertPreview from '~components/editor/previews/AlertPreview'
import AvatarPreview, {
  AvatarBadgePreview,
  AvatarGroupPreview,
} from '~components/editor/previews/AvatarPreview'
import AccordionPreview, {
  AccordionButtonPreview,
  AccordionItemPreview,
  AccordionPanelPreview,
} from '~components/editor/previews/AccordionPreview'
import * as Chakra from '@chakra-ui/react'
import { getComponentBy } from '~core/selectors/components'
import { InputRightElementPreview } from '~components/editor/previews/InputRightElement'
import { InputLeftElementPreview } from '~components/editor/previews/InputLeftElement'
import AspectRatioPreview from '~components/editor/previews/AspectRatioBoxPreview'
import ButtonPreview from '~components/editor/previews/ButtonPreview'
import PreviewContainer from '~components/editor/PreviewContainer'
import WithChildrenPreviewContainer from '~components/editor/WithChildrenPreviewContainer'
import IconPreview from './previews/IconPreview'
import IconButtonPreview from './previews/IconButtonPreview'
import SelectPreview from '~components/editor/previews/SelectPreview'
import NumberInputPreview from '~components/editor/previews/NumberInputPreview'
import BreadcrumbPreview from './previews/BreadcrumbPreview'
import BreadcrumbItemPreview from './previews/BreadcrumbItemPreview'
import HighlightPreview from './previews/HighlightPreview'
import SliderPreview from '~components/editor/previews/SliderPreview'
import ProgressPreview from '~components/editor/previews/ProgressPreview'
import InteractiveButtonCanvasPreview from './previews/InteractiveButtonCanvasPreview'
import InteractiveLightCanvasPreview from './previews/InteractiveLightCanvasPreview'
import InteractiveStatusIndicatorCanvasPreview from './previews/InteractiveStatusIndicatorCanvasPreview'
import CircularProgressPreview from '~components/editor/previews/CircularProgressPreview'
import ImagePreview from '~components/editor/previews/ImagePreview'
import StatGroupPreview, {
  StatHelpTextPreview,
  StatPreview,
} from './previews/StatPreview'
import SkeletonPreview, {
  SkeletonCirclePreview,
  SkeletonTextPreview,
} from './previews/SkeletonPreview'

const ComponentPreview: React.FC<{
  componentName: string
}> = ({ componentName, ...forwardedProps }) => {
  const component = useSelector(getComponentBy(componentName))
  if (!component) {
    console.error(`ComponentPreview unavailable for component ${componentName}`)
  }

  const type = (component && component.type) || null
  switch (type) {
    // Simple components
    case 'Kbd':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Kbd
      {...component.props}
       w="100%"
       h="100%"
       minW="100%"
       minH="100%"
       display="flex"
       alignItems="center"
       justifyContent="center"
       boxSizing="border-box"
>
  {component.props.children || 'shift'}
</Chakra.Kbd>
    </PreviewContainer>
  )

  case 'Radio':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Chakra.Radio
          isChecked={component.props.isChecked}
          colorScheme={
            component.props.colorScheme || 'blue'
          }
        />
      </Chakra.Box>
    </PreviewContainer>
  )

case 'Switch':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Chakra.Switch
          isChecked={component.props.isChecked}
          colorScheme={
            component.props.colorScheme || 'blue'
          }
        />
      </Chakra.Box>
    </PreviewContainer>
  )
  
    case 'Badge':
    // case 'Image':
    // case 'Text':
    // case 'Link':
    case 'Spinner':
    //case 'Checkbox':
    // case 'Textarea':
    //case 'CircularProgress':
    //case 'Heading':
    // case 'Switch':
    case 'FormLabel':
    case 'FormHelperText':
    case 'FormErrorMessage':
    case 'TabPanel':
    case 'Tab':
    //case 'Input':
    //case 'Radio':
    case 'ListItem':
    case 'BreadcrumbLink':
    // case 'Kbd':
    case 'StatLabel':
    case 'StatNumber':
    case 'StatArrow':
      return (
        <PreviewContainer
          component={component}
          type={Chakra[type]}
          {...forwardedProps}
        />
      )
    // Wrapped functional components (forward ref issue)
    case 'AlertIcon':
// case 'CloseButton':
    case 'AccordionIcon':
    case 'Code':
    case 'ListIcon':
    case 'Divider':
    case 'AlertDescription':
    case 'AlertTitle':
    case 'InputRightAddon':
    case 'InputLeftAddon':
    case 'Tag':
      return (
        <PreviewContainer
          component={component}
          type={Chakra[type]}
          {...forwardedProps}
          isBoxWrapped
        />
      )
    // Components with childrens
    // case 'Box':
    case 'SimpleGrid':
    case 'Flex':
    case 'FormControl':
    case 'Tabs':
    case 'List':
    case 'TabList':
    case 'TabPanels':
    case 'Grid':
    case 'Center':
    case 'Container':
      return (
        <WithChildrenPreviewContainer
          enableVisualHelper
          component={component}
          type={Chakra[type]}
          {...forwardedProps}
        />
      )
    case 'RadioGroup':
    case 'Stack':
    case 'InputGroup':
      return (
        <WithChildrenPreviewContainer
          enableVisualHelper
          component={component}
          type={Chakra[type]}
          {...forwardedProps}
          isBoxWrapped
        />
      )
    // More complex components
case 'InputRightElement':
  return <InputRightElementPreview component={component} />

case 'InputLeftElement':
  return <InputLeftElementPreview component={component} />

case 'Avatar':
  return <AvatarPreview component={component} />

case 'AvatarBadge':
  return <AvatarBadgePreview component={component} />

case 'AvatarGroup':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <AvatarGroupPreview component={component} />
    </PreviewContainer>
  )

case 'Alert':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <AlertPreview component={component} />
    </PreviewContainer>
  )

case 'Accordion':
  return <AccordionPreview component={component} />

case 'AccordionButton':
  return <AccordionButtonPreview component={component} />

case 'AccordionItem':
  return <AccordionItemPreview component={component} />

case 'AccordionPanel':
  return <AccordionPanelPreview component={component} />

case 'AspectRatio':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <AspectRatioPreview component={component} />
    </PreviewContainer>
  )

  case 'InteractiveButton':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <InteractiveButtonCanvasPreview
        component={component}
      />
    </PreviewContainer>
  )

  case 'InteractiveLight':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <InteractiveLightCanvasPreview component={component} />
    </PreviewContainer>
  )

  case 'InteractiveStatusIndicator':
  return (
    <PreviewContainer component={component} enableVisualHelper {...forwardedProps}>
      <InteractiveStatusIndicatorCanvasPreview component={component} />
    </PreviewContainer>
  )

case 'Button':
  return (
    <PreviewContainer
      component={component}
      {...forwardedProps}
    >
      <ButtonPreview component={component} />
    </PreviewContainer>
  )

case 'CloseButton':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
    <Chakra.CloseButton
  {...component.props}
  width="100%"
  height="100%"
  fontSize="48px"
/>
    </PreviewContainer>
  )


    case 'Breadcrumb':
      return <BreadcrumbPreview component={component} />
    case 'BreadcrumbItem':
      return <BreadcrumbItemPreview component={component} />
    
      case 'Icon':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <IconPreview component={component} />
    </PreviewContainer>
  )
  
    case 'IconButton':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <IconButtonPreview component={component} />
    </PreviewContainer>
  )

  case 'Slider':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <SliderPreview component={component} />
    </PreviewContainer>
  )

  case 'NumberInput':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <NumberInputPreview component={component} />
    </PreviewContainer>
  )

case 'CircularProgress':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <CircularProgressPreview component={component} />
    </PreviewContainer>
  )

case 'Progress':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <ProgressPreview component={component} />
    </PreviewContainer>
  )

case 'Select':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px="10px"
        border="1px solid #00d4ff"
        borderRadius="8px"
        bg="#1e2328"
        color="white"
        fontSize="14px"
      >
        <Chakra.Text>Option 1</Chakra.Text>
        <Chakra.Text>▼</Chakra.Text>
      </Chakra.Box>
    </PreviewContainer>
  )

  case 'Heading':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Text
        {...component.props}
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontSize="32px"
        fontWeight="bold"
      >
        {component.props.children || component.props.text || 'Heading'}
      </Chakra.Text>
    </PreviewContainer>
  )

  case 'Clock':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <ClockPreview />
    </PreviewContainer>
  )

  case 'WiFi':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        p="10px"
        border="1px solid #00d4ff"
        borderRadius="8px"
        bg="rgba(0,212,255,0.08)"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Chakra.Text
          color="#00d4ff"
          fontWeight="bold"
          fontSize="14px"
        >
          WIFI
        </Chakra.Text>

        <Chakra.Text color="white" fontSize="13px">
          DISCONNECTED
        </Chakra.Text>

        <Chakra.Text color="gray.300" fontSize="12px">
          IP: -
        </Chakra.Text>
      </Chakra.Box>
    </PreviewContainer>
  )

  case 'Input':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Input
      {...component.props}
       {...forgeuiInputStyle}
       width="100%"
        height="100%"
         placeholder="Input value"
/>
    </PreviewContainer>
  )

  case 'Box':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="1px dashed #666"
        color="gray.400"
        fontSize="sm"
      >
        Box
      </Chakra.Box>
    </PreviewContainer>
  )
  
case 'Image':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <ImagePreview component={component} />
    </PreviewContainer>
  )

  case 'Checkbox':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        px="8px"
      >
        <Chakra.Checkbox
          isChecked={component.props.isChecked}
          colorScheme={
            component.props.colorScheme || 'blue'
          }
        />
      </Chakra.Box>
    </PreviewContainer>
  )

case 'Textarea':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Textarea
       {...component.props}
        {...forgeuiInputStyle}
         width="100%"
          height="100%"
            placeholder="Textarea value"
/>
    </PreviewContainer>
  )

  case 'Text':
    return (
      <PreviewContainer
        component={component}
        enableVisualHelper
        {...forwardedProps}
    >
      <Chakra.Text
        {...component.props}
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        {component.props.children || 'Text'}
      </Chakra.Text>
    </PreviewContainer>
  )


case 'Link':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Link
        {...component.props}
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      />
    </PreviewContainer>
  )
  
    case 'Highlight':
      return <HighlightPreview component={component} />

    case 'Skeleton':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <SkeletonPreview component={component} />
    </PreviewContainer>
  )

    case 'SkeletonText':
      return <SkeletonTextPreview component={component} />
    case 'SkeletonCircle':
      return <SkeletonCirclePreview component={component} />

case 'Led':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Chakra.Box
          width="24px"
          height="24px"
          borderRadius="999px"
          bg="green.400"
          boxShadow="0 0 12px rgba(72,255,120,0.8)"
        />
      </Chakra.Box>
    </PreviewContainer>
  )

case 'Bar':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Progress
        value={70}
        width="100%"
        height="100%"
      />
    </PreviewContainer>
  )

case 'Arc':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxSizing="border-box"
      >
        <Chakra.Box
          width="100%"
          height="100%"
          boxSizing="border-box"
          borderRadius="50%"
          border="8px solid"
          borderColor="cyan.300"
        />
      </Chakra.Box>
    </PreviewContainer>
  )

  

case 'Calendar':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        p="6px"
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gap="2px"
        bg="#1e2328"
      >
        {Array.from({ length: 35 }, (_, i) => (
          <Chakra.Box
            key={i}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="10px"
            borderRadius="2px"
            bg={i === 17 ? 'cyan.400' : 'gray.700'}
            color={i === 17 ? 'black' : 'white'}
          >
            {i < 30 ? i + 1 : ''}
          </Chakra.Box>
        ))}
      </Chakra.Box>
    </PreviewContainer>
  )

  case 'Chart':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        overflow="hidden"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="#00d4ff"
            strokeWidth="2"
            points="5,50 20,35 35,40 50,20 65,25 80,10 95,15"
          />
        </svg>
      </Chakra.Box>
    </PreviewContainer>
  )

  case 'Scale':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
        >
          <line
            x1="10"
            y1="20"
            x2="190"
            y2="20"
            stroke="#00d4ff"
            strokeWidth="2"
          />

          {[...Array(11)].map((_, i) => (
            <line
              key={i}
              x1={10 + i * 18}
              y1="10"
              x2={10 + i * 18}
              y2="30"
              stroke="#00d4ff"
              strokeWidth="2"
            />
          ))}
        </svg>
      </Chakra.Box>
    </PreviewContainer>
  )



case 'Table':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        border="1px solid #00d4ff"
        color="white"
        fontSize="12px"
      >
        {['A1', 'B1', 'A2', 'B2'].map((cell) => (
          <Chakra.Box
            key={cell}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid #00d4ff"
          >
            {cell}
          </Chakra.Box>
        ))}
      </Chakra.Box>
    </PreviewContainer>
  )

  case 'Keyboard':
  return (
    <PreviewContainer component={component} enableVisualHelper {...forwardedProps}>
      <Chakra.Box width="100%" height="100%" p="8px" display="flex" flexDirection="column" gap="6px" border="1px solid #00d4ff" borderRadius="8px" bg="rgba(255,255,255,0.75)">
        {[['1#','q','w','e','r','t','y','u','i','o','p','⌫'], ['ABC','a','s','d','f','g','h','j','k','l','↵'], ['_','-','z','x','c','v','b','n','m','.',',',':'], ['⌨','<','','','','','','','>','✓']].map((row, r) => (
          <Chakra.Box key={r} flex="1" display="grid" gridTemplateColumns={`repeat(${row.length}, 1fr)`} gap="6px">
            {row.map((key, i) => (
              <Chakra.Box key={`${r}-${i}`} display="flex" alignItems="center" justifyContent="center" borderRadius="6px" bg="rgba(255,255,255,0.45)" color="gray.700" fontSize="11px">
                {key}
              </Chakra.Box>
            ))}
          </Chakra.Box>
        ))}
      </Chakra.Box>
    </PreviewContainer>
  )

  case 'Msgbox':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        border="1px solid #00d4ff"
        borderRadius="8px"
        bg="#1e2328"
        color="white"
        display="flex"
        flexDirection="column"
        p="12px"
      >
        <Chakra.Text
          fontSize="lg"
          fontWeight="bold"
          mb="10px"
        >
          Message
        </Chakra.Text>

        <Chakra.Text
          fontSize="md"
          color="white"
          opacity={0.95}
          flex="1"
        >
          Example message text
        </Chakra.Text>

        <Chakra.HStack justify="flex-end" mt="12px">
          <Chakra.Button
            size="sm"
            bg="#00d4ff"
            color="black"
          >
            OK
          </Chakra.Button>

          <Chakra.Button
            size="sm"
            bg="#3a3f46"
            color="white"
          >
            Cancel
          </Chakra.Button>
        </Chakra.HStack>
      </Chakra.Box>
    </PreviewContainer>
  )

  case 'Roller':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        <Chakra.Text
          color="gray.500"
          fontSize="sm"
        >
          Item 1
        </Chakra.Text>

        <Chakra.Text
          color="#00d4ff"
          fontSize="lg"
          fontWeight="bold"
        >
          Item 2
        </Chakra.Text>

        <Chakra.Text
          color="gray.500"
          fontSize="sm"
        >
          Item 3
        </Chakra.Text>
      </Chakra.Box>
    </PreviewContainer>
  )

  case 'ButtonMatrix':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gridTemplateRows="repeat(2, 1fr)"
        gap="6px"
        p="8px"
        bg="rgba(0,212,255,0.08)"
        border="1px solid #00d4ff"
        borderRadius="8px"
      >
        {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((label, i) => (
          <Chakra.Box
            key={label}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="6px"
            bg={i === 1 ? '#00d4ff' : '#2a3138'}
            color={i === 1 ? 'black' : 'white'}
            fontSize="13px"
            fontWeight="bold"
          >
            {label}
          </Chakra.Box>
        ))}
      </Chakra.Box>
    </PreviewContainer>
  )

  case 'Canvas':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        bg="#1e2328"
        border="1px solid #00d4ff"
        borderRadius="8px"
        position="relative"
        overflow="hidden"
      >
        <svg width="100%" height="100%" viewBox="0 0 200 120">
          <line
            x1="10"
            y1="10"
            x2="190"
            y2="110"
            stroke="#00d4ff"
            strokeWidth="2"
          />

          <line
            x1="190"
            y1="10"
            x2="10"
            y2="110"
            stroke="#00d4ff"
            strokeWidth="2"
          />

          <rect
            x="60"
            y="30"
            width="80"
            height="40"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="2"
          />

          <circle
            cx="100"
            cy="80"
            r="15"
            fill="#00d4ff"
          />
        </svg>
      </Chakra.Box>
    </PreviewContainer>
  )

case 'Line':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        overflow="hidden"
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            stroke="#00d4ff"
            strokeWidth="3"
          />
        </svg>
      </Chakra.Box>
    </PreviewContainer>
  )

case 'Tabview':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        border="1px solid #00d4ff"
        borderRadius="8px"
        overflow="hidden"
        bg="#1e2328"
      >
        <Chakra.Box display="flex" height="34px">
          {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, i) => (
            <Chakra.Box
              key={tab}
              flex="1"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={i === 0 ? '#00d4ff' : '#2a3138'}
              color={i === 0 ? 'black' : 'white'}
              fontSize="12px"
              fontWeight="bold"
            >
              {tab}
            </Chakra.Box>
          ))}
        </Chakra.Box>

        <Chakra.Box
          height="calc(100% - 34px)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
        >
          Tab 1 content
        </Chakra.Box>
      </Chakra.Box>
    </PreviewContainer>
  )

  case 'ImageButton':
case 'Lottie':
case 'ObjxTempl':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="1px dashed #00d4ff"
        color="#00d4ff"
        fontSize="sm"
        bg="rgba(0,212,255,0.08)"
      >
        {type}
      </Chakra.Box>
    </PreviewContainer>
  )

case 'Tileview':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        gridTemplateRows="repeat(2, 1fr)"
        gap="6px"
        p="8px"
        border="1px solid #00d4ff"
        borderRadius="8px"
        bg="#1e2328"
      >
        {['Tile 1', 'Tile 2', 'Tile 3', 'Tile 4'].map((tile, i) => (
          <Chakra.Box
            key={tile}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="6px"
            bg={i === 0 ? '#00d4ff' : '#2a3138'}
            color={i === 0 ? 'black' : 'white'}
            fontSize="12px"
            fontWeight="bold"
          >
            {tile}
          </Chakra.Box>
        ))}
      </Chakra.Box>
    </PreviewContainer>
  )

case 'AnimImage':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <Chakra.Box
        width="100%"
        height="100%"
        border="1px solid #00d4ff"
        borderRadius="8px"
        bg="#1e2328"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        AnimImage
      </Chakra.Box>
    </PreviewContainer>
  )

    default:
      return null
  }
}

export default memo(ComponentPreview)
