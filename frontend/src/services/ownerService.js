import api from '../config/axios';

export const ownerService = {
    // Dashboard Data
    getDashboardData: async () => {
        const response = await api.get('/owner/dashboard');
        return response.data;
    },

    // Financial
    getFinancialOverview: async (period = 'monthly') => {
        const response = await api.get(`/owner/financial?period=${period}`);
        return response.data;
    },

    // Analytics
    getBusinessAnalytics: async () => {
        const response = await api.get('/owner/analytics');
        return response.data;
    },

    // Employee Management
    getEmployees: async () => {
        const response = await api.get('/owner/employees');
        return response.data;
    },

    addEmployee: async (employeeData) => {
        const response = await api.post('/owner/employees', employeeData);
        return response.data;
    },

    updateEmployee: async (id, employeeData) => {
        const response = await api.put(`/owner/employees/${id}`, employeeData);
        return response.data;
    },

    deleteEmployee: async (id) => {
        const response = await api.delete(`/owner/employees/${id}`);
        return response.data;
    },

    // Settings
    getSettings: async () => {
        const response = await api.get('/owner/settings');
        return response.data;
    },

    updateSettings: async (settings) => {
        const response = await api.put('/owner/settings', settings);
        return response.data;
    },

    // Messages
    getMessages: async () => {
        const response = await api.get('/owner/messages');
        return response.data;
    },

    sendMessage: async (message) => {
        const response = await api.post('/owner/messages', message);
        return response.data;
    }
};

export default ownerService; 