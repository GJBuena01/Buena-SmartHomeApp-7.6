import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    type Device,
    type SensorData,
    initialDevices,
} from '../../models/IoTModels';
import {
    getDevices,
    getSensorData,
    updateDeviceStatus,
} from '../../services/IoTService';

type IoTContextType = {
    devices: Device[];
    sensors: SensorData;
    isLoadingSensors: boolean;
    isLoadingDevices: boolean;
    sensorError: string | null;
    deviceError: string | null;
    gatewayDisconnected: boolean;
    toggleDevice: (id: number, value: boolean) => Promise<void>;
    refreshSensors: () => Promise<void>;
    loadDevices: () => Promise<void>;
    isProcessing: boolean;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [deviceStatus, setDeviceStatus] = useState<Record<number, boolean>>(
        initialDevices.reduce((acc: Record<number, boolean>, device) => {
            acc[device.id] = device.status;
            return acc;
        }, {})
    );

    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingSensors, setIsLoadingSensors] = useState(false);
    const [isLoadingDevices, setIsLoadingDevices] = useState(false);
    const [sensorError, setSensorError] = useState<string | null>(null);
    const [deviceError, setDeviceError] = useState<string | null>(null);
    const [gatewayDisconnected, setGatewayDisconnected] = useState(false);
    const [sensors, setSensors] = useState<SensorData>({
        temperature: 28,
        humidity: 65,
        lightLevel: 720,
    });

    const loadDevices = async () => {
        setIsLoadingDevices(true);
        setDeviceError(null);

        try {
            const devicesFromApi = await getDevices();
            const mappedStatus = devicesFromApi.reduce((acc, device) => {
                acc[device.id] = device.status;
                return acc;
            }, {} as Record<number, boolean>);

            setDeviceStatus(mappedStatus);
            setGatewayDisconnected(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to retrieve devices.';
            setDeviceError(message);
            setGatewayDisconnected(message === 'IoT Gateway is disconnected.' || message.includes('Gateway'));
        } finally {
            setIsLoadingDevices(false);
        }
    };

    const loadInitialData = async () => {
        setIsLoadingDevices(true);
        setIsLoadingSensors(true);
        setSensorError(null);
        setDeviceError(null);

        try {
            const [devicesFromApi, sensorDataFromApi] = await Promise.all([
                getDevices(),
                getSensorData(),
            ]);

            const mappedStatus = devicesFromApi.reduce((acc, device) => {
                acc[device.id] = device.status;
                return acc;
            }, {} as Record<number, boolean>);

            setDeviceStatus(mappedStatus);
            setSensors(sensorDataFromApi);
            setGatewayDisconnected(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to retrieve sensor data.';
            const isGatewayIssue = message.includes('Gateway') || message.includes('disconnected');

            console.warn('Failed to load IoT data', error);
            setGatewayDisconnected(isGatewayIssue);

            if (message.includes('sensor')) {
                setSensorError(message);
            }

            if (message.includes('device') || message.includes('devices')) {
                setDeviceError(message);
            }

            setDeviceStatus(
                initialDevices.reduce((acc, device) => {
                    acc[device.id] = device.status;
                    return acc;
                }, {} as Record<number, boolean>)
            );
        } finally {
            setIsLoadingDevices(false);
            setIsLoadingSensors(false);
        }
    };

    useEffect(() => {
        void loadInitialData();
    }, []);

    const toggleDevice = async (id: number, value: boolean) => {
        setIsProcessing(true);
        setDeviceError(null);

        try {
            const updatedDevice = await updateDeviceStatus(id, value);
            setDeviceStatus((prev) => ({
                ...prev,
                [updatedDevice.id]: updatedDevice.status,
            }));
            setGatewayDisconnected(false);
        } catch (error) {
            const deviceName = initialDevices.find((device) => device.id === id)?.name ?? 'device';
            const message = error instanceof Error ? error.message : `Unable to update ${deviceName}.`;
            setDeviceError(`Unable to update ${deviceName}.`);
            setGatewayDisconnected(message.includes('Gateway') || message.includes('disconnected'));
            console.warn('Failed to update device status', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const refreshSensors = async () => {
        setIsLoadingSensors(true);
        setSensorError(null);

        try {
            const nextSensorData = await getSensorData();
            setSensors(nextSensorData);
            setGatewayDisconnected(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to retrieve sensor data.';
            setSensorError(message);
            setGatewayDisconnected(message.includes('Gateway') || message.includes('disconnected'));
            console.warn('Failed to refresh sensor data', error);
        } finally {
            setIsLoadingSensors(false);
        }
    };

    const updatedDevices: Device[] = initialDevices.map((device) => ({
        ...device,
        status: deviceStatus[device.id],
    }));

    return (
        <IoTContext.Provider
            value={{
                devices: updatedDevices,
                sensors,
                isLoadingSensors,
                isLoadingDevices,
                sensorError,
                deviceError,
                gatewayDisconnected,
                toggleDevice,
                refreshSensors,
                loadDevices,
                isProcessing,
            }}
        >
            {children}
        </IoTContext.Provider>
    );
}

export function useIoT() {
    const context = useContext(IoTContext);

    if (!context) {
        throw new Error('useIoT must be used inside IoTProvider');
    }

    return context;
}