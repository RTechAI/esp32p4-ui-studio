import React, {
  memo,
  useEffect,
  useState,
} from 'react'
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
import PreviewContainer from '~components/editor/PreviewContainer'
import WithChildrenPreviewContainer from '~components/editor/WithChildrenPreviewContainer'
import IconButtonPreview from './previews/IconButtonPreview'
import SelectPreview from '~components/editor/previews/SelectPreview'
import NumberInputPreview from '~components/editor/previews/NumberInputPreview'
import BreadcrumbPreview from './previews/BreadcrumbPreview'
import BreadcrumbItemPreview from './previews/BreadcrumbItemPreview'
import HighlightPreview from './previews/HighlightPreview'
import SliderPreview from '~components/editor/previews/SliderPreview'
import BarPreview from '~components/editor/previews/BarPreview'
import ArcPreview from '~components/editor/previews/ArcPreview'
import StandardChartPreview from '~forgeui/preview/StandardChartPreview'
import StandardQRCodePreview from '~forgeui/preview/StandardQRCodePreview'
import StandardScalePreview from '~forgeui/preview/StandardScalePreview'
import StandardSpinnerPreview from '~forgeui/preview/StandardSpinnerPreview'
import SpinboxPreview from '~components/editor/previews/SpinboxPreview'
import StandardListPreview from '~forgeui/preview/StandardListPreview'
import StandardRollerPreview from '~forgeui/preview/StandardRollerPreview'
import StandardMessageBoxPreview from '~forgeui/preview/StandardMessageBoxPreview'
import StandardButtonMatrixPreview from '~forgeui/preview/StandardButtonMatrixPreview'
import StandardCalendarPreview from '~forgeui/preview/StandardCalendarPreview'
import StandardCanvasPreview from '~forgeui/preview/StandardCanvasPreview'
import StandardTabViewPreview from '~forgeui/preview/StandardTabViewPreview'
import StandardTileViewPreview from '~forgeui/preview/StandardTileViewPreview'
import StandardButtonPreview from '~forgeui/preview/StandardButtonPreview'
import StandardTextPreview from '~forgeui/preview/StandardTextPreview'
import StandardHeadingPreview from '~forgeui/preview/StandardHeadingPreview'
import StandardIconPreview from '~forgeui/preview/StandardIconPreview'
import StandardBoxPreview from '~forgeui/preview/StandardBoxPreview'
import StandardDividerPreview from '~forgeui/preview/StandardDividerPreview'
import StandardWifiPreview from '~forgeui/preview/StandardWifiPreview'
import StandardLineCanvasPreview from './previews/StandardLineCanvasPreview'
import { StandardSpanPreview, StandardAnimImagePreview, StandardImageButtonPreview } from '~forgeui/preview/StandardClosureWidgetPreviews'
import { StandardWindowPreview } from '~forgeui/preview/StandardWindowPreview'
import { StandardMenuPreview } from '~forgeui/preview/StandardMenuPreview'
import { ForgeUIDashboardCardPreview } from '~forgeui/preview/ForgeUIDashboardCardPreview'
import { ForgeUISensorTilePreview } from '~forgeui/preview/ForgeUISensorTilePreview'
import { ForgeUIRelayPanelPreview } from '~forgeui/preview/ForgeUIRelayPanelPreview'
import { ForgeUIPwmControllerPreview } from '~forgeui/preview/ForgeUIPwmControllerPreview'
import { ForgeUITrendChartProPreview } from '~forgeui/preview/ForgeUITrendChartProPreview'
import { ForgeUIAlarmPanelPreview } from '~forgeui/preview/ForgeUIAlarmPanelPreview'
import { ForgeUIIOMonitorPreview } from '~forgeui/preview/ForgeUIIOMonitorPreview'
import { ForgeUIBatteryCardPreview } from '~forgeui/preview/ForgeUIBatteryCardPreview'
import { ForgeUITankLevelCardPreview } from '~forgeui/preview/ForgeUITankLevelCardPreview'
import { ForgeUINetworkStatusCardPreview } from '~forgeui/preview/ForgeUINetworkStatusCardPreview'
import { FORGEUI_NETWORK_STATUS_CARD_MIN_SIZE } from '~forgeui/ForgeUINetworkStatusCard'
import { ForgeUIDeviceSummaryCardPreview } from '~forgeui/preview/ForgeUIDeviceSummaryCardPreview'
import { FORGEUI_DEVICE_SUMMARY_CARD_MIN_SIZE } from '~forgeui/ForgeUIDeviceSummaryCard'
import { FORGEUI_TANK_LEVEL_CARD_MIN_SIZE } from '~forgeui/ForgeUITankLevelCard'
import { FORGEUI_BATTERY_CARD_MIN_SIZE } from '~forgeui/ForgeUIBatteryCard'
import { ForgeUIKpiCardPreview } from '~forgeui/preview/ForgeUIKpiCardPreview'
import { FORGEUI_KPI_CARD_MIN_SIZE } from '~forgeui/ForgeUIKpiCard'
import { ForgeUIPowerFlowCardPreview } from '~forgeui/preview/ForgeUIPowerFlowCardPreview'
import { FORGEUI_POWER_FLOW_CARD_MIN_SIZE } from '~forgeui/ForgeUIPowerFlowCard'
import { useForgePreviewPalette } from '~forgeui/theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from '~forgeui/preview/forgeThemeMap'
import InteractiveButtonCanvasPreview, {
  getInteractiveButtonCanvasAspectRatio,
} from './previews/InteractiveButtonCanvasPreview'
import InteractiveLightCanvasPreview from './previews/InteractiveLightCanvasPreview'
import InteractiveStatusIndicatorCanvasPreview, {
  getInteractiveStatusIndicatorCanvasAspectRatio,
} from './previews/InteractiveStatusIndicatorCanvasPreview'
import InteractiveToggleSwitchCanvasPreview, {
  getInteractiveToggleCanvasAspectRatio,
} from './previews/InteractiveToggleSwitchCanvasPreview'
import StandardSwitchPreview from '~forgeui/preview/StandardSwitchPreview'
import StandardCheckboxPreview from '~forgeui/preview/StandardCheckboxPreview'
import { getForgeUIStandardCheckboxText } from '~forgeui/ForgeUIStandardCheckbox'
import StandardRadioPreview from '~forgeui/preview/StandardRadioPreview'
import { getForgeUIStandardRadioText } from '~forgeui/ForgeUIStandardRadio'
import InteractiveThreePositionToggleCanvasPreview, {
  getInteractiveThreePositionCanvasAspectRatio,
} from './previews/InteractiveThreePositionToggleCanvasPreview'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
} from '~forgeui/ForgeUINavigation'
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
  const previewPalette = useForgePreviewPalette()
  const previewTheme = resolveForgeSemanticPalette(previewPalette)
  const [, setUploadedAssetsVersion] = useState(0)

  useEffect(() => {
    if (
      component?.type !== 'InteractiveButton' &&
      component?.type !== 'InteractiveStatusIndicator' &&
      component?.type !== 'InteractiveToggleSwitch' &&
      component?.type !== 'InteractiveThreePositionToggleSwitch'
    ) {
      return
    }

    const refreshArtworkDimensions = () =>
      setUploadedAssetsVersion(version => version + 1)

    window.addEventListener(
      'forgeui-assets-updated',
      refreshArtworkDimensions,
    )
    window.addEventListener(
      FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      refreshArtworkDimensions,
    )
    return () => {
      window.removeEventListener(
        'forgeui-assets-updated',
        refreshArtworkDimensions,
      )
      window.removeEventListener(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
        refreshArtworkDimensions,
      )
    }
  }, [component?.type])

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
        <StandardRadioPreview
          initialSelected={Boolean(component.props.isChecked)}
          isDisabled={Boolean(component.props.isDisabled)}
          colorScheme={
            component.props.colorScheme || 'blue'
          }
          label={getForgeUIStandardRadioText(component.props)}
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
        <StandardSwitchPreview
          initialChecked={Boolean(component.props.isChecked)}
          isDisabled={Boolean(component.props.isDisabled)}
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
      resizeMode="selection-border"
      resizeAspectRatio={
        getInteractiveButtonCanvasAspectRatio(component)
      }
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
      resizeMode="selection-border"
      {...forwardedProps}
    >
      <InteractiveLightCanvasPreview component={component} />
    </PreviewContainer>
  )

  case 'InteractiveStatusIndicator':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      resizeMode="selection-border"
      resizeAspectRatio={
        getInteractiveStatusIndicatorCanvasAspectRatio(component)
      }
      {...forwardedProps}
    >
      <InteractiveStatusIndicatorCanvasPreview component={component} />
    </PreviewContainer>
  )

  case 'InteractiveToggleSwitch':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      resizeMode="selection-border"
      resizeAspectRatio={
        getInteractiveToggleCanvasAspectRatio(component)
      }
      {...forwardedProps}
    >
      <InteractiveToggleSwitchCanvasPreview component={component} />
    </PreviewContainer>
    )
  case 'InteractiveThreePositionToggleSwitch':
    return (
      <PreviewContainer
        component={component}
        enableVisualHelper
        resizeMode="selection-border"
        resizeAspectRatio={
          getInteractiveThreePositionCanvasAspectRatio(component)
        }
        {...forwardedProps}
      >
        <InteractiveThreePositionToggleCanvasPreview component={component} />
      </PreviewContainer>
    )

