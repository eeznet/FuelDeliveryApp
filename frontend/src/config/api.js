const API_BASE_URL = import.meta.env.PROD 
    ? 'https://fueldeliverywebapp.onrender.com/api'
    : 'http://localhost:3000/api';
const WS_URL = import.meta.env.VITE_WS_URL;

if (!API_BASE_URL) {
    console.error('VITE_API_URL environment variable is not set');
}

export const endpoints = {
    auth: {
        register: `${API_BASE_URL}/auth/register`,
        login: `${API_BASE_URL}/auth/login`,
        me: `${API_BASE_URL}/auth/me`,
    },
    // ... rest of endpoints
};

export const apiConfig = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout: 10000
};

export const wsConfig = {
    url: WS_URL,
    options: {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    }
};

// Add these to the existing endpoints object
chat: {
    contacts: `${API_BASE_URL}/chat/contacts`,
    history: `${API_BASE_URL}/chat/history`,
    send: `${API_BASE_URL}/chat/send`,
    markRead: `${API_BASE_URL}/chat/mark-read`
}, 