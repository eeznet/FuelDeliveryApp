import api from './apiService';
import { endpoints } from '../config/api';

export const ownerService = {
    // User Management
    getAllUsers: async () => {
        try {
            return await api.get(endpoints.owner.users);
        } catch (error) {
            throw error;
        }
    },

    updateUserRole: async (userId, role) => {
        try {
            return await api.put(`${endpoints.owner.users}/${userId}/role`, { role });
        } catch (error) {
            throw error;
        }
    },

    // System Settings
    updateSystemSettings: async (settings) => {
        try {
            return await api.put(endpoints.owner.settings, settings);
        } catch (error) {
            throw error;
        }
    },

    // Analytics
    getSystemAnalytics: async () => {
        try {
            return await api.get(endpoints.owner.analytics);
        } catch (error) {
            throw error;
        }
    },

    // Pricing Management
    updateFuelPrices: async (prices) => {
        try {
            return await api.put(endpoints.owner.pricing, prices);
        } catch (error) {
            throw error;
        }
    },

    // Inventory Management
    getInventoryStatus: async () => {
        try {
            return await api.get(endpoints.owner.inventory);
        } catch (error) {
            throw error;
        }
    },

    // Analytics & Reports
    getCustomerTrends: async (customerId, timeframe) => {
        try {
            return await api.get(`${endpoints.owner.reports.trends}/${customerId}`, {
                params: { timeframe }
            });
        } catch (error) {
            throw error;
        }
    },

    // Real-time Tracking
    getActiveDeliveries: async () => {
        try {
            return await api.get(endpoints.owner.tracking);
        } catch (error) {
            throw error;
        }
    },

    // Invoice Management
    getOutstandingInvoices: async () => {
        try {
            return await api.get(endpoints.owner.invoices.outstanding);
        } catch (error) {
            throw error;
        }
    },

    // Messaging
    getClientMessages: async () => {
        try {
            return await api.get(endpoints.owner.messages);
        } catch (error) {
            throw error;
        }
    },

    respondToMessage: async (messageId, response) => {
        try {
            return await api.post(`${endpoints.owner.messages}/${messageId}/reply`, {
                response
            });
        } catch (error) {
            throw error;
        }
    }
}; 