const API_BASE_URL = import.meta.env.PROD 
    ? 'https://fueldeliverywebapp.onrender.com/api'
    : 'http://localhost:3000/api';

export const endpoints = {
    auth: {
        register: `${API_BASE_URL}/auth/register`,
        login: `${API_BASE_URL}/auth/login`,
        me: `${API_BASE_URL}/auth/me`,
    },
    owner: {
        pricing: `${API_BASE_URL}/owner/pricing`,
        inventory: `${API_BASE_URL}/owner/inventory`,
        analytics: `${API_BASE_URL}/owner/analytics`,
        tracking: `${API_BASE_URL}/owner/tracking`,
        messages: `${API_BASE_URL}/owner/messages`,
        invoices: {
            all: `${API_BASE_URL}/owner/invoices`,
            outstanding: `${API_BASE_URL}/owner/invoices/outstanding`,
            past: `${API_BASE_URL}/owner/invoices/past`,
        },
        reports: {
            trends: `${API_BASE_URL}/owner/reports/trends`,
            deliveries: `${API_BASE_URL}/owner/reports/deliveries`,
        }
    },
    driver: {
        deliveries: `${API_BASE_URL}/driver/deliveries`,
        location: `${API_BASE_URL}/driver/location`,
        route: `${API_BASE_URL}/driver/route`,
        inventory: `${API_BASE_URL}/driver/inventory`,
        tracking: `${API_BASE_URL}/driver/tracking`
    },
    client: {
        invoices: `${API_BASE_URL}/client/invoices`,
        deliveries: `${API_BASE_URL}/client/deliveries`,
        messages: `${API_BASE_URL}/client/messages`,
        acknowledgment: `${API_BASE_URL}/client/acknowledgment`
    },
    supervisor: {
        dashboard: `${API_BASE_URL}/supervisor/dashboard`,
        drivers: `${API_BASE_URL}/supervisor/drivers`,
        schedule: `${API_BASE_URL}/supervisor/schedule`,
        emergencies: `${API_BASE_URL}/supervisor/emergencies`,
        reports: `${API_BASE_URL}/supervisor/reports`,
    },
    finance: {
        dashboard: `${API_BASE_URL}/finance/dashboard`,
        invoices: {
            all: `${API_BASE_URL}/finance/invoices`,
            pending: `${API_BASE_URL}/finance/invoices/pending`,
            paid: `${API_BASE_URL}/finance/invoices/paid`,
            overdue: `${API_BASE_URL}/finance/invoices/overdue`
        },
        reports: {
            revenue: `${API_BASE_URL}/finance/reports/revenue`,
            expenses: `${API_BASE_URL}/finance/reports/expenses`,
            profit: `${API_BASE_URL}/finance/reports/profit`
        },
        creditLimits: `${API_BASE_URL}/finance/credit-limits`,
        accounting: `${API_BASE_URL}/finance/accounting`
    }
};

export const apiConfig = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
}; 