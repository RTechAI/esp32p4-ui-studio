import React from 'react'
import StandardNumberInputPreview from '~forgeui/preview/StandardNumberInputPreview'

interface IProps {
  component: IComponent
}

const NumberInputPreview = ({
  component,
}: IProps) => {
  return (
    <StandardNumberInputPreview
      mode="canvas"
      value={component.props.value}
      min={component.props.min}
      max={component.props.max}
      step={component.props.step}
      precision={component.props.precision}
      isDisabled={Boolean(component.props.isDisabled)}
      isReadOnly={Boolean(component.props.isReadOnly)}
    />
  )
}

export default NumberInputPreview
