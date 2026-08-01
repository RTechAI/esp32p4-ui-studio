export const forgeuiInputStyle = {
  bg: '#020617',
  color: '#f8fafc',
  opacity: 1,

  borderColor: '#334155',

  sx: {
    color: '#f8fafc !important',
    WebkitTextFillColor: '#f8fafc !important',
    opacity: '1 !important',

    '&::placeholder': {
      color: '#94a3b8 !important',
      WebkitTextFillColor: '#94a3b8 !important',
      opacity: '1 !important',
    },

    '&:disabled, &[disabled], &[aria-disabled=true], &[readonly]': {
      color: '#cbd5e1 !important',
      WebkitTextFillColor: '#cbd5e1 !important',
      opacity: '1 !important',
    },
  },

  _hover: {
    borderColor: '#475569',
  },

  _focus: {
    borderColor: '#38bdf8',
    boxShadow: '0 0 0 1px #38bdf8',
  },

  _placeholder: {
    color: '#94a3b8',
    opacity: 1,
  },

  _disabled: {
    opacity: 1,
    color: '#cbd5e1',
  },
}

// Chakra Select renders a native HTML select; its popup is not a Chakra
// portal. These global selectors provide one Studio-wide native dropdown
// contract for Inspector controls and other ForgeUI authoring surfaces.
export const forgeuiNativeSelectGlobalStyles = {
  '.chakra-select, select': {
    colorScheme: 'dark',
  },

  '.chakra-select option, select option': {
    backgroundColor: '#0f172a !important',
    color: '#f8fafc !important',
    WebkitTextFillColor: '#f8fafc !important',
  },

  '.chakra-select option:hover, select option:hover': {
    backgroundColor: '#1e293b !important',
    color: '#ffffff !important',
    WebkitTextFillColor: '#ffffff !important',
  },

  '.chakra-select option:checked, select option:checked': {
    backgroundColor: '#0f766e !important',
    backgroundImage: 'linear-gradient(#0f766e, #0f766e) !important',
    color: '#ffffff !important',
    WebkitTextFillColor: '#ffffff !important',
  },

  '.chakra-select option:disabled, select option:disabled': {
    backgroundColor: '#111827 !important',
    color: '#64748b !important',
    WebkitTextFillColor: '#64748b !important',
  },

  '.chakra-select:focus-visible, select:focus-visible': {
    borderColor: '#38bdf8 !important',
    boxShadow: '0 0 0 1px #38bdf8 !important',
    outline: 'none !important',
  },
}
