import { initialDevices, type Device, type SensorData } from '../models/IoTModels';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const devicesStore: Device[] = initialDevices.map((device) => ({ ...device }));

const sensorStore: SensorData = {
  temperature: 28,
  humidity: 65,
  lightLevel: 720,
};

const maybeFail = (message: string) => {
  if (Math.random() < 0.2) {
    throw new Error(message);
  }
};

export async function getSensorData(): Promise<SensorData> {
  await delay(1500);
  maybeFail('Unable to fetch sensor data from the IoT backend.');

  const nextData: SensorData = {
    temperature: 24 + Math.floor(Math.random() * 8),
    humidity: 50 + Math.floor(Math.random() * 25),
    lightLevel: 600 + Math.floor(Math.random() * 450),
  };

  Object.assign(sensorStore, nextData);

  return { ...sensorStore };
}

export async function getDevices(): Promise<Device[]> {
  await delay(1000);
  maybeFail('Unable to fetch devices from the IoT backend.');

  return devicesStore.map((device) => ({ ...device }));
}

export async function updateDeviceStatus(
  id: number,
  status: boolean,
): Promise<Device> {
  await delay(800);
  maybeFail('Unable to update device status.');

  const device = devicesStore.find((item) => item.id === id);

  if (!device) {
    throw new Error(`Device ${id} was not found.`);
  }

  device.status = status;

  return { ...device };
}
