import axios from 'axios';

const BASE_URL = 'https://fuel-delivery-backend.onrender.com/api';

console.log('API Base URL:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false,
    timeout: 10000 // Add timeout
});

// Simplified request interceptor
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

// Simplified response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server responded with error
            console.error('Server error:', error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network error - no response');
            return Promise.reject({ message: 'Network error - please try again' });
        } else {
            // Request setup failed
            console.error('Request failed:', error.message);
            return Promise.reject({ message: 'Request failed - please try again' });
        }
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
    login: async (credentials) => {
        try {
            console.log('Attempting login with:', credentials);
            const response = await api.post('/auth/login', credentials);
            console.log('Login response:', response);
            return response;
        } catch (error) {
            console.error('Login error:', error);
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

export default api; 