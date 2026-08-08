const item = (id: string, type: ComponentType, x: number, y: number,
  w: number, h: number, children: string): IComponent => ({
  id, parent: 'root', type, props: { positionMode: 'absolute', x, y, w, h, children },
  children: [], rootParentType: type,
})

const field = (id: string, y: number, value: string, componentName: string): IComponent => ({
  id, parent: 'root', type: 'Input', componentName,
  props: { positionMode: 'absolute', x: 315, y, w: 420, h: 34,
    value, isReadOnly: true },
  children: [], rootParentType: 'Input',
})

export const HARDWARE_EXAMPLE_03_PROJECT: IComponents = {
  root: { id: 'root', parent: 'root', type: 'Box',
    props: { backgroundColor: '#121417' }, rootParentType: 'Box',
    children: ['title', 'subtitle', 'device-label', 'device', 'interface-label',
      'interface', 'card-label', 'card', 'uid-label', 'uid', 'count-label', 'count'] },
  title: item('title', 'Heading', 64, 38, 896, 54, 'HARDWARE EXAMPLE 03'),
  subtitle: item('subtitle', 'Text', 66, 96, 896, 36, 'SPI NFC/RFID — PN532'),
  'device-label': item('device-label', 'Text', 110, 190, 180, 34, 'Device'),
  device: field('device', 190, 'INITIALIZING', 'NFC_Device'),
  'interface-label': item('interface-label', 'Text', 110, 244, 180, 34, 'Interface'),
  interface: field('interface', 244, 'SPI', 'NFC_Interface'),
  'card-label': item('card-label', 'Text', 110, 298, 180, 34, 'Card'),
  card: field('card', 298, 'NONE', 'NFC_Card'),
  'uid-label': item('uid-label', 'Text', 110, 352, 180, 34, 'UID'),
  uid: field('uid', 352, '--', 'NFC_UID'),
  'count-label': item('count-label', 'Text', 110, 406, 180, 34, 'Logical reads'),
  count: field('count', 406, '0', 'NFC_Read_Count'),
}

export const HARDWARE_EXAMPLE_03 = {
  id: 'hardware-example-03', number: 3, name: 'SPI NFC/RFID',
  board: 'Waveshare ESP32-P4-WIFI6-Touch-LCD-7B',
  guide: '11.03_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_03__SPI_NFC_RFID.md',
  spi: { mosi: 28, miso: 29, sck: 30, cs: 31, reset: 2, device: 'PN532' },
  status: 'PHYSICALLY PROVEN',
  project: HARDWARE_EXAMPLE_03_PROJECT,
} as const
