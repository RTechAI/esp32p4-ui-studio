import React, { memo } from 'react'
import { Accordion } from '@chakra-ui/react'

import BorderPanel from
  '~components/inspector/panels/styles/BorderPanel'
import TextPanel from
  '~components/inspector/panels/styles/TextPanel'
import AccordionContainer from
  '~components/inspector/AccordionContainer'
import ColorsControl from
  '~components/inspector/controls/ColorsControl'
import GradientControl from
  '~components/inspector/controls/GradientControl'
import ChildrenInspector from
  '~components/inspector/ChildrenInspector'
import ParentInspector from
  '~components/inspector/ParentInspector'

import EffectsPanel from './styles/EffectsPanel'

interface Props {
  isRoot: boolean
  showChildren: boolean
  parentIsRoot: boolean
  componentType: string
}

const StylesPanel: React.FC<Props> = ({
  isRoot,
  showChildren,
  parentIsRoot,
  componentType,
}) => {
  const showTypography = ![
    'Image',
    'Icon',
    'Led',
    'Bar',
    'Arc',
    'Progress',
    'CircularProgress',
    'Chart',
    'Scale',
  ].includes(componentType)

  return (
    <Accordion allowMultiple>
      {!isRoot && !parentIsRoot && (
        <AccordionContainer title="Parent">
          <ParentInspector />
        </AccordionContainer>
      )}

      {showChildren && (
        <AccordionContainer title="Children">
          <ChildrenInspector />
        </AccordionContainer>
      )}

      {!isRoot && showTypography && (
        <AccordionContainer title="Typography">
          <TextPanel />
        </AccordionContainer>
      )}

      <AccordionContainer title="Backgrounds">
        <ColorsControl
          withFullColor
          label="Color"
          name="backgroundColor"
          enableHues
        />

        {!isRoot && (
          <GradientControl
            withFullColor
            label="Gradient"
            name="bgGradient"
            options={[
              'to top',
              'to top right',
              'to top left',
              'to bottom right',
              'to bottom',
              'to bottom left',
              'to right',
              'to left',
            ]}
            enableHues
          />
        )}
      </AccordionContainer>

      {!isRoot && (
        <>
          <AccordionContainer title="Border">
            <BorderPanel />
          </AccordionContainer>

          <AccordionContainer title="Effect">
            <EffectsPanel />
          </AccordionContainer>
        </>
      )}
    </Accordion>
  )
}

export default memo(StylesPanel)