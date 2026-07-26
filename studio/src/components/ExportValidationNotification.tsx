import React, {
  useCallback,
  useState,
} from 'react'
import {
  Code,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  Button,
  useToast,
} from '@chakra-ui/react'

type ToastController = ReturnType<typeof useToast>

const hashValidationMessage = (message: string) => {
  let hash = 2166136261
  for (let index = 0; index < message.length; index++) {
    hash ^= message.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

export const getExportValidationToastId = (
  message: string,
) => `forgeui-export-validation-${hashValidationMessage(message)}`

export const notifyExportValidationToast = (
  toast: ToastController,
  message: string,
) => {
  const id = getExportValidationToastId(message)
  const options = {
    title: 'Export validation failed.',
    status: 'error' as const,
    duration: 12000,
    isClosable: true,
  }

  if (toast.isActive(id)) {
    toast.update(id, options)
  } else {
    toast({
      id,
      ...options,
    })
  }

  return id
}

const callbackPattern =
  /^FG_On_[A-Za-z0-9_]+_(?:Clicked|Toggled|Changed)\([^)]*\)$/

export const ExportValidationDetails = ({
  message,
}: {
  message: string
}) => {
  const lines = message.split(/\r?\n/)

  return (
    <ModalBody
      data-testid="export-validation-details"
      whiteSpace="normal"
    >
      {lines.map((line, index) => {
        const trimmed = line.trim()
        if (!trimmed) {
          return <Text key={index} height={2} />
        }
        if (trimmed.startsWith('- ')) {
          return (
            <UnorderedList key={index} ml={6}>
              <ListItem>{trimmed.slice(2)}</ListItem>
            </UnorderedList>
          )
        }
        if (callbackPattern.test(trimmed)) {
          return (
            <Code
              key={index}
              display="inline-block"
              my={1}
              px={2}
              py={1}
              colorScheme="cyan"
            >
              {trimmed}
            </Code>
          )
        }
        if (
          index === 0 ||
          trimmed.endsWith(':') ||
          /^[A-Z][A-Za-z ]+$/.test(trimmed)
        ) {
          return (
            <Text
              key={index}
              mt={index === 0 ? 0 : 3}
              fontWeight="semibold"
            >
              {trimmed}
            </Text>
          )
        }
        return (
          <Text key={index}>{trimmed}</Text>
        )
      })}
    </ModalBody>
  )
}

export const ExportValidationDialog = ({
  message,
  isOpen,
  onClose,
}: {
  message: string
  isOpen: boolean
  onClose: () => void
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size="xl"
    scrollBehavior="inside"
    isCentered
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" color="gray.100">
      <ModalHeader>Export Validation</ModalHeader>
      <ModalCloseButton />
      <ExportValidationDetails message={message} />
      <ModalFooter>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

export const useExportValidationNotification = () => {
  const toast = useToast()
  const [details, setDetails] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)

  const notify = useCallback((message: string) => {
    notifyExportValidationToast(toast, message)
    setDetails(message)
    setDetailsOpen(true)
  }, [toast])

  return {
    notifyExportValidationFailure: notify,
    exportValidationDialog: (
      <ExportValidationDialog
        message={details}
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    ),
  }
}
