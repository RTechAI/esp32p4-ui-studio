const item = (id: string, type: ComponentType, x: number, y: number,
  w: number, h: number, children: string, componentName?: string): IComponent => ({
  id, parent: 'root', type, componentName,
  props: { positionMode: 'absolute', x, y, w, h, children },
  children: [], rootParentType: type,
})

const field = (id: string, x: number, y: number, label: string,
  value: string, componentName: string): IComponent[] => [
  item(`${id}-label`, 'Text', x, y, 170, 34, label),
  item(id, 'Text', x + 180, y, 240, 34, value, componentName),
]

const fields = [
  ...field('gps-uart', 90, 190, 'Receiver', 'ALIVE', 'GPS_UART'),
  ...field('gps-nmea', 90, 235, 'NMEA', 'WAITING', 'GPS_NMEA'),
  ...field('gps-fix', 90, 280, 'Fix', 'NO FIX', 'GPS_Fix'),
  ...field('gps-satellites', 90, 325, 'Satellites', '0', 'GPS_Satellites'),
  item('gps-rx-label', 'Text', 90, 370, 170, 34, 'UART RX'),
  item('gps-rx', 'Text', 270, 370, 240, 34, 'GPIO3'),
  item('gps-tx-label', 'Text', 90, 415, 170, 34, 'UART TX'),
  item('gps-tx', 'Text', 270, 415, 240, 34, 'GPIO4'),
  ...field('gps-latitude', 530, 190, 'Latitude', '--', 'GPS_Latitude'),
  ...field('gps-longitude', 530, 235, 'Longitude', '--', 'GPS_Longitude'),
  ...field('gps-altitude', 530, 280, 'Altitude', '--', 'GPS_Altitude'),
  ...field('gps-speed', 530, 325, 'Speed', '--', 'GPS_Speed'),
  ...field('gps-hdop', 530, 370, 'HDOP', '--', 'GPS_HDOP'),
  ...field('gps-utc', 530, 415, 'UTC', '--', 'GPS_UTC'),
]

export const HARDWARE_EXAMPLE_05_PROJECT: IComponents = {
  root: {
    id: 'root', parent: 'root', type: 'Box',
    props: { backgroundColor: '#101820' }, rootParentType: 'Box',
    children: ['example-brand', 'example-title', 'receiver-title',
      ...fields.map(component => component.id)],
  },
  'example-brand': item('example-brand', 'Heading', 64, 30, 896, 46, 'FORGEUI'),
  'example-title': item('example-title', 'Text', 66, 82, 896, 38,
    'Hardware Example 05 — GPS / GNSS'),
  'receiver-title': item('receiver-title', 'Heading', 90, 135, 840, 42,
    'GPS Receiver'),
}

fields.forEach(component => {
  HARDWARE_EXAMPLE_05_PROJECT[component.id] = component
})

export const HARDWARE_EXAMPLE_05 = {
  id: 'hardware-example-05', number: 5, name: 'UART GPS / GNSS',
  board: 'Waveshare ESP32-P4-WIFI6-Touch-LCD-7B',
  guide: '11.05_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_05__GPS_GNSS.md',
  device: 'u-blox NEO-8 GPS/GNSS',
  uart: { controller: 1, p4Txd: 4, p4Rxd: 3, baud: 9600, format: '8N1' },
  status: 'PHYSICALLY PROVEN',
  project: HARDWARE_EXAMPLE_05_PROJECT,
} as const
