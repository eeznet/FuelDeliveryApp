import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define the user schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures no duplicate emails
            lowercase: true,
            trim: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please provide a valid email address",
            ],
        },
        role: {
            type: String,
            required: true,
            enum: ["owner", "driver", "client", "admin"], // Role restrictions
        },
        password: {
            type: String,
            required: true,
            minlength: 8, // Ensure password is at least 8 characters
            select: false
        },
        balance: {
            type: Number,
            default: 0,
            min: 0, // Prevents negative balances
        },
        isActive: {
            type: Boolean,
            default: true  // Set default to true
        }
    },
    { timestamps: true }
);

// Indexing for performance (especially for queries with email and role)
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Check password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) {
        throw new Error('Password not found');
    }
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate token method
userSchema.methods.generateToken = function() {
    const secret = process.env.JWT_SECRET || 'test-secret';
    return jwt.sign(
        { 
            id: this._id,
            email: this.email,
            role: this.role 
        },
        secret,
        { expiresIn: '1h' }
    );
};

// Role-based access control helper
userSchema.methods.hasRole = function(role) {
    return this.role === role;
};

// Virtual property to check if the user is an admin
userSchema.virtual('isAdmin').get(function() {
    return this.role === 'admin';
});

// Create and export the User model
const User = mongoose.model("User", userSchema);
export default User; // Correct ESM export
