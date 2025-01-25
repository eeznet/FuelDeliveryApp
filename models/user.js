const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // This already creates the index for `email`
            lowercase: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                'Please provide a valid email address',
            ],
        },
        role: {
            type: String,
            required: true,
            enum: ['owner', 'driver', 'client', 'admin'], // Admin role included
        },
        password: {
            type: String,
            required: true,
            minlength: 6, // Minimum password length for security
        },
        balance: {
            type: Number,
            default: 0, // Default balance for client accounts
        },
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Remove the redundant manual index on email
// userSchema.index({ email: 1 }); // No need for this, `unique: true` already creates the index

// Index for querying by role (this is fine to leave)
userSchema.index({ role: 1 });  

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
