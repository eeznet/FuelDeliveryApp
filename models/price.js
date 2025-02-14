const mongoose = require('mongoose');

// Define the Price schema
const priceSchema = new mongoose.Schema(
    {
        fuelType: {
            type: String,
            enum: ['93', '95', 'diesel'],
            required: [true, 'Fuel type is required'],
            unique: true, // Ensure each fuel type has only one price entry
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be a positive number'],
        },
        previousPrices: [
            {
                price: {
                    type: Number,
                    required: [true, 'Previous price is required'],
                },
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Index for fast lookup by fuelType
priceSchema.index({ fuelType: 1 }, { unique: true });

// Middleware to restrict price updates to the owner
priceSchema.pre('save', function (next) {
    if (this.isModified('price') && !this.isOwner()) {
        return next(new Error('Only the owner can update the price.'));
    }

    if (this.isModified('price')) {
        // Store previous price before updating
        if (this.previousPrices.length >= 10) {
            this.previousPrices.shift(); // Keep only the last 10 price changes
        }
        this.previousPrices.push({ price: this.get('price'), updatedAt: new Date() });
    }

    next();
});

// Add method to check if the user is the owner
priceSchema.methods.isOwner = function () {
    // Assuming the user context is passed somehow, maybe through a session or JWT
    return this.createdBy && this.createdBy.role === 'owner';
};

// Static method to get the latest price of a fuel type
priceSchema.statics.getLatestPrice = async function (fuelType) {
    const priceEntry = await this.findOne({ fuelType }).select('price').lean();
    return priceEntry ? priceEntry.price : null; // Return price or null if not found
};

// Create and export the Price model
const Price = mongoose.model('Price', priceSchema);
module.exports = Price;
