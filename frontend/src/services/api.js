import axios from 'axios';

// Update the API URL configuration
const API_URL = import.meta.env.PROD 
    ? 'https://fuel-delivery-backend.onrender.com/api'
    : 'http://localhost:3000/api';

console.log('API URL Configuration:', {
    env: import.meta.env.MODE,
    url: API_URL
});

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
    console.log('Making request:', {
        url: request.url,
        method: request.method,
        headers: request.headers
    });
    return request;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

// Add token management
const getStoredToken = () => localStorage.getItem('token');

// Update request interceptor
api.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Ensure CORS headers
        config.headers['Origin'] = window.location.origin;
        
        console.log('Making request:', {
            fullUrl: `${config.baseURL}${config.url}`,
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

// Response interceptor with better error handling
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            status: response.status,
            data: response.data
        });
        return response.data;
    },
    (error) => {
        console.error('Response error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                baseURL: error.config?.baseURL
            }
        });
        return Promise.reject(error.response?.data || error);
    }
);

// Export API endpoints
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