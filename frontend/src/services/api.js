import axios from 'axios';

const api = axios.create({
    baseURL: 'https://fuel-delivery-backend.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log('Making request:', {
            url: config.url,
            method: config.method,
            headers: config.headers
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

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('Response error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
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