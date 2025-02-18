import { useState, useEffect } from 'react';
import driverService from '../services/driverService';
import { useWebSocket } from './useWebSocket';

export const useDriverDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socket = useWebSocket();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await driverService.getDashboardData();
                setData(response);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        // Listen for real-time updates
        if (socket) {
            socket.on('delivery_update', (updatedDelivery) => {
                setData(prev => ({
                    ...prev,
                    activeDelivery: updatedDelivery.id === prev?.activeDelivery?.id 
                        ? updatedDelivery 
                        : prev.activeDelivery,
                    queue: prev.queue.map(d => 
                        d.id === updatedDelivery.id ? updatedDelivery : d
                    )
                }));
            });

            socket.on('new_message', (message) => {
                setData(prev => ({
                    ...prev,
                    messages: [...prev.messages, message]
                }));
            });
        }

        return () => {
            if (socket) {
                socket.off('delivery_update');
                socket.off('new_message');
            }
        };
    }, [socket]);

    const updateDeliveryStatus = async (deliveryId, status, notes) => {
        try {
            const updatedDelivery = await driverService.updateDeliveryStatus(
                deliveryId,
                status,
                notes
            );
            setData(prev => ({
                ...prev,
                activeDelivery: updatedDelivery
            }));
            return updatedDelivery;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return { data, loading, error, updateDeliveryStatus };
}; 