import React, { useMemo } from 'react'
import iconsList from '~iconsList'
import StandardSelectPreview from '~forgeui/preview/StandardSelectPreview'

interface IProps {
  component: IComponent
}

const SelectPreview = ({ component }: IProps) => {
  const { icon = undefined, ...props } = { ...component.props }

  const Icon = useMemo(() => {
    if (!icon) {
      return null
    }

    return iconsList[icon as keyof typeof iconsList]
  }, [icon])

  return (
    <StandardSelectPreview
      mode="canvas"
      options={props.options}
      selectedIndex={props.selectedIndex}
      legacyValue={props.value}
      isDisabled={Boolean(props.isDisabled)}
      icon={Icon ? <Icon path="" /> : undefined}
    />
  )
}

export default SelectPreview