case 'Button':
  return (
    <PreviewContainer
      component={component}
      {...forwardedProps}
    >
      <StandardButtonPreview
        component={component}
        palette={previewPalette}
      />
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
      <StandardIconPreview component={component} palette={previewPalette} />
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
      <Chakra.Progress
        {...component.props}
        value={component.props.value ?? 60}
        width="100%"
        height="100%"
        borderRadius="md"
        bg={previewTheme.surfaceSecondary}
        sx={{ '& > div': { background: previewTheme.accent } }}
      />
    </PreviewContainer>
  )

case 'Select':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <SelectPreview component={component} />
    </PreviewContainer>
  )

  case 'Spinbox':
    return (
      <PreviewContainer
        component={component}
        enableVisualHelper
        {...forwardedProps}
      >
        <SpinboxPreview component={component} />
      </PreviewContainer>
    )

  case 'Spinner':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardSpinnerPreview
        duration={component.props.duration}
        arcLength={component.props.arcLength}
        arcWidth={component.props.arcWidth}
        backgroundWidth={component.props.backgroundWidth}
        accentColor={component.props.accentColor}
        backgroundColor={component.props.backgroundColor}
        opacity={component.props.opacity}
      />
    </PreviewContainer>
  )

  case 'List':
    return (
      <PreviewContainer
        component={component}
        enableVisualHelper
        {...forwardedProps}
      >
        <StandardListPreview mode="canvas" props={component.props} />
      </PreviewContainer>
    )

  case 'Heading':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardHeadingPreview
        component={component}
        palette={previewPalette}
      />
    </PreviewContainer>
  )

  case 'Clock':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <ClockPreview component={component} palette={previewPalette} />
    </PreviewContainer>
  )

  case 'WiFi':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardWifiPreview palette={previewPalette} component={component} />
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
       width="100%"
        height="100%"
        bg={previewTheme.surface}
        color={previewTheme.textPrimary}
        borderColor={previewTheme.surfaceBorder}
        borderWidth="1px"
        borderRadius="6px"
        px="16px"
        py="0"
        _placeholder={{ color: previewTheme.textSecondary, opacity: 1 }}
        _focus={{
          borderColor: previewTheme.accent,
          boxShadow: 'none',
        }}
        _disabled={{ color: previewTheme.disabledText, opacity: 1 }}
         placeholder={component.props.placeholder || 'Input value'}
