import {
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import React, { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Flex,
  Heading,
  Input,
  Image,
  HStack,
  Select,
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

type ForgeUISavedAsset = {
  id: string
  name: string
  category: string
  style: string
  description: string
  width: number
  height: number
  layout: any[]
  createdAt: string
}

const FORGE_AI_ASSETS_STORAGE_KEY =
  'forgeui_ai_assets_v1'

export const ForgeAIPanel = ({
  onClose,
  insertAiLayout,
}: ForgeAIPanelProps) => {

  const { heroBackground, setHeroBackground } = useForgeTheme()

  const toast = useToast()
  const [layoutJson, setLayoutJson] = useState(DEFAULT_LAYOUT_JSON)
const [jsonError, setJsonError] = useState('')

const [aiPrompt, setAiPrompt] = useState('')

//
// Layout Prompt Helper
//

const [helperDashboardType, setHelperDashboardType] =
  useState('industrial dashboard')

const [helperHeading, setHelperHeading] =
  useState('Industrial Dashboard')

const [helperTheme, setHelperTheme] =
  useState('Modern industrial blue theme')

const [helperPanelCount, setHelperPanelCount] =
  useState('Three')

const [helperTrendChart, setHelperTrendChart] =
  useState(true)

const [helperAlerts, setHelperAlerts] =
  useState(true)

const [helperControls, setHelperControls] =
  useState(true)

const [helperTouchFriendly, setHelperTouchFriendly] =
  useState(true)

const [helperWifi, setHelperWifi] =
  useState(true)

const [helperBattery, setHelperBattery] =
  useState(true)

const [helperClock, setHelperClock] =
  useState(true)

const [isGenerating, setIsGenerating] =
  useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [resultName, setResultName] = useState('')
  const [resultDescription, setResultDescription] = useState('')
  const [heroPrompt, setHeroPrompt] = useState('')
  const [isGeneratingHero, setIsGeneratingHero] = useState(false)
  const [heroError, setHeroError] = useState('')
  const [heroPromptSearch, setHeroPromptSearch] =
  useState('')
  
  const [assetPrompt, setAssetPrompt] =
  useState('')

const [assetPreview, setAssetPreview] =
  useState<any>(null)

const [assetArtwork, setAssetArtwork] =
  useState('')

const [isGeneratingAsset, setIsGeneratingAsset] =
  useState(false)

const [isGeneratingArtwork, setIsGeneratingArtwork] =
  useState(false)

  const [savedArtworkAsset, setSavedArtworkAsset] =
  useState<any>(null)

const [assetCategory, setAssetCategory] =
  useState('industrial')

const [assetStyle, setAssetStyle] =
  useState('modern')

const [assetError, setAssetError] =
  useState('')

const [artworkError, setArtworkError] =
  useState('')

const [assetJson, setAssetJson] =
  useState('')

  const [savedAssets, setSavedAssets] =
  useState<ForgeUISavedAsset[]>([])

  useEffect(() => {
  try {
    const stored = localStorage.getItem(
      FORGE_AI_ASSETS_STORAGE_KEY,
    )

    if (!stored) {
      return
    }

    const parsed = JSON.parse(stored)

    if (Array.isArray(parsed)) {
      setSavedAssets(parsed)
    }
  } catch (err) {
    console.error(
      'Failed to load Forge AI assets:',
      err,
    )
  }
}, [])

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

const buildLayoutPrompt = () => {
  const requirements: string[] = [
    `- Large heading: ${helperHeading}`,
    `- ${helperPanelCount} production summary panels`,
  ]

  if (helperTrendChart) {
    requirements.push('- One live trend chart')
  }

  if (helperAlerts) {
    requirements.push('- One alerts panel')
  }

  if (helperControls) {
    requirements.push('- One controls panel')
  }

  requirements.push(`- ${helperTheme}`)

  if (helperTouchFriendly) {
    requirements.push('- Touch-friendly layout')
  }

  const icons: string[] = []

  if (helperWifi) {
    icons.push('- WiFi')
  }

  if (helperBattery) {
    icons.push('- Battery')
  }

  if (helperClock) {
    icons.push('- Clock')
  }

  const iconSection =
    icons.length > 0
      ? `Top-right status area:

Create ${icons.length} separate Icon components.

Required icons:
${icons.join('\n')}

Rules:
- Use the standard ForgeUI Icon component.
- Use one iconName for each Icon.
- Use the exact icon names supplied in RELEVANT VALID ICONS whenever available.
- If only a semantic name is known (wifi, battery, clock), ForgeUI will resolve it automatically.
- Do not use uploadedAssetId, src, assetName, lvgl or cFile.
- Do not invent WiFiWidget, BatteryWidget or ClockWidget.
- Do not group the icons.`
      : ''

  const prompt = `Create a modern ${helperDashboardType} for a 1024x600 ESP32-P4 display.

Requirements:

${requirements.join('\n')}

${iconSection}

Return valid ForgeUI JSON only.`

  setAiPrompt(prompt)
}

const buildAssetGenerationPrompt = () => {
  return `Create one reusable ForgeUI asset.

Asset category:
${assetCategory}

Visual style:
${assetStyle}

User brief:
${assetPrompt}

Rules:

- Return ONE reusable ForgeUI asset.
- Do NOT create a complete 1024x600 dashboard.
- Do NOT create an application or screen.
- Generate a reusable widget only.

Use ONLY these ForgeUI components:

Box
Text
Heading
Button
Image
Icon
Led
Bar
Arc
Scale
CircularProgress
Progress
Chart

Never use:

Divider
Tabs
Collapse
Flex
VStack
HStack
SimpleGrid
Grid
Stack

Widget layout rules:

Widget design workflow:

1. Decide the widget width and height before placing components.
2. Divide the widget into logical regions such as header, primary metrics, secondary metrics and status.
3. Reserve enough space for every component before assigning coordinates.
4. Use a clear row-and-column structure.
5. Check all component bounds for collisions.
6. Correct every overlap before returning the JSON.

Widget layout rules:

- Use absolute positioning.
- Keep all coordinates relative to the asset origin.
- Start x and y near 0.
- Leave 12 to 16 pixels of padding around all widget edges.
- Leave at least 10 pixels of vertical spacing between rows.
- Leave at least 12 pixels of horizontal spacing between columns.
- Components must never overlap.
- Text must never overlap bars, icons, charts, borders or other text.
- Keep labels clearly separated from their values.
- Place labels and values on the same row only when enough horizontal space exists.
- Use a two-column layout when several metrics must fit in one widget.
- Reserve the full bounds of CircularProgress, Arc, Scale and Chart components.
- Do not place text inside or across a CircularProgress, Arc, Scale or Chart unless explicitly requested.
- Place status LEDs directly beside their associated status text.
- Do not use LEDs as decorative background elements.
- Progress bars must have their own row and must not sit behind text.
- Use consistent alignment, margins and spacing.
- Keep all components fully inside the declared width and height.
- Width and height must match the actual widget bounds.
- Choose an appropriate compact widget size.
- Do not exceed 420x280 unless the user explicitly asks for a larger asset.
- Reduce the number of components if the requested content cannot fit cleanly.
- Prefer simple, readable layouts over dense layouts.
- Use compact headings suitable for a reusable HMI widget.
- Produce a polished commercial-quality industrial HMI widget.
- Before returning JSON, verify every component bounding box and correct all intersections.

Return JSON with:

name
category
style
description
width
height
layout

Return valid JSON only.

Do not include markdown or explanations.`
}

const generateAsset = async () => {
  try {
    setAssetError('')
    setIsGeneratingAsset(true)
    setAssetPreview(null)

    const prompt =
      buildAssetGenerationPrompt()

    const context = createForgeAIContext({
      userPrompt: prompt,
    })

    const document = await generateForgeAILayout({
      prompt,
      ...context,
    })

    setAssetJson(
      JSON.stringify(document, null, 2),
    )

    setAssetArtwork('')
    setAssetPreview(document)
  } catch (err: any) {
    console.error(err)

    setAssetError(
      err.message ||
        'AI asset generation failed',
    )
  } finally {
    setIsGeneratingAsset(false)
  }
}

const generateAssetArtwork = async () => {
  try {
    setArtworkError('')
    setIsGeneratingArtwork(true)
    setAssetArtwork('')

    const artworkPrompt = `
Create one reusable embedded HMI artwork asset.

Category:
${assetCategory}

Visual style:
${assetStyle}

User brief:
${assetPrompt}

Requirements:

- Create a single isolated visual asset.
- Do not create a complete dashboard or screen.
- Do not include buttons, labels, values or interface text.
- Do not include logos or branding.
- Keep the composition clean and suitable for an embedded HMI.
- Use a dark or transparent-looking background where appropriate.
- Keep the important subject centred with safe edge padding.
- Produce polished commercial-quality artwork.
`

    const response = await fetch(
      '/api/forgeui-ai-hero',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          prompt: artworkPrompt,
        }),
      },
    )

    const payload = await response.json()

    if (!payload.ok) {
      throw new Error(
        payload.error ||
          'AI artwork generation failed',
      )
    }

    setAssetPreview(null)
    setAssetArtwork(payload.image)
  } catch (err: any) {
    console.error(err)

    setArtworkError(
      err.message ||
        'AI artwork generation failed',
    )
  } finally {
    setIsGeneratingArtwork(false)
  }
}

