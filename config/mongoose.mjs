import mongoose from "mongoose";
import logger from './logger.mjs';

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        logger.info('✅ MongoDB Connected');
    } catch (error) {
        logger.error('❌ MongoDB Connection Error:', error);
        throw error;
    }
};

export default connectMongoDB; 