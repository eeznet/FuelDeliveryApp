import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import logger from "../config/logger.js";

// Register user
export const register = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, password, role } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const result = await client.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );
    
    const user = result.rows[0];
    logger.info(`User registered successfully: ${email}`);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  } finally {
    client.release();
  }
};

// Login user
export const login = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password } = req.body;
    
    // Add detailed logging
    console.log('Login attempt:', { email });
    
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token with role
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('Login successful:', { email, role: user.role });
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    // Since we're using JWT, we just need to tell the client to remove the token
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

export default {
  register,
  login,
  logout
};
