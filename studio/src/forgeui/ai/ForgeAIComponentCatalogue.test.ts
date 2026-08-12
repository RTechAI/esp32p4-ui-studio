import {
  componentsList,
  futureUnregisteredWidgetTypes,
} from '~componentsList'
import {
  forgeAIComponentCatalogue,
  forgeAIIntentionalExclusions,
  forgeAIVisibleComponents,
  resolveForgeAIComponentType,
  validateForgeAIComponentCatalogue,
} from './ForgeAIComponentCatalogue'
import {
  buildForgeAIAllAssetsCoverageFixture,
  forgeAIRepresentativeLayouts,
} from './ForgeAIAllAssetsCoverage'
import { parseForgeAIResponse } from './ForgeAIParser'
import { buildForgeUILayoutSystemPrompt } from './ForgeAIPrompts'
import fs from 'fs'
import path from 'path'

describe('ForgeUI AI component catalogue', () => {
  it('accounts for every palette component exactly once', () => {
    expect(validateForgeAIComponentCatalogue()).toEqual([])
    expect(
      forgeAIComponentCatalogue.length + forgeAIIntentionalExclusions.length,
    ).toBe(componentsList.length)
  })

  it('guards every AI-visible type with real preview and LVGL exporter cases', () => {
    const previewSource = fs.readFileSync(
      path.join(process.cwd(), 'src/forgeui/preview/forgePreviewRenderer.tsx'),
      'utf8',
    )
    const exporterSource = fs.readFileSync(
      path.join(process.cwd(), 'src/forgeui/ForgeUILvglExport.ts'),
      'utf8',
    )
    forgeAIVisibleComponents.forEach(type => {
      expect(previewSource).toContain(`case '${type}'`)
      expect(exporterSource).toContain(`case '${type}'`)
    })
  })

  it('includes repaired Standard components and resolves aliases canonically', () => {
    expect(forgeAIVisibleComponents).toEqual(expect.arrayContaining([
      'NumberInput', 'Radio', 'Divider', 'Select', 'CircularProgress',
    ]))
    expect(resolveForgeAIComponentType('number input')).toBe('NumberInput')
    expect(resolveForgeAIComponentType('dropdown')).toBe('Select')
  })

  it('keeps explicit reasons for intentionally unsupported palette entries', () => {
    expect(forgeAIIntentionalExclusions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'Spinner', reason: expect.any(String) }),
      expect.objectContaining({ type: 'Accordion', reason: expect.any(String) }),
    ]))
    expect(futureUnregisteredWidgetTypes).toEqual(new Set([
      'Lottie',
      'ObjxTempl',
      'Editable',
    ]))
  })

  it('places every AI-visible component exactly once in All Assets Coverage', () => {
    const types = buildForgeAIAllAssetsCoverageFixture()
      .flatMap(document => document.layout.map(item => item.type))
    expect(types).toHaveLength(forgeAIVisibleComponents.length)
    expect(new Set(types).size).toBe(types.length)
    expect(new Set(types)).toEqual(new Set(forgeAIVisibleComponents))
  })

  it('parses the representative form, dashboard and navigation fixtures', () => {
    forgeAIRepresentativeLayouts.forEach(document => {
      expect(parseForgeAIResponse(
        JSON.stringify(document),
        forgeAIVisibleComponents,
      ).layout).toHaveLength(document.layout.length)
    })
  })

  it('normalizes value controls and rejects unsupported components', () => {
    const parsed = parseForgeAIResponse(JSON.stringify({
      layout: [{
        type: 'number input',
        props: { x: 0, y: 0, w: 180, h: 56, min: 10, max: 20, value: 99, step: 0 },
      }],
    }), forgeAIVisibleComponents)
    expect(parsed.layout[0]).toMatchObject({
      type: 'NumberInput',
      props: { min: 10, max: 20, value: 20, step: 1 },
    })
    expect(() => parseForgeAIResponse(JSON.stringify({
      layout: [{ type: 'Accordion', props: {} }],
    }), forgeAIVisibleComponents)).toThrow('Unsupported component')
  })

  it('preserves AI text semantics and stable component names over catalogue defaults', () => {
    const parsed = parseForgeAIResponse(JSON.stringify({
      layout: [
        {
          type: 'Heading',
          componentName: 'Weather_Location',
          props: { children: 'TAURANGA' },
        },
        {
          type: 'Text',
          props: {
            componentName: 'Weather_Temperature',
            children: '18°',
          },
        },
        {
          type: 'Icon',
          componentName: 'Forecast_Day1_Icon',
          props: { iconName: 'FiSun' },
        },
        {
          type: 'Icon',
          componentName: 'Forecast_Day3_Icon',
          props: { iconName: 'FiCloudRain' },
        },
      ],
    }), forgeAIVisibleComponents)

    expect(parsed.layout[0]).toMatchObject({
      componentName: 'Weather_Location',
      props: { headingText: 'TAURANGA' },
    })
    expect(parsed.layout[1]).toMatchObject({
      componentName: 'Weather_Temperature',
      props: { textValue: '18°' },
    })
    expect(parsed.layout.map(item => item.props.iconName).filter(Boolean))
      .toEqual(['FiSun', 'FiCloudRain'])
    expect(parsed.layout[0].props.headingText).not.toBe('Heading title')
    expect(parsed.layout[1].props.textValue).not.toBe('Text value')
  })

  it('propagates only exact export-ready asset IDs', () => {
    const document = JSON.stringify({
      layout: [{
        type: 'InteractiveButton',
        props: {
          x: 0, y: 0, w: 120, h: 60,
          interactiveAssetId: 'project-button',
        },
      }],
    })
    expect(parseForgeAIResponse(
      document,
      forgeAIVisibleComponents,
      1024,
      600,
      [{ id: 'project-button', kind: 'button', exportReady: true }],
    ).layout[0].props.interactiveAssetId).toBe('project-button')
    expect(() => parseForgeAIResponse(
      document,
      forgeAIVisibleComponents,
      1024,
      600,
      [{ id: 'project-button', kind: 'light', exportReady: true }],
    )).toThrow('requires an exact export-ready')
  })

  it('puts catalogue and asset constraints in the live system prompt', () => {
    const prompt = buildForgeUILayoutSystemPrompt({
      supportedComponents: forgeAIVisibleComponents,
      componentCatalogue: forgeAIComponentCatalogue,
      availableAssets: [{
        id: 'asset-1',
        name: 'Status light',
        kind: 'light',
        exportReady: true,
      }],
      screenWidth: 1024,
      screenHeight: 600,
    })
    expect(prompt).toContain('AUTHORITATIVE COMPONENT CATALOGUE')
    expect(prompt).toContain('"asset-1"')
    expect(prompt).toContain('Never invent asset IDs')
    expect(prompt).toContain('Exactly one landscape screen')
    expect(prompt).toContain('Choose only components that directly support')
    expect(prompt).toContain('SOFT COMPONENT BUDGET FOR NORMAL SCREENS')
    expect(prompt).toContain('Do not return or serialize this planning text')
  })
})
