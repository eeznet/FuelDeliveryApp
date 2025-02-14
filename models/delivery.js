import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    fuelType: {
        type: String,
        enum: ['93', '95', 'diesel'],
        required: true
    },
    amount: {
        type: Number, // Liters
        required: true,
        min: [1, 'Amount must be at least 1 liter']
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    statusUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Who updated the status
        default: null
    },
    statusChangedAt: {
        type: Date,
        default: null
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Cancelled'],
            required: true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reason: {
            type: String,
            trim: true
        },
        changedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

// Indexes for performance
deliverySchema.index({ driverId: 1 });
deliverySchema.index({ clientId: 1 });
deliverySchema.index({ deliveryDate: 1 });
deliverySchema.index({ status: 1, deliveryDate: 1 });
deliverySchema.index({ fuelType: 1 }); // Added index for potential analytics

// Virtual property to calculate price dynamically
deliverySchema.virtual('calculatedPrice').get(function() {
    const fuelPrices = {
        '93': 1.2,
        '95': 1.4,
        'diesel': 1.3
    };

    return this.amount * (fuelPrices[this.fuelType] || 0);
});

// Auto-update `statusChangedAt` when status changes
deliverySchema.pre('save', function(next) {
    if (this.isModified('status')) {
        this.statusChangedAt = new Date();
    }
    next();
});

// Ensure virtuals are included in JSON output
deliverySchema.set('toObject', { virtuals: true });
deliverySchema.set('toJSON', { virtuals: true });

// Ensure sensitive fields are not exposed in API responses
deliverySchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v; // Exclude version key
        // Optionally, we can delete other sensitive data here in future, if needed
    }
});

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;