const saveAssetArtwork = async () => {
  if (!assetArtwork) {
    return
  }

  try {
    setArtworkError('')

    const response =
      await fetch(assetArtwork)

    if (!response.ok) {
      throw new Error(
        'Failed to prepare AI artwork',
      )
    }

    const blob = await response.blob()

    const extension =
      blob.type === 'image/jpeg'
        ? 'jpg'
        : 'png'

    const safeCategory =
      assetCategory
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')

    const fileName =
      `ai_${safeCategory}_artwork_${Date.now()}.${extension}`

    const file = new File(
      [blob],
      fileName,
      {
        type:
          blob.type || 'image/png',
      },
    )

    const asset =
      forgeUICreateUploadedAsset(
        file,
        assetArtwork,
      )

    forgeUIAddUploadedAssets([
      asset,
    ])

    setSavedArtworkAsset(asset)

    if (
      asset.exportStatus ===
      'pending_conversion'
    ) {
      const conversionResponse =
        await fetch(
          'http://localhost:3030/convert-lvgl-image',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              fileName: asset.name,
              symbolName: asset.lvgl,
              base64:
                asset.browserSrc,
              assetMode: 'image',
            }),
          },
        )

      const data =
  await conversionResponse.json()

if (
  !data.ok ||
  !data.symbolName ||
  !data.assetSource
) {
  throw new Error(
    data.error ||
      'LVGL conversion failed',
  )
}

      forgeUIUpdateUploadedAsset(
  asset.id,
  {
    exportStatus:
      'lvgl_ready',

    lvgl:
      data.symbolName ||
      asset.lvgl,

    cFile:
      data.assetSource ||
      asset.cFile,

    browserSrc:
      data.browserSrc ||
      asset.browserSrc,
  },
)

