import { forgeUIGetUploadedAssets } from './ForgeUIUploadedAssetRegistry'

export type ForgeUISpan = {
  id: string
  text: string
  semanticColor?: string
  color?: string
  fontSize?: number
  underline?: boolean
}

export const DEFAULT_FORGEUI_SPANS: ForgeUISpan[] = [
  { id: 'span-1', text: 'ForgeUI ', semanticColor: 'textPrimary', fontSize: 20 },
  { id: 'span-2', text: 'rich text', semanticColor: 'accent', fontSize: 20, underline: true },
]

let nextSpanId = 1

export const createForgeUISpan = (text = 'New span'): ForgeUISpan => ({
  id: `span-${Date.now()}-${nextSpanId++}`,
  text,
  semanticColor: 'textPrimary',
  color: '',
  fontSize: 16,
  underline: false,
})

export const normalizeForgeUISpans = (value: unknown): ForgeUISpan[] => {
  if (typeof value === 'string') {
    try { return normalizeForgeUISpans(JSON.parse(value)) } catch { return DEFAULT_FORGEUI_SPANS.map(span => ({ ...span })) }
  }
  if (!Array.isArray(value)) return DEFAULT_FORGEUI_SPANS.map(span => ({ ...span }))
  return value.map((item, index) => ({
    id: String(item?.id || `span-${index + 1}`),
    text: String(item?.text ?? ''),
    semanticColor: String(item?.semanticColor || 'textPrimary'),
    color: String(item?.color || ''),
    fontSize: Math.max(8, Math.min(48, Number(item?.fontSize) || 16)),
    underline: Boolean(item?.underline),
  }))
}

export const addForgeUISpan = (spans: ForgeUISpan[], text?: string) =>
  [...spans, createForgeUISpan(text)]

export const updateForgeUISpan = (
  spans: ForgeUISpan[], id: string, patch: Partial<ForgeUISpan>,
) => spans.map(span => span.id === id ? { ...span, ...patch, id: span.id } : span)

export const removeForgeUISpan = (spans: ForgeUISpan[], id: string) =>
  spans.filter(span => span.id !== id)

export const moveForgeUISpan = (
  spans: ForgeUISpan[], id: string, direction: -1 | 1,
) => {
  const index = spans.findIndex(span => span.id === id)
  const target = index + direction
  if (index < 0 || target < 0 || target >= spans.length) return [...spans]
  const next = [...spans]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export const FORGEUI_ADD_FIRST_SPAN_EVENT = 'forgeui-add-first-span'
export const requestForgeUIFirstSpan = (componentId: string) =>
  window.dispatchEvent(new CustomEvent(FORGEUI_ADD_FIRST_SPAN_EVENT, {
    detail: { componentId },
  }))

export const normalizeFrameAssetIds = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String).filter(Boolean) : []

export const findUploadedAsset = (id: unknown) =>
  forgeUIGetUploadedAssets().find(asset => asset.id === id)
