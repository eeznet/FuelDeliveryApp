import api from '../config/axios';
import { errorHandler } from '../utils/errorHandler';

export const clientService = {
    // Dashboard Data
    getDashboardData: async () => {
        const response = await api.get('/client/dashboard');
        return response.data;
    },

    // Orders
    getOrders: async () => {
        const response = await api.get('/client/orders');
        return response.data;
    },

    createOrder: async (orderData) => {
        try {
            return await errorHandler.retry(async () => {
                const response = await api.post('/client/orders', orderData);
                return response.data;
            });
        } catch (error) {
            errorHandler.handle(error, {
                showToast: true,
                retry: () => clientService.createOrder(orderData)
            });
            throw error;
        }
    },

    // Messages
    getMessages: async (recipient) => {
        const response = await api.get(`/client/messages/${recipient}`);
        return response.data;
    },

    sendMessage: async (messageData) => {
        const response = await api.post('/client/messages', messageData);
        return response.data;
    },

    markMessageAsRead: async (messageId) => {
        const response = await api.put(`/client/messages/${messageId}/read`);
        return response.data;
    },

    // Profile
    getProfile: async () => {
        const response = await api.get('/client/profile');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/client/profile', profileData);
        return response.data;
    },

    // Billing
    getBillingHistory: async () => {
        const response = await api.get('/client/billing/history');
        return response.data;
    },

    getInvoice: async (invoiceId) => {
        const response = await api.get(`/client/billing/invoice/${invoiceId}`);
        return response.data;
    }
};

export default clientService; 