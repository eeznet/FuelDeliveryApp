import { useState, useEffect, useCallback } from 'react';
import clientService from '../services/clientService';
import { useWebSocket } from './useWebSocket';

export const useClientDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socket = useWebSocket();

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await clientService.getDashboardData();
            setData(response);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        if (socket) {
            // Listen for order status updates
            socket.on('order_status_update', (updatedOrder) => {
                setData(prev => ({
                    ...prev,
                    orders: prev.orders.map(order =>
                        order.id === updatedOrder.id ? updatedOrder : order
                    )
                }));
            });

            // Listen for new messages
            socket.on('new_message', (message) => {
                setData(prev => ({
                    ...prev,
                    messages: [...prev.messages, message]
                }));
            });

            // Listen for billing updates
            socket.on('billing_update', (billingData) => {
                setData(prev => ({
                    ...prev,
                    billing: {
                        ...prev.billing,
                        ...billingData
                    }
                }));
            });
        }

        return () => {
            if (socket) {
                socket.off('order_status_update');
                socket.off('new_message');
                socket.off('billing_update');
            }
        };
    }, [socket]);

    const createOrder = useCallback(async (orderData) => {
        try {
            const newOrder = await clientService.createOrder(orderData);
            setData(prev => ({
                ...prev,
                orders: [newOrder, ...prev.orders]
            }));
            return newOrder;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const updateProfile = useCallback(async (profileData) => {
        try {
            const updatedProfile = await clientService.updateProfile(profileData);
            setData(prev => ({
                ...prev,
                profile: updatedProfile
            }));
            return updatedProfile;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        data,
        loading,
        error,
        createOrder,
        updateProfile,
        refresh: fetchDashboardData
    };
}; 