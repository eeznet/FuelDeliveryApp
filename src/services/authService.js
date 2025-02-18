import api from './apiService';
import { endpoints } from '../config/api';

export const authService = {
    register: async (userData) => {
        try {
            const response = await api.post(endpoints.auth.register, userData);
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post(endpoints.auth.login, credentials);
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
}; 