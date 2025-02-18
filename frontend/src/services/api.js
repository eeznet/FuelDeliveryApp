import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Update interceptor to always include credentials
api.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        return Promise.reject(error);
    }
);

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