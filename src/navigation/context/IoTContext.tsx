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
    toggleDevice: (id: number, value: boolean) => Promise<void>;
    refreshSensors: () => Promise<void>;
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
    const [sensors, setSensors] = useState<SensorData>({
        temperature: 28,
        humidity: 65,
        lightLevel: 720,
    });

    const loadInitialData = async () => {
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
        } catch (error) {
            console.warn('Failed to load IoT data', error);
            setDeviceStatus(
                initialDevices.reduce((acc, device) => {
                    acc[device.id] = device.status;
                    return acc;
                }, {} as Record<number, boolean>)
            );
        }
    };

    useEffect(() => {
        void loadInitialData();
    }, []);

    const toggleDevice = async (id: number, value: boolean) => {
        setIsProcessing(true);

        try {
            const updatedDevice = await updateDeviceStatus(id, value);
            setDeviceStatus((prev) => ({
                ...prev,
                [updatedDevice.id]: updatedDevice.status,
            }));
        } catch (error) {
            console.warn('Failed to update device status', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const refreshSensors = async () => {
        try {
            const nextSensorData = await getSensorData();
            setSensors(nextSensorData);
        } catch (error) {
            console.warn('Failed to refresh sensor data', error);
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
                toggleDevice,
                refreshSensors,
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