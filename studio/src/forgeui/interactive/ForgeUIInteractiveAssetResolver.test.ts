import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

import {
  createDefaultInteractiveButtonAsset,
} from './ForgeUIInteractiveButtonAsset'
import {
  createDefaultInteractiveLightAsset,
} from './ForgeUIInteractiveLightAsset'
import {
  getInteractiveButtonComponentProps,
  getInteractiveButtonDimensions,
  isLvglReadyUploadedAsset,
  resolveInteractiveButtonVisuals,
  getInteractiveLightComponentProps,
  getInteractiveLightAssignmentProps,
  getInteractiveLightDimensions,
  getInteractiveLightInitialState,
  resolveInteractiveLightVisuals,
} from './ForgeUIInteractiveAssetResolver'

const createUploadedAsset = (
  id: string,
  exportStatus: ForgeUIUploadedAsset['exportStatus'],
): ForgeUIUploadedAsset => ({
  id,
  name: `${id}.png`,
  type: 'image/png',
  size: 100,
  createdAt: 1,
  browserSrc: `data:image/png;base64,${id}`,
  kind: 'uploaded',
  exportStatus,
  lvgl: `fg_upload_${id}`,
  cFile: `assets/uploads/fg_upload_${id}.c`,
})

describe('Interactive Asset resolution', () => {
  const normalAsset = createUploadedAsset(
    'normal',
    'lvgl_ready',
  )
  const pressedAsset = createUploadedAsset(
    'pressed',
    'lvgl_ready',
  )

  const button = {
    ...createDefaultInteractiveButtonAsset('button'),
    width: 120,
    height: 48,
    normalAssetId: normalAsset.id,
    pressedAssetId: pressedAsset.id,
  }

  it('resolves both button visuals from the uploaded registry', () => {
    expect(
      resolveInteractiveButtonVisuals(
        button,
        [normalAsset, pressedAsset],
      ),
    ).toEqual({ normalAsset, pressedAsset })
  })

  it('assigns artwork without replacing deliberate component geometry', () => {
    expect(getInteractiveButtonComponentProps(button)).toEqual({
      interactiveAssetId: 'button',
    })
  })

  it('uses asset dimensions before component fallbacks', () => {
    expect(
      getInteractiveButtonDimensions(button, {
        width: 80,
        height: 32,
      }),
    ).toEqual({ width: 120, height: 48 })
  })

  it('identifies only LVGL-ready uploaded assets', () => {
    expect(isLvglReadyUploadedAsset(normalAsset)).toBe(true)
    expect(
      isLvglReadyUploadedAsset(
        createUploadedAsset('pending', 'pending_conversion'),
      ),
    ).toBe(false)
  })

  it('resolves Light visuals, dimensions, assignment, and initial state', () => {
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      width: 32,
      height: 32,
      offAssetId: normalAsset.id,
      onAssetId: pressedAsset.id,
      initialState: 'on' as const,
    }

    expect(
      resolveInteractiveLightVisuals(
        light,
        [normalAsset, pressedAsset],
      ),
    ).toEqual({
      offAsset: normalAsset,
      onAsset: pressedAsset,
    })
    expect(getInteractiveLightDimensions(light, {
      width: 10,
      height: 10,
    })).toEqual({ width: 32, height: 32 })
    expect(getInteractiveLightComponentProps(light)).toEqual({
      interactiveAssetId: 'light',
    })
    expect(getInteractiveLightInitialState(light)).toBe('on')
  })

  it('handles missing Light visuals and defaults invalid state to off', () => {
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      initialState: 'invalid' as any,
    }

    expect(resolveInteractiveLightVisuals(light, [])).toEqual({
      offAsset: undefined,
      onAsset: undefined,
    })
    expect(getInteractiveLightInitialState(light)).toBe('off')
  })

  describe('initial Light assignment geometry', () => {
    const assignmentComponent = (
      props: Record<string, unknown>,
    ): IComponent => ({
      id: 'light-component',
      parent: 'root',
      type: 'InteractiveLight',
      props: {
        positionMode: 'absolute',
        x: 20,
        y: 30,
        w: 32,
        h: 32,
        ...props,
      },
      children: [],
    })
    const lightAsset = {
      ...createDefaultInteractiveLightAsset('assigned-light'),
      width: 100,
      height: 100,
    }

    it.each([
      [100, 100],
      [64, 96],
    ])(
      'adopts %sx%s for an untouched placeholder',
      (width, height) => {
        expect(getInteractiveLightAssignmentProps(
          { ...lightAsset, width, height },
          assignmentComponent({}),
          { width: 300, height: 200 },
        )).toEqual({
          interactiveAssetId: lightAsset.id,
          x: '20',
          y: '30',
          w: String(width),
          h: String(height),
        })
      },
    )

    it('preserves resized unconfigured geometry', () => {
      expect(getInteractiveLightAssignmentProps(
        lightAsset,
        assignmentComponent({
          w: 80,
          h: 120,
        }),
      )).toEqual({
        interactiveAssetId: lightAsset.id,
      })
    })

    it('preserves configured and reopened geometry', () => {
      expect(getInteractiveLightAssignmentProps(
        lightAsset,
        assignmentComponent({
          interactiveAssetId: 'existing',
          w: 32,
          h: 32,
        }),
      )).toEqual({
        interactiveAssetId: lightAsset.id,
      })
    })

    it('shifts adopted geometry inside right and bottom bounds', () => {
      expect(getInteractiveLightAssignmentProps(
        lightAsset,
        assignmentComponent({
          x: 250,
          y: 150,
        }),
        { width: 300, height: 200 },
      )).toEqual({
        interactiveAssetId: lightAsset.id,
        x: '200',
        y: '100',
        w: '100',
        h: '100',
      })
    })

    it('clamps oversized assets to the complete canvas', () => {
      expect(getInteractiveLightAssignmentProps(
        {
          ...lightAsset,
          width: 400,
          height: 250,
        },
        assignmentComponent({
          x: 20,
          y: 30,
        }),
        { width: 300, height: 200 },
      )).toEqual({
        interactiveAssetId: lightAsset.id,
        x: '0',
        y: '0',
        w: '300',
        h: '200',
      })
    })
  })
})
