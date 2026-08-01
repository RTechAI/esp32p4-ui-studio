import { validateForgeUIExport } from './ForgeUIExportValidation'

const uploaded = (id: string, overrides: Record<string, unknown> = {}) => ({
  id, name: `${id}.png`, type: 'image/png', size: 1,
  createdAt: 1, browserSrc: `/assets/${id}.png`, kind: 'uploaded' as const,
  exportStatus: 'lvgl_ready' as const, lvgl: `fg_${id}`,
  cFile: `assets/uploads/fg_${id}.c`, ...overrides,
})

const interactive = (kind: 'button' | 'light' | 'statusIndicator', id = `${kind}-asset`) => ({
  schemaVersion: 1 as const, id, name: `${kind} asset`, kind,
  interactionMode: kind === 'button' ? 'momentary' as const : 'state' as const,
  label: kind, width: 32, height: 32, createdAt: 'now', updatedAt: 'now',
  ...(kind === 'button'
    ? { normalAssetId: 'normal', pressedAssetId: 'pressed',
        normal: { backgroundColor: '#000', borderColor: '#000', textColor: '#fff', borderWidth: 0, borderRadius: 0 },
        pressed: { backgroundColor: '#000', borderColor: '#000', textColor: '#fff', borderWidth: 0, borderRadius: 0 } }
    : { offAssetId: 'off', onAssetId: 'on', initialState: 'off' as const }),
})

const component = (type: 'InteractiveButton' | 'InteractiveLight' | 'InteractiveStatusIndicator' | 'InteractiveToggleSwitch', id: string, assetId: string) => ({
  id, type, componentName: id, parent: 'root', children: [],
  props: { interactiveAssetId: assetId, w: 32, h: 32 },
})

const generate = (assets: ReturnType<typeof uploaded>[], hooks: string[] = [], setters: string[] = []) => ({
  code: assets.map(asset => asset.lvgl).join('\n'),
  assetSources: assets.map(asset => asset.cFile),
  userEventHooks: hooks,
  publicApiDeclarations: setters,
})

