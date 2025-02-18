import api from './apiService';
import { endpoints } from '../config/api';

export const userService = {
    getCurrentUser: async () => {
        try {
            return await api.get(endpoints.auth.me);
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (userData) => {
        try {
            return await api.put(endpoints.user.profile, userData);
        } catch (error) {
            throw error;
        }
    }
}; 