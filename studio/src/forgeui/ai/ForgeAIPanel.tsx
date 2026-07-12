import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import React, { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'

import { aiSupportedComponents } from '~componentsList'
import { createForgeAIContext } from './ForgeAIContext'
import { generateForgeAILayout } from './ForgeAIEngine'

type ForgeAIPanelProps = {
  onClose: () => void
  insertAiLayout: (items: any[]) => void
}

const SUPPORTED_AI_COMPONENTS = new Set(aiSupportedComponents)

const AI_LAYOUTS = {
  wifiSetup: [
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 90,
        w: 320,
        h: 60,
        children: 'WiFi Setup',
      },
    },
    {
      type: 'Input',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 180,
        w: 320,
        h: 50,
      },
    },
    {
      type: 'Input',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 250,
        w: 320,
        h: 50,
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 330,
        w: 140,
        h: 50,
        children: 'Scan',
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 540,
        y: 330,
        w: 140,
        h: 50,
        children: 'Connect',
      },
    },
  ],

  loginScreen: [
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 90,
        w: 320,
        h: 60,
        children: 'Login',
      },
    },
    {
      type: 'Input',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 180,
        w: 320,
        h: 50,
      },
    },
    {
      type: 'Input',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 250,
        w: 320,
        h: 50,
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 450,
        y: 330,
        w: 140,
        h: 50,
        children: 'Login',
      },
    },
  ],

  dashboard: [
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 80,
        y: 70,
        w: 420,
        h: 60,
        children: 'Dashboard',
      },
    },
    {
      type: 'Box',
      props: {
        positionMode: 'absolute',
        x: 80,
        y: 160,
        w: 260,
        h: 120,
      },
    },
    {
      type: 'Box',
      props: {
        positionMode: 'absolute',
        x: 380,
        y: 160,
        w: 260,
        h: 120,
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 80,
        y: 330,
        w: 180,
        h: 50,
        children: 'Start',
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 300,
        y: 330,
        w: 180,
        h: 50,
        children: 'Settings',
      },
    },
  ],

  settingsScreen: [
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 90,
        y: 70,
        w: 420,
        h: 60,
        children: 'Settings',
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 110,
        y: 165,
        w: 220,
        h: 40,
        children: 'WiFi',
      },
    },
    {
      type: 'Switch',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 160,
        w: 90,
        h: 50,
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 110,
        y: 235,
        w: 220,
        h: 40,
        children: 'Bluetooth',
      },
    },
    {
      type: 'Switch',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 230,
        w: 90,
        h: 50,
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 110,
        y: 305,
        w: 220,
        h: 40,
        children: 'Sound',
      },
    },
    {
      type: 'Switch',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 300,
        w: 90,
        h: 50,
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 110,
        y: 390,
        w: 160,
        h: 55,
        children: 'Save',
      },
    },
  ],

  sensorDashboard: [
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 70,
        y: 60,
        w: 460,
        h: 60,
        children: 'Sensor Dashboard',
      },
    },
    {
      type: 'Box',
      props: {
        positionMode: 'absolute',
        x: 70,
        y: 155,
        w: 260,
        h: 120,
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 95,
        y: 175,
        w: 180,
        h: 35,
        children: 'Temperature',
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 95,
        y: 220,
        w: 180,
        h: 40,
        children: '24.8 C',
      },
    },
    {
      type: 'Box',
      props: {
        positionMode: 'absolute',
        x: 370,
        y: 155,
        w: 260,
        h: 120,
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 395,
        y: 175,
        w: 180,
        h: 35,
        children: 'Humidity',
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 395,
        y: 220,
        w: 180,
        h: 40,
        children: '61%',
      },
    },
    {
      type: 'Box',
      props: {
        positionMode: 'absolute',
        x: 670,
        y: 155,
        w: 260,
        h: 120,
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 695,
        y: 175,
        w: 180,
        h: 35,
        children: 'Pressure',
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 695,
        y: 220,
        w: 180,
        h: 40,
        children: '101.2 kPa',
      },
    },
  ],

  machineStatusPanel: [
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 80,
        y: 60,
        w: 460,
        h: 60,
        children: 'Machine Status',
      },
    },
    {
      type: 'Led',
      props: {
        positionMode: 'absolute',
        x: 100,
        y: 165,
        w: 40,
        h: 40,
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 165,
        y: 165,
        w: 320,
        h: 40,
        children: 'Motor: Running',
      },
    },
    {
      type: 'Led',
      props: {
        positionMode: 'absolute',
        x: 100,
        y: 235,
        w: 40,
        h: 40,
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 165,
        y: 235,
        w: 320,
        h: 40,
        children: 'Battery: Normal',
      },
    },
    {
      type: 'Led',
      props: {
        positionMode: 'absolute',
        x: 100,
        y: 305,
        w: 40,
        h: 40,
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 165,
        y: 305,
        w: 320,
        h: 40,
        children: 'Network: Connected',
      },
    },
  ],

  diagnosticsScreen: [
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 80,
        y: 60,
        w: 460,
        h: 60,
        children: 'Diagnostics',
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 100,
        y: 155,
        w: 180,
        h: 35,
        children: 'CPU',
      },
    },
    {
      type: 'Bar',
      props: {
        positionMode: 'absolute',
        x: 260,
        y: 155,
        w: 420,
        h: 35,
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 100,
        y: 225,
        w: 180,
        h: 35,
        children: 'Memory',
      },
    },
    {
      type: 'Bar',
      props: {
        positionMode: 'absolute',
        x: 260,
        y: 225,
        w: 420,
        h: 35,
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 100,
        y: 295,
        w: 180,
        h: 35,
        children: 'WiFi',
      },
    },
    {
      type: 'Bar',
      props: {
        positionMode: 'absolute',
        x: 260,
        y: 295,
        w: 420,
        h: 35,
      },
    },
  ],

  touchKeypadScreen: [
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 45,
        w: 320,
        h: 60,
        children: 'Enter PIN',
      },
    },
    {
      type: 'Input',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 120,
        w: 300,
        h: 50,
      },
    },
    ...['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((label, index) => ({
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 360 + (index % 3) * 105,
        y: 195 + Math.floor(index / 3) * 70,
        w: 85,
        h: 55,
        children: label,
      },
    })),
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 360,
        y: 405,
        w: 85,
        h: 55,
        children: 'Cancel',
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 465,
        y: 405,
        w: 85,
        h: 55,
        children: '0',
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 570,
        y: 405,
        w: 85,
        h: 55,
        children: 'Enter',
      },
    },
  ],

  wifiDrawerMockup: [
    {
      type: 'Box',
      props: {
        positionMode: 'absolute',
        x: 640,
        y: 0,
        w: 360,
        h: 600,
      },
    },
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 670,
        y: 45,
        w: 280,
        h: 60,
        children: 'WiFi Networks',
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 670,
        y: 125,
        w: 280,
        h: 45,
        children: 'Scan Networks',
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 675,
        y: 195,
        w: 250,
        h: 35,
        children: 'Workshop_AP',
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 675,
        y: 240,
        w: 250,
        h: 35,
        children: 'Factory_WiFi',
      },
    },
    {
      type: 'Text',
      props: {
        positionMode: 'absolute',
        x: 675,
        y: 285,
        w: 250,
        h: 35,
        children: 'Service_Hotspot',
      },
    },
    {
      type: 'Input',
      props: {
        positionMode: 'absolute',
        x: 670,
        y: 350,
        w: 280,
        h: 50,
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 670,
        y: 425,
        w: 130,
        h: 50,
        children: 'Connect',
      },
    },
    {
      type: 'Button',
      props: {
        positionMode: 'absolute',
        x: 820,
        y: 425,
        w: 130,
        h: 50,
        children: 'Close',
      },
    },
  ],
}

