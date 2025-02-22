import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import logger from "./config/logger.mjs";
import { default as pool, testConnection } from "./config/database.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import invoiceRoutes from "./routes/invoiceRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import apiRoutes from "./routes/apiRoutes.mjs";
import corsMiddleware from "./config/corsMiddleware.mjs";
import connectMongoDB from "./config/mongoose.mjs";
import baseRoutes from "./routes/baseRoutes.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// ✅ Apply CORS Middleware
app.use(corsMiddleware);
app.options("*", corsMiddleware); // ✅ Ensure preflight requests are handled

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Static Files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Base Routes (Health Check)
app.use("/api", baseRoutes);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/user", userRoutes);
app.use("/api", apiRoutes);

// ✅ Root Endpoint (Add CORS Headers)
app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.json({
    status: "ok",
    message: "Fuel Delivery API is running",
  });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  logger.error("❌ Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ✅ Handle Unknown Routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedPath: req.originalUrl,
  });
});

// ✅ Database Connection
const connectDB = async () => {
  try {
    await connectMongoDB();
    await testConnection();
    logger.info("✅ Database connections established successfully.");
  } catch (error) {
    logger.error("❌ Database connection error:", error);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

// ✅ Start Server
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await connectDB();
  });
}

export default app;
