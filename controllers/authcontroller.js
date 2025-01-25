// controllers/authcontroller.js
const User = require('../models/user'); // Ensure the correct model path
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Constants for roles
const VALID_ROLES = ['owner', 'driver', 'client', 'admin'];

// Register a new user
exports.registerUser = async (req, res) => {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
        return res.status(400).json({ success: false, message: 'Email, password, and role are required' });
    }

    // Validate role
    if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role provided' });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Ensure only one admin can be created
        if (role === 'admin' && email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: 'You are not authorized to create an admin account' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();

        // Generate a JWT
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { id: newUser._id, email: newUser.email, role: newUser.role },
            token,
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        // Generate a JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { id: user._id, email: user.email, role: user.role },
            token,
        });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
    }
};
