import React, { useState, ReactNode } from 'react'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
} from '@reach/combobox'
import { useForm } from '~hooks/useForm'

type FormControlPropType = {
  handleChange: any
  value: any
  name: string
  children: ReactNode
}

const ltrim = (value: string) => {
  if (!value) return value
  return value.replace(/^\s+/g, '')
}

const InputSuggestion: React.FC<FormControlPropType> = ({
  handleChange,
  name,
  value,
  children,
}) => {
  const { setValue } = useForm()
  const [isFocus, setIsFocus] = useState(false)

  return (
    <Combobox
      openOnFocus
      onSelect={item => {
        setValue(name, item)
      }}
    >
      <ComboboxInput
        className="forgeui-combobox-input"
        onFocus={() => setIsFocus(true)}
        id={name}
        value={ltrim(value)}
        name={name}
        onChange={handleChange}
        aria-labelledby={name}
        autoComplete="off"
      />

            {isFocus && (
        <ComboboxPopover
          className="forgeui-combobox-popover"
          style={{
            background: '#0b0f16',
            border: '1px solid #2dd4bf',
            color: '#ffffff',
            zIndex: 10000,
            boxShadow: '0 12px 28px rgba(0,0,0,0.55)',
          }}
        >
          <ComboboxList
            className="forgeui-combobox-list"
            aria-labelledby={name}
            style={{
              background: '#0b0f16',
              color: '#ffffff',
              maxHeight: '320px',
              overflowY: 'auto',
              border: '1px solid #2dd4bf',
            }}
          >
            {children}
          </ComboboxList>
        </ComboboxPopover>
      )}
    </Combobox>
  )
}

export default InputSuggestion