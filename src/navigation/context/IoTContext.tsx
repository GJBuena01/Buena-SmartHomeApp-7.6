import React, {
    createContext,
    useContext,
    useState,
} from 'react';

type SensorData = {
    temperature: number;
    humidity: number;
    lightLevel: number;
};

const devices = [
    {
        id: 1,
        name: 'Living Room Light',
        type: 'Smart Light',
        icon: 'bulb-outline' as const,
        status: true,
    },
    {
        id: 2,
        name: 'Bedroom Fan',
        type: 'Smart Fan',
        icon: 'sync-outline' as const,
        status: false,
    },
    {
        id: 3,
        name: 'Front Door Lock',
        type: 'Smart Lock',
        icon: 'lock-closed-outline' as const,
        status: true,
    },
    {
        id: 4,
        name: 'Backyard Lights',
        type: 'Smart Lights',
        icon: 'bulb-outline' as const,
        status: false,
    },
    {
        id: 5,
        name: 'Garage Door',
        type: 'Smart Garage Door',
        icon: 'home-outline' as const,
        status: true,
    },

];

type IoTContextType = {
    devices: typeof devices;
    sensors: SensorData;
    toggleDevice: (id: number, value: boolean) => void;
};

const IoTContext = createContext<IoTContextType | undefined>(
    undefined
);

export function IoTProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [deviceStatus, setDeviceStatus] = useState(
        devices.reduce((acc, device) => {
            acc[device.id] = device.status;

            return acc;
        }, {} as Record<number, boolean>)
    );

    const toggleDevice = (
        id: number,
        value: boolean
    ) => {

        setDeviceStatus({
            ...deviceStatus,
            [id]: value,
        });

    };

    const updatedDevices = devices.map((device) => ({
        ...device,
        status: deviceStatus[device.id],
    }));

    const sensors: SensorData = {
        temperature: 100,
        humidity: 99,
        lightLevel: 1000,
    };

    return (
        <IoTContext.Provider
            value={{
                devices: updatedDevices,
                sensors,
                toggleDevice,
            }}
        >
            {children}
        </IoTContext.Provider>
    );
}

export function useIoT() {

    const context = useContext(IoTContext);

    if (!context) {
        throw new Error(
            'useIoT must be used inside IoTProvider'
        );
    }

    return context;
}