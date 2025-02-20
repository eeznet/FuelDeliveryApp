import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from './logger.mjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://eeznetsolutions:Yp3mmebgxnQHA6XG@fueldelapp.iaiqh.mongodb.net/fuelDeliveryApp?retryWrites=true&w=majority';

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        });
        logger.info("✅ MongoDB Connected");
    } catch (error) {
        logger.error("❌ MongoDB Connection Error:", error);
        // Don't exit in production
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

export default connectMongoDB; 