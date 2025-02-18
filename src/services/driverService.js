import api from './apiService';
import { endpoints } from '../config/api';

export const driverService = {
    // Delivery Management
    getAssignedDeliveries: async () => {
        try {
            return await api.get(endpoints.driver.deliveries);
        } catch (error) {
            throw error;
        }
    },

    updateDeliveryStatus: async (deliveryId, status) => {
        try {
            return await api.put(`${endpoints.driver.deliveries}/${deliveryId}/status`, { status });
        } catch (error) {
            throw error;
        }
    },

    // Location Updates
    updateLocation: async (location) => {
        try {
            return await api.post(endpoints.driver.location, location);
        } catch (error) {
            throw error;
        }
    },

    // Route Management
    getOptimizedRoute: async (deliveries) => {
        try {
            return await api.post(endpoints.driver.route, { deliveries });
        } catch (error) {
            throw error;
        }
    }
}; 