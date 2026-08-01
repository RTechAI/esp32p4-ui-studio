import React from 'react'
import StandardHeadingPreview from '~forgeui/preview/StandardHeadingPreview'
import { useForgePreviewPalette } from '~forgeui/theme/ForgeThemeContext'

const HeadingPreview = ({ component }: { component: IComponent }) => {
  const palette = useForgePreviewPalette()
  return <StandardHeadingPreview component={component} palette={palette} />
}

export default HeadingPreview
