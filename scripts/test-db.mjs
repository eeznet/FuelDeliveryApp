import { testConnection } from '../config/database.mjs';
import connectMongoDB from '../config/mongoose.mjs';
import logger from '../config/logger.mjs';

async function testDatabases() {
    try {
        // Test PostgreSQL
        logger.info('Testing PostgreSQL connection...');
        const pgConnected = await testConnection();
        
        // Test MongoDB
        logger.info('Testing MongoDB connection...');
        await connectMongoDB();
        
        if (pgConnected) {
            logger.info('✅ All database connections successful');
            process.exit(0);
        } else {
            logger.error('❌ PostgreSQL connection failed');
            process.exit(1);
        }
    } catch (error) {
        logger.error('❌ Database test failed:', error);
        process.exit(1);
    }
}

testDatabases(); 