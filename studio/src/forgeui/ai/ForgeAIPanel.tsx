import {
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import {
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Heading,
  Input,
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

type HeroPromptExample = {
  title: string
  category: string
  prompt: string
}

const HERO_PROMPT_EXAMPLES: HeroPromptExample[] = [
  {
    title: 'EV Fast Charger',
    category: 'Energy',
    prompt:
      'Create a premium futuristic EV fast-charging station hero background for a 1024x600 embedded HMI. Position the charger and vehicle in the lower-left. Use graphite black, electric cyan, brushed aluminium and subtle amber indicators. Leave at least 45% of the upper-right as a smooth dark gradient for transparent LVGL widgets. Cinematic lighting, polished floor reflections, photorealistic, no people, text, logos, buttons or UI elements.',
  },
  {
    title: 'Battery Energy Storage',
    category: 'Energy',
    prompt:
      'Create a premium battery energy storage facility hero background for a 1024x600 embedded HMI. Place containerised battery racks, power converters and illuminated electrical cabinets along the lower-left. Use dark graphite, steel grey, electric green and cyan status lighting. Leave the upper-right clean and dark for transparent widgets. Photorealistic engineering visualisation, no people, text, logos or UI elements.',
  },
  {
    title: 'Nuclear Reactor',
    category: 'Energy',
    prompt:
      'Create a dramatic premium nuclear reactor control environment for a 1024x600 embedded HMI. Position the glowing reactor core, pipes and engineering structures on the lower-left. Use industrial steel, deep graphite, electric cyan and amber light. Reserve the upper-right as a clean dark gradient for transparent widgets. Photorealistic, cinematic, no people, text, warning labels, logos or UI controls.',
  },
  {
    title: 'Fusion Energy Core',
    category: 'Energy',
    prompt:
      'Create a futuristic fusion energy chamber hero background for a 1024x600 embedded HMI. Show a contained blue-white plasma ring in the lower-left with precision engineering, magnetic coils and dark metallic structures. Leave half of the right side as smooth dark negative space. Premium cinematic realism, cyan, violet and white energy glow, no people, text, logos or UI elements.',
  },

  {
    title: 'Industrial Factory',
    category: 'Industrial',
    prompt:
      'Create a premium Industry 4.0 smart factory hero background for a 1024x600 embedded HMI. Position robotic assembly lines, CNC machines, conveyors and illuminated control cabinets across the lower-left third. Use graphite black, industrial grey, brushed steel, electric cyan and amber status lights. Leave approximately 45% of the upper-right as a smooth dark gradient for transparent LVGL widgets. Photorealistic, clean engineering visualisation, no people, text, logos, warning signs or UI elements.',
  },
  {
    title: 'Warehouse Automation',
    category: 'Industrial',
    prompt:
      'Create a premium automated warehouse hero background for a 1024x600 embedded HMI. Show autonomous mobile robots, storage racks, conveyor systems and robotic picking equipment on the left. Use dark steel, cyan navigation lights and warm amber indicators. Reserve the right side as clean dark negative space for widgets. Photorealistic, minimal clutter, no people, text, logos or UI controls.',
  },
  {
    title: 'Mining Operations',
    category: 'Industrial',
    prompt:
      'Create a cinematic mining operations control hero background for a 1024x600 embedded HMI. Position a large excavator, haul truck and illuminated processing equipment in the lower-left. Use charcoal rock, dark steel, amber work lights and cool blue status lighting. Leave the upper-right dark and uncluttered for widgets. Photorealistic, no people, text, logos or UI elements.',
  },
  {
    title: 'Water Treatment Plant',
    category: 'Industrial',
    prompt:
      'Create a premium modern water-treatment facility hero background for a 1024x600 embedded HMI. Place stainless-steel pipes, pumps, filtration tanks and subtle blue-lit equipment on the left. Use deep navy, steel grey, cyan and white highlights. Reserve the right half as clean smooth gradients for transparent widgets. Photorealistic, no people, labels, logos or UI controls.',
  },

  {
    title: 'Luxury Supercar',
    category: 'Automotive',
    prompt:
      'Create a premium luxury electric hypercar showroom hero background for a 1024x600 embedded HMI. Position the vehicle in the lower-left beneath cinematic architectural lighting. Use matte black, graphite, carbon fibre, electric blue and polished concrete reflections. Leave the upper-right intentionally clean and dark for transparent widgets. Photorealistic, no people, logos, badges, text or UI controls.',
  },
  {
    title: 'Classic Muscle Car',
    category: 'Automotive',
    prompt:
      'Create a cinematic classic muscle-car garage hero background for a 1024x600 embedded HMI. Position a powerful late-1960s style coupe in the lower-left without visible branding. Use deep metallic red, black chrome, warm workshop lighting and polished floor reflections. Leave the upper-right dark and clean for widgets. Photorealistic, no people, text, logos or UI elements.',
  },
  {
    title: 'Race Team Garage',
    category: 'Automotive',
    prompt:
      'Create a premium motorsport pit-garage hero background for a 1024x600 embedded HMI. Place an unbranded racing vehicle, tyre equipment and illuminated engineering tools along the lower-left. Use carbon fibre, graphite, red accents and bright white strip lighting. Reserve the upper-right as clean negative space for widgets. Photorealistic, no people, sponsors, text, logos or UI elements.',
  },
  {
    title: 'Off-Road Explorer',
    category: 'Automotive',
    prompt:
      'Create a cinematic off-road expedition hero background for a 1024x600 embedded HMI. Position a rugged unbranded 4WD vehicle on the lower-left overlooking mountains and a remote trail. Use dark earth tones, amber sunset light and cool blue shadows. Leave the upper-right sky clean for widgets. Photorealistic, no people, text, logos or UI controls.',
  },

  {
    title: 'Luxury Yacht',
    category: 'Marine',
    prompt:
      'Create a premium luxury yacht glass-cockpit hero background for a 1024x600 embedded HMI. Position the helm, polished metal and ocean view along the lower-left. Use deep navy, brushed aluminium, cyan navigation lighting and elegant reflections. Leave the upper-right clean and dark for transparent widgets. Photorealistic, no people, text, logos, labels or UI controls.',
  },
  {
    title: 'Marine Radar',
    category: 'Marine',
    prompt:
      'Create a professional marine radar bridge hero background for a 1024x600 embedded HMI. Position subtle radar hardware, navigation equipment and panoramic ocean windows on the left. Use midnight navy, cyan glow, steel grey and soft white lighting. Leave half of the right side as clean negative space. Photorealistic, no people, text, logos or UI elements.',
  },
  {
    title: 'Fishing Sonar',
    category: 'Marine',
    prompt:
      'Create a premium sport-fishing vessel hero background for a 1024x600 embedded HMI. Show the boat console, sonar hardware, rods and open ocean in the lower-left without visible branding. Use deep blue water, cyan lighting, white highlights and dark graphite surfaces. Reserve the upper-right for transparent widgets. Photorealistic, no people, text, logos or UI controls.',
  },
  {
    title: 'Offshore Platform',
    category: 'Marine',
    prompt:
      'Create a dramatic offshore energy platform hero background for a 1024x600 embedded HMI. Position structural steel, cranes, pipelines and illuminated equipment along the lower-left horizon. Use deep ocean blue, graphite steel, amber work lights and cyan status lighting. Leave the upper-right dark and uncluttered. Photorealistic, no people, text, logos or UI elements.',
  },

  {
    title: 'Medical Monitor',
    category: 'Medical',
    prompt:
      'Create a premium modern intensive-care monitoring room hero background for a 1024x600 embedded HMI. Position an unoccupied bed, ventilator, infusion pumps and medical equipment on the left. Use medical white, soft cyan, deep navy and steel grey. Leave approximately 50% of the right side as smooth clean gradients for transparent widgets. Photorealistic, no people, patients, doctors, text, logos, branding or UI controls.',
  },
  {
    title: 'Medical Laboratory',
    category: 'Medical',
    prompt:
      'Create a premium futuristic medical laboratory hero background for a 1024x600 embedded HMI. Place analysers, microscopes, glass equipment and cool illuminated cabinets on the lower-left. Use clean white, cyan, pale blue and graphite. Reserve the right side as uncluttered negative space for widgets. Photorealistic, no people, text, logos, labels or UI elements.',
  },

  {
    title: 'Space Command',
    category: 'Space',
    prompt:
      'Create a premium deep-space command centre hero background for a 1024x600 embedded HMI. Position a sleek command console in the lower-left and Earth near the lower-right horizon beyond a panoramic window. Use space black, midnight blue, electric cyan, cool white and subtle amber lights. Keep the upper-right dark and open for widgets. Photorealistic cinematic science fiction, no people, astronauts, text, logos, weapons or UI elements.',
  },
  {
    title: 'Lunar Base',
    category: 'Space',
    prompt:
      'Create a cinematic lunar research-base hero background for a 1024x600 embedded HMI. Place habitat modules, scientific equipment and a rover along the lower-left lunar horizon. Use moon-grey, deep black, cool white and electric blue lighting. Leave the upper-right as open black space for transparent widgets. Photorealistic, no people, text, logos, flags or UI elements.',
  },
  {
    title: 'Mars Habitat',
    category: 'Space',
    prompt:
      'Create a premium Mars habitat hero background for a 1024x600 embedded HMI. Position futuristic habitat modules, solar arrays and a rover in the lower-left against a red desert landscape. Use rust orange, dark graphite, cyan status lights and soft sunset haze. Reserve the upper-right sky for widgets. Photorealistic, no people, text, logos or UI controls.',
  },

  {
    title: 'Cyberpunk Neon',
    category: 'Future',
    prompt:
      'Create a premium cyberpunk megacity hero background for a 1024x600 embedded HMI. Place a holographic workstation in the lower-left and a neon city skyline across the lower third. Use midnight black, neon cyan, magenta, deep violet and dark chrome. Leave half of the upper-right as clean dark atmosphere for widgets. Rain reflections, volumetric fog, cinematic realism, no people, text, billboards, logos, weapons or UI controls.',
  },
  {
    title: 'Quantum Computer',
    category: 'Future',
    prompt:
      'Create a premium quantum-computing laboratory hero background for a 1024x600 embedded HMI. Position a suspended cryogenic quantum processor and illuminated engineering hardware on the lower-left. Use polished gold, dark graphite, electric cyan and violet lighting. Leave the right side dark and clean for transparent widgets. Photorealistic, no people, text, logos or UI elements.',
  },
  {
    title: 'AI Neural Core',
    category: 'Future',
    prompt:
      'Create a cinematic artificial-intelligence neural core hero background for a 1024x600 embedded HMI. Show a glowing abstract processor and branching light pathways in the lower-left. Use deep black, electric cyan, violet, magenta and white energy highlights. Reserve the upper-right as smooth dark negative space. Premium photorealistic technology art, no text, logos or UI controls.',
  },

  {
    title: 'Arctic Blue',
    category: 'Colour',
    prompt:
      'Create an elegant arctic-blue embedded HMI hero background for 1024x600. Use layered ice-blue glass, frosted translucent surfaces, cool white highlights and subtle metallic reflections. Keep visual detail concentrated in the lower-left and leave the upper-right as a smooth blue-black gradient for transparent widgets. Premium, photorealistic, no text, logos or UI elements.',
  },
  {
    title: 'Emerald Glass',
    category: 'Colour',
    prompt:
      'Create a luxury emerald-green glass hero background for a 1024x600 embedded HMI. Use dark green crystal surfaces, brushed aluminium, soft glowing edges and deep black gradients. Concentrate detail on the left and reserve the right half for transparent widgets. Premium photorealistic design, no text, logos or UI controls.',
  },
  {
    title: 'Royal Purple',
    category: 'Colour',
    prompt:
      'Create a premium royal-purple technology hero background for a 1024x600 embedded HMI. Use illuminated violet glass, dark chrome, subtle lavender light beams and smooth black gradients. Keep decorative detail on the lower-left and leave the upper-right clean for widgets. Photorealistic, no text, logos or UI elements.',
  },
  {
    title: 'Amber Industrial',
    category: 'Colour',
    prompt:
      'Create a premium amber-and-graphite industrial hero background for a 1024x600 embedded HMI. Use brushed dark steel, glowing amber edge lights, warm reflections and subtle mechanical detail on the lower-left. Leave the upper-right dark and uncluttered for transparent widgets. Photorealistic, no text, logos or UI controls.',
  },
  {
    title: 'Crimson Steel',
    category: 'Colour',
    prompt:
      'Create a dramatic crimson-red and black steel hero background for a 1024x600 embedded HMI. Use precision-machined metal, dark carbon surfaces, red illuminated seams and polished reflections. Concentrate detail on the left and reserve the right for widgets. Premium cinematic realism, no text, logos or UI elements.',
  },
  {
    title: 'Gold Luxury',
    category: 'Colour',
    prompt:
      'Create an ultra-premium black-and-gold hero background for a 1024x600 embedded HMI. Use polished brass, dark marble, smoked glass, warm architectural lighting and elegant reflections. Keep detailed luxury materials on the lower-left and leave the upper-right clean for widgets. Photorealistic, no text, logos or UI controls.',
  },

  {
    title: 'Retro Arcade',
    category: 'Playful',
    prompt:
      'Create a colourful retro-arcade hero background for a 1024x600 embedded HMI. Use glowing pixel-inspired shapes, purple and cyan neon, checkerboard reflections and playful 1980s atmosphere. Keep visual elements concentrated in the lower-left and leave the upper-right dark for widgets. No readable text, logos, characters or UI controls.',
  },
  {
    title: 'Cartoon Factory',
    category: 'Playful',
    prompt:
      'Create a polished colourful caricature-style smart factory hero background for a 1024x600 embedded HMI. Show exaggerated friendly robotic arms, chunky conveyor machines and rounded industrial equipment on the lower-left. Use bright cyan, orange, yellow and purple with clean cel-shaded lighting. Leave the upper-right simple and uncluttered for widgets. No people, text, logos or UI controls.',
  },
  {
    title: 'Cartoon Space Station',
    category: 'Playful',
    prompt:
      'Create a premium animated caricature-style space-station hero background for a 1024x600 embedded HMI. Show a charming rounded command console, exaggerated planet shapes and colourful stars on the lower-left. Use deep navy, cyan, violet, pink and warm yellow highlights. Leave the upper-right as clean dark space for widgets. No characters, text, logos or UI controls.',
  },
  {
    title: 'Comic Supercar',
    category: 'Playful',
    prompt:
      'Create a bold comic-book caricature hero background for a 1024x600 embedded HMI. Position an exaggerated futuristic supercar in the lower-left with dynamic reflections, chunky wheels and energetic cyan, red and yellow lighting. Leave the upper-right clean for widgets. High-end illustrated style, no drivers, text, logos, badges or UI elements.',
  },
]

export const ForgeAIPanel = ({
  onClose,
  insertAiLayout,
}: ForgeAIPanelProps) => {

  const { heroBackground, setHeroBackground } = useForgeTheme()

  const toast = useToast()
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

const [heroPromptSearch, setHeroPromptSearch] =
  useState('')

const filteredHeroPrompts =
  HERO_PROMPT_EXAMPLES.filter((example) => {
    const query = heroPromptSearch
      .trim()
      .toLowerCase()

    if (!query) {
      return true
    }

    return (
      example.title.toLowerCase().includes(query) ||
      example.category.toLowerCase().includes(query) ||
      example.prompt.toLowerCase().includes(query)
    )
  })

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

      const context = createForgeAIContext({
  userPrompt: aiPrompt,
})

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

const saveHeroAsset = async () => {
  if (!heroBackground) {
    return
  }

  try {
    setHeroError('')

    const response = await fetch(heroBackground)

    if (!response.ok) {
      throw new Error('Failed to prepare Hero image')
    }

    const blob = await response.blob()

    const extension =
      blob.type === 'image/jpeg' ? 'jpg' : 'png'

    const fileName =
      `ai_hero_${Date.now()}.${extension}`

    const file = new File(
      [blob],
      fileName,
      {
        type: blob.type || 'image/png',
      },
    )

    const asset = forgeUICreateUploadedAsset(
      file,
      heroBackground,
    )

    forgeUIAddUploadedAssets([asset])

    if (asset.exportStatus === 'pending_conversion') {
      const res = await fetch(
        'http://localhost:3030/convert-lvgl-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: asset.name,
            symbolName: asset.lvgl,
            base64: asset.browserSrc,
          }),
        },
      )

      const data = await res.json()

      if (!data.ok) {
        throw new Error(
          data.error || 'LVGL conversion failed',
        )
      }

      forgeUIUpdateUploadedAsset(asset.id, {
        exportStatus: 'lvgl_ready',
        lvgl: data.symbolName || asset.lvgl,
        cFile: data.assetSource || asset.cFile,
        browserSrc:
          data.browserSrc || asset.browserSrc,
      })
    }

    console.log(
  'AI Hero saved to assets:',
  asset,
)

toast({
  title: 'Hero background saved',
  description:
    'Open Theme Manager and select it to make it active.',
  status: 'success',
  duration: 4000,
  isClosable: true,
})
  } catch (err: any) {
    console.error(err)

    setHeroError(
      err.message || 'Failed to save Hero asset',
    )
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
      left="10px"
      top="48px"
      right="10px"
      bottom="10px"
      bg="#070b12"
      color="white"
      border="1px solid rgba(45, 212, 191, 0.55)"
      borderRadius="xl"
      zIndex={1400}
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
            
    <SimpleGrid
  columns={{ base: 1, xl: 3 }}
  spacing={5}
  alignItems="stretch"
>
  <Box
    gridColumn={{ base: 'auto', xl: 'span 2' }}
    border="1px solid rgba(124,58,237,0.36)"
    bg="rgba(15,23,42,0.72)"
    borderRadius="xl"
    p={6}
  >
    <Heading size="md" mb={2}>
      AI Hero Background
    </Heading>

    <Text color="gray.400" fontSize="sm" mb={4}>
      Describe the visual atmosphere, industry, lighting and style.
    </Text>

    <Textarea
      value={heroPrompt}
      onChange={(e) => setHeroPrompt(e.target.value)}
      placeholder="Create a luxury yacht dashboard background..."
      minH="280px"
      resize="vertical"
      mb={4}
      bg="#050914"
      color="white"
      borderColor="rgba(139, 92, 246, 0.52)"
      _hover={{
        borderColor: 'purple.400',
      }}
      _focus={{
        borderColor: 'purple.300',
        boxShadow: '0 0 0 1px #c4b5fd',
      }}
    />

    <HStack spacing={4}>
      <Button
        colorScheme="purple"
        onClick={generateHeroBackground}
        isLoading={isGeneratingHero}
        loadingText="Generating"
        isDisabled={!heroPrompt.trim()}
      >
        Generate Hero Background
      </Button>

      <Button
        colorScheme="green"
        onClick={saveHeroAsset}
        isDisabled={!heroBackground}
      >
        Save To Assets
      </Button>
    </HStack>

    {heroError && (
      <Text mt={4} color="red.300">
        {heroError}
      </Text>
    )}
  </Box>

  <Box
  border="1px solid rgba(34,211,238,0.28)"
  bg="rgba(8,15,26,0.76)"
  borderRadius="xl"
  p={5}
  maxH="780px"
  overflowY="auto"
>
    <Heading size="sm" mb={1}>
      Hero Gallery
    </Heading>

    <Text color="gray.500" fontSize="xs" mb={4}>
      Load an example, edit it, then generate.
    </Text>
<Input
  value={heroPromptSearch}
  onChange={(e) =>
    setHeroPromptSearch(e.target.value)
  }
  placeholder="Search factory, marine, purple..."
  size="sm"
  mb={4}
  bg="#050914"
  borderColor="rgba(34,211,238,0.3)"
  _focus={{
    borderColor: 'cyan.300',
    boxShadow: '0 0 0 1px #67e8f9',
  }}
/>

<HStack mb={4} justify="space-between">
  <Badge colorScheme="cyan">
    {filteredHeroPrompts.length} PROMPTS
  </Badge>

  <Button
    size="xs"
    variant="ghost"
    colorScheme="purple"
    onClick={() => {
      const randomPrompt =
        HERO_PROMPT_EXAMPLES[
          Math.floor(
            Math.random() *
              HERO_PROMPT_EXAMPLES.length,
          )
        ]

      setHeroPrompt(randomPrompt.prompt)
      setHeroError('')
    }}
  >
    Surprise Me
  </Button>
</HStack>
    <VStack spacing={3} align="stretch">
      {filteredHeroPrompts.map((example) => (
        <Box
          key={example.title}
          border="1px solid rgba(148,163,184,0.18)"
          bg="rgba(15,23,42,0.7)"
          borderRadius="lg"
          p={3}
          _hover={{
            borderColor: 'rgba(34,211,238,0.5)',
          }}
        >
          <Text
            color="cyan.100"
            fontSize="sm"
            fontWeight="semibold"
            mb={1}
          >
            {example.title}
          </Text>

<Badge
  colorScheme="purple"
  variant="subtle"
  mb={2}
>
  {example.category}
</Badge>

          <Text
            color="gray.500"
            fontSize="xs"
            noOfLines={2}
            mb={3}
          >
            {example.prompt}
          </Text>

          <Button
            size="xs"
            variant="outline"
            colorScheme="cyan"
            onClick={() => {
              setHeroPrompt(example.prompt)
              setHeroError('')
            }}
          >
            Load
          </Button>
        </Box>
      ))}
    </VStack>
  </Box>
</SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
}

export default ForgeAIPanel