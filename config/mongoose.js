import mongoose from 'mongoose';
import logger from './logger.js';

export const connectMongoDB = async () => {
    try {
        const uri = process.env.NODE_ENV === 'test' 
            ? process.env.TEST_MONGO_URI 
            : process.env.MONGO_URI;

        if (!uri) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }

        await mongoose.connect(uri, {
            autoIndex: true
        });
        
        logger.info('✅ MongoDB Connected');
    } catch (error) {
        logger.error('❌ MongoDB Connection Error:', error);
        throw error;
    }
};

export const disconnectMongoDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info('✅ MongoDB Disconnected');
    } catch (error) {
        logger.error('❌ MongoDB Disconnection Error:', error);
        throw error;
    }
};
