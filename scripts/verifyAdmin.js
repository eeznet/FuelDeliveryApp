import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const verifyAdmin = async () => {
    const verifyPool = new pg.Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const result = await verifyPool.query(
            'SELECT id, name, email, role FROM users WHERE email = $1',
            ['moerayblog@gmail.com']
        );

        if (result.rows.length > 0) {
            console.log('Admin user verified:', result.rows[0]);
        } else {
            console.log('Admin user not found');
        }
    } catch (error) {
        console.error('Verification error:', error);
    } finally {
        await verifyPool.end();
    }
};

verifyAdmin().catch(error => {
    console.error('Uncaught error:', error);
    process.exit(1);
}); 