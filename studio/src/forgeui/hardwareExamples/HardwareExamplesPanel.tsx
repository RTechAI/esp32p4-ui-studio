import React from 'react'
import {
  Box, Button, Code, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure,
} from '@chakra-ui/react'
import useDispatch from '~hooks/useDispatch'
import { HARDWARE_EXAMPLE_01 } from './HardwareExample01'

export const HardwareExamplesPanel = () => {
  const dispatch = useDispatch()
  const wiring = useDisclosure()
  return (
    <Box borderBottom="1px solid" borderColor="whiteAlpha.200" pb={3} mb={2}
      data-testid="hardware-examples-panel">
      <Text color="cyan.200" fontWeight="bold" fontSize="sm" mb={2}>
        Hardware Examples
      </Text>
      <Box bg="whiteAlpha.100" borderRadius="md" p={2}>
        <Text color="gray.100" fontSize="xs" fontWeight="semibold">
          Example 01
        </Text>
        <Text color="white" fontSize="sm" mb={2}>
          {HARDWARE_EXAMPLE_01.name}
        </Text>
        <Text color="green.200" fontSize="xs" fontWeight="bold" mb={2}>
          {HARDWARE_EXAMPLE_01.status}
        </Text>
        <Button size="xs" colorScheme="cyan" mr={2} onClick={() =>
          dispatch.components.reset(HARDWARE_EXAMPLE_01.project)}>
          Load Example
        </Button>
        <Button size="xs" variant="outline" colorScheme="cyan"
          onClick={wiring.onOpen}>
          Wiring Guide
        </Button>
      </Box>
      <Modal isOpen={wiring.isOpen} onClose={wiring.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Example 01 wiring</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Waveshare ESP32-P4-WIFI6-Touch-LCD-7B</Text>
            <Code display="block" whiteSpace="pre" p={3}>{
`GPIO2 → Button 1 → GND
GPIO4 → Button 2 → GND
GPIO3 → 330R → LED 1 anode; LED cathode → GND
GPIO5 → 330R → LED 2 anode; LED cathode → GND`}</Code>
            <Text mt={3} fontWeight="bold" color="orange.500">
              Enable the LED test module's local slider/interlock before
              judging GPIO output.
            </Text>
            <Text mt={3} fontSize="sm">
              Full guide: {HARDWARE_EXAMPLE_01.guide}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={wiring.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
