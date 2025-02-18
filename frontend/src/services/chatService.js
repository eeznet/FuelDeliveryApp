import api from './apiService';
import { endpoints } from '../config/api';

export const chatService = {
    // Get all chat contacts (owner/supervisor/finance)
    getContacts: async () => {
        try {
            const response = await api.get(endpoints.chat.contacts);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get chat history with a specific contact
    getChatHistory: async (contactId) => {
        try {
            const response = await api.get(`${endpoints.chat.history}/${contactId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Send a new message
    sendMessage: async (message) => {
        try {
            const response = await api.post(endpoints.chat.send, message);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Mark messages as read
    markAsRead: async (contactId) => {
        try {
            const response = await api.put(`${endpoints.chat.markRead}/${contactId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 