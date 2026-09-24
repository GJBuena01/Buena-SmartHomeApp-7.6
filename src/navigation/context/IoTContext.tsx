import React, {
    createContext,
    useContext,
    useState,
} from 'react';

import {
    type Device,
    type SensorData,
    initialDevices,
} from '../../models/IoTModels';

type IoTContextType = {
    devices: Device[];
    sensors: SensorData;
    updateSensors: (nextSensors: Partial<SensorData>) => void;
    toggleDevice: (id: number, value: boolean) => void;
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

    const toggleDevice = (id: number, value: boolean) => {
        setIsProcessing(true);

        setTimeout(() => {
            setDeviceStatus((prev) => ({
                ...prev,
                [id]: value,
            }));
            setIsProcessing(false);
        }, 800);
    };

    const updateSensors = (nextSensors: Partial<SensorData>) => {
        setSensors((prev) => ({
            ...prev,
            ...nextSensors,
        }));
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
                updateSensors,
                toggleDevice,
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