setSavedArtworkAsset({
  ...asset,

  exportStatus:
    'lvgl_ready',

  lvgl:
    data.symbolName ||
    asset.lvgl,

  cFile:
    data.assetSource ||
    asset.cFile,

  browserSrc:
    data.browserSrc ||
    asset.browserSrc,
})
    }

    toast({
      title: 'AI artwork saved',
      description:
        'Artwork saved to Artwork Library and prepared for LVGL.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    })
  } catch (err: any) {
    console.error(err)

    setArtworkError(
      err.message ||
        'Failed to save AI artwork',
    )
  }
}



const saveGeneratedAsset = () => {
  if (
    !assetPreview ||
    !Array.isArray(assetPreview.layout) ||
    assetPreview.layout.length === 0
  ) {
    return
  }

  try {
    setAssetError('')

    validateAiLayout(assetPreview.layout)

    const savedAsset: ForgeUISavedAsset = {
      id:
        globalThis.crypto?.randomUUID?.() ||
        `forge_asset_${Date.now()}`,

      name:
        assetPreview.name ||
        'AI Generated Asset',

      category:
        assetPreview.category ||
        assetCategory,

      style:
        assetPreview.style ||
        assetStyle,

      description:
        assetPreview.description ||
        'AI-generated reusable ForgeUI asset.',

      width:
        Number(assetPreview.width) || 320,

      height:
        Number(assetPreview.height) || 220,

      layout: assetPreview.layout.map(
        (item: any) => ({
          ...item,
          props: {
            ...item.props,
          },
        }),
      ),

      createdAt: new Date().toISOString(),
    }

    const nextAssets = [
      savedAsset,
      ...savedAssets,
    ]

    setSavedAssets(nextAssets)

    localStorage.setItem(
      FORGE_AI_ASSETS_STORAGE_KEY,
      JSON.stringify(nextAssets),
    )

    toast({
      title: 'Forge asset saved',
      description:
        `${savedAsset.name} added to My Forge Assets.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  } catch (err: any) {
    console.error(err)

    setAssetError(
      err.message ||
        'Failed to save AI asset',
    )
  }
}



const deleteSavedAsset = (
  savedAsset: ForgeUISavedAsset,
) => {
  const nextAssets = savedAssets.filter(
    asset => asset.id !== savedAsset.id,
  )

  setSavedAssets(nextAssets)

  localStorage.setItem(
    FORGE_AI_ASSETS_STORAGE_KEY,
    JSON.stringify(nextAssets),
  )

  toast({
    title: 'Forge asset deleted',
    description:
      `${savedAsset.name} removed from My Forge Assets.`,
    status: 'success',
    duration: 3000,
    isClosable: true,
  })
}

const insertSavedAsset = (
  savedAsset: ForgeUISavedAsset,
) => {
  try {
    setAssetError('')

    validateAiLayout(savedAsset.layout)

    const originX = 120
    const originY = 120

    const minX = Math.min(
      ...savedAsset.layout.map(
        (item: any) =>
          Number(item.props?.x || 0),
      ),
    )

    const minY = Math.min(
      ...savedAsset.layout.map(
        (item: any) =>
          Number(item.props?.y || 0),
      ),
    )

    const items = savedAsset.layout.map(
      (item: any) => ({
        ...item,
        props: {
          ...item.props,
          positionMode: 'absolute',
          x:
            originX +
            Number(item.props?.x || 0) -
            minX,
          y:
            originY +
            Number(item.props?.y || 0) -
            minY,
        },
      }),
    )

    insertAiLayout(items)

    toast({
      title: 'Asset inserted',
      description:
        `${savedAsset.name} added to the canvas.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  } catch (err: any) {
    console.error(err)

    setAssetError(
      err.message ||
        'Failed to insert saved asset',
    )
  }
}

const insertGeneratedAsset = () => {
  if (
    !assetPreview ||
    !Array.isArray(assetPreview.layout)
  ) {
    return
  }

  try {
    setAssetError('')

    validateAiLayout(assetPreview.layout)

    const originX = 120
    const originY = 120

    const minX = Math.min(
      ...assetPreview.layout.map(
        (item: any) =>
          Number(item.props?.x || 0),
      ),
    )

    const minY = Math.min(
      ...assetPreview.layout.map(
        (item: any) =>
          Number(item.props?.y || 0),
      ),
    )

    const items = assetPreview.layout.map(
      (item: any) => ({
        ...item,
        props: {
          ...item.props,
          positionMode: 'absolute',
          x:
            originX +
            Number(item.props?.x || 0) -
            minX,
          y:
            originY +
            Number(item.props?.y || 0) -
            minY,
        },
      }),
    )

    insertAiLayout(items)

    toast({
      title: 'Asset inserted',
      description:
        `${assetPreview.name || 'AI asset'} added to the canvas.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  } catch (err: any) {
    console.error(err)

    setAssetError(
      err.message ||
        'Failed to insert AI asset',
    )
  }
}

const insertArtwork = () => {
  if (!savedArtworkAsset) {
    return
  }

  insertAiLayout([
    {
      type: 'Image',
      props: {
        positionMode: 'absolute',

        x: 120,
        y: 120,

        w: 320,
        h: 220,

        uploadedAssetId:
          savedArtworkAsset.id,

        src:
          savedArtworkAsset.browserSrc,

        alt:
          savedArtworkAsset.name,

        objectFit: 'contain',

        imageScale: 256,
      },
    },
  ])

  toast({
    title: 'Artwork inserted',
    description:
      `${savedArtworkAsset.name} added to the canvas.`,
    status: 'success',
    duration: 3000,
    isClosable: true,
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

  if (
    !data.ok ||
    !data.symbolName ||
    !data.assetSource
  ) {
    throw new Error(
      data.error ||
        'LVGL conversion failed',
    )
  }

  forgeUIUpdateUploadedAsset(
    asset.id,
    {
      exportStatus: 'lvgl_ready',
      lvgl: data.symbolName,
      cFile: data.assetSource,
      browserSrc:
        data.browserSrc ||
        asset.browserSrc,
    },
  )
}

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
            <Tab>Assets</Tab>
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
  _hover={{
    borderColor: 'purple.400',
  }}
  _focus={{
    borderColor: 'purple.300',
    boxShadow: '0 0 0 1px #c4b5fd',
  }}
  fontSize="sm"
/>

<Box
  mt={4}
  p={4}
  border="1px solid rgba(34,211,238,0.28)"
  borderRadius="lg"
  bg="rgba(8,15,26,0.76)"
>
  <HStack
    justify="space-between"
    mb={3}
  >
    <Heading size="xs">
      Layout Prompt Helper
    </Heading>

    <Badge colorScheme="cyan">
      V1
    </Badge>
  </HStack>

  <SimpleGrid
    columns={2}
    spacing={3}
    mb={4}
  >
    <Box>
      <Text
        fontSize="xs"
        color="gray.400"
        mb={1}
      >
        Dashboard
      </Text>

      <Select
        size="sm"
        value={helperDashboardType}
        onChange={(e) =>
          setHelperDashboardType(
            e.target.value,
          )
        }
      >
        <option value="industrial dashboard">
          Industrial Dashboard
        </option>

        <option value="machine health dashboard">
          Machine Health
        </option>

        <option value="energy dashboard">
          Energy
        </option>

        <option value="marine dashboard">
          Marine
        </option>

        <option value="diagnostics dashboard">
          Diagnostics
        </option>
      </Select>
    </Box>

    <Box>
      <Text
        fontSize="xs"
        color="gray.400"
        mb={1}
      >
        Heading
      </Text>

      <Input
        size="sm"
        value={helperHeading}
        onChange={(e) =>
          setHelperHeading(
            e.target.value,
          )
        }
      />
    </Box>
  </SimpleGrid>

  <Text
    fontSize="xs"
    color="gray.400"
    mb={2}
  >
    Dashboard Sections
  </Text>

  <SimpleGrid
    columns={2}
    spacing={2}
    mb={4}
  >
    <Checkbox
      isChecked={helperTrendChart}
      onChange={(e) =>
        setHelperTrendChart(
          e.target.checked,
        )
      }
    >
      Trend Chart
    </Checkbox>

    <Checkbox
      isChecked={helperAlerts}
      onChange={(e) =>
        setHelperAlerts(
          e.target.checked,
        )
      }
    >
      Alerts
    </Checkbox>

    <Checkbox
      isChecked={helperControls}
      onChange={(e) =>
        setHelperControls(
          e.target.checked,
        )
      }
    >
      Controls
    </Checkbox>

    <Checkbox
      isChecked={helperTouchFriendly}
      onChange={(e) =>
        setHelperTouchFriendly(
          e.target.checked,
        )
      }
    >
      Touch Friendly
    </Checkbox>
  </SimpleGrid>

  <Text
    fontSize="xs"
    color="gray.400"
    mb={2}
  >
    Status Icons
  </Text>

  <HStack
    spacing={6}
    mb={4}
  >
    <Checkbox
      isChecked={helperWifi}
      onChange={(e) =>
        setHelperWifi(
          e.target.checked,
        )
      }
    >
      WiFi
    </Checkbox>

    <Checkbox
      isChecked={helperBattery}
      onChange={(e) =>
        setHelperBattery(
          e.target.checked,
        )
      }
    >
      Battery
    </Checkbox>

    <Checkbox
      isChecked={helperClock}
      onChange={(e) =>
        setHelperClock(
          e.target.checked,
        )
      }
    >
      Clock
    </Checkbox>
  </HStack>

  <Button
    width="100%"
    colorScheme="cyan"
    onClick={buildLayoutPrompt}
  >
    Build Prompt
  </Button>
</Box>

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
    <Text
      color="gray.500"
      fontSize="sm"
    >
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
    maxH="700px"
    resize="vertical"
    overflowY="auto"
    bg="#050914"
    color="cyan.100"
    borderColor="gray.700"
    fontFamily="monospace"
    fontSize="sm"
    sx={{
      '&::-webkit-resizer': {
        borderWidth: '0 0 12px 12px',
        borderStyle: 'solid',
        borderColor:
          'transparent transparent #67e8f9 transparent',
      },
    }}
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
            <TabPanel px={0} pt={5}>
  <SimpleGrid
    columns={{ base: 1, xl: 2 }}
    spacing={5}
    alignItems="start"
  >
    <VStack spacing={5} align="stretch">
      <Box
        border="1px solid rgba(124, 58, 237, 0.4)"
        bg="rgba(15, 23, 42, 0.72)"
        borderRadius="xl"
        p={5}
      >
        <HStack justify="space-between" mb={1}>
          <Heading size="sm">
            AI Asset Designer
          </Heading>

          <Badge colorScheme="purple">
            AI
          </Badge>
        </HStack>

        <Text
          color="gray.400"
          fontSize="sm"
          mb={4}
          >
            Design reusable ForgeUI widgets and industrial components using AI.
          </Text>

        <Textarea
  value={assetPrompt}
  onChange={(e) =>
    setAssetPrompt(e.target.value)
  }
  placeholder="Create a compact industrial battery status card with SOC, voltage, current, temperature and warning state..."
  minH="180px"
  resize="vertical"
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

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={3}
          mt={4}
        >
          <Box>
           <Text
  fontSize="xs"
  color="gray.400"
  mb={1}
>
  Design Category
</Text>

<Select
  size="sm"
  value={assetCategory}
  onChange={(e) =>
    setAssetCategory(e.target.value)
  }
  bg="#050914"
>
  <option value="industrial">
    Industrial
  </option>

  <option value="energy">
    Energy
  </option>

  <option value="automotive">
    Automotive
  </option>

  <option value="marine">
    Marine
  </option>

  <option value="medical">
    Medical
  </option>

  <option value="general">
    General UI
  </option>
</Select>
            
          </Box>

          <Box>
           <Text
  fontSize="xs"
  color="gray.400"
  mb={1}
>
  Asset Style
</Text>

<Select
  size="sm"
  value={assetStyle}
  onChange={(e) =>
    setAssetStyle(e.target.value)
  }
  bg="#050914"
>
  <option value="modern">
    Modern
  </option>

  <option value="industrial">
    Industrial
  </option>

  <option value="glass">
    Glass
  </option>

  <option value="minimal">
    Minimal
  </option>

  <option value="cyber">
    Cyber
  </option>
</Select>
          </Box>
        </SimpleGrid>

      <SimpleGrid
  columns={{ base: 1, md: 2 }}
  spacing={3}
  mt={4}
>
  <HStack spacing={3}>
    <Button
      flex={1}
      colorScheme="purple"
      isLoading={isGeneratingAsset}
      loadingText="Designing..."
      isDisabled={!assetPrompt.trim()}
      onClick={generateAsset}
    >
      Design Widget
    </Button>

    <Button
      flex={1}
      colorScheme="cyan"
      isLoading={isGeneratingArtwork}
      loadingText="Creating..."
      isDisabled={!assetPrompt.trim()}
      onClick={generateAssetArtwork}
    >
      ✨ Create AI Artwork
    </Button>
  </HStack>
</SimpleGrid>
       </Box>

      <Box
        border="1px solid rgba(34, 211, 238, 0.28)"
        bg="rgba(8, 15, 26, 0.76)"
        borderRadius="xl"
        p={5}
      >
        <Flex
          justify="space-between"
          align="center"
          mb={4}
        >
          <Box>
            <Heading size="sm">
              My Forge Assets
            </Heading>

            <Text
              color="gray.500"
              fontSize="xs"
              mt={1}
            >
              Saved reusable assets will appear here.
            </Text>
          </Box>

          <Badge colorScheme="cyan">
  {savedAssets.length} SAVED
</Badge>
        </Flex>

        {savedAssets.length === 0 ? (
  <Flex
    minH="150px"
    align="center"
    justify="center"
    border="1px dashed rgba(148, 163, 184, 0.25)"
    borderRadius="lg"
    px={4}
    textAlign="center"
  >
    <Text
      color="gray.500"
      fontSize="sm"
    >
      No Forge assets created yet.
    </Text>
  </Flex>
) : (
  <VStack spacing={3} align="stretch">
    {savedAssets.map((savedAsset) => (
      <Box
        key={savedAsset.id}
        border="1px solid rgba(148, 163, 184, 0.18)"
        borderRadius="lg"
        bg="rgba(15, 23, 42, 0.7)"
        p={3}
      >
        <Flex justify="space-between" align="center">
          <Box>
            <Text
  fontWeight="bold"
  color="cyan.100"
  noOfLines={1}
>
  {savedAsset.name}
</Text>

<Text
  color="gray.500"
  fontSize="xs"
  noOfLines={2}
>
  {savedAsset.description}
</Text>
          </Box>

<HStack spacing={2}>
  <Button
    size="sm"
    colorScheme="cyan"
    onClick={() =>
      insertSavedAsset(savedAsset)
    }
  >
    Use
  </Button>

  <Button
    size="sm"
    variant="outline"
    colorScheme="red"
    onClick={() =>
      deleteSavedAsset(savedAsset)
    }
  >
    Delete
  </Button>
</HStack>

</Flex>
</Box>
    ))}
  </VStack>
)}
      </Box>
    </VStack>

    <VStack spacing={5} align="stretch">
      <Box
        border="1px solid rgba(45, 212, 191, 0.32)"
        bg="rgba(8, 18, 24, 0.82)"
        borderRadius="xl"
        p={5}
        minH="420px"
      >
        <Flex
          justify="space-between"
          align="flex-start"
          mb={4}
        >
          <Box>
  <Heading size="sm">
    Artwork Preview
  </Heading>

  <Text
    color="gray.500"
    fontSize="xs"
    mt={1}
  >
    Design an industrial asset using the
    Asset Brief. Review it here before
    saving it to your Forge Asset Library.
  </Text>
</Box>
<Badge
  colorScheme={
    artworkError || assetError
      ? 'red'
      : assetArtwork || assetPreview
        ? 'green'
        : 'gray'
  }
>
  {artworkError || assetError
    ? 'ERROR'
    : assetArtwork || assetPreview
      ? 'READY'
      : 'WAITING'}
</Badge>
        </Flex>

        <Box
  minH="260px"
  border="1px dashed rgba(148, 163, 184, 0.25)"
  borderRadius="lg"
  bg="#050914"
  p={4}
>
  {artworkError ? (
  <Flex
    minH="228px"
    align="center"
    justify="center"
    textAlign="center"
  >
    <Text
      color="red.300"
      fontSize="sm"
    >
      {artworkError}
    </Text>
  </Flex>
) : assetArtwork ? (
  <VStack
    minH="228px"
    align="stretch"
    justify="center"
    spacing={3}
  >
    <Image
      src={assetArtwork}
      alt="AI generated artwork"
      maxH="190px"
      width="100%"
      objectFit="contain"
      borderRadius="md"
    />

    <HStack spacing={2}>
      <Badge colorScheme="purple">
        {assetCategory}
      </Badge>

      <Badge colorScheme="cyan">
        {assetStyle}
      </Badge>

      <Badge colorScheme="green">
        ARTWORK READY
      </Badge>
    </HStack>
  </VStack>
) : assetError ? (
  <Flex
    minH="228px"
    align="center"
    justify="center"
    textAlign="center"
  >
    <Text
      color="red.300"
      fontSize="sm"
    >
      {assetError}
    </Text>
  </Flex>
) : assetPreview ? (
  <VStack
    minH="228px"
    align="stretch"
    justify="center"
    spacing={3}
  >
    <Text
      color="green.200"
      fontWeight="bold"
      fontSize="lg"
    >
      {assetPreview.name ||
        'AI Generated Asset'}
    </Text>

    <Text
      color="gray.400"
      fontSize="sm"
    >
      {assetPreview.description ||
        'ForgeUI asset document generated.'}
    </Text>

    <HStack spacing={2}>
      <Badge colorScheme="purple">
        {assetPreview.category ||
          assetCategory}
      </Badge>

      <Badge colorScheme="cyan">
        {assetPreview.style ||
          assetStyle}
      </Badge>

      <Badge colorScheme="green">
        {Array.isArray(
          assetPreview.layout,
        )
          ? `${assetPreview.layout.length} COMPONENTS`
          : 'DOCUMENT READY'}
      </Badge>
    </HStack>
  </VStack>
) : (
  <Flex
    minH="228px"
    align="center"
    justify="center"
    textAlign="center"
  >
    <Text
      color="gray.500"
      fontSize="sm"
    >
      Design a widget or create AI artwork
      to preview it here.
    </Text>
  </Flex>
)}
</Box>

<HStack mt={4} spacing={3}>
  {assetArtwork ? (
    <>
      <Button
        flex={1}
        colorScheme="green"
        onClick={saveAssetArtwork}
      >
        Save To Artwork Library
      </Button>

      <Button
  flex={1}
  variant="outline"
  colorScheme="cyan"
  onClick={insertArtwork}
  isDisabled={!savedArtworkAsset}
>
  Insert Artwork
</Button>
    </>
  ) : (
    <>
      <Button
        flex={1}
        colorScheme="teal"
        onClick={saveGeneratedAsset}
        isDisabled={
          !assetPreview ||
          !Array.isArray(assetPreview.layout) ||
          assetPreview.layout.length === 0
        }
      >
        Save Widget
      </Button>

      <Button
        flex={1}
        variant="outline"
        colorScheme="cyan"
        onClick={insertGeneratedAsset}
        isDisabled={
          !assetPreview ||
          !Array.isArray(assetPreview.layout) ||
          assetPreview.layout.length === 0
        }
      >
        Insert Widget
      </Button>
    </>
  )}
</HStack>

        <Divider
          my={4}
          borderColor="rgba(148, 163, 184, 0.16)"
        />

        <Button
          size="sm"
          variant="ghost"
          colorScheme="cyan"
          isDisabled
        >
          Show Advanced JSON
        </Button>
      </Box>

      <Box
        border="1px solid rgba(148, 163, 184, 0.16)"
        borderRadius="xl"
        p={4}
        bg="rgba(15, 23, 42, 0.42)"
      >
        <Text
          color="gray.300"
          fontWeight="semibold"
          fontSize="sm"
        >
          Asset Creator
        </Text>

        <Text
          color="gray.500"
          fontSize="xs"
          mt={1}
        >
          This workspace will create reusable structured
          ForgeUI assets using supported components.
        </Text>
      </Box>
    </VStack>
  </SimpleGrid>
</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
}

export default ForgeAIPanel