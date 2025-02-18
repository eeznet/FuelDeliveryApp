import api from './apiService';
import { endpoints } from '../config/api';

export const invoiceService = {
    getClientInvoices: async () => {
        try {
            return await api.get(endpoints.invoice.client);
        } catch (error) {
            throw error;
        }
    },

    // Add other invoice-related methods
}; 