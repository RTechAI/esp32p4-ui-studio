import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Image } from '@chakra-ui/react'
import { findUploadedAsset, normalizeForgeUISpans, normalizeFrameAssetIds, requestForgeUIFirstSpan } from '../ForgeUIClosureWidgets'
import { ForgeSemanticPalette } from './forgeThemeMap'
import { openForgeUIAnimationFramePicker } from '../assets/ForgeUIAssetSelection'

const semantic = (palette: ForgeSemanticPalette, role: string, explicit?: string) =>
  explicit || (palette as any)[role] || palette.textPrimary

export const StandardSpanPreview = ({ component, palette }: any) => {
  const spans = normalizeForgeUISpans(component.props.spans)
  const empty = spans.length === 0
  return <Box width="100%" height="100%" overflow="hidden"
    textOverflow={component.props.overflow === 'clip' || component.props.overflow === 'visible' ? 'clip' : 'ellipsis'}
    textAlign={component.props.textAlign || 'left'} bg="transparent" whiteSpace="normal" data-testid="standard-span" data-empty={empty ? 'true' : 'false'}>
    {empty && <Button variant="outline" size="sm" width="100%" height="100%" borderColor={palette.surfaceBorder}
      color={palette.textSecondary} onClick={event => { event.stopPropagation(); requestForgeUIFirstSpan(component.id) }}>Add rich-text span</Button>}
    {spans.map(span => <Box as="span" key={span.id} color={semantic(palette, span.semanticColor || '', span.color)}
      fontSize={`${span.fontSize}px`} textDecoration={span.underline ? 'underline' : 'none'}>{span.text}</Box>)}
  </Box>
}

export const StandardAnimImagePreview = ({ component, palette }: any) => {
  const ids = normalizeFrameAssetIds(component.props.frameAssetIds)
  const assets = useMemo(() => ids.map(findUploadedAsset).filter(Boolean), [JSON.stringify(ids)])
  const [frame, setFrame] = useState(0)
  const running = component.props.autoStart !== false
  useEffect(() => {
    setFrame(0)
    if (!running || assets.length < 2) return
    const timer = window.setInterval(() => setFrame(value => {
      const next = value + 1
      return next >= assets.length ? (component.props.loop === false ? value : 0) : next
    }), Math.max(40, Number(component.props.frameDuration) || 250))
    return () => window.clearInterval(timer)
  }, [assets.length, running, component.props.loop, component.props.frameDuration])
  const asset: any = assets[Math.min(frame, Math.max(0, assets.length - 1))]
  return <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center" overflow="hidden"
    data-testid="standard-anim-image" data-empty={!asset ? 'true' : 'false'}
    bg="transparent" border={asset ? 'none' : '1px solid'} borderColor={asset ? 'transparent' : palette.surfaceBorder}
    borderRadius={asset ? 0 : '8px'} color={palette.textSecondary}>
    {asset ? <Image src={asset.browserSrc} alt={asset.name} width="100%" height="100%" objectFit="contain" /> :
      <Button type="button" variant="unstyled" px="8px" width="100%" height="100%" textAlign="center" fontSize="14px"
        cursor="pointer" onClick={event => {
          event.stopPropagation()
          openForgeUIAnimationFramePicker(component.id, ids)
        }}>Add animation frames</Button>}
  </Box>
}

export const StandardImageButtonPreview = ({ component, mode = 'canvas' }: any) => {
  const [pressed, setPressed] = useState(false)
  const disabled = Boolean(component.props.isDisabled)
  const id = disabled ? component.props.disabledAssetId : pressed ? component.props.pressedAssetId : component.props.releasedAssetId
  const asset = findUploadedAsset(id) || findUploadedAsset(component.props.releasedAssetId)
  return <Box as="button" type="button" width="100%" height="100%" p={0} border={0} bg="transparent"
    disabled={disabled} opacity={disabled ? 0.45 : 1} overflow="hidden"
    pointerEvents={mode === 'browser' ? 'auto' : 'none'}
    onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}>
    {asset ? <Image src={asset.browserSrc} alt={asset.name} width="100%" height="100%" objectFit="contain" /> :
      <Box color="gray.400" fontSize="sm">Select released image</Box>}
  </Box>
}
