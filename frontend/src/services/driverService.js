import api from '../config/axios';
import { errorHandler } from '../utils/errorHandler';

export const driverService = {
    // Dashboard Data
    getDashboardData: async () => {
        const response = await api.get('/driver/dashboard');
        return response.data;
    },

    // Deliveries
    getActiveDelivery: async () => {
        const response = await api.get('/driver/deliveries/active');
        return response.data;
    },

    getDeliveryQueue: async () => {
        const response = await api.get('/driver/deliveries/queue');
        return response.data;
    },

    getDeliveryHistory: async () => {
        const response = await api.get('/driver/deliveries/history');
        return response.data;
    },

    updateDeliveryStatus: async (deliveryId, status, notes) => {
        try {
            return await errorHandler.retry(async () => {
                const response = await api.put(`/driver/deliveries/${deliveryId}/status`, {
                    status,
                    notes
                });
                return response.data;
            });
        } catch (error) {
            errorHandler.handle(error, {
                showToast: true,
                retry: () => driverService.updateDeliveryStatus(deliveryId, status, notes)
            });
            throw error;
        }
    },

    // Messages
    getMessages: async (recipient) => {
        const response = await api.get(`/driver/messages/${recipient}`);
        return response.data;
    },

    sendMessage: async (messageData) => {
        const response = await api.post('/driver/messages', messageData);
        return response.data;
    },

    markMessageAsRead: async (messageId) => {
        const response = await api.put(`/driver/messages/${messageId}/read`);
        return response.data;
    },

    // Stats
    getStats: async () => {
        const response = await api.get('/driver/stats');
        return response.data;
    },

    // Location Updates
    updateLocation: async (location) => {
        try {
            return await errorHandler.retry(async () => {
                const response = await api.post('/driver/location', location);
                return response.data;
            });
        } catch (error) {
            errorHandler.handle(error, {
                showToast: false, // Don't show toast for location updates
                retry: () => driverService.updateLocation(location)
            });
            throw error;
        }
    }
};

export default driverService; 