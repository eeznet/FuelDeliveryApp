
-- First, check if admin exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'moerayblog@gmail.com') THEN
        INSERT INTO users (name, email, password, role)
        VALUES (
            'System Admin', 
            'moerayblog@gmail.com',
            '$2b$10$SZqmo63AGIwfwVSP3Ml4Le2d8EAKElvClzCWwq8XRFdf8w7YVw26C',
            'admin'
        );
        RAISE NOTICE 'Admin user created';
    ELSE
        -- Update existing admin password if needed
        UPDATE users 
        SET password = '$2b$10$SZqmo63AGIwfwVSP3Ml4Le2d8EAKElvClzCWwq8XRFdf8w7YVw26C'
        WHERE email = 'moerayblog@gmail.com';
        RAISE NOTICE 'Admin password updated';
    END IF;
END $$;