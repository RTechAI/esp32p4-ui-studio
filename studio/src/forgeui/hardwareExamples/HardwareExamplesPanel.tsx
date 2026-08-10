import React, { useState } from 'react'
import {
  Box, Button, Code, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Text,
} from '@chakra-ui/react'
import useDispatch from '~hooks/useDispatch'
import { HARDWARE_EXAMPLE_01 } from './HardwareExample01'
import { HARDWARE_EXAMPLE_02 } from './HardwareExample02'
import { HARDWARE_EXAMPLE_03 } from './HardwareExample03'
import { HARDWARE_EXAMPLE_04 } from './HardwareExample04'
import { HARDWARE_EXAMPLE_05 } from './HardwareExample05'
import { resolveForgeUIIconProject } from '../icons/ForgeUIIconResolver'

export const loadHardwareExample04Project = async () =>
  resolveForgeUIIconProject(HARDWARE_EXAMPLE_04.project)

type GuideNumber = 1 | 2 | 3 | 4 | 5

const guideTitles: Record<GuideNumber, string> = {
  1: 'Example 01 — GPIO Digital I/O',
  2: 'Example 02 — I²C FRAM Persistence',
  3: 'Example 03 — SPI NFC/RFID',
  4: 'Example 04 — Online Services — Live Weather',
  5: 'Example 05 — GPS / GNSS',
}

const GuideSection = ({ title, children }: {
  title: string
  children: React.ReactNode
}) => <Box mb={3}><Text fontWeight="bold">{title}</Text><Text fontSize="sm">{children}</Text></Box>

const ExampleGuide = ({ example }: { example: GuideNumber }) => {
  if (example === 1) return <>
    <GuideSection title="What it demonstrates">Bidirectional digital I/O using GPIO pins on the ESP32-P4 hardware target.</GuideSection>
    <GuideSection title="GPIO pins used">Inputs: GPIO2 and GPIO4. Outputs: GPIO3 and GPIO5.</GuideSection>
    <GuideSection title="Wiring summary">
      <Code display="block" whiteSpace="pre-wrap" p={2}>{`GPIO2 → Button 1 → GND
GPIO4 → Button 2 → GND
GPIO3 → 330R → LED 1 anode; cathode → GND
GPIO5 → 330R → LED 2 anode; cathode → GND`}</Code>
    </GuideSection>
    <GuideSection title="Physical proof status">PHYSICALLY PROVEN with independent button inputs, LED outputs and debouncing.</GuideSection>
    <GuideSection title="How to load and test">Load the example, Build & Flash, then use the buttons and UI toggles. Enable the LED test module’s local slider/interlock before judging output.</GuideSection>
  </>

  if (example === 2) return <>
    <GuideSection title="What it demonstrates">I²C communication with external FRAM and persistent read/write storage across power cycles.</GuideSection>
    <GuideSection title="Device / address">MB85RC256V at I²C address 0x50 on the BSP-owned bus: GPIO7 SDA and GPIO8 SCL.</GuideSection>
    <GuideSection title="Wiring summary">Connect SDA to GPIO7, SCL to GPIO8, plus 3V3 and GND. The example attaches to the existing shared I²C bus.</GuideSection>
    <GuideSection title="Persistence behavior">WRITE TEST stores the proof record; READ TEST verifies it. Counter 9 and value 0xA553 survived a complete power cycle.</GuideSection>
    <GuideSection title="Physical proof status">PHYSICALLY PROVEN, including device identity, read/write verification and power-cycle persistence.</GuideSection>
    <GuideSection title="How to load and test">Load and flash the example, press WRITE TEST, then READ TEST. Power-cycle and read again to confirm persistence.</GuideSection>
  </>

  if (example === 3) return <>
    <GuideSection title="What it demonstrates">SPI communication with a PN532 NFC/RFID reader, card detection, UID reading, removal and de-duplication.</GuideSection>
    <GuideSection title="PN532 interface">Proven software SPI: MOSI GPIO28, MISO GPIO29, SCK GPIO30, CS GPIO31 and Reset GPIO2. IRQ is unused.</GuideSection>
    <GuideSection title="Wiring summary">Set the PN532 for SPI, connect the five signals above, 3V3 and GND.</GuideSection>
    <GuideSection title="Card / UID behavior">Shows PRESENT/NONE, an uppercase colon-separated UID, removal, re-presentation and one logical count per presentation.</GuideSection>
    <GuideSection title="Physical proof status">PHYSICALLY PROVEN with PN532 identity, SAMConfig, ISO14443A polling and stable UID reads.</GuideSection>
    <GuideSection title="How to load and test">Load and flash the example, present a compatible tag, remove it, then present it again and watch the logical count.</GuideSection>
  </>

  if (example === 4) return <>
    <GuideSection title="What it demonstrates">ForgeUI Online Services using live Open-Meteo data over certificate-verified HTTPS on ESP32-P4.</GuideSection>
    <GuideSection title="Live service">Shows current conditions, forecast days and high/low values using ESP-Hosted Wi-Fi, verified TLS and network-derived local date/time.</GuideSection>
    <GuideSection title="Weather presentation">Returned weather data selects local ForgeUI backgrounds and Weather icons. Background images are not downloaded from Open-Meteo.</GuideSection>
    <GuideSection title="Reusable assets">The reusable Weather Background Pack contains 17 Studio assets; this example includes only its 10 runtime dependencies.</GuideSection>
    <GuideSection title="Configuration">The example is configured for Tauranga. This is an example configuration, not automatic location detection, and can be changed later.</GuideSection>
    <GuideSection title="Physical proof status">PHYSICALLY PROVEN on the stock Waveshare ESP32-P4-WIFI6-Touch-LCD-7B and stock C6.</GuideSection>
    <GuideSection title="How to load and test">Load the example, configure Wi-Fi normally, then use Build & Flash and confirm live current, forecast, time, icon and background updates.</GuideSection>
  </>

  return <>
    <GuideSection title="Hardware">Waveshare ESP32-P4-WIFI6-Touch-LCD-7B with a u-blox NEO-8 GPS/GNSS module. NEO VCC → UART connector VCC / Core_5V and NEO GND → UART connector GND; GPS data uses the bottom GPIO header.</GuideSection>
    <GuideSection title="UART mapping">NEO TX → IO3 / GPIO3 → P4 UART1 RX. NEO RX ← IO4 / GPIO4 ← P4 UART1 TX. Both data pins use 3.3 V UART logic at 9600 baud, 8N1. Do not use GPIO38/RXD for GPS receive: GPIO38 shares the unisolated CH343P USB-UART TX net, and GPIO37 shares the unisolated CH343P USB-UART RX net.</GuideSection>
    <GuideSection title="TX proof">After checksum-valid NMEA is alive, firmware sends one read-only UBX-MON-VER poll. It requests bounded receiver version information and does not alter or save GPS configuration.</GuideSection>
    <GuideSection title="What proves the link">UART RX, checksum-valid NMEA and the UI can be proven indoors even without a fix. Physical certification observed a real fix, 12 satellites, live parsed state, and a checksum-valid MON-VER response to the GPIO4 poll.</GuideSection>
    <GuideSection title="Physical proof status">PHYSICALLY PROVEN on the Waveshare 7B: full-duplex UART1, NMEA, live GPS fix/state/UI, and read-only UBX-MON-VER request/response.</GuideSection>
    <GuideSection title="How to load and test">Load the example, use the normal standalone export and Build & Flash workflow, then confirm UART RX alive, NMEA alive, live UI state and MON-VER response valid. Flash manually; this guide does not initiate flashing.</GuideSection>
  </>
}

