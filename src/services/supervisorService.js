import api from './apiService';
import { endpoints } from '../config/api';

export const supervisorService = {
    // Driver Management
    getAssignedDrivers: async () => {
        try {
            return await api.get(endpoints.supervisor.drivers);
        } catch (error) {
            throw error;
        }
    },

    // Schedule Management
    updateDeliverySchedule: async (scheduleData) => {
        try {
            return await api.put(endpoints.supervisor.schedule, scheduleData);
        } catch (error) {
            throw error;
        }
    },

    // Emergency Handling
    reportEmergency: async (emergencyData) => {
        try {
            return await api.post(endpoints.supervisor.emergencies, emergencyData);
        } catch (error) {
            throw error;
        }
    },

    // Performance Monitoring
    getDriverPerformance: async (driverId) => {
        try {
            return await api.get(`${endpoints.supervisor.reports}/driver/${driverId}`);
        } catch (error) {
            throw error;
        }
    },

    // Real-time Fleet Monitoring
    getFleetStatus: async () => {
        try {
            return await api.get(endpoints.supervisor.fleet);
        } catch (error) {
            throw error;
        }
    },

    // Route Optimization
    optimizeRoutes: async (deliveryData) => {
        try {
            return await api.post(endpoints.supervisor.routes + '/optimize', deliveryData);
        } catch (error) {
            throw error;
        }
    },

    // Incident Reporting
    reportIncident: async (incidentData) => {
        try {
            return await api.post(endpoints.supervisor.incidents, incidentData);
        } catch (error) {
            throw error;
        }
    },

    // Weather Alerts
    getWeatherAlerts: async (region) => {
        try {
            return await api.get(`${endpoints.supervisor.weather}/${region}`);
        } catch (error) {
            throw error;
        }
    }
}; 