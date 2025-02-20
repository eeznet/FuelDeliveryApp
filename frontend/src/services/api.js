import axios from 'axios';
import { apiConfig } from '../config/api';

// Debug: Log the API configuration
console.log('API Config:', apiConfig);

const api = axios.create({
    ...apiConfig,
    // Force specific headers for debugging
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor with detailed logging
api.interceptors.request.use(
    (config) => {
        console.log('Making request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor with detailed error logging
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response.data;
    },
    (error) => {
        console.error('Response error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
            config: error.config
        });
        return Promise.reject(error.response?.data || error);
    }
);

// Add axios retry logic
api.interceptors.response.use(null, async (error) => {
    if (error.config && error.response && error.response.status === 0) {
        // Retry the request once
        try {
            console.log('Retrying failed request...');
            return await axios.request(error.config);
        } catch (retryError) {
            return Promise.reject(retryError);
        }
    }
    return Promise.reject(error);
});

// Export the configured API instance
export default api;

// Auth endpoints with detailed error handling
export const auth = {
    login: async (credentials) => {
        try {
            console.log('Login attempt:', credentials);
            const response = await api.post('/auth/login', credentials);
            console.log('Login response:', response);
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/me')
};

export const user = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data)
};

export const orders = {
    create: (orderData) => api.post('/invoice', orderData),
    getClientOrders: () => api.get('/invoice/client'),
    getDriverDeliveries: () => api.get('/deliveries/driver'),
    updateDeliveryStatus: (id, status) => api.put(`/deliveries/${id}/status`, { status })
};

export const admin = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data)
};

export const owner = {
    getStats: () => api.get('/owner/stats'),
    updatePrice: (price) => api.post('/price', { pricePerLiter: price })
}; 