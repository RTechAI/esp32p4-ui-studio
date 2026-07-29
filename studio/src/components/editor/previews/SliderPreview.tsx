import React from 'react'
import StandardSliderPreview from '~forgeui/preview/StandardSliderPreview'

const SliderPreview: React.FC<IPreviewProps> = ({
  component,
}) => {
  return (
    <StandardSliderPreview
      mode="canvas"
      value={component.props.value}
      min={component.props.min}
      max={component.props.max}
      step={component.props.step}
      orientation={component.props.orientation}
      isDisabled={Boolean(component.props.isDisabled)}
    />
  )
}

export default SliderPreview
