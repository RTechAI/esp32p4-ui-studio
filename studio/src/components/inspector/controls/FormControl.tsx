import React, { ReactNode, memo } from 'react'
import {
  FormLabel,
  FormControl as ChakraFormControl,
  Grid,
  Box,
} from '@chakra-ui/react'

type FormControlPropType = {
  label: ReactNode
  children: ReactNode
  htmlFor?: string
  hasColumn?: boolean
}

export const INSPECTOR_PROPERTY_TEXT_COLOR = '#94a3b8'

const FormControl: React.FC<FormControlPropType> = ({
  label,
  htmlFor,
  children,
  hasColumn,
}) => (
  <ChakraFormControl
    mb={1}
    pb={1}
    as={Grid}
    display="flex"
    alignItems="center"
    justifyItems="center"
    bg="#111827"
    borderBottom="1px solid"
    borderColor="#1e293b"
  >
    <FormLabel
      p={0}
      mr={2}
      color={INSPECTOR_PROPERTY_TEXT_COLOR}
      lineHeight="1rem"
      width={hasColumn ? '2.5rem' : '90px'}
      fontSize="xs"
      htmlFor={htmlFor}
    >
      {label}
    </FormLabel>

    <Box
      display="flex"
      alignItems="center"
      justifyItems="center"
      width={hasColumn ? '30px' : '130px'}
    >
      {children}
    </Box>
  </ChakraFormControl>
)

export default memo(FormControl)
