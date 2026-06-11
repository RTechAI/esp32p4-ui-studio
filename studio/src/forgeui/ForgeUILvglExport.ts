// const ACTIVE_BACKGROUND_FLAVOUR = 'reactor_dark'
// const ACTIVE_BACKGROUND_FLAVOUR = 'nordic_blue'
import { forgeUIGetUploadedAssets } from './ForgeUIUploadedAssetRegistry'
import { FORGEUI_IMAGE_ASSETS } from './ForgeUIAssetRegistry'
const ACTIVE_BACKGROUND_FLAVOUR = 'graphite'

const FG_PALETTES: Record<string, any> = {
  reactor_dark: {
    name: 'Reactor Dark',

    bg: '0x08111F',

    surface: '0x101B2B',
    surface2: '0x162436',

    border: '0x42E8FF',

    text: '0xFFFFFF',

    accent: '0x42E8FF',
  },

  graphite: {
    name: 'Carbon Graphite',

    bg: '0x121417',

    surface: '0x1E2328',
    surface2: '0x2A3138',

    border: '0xF2A900',

    text: '0xF5F5F5',

    accent: '0xF2A900',
  },

  nordic_blue: {
    name: 'Nordic Blue',

    bg: '0xDDE7EF',

    surface: '0xF4F8FB',
    surface2: '0xD7E5EF',

    border: '0x1B6CA8',

    text: '0x102030',

    accent: '0x1B6CA8',
  },

  military_green: {
    name: 'Military Green',

    bg: '0x1B2416',

    surface: '0x2D3A25',
    surface2: '0x3D4D33',

    border: '0x84CC16',

    text: '0xF7FEE7',

    accent: '0x84CC16',
  },

  cyber_teal: {
    name: 'Cyber Teal',

    bg: '0x071A1D',

    surface: '0x0F2A30',
    surface2: '0x153942',

    border: '0x14B8A6',

    text: '0xCCFBF1',

    accent: '0x14B8A6',
  },

  forge_orange: {
    name: 'Forge Orange',

    bg: '0x1A120B',

    surface: '0x2B1D14',
    surface2: '0x3A281D',

    border: '0xF97316',

    text: '0xFFF7ED',

    accent: '0xF97316',
  },

  nebula_purple: {
    name: 'Nebula Purple',

    bg: '0x140F1F',

    surface: '0x221A33',
    surface2: '0x302347',

    border: '0xA855F7',

    text: '0xF3E8FF',

    accent: '0xA855F7',
  },

  oled_black: {
    name: 'OLED Black',

    bg: '0x000000',

    surface: '0x0A0A0A',
    surface2: '0x1A1A1A',

    border: '0xFFFFFF',

    text: '0xFFFFFF',

    accent: '0xFFFFFF',
  },

  matrix_green: {
    name: 'Matrix Green',

    bg: '0x000A00',

    surface: '0x001A00',
    surface2: '0x003300',

    border: '0x00FF66',

    text: '0xCCFFDD',

    accent: '0x00FF66',
  },

  carbon_red: {
    name: 'Carbon Red',

    bg: '0x140809',

    surface: '0x2A1012',
    surface2: '0x3A181C',

    border: '0xEF4444',

    text: '0xFEE2E2',

    accent: '0xEF4444',
  },

  arctic_ice: {
    name: 'Arctic Ice',

    bg: '0xE6F4F9',

    surface: '0xF8FCFE',
    surface2: '0xDDEEF5',

    border: '0x38BDF8',

    text: '0x082F49',

    accent: '0x38BDF8',
  },

  industrial_steel: {
    name: 'Industrial Steel',

    bg: '0x1F2937',

    surface: '0x374151',
    surface2: '0x4B5563',

    border: '0x9CA3AF',

    text: '0xF3F4F6',

    accent: '0x9CA3AF',
  },

  lava_core: {
    name: 'Lava Core',

    bg: '0x140404',

    surface: '0x260909',
    surface2: '0x3A1010',

    border: '0xFF4500',

    text: '0xFFE5D9',

    accent: '0xFF4500',
  },

  blueprint: {
    name: 'Blueprint',

    bg: '0x0A1A33',

    surface: '0x10264A',
    surface2: '0x18345F',

    border: '0x60A5FA',

    text: '0xDBEAFE',

    accent: '0x60A5FA',
  },

  toxic_lime: {
    name: 'Toxic Lime',

    bg: '0x101A00',

    surface: '0x1F2D00',
    surface2: '0x2E4200',

    border: '0xA3E635',

    text: '0xF7FEE7',

    accent: '0xA3E635',
  },
}

