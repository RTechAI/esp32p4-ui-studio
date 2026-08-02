import React from 'react'
import { useDrag } from 'react-dnd'
import { Text, Box, Button, Tooltip } from '@chakra-ui/react'
import { DragHandleIcon } from '@chakra-ui/icons'

export const createDragItemPayload = ({
  type,
  isMeta,
  rootParentType,
  defaultWidth,
  defaultHeight,
  insertionProps,
}: Pick<
  ComponentItemProps,
  | 'type'
  | 'isMeta'
  | 'rootParentType'
  | 'defaultWidth'
  | 'defaultHeight'
  | 'insertionProps'
>) => ({
  id: type,
  type,
  isMeta,
  rootParentType,
  defaultWidth,
  defaultHeight,
  insertionProps,
})

const DragItem: React.FC<ComponentItemProps> = ({
  type,
  soon,
  label,
  isMeta,
  isChild,
  rootParentType,
  defaultWidth,
  defaultHeight,
  insertionProps,
  onInsert,
  description,
  preview,
  onEdit,
}) => {
  const [, drag] = useDrag({
    item: createDragItemPayload({
      type,
      isMeta,
      rootParentType,
      defaultWidth,
      defaultHeight,
      insertionProps,
    }),
    canDrag: !soon,
  })

  let boxProps: any = {
    cursor: 'no-drop',
    color: 'whiteAlpha.600',
  }

  if (!soon) {
    boxProps = {
      ref: drag,
      color: 'whiteAlpha.800',
      cursor: 'move',
      _hover: {
        bg: 'teal.100',
        boxShadow: 'sm',
        color: 'teal.800',
      },
    }
  }

  if (isChild) {
    boxProps = { ...boxProps, ml: 4 }
  }

  return (
    <Tooltip label={description || label} placement="right" openDelay={400}>
    <Box
      boxSizing="border-box"
      transition="background-color 140ms, color 140ms, border-color 140ms"
      my={0.5}
      borderRadius="md"
      px={1}
      py={0.5}
      display="flex"
      alignItems="center"
      width="100%"
      minWidth={0}
      maxWidth="100%"
      minHeight="34px"
      overflow="hidden"
      border="1px solid transparent"
      data-testid="widget-tray-row"
      {...boxProps}
    >
      <Box
        role="button"
        tabIndex={soon ? -1 : 0}
        aria-label={`Insert ${label}`}
        aria-disabled={soon || undefined}
        display="flex"
        alignItems="center"
        flex={1}
        minWidth={0}
        maxWidth="100%"
        overflow="hidden"
        _focusVisible={{
          outline: '2px solid',
          outlineColor: 'cyan.300',
          outlineOffset: '1px',
        }}
        onClick={soon ? undefined : onInsert}
        onKeyDown={event => {
          if (
            !soon &&
            (event.key === 'Enter' || event.key === ' ')
          ) {
            event.preventDefault()
            onInsert?.()
          }
        }}
      >
        <DragHandleIcon path="" fontSize="xs" mr={2} />
        {preview && (
          <Box
            width="28px"
            height="22px"
            mr={2}
            flex="0 0 auto"
            aria-hidden
          >
            {preview}
          </Box>
        )}
        <Text
          letterSpacing="wide"
          fontSize="sm"
          textTransform="capitalize"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          minWidth={0}
          flex={1}
          title={label}
        >
          {label}
        </Text>
        {isMeta && (
          <Box
            ml={2}
            borderWidth="1px"
            color="teal.300"
            borderColor="teal.600"
            fontSize="xs"
            borderRadius={4}
            px={1}
          >
            preset
          </Box>
        )}
        {soon && (
          <Box
            ml={2}
            borderWidth="1px"
            color="whiteAlpha.500"
            borderColor="whiteAlpha.300"
            fontSize="xs"
            borderRadius={4}
            px={1}
          >
            soon
          </Box>
        )}
      </Box>
      {onEdit && (
        <Button
          ml="auto"
          flex="0 0 38px"
          width="38px"
          minWidth="38px"
          size="xs"
          variant="ghost"
          colorScheme="cyan"
          aria-label={`Edit ${label}`}
          onClick={event => {
            event.stopPropagation()
            onEdit()
          }}
        >
          Edit
        </Button>
      )}
    </Box>
    </Tooltip>
  )
}

export default DragItem
