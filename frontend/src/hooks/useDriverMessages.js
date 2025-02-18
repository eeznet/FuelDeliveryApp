import { useState, useEffect, useCallback } from 'react';
import driverService from '../services/driverService';
import { useWebSocket } from './useWebSocket';

export const useDriverMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socket = useWebSocket();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const data = await driverService.getMessages();
                setMessages(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        if (socket) {
            socket.on('new_message', (message) => {
                setMessages(prev => [...prev, message]);
            });
        }

        return () => {
            if (socket) {
                socket.off('new_message');
            }
        };
    }, [socket]);

    const sendMessage = useCallback(async (messageData) => {
        try {
            const newMessage = await driverService.sendMessage(messageData);
            setMessages(prev => [...prev, newMessage]);
            return newMessage;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const markAsRead = useCallback(async (messageId) => {
        try {
            await driverService.markMessageAsRead(messageId);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId ? { ...msg, read: true } : msg
                )
            );
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        messages,
        loading,
        error,
        sendMessage,
        markAsRead
    };
}; 