export const HardwareExamplesPanel = () => {
  const dispatch = useDispatch()
  const [guide, setGuide] = useState<GuideNumber | null>(null)
  const examples = [HARDWARE_EXAMPLE_01, HARDWARE_EXAMPLE_02,
    HARDWARE_EXAMPLE_03, HARDWARE_EXAMPLE_04, HARDWARE_EXAMPLE_05] as const

  const load = async (number: GuideNumber) => {
    if (number === 4) {
      dispatch.components.reset(await loadHardwareExample04Project())
      return
    }
    dispatch.components.reset(examples[number - 1].project)
  }

  return (
    <Box borderBottom="1px solid" borderColor="whiteAlpha.200" pb={3} mb={2}
      data-testid="hardware-examples-panel">
      <Text color="cyan.200" fontWeight="bold" fontSize="sm" mb={2}>
        Hardware Examples
      </Text>
      {examples.map((example, index) => {
        const number = (index + 1) as GuideNumber
        return <Box key={example.id} bg="whiteAlpha.100" borderRadius="md" p={2}
          mt={index === 0 ? 0 : 2} data-testid={`hardware-example-card-${number}`}>
          <Text color="gray.100" fontSize="xs" fontWeight="semibold">Example {String(number).padStart(2, '0')}</Text>
          <Text color="white" fontSize="sm" mb={2}>{example.name}</Text>
          <Text color="green.200" fontSize="xs" fontWeight="bold" mb={2}>{example.status}</Text>
          <Box display="flex" gap={2}>
            <Button size="xs" colorScheme="cyan" flex="1" onClick={() => load(number)}>Load Example</Button>
            <Button size="xs" variant="outline" colorScheme="cyan" flex="1" onClick={() => setGuide(number)}>Guide</Button>
          </Box>
        </Box>
      })}
      <Modal isOpen={guide !== null} onClose={() => setGuide(null)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{guide ? guideTitles[guide] : ''}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{guide && <ExampleGuide example={guide} />}</ModalBody>
          <ModalFooter><Button onClick={() => setGuide(null)}>Close</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
