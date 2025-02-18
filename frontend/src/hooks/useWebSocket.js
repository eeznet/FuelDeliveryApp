import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

export const useWebSocket = () => {
    const { token } = useAuth();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        // Initialize socket connection
        socketRef.current = io(import.meta.env.VITE_API_URL, {
            auth: {
                token
            }
        });

        // Connection error handling
        socketRef.current.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [token]);

    return socketRef.current;
}; 