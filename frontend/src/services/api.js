import axios from 'axios';

const API_URL = import.meta.env.PROD 
    ? 'https://fueldeliverywebapp.onrender.com/api'
    : 'http://localhost:3000/api';

console.log('API URL:', API_URL); // Debug log

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log('Making request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('Response:', response.data);
        return response.data;
    },
    (error) => {
        console.error('Response error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
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
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout')
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