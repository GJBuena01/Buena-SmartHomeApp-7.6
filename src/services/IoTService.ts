import { initialDevices, type Device, type SensorData } from '../models/IoTModels';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const devicesStore: Device[] = initialDevices.map((device) => ({ ...device }));

const sensorStore: SensorData = {
  temperature: 28,
  humidity: 65,
  lightLevel: 720,
};

const maybeFail = (message: string, failRate = 0.3) => {
  if (Math.random() < failRate) {
    const gatewayFailure = Math.random() < 0.5;
    throw new Error(gatewayFailure ? 'IoT Gateway is disconnected.' : message);
  }
};

export async function getSensorData(): Promise<SensorData> {
  await delay(1500);
  maybeFail('Unable to retrieve sensor data.');

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
  maybeFail('Unable to retrieve devices.');

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