/>
    </PreviewContainer>
  )

  case 'Box': {
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardBoxPreview component={component} palette={previewPalette} />
    </PreviewContainer>
  )
  }
  
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
        <StandardCheckboxPreview
          mode="canvas"
          initialChecked={Boolean(component.props.isChecked)}
          isDisabled={Boolean(component.props.isDisabled)}
          colorScheme={
            component.props.colorScheme || 'blue'
          }
          label={getForgeUIStandardCheckboxText(component.props)}
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
         width="100%"
          height="100%"
          bg={previewTheme.surface}
          color={previewTheme.textPrimary}
          borderColor={previewTheme.surfaceBorder}
          borderWidth="1px"
          borderRadius="6px"
          px="16px"
          py="8px"
          _placeholder={{ color: previewTheme.textSecondary, opacity: 1 }}
          _focus={{
            borderColor: previewTheme.accent,
            boxShadow: 'none',
          }}
          _disabled={{ color: previewTheme.disabledText, opacity: 1 }}
            placeholder={component.props.placeholder || 'Textarea value'}
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
      <StandardTextPreview
        component={component}
        palette={previewPalette}
      />
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
          data-testid="standard-led-preview"
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
      <BarPreview component={component} palette={previewPalette} />
    </PreviewContainer>
  )

