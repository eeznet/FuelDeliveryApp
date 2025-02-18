import api from './apiService';
import { endpoints } from '../config/api';

export const financeService = {
    // Invoice Management
    getInvoicesByStatus: async (status) => {
        try {
            return await api.get(endpoints.finance.invoices[status]);
        } catch (error) {
            throw error;
        }
    },

    // Financial Reports
    generateFinancialReport: async (reportType, timeframe) => {
        try {
            return await api.get(`${endpoints.finance.reports[reportType]}`, {
                params: { timeframe }
            });
        } catch (error) {
            throw error;
        }
    },

    // Credit Management
    updateClientCreditLimit: async (clientId, limit) => {
        try {
            return await api.put(`${endpoints.finance.creditLimits}/${clientId}`, {
                limit
            });
        } catch (error) {
            throw error;
        }
    },

    // Accounting Integration
    syncWithAccounting: async () => {
        try {
            return await api.post(endpoints.finance.accounting + '/sync');
        } catch (error) {
            throw error;
        }
    }
}; 