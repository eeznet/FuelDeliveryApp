import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

export const useFuelMonitoring = (vehicleId) => {
    const [fuelData, setFuelData] = useState({
        level: 100, // percentage
        range: 0, // kilometers
        alerts: [],
        nearbyStations: []
    });
    const socket = useWebSocket();

    useEffect(() => {
        if (!socket || !vehicleId) return;

        socket.emit('subscribe_fuel', { vehicleId });

        socket.on('fuel_update', (data) => {
            setFuelData(data);
        });

        socket.on('low_fuel_alert', (alert) => {
            setFuelData(prev => ({
                ...prev,
                alerts: [...prev.alerts, alert]
            }));
        });

        socket.on('stations_update', (stations) => {
            setFuelData(prev => ({
                ...prev,
                nearbyStations: stations
            }));
        });

        return () => {
            socket.emit('unsubscribe_fuel', { vehicleId });
            socket.off('fuel_update');
            socket.off('low_fuel_alert');
            socket.off('stations_update');
        };
    }, [socket, vehicleId]);

    return fuelData;
}; 