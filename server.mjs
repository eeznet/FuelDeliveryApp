import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from 'mongoose';
import logger from './config/logger.mjs';
import { default as pool, testConnection } from './config/database.mjs';
import authRoutes from './routes/authRoutes.mjs';
import invoiceRoutes from './routes/invoiceRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import apiRoutes from './routes/apiRoutes.mjs';
import cors from "cors";
import connectMongoDB from './config/mongoose.mjs';
import corsMiddleware from './config/corsMiddleware.mjs';
import baseRoutes from './routes/baseRoutes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors(corsMiddleware));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Mount base routes first (includes /api/test and health check)
app.use('/api', baseRoutes);

// ✅ Mount API-specific routes
app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/user', userRoutes);
app.use('/api', apiRoutes); // 🛠️ Added this to ensure all API routes are included

// ✅ Static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Root endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Fuel Delivery API is running'
    });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// ✅ Handle unknown routes (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        requestedPath: req.originalUrl
    });
});

// ✅ Database connection
const connectDB = async () => {
    try {
        await connectMongoDB();
        await testConnection(); // Test PostgreSQL connection
    } catch (error) {
        logger.error('❌ Database connection error:', error);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

// ✅ Start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || 3000, async () => {
        console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
        await connectDB();
    });
}

export default app;
