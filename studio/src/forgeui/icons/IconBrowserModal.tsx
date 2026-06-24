import React, { useMemo, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Input,
  VStack,
} from '@chakra-ui/react'

import iconsList, { ICON_COUNT, ICON_NAMES } from '~forgeui/iconsList'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelect: (iconName: string) => void
}

const IconBrowserModal = ({ isOpen, onClose, onSelect }: Props) => {
  const [search, setSearch] = useState('')

  const filteredIcons = useMemo(() => {
    const term = search.toLowerCase().trim()

    if (!term) return ICON_NAMES.slice(0, 50)

    return ICON_NAMES
      .filter(iconName => iconName.toLowerCase().includes(term))
      .slice(0, 50)
  }, [search])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
      <ModalOverlay bg="blackAlpha.800" />

      <ModalContent
        bg="#07101f"
        color="white"
        border="1px solid #00e5ff"
        borderRadius="md"
        boxShadow="0 0 30px rgba(0,229,255,0.25)"
        maxW="760px"
      >
        <ModalHeader>ForgeUI Icon Browser</ModalHeader>

        <ModalBody pb={4}>
          <VStack align="stretch" spacing={3}>
            <Input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search icons: wifi, battery, power, home..."
              bg="#020817"
              borderColor="cyan.500"
              color="white"
            />

            <Text fontSize="xs" color="gray.400">
              Total Icons: {ICON_COUNT}
            </Text>

            <Text fontSize="xs" color="gray.400">
              Showing: {filteredIcons.length}
            </Text>

            <div
              style={{
                maxHeight: '320px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {filteredIcons.map(iconName => {
                const IconPreview = iconsList[iconName as keyof typeof iconsList]

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onSelect(iconName)
                      onClose()
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      color: '#9ae6ff',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontSize: '14px',
                    }}
                  >
                    {IconPreview && <IconPreview size={18} />}
                    <span>{iconName}</span>
                  </button>
                )
              })}
            </div>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default IconBrowserModal