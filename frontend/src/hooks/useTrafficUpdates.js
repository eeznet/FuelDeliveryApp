import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

export const useTrafficUpdates = (deliveryId) => {
    const [trafficData, setTrafficData] = useState({
        eta: null,
        trafficLevel: 'normal', // 'light', 'normal', 'heavy'
        incidents: [],
        alternateRoutes: []
    });
    const socket = useWebSocket();

    useEffect(() => {
        if (!socket || !deliveryId) return;

        socket.emit('subscribe_traffic', { deliveryId });

        socket.on('traffic_update', (data) => {
            setTrafficData(data);
        });

        socket.on('incident_alert', (incident) => {
            setTrafficData(prev => ({
                ...prev,
                incidents: [...prev.incidents, incident]
            }));
        });

        socket.on('eta_change', (newEta) => {
            setTrafficData(prev => ({
                ...prev,
                eta: newEta
            }));
        });

        return () => {
            socket.emit('unsubscribe_traffic', { deliveryId });
            socket.off('traffic_update');
            socket.off('incident_alert');
            socket.off('eta_change');
        };
    }, [socket, deliveryId]);

    return trafficData;
}; 