describe('ForgeUI export preflight', () => {
  const toggle = (
    id: string,
    offAssetId: string,
    onAssetId: string,
    stateSheetSourceAssetId?: string,
  ) => ({
    schemaVersion: 1 as const,
    id,
    name: id,
    kind: 'toggleSwitch' as const,
    interactionMode: 'state' as const,
    label: id,
    width: 64,
    height: 36,
    offAssetId,
    onAssetId,
    stateSheetSourceAssetId,
    initialState: 'off' as const,
    createdAt: 'now',
    updatedAt: 'now',
  })

  const canvas = (props: Record<string, unknown>) => ({
    root: { id: 'root', type: 'Box', parent: 'root', children: ['text'], props: {} },
    text: { id: 'text-id', type: 'Text', componentName: 'Status Text',
      parent: 'root', children: [], props },
  })

  it('accepts valid dimensions on a non-interactive Canvas component', () => {
    expect(validateForgeUIExport(
      canvas({ w: '120', h: 40 }) as any, [], [], generate([]),
    ).ok).toBe(true)
  })

  it.each([
    [{ h: 40 }, 'width', 'undefined'],
    [{ w: 120 }, 'height', 'undefined'],
    [{ w: 0, h: 40 }, 'width', '0'],
    [{ w: 120, h: -1 }, 'height', '-1'],
    [{ w: 'wide', h: 40 }, 'width', 'wide'],
    [{ w: 120, h: Number.POSITIVE_INFINITY }, 'height', 'Infinity'],
  ])('rejects invalid general Canvas dimensions %#', (props, dimension, value) => {
    const result = validateForgeUIExport(
      canvas(props) as any, [], [], generate([]),
    )
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      category: 'Canvas',
      subject: 'Status Text (text-id)',
      message: `Component \"Status Text\" (text-id) has an invalid ${dimension}: ${value}`,
    }))
  })

  it('reports a missing Interactive Asset and wrong kind', () => {
    const button = interactive('button')
    const result = validateForgeUIExport({
      a: component('InteractiveButton', 'a', 'missing'),
      b: component('InteractiveLight', 'b', button.id),
    } as any, [button] as any, [uploaded('normal'), uploaded('pressed')],
    generate([uploaded('normal'), uploaded('pressed')], ['FG_On_Button_Clicked']))
    expect(result.diagnostics.map(item => item.message)).toEqual(expect.arrayContaining([
      'Interactive Asset reference no longer exists', 'Interactive Asset kind must be light',
    ]))
  })

  it('reports missing uploads, LVGL source, and generated C path', () => {
    const button = interactive('button')
    const broken = uploaded('normal', { exportStatus: 'pending_conversion', lvgl: '', cFile: '' })
    const result = validateForgeUIExport({
      a: component('InteractiveButton', 'a', button.id),
    } as any, [button] as any, [broken], generate([]))
    const messages = result.diagnostics.map(item => item.message)
    expect(messages).toEqual(expect.arrayContaining([
      'LVGL conversion is not complete', 'Generated C source is missing or invalid',
      'LVGL symbol is missing or invalid', 'Referenced by button asset but does not exist',
    ]))
  })

  it('rejects duplicate hooks, symbols, and invalid assetSources', () => {
    const button = interactive('button')
    const light = interactive('light')
    const assets = [uploaded('normal'), uploaded('pressed'), uploaded('off'),
      uploaded('on', { lvgl: 'fg_off', cFile: '../bad.c' })]
    const result = validateForgeUIExport({
      a: component('InteractiveButton', 'a', button.id),
      b: component('InteractiveButton', 'b', button.id),
      c: { ...component('InteractiveLight', 'c', light.id), componentName: 'same' },
      d: { ...component('InteractiveLight', 'd', light.id), componentName: 'same' },
    } as any, [button, light] as any, assets, generate(assets, ['FG_On_Button_Clicked'], [
      'void FG_Set_Same(bool enabled);',
      'void FG_Set_Same_2(bool enabled);',
    ]))
    expect(result.diagnostics.some(item =>
      item.message.includes(
        'Duplicate public callback',
      ),
    )).toBe(true)
    expect(result.diagnostics.some(item => item.message.includes('Duplicate Light setter'))).toBe(false)
    expect(result.diagnostics.some(item => item.message === 'Duplicate generated image symbol')).toBe(true)
    expect(result.diagnostics.some(item => item.message === 'Invalid relative C source path')).toBe(true)
  })

  describe('Interactive Button public callback conflicts', () => {
    const button = (
      id: string,
      name: string,
      label: string,
    ) => ({
      ...interactive('button', id),
      name,
      label,
    })
    const buttons = (
      firstLabel: string,
      secondLabel: string,
    ) => {
      const first = button(
        'blue-button-asset',
        'Blue Start Button',
        firstLabel,
      )
      const second = button(
        'silver-button-asset',
        'Silver Start Button',
        secondLabel,
      )
      return {
        first,
        second,
        components: {
          blue: component(
            'InteractiveButton',
            'comp-blue',
            first.id,
          ),
          silver: component(
            'InteractiveButton',
            'comp-silver',
            second.id,
          ),
        },
      }
    }
    const images = [uploaded('normal'), uploaded('pressed')]

    it('accepts two Buttons with unique generated callbacks', () => {
      const { first, second, components } =
        buttons('Start', 'Stop')
      const result = validateForgeUIExport(
        components as any,
        [first, second] as any,
        images,
        generate(images, [
          'FG_On_Start_Clicked',
          'FG_On_Stop_Clicked',
        ]),
      )

      expect(result.ok).toBe(true)
    })

    it('reports callback, user-facing names, IDs, and Label guidance', () => {
      const { first, second, components } =
        buttons('Start Button', 'Start-Button')
      const result = validateForgeUIExport(
        components as any,
        [first, second] as any,
        images,
        generate(images, [
          'FG_On_StartButton_Clicked',
          'FG_On_StartButton_2_Clicked',
        ]),
      )
      const duplicate = result.diagnostics.find(item =>
        item.message.includes(
          'Duplicate public callback',
        ),
      )

      expect(result.ok).toBe(false)
      expect(duplicate?.message).toContain(
        'FG_On_StartButton_Clicked(void)',
      )
      expect(duplicate?.message).toContain(
        '- Blue Start Button',
      )
      expect(duplicate?.message).toContain(
        '- Silver Start Button',
      )
      expect(duplicate?.message).toContain(
        'Rename the Label on 1 of these Buttons',
      )
      expect(duplicate?.message).toContain(
        'Component ID: comp-blue',
      )
      expect(duplicate?.message).toContain(
        'Component ID: comp-silver',
      )
    })

    it('aggregates every Button in a multi-way callback collision', () => {
      const assets = ['first', 'second', 'third', 'fourth'].map(
        id => button(`${id}-asset`, 'New Interactive Button', 'Button'),
      )
      const components = Object.fromEntries(
        assets.map((asset, index) => [
          `button-${index}`,
          component(
            'InteractiveButton',
            `comp-${index + 1}`,
            asset.id,
          ),
        ]),
      )
      const result = validateForgeUIExport(
        components as any,
        assets as any,
        images,
        generate(images, [
          'FG_On_Button_Clicked',
          'FG_On_Button_2_Clicked',
          'FG_On_Button_3_Clicked',
          'FG_On_Button_4_Clicked',
        ]),
      )
      const duplicates = result.diagnostics.filter(item =>
        item.message.includes('Duplicate public callback'),
      )

      expect(duplicates).toHaveLength(1)
      expect(duplicates[0].message).toContain(
        'The following 4 Buttons generate this callback:',
      )
      ;['comp-1', 'comp-2', 'comp-3', 'comp-4'].forEach(id => {
        expect(duplicates[0].message).toContain(
          `Component ID: ${id}`,
        )
      })
      expect(duplicates[0].message).toContain(
        'Rename the Label on 3 of these Buttons',
      )
    })

    it('clears the conflict after changing the second Label', () => {
      const { first, second, components } =
        buttons('Start Button', 'Start-Button')
      const renamed = {
        ...second,
        label: 'Stop Button',
      }
      const result = validateForgeUIExport(
        components as any,
        [first, renamed] as any,
        images,
        generate(images, [
          'FG_On_StartButton_Clicked',
          'FG_On_StopButton_Clicked',
        ]),
      )

      expect(result.ok).toBe(true)
      expect(result.diagnostics).toEqual([])
    })
  })

  it('accepts deterministic suffixed setters for same-named Light instances', () => {
    const light = interactive('light')
    const assets = [uploaded('off'), uploaded('on')]
    const first = { ...component('InteractiveLight', 'first', light.id),
      componentName: 'Status Light' }
    const second = { ...component('InteractiveLight', 'second', light.id),
      componentName: 'Status Light' }
    const result = validateForgeUIExport(
      { second, first } as any,
      [light] as any,
      assets,
      generate(assets, [], [
        'void FG_Set_Status_Light(bool enabled);',
        'void FG_Set_Status_Light_2(bool enabled);',
      ]),
    )

    expect(result.ok).toBe(true)
    expect(result.diagnostics).toEqual([])
  })

  it('accepts multiple Status Indicators and a coexisting Light', () => {
    const indicator = interactive('statusIndicator')
    const light = interactive('light')
    const assets = [uploaded('off'), uploaded('on')]
    const result = validateForgeUIExport(
      {
        first: { ...component('InteractiveStatusIndicator', 'first', indicator.id), componentName: 'Ready' },
        second: { ...component('InteractiveStatusIndicator', 'second', indicator.id), componentName: 'Ready' },
        light: { ...component('InteractiveLight', 'light', light.id), componentName: 'Alarm' },
      } as any,
      [indicator, light] as any,
      assets,
      generate(assets, [], [
        'void FG_Set_Ready(bool enabled);',
        'void FG_Set_Ready_2(bool enabled);',
        'void FG_Set_Alarm(bool enabled);',
      ]),
    )
    expect(result.ok).toBe(true)
  })

  it('rejects genuinely duplicated final public declarations', () => {
    const declaration = 'void FG_Set_Status_Light(bool enabled);'
    const result = validateForgeUIExport(
      {} as any,
      [],
      [],
      { ...generate([]), publicApiDeclarations: [declaration, declaration] },
    )

    expect(result.diagnostics).toContainEqual({
      category: 'Public API',
      subject: declaration,
      message: 'Duplicate final public API declaration',
    })
  })

  it('rejects duplicate component IDs', () => {
    const result = validateForgeUIExport({
      first: { id: 'duplicate', type: 'Text', parent: 'root', children: [],
        props: { w: 10, h: 10 } },
      second: { id: 'duplicate', type: 'Icon', parent: 'root', children: [],
        props: { w: 10, h: 10 } },
    } as any, [], [], generate([]))
    expect(result.diagnostics).toContainEqual({
      category: 'Canvas', subject: 'duplicate', message: 'Duplicate component ID',
    })
  })

  it.each([
    ['InteractiveButton', 'button', { w: 0, h: 32 }, 'width', '0'],
    ['InteractiveLight', 'light', { w: 32, h: -2 }, 'height', '-2'],
  ] as const)(
    'rejects invalid %s Canvas dimensions',
    (type, kind, dimensions, failedDimension, value) => {
      const asset = interactive(kind)
      const images = kind === 'button'
        ? [uploaded('normal'), uploaded('pressed')]
        : [uploaded('off'), uploaded('on')]
      const item = component(type, `${kind}-component`, asset.id)
      item.props = { ...item.props, ...dimensions }
      const result = validateForgeUIExport(
        { item } as any, [asset] as any, images,
        generate(images,
          kind === 'button' ? ['FG_On_Button_Clicked'] : [],
          kind === 'light' ? ['void FG_Set_LightComponent(bool enabled);'] : [],
        ),
      )
      expect(result.diagnostics).toContainEqual(expect.objectContaining({
        category: 'Canvas',
        message: expect.stringContaining(`invalid ${failedDimension}: ${value}`),
      }))
    },
  )

  it('rejects duplicate image declarations', () => {
    const result = validateForgeUIExport({} as any, [], [], {
      code: 'LV_IMAGE_DECLARE(fg_same);\nLV_IMAGE_DECLARE(fg_same);',
      assetSources: [], userEventHooks: [], publicApiDeclarations: [],
    })
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      message: 'Duplicate image declaration', subject: 'fg_same',
    }))
  })

  it('ignores unreferenced historical Toggle assets with missing sources', () => {
    const current = toggle(
      'Current Toggle',
      'new_off',
      'new_on',
    )
    const historical = toggle(
      'Historical Toggle',
      'old_off',
      'old_on',
    )
    const currentImages = [
      uploaded('new_off'),
      uploaded('new_on'),
    ]
    const staleImages = [
      uploaded('old_off', {
        cFile:
          'assets/uploads/missing_old_off.c',
        lvgl: 'fg_new_off',
      }),
      uploaded('old_on', {
        cFile:
          'assets/uploads/missing_old_on.c',
      }),
    ]
    const result = validateForgeUIExport(
      {
        toggle: component(
          'InteractiveToggleSwitch',
          'toggle',
          current.id,
        ),
      } as any,
      [current, historical],
      [...currentImages, ...staleImages],
      generate(
        currentImages,
        ['FG_On_Toggle_Toggled'],
      ),
    )

    expect(result.ok).toBe(true)
    expect(result.assetSources).toEqual(
      currentImages.map(image => image.cFile),
    )
  })

  it('reports one precise error for a reachable Toggle source omitted from export', () => {
    const current = toggle(
      'Pump Toggle',
      'pump_off',
      'pump_on',
    )
    const images = [
      uploaded('pump_off'),
      uploaded('pump_on'),
    ]
    const result = validateForgeUIExport(
      {
        pump: component(
          'InteractiveToggleSwitch',
          'Pump',
          current.id,
        ),
      } as any,
      [current],
      images,
      {
        ...generate(
          [images[1]],
          ['FG_On_Pump_Toggled'],
        ),
      },
    )

    expect(result.diagnostics).toContainEqual({
      category: 'Asset Sources',
      subject: 'Pump Toggle OFF',
      message:
        'Referenced image source is missing from export: pump_off.png (assets/uploads/fg_pump_off.c)',
    })
    expect(
      result.diagnostics.filter(
        item =>
          item.message.includes(
            'Referenced image source is missing',
          ),
      ),
    ).toHaveLength(1)
  })

  it('deduplicates shared Toggle images and ignores state-sheet metadata', () => {
    const source = uploaded('state_sheet', {
      cFile:
        'assets/uploads/missing_state_sheet.c',
    })
    const images = [
      uploaded('shared_off'),
      uploaded('shared_on'),
    ]
    const first = toggle(
      'First',
      'shared_off',
      'shared_on',
      source.id,
    )
    const second = toggle(
      'Second',
      'shared_off',
      'shared_on',
    )
    const result = validateForgeUIExport(
      {
        first: component(
          'InteractiveToggleSwitch',
          'First',
          first.id,
        ),
        second: component(
          'InteractiveToggleSwitch',
          'Second',
          second.id,
        ),
      } as any,
      [first, second],
      [...images, source],
      generate(
        images,
        [
          'FG_On_First_Toggled',
          'FG_On_Second_Toggled',
        ],
      ),
    )

    expect(result.ok).toBe(true)
    expect(result.assetSources).toEqual(
      images.map(image => image.cFile),
    )
    expect(result.assetSources).not.toContain(
      source.cFile,
    )
  })

  it('follows only the replacement pair referenced by the saved Toggle', () => {
    const rebuilt = toggle(
      'Rebuilt',
      'replacement_off',
      'replacement_on',
      'source',
    )
    const replacement = [
      uploaded('replacement_off'),
      uploaded('replacement_on'),
    ]
    const old = [
      uploaded('old_off', {
        cFile: 'assets/uploads/deleted_off.c',
      }),
      uploaded('old_on', {
        cFile: 'assets/uploads/deleted_on.c',
      }),
    ]
    const result = validateForgeUIExport(
      {
        rebuilt: component(
          'InteractiveToggleSwitch',
          'Rebuilt',
          rebuilt.id,
        ),
      } as any,
      [rebuilt],
      [...replacement, ...old],
      generate(
        replacement,
        ['FG_On_Rebuilt_Toggled'],
      ),
    )

    expect(result.ok).toBe(true)
    expect(result.assetSources).toEqual(
      replacement.map(image => image.cFile),
    )
  })

  it.each([
    'Lottie',
    'Menu',
    'ObjxTempl',
    'Editable',
  ])('rejects quarantined legacy placeholder %s', type => {
    const result = validateForgeUIExport(
      {
        legacy: {
          id: 'legacy',
          type,
          componentName: `Legacy ${type}`,
          parent: 'root',
          children: [],
          props: { w: 100, h: 100 },
        },
      } as any,
      [],
      [],
      generate([]),
    )

    expect(result.ok).toBe(false)
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      category: 'Unsupported Widgets',
      subject: `Legacy ${type}`,
    }))
  })
})
