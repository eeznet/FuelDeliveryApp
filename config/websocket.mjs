import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from './logger.mjs';

const connectedUsers = new Map();

export const initializeWebSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? 'https://fueldeliveryapp-1.onrender.com'
                : 'http://localhost:3001',
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                throw new Error('Authentication error');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        logger.info(`User connected: ${socket.userId}`);
        connectedUsers.set(socket.userId, socket.id);

        // Notify others that user is online
        socket.broadcast.emit('user_status', {
            userId: socket.userId,
            status: 'online'
        });

        // Join a private room for the user
        socket.join(socket.userId);

        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${socket.userId}`);
            connectedUsers.delete(socket.userId);
            
            // Notify others that user is offline
            socket.broadcast.emit('user_status', {
                userId: socket.userId,
                status: 'offline'
            });
        });

        // Handle typing status
        socket.on('typing_start', (recipientId) => {
            const recipientSocketId = connectedUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing_status', {
                    userId: socket.userId,
                    status: 'typing'
                });
            }
        });

        socket.on('typing_end', (recipientId) => {
            const recipientSocketId = connectedUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing_status', {
                    userId: socket.userId,
                    status: 'idle'
                });
            }
        });
    });

    return io;
};

export const getIO = () => {
    if (!global.io) {
        throw new Error('Socket.io not initialized');
    }
    return global.io;
};

export const getUserSocket = (userId) => {
    return connectedUsers.get(userId);
}; 