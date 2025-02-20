import axios from 'axios';
import { apiConfig } from '../config/api';

const api = axios.create(apiConfig);

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
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

export const auth = {
    login: (credentials) => api.post('/auth/login', credentials),
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

export default api; 