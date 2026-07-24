import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Box, Text } from '@chakra-ui/react'
import { Rnd } from 'react-rnd'

export type ForgeUIStateSheetRegion = {
  id: string
  label: string
  x: number
  y: number
}

export type ForgeUIStateSheetProject = {
  sourceWidth: number
  sourceHeight: number
  cropWidth: number
  cropHeight: number
  regions: ForgeUIStateSheetRegion[]
}

type StateSheetOverlayProps = {
  imageElement: HTMLImageElement | null
  project: ForgeUIStateSheetProject
  onChange: (project: ForgeUIStateSheetProject) => void
}

type RenderedImageBounds = {
  left: number
  top: number
  width: number
  height: number
}

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
) => Math.min(Math.max(value, minimum), maximum)

export const moveStateSheetRegion = (
  project: ForgeUIStateSheetProject,
  id: string,
  x: number,
  y: number,
): ForgeUIStateSheetProject => ({
  ...project,
  regions: project.regions.map(region =>
    region.id === id
      ? {
          ...region,
          x: clamp(
            Math.round(x),
            0,
            project.sourceWidth - project.cropWidth,
          ),
          y: clamp(
            Math.round(y),
            0,
            project.sourceHeight -
              project.cropHeight,
          ),
        }
      : region,
  ),
})

export const resizeStateSheetRegions = (
  project: ForgeUIStateSheetProject,
  id: string,
  cropWidthValue: number,
  cropHeightValue: number,
  x: number,
  y: number,
): ForgeUIStateSheetProject => {
  const cropWidth = clamp(
    Math.round(cropWidthValue),
    1,
    project.sourceWidth,
  )
  const cropHeight = clamp(
    Math.round(cropHeightValue),
    1,
    project.sourceHeight,
  )

  return {
    ...project,
    cropWidth,
    cropHeight,
    regions: project.regions.map(region => ({
      ...region,
      x: clamp(
        region.id === id ? Math.round(x) : region.x,
        0,
        project.sourceWidth - cropWidth,
      ),
      y: clamp(
        region.id === id ? Math.round(y) : region.y,
        0,
        project.sourceHeight - cropHeight,
      ),
    })),
  }
}

export const getContainedImageBounds = (
  elementWidth: number,
  elementHeight: number,
  naturalWidth: number,
  naturalHeight: number,
): RenderedImageBounds => {
  if (
    elementWidth <= 0 ||
    elementHeight <= 0 ||
    naturalWidth <= 0 ||
    naturalHeight <= 0
  ) {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    }
  }

  const scale = Math.min(
    elementWidth / naturalWidth,
    elementHeight / naturalHeight,
  )
  const width = naturalWidth * scale
  const height = naturalHeight * scale

  return {
    left: (elementWidth - width) / 2,
    top: (elementHeight - height) / 2,
    width,
    height,
  }
}

const StateSheetOverlay = ({
  imageElement,
  project,
  onChange,
}: StateSheetOverlayProps) => {
  const [bounds, setBounds] =
    useState<RenderedImageBounds>({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    })

  useEffect(() => {
    if (!imageElement) return

    const measure = () => {
      const nextBounds = getContainedImageBounds(
        imageElement.clientWidth,
        imageElement.clientHeight,
        project.sourceWidth,
        project.sourceHeight,
      )

      setBounds(nextBounds)
    }

    measure()

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(measure)

    observer?.observe(imageElement)
    window.addEventListener('resize', measure)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [
    imageElement,
    project.sourceHeight,
    project.sourceWidth,
  ])

  const scale = useMemo(
    () =>
      project.sourceWidth > 0
        ? bounds.width / project.sourceWidth
        : 0,
    [bounds.width, project.sourceWidth],
  )

  if (scale <= 0) return null

  const moveRegion = (
    id: string,
    displayX: number,
    displayY: number,
  ) => {
    onChange(
      moveStateSheetRegion(
        project,
        id,
        displayX / scale,
        displayY / scale,
      ),
    )
  }

  const resizeRegions = (
    id: string,
    displayWidth: number,
    displayHeight: number,
    displayX: number,
    displayY: number,
  ) => {
    onChange(
      resizeStateSheetRegions(
        project,
        id,
        displayWidth / scale,
        displayHeight / scale,
        displayX / scale,
        displayY / scale,
      ),
    )
  }

  return (
    <Box
      position="absolute"
      left={`${bounds.left}px`}
      top={`${bounds.top}px`}
      width={`${bounds.width}px`}
      height={`${bounds.height}px`}
      zIndex={2}
      pointerEvents="none"
      data-testid="state-sheet-overlay"
    >
      {project.regions.map((region, index) => {
        const color =
          index === 0 ? '#38bdf8' : '#4ade80'

        return (
          <Rnd
            key={region.id}
            bounds="parent"
            position={{
              x: region.x * scale,
              y: region.y * scale,
            }}
            size={{
              width: project.cropWidth * scale,
              height: project.cropHeight * scale,
            }}
            minWidth={12}
            minHeight={12}
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
            onDrag={(_event, position) =>
              moveRegion(
                region.id,
                position.x,
                position.y,
              )
            }
            onResize={(
              _event,
              _direction,
              element,
              _delta,
              position,
            ) =>
              resizeRegions(
                region.id,
                element.offsetWidth,
                element.offsetHeight,
                position.x,
                position.y,
              )
            }
            style={{
              border: `2px solid ${color}`,
              background: `${color}1f`,
              boxSizing: 'border-box',
              pointerEvents: 'auto',
            }}
            resizeHandleStyles={{
              top: { borderTop: `4px solid ${color}` },
              right: { borderRight: `4px solid ${color}` },
              bottom: {
                borderBottom: `4px solid ${color}`,
              },
              left: { borderLeft: `4px solid ${color}` },
              topRight: {
                width: 10,
                height: 10,
                background: color,
              },
              bottomRight: {
                width: 10,
                height: 10,
                background: color,
              },
              bottomLeft: {
                width: 10,
                height: 10,
                background: color,
              },
              topLeft: {
                width: 10,
                height: 10,
                background: color,
              },
            }}
          >
            <Text
              as="span"
              position="absolute"
              top="4px"
              left="4px"
              px={2}
              py={0.5}
              bg="blackAlpha.800"
              color={color}
              fontSize="xs"
              fontWeight="bold"
              lineHeight="short"
              userSelect="none"
            >
              {region.label}
            </Text>
          </Rnd>
        )
      })}
    </Box>
  )
}

export default StateSheetOverlay