const DEFAULT_LAYOUT_JSON = JSON.stringify(
  {
    name: '',
    category: '',
    description: '',
    layout: [],
  },
  null,
  2
)
const AI_TEMPLATE_BUTTONS = [
  {
    label: 'WiFi Setup',
    document: {
      name: 'WiFi Setup',
      category: 'Templates',
      description: 'Basic WiFi configuration screen',
      layout: AI_LAYOUTS.wifiSetup,
    },
  },
  {
    label: 'Login',
    document: {
      name: 'Login',
      category: 'Templates',
      description: 'Simple login screen',
      layout: AI_LAYOUTS.loginScreen,
    },
  },
  {
    label: 'Dashboard',
    document: {
      name: 'Dashboard',
      category: 'Templates',
      description: 'Basic dashboard layout',
      layout: AI_LAYOUTS.dashboard,
    },
  },
  {
    label: 'Settings',
    document: {
      name: 'Settings',
      category: 'Templates',
      description: 'Basic settings screen with toggles',
      layout: AI_LAYOUTS.settingsScreen,
    },
  },
  {
    label: 'Sensor Dashboard',
    document: {
      name: 'Sensor Dashboard',
      category: 'Templates',
      description: 'Sensor values displayed in dashboard cards',
      layout: AI_LAYOUTS.sensorDashboard,
    },
  },
  {
    label: 'Machine Status',
    document: {
      name: 'Machine Status',
      category: 'Templates',
      description: 'Machine status panel with indicator LEDs',
      layout: AI_LAYOUTS.machineStatusPanel,
    },
  },
  {
    label: 'Diagnostics',
    document: {
      name: 'Diagnostics',
      category: 'Templates',
      description: 'System diagnostics screen with status bars',
      layout: AI_LAYOUTS.diagnosticsScreen,
    },
  },
  {
    label: 'Touch Keypad',
    document: {
      name: 'Touch Keypad',
      category: 'Templates',
      description: 'Touch keypad screen for PIN entry',
      layout: AI_LAYOUTS.touchKeypadScreen,
    },
  },
  {
    label: 'WiFi Drawer',
    document: {
      name: 'WiFi Drawer',
      category: 'Templates',
      description: 'Mockup WiFi drawer with scan and connect controls',
      layout: AI_LAYOUTS.wifiDrawerMockup,
    },
  },
]