case 'Arc':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <ArcPreview component={component} palette={previewPalette} />
    </PreviewContainer>
  )

  

case 'Calendar':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardCalendarPreview
        component={component}
        palette={previewPalette}
      />
    </PreviewContainer>
  )

  case 'Chart':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardChartPreview
        component={component}
        palette={previewPalette}
      />
    </PreviewContainer>
  )

  case 'Scale':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardScalePreview
        component={component}
        palette={previewPalette}
      />
    </PreviewContainer>
  )

  case 'QRCode':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardQRCodePreview
        component={component}
        palette={previewPalette}
      />
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
        border={`1px solid ${previewTheme.surfaceBorder}`}
        borderRadius="8px"
        overflow="hidden"
        bg={previewTheme.surface}
        color={previewTheme.textPrimary}
        fontSize="12px"
        data-testid="standard-table-canvas"
      >
        {['A1', 'B1', 'A2', 'B2'].map((cell) => (
          <Chakra.Box
            key={cell}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border={`1px solid ${previewTheme.surfaceBorder}`}
            bg={previewTheme.surfaceSecondary}
            p="8px"
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
      <Chakra.Box width="100%" height="100%" p="8px" display="flex" flexDirection="column" gap="6px" border={`1px solid ${previewTheme.surfaceBorder}`} borderRadius="8px" bg={`${previewTheme.surface}B3`} data-testid="standard-keyboard-canvas">
        {[['1#','q','w','e','r','t','y','u','i','o','p','⌫'], ['ABC','a','s','d','f','g','h','j','k','l','↵'], ['_','-','z','x','c','v','b','n','m','.',',',':'], ['⌨','<','','','','','','','>','✓']].map((row, r) => (
          <Chakra.Box key={r} flex="1" display="grid" gridTemplateColumns={`repeat(${row.length}, 1fr)`} gap="6px">
            {row.map((key, i) => (
              <Chakra.Box key={`${r}-${i}`} display="flex" alignItems="center" justifyContent="center" border={`1px solid ${previewTheme.surfaceBorder}`} borderRadius="6px" bg={previewTheme.surfaceSecondary} color={previewTheme.textPrimary} fontSize="11px" data-testid="standard-keyboard-key">
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
      <StandardMessageBoxPreview
        component={component}
        palette={previewPalette}
      />
    </PreviewContainer>
  )

  case 'Roller':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardRollerPreview
        component={component}
        palette={previewPalette}
      />
    </PreviewContainer>
  )

  case 'ButtonMatrix':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardButtonMatrixPreview
        component={component}
        palette={previewPalette}
      />
    </PreviewContainer>
  )

  case 'Canvas':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardCanvasPreview
        component={component}
        palette={previewPalette}
      />
    </PreviewContainer>
  )

case 'Line':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardLineCanvasPreview
        component={component}
        palette={previewPalette}
      />
    </PreviewContainer>
  )

case 'Divider':
  return (
    <PreviewContainer component={component} enableVisualHelper {...forwardedProps}>
      <StandardDividerPreview component={component} palette={previewPalette} />
    </PreviewContainer>
  )

case 'Tabview':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardTabViewPreview
        component={component}
        palette={previewPalette}
      />
    </PreviewContainer>
  )

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
      <StandardTileViewPreview
        component={component}
        palette={previewPalette}
        mode="canvas"
      />
    </PreviewContainer>
  )

case 'AnimImage':
  return (
    <PreviewContainer
      component={component}
      enableVisualHelper
      {...forwardedProps}
    >
      <StandardAnimImagePreview component={component} palette={previewTheme} />
    </PreviewContainer>
  )

case 'Span':
  return <PreviewContainer component={component} enableVisualHelper {...forwardedProps}><StandardSpanPreview component={component} palette={previewTheme} /></PreviewContainer>

case 'ImageButton':
  return <PreviewContainer component={component} enableVisualHelper {...forwardedProps}><StandardImageButtonPreview component={component} mode="canvas" /></PreviewContainer>

case 'Window':
  return <PreviewContainer component={component} enableVisualHelper {...forwardedProps}>
    <StandardWindowPreview component={component}>
      {component.children.map(key => <ComponentPreview key={key} componentName={key} />)}
    </StandardWindowPreview>
  </PreviewContainer>

case 'Menu':
  return <PreviewContainer component={component} enableVisualHelper {...forwardedProps}>
    <StandardMenuPreview component={component} mode="canvas" />
  </PreviewContainer>

case 'DashboardCard':
  return <PreviewContainer component={component} enableVisualHelper {...forwardedProps}>
    <ForgeUIDashboardCardPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'SensorTile':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={220} resizeMinHeight={128} {...forwardedProps}>
    <ForgeUISensorTilePreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'RelayPanel':
  return <PreviewContainer component={component} enableVisualHelper {...forwardedProps}>
    <ForgeUIRelayPanelPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'PwmController':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={220} resizeMinHeight={128} {...forwardedProps}>
    <ForgeUIPwmControllerPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'TrendChartPro':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={220} resizeMinHeight={140} {...forwardedProps}>
    <ForgeUITrendChartProPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'AlarmPanel':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={240} resizeMinHeight={220} {...forwardedProps}>
    <ForgeUIAlarmPanelPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'IOMonitor':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={240} resizeMinHeight={180} {...forwardedProps}>
    <ForgeUIIOMonitorPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'BatteryCard':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={FORGEUI_BATTERY_CARD_MIN_SIZE.width} resizeMinHeight={FORGEUI_BATTERY_CARD_MIN_SIZE.height} {...forwardedProps}>
    <ForgeUIBatteryCardPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'TankLevelCard':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={FORGEUI_TANK_LEVEL_CARD_MIN_SIZE.width} resizeMinHeight={FORGEUI_TANK_LEVEL_CARD_MIN_SIZE.height} {...forwardedProps}>
    <ForgeUITankLevelCardPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'NetworkStatusCard':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={FORGEUI_NETWORK_STATUS_CARD_MIN_SIZE.width} resizeMinHeight={FORGEUI_NETWORK_STATUS_CARD_MIN_SIZE.height} {...forwardedProps}>
    <ForgeUINetworkStatusCardPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'DeviceSummaryCard':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={FORGEUI_DEVICE_SUMMARY_CARD_MIN_SIZE.width} resizeMinHeight={FORGEUI_DEVICE_SUMMARY_CARD_MIN_SIZE.height} {...forwardedProps}>
    <ForgeUIDeviceSummaryCardPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'KpiCard':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={FORGEUI_KPI_CARD_MIN_SIZE.width} resizeMinHeight={FORGEUI_KPI_CARD_MIN_SIZE.height} {...forwardedProps}>
    <ForgeUIKpiCardPreview component={component} palette={previewPalette} />
  </PreviewContainer>

case 'PowerFlowCard':
  return <PreviewContainer component={component} enableVisualHelper resizeMinWidth={FORGEUI_POWER_FLOW_CARD_MIN_SIZE.width} resizeMinHeight={FORGEUI_POWER_FLOW_CARD_MIN_SIZE.height} {...forwardedProps}>
    <ForgeUIPowerFlowCardPreview component={component} palette={previewPalette} />
  </PreviewContainer>

    default:
      return null
  }
}

export default memo(ComponentPreview)
