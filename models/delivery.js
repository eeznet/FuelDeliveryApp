const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fuelType: {
        type: String,
        enum: ['93', '95', 'diesel'],
        required: true
    },
    amount: {
        type: Number, // Liters
        required: true
    },
    price: {
        type: Number, // Price based on fuel type and amount
        required: true
    },
    address: {
        type: String,
        required: true
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
    }
}, { timestamps: true });

// Indexes for better query performance
deliverySchema.index({ driverId: 1 });
deliverySchema.index({ clientId: 1 });
deliverySchema.index({ deliveryDate: 1 });

const Delivery = mongoose.model('Delivery', deliverySchema);
module.exports = Delivery;
