export type SensorData = {
  temperature: number;
  humidity: number;
  lightLevel: number;
};

export type DeviceIcon =
  | 'bulb-outline'
  | 'sync-outline'
  | 'lock-closed-outline';

export type Device = {
  id: number;
  name: string;
  type: string;
  icon: DeviceIcon;
  status: boolean;
};

export const initialDevices: Device[] = [
  {
    id: 1,
    name: 'Living Room Light',
    type: 'Smart Light',
    icon: 'bulb-outline',
    status: true,
  },
  {
    id: 2,
    name: 'Bedroom Fan',
    type: 'Smart Fan',
    icon: 'sync-outline',
    status: false,
  },
  {
    id: 3,
    name: 'Front Door Lock',
    type: 'Smart Lock',
    icon: 'lock-closed-outline',
    status: true,
  },
  {
    id: 4,
    name: 'Backyard Lights',
    type: 'Smart Lights',
    icon: 'bulb-outline',
    status: false,
  },
];