const lv = (v: any, d: any = 0) =>
  v !== undefined && v !== null && v !== '' ? v : d

const esc = (v: string = '') =>
  String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')

const buildLvglBlock = (
  component: IComponent,
  components: IComponents,
  parentVar: string,
  lines: string[],
  counter: { value: number },
  palette: any,
  usedAssetSources: Set<string>
) => {
  ;(component.children || []).forEach((key: string) => {
    const child = components[key]
    if (!child) return

    counter.value++
    const varName = `obj${counter.value}`

    const x = lv(child.props.x, 0)
    const y = lv(child.props.y, 0)
    const w = lv(child.props.w, 120)
    const h = lv(child.props.h, 40)

    switch (child.type) {
      case 'Text': {
        const text = esc(
          child.props.children ||
            child.props.text ||
            child.props.value ||
            'Text'
        )

        const color = child.props.color
          ? `0x${String(child.props.color).replace('#', '')}`
          : palette.text

        const fontSize = lv(child.props.fontSize, 24)

        lines.push(`lv_obj_t * ${varName} = lv_label_create(${parentVar});`)
        lines.push(`lv_label_set_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${color}), 0);`)
        lines.push(`lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_${fontSize}, 0);`)
        lines.push(``)
        break
      }
      
            case 'Button': {
        const text = esc(
          child.props.children ||
            child.props.text ||
            child.props.label ||
            'Button'
        )

        lines.push(`lv_obj_t * ${varName} = lv_button_create(${parentVar});`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

        lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
        lines.push(`lv_label_set_text(${varName}_label, "${text}");`)
        lines.push(`lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_center(${varName}_label);`)
        lines.push(``)
        break
      }

            case 'Input': {
        const text = esc(child.props.placeholder || child.props.value || 'Input')

        lines.push(`lv_obj_t * ${varName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_one_line(${varName}, true);`)
        lines.push(`lv_textarea_set_placeholder_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(``)
        break
      }

      case 'Textarea': {
        const text = esc(child.props.placeholder || child.props.value || 'Textarea')

        lines.push(`lv_obj_t * ${varName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_placeholder_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(``)
        break
      }
      
      case 'Switch': {
  const checked = Boolean(child.props.isChecked)

  lines.push(`lv_obj_t * ${varName} = lv_switch_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  if (checked) {
    lines.push(`lv_obj_add_state(${varName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.text}), LV_PART_KNOB);`)
  lines.push(``)
  break
}

      case 'Checkbox': {
  const text = esc(
    child.props.children ||
      child.props.text ||
      child.props.label ||
      'Checkbox'
  )

  const checked = Boolean(child.props.isChecked)

  lines.push(`lv_obj_t * ${varName} = lv_checkbox_create(${parentVar});`)
  lines.push(`lv_checkbox_set_text(${varName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)

  if (checked) {
    lines.push(`lv_obj_add_state(${varName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(``)
  break
}

        case 'Radio': {
  const text = esc(
    child.props.children ||
      child.props.text ||
      child.props.label ||
      'Radio'
  )

  const checked = Boolean(child.props.isChecked)

  lines.push(`lv_obj_t * ${varName} = lv_checkbox_create(${parentVar});`)
  lines.push(`lv_checkbox_set_text(${varName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)

  if (checked) {
    lines.push(`lv_obj_add_state(${varName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_radius(${varName}, LV_RADIUS_CIRCLE, LV_PART_INDICATOR);`)

  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)

  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_INDICATOR);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)

  lines.push(``)
  break
}         
        
      case 'NumberInput': {
        const text = esc(String(child.props.value || '123'))

        lines.push(`lv_obj_t * ${varName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_one_line(${varName}, true);`)
        lines.push(`lv_textarea_set_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(``)
        break
      }

      case 'Select': {
  lines.push(`lv_obj_t * ${varName} = lv_dropdown_create(${parentVar});`)
  lines.push(`lv_dropdown_set_options(${varName}, "Option 1\\nOption 2\\nOption 3");`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

  lines.push(``)
  break
}

case 'Image': {
  const src = child.props.src || ''
  const uploadedAssets = forgeUIGetUploadedAssets()

  console.log('LVGL EXPORT IMAGE DEBUG', {
  src,
  alt: child.props.alt,
  assetName: child.props.assetName,
  uploadedAssets,
})

  const presetAsset = FORGEUI_IMAGE_ASSETS.find(
    (a: any) => a.src === src
  )

  const uploadedAsset = uploadedAssets.find((a: any) =>
  a.id === child.props.uploadedAssetId ||
  a.browserSrc === src ||
  a.browserSrc === child.props.src ||
  a.name === child.props.assetName ||
  a.name === child.props.alt
)

  const asset: any = presetAsset || uploadedAsset

  if (asset?.lvgl || asset?.symbolName) {
    const symbol = asset.lvgl || asset.symbolName
    const cFile = asset.cFile || asset.assetSource

    if (cFile) {
      usedAssetSources.add(cFile)
    }

    const imageScale = Number(child.props.imageScale || 256)

    lines.push(`LV_IMAGE_DECLARE(${symbol});`)
    lines.push(`lv_obj_t * ${varName} = lv_image_create(${parentVar});`)
    lines.push(`lv_image_set_src(${varName}, &${symbol});`)
    lines.push(`lv_image_set_scale(${varName}, ${imageScale});`)
  } else {
    const uploadName = esc(
      child.props.alt ||
      child.props.assetName ||
      'Uploaded Asset'
    )

    lines.push(`lv_obj_t * ${varName} = lv_button_create(${parentVar});`)
    lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
    lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, 0);`)
    lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
    lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

    lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
    lines.push(`lv_label_set_text(${varName}_label, "${uploadName}\\nPending LVGL Export");`)
    lines.push(`lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.text}), 0);`)
    lines.push(`lv_obj_set_style_text_align(${varName}_label, LV_TEXT_ALIGN_CENTER, 0);`)
    lines.push(`lv_obj_center(${varName}_label);`)
  }

  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_add_flag(${varName}, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_set_style_transform_pivot_x(${varName}, ${Math.floor(w / 2)}, 0);`)
  lines.push(`lv_obj_set_style_transform_pivot_y(${varName}, ${Math.floor(h / 2)}, 0);`)
  lines.push(`lv_obj_set_style_transform_scale(${varName}, 256, 0);`)
  lines.push(`lv_obj_set_style_transform_scale(${varName}, 235, LV_STATE_PRESSED);`)

  lines.push(``)
  break
}
    
case 'Slider': {
  lines.push(`lv_obj_t * ${varName} = lv_slider_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_slider_set_value(${varName}, ${lv(child.props.value, 50)}, LV_ANIM_OFF);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.text}), LV_PART_KNOB);`)
  lines.push(``)
  break
}

case 'Progress': {
  lines.push(`lv_obj_t * ${varName} = lv_bar_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_bar_set_range(${varName}, 0, 100);`)
  lines.push(`lv_bar_set_value(${varName}, ${lv(child.props.value, 65)}, LV_ANIM_OFF);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(``)
  break
}

case 'CircularProgress': {
  lines.push(`lv_obj_t * ${varName} = lv_arc_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_arc_set_range(${varName}, 0, 100);`)
  lines.push(`lv_arc_set_value(${varName}, ${lv(child.props.value, 65)});`)
  lines.push(`lv_obj_set_style_arc_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_arc_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.bg}), LV_PART_KNOB);`)
  lines.push(``)
  break
}

      case 'Box':
        lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_80, 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)
        lines.push(``)
        break

        default:
        break
    }

        if (child.children?.length) {
      buildLvglBlock(
        child,
        components,
        varName,
        lines,
        counter,
        palette,
        usedAssetSources
      )
    }
  })
}

export const generateForgeUILvglCode = (
  components: IComponents,
  themeId: string = 'graphite',
) => {
  const lines: string[] = []
  const usedAssetSources = new Set<string>()

  const palette =
    FG_PALETTES[themeId] || FG_PALETTES.reactor_dark

  lines.push(`#include "90_Studio_Export.h"`)
  lines.push(`#include "lvgl.h"`)
  lines.push(``)
  lines.push(`// ForgeUI LVGL Export Proof V1`)
  lines.push(`// Generated from ForgeUI Studio`)
  lines.push(``)
  lines.push(`void fg_studio_export_create(lv_obj_t *parent)`)
  lines.push(`{`)
  lines.push(`    // Background flavour: ${palette.name}`)
  lines.push(`    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(${palette.bg}), 0);`)
  lines.push(`    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);`)
  lines.push(`    lv_obj_set_style_bg_color(parent, lv_color_hex(${palette.bg}), 0);`)
  lines.push(`    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);`)
  lines.push(``)

  const body: string[] = []

  const root =
    components.root ||
    Object.values(components).find((c: any) => c.parent === c.id) ||
    Object.values(components)[0]

  if (root) {
    buildLvglBlock(
      root,
      components,
      'parent',
      body,
      { value: 0 },
      palette,
      usedAssetSources
    )
  }

  body.forEach(line => {
    lines.push(line ? `    ${line}` : ``)
  })

  lines.push(`}`)

  return {
    code: lines.join('\n'),
    assetSources: Array.from(usedAssetSources),
  }
}
