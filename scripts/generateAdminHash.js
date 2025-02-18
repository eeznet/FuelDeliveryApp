import bcrypt from 'bcrypt';
import { writeFile } from 'fs/promises';

const generateHash = async () => {
    try {
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log('Admin password hash:', hash);

        // Create SQL with the hash
        const sql = `
-- First, check if admin exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'moerayblog@gmail.com') THEN
        INSERT INTO users (name, email, password, role)
        VALUES (
            'System Admin', 
            'moerayblog@gmail.com',
            '${hash}',
            'admin'
        );
        RAISE NOTICE 'Admin user created';
    ELSE
        -- Update existing admin password if needed
        UPDATE users 
        SET password = '${hash}'
        WHERE email = 'moerayblog@gmail.com';
        RAISE NOTICE 'Admin password updated';
    END IF;
END $$;`;

        // Save the SQL to the migrations file
        await writeFile('migrations/001_init_admin.sql', sql);
        console.log('SQL file updated with new hash');
    } catch (error) {
        console.error('Error:', error);
    }
};

generateHash(); 