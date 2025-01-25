const mongoose = require('mongoose');

// Define the Price schema
const priceSchema = new mongoose.Schema({
    fuelType: { 
        type: String, 
        enum: ['93', '95', 'diesel'], 
        required: true, 
        unique: true // Ensure each fuel type has only one price entry
    },
    price: {
        type: Number, 
        required: true,
        min: [0, 'Price must be a positive number'], // Validate price to be positive
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
    previousPrices: [
        {
            price: { type: Number, required: true },
            updatedAt: { type: Date, default: Date.now }
        }
    ]
});

// Middleware to track price updates and store previous prices
priceSchema.pre('save', function(next) {
    if (this.isModified('price')) {
        // Store previous price before updating
        this.previousPrices.push({ price: this.price, updatedAt: Date.now() });
        this.updatedAt = Date.now();
    }
    next();
});

// Create and export the Price model
const Price = mongoose.model('Price', priceSchema);
module.exports = Price;
