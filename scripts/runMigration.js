import pg from 'pg';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const runMigration = async () => {
    // Create a new pool specifically for migration with SSL
    const migrationPool = new pg.Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false // Required for Render's self-signed certificate
        }
    });

    try {
        const sql = await readFile('migrations/001_init_admin.sql', 'utf-8');
        await migrationPool.query(sql);
        console.log('Admin user migration completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        // End this pool only
        await migrationPool.end();
    }
};

// Run migration and handle any uncaught errors
runMigration().catch(error => {
    console.error('Uncaught error:', error);
    process.exit(1);
}); 