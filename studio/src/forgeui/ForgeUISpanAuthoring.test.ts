import components, { ComponentsState } from '../core/models/components'
import { getPreviewDefaultProps } from '../utils/defaultProps'
import { addForgeUISpan, DEFAULT_FORGEUI_SPANS, moveForgeUISpan, normalizeForgeUISpans, removeForgeUISpan, updateForgeUISpan } from './ForgeUIClosureWidgets'

describe('Span authoritative authoring model', () => {
  it('creates useful typed defaults and safely normalizes legacy records', () => {
    expect(getPreviewDefaultProps('Span')?.spans).toEqual(DEFAULT_FORGEUI_SPANS)
    expect(normalizeForgeUISpans('[{"text":"Legacy","fontSize":999}]')).toEqual([
      expect.objectContaining({ id: 'span-1', text: 'Legacy', semanticColor: 'textPrimary', fontSize: 48, underline: false }),
    ])
  })

  it('adds, edits, styles, reorders and removes immutable span records', () => {
    const first = addForgeUISpan([], 'First')
    const multiple = addForgeUISpan(first, 'Second')
    const styled = updateForgeUISpan(multiple, multiple[1].id, {
      text: 'Styled', semanticColor: 'accent', color: '#123456', fontSize: 28, underline: true,
    })
    expect(styled).not.toBe(multiple)
    expect(styled[1]).toEqual(expect.objectContaining({ text: 'Styled', semanticColor: 'accent', color: '#123456', fontSize: 28, underline: true }))
    const reordered = moveForgeUISpan(styled, styled[1].id, -1)
    expect(reordered.map(span => span.text)).toEqual(['Styled', 'First'])
    expect(removeForgeUISpan(reordered, reordered[1].id).map(span => span.text)).toEqual(['Styled'])
  })

  it('persists the collection across deselection and reselection', () => {
    const state: ComponentsState = { selectedId: 'span', components: {
      root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: ['span'] },
      span: { id: 'span', parent: 'root', type: 'Span', props: { spans: [] }, children: [] },
    } }
    const authored = addForgeUISpan([], 'Persistent')
    const updated = components.reducers.updateProps(state, { id: 'span', name: 'spans', value: authored })
    const deselected = components.reducers.unselect(updated)
    const reselected = components.reducers.select(deselected, 'span')
    expect(reselected.components.span.props.spans).toEqual(authored)
    expect(reselected.selectedId).toBe('span')
  })
})
