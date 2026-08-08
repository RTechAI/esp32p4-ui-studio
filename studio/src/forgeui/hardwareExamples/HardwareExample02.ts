const item = (id: string, type: ComponentType, x: number, y: number,
  w: number, h: number, children: string, componentName?: string): IComponent => ({
  id, parent: 'root', type, componentName,
  props: { positionMode: 'absolute', x, y, w, h, children },
  children: [], rootParentType: type,
})

const field = (id: string, y: number, value: string, componentName: string): IComponent => ({
  id, parent: 'root', type: 'Input', componentName,
  props: { positionMode: 'absolute', x: 110, y, w: 330, h: 26,
    value, isReadOnly: true },
  children: [], rootParentType: 'Input',
})

export const HARDWARE_EXAMPLE_02_PROJECT: IComponents = {
  root: {
    id: 'root', parent: 'root', type: 'Box',
    props: { backgroundColor: '#121417' }, rootParentType: 'Box',
    children: [
      'example-title', 'example-subtitle',
      'fram-title', 'fram-status', 'fram-address', 'fram-value', 'fram-verify',
      'fram-write', 'fram-read',
    ],
  },
  'example-title': item('example-title', 'Heading', 64, 38, 896, 54,
    'HARDWARE EXAMPLE 02'),
  'example-subtitle': item('example-subtitle', 'Text', 66, 96, 896, 36,
    'I²C FRAM PERSISTENCE'),
  'fram-title': item('fram-title', 'Heading', 90, 170, 520, 40,
    'FRAM MEMORY — MB85RC256V'),
  'fram-status': field('fram-status', 230, 'DISCOVERING', 'FRAM_Status'),
  'fram-address': field('fram-address', 280, '--', 'FRAM_Address'),
  'fram-value': field('fram-value', 330, '---- / ----', 'FRAM_Value'),
  'fram-verify': field('fram-verify', 380, 'NOT RUN', 'FRAM_Verify'),
  'fram-write': item('fram-write', 'Button', 560, 250, 170, 64,
    'WRITE TEST', 'WRITE_TEST'),
  'fram-read': item('fram-read', 'Button', 760, 250, 170, 64,
    'READ TEST', 'READ_TEST'),
}

export const HARDWARE_EXAMPLE_02 = {
  id: 'hardware-example-02', number: 2, name: 'I²C FRAM Persistence',
  board: 'Waveshare ESP32-P4-WIFI6-Touch-LCD-7B',
  guide: '11.02_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_02__I2C_FRAM.md',
  i2c: { sda: 7, scl: 8, address: 0x50, device: 'MB85RC256V' },
  status: 'PHYSICALLY PROVEN', project: HARDWARE_EXAMPLE_02_PROJECT,
} as const