export const ForgeAIPanel = ({
  onClose,
  insertAiLayout,
}: ForgeAIPanelProps) => {

  const { setHeroBackground } = useForgeTheme()

  const [layoutJson, setLayoutJson] = useState(DEFAULT_LAYOUT_JSON)
  const [jsonError, setJsonError] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [resultName, setResultName] = useState('')
  const [resultDescription, setResultDescription] = useState('')
  const [heroPrompt, setHeroPrompt] = useState('')
  const [isGeneratingHero, setIsGeneratingHero] = useState(false)
  const [heroError, setHeroError] = useState('')

  const loadLayoutJson = (document: any) => {
    setLayoutJson(JSON.stringify(document, null, 2))
    setResultName(document.name || 'Template Layout')
    setResultDescription(document.description || '')
  }

  const validateAiLayout = (layout: any[]) => {
    if (!Array.isArray(layout)) {
      throw new Error('layout must be an array')
    }

    layout.forEach((item, index) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        throw new Error(`layout[${index}] must be an object`)
      }

      if (typeof item.type !== 'string') {
        throw new Error(`layout[${index}].type must be a string`)
      }

      if (!SUPPORTED_AI_COMPONENTS.has(item.type)) {
        throw new Error(`Unsupported component: ${item.type}`)
      }

      if (
        !item.props ||
        typeof item.props !== 'object' ||
        Array.isArray(item.props)
      ) {
        throw new Error(`layout[${index}].props must be an object`)
      }
    })
  }

  const generateLayout = async () => {
    try {
      setJsonError('')
      setIsGenerating(true)

      const context = createForgeAIContext()

      const document = await generateForgeAILayout({
        prompt: aiPrompt,
        ...context,
      })

      setLayoutJson(JSON.stringify(document, null, 2))
      setResultName(document.name || 'AI Generated Layout')
      setResultDescription(document.description || '')
    } catch (err: any) {
      setJsonError(err.message || 'AI layout generation failed')
    } finally {
      setIsGenerating(false)
    }
  }
  
  const generateHeroBackground = async () => {
  try {
    setHeroError('')
    setIsGeneratingHero(true)

    const response = await fetch('/api/forgeui-ai-hero', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: heroPrompt,
      }),
    })

    const payload = await response.json()

    if (!payload.ok) {
      throw new Error(payload.error)
    }

    setHeroBackground(payload.image)
  } catch (err: any) {
    setHeroError(err.message)
  } finally {
    setIsGeneratingHero(false)
  }
}

  const insertJsonLayout = () => {
    try {
      setJsonError('')

      const parsed = JSON.parse(layoutJson)

      validateAiLayout(parsed.layout)

      insertAiLayout(parsed.layout)
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON')
    }
  }

  return (
    <Box
      position="fixed"
      left="20px"
      top="70px"
      right="20px"
      bottom="20px"
      bg="#070b12"
      color="white"
      border="1px solid rgba(45, 212, 191, 0.55)"
      borderRadius="xl"
      zIndex={9999}
      overflow="hidden"
      boxShadow="0 24px 80px rgba(0, 0, 0, 0.72)"
    >
      <Flex
        justify="space-between"
        align="center"
        px={{ base: 4, md: 6 }}
        py={4}
        borderBottom="1px solid rgba(148, 163, 184, 0.16)"
        bg="linear-gradient(90deg, rgba(124, 58, 237, 0.16), rgba(6, 182, 212, 0.08))"
      >
        <Box>
          <HStack spacing={3} mb={1}>
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg="purple.400"
              boxShadow="0 0 18px rgba(167, 139, 250, 0.95)"
            />
            <Heading size="md">ForgeUI AI Playground</Heading>
            <Badge
              colorScheme="purple"
              variant="subtle"
              borderRadius="full"
              px={2}
            >
              LIVE
            </Badge>
          </HStack>

          <Text color="gray.400" fontSize="sm">
            Natural language → ForgeUI layout → ESP32-P4
          </Text>
        </Box>

        <Button
          size="sm"
          variant="outline"
          colorScheme="red"
          onClick={onClose}
        >
          Close
        </Button>
      </Flex>

      <Box h="calc(100% - 82px)" overflowY="auto" px={{ base: 4, md: 6 }} py={5}>
        <Tabs colorScheme="purple" variant="soft-rounded" isLazy>
          <TabList
            gap={2}
            overflowX="auto"
            pb={3}
            borderBottom="1px solid rgba(148, 163, 184, 0.14)"
          >
            <Tab>Layout</Tab>
            <Tab>Theme</Tab>
            <Tab isDisabled>Assets</Tab>
            <Tab isDisabled>Images</Tab>
            <Tab isDisabled>Icons</Tab>
            <Tab isDisabled>Runtime</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0} pt={5}>
              <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5}>
                <VStack spacing={5} align="stretch">
                  <Box
                    border="1px solid rgba(124, 58, 237, 0.4)"
                    bg="rgba(15, 23, 42, 0.72)"
                    borderRadius="xl"
                    p={5}
                    boxShadow="inset 0 1px 0 rgba(255,255,255,0.03)"
                  >
                    <HStack justify="space-between" mb={1}>
                      <Heading size="sm">Create a layout</Heading>
                      <Badge colorScheme="purple">GPT</Badge>
                    </HStack>

                    <Text color="gray.400" fontSize="sm" mb={4}>
                      Describe the screen, controls and visual direction.
                    </Text>

                    <Textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Create a modern industrial dashboard with machine status, temperature, pressure and start/stop controls..."
                      minH="150px"
                      resize="vertical"
                      bg="#050914"
                      color="white"
                      borderColor="rgba(139, 92, 246, 0.52)"
                      _hover={{ borderColor: 'purple.400' }}
                      _focus={{
                        borderColor: 'purple.300',
                        boxShadow: '0 0 0 1px #c4b5fd',
                      }}
                      fontSize="sm"
                    />

                    <Flex
                      mt={4}
                      gap={3}
                      justify="space-between"
                      align={{ base: 'stretch', md: 'center' }}
                      direction={{ base: 'column', md: 'row' }}
                    >
                      <Text color="gray.500" fontSize="xs">
                        Complete screens work best with clear controls and purpose.
                      </Text>

                      <Button
                        colorScheme="purple"
                        px={7}
                        onClick={generateLayout}
                        isLoading={isGenerating}
                        loadingText="Forging layout"
                        isDisabled={!aiPrompt.trim()}
                        boxShadow="0 0 24px rgba(124, 58, 237, 0.32)"
                      >
                        Generate Layout
                      </Button>
                    </Flex>
                  </Box>

                  <Box
                    border="1px solid rgba(34, 211, 238, 0.28)"
                    bg="rgba(8, 15, 26, 0.76)"
                    borderRadius="xl"
                    p={5}
                  >
                    <Flex justify="space-between" align="center" mb={4}>
                      <Box>
                        <Heading size="sm">Quick templates</Heading>
                        <Text color="gray.500" fontSize="xs" mt={1}>
                          Load a proven starter document, then edit or insert it.
                        </Text>
                      </Box>

                      <Badge colorScheme="cyan">
                        {AI_TEMPLATE_BUTTONS.length} READY
                      </Badge>
                    </Flex>

                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                      {AI_TEMPLATE_BUTTONS.map((template) => (
                        <Button
                          key={template.label}
                          size="sm"
                          variant="outline"
                          colorScheme="cyan"
                          justifyContent="flex-start"
                          onClick={() => {
                            setJsonError('')
                            loadLayoutJson(template.document)
                          }}
                        >
                          {template.label}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </Box>
                </VStack>

                <VStack spacing={5} align="stretch">
                  <Box
                    border="1px solid rgba(45, 212, 191, 0.32)"
                    bg="rgba(8, 18, 24, 0.82)"
                    borderRadius="xl"
                    p={5}
                    minH="250px"
                  >
                    <Flex justify="space-between" align="flex-start" mb={4}>
                      <Box>
                        <Heading size="sm">Generated result</Heading>
                        <Text color="gray.500" fontSize="xs" mt={1}>
                          Review the document, then place it onto the canvas.
                        </Text>
                      </Box>

                      <Badge colorScheme={resultName ? 'green' : 'gray'}>
                        {resultName ? 'READY' : 'WAITING'}
                      </Badge>
                    </Flex>

                    {resultName ? (
                      <Box
                        border="1px solid rgba(74, 222, 128, 0.22)"
                        bg="rgba(22, 101, 52, 0.08)"
                        borderRadius="lg"
                        p={4}
                        mb={4}
                      >
                        <Text fontWeight="bold" color="green.200">
                          {resultName}
                        </Text>

                        <Text color="gray.400" fontSize="sm" mt={1}>
                          {resultDescription || 'ForgeUI layout document ready.'}
                        </Text>
                      </Box>
                    ) : (
                      <Flex
                        minH="112px"
                        align="center"
                        justify="center"
                        border="1px dashed rgba(148, 163, 184, 0.25)"
                        borderRadius="lg"
                        mb={4}
                        px={4}
                        textAlign="center"
                      >
                        <Text color="gray.500" fontSize="sm">
                          Generate a layout or choose a quick template.
                        </Text>
                      </Flex>
                    )}

                    <Button
                      w="full"
                      size="lg"
                      colorScheme="teal"
                      onClick={insertJsonLayout}
                      isDisabled={!resultName}
                      boxShadow={
                        resultName
                          ? '0 0 28px rgba(45, 212, 191, 0.25)'
                          : 'none'
                      }
                    >
                      Insert Into Canvas
                    </Button>

                    <Divider my={4} borderColor="rgba(148, 163, 184, 0.16)" />

                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="cyan"
                      onClick={() => setShowAdvanced((value) => !value)}
                    >
                      {showAdvanced ? 'Hide Advanced JSON' : 'Show Advanced JSON'}
                    </Button>

                    <Collapse in={showAdvanced} animateOpacity>
                      <Box mt={4}>
                        <Textarea
                          value={layoutJson}
                          onChange={(e) => {
                            setLayoutJson(e.target.value)
                            setJsonError('')
                          }}
                          minH="330px"
                          bg="#050914"
                          color="cyan.100"
                          borderColor="gray.700"
                          fontFamily="monospace"
                          fontSize="sm"
                        />
                      </Box>
                    </Collapse>

                    {jsonError && (
                      <Box
                        mt={4}
                        p={3}
                        borderRadius="md"
                        bg="rgba(127, 29, 29, 0.3)"
                        border="1px solid rgba(248, 113, 113, 0.45)"
                        color="red.200"
                        fontFamily="monospace"
                        fontSize="sm"
                      >
                        {jsonError}
                      </Box>
                    )}
                  </Box>

                  <Box
                    border="1px solid rgba(148, 163, 184, 0.16)"
                    borderRadius="xl"
                    p={4}
                    bg="rgba(15, 23, 42, 0.42)"
                  >
                    <Text color="gray.300" fontWeight="semibold" fontSize="sm">
                      Layout Engine
                    </Text>
                    <Text color="gray.500" fontSize="xs" mt={1}>
                      GPT generation, validation, canvas insertion, browser preview
                      and physical ESP32-P4 output are proven.
                    </Text>
                  </Box>
                </VStack>
              </SimpleGrid>
            </TabPanel>

            <TabPanel px={0} pt={5}>
            
      <Box
  maxW="900px"
  border="1px solid rgba(124,58,237,0.36)"
  bg="rgba(15,23,42,0.72)"
  borderRadius="xl"
  p={6}
>
  <Heading size="md" mb={4}>
    AI Hero Background
  </Heading>

  <Textarea
    value={heroPrompt}
    onChange={(e) => setHeroPrompt(e.target.value)}
    placeholder="Create a luxury yacht dashboard background..."
    mb={4}
  />

  <Button
    colorScheme="purple"
    onClick={generateHeroBackground}
    isLoading={isGeneratingHero}
    isDisabled={!heroPrompt.trim()}
  >
    Generate Hero Background
  </Button>

  {heroError && (
    <Text mt={4} color="red.300">
      {heroError}
    </Text>
  )}
</Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
}

export default ForgeAIPanel