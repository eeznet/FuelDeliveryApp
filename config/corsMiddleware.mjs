import cors from "cors";
import dotenv from "dotenv";
import logger from "./logger.mjs";

dotenv.config();

const corsOptions = {
    origin: 'https://fueldeliveryapp-1.onrender.com',  // Set specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
