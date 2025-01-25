const express = require('express');
const mysql = require('mysql2/promise');
const expressWinston = require('express-winston');
const winston = require('winston');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set the port
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

// Logging middleware with Winston
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
    level: 'info',
    meta: true,
  })
);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// MySQL connection using a pool
let mysqlPool;
const connectMySQL = async () => {
  try {
    mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'password123',
      database: process.env.MYSQL_DATABASE || 'fuel_delivery_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('MySQL connected successfully');
  } catch (err) {
    console.error('MySQL connection error:', err);
    setTimeout(connectMySQL, 5000); // Retry connection after 5 seconds
  }
};

connectMySQL();

// Import routes
const apiroutes = require('./routes/apiroutes');
const ownerroutes = require('./routes/ownerroutes');
const driverroutes = require('./routes/driverroutes');
const authroutes = require('./routes/authroutes');
let priceroutes;

// Load `priceroutes` if the file exists
try {
  priceroutes = require('./routes/priceroutes');
  app.use('/prices', priceroutes);
} catch (error) {
  console.warn('Warning: priceroutes file not found. Skipping /prices routes.');
}

// Route handling
app.use('/auth', authroutes);
app.use('/owner', ownerroutes);
app.use('/driver', driverroutes);
app.use('/api', apiroutes);

// Real-time location updates using Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected to Socket.IO');

  // Emit mock truck location data
  socket.emit('truck-location-update', { lat: 35.6895, lng: 139.6917 });

  socket.on('disconnect', () => {
    console.log('A user disconnected from Socket.IO');
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token. Authorization denied.' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Error logging middleware
app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  })
);

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');

    // Close MySQL connection
    if (mysqlPool) {
      mysqlPool.end().then(() => console.log('MySQL pool closed.'));
    } else {
      console.warn('MySQL pool was already closed.');
    }
  });

  // Close MongoDB connection
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }

  process.exit(0); // Exit process once everything is closed
};

// Ensure shutdown only happens when process is interrupted
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
