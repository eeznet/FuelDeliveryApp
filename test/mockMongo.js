import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

global.mongoServer = null;

const startMongoServer = async () => {
  try {
    if (global.mongoServer) {
      console.log('✅ In-memory MongoDB is already running.');
      return;
    }

    // Create an in-memory MongoDB server
    global.mongoServer = await MongoMemoryServer.create();
    const mongoUri = global.mongoServer.getUri();

    // Prevent multiple connections
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
      console.log('✅ In-memory MongoDB started successfully');
    }
  } catch (error) {
    console.error('❌ Error starting MongoDB server:', error.message);
    throw error;
  }
};

const stopMongoServer = async () => {
  try {
    if (!global.mongoServer) {
      console.log('⚠️ MongoDB server is not running.');
      return;
    }

    if (mongoose.connection.readyState) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
    }

    // Stop the in-memory MongoDB server
    await global.mongoServer.stop();
    global.mongoServer = null;
    console.log('✅ In-memory MongoDB stopped successfully');
  } catch (error) {
    console.error('❌ Error stopping MongoDB server:', error.message);
    throw error;
  }
};

// Graceful error handling for uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  await stopMongoServer();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
  await stopMongoServer();
  process.exit(1);
});

export { startMongoServer, stopMongoServer };
